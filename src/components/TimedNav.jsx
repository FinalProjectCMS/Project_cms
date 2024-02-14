import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
const TimedNav = () => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);

    useEffect(() =>{
      const paths = ['/acc-news','/video','/weather'];
      let currentIndex = 0;
      const intervalId = setInterval(()=>{
        setLoading(true);
        setTimeout(()=>{
            console.log("Navigating to:", paths[currentIndex]); 
            navigate(paths[currentIndex]);
            currentIndex = (currentIndex + 1)% paths.length;
            setLoading(false);
        }, 1000);
        
      },5000);
      return () => clearInterval(intervalId);
      
    },[navigate]);
  
  return loading? <LoadingScreen /> : null;
}

export default TimedNav;