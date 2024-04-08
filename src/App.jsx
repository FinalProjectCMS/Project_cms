import { useState,useEffect } from 'react'
import Weather from './components/Weather';
import News from './components/News';
import Video from './components/Video';
import AcceptSentimentNewsPage from './components/AcceptSentimentNewsPage';
import TimedNav from './components/TimedNav';
import { BrowserRouter as Router, Route, Routes ,useNavigate} from 'react-router-dom';
import Quotes from './components/Quotes';
import Admin from './components/Admin';
function App() {

  return (
    <Router>
      {/* <TimedNav /> */}
      <Routes>
        <Route path = '/' element = {<AcceptSentimentNewsPage />}/>
        <Route path ='/acc-news' element = {<AcceptSentimentNewsPage />} />
        <Route path = '/newsAdmin' element = {<News />} />
        <Route path ='/video' element = {<Video />}/>
        <Route path ='/weather' element = {<Weather />} />
        <Route path='/quote' element = {<Quotes/>}/>
        <Route path='/Admin' element = {<Admin/>}/>
      </Routes>
    </Router>
  );
}

export default App
