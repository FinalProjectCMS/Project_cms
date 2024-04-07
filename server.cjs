const express = require('express');
const axios = require('axios');
const Sentiment = require('sentiment');
const {google} = require('googleapis');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

const apiKey = '2c979581b679b06c3cb05f0f114316ce';
const gnewsApiUrl = 'https://gnews.io/api/v4/top-headlines';
const weatherApiKey = '2aa4b1935c08494d8c6151035231712';
const weatherApiUrl = 'http://api.weatherapi.com/v1/current.json';
const yt_key = 'AIzaSyCvsWwoJ00PbcGoGn1E10w8G59LfnzwVwc';

const youtube = google.youtube({
  version: 'v3',
  auth: yt_key
});

mongoose.connect('mongodb://localhost:27017/UrbanPulse');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let acceptedNews = [];
let accept_sentimentnews = [];
function performSentimentAnalysis(text) {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(text);
  return result.score > 0 ? 'Positive' : result.score < 0 ? 'Negative' : 'Neutral';
}

// python program run

app.post('/run-python-program',(req,res) =>{
  console.log('Starting Python script execution');
  const pythonProcess = spawn('python',['src/assets/firstphaseproject.py',req.body.argument]);
  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    res.json({ result: output });
  });
});

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(gnewsApiUrl, {
      params: {
        token: apiKey,
        country: 'in',
        q: 'Kerala',
        lang: 'en',
      },
    });

    const articlesWithSentiment = response.data.articles.map(article => {
      const sentiment = performSentimentAnalysis(article.title);
      return {
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        sentiment,
      };
    });

    const accept_sentiment = articlesWithSentiment.filter(article => article.sentiment === 'Positive');
    accept_sentimentnews.push(accept_sentiment);

    res.json(articlesWithSentiment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// const accept_sentiment = articlesWithSentiment.article.map(article =>{
//   if(article.sentiment == 'positive'){
//     return {
//       title: article.title,
//       description: article.description,
//       url: article.url,
//       image: article.image,
//       sentiment: article.sentiment,
//     };
//   }

// })

app.get('/api/sent.accept-news', (req, res) => {
  console.log('Request received at /api/sent.accept-news'); 
  res.json(accept_sentimentnews);
});


app.post('/api/accept-news', (req, res) => {
  const acceptedArticle = req.body;

  if (acceptedArticle) {
    // Perform sentiment analysis on the accepted article title
    const sentiment = performSentimentAnalysis(acceptedArticle.title);

    // Add sentiment to the accepted article
    acceptedArticle.sentiment = sentiment;

    console.log('Accepted News:', acceptedArticle);
    acceptedNews.push(acceptedArticle);
    res.status(200).json({ message: 'News accepted successfully' });
  } else {
    res.status(400).json({ error: 'Invalid request. No article data received.' });
  }
});

app.get('/api/accept-news', async (req, res) => {

  res.json(acceptedNews);
});


app.get('/api/weather', async (req, res) => {
  try {
    const response = await axios.get(weatherApiUrl, {
      params: {
        key: weatherApiKey,
        q: 'Thiruvananthapuram',
        aqi:'yes',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/trending-videos/:regionCode', async (req, res) => {
  try {
    const { regionCode } = req.params;
    const response = await youtube.videos.list({
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: regionCode,
      maxResults: 10 // Adjust as needed
    });
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching trending videos:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/positive-quotes', async (req, res) => {
  try {
    const quotesResponse = await axios.get('https://type.fit/api/quotes');
    const quotesData = quotesResponse.data;

    const positiveQuotes = quotesData.filter(quote => {
      // Some quotes might not have an author or text.
      if (!quote.text) return false;
      const sentiment = performSentimentAnalysis(quote.text);
      return sentiment === 'Positive';
    }).map(quote => ({
      text: quote.text,
      author: quote.author || 'Unknown'
    }));

    res.json(positiveQuotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  
  console.log(`Server is running at http://localhost:${port}`);
});
