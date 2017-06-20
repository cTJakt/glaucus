from src.dao import MongoConnection
import pprint
from bson.objectid import ObjectId


class FileInfo:
    def __init__(self):
        self.dao = MongoConnection.db.fileInfo

    def getFileInfoById(self, fileId):
        pprint.pprint("get fileId: " + fileId)
        try:
            return self.dao.find_one({"_id": ObjectId(fileId)})
        except Exception as error:
            pprint.pprint("DB Error")
            raise Exception(error)