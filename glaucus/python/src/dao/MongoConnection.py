from pymongo import MongoClient
import configparser

config = configparser.ConfigParser()
config.read("../config.ini")
print("config:", config.items('MONGODB'))
client = MongoClient(config.get('MONGODB', 'ServerAddr'), config.getint('MONGODB', 'Port'))
db = client.cloudkits
