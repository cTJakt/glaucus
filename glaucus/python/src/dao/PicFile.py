from src.dao import MongoConnection
import pprint
from bson.objectid import ObjectId


class PicFile:
    def __init__(self):
        self.dao = MongoConnection.db.picFile

    def getPicFileById(self, picId):
        pprint.pprint("get picId: " + picId)
        try:
            return self.dao.find_one({"_id": ObjectId(picId)})
        except Exception as error:
            pprint.pprint("DB Error")
            raise Exception(error)