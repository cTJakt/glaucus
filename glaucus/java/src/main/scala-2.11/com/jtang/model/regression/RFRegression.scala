package com.jtang.model.regression

import java.util

import com.jtang.SparkConnect
import org.apache.spark.ml.{Pipeline, PipelineModel}

import org.apache.spark.ml.evaluation.{RegressionEvaluator}
import org.apache.spark.ml.feature.{IndexToString, StringIndexer, VectorIndexer}
import org.apache.spark.ml.regression.{RandomForestRegressionModel, RandomForestRegressor}
import org.apache.spark.sql.{Dataset, Row}
import org.springframework.stereotype.Component

/**
  * Created by twb on 2017/5/2.
  */
@Component
class RFRegression extends SparkConnect{
  var trainingSet:Dataset[Row]  = _
  var testData:Dataset[Row] = _
  @throws(classOf[Exception])
  def dtTraining(libsvmFile: String,
                 category: Int,
                 trainingSetOccupy: Float): PipelineModel = {
    // Load the data stored in LIBSVM format as a DataFrame.
    val data = sparkSession.read.format("libsvm").load(libsvmFile)
    // Index labels, adding metadata to the label column.
    // Fit on whole dataset to include all labels in index.
    val labelIndexer = new StringIndexer()
      .setInputCol("label")
      .setOutputCol("indexedLabel")
      .fit(data)

    // Automatically identify categorical features, and index them.
    val featureIndexer = new VectorIndexer()
      .setInputCol("features")
      .setOutputCol("indexedFeatures")
      .setMaxCategories(category) // features with > 4 distinct values are treated as continuous.
      .fit(data)
    // Split the data into training and test sets (30% held out for testing).
    val Array(trainingSet1, testSet) = data.randomSplit(Array(trainingSetOccupy, 1 - trainingSetOccupy))
    testData = testSet
    trainingSet = trainingSet1

    // specify layers for the neural network:
    // input layer of size 4 (features), two intermediate of size 5 and 4
    // and output of size 3 (classes)
    //val layers = Array[Int](2, 5, 4, 5)
    //layers(0) = featureNum
    // Train a MLPC  model.
    val rmReg = new RandomForestRegressor()
      .setLabelCol("indexedLabel")
      .setFeaturesCol("indexedFeatures")

    // Convert indexed labels back to original labels.
    val labelConverter = new IndexToString()
      .setInputCol("prediction")
      .setOutputCol("predictedLabel")
      .setLabels(labelIndexer.labels)

    // Chain indexers and tree in a Pipeline.
    val pipeline = new Pipeline()
      .setStages(Array(labelIndexer, featureIndexer, rmReg, labelConverter))

    // Train model. This also runs the indexers.
    val model = pipeline.fit(trainingSet)

    model
  }



  @throws(classOf[Exception])
  def dtResult(pipelineModel: PipelineModel): util.HashMap[String, String] = {
    val rslMap = new util.HashMap[String, String]()
    // Make predictions.
    val predictions = pipelineModel.transform(testData)
    predictions.show(100)
    // Select example rows to display.
    val metrixs = predictions.select("predictedLabel", "label").show(100)
    //metrixs.filter(tmp=>tmp==0).count()
    // Select (prediction, true label) and compute test error.
    val evaluator = new RegressionEvaluator()
      .setLabelCol("indexedLabel")
      .setPredictionCol("prediction")


    //RegressionEvaluator.setMetricName可以定义四种评估器
    //"rmse" (default): root mean squared error
    //"mse": mean squared error
    //"r2": R^2^ metric
    //"mae": mean absolute error

    val rmse = evaluator.setMetricName("rmse").evaluate(predictions);


    val rfrModel = pipelineModel.stages(2).asInstanceOf[RandomForestRegressionModel]
    println("Learned classification tree model:\n" + rfrModel.toString())


    rslMap.put("rmse", rmse.toString)
    println(rslMap.get("rmse"))
    rslMap
  }

}
