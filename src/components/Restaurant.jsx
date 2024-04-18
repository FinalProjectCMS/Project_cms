import React from 'react'
import './restaurant.css'
import { RestoData } from '../assets/topdict'
const Restaurant = () => {
  // const sortedResto = RestoData.sort((a,b) => b.final_score - a.final_score);
  const location = 'Banashankari';
  const restaurant = RestoData.Banashankari;
  //console.log(restaurant)

  return (
    <div className='Restaurant-page'>
      <div className="top-container">
        <h1>Top 5 Restaurants in {location}</h1>
        <ul className='restaurant-list'>
        {restaurant.slice(0,5).map((restaurant, index) => (
          <h2><li key={index}>{restaurant}</li></h2>
        ))}
      </ul>
      </div>

    </div>
  )
}

export default Restaurant