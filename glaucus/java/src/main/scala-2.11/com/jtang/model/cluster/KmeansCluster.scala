package com.jtang.model.cluster

import java.util

import com.jtang.SparkConnect
import org.apache.spark.ml.PipelineModel
import org.apache.spark.sql.{Dataset, Row}
import org.apache.spark.ml.clustering.KMeansModel
import org.apache.spark.ml.clustering.KMeans
import org.apache.spark.ml.feature.{StringIndexer, VectorIndexer}
import org.springframework.stereotype.Component
import spire.std.float

/**
  * Created by Administrator on 2017/4/6.
  */
@Component
class KmeansCluster extends SparkConnect{

  var trainingSet:Dataset[Row]  = _
  def dtTraining(libsvmFile: String,
                 numK: Int,
                 seed: Int): KMeansModel={
    // Loads data.
    val dataset = sparkSession.read.format("libsvm").load(libsvmFile)


    val labelDataset = new StringIndexer()
      .setInputCol("label")
      .setOutputCol("indexedLabel")
      .fit(dataset).transform(dataset)
    val featureDataset = new VectorIndexer()
      .setInputCol("features")
      .setOutputCol("indexedFeatures")
      .setMaxCategories(4) // features with > 4 distinct values are treated as continuous.
      .fit(dataset).transform(labelDataset)

    featureDataset.show()
    featureDataset.printSchema()
    featureDataset.drop("features","label")
    // Trains a k-means model.
    val kmeans = new KMeans().setK(numK).setSeed(seed)//.set//.setFeaturesCol("indexedFeatures").setPredictionCol("indexedLabel")

    val model = kmeans.fit(featureDataset)


    // Evaluate clustering by computing Within Set Sum of Squared Errors.
    val WSSSE = model.computeCost(featureDataset)
    println(s"Within Set Sum of Squared Errors = $WSSSE")

    // Shows the result.
    //println("Cluster Centers: ")
    //model.clusterCenters.foreach(println)

    model
  }

  @throws(classOf[Exception])
  def dtResult(kmeansModel: KMeansModel): util.HashMap[String, String] = {
    val resList = new util.HashMap[String, String]()
    val res = kmeansModel.clusterCenters
    res.toString
    var num = 0
    for (elem <- res) {
      num =num+1;

      resList.put(num.toString,elem.toArray.mkString(","))
    }
    println(resList)
    resList
  }
}
