from src.automl import DataCleaning

dc = DataCleaning.DataCleaning("/Users/lucas/Projects/Data/tmp/part-00000-e9f4510b-3cbf-4e7f-95d1-3c7cac7249f1.snappy.parquet", 'ORG_TY')

print(dc.csv2libsvm())
