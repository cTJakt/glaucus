package com.jtang

import javax.annotation.PostConstruct

import com.jtang.config.AppConfig
import org.apache.spark.sql.SparkSession
import org.apache.spark.{SparkConf, SparkContext}
import org.slf4j.{Logger, LoggerFactory}
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

/**
  * the basic spark configuration interface
  * Created by lucas on 2016/10/19.
  */
@Component
trait SparkConnect {
  @Autowired
  val conf:AppConfig = null

  val log: Logger = LoggerFactory.getLogger(getClass)

  var sparkSession: SparkSession = _
  var sparkContext: SparkContext = _
  var hdfsServer: String = _

  /**
    * initial of spark connection info
    */
  @PostConstruct
  def Init() = {
    val serverAddr = conf.getSparkServer
    val appName = conf.getAppName
    hdfsServer = conf.getHdfsServerAddr
    val executorMemory = conf.getExecutorMemory
    log.info("Get sparkServer " + serverAddr)
    val sconf = new SparkConf().setMaster(serverAddr).setAppName(appName)

    sconf.set("spark.executor.memory", executorMemory)
    sparkContext = SparkContext.getOrCreate(sconf)
    sparkSession = SparkSession.builder().master(serverAddr).appName(appName).getOrCreate()
  }
}
