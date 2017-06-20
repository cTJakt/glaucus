from src.dao import MongoConnection
import pprint
from bson.objectid import ObjectId


class Model:
    def __init__(self):
        self.dao = MongoConnection.db.model

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

    def setModelResult(self, modelId, acc, other_key='Loss', other_value=1):
        try:
            result = {other_key: other_value, 'Accuracy': acc}
            self.dao.update_one({"_id": ObjectId(modelId)}, {'$set': {'resOfModel': result}}, upsert=False)
        except Exception as error:
            pprint.pprint("Update modelResult db Error")
            raise Exception(error)

