import numpy as np
from scipy.stats import chi2

class Mahalanobis_distance():

    """
        Description:
        ------------

        Class that computes the mahalanobis distance in order to detect multidimensional outliers.
        For more info, check: 

            https://en.wikipedia.org/wiki/Mahalanobis_distance
            https://blogs.sas.com/content/iml/2012/02/15/what-is-mahalanobis-distance.html
        
        Parameters:
        -----------

            means_vector [optional numpy means vector]
            cov [optional numpy covariance matrix]
            p_value [optional float]: probability of obtaining test results at least as extreme as the results actually
                             observed, under the assumption that the null hypothesis is correct

                              H0: mu_i = mu_j / i != j
                              H1: mu_i != mu_j

                              * mu_i -> mean of i
                             
                             All the records that have a p-value lower than self.p_value will be detected as outlier
        
        Important:
        ----------

        This distance only works with 2 or more variables. In case of using 1 variable it will not work and it should be
        fine using the z_score.
    """

    def __init__(self, means_vector=None, cov_matrix=None, p_value=0.05):
        
        self.means_vector = means_vector
        self.cov_matrix = cov_matrix
        self.p_value = p_value

    def compute_mahalanobis_individual(self, vector):

        x_mu = vector - self.means_vector
        inv_covmat = np.linalg.inv(self.cov_matrix)

        distance = np.dot(np.dot(x_mu, inv_covmat), x_mu.T)
        p_value = 1 - chi2.cdf(distance, len(vector) - 1)

        if p_value < self.p_value:
            # Warning
            pass 

    def multidimensional_outliers(self, data):

        if self.means_vector == None:
            self.means_vector = np.mean(data, axis=1)
        if self.cov_matrix == None:
            self.cov_matrix = np.cov(data)
        
        for i in range(data.shape[1]):
            self.compute_mahalanobis_individual(data[:,i])

""" Example of mahalanobis distance

from pandas import read_csv

data = read_csv("/home/guillermo/Escritorio/redata/redata/sample_sources/data.csv", sep=",")

Mahalanobis_distance().multidimensional_outliers(data.values.T)
"""

