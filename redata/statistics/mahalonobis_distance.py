import numpy as np
from scipy.stats import chi2

class MahalanobisDistance():

    """
        Description:
        ------------

        Class that computes the mahalanobis distance in order to detect multidimensional outliers.
        For more info, check: 

            https://en.wikipedia.org/wiki/Mahalanobis_distance
            https://blogs.sas.com/content/iml/2012/02/15/what-is-mahalanobis-distance.html
        
        Parameters:
        -----------

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

    def __init__(self, p_value=0.05):

        self.p_value = p_value

    def compute_mahalanobis_individual(self, vector, means_vector, cov_matrix):

        x_mu = vector - means_vector
        inv_covmat = np.linalg.inv(cov_matrix)

        distance = np.dot(np.dot(x_mu, inv_covmat), x_mu.T)
        p_value = 1 - chi2.cdf(distance, len(vector) - 1)

        if p_value < self.p_value:
            print(f"The record {vector} was detected as an outlier")

    def multidimensional_outliers(self, data, means_vector, cov_matrix):
        
        for i in range(data.shape[1]):
            self.compute_mahalanobis_individual(data[:,i], means_vector, cov_matrix)