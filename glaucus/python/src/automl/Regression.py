from sklearn.model_selection import train_test_split
from tpot import TPOTRegressor
from sklearn.datasets import load_svmlight_file
import datetime


class AutoRegression:
    def __init__(self, X, y, generation=5, population_size=20, complex=0, train_size=0.7):
        self.X = X
        self.y = y
        self.generation = generation
        self.population_size = population_size
        self.config_dict = None if complex == 0 else ('TPOT light' if complex == -1 else 'TPOT MDR')
        self.train_size = train_size

    def fit(self):
        X_train, X_test, y_train, y_test = train_test_split(self.X, self.y,
                                                            train_size=self.train_size,
                                                            random_state=0)

        tpot = TPOTRegressor(generations=self.generation, population_size=self.generation, verbosity=3,
                              warm_start=True, config_dict=self.config_dict)
        startTime = datetime.datetime.now()
        tpot.fit(X_train, y_train)

        endTime = datetime.datetime.now()

        predict_score = tpot.score(X_test, y_test)
        cost_time = endTime - startTime

        return predict_score, cost_time
