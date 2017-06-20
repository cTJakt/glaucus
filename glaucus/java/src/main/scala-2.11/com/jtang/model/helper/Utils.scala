package com.jtang.model.helper

import java.util

import com.jtang.SparkConnect
import com.jtang.dao.{HdfsDao, ModelDao}
import com.jtang.entity.Model
import lombok.`val`
import org.apache.spark.ml.PipelineModel
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

/**
  * Created by twb on 2017/5/3.
  */
@Component
class Utils extends SparkConnect{

  @Autowired
  val hdfsDao: HdfsDao = null

  @Autowired
  val modelDao: ModelDao = null

  @throws(classOf[Exception])
  def storeModel(pipelineModel: PipelineModel, modelId: String): Boolean = {


    val modelPath = hdfsServer + "_" + modelId + ".model"

    hdfsDao.deleteFileInHdfs(modelPath, true)

    val flag = pipelineModel.save(modelPath)
    val modelOfGet = modelDao.findById(modelId)

    modelOfGet.setModelPath(modelPath)

    val modelObject = modelDao.save(modelOfGet)
    if (modelObject != null) return true

    return false

  }
}
