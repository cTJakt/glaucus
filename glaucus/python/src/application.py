import time

import datetime
from flask import Flask, json
from flask import request
from flask import make_response
from flask_cors import CORS
from bson import json_util

from src.dao.FileInfo import FileInfo
from src.dao.Model import Model
from src.dao.ModelType import ModelType
from src.dao.HeaderInfo import HeaderInfo
from src.dao.PicFile import PicFile
from src.dao.DLModel import DLModel

from src.preprocess.FileProcessor import FileProcessor
from src.preprocess.FeatureSelector import FeatureSelector
import src.preprocess.PictureHelper as picHelper

from src.dl import Base, Cnn, HirRnn, Vgg

from src.automl import DataCleaning, Classification, Regression

app = Flask(__name__)
CORS(app)
fileInfoDao = FileInfo()
modelDao = Model()
modelTypeDao = ModelType()
headerInfoDao = HeaderInfo()
picFileDao = PicFile()
dlModelDao = DLModel()


#
# Functions
#

def jd(obj):
    return json_util.dumps(obj)


#
# Response
#

def response(data={}, code=200):
    resp = {
        "timestamp": int(round(time.time() * 1000)),
        "status": code,
        "data": data
    }
    response = make_response(jd(resp))
    response.headers['Status Code'] = resp['status']
    response.headers['Content-Type'] = "application/json"
    return response


@app.route('/')
def index():
    return 'Hello DL!'


# FileInfo Controller
# args: fileId
@app.route('/get/file', methods=['GET'])
def hello():
    value = request.args
    app.logger.info('value: %s', value)
    try:
        return response(fileInfoDao.getFileInfoById(value.get('fileId')))
    except Exception as error:
        return response({}, 400)


# Deep Learning training models
# args: modelId
@app.route('/api/model/dl/train', methods=['GET'])
def train():
    value = request.args
    app.logger.info('value: %s', value)
    try:
        # args
        modelId = value.get('modelId')
        modelEntity = dlModelDao.getModelById(modelId)
        print("model: ", modelEntity)
        # pic entity
        picEntity = picFileDao.getPicFileById(modelEntity['picFileId'])
        print("pic: ", picEntity)
        # model entity
        modelTypeEntity = modelTypeDao.getModelTypeById(modelEntity['modelTypeId'])
        print("modelType: ", modelTypeEntity)
        # args
        modelArgs = modelEntity['arguments']
        epochs = int(modelArgs['epochs'])
        steps_per_epoch = int(modelArgs['steps_per_epoch'])
        valid_steps = int(modelArgs['valid_steps'])
        # train location
        trainLoc = picEntity['loc']
        modelDetailName = modelTypeEntity['modelDetailName']
        trainGen = picHelper.trainGen(trainLoc)
        # calculate time
        startTime = datetime.datetime.now()
        if modelDetailName == 'CNN':
            base = Cnn.Cnn(trainGen, epochs, steps_per_epoch, valid_steps)
            accs, model = base.train()
        elif modelDetailName == 'VGG':
            base = Vgg.Vgg(trainGen, epochs, steps_per_epoch, valid_steps)
            accs, model = base.train()
        elif modelDetailName == 'HirRnn':
            base = HirRnn.HirRnn(trainGen, epochs, steps_per_epoch, valid_steps)
            accs, model = base.train()
        else:
            raise Exception
        endTime = datetime.datetime.now()
        dlModelDao.setModelResult(modelId, accs, (endTime-startTime).seconds)
        dlModelDao.setModelTrained(modelId, True)
        return response(True)
    except Exception as error:
        print(error)
        return response({}, 400)


# Feature selection
# args: fileId[String], fieldName[String], methodId[String]
@app.route('/api/config/get/features', methods=['GET'])
def featureSelection():
    value = request.args
    app.logger.info('value: %s', value)
    try:
        fileId = value.get('fileId')
        fieldName = value.get('fieldName')
        methodId = value.get('methodId')
        fileEntity = fileInfoDao.getFileInfoById(fileId)
        print(fileEntity)
        fileLoc = fileEntity['location']
        # read parquet file
        processor = FileProcessor(fileLoc)
        (x, y, names) = processor.processor(fieldName)
        featureSelector = FeatureSelector(x, y, names)
        # train the feature
        if methodId == 'RL':
            res = featureSelector.selectWithRandomizedLasso()
        elif methodId == 'RF':
            res = featureSelector.selectWithRandomForest()
        else:
            raise Exception()
        print(res)
        resData = map(lambda pair: {
            'fieldName': str(pair[1]),
            'value': pair[0],
            'id': str(headerInfoDao.getByFileIdAndFieldName(fileId, str(pair[1]))['_id'])
        }, res)
        size = len(resData)
        return response(resData[:int(size * 0.2)])
    except Exception as error:
        print(error)
        return response({}, 400)


@app.route('/api/automl', methods=['GET'])
def autoMl():
    value = request.args
    app.logger.info('value: %s', value)
    try:
        fileId = value.get('fileId')
        modelId = value.get('modelId')
        fieldId = value.get('fieldId')
        headerEntity = headerInfoDao.getHeaderInfoById(fieldId)
        fileEntity = fileInfoDao.getFileInfoById(fileId)
        file_loc = fileEntity['location']
        traget_feature = headerEntity['fieldName']
        # get files
        dc = DataCleaning.DataCleaning(file_loc, traget_feature)
        X, y, is_classification = dc.dataTrans()
        if is_classification:
            classifier = Classification.AutoClassification(X, y)
            score, time = classifier.fit()
        else:
            regressor = Regression.AutoRegression(X, y)
            score, time = regressor.fit()

        print("Accuracy score: ", score)
        print("Cost time: ", time)
        modelDao.setModelTrained(modelId, True)
        modelDao.setModelResult(modelId, score, other_key='CostTime', other_value=time.total_seconds())
        return response()
    except Exception as error:
        print(error)
        return response({}, 400)


#
# Error handing
#

@app.errorhandler(404)
def page_not_found(error):
    return response({}, 404)


if __name__ == '__main__':
    app.run(host='localhost', port=8088, debug=True)
