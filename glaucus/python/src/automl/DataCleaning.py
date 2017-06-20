import configparser

from sklearn.preprocessing import Imputer

from pyspark.sql import SparkSession
from pyspark.sql.types import StringType
import pandas as pd


class DataCleaning:
    def __init__(self, path, target_feature):
        self.file_path = path
        self.target_feature = target_feature
        config = configparser.ConfigParser()
        config.read("../config.ini")
        master = config.get('SPARK', 'ServerAddr')
        self.spark = SparkSession \
            .builder \
            .appName("Cloudkits_AutoML") \
            .master(master) \
            .getOrCreate()

    def dataTrans(self):
        parquetFile = self.spark.read.parquet(self.file_path)
        pandasDF = parquetFile.toPandas()

        # imputer whole dataset
        notNullDF = pandasDF.fillna(pandasDF.mean())
        # print(notNullDF.as_matrix())
        # get string columns
        strCols = list(notNullDF.select_dtypes(include=['object']).columns)
        print(notNullDF.dtypes)
        for col in strCols:
            notNullDF[col] = pd.factorize(notNullDF[col])[0]
        y = notNullDF[self.target_feature].as_matrix()
        X = notNullDF.drop(self.target_feature, axis=1).as_matrix()
        repeatedY = set(y)
        if len(repeatedY) <= (len(y) * 0.5):
            is_classification = True
        else:
            is_classification = False
        print(X, y)
        return X, y, is_classification
