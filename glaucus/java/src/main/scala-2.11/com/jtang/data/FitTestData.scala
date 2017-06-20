package com.jtang.data


import java.util

import com.jtang.SparkConnect
import com.jtang.dao._
import com.jtang.entity.{Config, Model}
import org.apache.spark.ml.{Pipeline, PipelineModel}

import org.apache.spark.ml.feature.{StringIndexer, StringIndexerModel, VectorIndexer}
import org.apache.spark.sql.{DataFrame, SaveMode}
import org.apache.spark.sql.types.StringType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import scala.collection.JavaConverters._

/**
  * Created by twb on 2017/5/3.
  */
@Component
class FitTestData extends SparkConnect{

  @Autowired
  val fileLocDao: FileInfoDao = null

  @Autowired
  val hdfsDao: HdfsDao = null

  @Autowired
  val modelDao: ModelDao = null
  @Autowired
  val configDao: ConfigDao = null

  @Autowired
  val headerInfoDao: HeaderInfoDao = null


  @throws(classOf[Exception])
  def transformData(fileId: String, modelId: String): util.List[util.Map[String, String]] = {

    val fileLocs = fileLocDao.findById(fileId)
    println(fileLocs)
    val filepath = fileLocs.getLocation
    val filename = fileLocs.getFilename

    log.info("file loc: " + filepath)


    val model: Model = modelDao.findById(modelId)
    val config: Config = configDao.findById(model.getConfigId)

    val fieldsId = config.getFieldIds//.listIterator()

    val iter = fieldsId.listIterator()
    //println(fieldsId(0))

    //val keyFeature = fieldsId.remove(fieldsId.size() - 1)
    val fieldNames: Array[String] =  new Array[String](fieldsId.size()-1)

    val keyFeature = headerInfoDao.findById(fieldsId.get(fieldsId.size()-1)).getFieldName
    var i: Int = 0
    var flag = false
    while(iter.hasNext && flag==false){

      fieldNames(i) = headerInfoDao.findById(iter.next()).getFieldName
      println(fieldNames(i))
      i = i+1
      if(i>=fieldsId.size()-1)
        flag = true
    }

    val spark = sparkSession

    import spark.implicits._
    val parquetFile = sparkSession.read.parquet(filepath)

//    parquetFile.select()
    val featuresDF = parquetFile.select(keyFeature, fieldNames: _*).persist()
    featuresDF.schema.foreach(println)

    val strFeatures = featuresDF.schema.filter(_.dataType.equals(StringType)).map(_.name)


    val notNullFeatureDF = featuresDF.na.fill("NA", strFeatures)


    val indexers = strFeatures.map(field => {
      new StringIndexer()
        .setInputCol(field)
        .setOutputCol(field+"_index")
        .fit(notNullFeatureDF)
    })

    //transform String to Indexer
    var tmpDF:DataFrame = null
    if (indexers.nonEmpty) {
      println("Indexers: " + indexers.size)
      val pipeline = new Pipeline().setStages(indexers.toArray[StringIndexerModel])
      println("Pipeline: " + pipeline.getStages.length)
      tmpDF = pipeline.fit(notNullFeatureDF).transform(notNullFeatureDF)
    } else {
      tmpDF = notNullFeatureDF
    }
    tmpDF.show()

    val transformDF = tmpDF.drop(strFeatures: _*)
    val keyFeatureIdx  = if(strFeatures.nonEmpty && strFeatures.head.equals(keyFeature)) transformDF.columns.length - strFeatures.size else 0


    val labeledData = transformDF.collect().map(row => {
      val seq = row.toSeq
      val key = seq(keyFeatureIdx)
      val tmp = seq.splitAt(keyFeatureIdx)
      val tail = tmp._1 ++ tmp._2.tail
      val features = tail.zipWithIndex.map(pair =>
        if (pair._1 == null) null else (pair._2 + 1) + ":" + pair._1).filter(_ != null)
      if (key == null) null else key + " " + features.mkString(" ")
    }).filter(_ != null)

    val tmpFileLoc = hdfsServer + config.getId + "_ver2.libsvm"

    //hdfsDao.deleteFileInHdfs(tmpFileLoc, true)
    val labeledDS = sparkSession.createDataset(labeledData)

    labeledDS.repartition(1).write.mode(SaveMode.Overwrite).text(tmpFileLoc)

    log.info("Write to the file: " + tmpFileLoc)

    // Load the data stored in LIBSVM format as a DataFrame.
    val data = sparkSession.read.format("libsvm").load(tmpFileLoc)
    // Index labels, adding metadata to the label column.
    // Fit on whole dataset to include all labels in index.


    //val modelPath = hdfsServer + "_" + modelId + ".model"
    val modelPath = model.getModelPath

    val model1 = PipelineModel.load(modelPath)
    val prections = model1.transform(data)

    prections.show()

    val results = prections.select("predictedLabel")
    val columns = keyFeature
    val res = results.collect().map(row => {
      row.toSeq.zipWithIndex.map(pair => {
        (columns, pair._1.toString)
      }).toMap.asJava
    }).toList.asJava

    res
  }

}
