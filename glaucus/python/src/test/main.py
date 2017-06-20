from keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from tpot import TPOTClassifier

from sklearn.datasets import load_svmlight_file
import datetime
import simplejson as json
'''X_matrix, y_matrix = load_svmlight_file("/Users/lucas/Projects/Data/测试数据集/luntai/luntai.txt")

X_train, X_test, y_train, y_test = train_test_split(X_matrix.toarray(), y_matrix,
                                                    train_size=0.7,
                                                    random_state=0)
tpot = TPOTClassifier(generations=1, population_size=20, verbosity=3, warm_start=True, config_dict='TPOT light')
startTime = datetime.datetime.now()
tpot.fit(X_train, y_train)

endTime = datetime.datetime.now()
print("TPOT accuracy score: ", tpot.score(X_test, y_test))
print("TPOT cost time: ", endTime-startTime)



import autosklearn.classification
import sklearn.metrics

X_matrix, y_matrix = load_svmlight_file("/Users/lucas/Projects/Data/测试数据集/luntai/luntai.txt")

X_train, X_test, y_train, y_test = train_test_split(X_matrix.toarray(), y_matrix,
                                                    train_size=0.7,
                                                    random_state=0)
print(len(X_train), len(y_train))
automl = autosklearn.classification.AutoSklearnClassifier()
startTime = datetime.datetime.now()

automl.fit(X_train, y_train)
endTime = datetime.datetime.now()

y_hat = automl.predict(X_test)
automl.show_models()
print("Accuracy score", sklearn.metrics.accuracy_score(y_test, y_hat))
print("Cost time: ", endTime-startTime)


'''
