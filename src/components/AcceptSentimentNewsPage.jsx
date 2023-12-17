import React, { useState, useEffect } from 'react';

const AcceptSentimentNewsPage = () => {
  const [acceptSentimentNews, setAcceptSentimentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAcceptSentimentNews() {
      try {
        const response = await fetch('http://localhost:3000/api/sent.accept-news');
        const data = await response.json();
        setAcceptSentimentNews(data);
      } catch (error) {
        console.error("Error Fetching accepted sentiment news", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAcceptSentimentNews();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>News with Positive Sentiment</h2>
      <ul>
        {acceptSentimentNews.map(article => (
          <li key={article.title}>
            <h4>{article.title}</h4>
            <p>{article.description}</p>
            {article.image && (
              <img src={article.image} alt={article.title} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcceptSentimentNewsPage;