import { useState,useEffect } from 'react'



function App() {
  const[news,setNews] = useState([]);

  useEffect(()=>{
    async function fetchNews(){
      try{
        const response = await fetch('http://localhost:3000/api/news');
        const data = await response.json();
        setNews(data);
      } catch(error){
        console.error(error);
      }
    }
    fetchNews();
  },[]);

  return (
    <>
      <h1>News:</h1>
      <ul>
      {news.map(article => (
        <li key={article.title}>
        {article.title}
        <p>{article.description}</p>
        </li>
))}

      </ul>
    </>
  )
}

export default App
