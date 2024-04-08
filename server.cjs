const express = require('express');
const axios = require('axios');
const Sentiment = require('sentiment');
const {google} = require('googleapis');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const AcceptedArticle = require('./src/models/AcceptedArticle.cjs');
const Article = require('./src/models/Article.cjs');
const Weather = require('./src/models/Weather.cjs');
const Video = require('./src/models/Video.cjs');
const PositiveQuote = require('./src/models/Quote.cjs');
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
// function performSentimentAnalysis(text) {
//   const sentiment = new Sentiment();
//   const result = sentiment.analyze(text);
//   return result.score > 0 ? 'Positive' : result.score < 0 ? 'Negative' : 'Neutral';
// }

app.post('/api/clear-database', async (req, res) => {
  try {
    // Assuming you're using Mongoose models, you can directly call deleteMany() on each model
    await Promise.all([
      AcceptedArticle.deleteMany({}),
      Article.deleteMany({}),
      Weather.deleteMany({}),
      Video.deleteMany({}),
      PositiveQuote.deleteMany({})
    ]);
    res.status(200).send('Database cleared successfully');
  } catch (error) {
    console.error('Failed to clear database:', error);
    res.status(500).send('Internal server error');
  }
});

// python program run

app.post('/run-python-program',(req,res) =>{
  
  const pythonProcess = spawn('python',['src/assets/pythonnews.py']);
  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  pythonProcess.stderr.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    res.json({ result: output });
  });
});


app.post('/api/sent.accept-news', async (req, res) => {
  try {
    const accept_sentimentnews = req.body;
    console.log("recieved from python");
    // Save accepted sentiment news to MongoDB
    const savedArticles = await AcceptedArticle.insertMany(accept_sentimentnews);

    // Respond with a success message and the saved articles
    res.status(200).json({ message: 'Accepted sentiment news received and saved successfully', savedArticles });
  } catch (error) {
    console.error('Error saving accepted sentiment news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

    await Promise.all(response.data.articles.map(async article => {
      const newArticle = new Article({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.image
      });
      await newArticle.save();
    }));

    res.json(response.data.articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/sent.accept-news', (req, res) => {
  console.log('Request received at /api/sent.accept-news'); 
  res.json(accept_sentimentnews);
});


app.post('/api/accept-news', (req, res) => {
  const acceptedArticle = req.body;

  if (acceptedArticle) {
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
