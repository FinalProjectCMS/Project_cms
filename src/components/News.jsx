import React from 'react'
import { useState,useEffect } from 'react'
const News = () => {
    const[news,setNews] = useState([]);
  const[loading,setLoading] = useState(true);
  const[acceptedNews,setAcceptedNews] = useState([])

  useEffect(()=>{
    async function fetchNews(){
      try{
        const response = await fetch('http://localhost:3000/api/news');
        const data = await response.json();
        setNews(data);
      } catch(error){
        console.error("Error Fetching news",error.message);
      } finally{
        setLoading(false);
      }
    }
    fetchNews();
  },[]);

  const handleAcceptClick = async (article) =>{
    try{
      const response = await fetch('http://localhost:3000/api/accept-news',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(article),
      });
      if (response.ok) {
        const acceptedArticle = await response.json();
        console.log('News accepted successfully:', acceptedArticle);
        // console.log({article})
      } else {
        console.error('Error accepting news:', response.statusText);
      }
    } catch(error){
      console.error("Error in accepting news",error.message)
    }

  };

  return (
    <div>
        <h1>News:</h1>
      {loading ?(
        <p>Loading. . . </p>

      ):(
        <table>
        {news.map(article => (
          <tr key={article.title}>
            <td>
               <img src={article.image} alt="img" width='250px' />
            </td>
            <td>
            {article.title}
            <p>{article.description}</p>
            <p>Sentiment: {article.sentiment}</p>
            </td>
          
          <td>
            <button onClick={()=> handleAcceptClick(article)} >Accept</button>
          </td>
          </tr>
  ))}
  
        </table>
        
      )}
    </div>
  )
}

export default News