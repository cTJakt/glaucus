from src.dao import MongoConnection
import pprint
from bson.objectid import ObjectId


class HeaderInfo:
    def __init__(self):
        self.dao = MongoConnection.db.headerInfo

    def getByFileIdAndFieldName(self, fileId, fieldName):
        pprint.pprint("fileId: " + fileId + " fieldName: " + fieldName)
        try:
            return self.dao.find_one({"fileInfoId": fileId, "fieldName": fieldName})
        except Exception as error:
            pprint.pprint("DB Error")
            raise Exception(error)

    def getHeaderInfoById(self, fieldId):
        pprint.pprint("get FieldId: " + fieldId)
        try:
            return self.dao.find_one({"_id": ObjectId(fieldId)})
        except Exception as error:
            pprint.pprint("DB Error")
            raise Exception(error)
