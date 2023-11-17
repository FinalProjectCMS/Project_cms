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
      <table>
      {news.map(article => (
        <tr key={article.title}>
          <td>
             <img src={article.image} alt="img" width='250px' />
          </td>
          <td>
          {article.title}
          <p>{article.description}</p>
          </td>
        
        <td>
          <button>Accept</button>
        </td>
        </tr>
))}

      </table>
    </>
  )
}

export default App
