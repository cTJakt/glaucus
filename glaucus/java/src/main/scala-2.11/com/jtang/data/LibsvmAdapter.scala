package com.jtang.data

import java.util.Base64.Encoder

import com.jtang.SparkConnect
import com.jtang.dao.{FileInfoDao, HdfsDao}
import org.apache.spark.ml.Pipeline
import org.apache.spark.ml.feature.{StringIndexer, StringIndexerModel}
import org.apache.spark.sql.types.{DataType, StringType, StructField}
import org.apache.spark.sql.{DataFrame, Dataset, SaveMode, SparkSession}
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import spire.implicits

import scala.collection.mutable.ListBuffer
import scala.util.Try

/**
  * Library for SVM
  * Aimed at Classification and
  * Created by lucas on 2016/10/19.
  * Trait configuration:
  * 1. SparkConf as sparkConf
  * 2. SQLContext as sQLContext
  * 3. HDFS Server address as hdfsServer
  * 4. Logger as log
  */
@Component
class LibsvmAdapter extends SparkConnect{

  @Autowired
  val fileLocDao: FileInfoDao = null

  @Autowired
  val hdfsDao: HdfsDao = null

  //val spark: SparkSession = sparkSession

  /**
    *
    * @param fileId
    * @param keyFeature
    * @param trainingFeature
    * @throws java.lang.Exception
    * @return libSVM{String} file location in HDFS
    * keyFeature means the classification feature
    * tainingFeature means the training Items(This one show be continuous value<or Integer>)
    * isInteger means the feature is int or other dataType
    * @since 1.0.0
    */
  @throws(classOf[Exception])
  def parquet2Libsvm(fileId: String, keyFeature: String,
                     trainingFeature: Array[String]): String = {

    val fileLocs = fileLocDao.findById(fileId)
    println(fileLocs)
    val filepath = fileLocs.getLocation
    val filename = fileLocs.getFilename

    log.info("file loc: " + filepath)

    val spark = sparkSession

    import spark.implicits._
    val parquetFile = sparkSession.read.parquet(filepath)


    val featuresDF = parquetFile.select(keyFeature, trainingFeature:_*).persist()
    featuresDF.schema.foreach(println)


    val strFeatures = featuresDF.schema.filter(_.dataType.equals(StringType)).map(_.name)

    val notNullFeatureDF = featuresDF.na.fill("NA", strFeatures)

    notNullFeatureDF.show()

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
    val keyFeatureIdx = if(strFeatures.nonEmpty && strFeatures.head.equals(keyFeature)) transformDF.columns.length - strFeatures.size else 0


    val labeledData = transformDF.collect().map(row => {
      val seq = row.toSeq
      val key = seq(keyFeatureIdx)
      val tmp = seq.splitAt(keyFeatureIdx)
      val tail = tmp._1 ++ tmp._2.tail
      val features = tail.zipWithIndex.map(pair =>
        if (pair._1 == null) null else (pair._2 + 1) + ":" + pair._1).filter(_ != null)
      if (key == null) null else key + " " + features.mkString(" ")
    }).filter(_ != null)

    val tmpFileLoc = hdfsServer + filename + "123.libsvm"

    //hdfsDao.deleteFileInHdfs(tmpFileLoc, true)
    val labeledDS = sparkSession.createDataset(labeledData)

    labeledDS.repartition(1).write.mode(SaveMode.Overwrite).text(tmpFileLoc)

    log.info("Write to the file: " + tmpFileLoc)
    tmpFileLoc
  }
}
