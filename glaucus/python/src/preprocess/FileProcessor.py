from __future__ import print_function
from pyspark.sql.types import StringType
from pyspark.sql import SparkSession
import configparser


class FileProcessor:
    def __init__(self, path):
        self.path = path
        config = configparser.ConfigParser()
        config.read("../config.ini")
        master = config.get('SPARK', 'ServerAddr')
        self.spark = SparkSession \
            .builder \
            .appName("Cloudkits_Dl") \
            .master(master) \
            .getOrCreate()
        self.file = self.spark.read.parquet(self.path)

    def processor(self, keyField):
        self.file.persist
        strFeatures = map(lambda field: field.name, filter(lambda field: field.dataType.__eq__(StringType()), self.file.schema))
        print(strFeatures)
        notNullDF = self.file.na.fill(-1)
        '''
        indexers = map(lambda field: StringIndexer().setInputCol(field).setOutputCol(field+'_index').fit(notNullDF),
                       strFeatures)
        if len(indexers):
            pipeline = Pipeline().setStages(indexers)
            tmpDF = pipeline.fit(notNullDF) \
                .transform(notNullDF)
        else:
            tmpDF = notNullDF
        tmpDF.show()
        '''
        numDF = notNullDF.drop(*strFeatures).drop(keyField)
        names = map(lambda field: field.name, numDF.schema)
        x = map(lambda row: list(row), numDF.collect())
        y = zip(*map(lambda row: list(row), notNullDF.select(keyField).collect()))[0]
        # print(len(x), len(y))
        return x, y, names





