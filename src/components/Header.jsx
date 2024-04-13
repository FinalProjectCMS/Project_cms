import React, { useState, useEffect } from 'react'
import './header.css'
const Header = () => {

    const[currentTime, setCurrentTime] = useState('');
    useEffect(()=>{
        const intervalId = setInterval(()=>{
            const now = new Date();
            const hours = now.getHours().toString().padStart(2,'0');
            const minutes = now.getMinutes().toString().padStart(2,'0');
            setCurrentTime(`${hours}:${minutes}`);
        },1000);
        return ()=> clearInterval(intervalId);
    },[]);

    const [weather, setWeather] = useState(null);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const response = await fetch('http://localhost:3000/api/mongo-weather');
                const data = await response.json();
                // console.log(await response.text());
                //console.log(data.current);
                setWeather(data); 
            } catch (error) {
                console.error("Error fetching weather", error.message);
            }
        }
        fetchWeather();
    }, []);
  return (
    <div className='header'>
        <div className="weather-info">
        {weather && (
                    <>
                        <img src={`http:${weather.current.condition.icon}`} alt="Weather Icon" />
                        <span>{weather.current.temp_c} °C </span>
                        <span className='condition-text'>{weather.current.condition.text}</span>
                    </>
                )}
        </div>
        <div className="header-time">{currentTime}</div>

    </div>
  )
}

export default Header