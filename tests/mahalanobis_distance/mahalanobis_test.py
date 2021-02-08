from pandas import read_csv
from numpy import mean, cov
from redata.statistics.mahalonobis_distance import MahalanobisDistance

data = read_csv("../../sample_sources/data.csv", sep=",")

data = data.values.T

MahalanobisDistance().multidimensional_outliers(data, mean(data, axis=1), cov(data))