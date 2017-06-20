import pprint
from bson.objectid import ObjectId
from src.dao import MongoConnection


class Config:
    def __init__(self):
        self.dao = MongoConnection.db.config

    def getConfigById(self, configId):
        pprint.pprint("get configId: " + configId)
        try:
            return self.dao.find_one({"_id": ObjectId(configId)})
        except Exception as error:
            pprint.pprint("DB Error")
            raise Exception(error)
