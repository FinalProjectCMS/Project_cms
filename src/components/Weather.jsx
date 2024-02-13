import React, { useState, useEffect } from 'react';

const Weather = () =>{
    const[weather,setWeather] = useState([]);

    useEffect(()=>{
        async function fetchWeather(){
            try{
              const response = await fetch('http://localhost:3000/api/weather');
              const data = await response.json();
              setWeather(data);
            } catch(error){
              console.error("Error Fetching news",error.message);
            } finally{
            //   setLoading(false);
            }
          }
    },[]);

    return(
        <>
        
        </>

    );
}

export default Weather;