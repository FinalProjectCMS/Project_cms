import React, { useState, useEffect } from 'react';
import axios from 'axios';
const AcceptSentimentNewsPage = () => {
  const [acceptSentimentNews, setAcceptSentimentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState('');


  useEffect(() => {
    async function fetchAcceptSentimentNews() {
      try {
        const response = await fetch('http://localhost:3000/api/sent.accept-news');
        const data = await response.json();
        const flattendata = data.flat();
        setAcceptSentimentNews(flattendata);
      } catch (error) {
        console.error("Error Fetching accepted sentiment news", error.message);
      } finally {
        setLoading(false);
      }
    }
    
    async function runPythonProgram() {
      try {
        const response = await axios.post('http://localhost:3000/run-python-program', { argument: 'your_argument' });
        setResult(response.data.result);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    runPythonProgram();
    fetchAcceptSentimentNews();

  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>News with Positive Sentiment</h2>
      <ul>
        {acceptSentimentNews.map((article,index) => (
          <li key={index}>
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