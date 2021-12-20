# Classification Results Dashboard

This repo contains code to process the output of an NLP classification model's test data,
process it, and serve a dashboard with interactive visualizations for exploring outcomes.

## Prepare Input: Notebook

```
%load_ext autoreload
%autoreload 2

from module.process_test_data import DataTransform
df_raw.columns.tolist()   #['actualy', 'yhat', 'id', 'text]
```

Transform data and export

```
DT = DataTransform(df_raw)
DT.check_df_columns()
DT.transform_data()
DT._df_processd.head()

filepath = './data/sim_result.json'
DT.export_data(filepath)
```

## Prepare Input: Data Generation Scripts

```
python preprocess/generate_data.py
python preprocess/process_test_data.py
```

## Serve Dashboard

Place data files in `data/` directory. Update dropdown with data files, as necessary, `index.html @ln12-14`.

Start serving locally.

```
python3 -m http.server 9000
```


## ToDo

* initialize interaction line at max f1score
* wide layout format
* standalone web application