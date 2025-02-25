import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
const TimedNav = () => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const location = useLocation();
    let currentIndex = useRef(0);
    useEffect(() =>{
      const paths = ['/acc-news','/video','/weather'];
      
      const handleNavigation = () => {
        setLoading(true);
        setTimeout(() => {
          console.log("Navigating to:", paths[currentIndex.current]);
          navigate(paths[currentIndex.current]);
          currentIndex.current = (currentIndex.current + 1) % paths.length;
          setLoading(false);
        }, 1000);
      };
  
      if (location.pathname !== '/newsAdmin') {
        const intervalId = setInterval(handleNavigation, 5000);
  
        return () => clearInterval(intervalId);
      }
    },[navigate,location]);
  
  return loading? <LoadingScreen /> : null;
}

export default TimedNav;