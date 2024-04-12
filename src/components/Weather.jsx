
import React, { useState, useEffect } from 'react';
import Quotes from './Quotes';

const Weather = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const response = await fetch('http://localhost:3000/api/mongo-weather');
                const data = await response.json();
                // console.log(await response.text());
                console.log(data.current);
                setWeather(data); // Assuming data is structured as per your API endpoint
            } catch (error) {
                console.error("Error fetching weather", error.message);
            }
        }
        fetchWeather();
    }, []);

    return (
        <>
            <h2>WEATHER in {weather?.location?.name || "Loading..."}</h2>
            {weather ? (
                <>
                    <p>Temperature: {weather.current.temp_c}°C</p>
                    <p>Condition: {weather.current.condition.text}</p>
                    <img src={`https:${weather.current.condition.icon}`} alt="Weather Icon" />
                    <Quotes />
                </>
                
            ) : (
                "Loading weather data..."
            )}
        </>
    );
};

export default Weather;
