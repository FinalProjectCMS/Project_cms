// import React, { useState, useEffect } from 'react';

// const Weather = () =>{
//     const[weather,setWeather] = useState(null);

//     useEffect(()=>{
//         async function fetchWeather(){
//             try{
//               const response = await fetch('http://localhost:3000/api/weather');
//               const data = await response.json();
//               console.log(data.current);
//               setWeather(data);
//             } catch(error){
//               console.error("Error Fetching news",error.message);
//             } finally{
//             //   setLoading(false);
//             }
//           }
//     },[]);

//     return(
//         <>

//           <h2>WEATHER:</h2>
//             {/* Check if weather and weather.current are defined before accessing temp_c */}
//             {weather && weather.current ? weather.current.temp_c : "Loading..."}
        
//         </>

//     );
// }

// export default Weather;

import React, { useState, useEffect } from 'react';

const Weather = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const response = await fetch('http://localhost:3000/api/weather');
                const data = await response.json();
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
                </>
            ) : (
                "Loading weather data..."
            )}
        </>
    );
};

export default Weather;
