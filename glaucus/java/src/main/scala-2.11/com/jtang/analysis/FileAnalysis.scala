package com.jtang.analysis


import java.util

import breeze.linalg.max
import com.jtang.SparkConnect
import com.jtang.dao.{FileInfoDao, HeaderInfoDao}
import org.apache.spark.ml.feature.VectorAssembler
import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.mllib.stat.{MultivariateStatisticalSummary, Statistics}
import org.apache.spark.sql.Row

import scala.collection.JavaConversions._
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import scala.collection.JavaConversions
import scala.util.Try
import scala.util.control._
/**
  * Created by tangwb on 2016/12/11.
  * Changed by lucas on 2016/12/12.
  */
@Component
class FileAnalysis extends SparkConnect{

  @Autowired val headerInfoDao: HeaderInfoDao = null
  @Autowired val fileInfoDao: FileInfoDao = null

  /**
    *
    * @param fileId
    * @param discreteRatio
    * @throws Exception
    * @author lucas
    */
  @throws(classOf[Exception])
  def fileAnalysis(fileId: String, discreteRatio: Double):Unit = {

    val fileLocs = fileInfoDao.findById(fileId)
    val filepath = fileLocs.getLocation
    val headerInfos = headerInfoDao.findByFileInfoId(fileId).toList
    val inFile = sparkSession.read.parquet(filepath).persist()
    //get row num
    val rowNum = inFile.count
    //get file structure info
    val fileStrucInfo = new util.HashMap[String, String]()

    fileStrucInfo.put("totalRows", rowNum.toString)
    //set
    fileLocs.setFileStrucInfo(fileStrucInfo)

    fileInfoDao.save(fileLocs)

    val spark = sparkSession
    spark.conf.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
    //统计所有字段的类型和取值范围
    for(headerInfo <- headerInfos) {
      val fieldName = headerInfo.getFieldName
      val fieldType = headerInfo.getFieldType
      val value = inFile.select(fieldName).collect()
        .filter(field => field != null && !field.anyNull)
        .map(field => {
          //println("haha:" + field)
          field.get(0).toString
        })
      // get nulls ratio
      val notNullNum = value.length
      val nullsRatio = 100 - notNullNum * 100.0 / rowNum
      //get Unique values
      val uniqueValue = value.toSet
      val rowNumUnique = uniqueValue.size
      //判断是不是离散值
      if (rowNumUnique < rowNum * discreteRatio) {
        headerInfo.setValueInfo(uniqueValue.toArray)
        headerInfo.setConOrDis(0)
        headerInfo.setNullsRatio(nullsRatio)
      } else {
        //连续值
        //transferred value
        var max = ""
        var min = ""
        if (fieldType.equals("string")) {
          max = uniqueValue.max
          min = uniqueValue.min
        } else if (fieldType.equals("int")) {
          val transVal = uniqueValue.map(_.toInt)
          max = transVal.max.toString
          min = transVal.min.toString
        } else if (fieldType.equals("double")) {
          val transVal = uniqueValue.map(_.toDouble)
          max = transVal.max.toString
          min = transVal.min.toString
        } else {
          //other value type
        }
        headerInfo.setConOrDis(1)
        val rangeList = Array(min, max)
        headerInfo.setValueInfo(rangeList)
        headerInfo.setNullsRatio(nullsRatio)
      }
      headerInfoDao.save(headerInfo)
    }
  }

  /**
    *
    * @param headerInfoIds
    * @throws java.lang.Exception
    * @return
    */
  @throws(classOf[Exception])
  def getFieldDistribution(headerInfoIds: Array[String]): util.HashMap[String, util.HashMap[String, Double]]={
    val res:util.HashMap[String, util.HashMap[String, Double]] = new util.HashMap[String, util.HashMap[String, Double]]
    if(headerInfoIds == null || headerInfoIds.size == 0)
      return res

    val fileId = headerInfoDao.findById(headerInfoIds(0)).getFileInfoId
    val filePath = fileInfoDao.findById(fileId).getLocation

    val inFile = sparkSession.read.parquet(filePath)//.csv("G:\\菜鸟分类\\菜鸟分仓第一赛季数据\\CAINIAO data p1_20160408\\config3.csv")
    headerInfoIds.foreach(headerInfoId=> {
      val headerInfo = headerInfoDao.findById(headerInfoId)
      val fieldName = headerInfo.getFieldName
      //val tmp = inFile.select(fieldName).groupBy(fieldName)

      val values = inFile.select(fieldName).collect().filter(field => (field != null) && !field.anyNull).map(_.get(0).toString())
      val valuesDis = values.distinct//map(f=>(f,1)).reduce(_._2+_._2)

      val resMap = new util.HashMap[String, Double]()

      val totalNum = inFile.count()

      valuesDis.foreach(
        value =>{
          val length = values.filter(field => (field == value)).length

          resMap.put(value,length*100.0/totalNum/100.0)
        }
      )
      res.put(headerInfoId,resMap)
    })
    res
  }

  /**
    *
    * @param headerInfoIds
    * @throws java.lang.Exception
    * @return
    */
  @throws(classOf[Exception])
  def getFieldScatterDiagram(headerInfoIds: Array[String]): util.HashMap[String, util.ArrayList[Double]]= {
    val res: util.HashMap[String, util.ArrayList[Double]] = new util.HashMap[String, util.ArrayList[Double]]
    if (headerInfoIds == null || headerInfoIds.size == 0)
      return res

    val fileId = headerInfoDao.findById(headerInfoIds(0)).getFileInfoId
    val filePath = fileInfoDao.findById(fileId).getLocation

    val inFile = sparkSession.read.parquet(filePath)
    headerInfoIds.foreach(headerInfoId=> {
      val headerInfo = headerInfoDao.findById(headerInfoId)
      val fieldName = headerInfo.getFieldName
      val values = inFile.select(fieldName).collect().filter(field => (field != null) && !field.anyNull)
        .map(tmp=>tmp.get(0)).map(tmp=>tmp.toString.toDouble).toList
      //values.map(tmp => println(tmp))
      val tmp = new util.ArrayList[Double]();
      tmp.addAll(values);
      res.put(headerInfoId, tmp)
    })
    res
  }

  /**
    * @param headerInfoIds
    * @throws java.lang.Exception
    * @return
    */

  @throws(classOf[Exception])
  def getFieldDescription(headerInfoIds: Array[String]): util.HashMap[String, util.HashMap[String, Double]]= {
    val res: util.HashMap[String, util.HashMap[String, Double]] = new util.HashMap[String, util.HashMap[String, Double]]
    if (headerInfoIds == null || headerInfoIds.size == 0)
      return res

    val fileId = headerInfoDao.findById(headerInfoIds(0)).getFileInfoId
    val filePath = fileInfoDao.findById(fileId).getLocation

    val inFile = sparkSession.read.parquet(filePath)
    inFile.createOrReplaceTempView("Affairs")

    headerInfoIds.foreach(headerInfoId=> {
      val tmpHashMap = new util.HashMap[String, Double]
      val headerInfo = headerInfoDao.findById(headerInfoId)
      val fieldName = headerInfo.getFieldName
      val df4=sparkSession.sql(s"SELECT mean($fieldName) as mean,max($fieldName) as max,variance($fieldName) as variance,stddev($fieldName) as stddev, corr($fieldName,$fieldName) FROM Affairs")
      val values = df4.collect()//.map(_.toString.toDouble)

      tmpHashMap.put("mean", values(0).get(0).toString.toDouble)
      tmpHashMap.put("max", values(0).get(1).toString.toDouble)
      tmpHashMap.put("variance", values(0).get(2).toString.toDouble)
      tmpHashMap.put("stddev", values(0).get(3).toString.toDouble)

      res.put(headerInfoId,tmpHashMap)
    })
    res
  }

  /**
    *
    * @param headerInfoIds
    * @throws java.lang.Exception
    * @return
    */
  @throws(classOf[Exception])
  def getFieldCorr(headerInfoIds: Array[String]): util.HashMap[String, Double]= {
    val res: util.HashMap[String, Double] = new util.HashMap[String, Double]
    if (headerInfoIds == null || headerInfoIds.size == 0 || headerInfoIds.size !=2)
      return res

    val fileId = headerInfoDao.findById(headerInfoIds(0)).getFileInfoId
    val filePath = fileInfoDao.findById(fileId).getLocation

    val inFile = sparkSession.read.parquet(filePath)
    inFile.createOrReplaceTempView("Affairs")

    val headerInfo_1 = headerInfoDao.findById(headerInfoIds(0))
    val fieldName_1 = headerInfo_1.getFieldName

    val headerInfo_2 = headerInfoDao.findById(headerInfoIds(1))
    val fieldName_2 = headerInfo_2.getFieldName

    val df4=sparkSession.sql(s"SELECT corr($fieldName_1,$fieldName_2) as corrOfFields FROM Affairs")
    val values = df4.collect()//.map(_.toString.toDouble)
    //println(values)


    res.put("Corr",values(0).get(0).toString.toDouble)

    res
  }

  /**
    *
    * @param headerInfoIds
    * @throws java.lang.Exception
    * @return
    */
  @throws(classOf[Exception])
  def getFieldSkewnessAndKurtosis(headerInfoIds: Array[String]): util.HashMap[String, util.HashMap[String, Double]]= {
    val res = new util.HashMap[String, util.HashMap[String, Double]]
    if (headerInfoIds == null || headerInfoIds.size == 0)
      return res

    val fileId = headerInfoDao.findById(headerInfoIds(0)).getFileInfoId
    val filePath = fileInfoDao.findById(fileId).getLocation

    val inFile = sparkSession.read.parquet(filePath)
    inFile.createOrReplaceTempView("Affairs")

    headerInfoIds.foreach(headerInfoId=> {
      val tmpHashMap = new util.HashMap[String, Double]
      val headerInfo = headerInfoDao.findById(headerInfoId)
      val fieldName = headerInfo.getFieldName
      val df4=sparkSession.sql(s"SELECT skewness($fieldName) as skewness,kurtosis($fieldName) as kurtosis FROM Affairs")
      val values = df4.collect()//.map(_.toString.toDouble)
      //println(values)
      tmpHashMap.put("skewness", values(0).get(0).toString.toDouble)
      tmpHashMap.put("kurtosis", values(0).get(1).toString.toDouble)
      println(tmpHashMap.get("mean"))
      println(tmpHashMap.get("max"))
      res.put(headerInfoId,tmpHashMap)
    })
    res
  }

  //DataSet<Row>

  /*
  def fileAnalysis1(fileId: String, discreteRatio: Double):Unit = {
    val clusters:KMeansModel =
      KMeans.train(parsedTrainingData, numClusters, numIterations,runTimes)
    clusters.clusterCenters
    clusters.
  }*/
}
