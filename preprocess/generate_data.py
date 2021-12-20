#!/usr/bin/env python3
"""
Module Docstring
"""

__author__ = "Your Name"
__version__ = "0.1.0"
__license__ = "MIT"

import numpy as np
import pandas as pd

from numpy import argmax
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_curve
from matplotlib import pyplot


def main():
    # generate dataset
    X, y = make_classification(n_samples=10000, n_features=2, n_redundant=0,
                               n_clusters_per_class=1, weights=[0.5], flip_y=0, random_state=4)
    # split into train/test sets
    trainX, testX, trainy, testy = train_test_split(
        X, y, test_size=0.25, random_state=2, stratify=y)
    # fit a model
    model = LogisticRegression(solver='lbfgs')
    model.fit(trainX, trainy)

    assert testX.shape[0] == 2500, True
    print(f'Test data size is 2500')

    # predict probabilities
    yhat = model.predict_proba(testX)
    # keep probabilities for positive outcome only
    yhat = yhat[:, 1]

    # create output data
    df_raw = pd.DataFrame({'actualy': testy, 'yhat': yhat})
    df_raw['id'] = np.arange(1, (df_raw.shape[0]+1))
    df_raw['text'] = 'This is some demo text: lorem ipsum ...'
    df_raw.sort_values(['yhat'], inplace=True)
    df_raw.to_csv('./data/generated_data.csv', index=False)


if __name__ == "__main__":
    """ This is executed when run from the command line """
    main()
