from __future__ import print_function
from sklearn.linear_model import RandomizedLasso
from sklearn.ensemble import RandomForestRegressor


class FeatureSelector:
    def __init__(self, x, y, names):
        self.x = x
        self.y = y
        self.names = names

    def selectWithRandomizedLasso(self):
        rlasso = RandomizedLasso(alpha=0.025)
        rlasso.fit(self.x, self.y)
        return sorted(zip(map(lambda x: round(x, 4), rlasso.scores_),
                          self.names), reverse=True)

    def selectWithRandomForest(self):
        rf = RandomForestRegressor()
        rf.fit(self.x, self.y)
        return sorted(zip(map(lambda x: round(x, 4), rf.feature_importances_),
                          self.names), reverse=True)
