from src.dao import MongoConnection
import pprint
from bson.objectid import ObjectId


class ModelType:
    def __init__(self):
        self.dao = MongoConnection.db.modelType

    def getModelTypeById(self, modelTypeId):
        pprint.pprint("get modelTypeId: " + modelTypeId)
        try:
            return self.dao.find_one({"_id": ObjectId(modelTypeId)})
        except Exception as error:
            pprint.pprint("DB Error")
            raise Exception(error)

    def getModelTypeByName(self, name):
        pprint.pprint("get ModelTypeName: " + name)
        try:
            return self.dao.find({"modelTypeName": name})
        except Exception as error:
            pprint.pprint("DB Error")
            raise Exception(error)