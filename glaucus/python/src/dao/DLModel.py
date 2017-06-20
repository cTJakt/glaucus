from flask import json

from src.dao import MongoConnection
import pprint
from bson.objectid import ObjectId
import simplejson as json


class DLModel:
    def __init__(self):
        self.dao = MongoConnection.db.dLModel

    def getModelById(self, modelId):
        pprint.pprint("get modelId: " + modelId)
        try:
            return self.dao.find_one({"_id": ObjectId(modelId)})
        except Exception as error:
            pprint.pprint("DB Error")
            raise Exception(error)

    def setModelTrained(self, modelId, trained):
        try:
            self.dao.update_one({"_id": ObjectId(modelId)}, {'$set': {'isTrained': trained}}, upsert=False)
        except Exception as error:
            pprint.pprint("Update isTrained field db Error")
            raise Exception(error)

    def setModelResult(self, modelId, acc, cost_time):
        try:
            result = {"Accuracy": str(acc), "CostTime": cost_time}
            print(result)
            self.dao.update_one({"_id": ObjectId(modelId)}, {'$set': {'resOfModel': result}}, upsert=False)
        except Exception as error:
            pprint.pprint("Update modelResult db Error")
            raise Exception(error)

    def setModelPath(self, modelId, path):
        try:
            self.dao.update_one({"_id": ObjectId(modelId)}, {'$set': {'modelPath': path}}, upsert=False)
        except Exception as error:
            pprint.pprint("Update isTrained field db Error")
            raise Exception(error)

