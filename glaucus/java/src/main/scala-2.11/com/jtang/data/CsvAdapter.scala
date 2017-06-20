package com.jtang.data

import java.io.IOException
import java.util
import java.util.Map.Entry

import com.jtang.SparkConnect
import com.jtang.dao.{FileInfoDao, HdfsDao, HeaderInfoDao}
import com.jtang.entity.{FileInfo, HeaderInfo}
import com.jtang.services.FileService
import org.apache.spark.ml.Pipeline
import org.apache.spark.ml.feature.{StringIndexer, StringIndexerModel}
import org.apache.spark.sql.{DataFrame, SaveMode}
import org.apache.spark.sql.types.StringType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import scala.collection.JavaConverters._
import scala.collection.mutable.ListBuffer

/**
  * Convert CSV to Parquet
  * Created by lucas on 2016/10/10.
  * Trait configuration:
  * 1. SparkConf as sparkConf
  * 2. SQLContext as sQLContext
  * 3. HDFS Server address as hdfsServer
  * 4. Logger as log
  */
@Component
class CsvAdapter extends SparkConnect{

  @Autowired val hdfsDao: HdfsDao = null

  @Autowired val fileInfoDao: FileInfoDao = null
  @Autowired val headerInfoDao: HeaderInfoDao = null
  @Autowired val fileService: FileService = null

  /**
    *
    * @param fileLoc
    * @return
    */
  @throws(classOf[Exception])
  def parquetFileReader(fileLoc: String): util.List[util.Map[String, String]] = {
    val inFile = sparkSession.read.parquet(fileLoc).persist()
    val columns = inFile.columns
    val res = inFile.collect().map(row => {
      row.toSeq.zipWithIndex.map(pair => {
        (columns(pair._2), pair._1.toString)
      }).toMap.asJava
    }).toList
    println("haha: " + res)
    res.asJava
  }
  /**
    *
    * @param inFile {String}
    * @param outFile {String}
    * @return DocId {String}
    * @since 1.0.0
    */
  @throws(classOf[Exception])
  def Csv2Parquet(inFile: String, outFile: String, userId: String): String = {
    //1. Load local csv file to HDFS
    val csvHdfsLoc = hdfsDao.putFile(inFile)
    log.info("Initial spark config done.")

    //2. Read csv file to Dataframe, the schema property as String
    val df = sparkSession.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv(csvHdfsLoc)
      .persist()
    /*//-> 2. Preprocessing file(String to Int & nulls fill)
    val strFeatures = df.schema.filter(_.dataType.equals(StringType)).map(_.name)

    val notNullFeatureDF = df.na.fill(-1).na.fill("NA", strFeatures)

    val indexers = strFeatures.map(field => {
      new StringIndexer()
        .setInputCol(field)
        .setOutputCol("new_" + field)
        .fit(notNullFeatureDF)
    })
    var res:DataFrame = null
    if (indexers.nonEmpty) {
      val pipeline = new Pipeline().setStages(indexers.toArray[StringIndexerModel])
      res = pipeline.fit(notNullFeatureDF).transform(notNullFeatureDF).drop(strFeatures: _*)
    } else {
      res = notNullFeatureDF
    }
    res.show()*/
    //3. now simply write to a parquet file
    df.coalesce(1).write.mode(SaveMode.Overwrite).parquet(hdfsServer + outFile)
    //4. delete the csv file
    hdfsDao.deleteFileInHdfs(csvHdfsLoc, true)
    //5. Store filename to db
    val fileId = fileInfoDao.save(new FileInfo(hdfsServer + outFile, userId, outFile)).getId
    //6. 将header存入数据库中
    df.schema.fields.map(field => {
      headerInfoDao.save(new HeaderInfo(fileId, field.name, field.dataType.catalogString))
    })
    //7. 分析文件
    // fileService.analysis(fileId);
    fileId
  }
}
