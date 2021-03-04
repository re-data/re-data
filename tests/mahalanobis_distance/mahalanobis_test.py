if __name__ == "__main__":

    from numpy import cov, mean
    from pandas import read_csv

    from redata.statistics.mahalonobis_distance import MahalanobisDistance

    data = read_csv("../../sample_sources/data.csv", sep=",")

    data = data.values.T

    MahalanobisDistance().multidimensional_outliers(data, mean(data, axis=1), cov(data))
