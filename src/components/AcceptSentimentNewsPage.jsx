import React, { useState, useEffect } from 'react';
import './news.css';
const AcceptSentimentNewsPage = () => {
  const [acceptSentimentNews, setAcceptSentimentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex,setCurrentIndex] = useState(0);



  useEffect(() => {
    async function fetchAcceptSentimentNews() {
      try {
        const response = await fetch('http://localhost:3000/api/mongo-accept-news');
        const data = await response.json();
        const flattendata = data.flat();
        setAcceptSentimentNews(flattendata);
      } catch (error) {
        console.error("Error Fetching accepted sentiment news", error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAcceptSentimentNews();

  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((currentIndex+1)%acceptSentimentNews.length);
    }, 5000);
    return () => clearTimeout(timer);
  },[currentIndex,acceptSentimentNews]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const article = acceptSentimentNews[currentIndex];

  return (
    <div className='news-container'>
      <h1>NEWS</h1>
      {article ? (
        <ul>
          <li>
            <img className='newsimg' src ={article.image} alt={article.title}></img>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </li>
        </ul>
      ):(
        <p>no articles</p>
      )}

    </div>
  );
};

export default AcceptSentimentNewsPage;