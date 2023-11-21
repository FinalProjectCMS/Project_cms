const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

const apiKey = '2c979581b679b06c3cb05f0f114316ce'; 
const gnewsApiUrl = 'https://gnews.io/api/v4/top-headlines';

let acceptedNews = [];

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(gnewsApiUrl, {
      params: {
        token: apiKey,
        country: 'in',  // Country code for India
        q: 'Kerala',   //Keyword for Thiruvananthapuram
      },
    });

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image:article.image,
    }));

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/accept-news', (req, res) => {
  const acceptedArticle = req.body;

  if (acceptedArticle) {
    // Handle the accepted article as needed
    console.log('Accepted News:', acceptedArticle);
    acceptedNews.push(acceptedArticle);
    res.status(200).json({ message: 'News accepted successfully' });
  } else {
    res.status(400).json({ error: 'Invalid request. No article data received.' });
  }
});

app.get('/api/accept-news',(req,res)=>{
  res.json(acceptedNews);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});