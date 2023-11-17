const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());


const apiKey = '2c979581b679b06c3cb05f0f114316ce'; 
const gnewsApiUrl = 'https://gnews.io/api/v4/top-headlines';

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(gnewsApiUrl, {
      params: {
        token: apiKey,
        country: 'in',  // Country code for India
        q: 'Thiruvananthapuram',  // Keyword for Thiruvananthapuram
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});