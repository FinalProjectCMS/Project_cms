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
function performSentimentAnalysis(text) {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(text);
  return result.score > 0 ? 'Positive' : result.score < 0 ? 'Negative' : 'Neutral';
}

app.post('/api/clear-database', async (req, res) => {
  try {
    // Clear the database first
    await Promise.all([
      AcceptedArticle.deleteMany({}),
      Article.deleteMany({}),
      Weather.deleteMany({}),
      Video.deleteMany({}),
      PositiveQuote.deleteMany({})
    ]);

    // Fetch  and save to the database
    await fetchAndSaveNews();

    await fetchAndSaveWeather();
    await fetchAndSaveVideos("IN");
    await fetchAndSaveQuotes();
    
    // Run the Python script
    const pythonProcess = spawn('python', ['src/assets/pythonnews.py']);
    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      // Final response after all operations
      res.status(200).send('Database cleared, news fetched and processed successfully.');
    });


  } catch (error) {
    console.error('Failed to clear database and fetch news:', error);
    res.status(500).send('Internal server error');
  }
});

//fetch and save news

async function fetchAndSaveNews() {
  try{
    const newsResponse = await axios.get(gnewsApiUrl, {
      params: {
        token: apiKey,
        country: 'in',
        q: 'Kerala',
        lang: 'en',
      },
    });

    await Promise.all(newsResponse.data.articles.map(async article => {
      const newArticle = new Article({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image
      });
      console.log("Saving news to db");
      await newArticle.save();
    }));

  } catch (error) {
    console.error("Error fetching and saving news",error);
  }
}

//mongo news
app.get('/api/mongo-news', async (req, res) => {
  try {
    const articles = await Article.find(); 
    res.json(articles);
  } catch (error) {
    console.error("Error fetching news from MongoDB:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// fetch and save weather

async function fetchAndSaveWeather() {
  try {
    await Weather.deleteMany({})
    const weatherResponse = await axios.get(weatherApiUrl, {
      params: {
        key: weatherApiKey,
        q: 'Thiruvananthapuram',
        aqi: 'yes',
      },
    });


    const weatherData = new Weather(weatherResponse.data);
    console.log("Saving weather to db");
    await weatherData.save();

  } catch (error) {
    console.error("Error fetching and saving weather",error);
  }
}

setInterval(fetchAndSaveWeather, 3800000);


//fetch video

async function fetchAndSaveVideos(regionCode) {
  try {
    // Fetch trending videos using the YouTube Data API
    const response = await youtube.videos.list({
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: regionCode,
      maxResults: 10, // Adjust as needed
    });

    // Transform the API response to match the MongoDB schema
    const videosForMongo = response.data.items.map(item => ({
      kind: item.kind,
      etag: item.etag,
      id: item.id,
      snippet: {
        publishedAt: item.snippet.publishedAt,
        channelId: item.snippet.channelId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnails: {
          default: item.snippet.thumbnails.default,
          medium: item.snippet.thumbnails.medium,
          high: item.snippet.thumbnails.high,
          standard: item.snippet.thumbnails.standard || {}, // Handling potential absence of some thumbnail sizes
          maxres: item.snippet.thumbnails.maxres || {},
        },
        channelTitle: item.snippet.channelTitle,
        tags: item.snippet.tags || [], // Handling potential absence of tags
        categoryId: item.snippet.categoryId,
        liveBroadcastContent: item.snippet.liveBroadcastContent,
        defaultLanguage: item.snippet.defaultLanguage,
        localized: item.snippet.localized || { title: "", description: "" }, // Default to empty if not provided
        defaultAudioLanguage: item.snippet.defaultAudioLanguage,
      },
    }));

    // Save the transformed video data to MongoDB
    await Video.insertMany(videosForMongo);
    console.log("inserted videos to DB");

    console.log(`Saved ${videosForMongo.length} videos to the database for region: ${regionCode}`);
  } catch (error) {
    console.error(`Error fetching and saving trending videos for region ${regionCode}:`, error.message);
  }
}

//mongovideo

app.get('/api/mongo-videos', async (req, res) => {
  try {
    const videos = await Video.find(); // Fetch all videos from MongoDB
    res.json(videos); // Send videos back in response
  } catch (error) {
    console.error("Error fetching videos from database:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//mongo weather
app.get('/api/mongo-weather', async (req, res) => {
  try {
    // Retrieve the latest weather data document
    const latestWeather = await Weather.findOne().sort({ createdAt: -1 });
    if (latestWeather) {
      res.json(latestWeather);
    } else {
      res.status(404).json({ message: 'No weather data found' });
    }
  } catch (error) {
    console.error("Error fetching weather from MongoDB:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//accepting news into DB
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

//mongo-accept-news
app.get('/api/mongo-accept-news', async (req, res) => {
  try {
    const acceptedArticles = await AcceptedArticle.find(); // Fetch all documents from acceptedarticle collection
      // console.log(acceptedArticles);
    res.json(acceptedArticles); // Send them back in response
  } catch (error) {
    console.error("Error fetching accepted sentiment news from database:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//fetchandsavequotes

async function fetchAndSaveQuotes() {
  try {
    const quotesResponse = await axios.get('https://type.fit/api/quotes');
    const quotesData = quotesResponse.data;

    const positiveQuotes = quotesData.filter(quote => {
      if (!quote.text) return false;
      const sentiment = performSentimentAnalysis(quote.text);
      return sentiment === 'Positive';
    }).map(quote => ({
      text: quote.text,
      author: quote.author || 'Unknown'
    }));

    // Save filtered positive quotes to MongoDB
    await PositiveQuote.insertMany(positiveQuotes);
    console.log(`${positiveQuotes.length} positive quotes saved to database.`);

  } catch (error) {
    console.error("Error in fetchAndSavePositiveQuotes:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

//mongo-quote
app.get('/api/mongo-quotes', async (req, res) => {
  try {
    const quotes = await PositiveQuote.find(); // Fetch all positive quotes from MongoDB
    res.json(quotes); // Send them back in response
  } catch (error) {
    console.error("Error fetching positive quotes from database:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  
  console.log(`Server is running at http://localhost:${port}`);
});
