import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pymongo import MongoClient
import nltk
import json
import csv
import requests

from nltk.sentiment import SentimentIntensityAnalyzer
from tqdm import tqdm

# Endpoint URL
url = 'http://localhost:3000/api/news'

# Make the GET request
response = requests.get(url)

# Assuming the response contains JSON data, convert it to a pandas DataFrame
data = response.json()
df = pd.DataFrame(data)

#df = df.drop('sentiment', axis=1)

nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

res = {}
for i, row in tqdm(df.iterrows(), total=df.shape[0]):
  text = row['title']
  myid = i
  res[myid] = sia.polarity_scores(text)

categories = []
for myid, scores in res.items():
  if scores['pos'] >= scores['neg']:
        category = 'accept'
  else:
        category = 'reject'
  categories.append(category)

#print(categories)


df['Category'] = categories
positive_news_df = df[df['Category'] == 'accept']
json_data = positive_news_df.to_json(orient='records')
json_obj = json.loads(json_data)
url2 = 'http://localhost:3000/api/sent.accept-news'
response = requests.post(url2, json=json_obj)
print(response.text)
