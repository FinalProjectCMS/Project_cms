import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import nltk
import json
import csv
from pymongo import MongoClient
from nltk.sentiment import SentimentIntensityAnalyzer
from tqdm import tqdm
from bson.objectid import ObjectId

# MongoDB connection setup
client = MongoClient('mongodb://localhost:27017/')
db = client['UrbanPulse']  # Database name
articles_collection = db['articles']  # Collection name for input news
accepted_articles_collection = db['acceptedarticles']  # Collection name for accepted news

# Fetch articles from MongoDB
articles_cursor = articles_collection.find({})
articles = list(articles_cursor)
df = pd.DataFrame(articles)

print(df)
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

res = {}
for i, row in tqdm(df.iterrows(), total=df.shape[0]):
    text = row['title']
    myid = row['_id']  # Use MongoDB's '_id' as identifier
    res[str(myid)] = sia.polarity_scores(text)

categories = []
for myid, scores in res.items():
    if scores['pos'] >= scores['neg']:
        category = 'accept'
    else:
        category = 'reject'
    categories.append((myid, category))

# Prepare documents for insertion
accepted_news = []
for myid, category in categories:
    if category == 'accept':
        document = articles_collection.find_one({'_id': ObjectId(myid)})
        accepted_news.append(document)

# Insert accepted news into MongoDB
if accepted_news:
    accepted_articles_collection.insert_many(accepted_news)

print(f"Inserted {len(accepted_news)} accepted news articles into the database.")
