package com.jtang.model.classification

import java.util

import com.jtang.SparkConnect
import org.apache.spark.ml.classification.{BinaryLogisticRegressionSummary, LogisticRegression, LogisticRegressionModel}
import org.springframework.stereotype.Component

import collection.JavaConverters._

/**
  * Created by lucas on 2016/12/1.
  */
@Component
class LRClassification extends SparkConnect{

  /*
  * initial params
  * */
  /**
    *
    * @param libsvmFile
    * @param maxIter
    * @param regParam
    * @param elasticNetParam
    * @throws java.lang.Exception
    * @return
    */
  @throws(classOf[Exception])
  def lrTraining(libsvmFile: String,
                 maxIter: Int,
                 regParam: Float,
                 elasticNetParam: Float) : LogisticRegressionModel = {
    val data = sparkSession.read.format("libsvm").load(libsvmFile)
    data.printSchema()
    println("1111111")
    data.show()
    val lr = new LogisticRegression()
      .setMaxIter(maxIter)
      .setRegParam(regParam)
      .setElasticNetParam(elasticNetParam)

    // Fit the model
    val lrModel = lr.fit(data)
    //println(s"Coefficients: ${lrModel.coefficients} Intercept: ${lrModel.intercept}")
    lrModel
  }

  /**
    *
    * @param lrModel
    * @throws java.lang.Exception
    * @return
    */
  @throws(classOf[Exception])
  def lrResult(lrModel: LogisticRegressionModel): util.HashMap[String, String] = {
    val rslMap = new util.HashMap[String, String]()
    val trainingSummary = lrModel.summary

    // Obtain the objective per iteration.
    val objectiveHistory = trainingSummary.objectiveHistory
    objectiveHistory.foreach(loss => println(loss+"123333"))

    // Obtain the metrics useful to judge performance on test data.
    // We cast the summary to a BinaryLogisticRegressionSummary since the problem is a
    // binary classification problem.
    val binarySummary = trainingSummary.asInstanceOf[BinaryLogisticRegressionSummary]

    // Obtain the receiver-operating characteristic as a dataframe and areaUnderROC.
    val roc = binarySummary.roc
    roc.show()


    println(binarySummary.areaUnderROC)
    rslMap.put("areaUnderROC", binarySummary.areaUnderROC.toString)
    rslMap
  }

}
