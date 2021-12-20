#!/usr/bin/env python3
"""
Module Docstring
"""

__author__ = "Your Name"
__version__ = "0.1.0"
__license__ = "MIT"


from os.path import exists
import time

from pandas import DataFrame, read_csv
from numpy import arange

from sklearn.metrics import precision_recall_fscore_support
from sklearn.metrics import confusion_matrix

class DataTransform:

    _df_processed = None
    _df = None

    def __init__(self, df=None):
        self._df_processed = None
        if df is not None:
            self._df = df
        return

    # support functions
    def check_df_columns(self):
        '''
        id: str
        text: str
        actualy: <0,1>
        yhat: <[0-1]>
        '''
        df_column_names = self._df.columns.tolist()
        column_names = ['id', 'text', 'actualy', 'yhat']
        check = all( item in df_column_names for item in column_names)
        if not check:
            print('required columns are not available')
            return False
        else:
            return True

    # class methods
    def load_data(self, filepath=None):
        if filepath == None:
            if self._df:
                print('df is previously loaded')
                return
        else:
            file_exists = exists(filepath)
            if file_exists:
                try:
                    df = read_csv(filepath)
                except:
                    print('error')
                else:
                    self._df = df

    def transform_data(self):
        if self._df is None:
            print("No df is available in this class")
            return
        if self.check_df_columns() == False:
            return
        df_raw = self._df

        #support function
        def threshold_scoring(row):
            pos_label = 1.0
            tmp = df_raw[['actualy', 'yhat', 'threshold']].copy(deep=True)
            tmp['yhat_label'] = 0.0
            tmp['yhat_label'][tmp['yhat'] > row['threshold']] = 1.0
            support = 'Pos: ' + str(tmp['actualy'].value_counts()[1]) + ' / Neg: ' + str(tmp['actualy'].value_counts()[0])
            output = confusion_matrix(tmp['actualy'], tmp['yhat_label']).ravel()

            tn, fp, fn, tp = output[0], output[1], output[2], output[3]
            precision, recall, f1score, support_dont_use = precision_recall_fscore_support( tmp['actualy'], tmp['yhat_label'], labels=[pos_label] )
            del tmp
            
            results.append( {'threshold': row['threshold'], 'precision': precision[0], 'recall': recall[0], 'f1score': f1score[0], 'support': support, 'tp':tp, 'tn':tn, 'fp':fp, 'fn': fn })

        #create thresholds for each record.  Add the scores and the outcomes (TP, TN, FP, FN) for each threshold.
        LENGTH = df_raw.shape[0]
        step = 1 / LENGTH
        new_thresh = arange(0, 1, step)
        new_thresh[(LENGTH - 1)] = 1.0

        # Prepare data and apply function
        df_raw.sort_values(['yhat'], inplace=True)
        df_raw['threshold'] = new_thresh
        Results = DataFrame(columns=['precision', 'recall', 'f1score', 'support', 'tp', 'tn', 'fp', 'fn'])
        results = []
        df_raw.apply(threshold_scoring, axis=1)
        Results = DataFrame(results)
        df_processed = df_raw.merge(Results, on='threshold')

        # Fix edge cases
        df_processed.loc[0, ['precision', 'recall']] = [0,1]
        df_processed.loc[(LENGTH-1), ['precision', 'recall', 'f1score']] = [1,0,0]
        self._df_processed = df_processed

    def export_data(self, filepath):
        self._df_processed.to_json(filepath, orient='records')


def run_generated_data():
    filepath_input = './data/generated_data.csv'
    df_raw = read_csv(filepath_input)
    DT = DataTransform(df_raw)
    assert DT.check_df_columns(), True
      
    tic = time.process_time() 
    DT.transform_data()
    toc = time.process_time() 
    print(f'Time to process file: {toc - tic} sec')
    filepath_output = './data/sim_result.json'
    DT.export_data(filepath_output)




if __name__ == "__main__":
    """ This is executed when run from the command line """
    run_generated_data()
