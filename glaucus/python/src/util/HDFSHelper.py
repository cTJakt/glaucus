import configparser

config = configparser.ConfigParser()
config.read("../config.ini")
def saveToHDFS(model, modelName):
    localPath = modelName + '.h5'
    pass