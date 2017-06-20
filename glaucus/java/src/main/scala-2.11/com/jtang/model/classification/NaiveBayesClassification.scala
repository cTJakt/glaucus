package com.jtang.model.classification

import java.util

import com.jtang.SparkConnect
import com.jtang.model.helper.Utils
import org.apache.spark.ml.{Pipeline, PipelineModel}
import org.apache.spark.ml.classification.{MultilayerPerceptronClassificationModel, MultilayerPerceptronClassifier, NaiveBayes, NaiveBayesModel}
import org.apache.spark.ml.evaluation.MulticlassClassificationEvaluator
import org.apache.spark.ml.feature.{IndexToString, StringIndexer, VectorIndexer}
import org.apache.spark.sql.{Dataset, Row}
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

/**
  * Created by twb on 2017/4/27.
  */
@Component
class NaiveBayesClassification extends SparkConnect{
  var trainingSet:Dataset[Row]  = _
  var testData:Dataset[Row] = _

  @Autowired
  val utils: Utils = null

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


    // Train a NBC  model.
    val nbc = new NaiveBayes().setLabelCol("indexedLabel").setFeaturesCol("indexedFeatures")
    // Convert indexed labels back to original labels.
    val labelConverter = new IndexToString()
      .setInputCol("prediction")
      .setOutputCol("predictedLabel")
      .setLabels(labelIndexer.labels)

    // Chain indexers and tree in a Pipeline.
    val pipeline = new Pipeline()
      .setStages(Array(labelIndexer, featureIndexer, nbc, labelConverter))

    // Train model. This also runs the indexers.
    val model = pipeline.fit(trainingSet)

    model
  }


  @throws(classOf[Exception])
  def dtResult(pipelineModel: PipelineModel, modelId: String): util.HashMap[String, String] = {
    val rslMap = new util.HashMap[String, String]()
    // Make predictions.
    val predictions = pipelineModel.transform(testData)

    predictions.printSchema()
    predictions.show()
    // Select example rows to display.
    //predictions.select("predictedLabel", "label", "features").show(100)

    // Select (prediction, true label) and compute test error.
    val evaluator = new MulticlassClassificationEvaluator()
      .setLabelCol("indexedLabel")
      .setPredictionCol("prediction")


    val weightedRecall = evaluator.setMetricName("weightedRecall").evaluate(predictions);
    val accuracy = evaluator.setMetricName("accuracy").evaluate(predictions)

    println("Test Error = " + (1.0 - accuracy))
    val weightedPrecision = evaluator.setMetricName("weightedPrecision").evaluate(predictions);

    val f1 = evaluator.setMetricName("f1").evaluate(predictions);

    val mlpcModel = pipelineModel.stages(2).asInstanceOf[NaiveBayesModel]
    println("Learned classification tree model:\n" + mlpcModel.toString())

    rslMap.put("Accuracy: ", accuracy.toString)
    rslMap.put("weightedPrecision", weightedPrecision.toString)
    rslMap.put("weightedRecall", weightedRecall.toString)
    rslMap.put("f1", f1.toString)

    if(utils.storeModel(pipelineModel, modelId))
      return rslMap
    return null
  }




}

