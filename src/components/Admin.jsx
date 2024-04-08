import React from 'react';
import axios from 'axios';

const Admin = () => {
  const handleAdminButtonClick = async () => {
    try {
      // Step 1: Clear the database
      await axios.post('http://localhost:3000/api/clear-database');
      
      // Step 2: Fetch data and repopulate the database
      // This assumes you have separate endpoints for each data type you're repopulating
      // await Promise.all([
      //   axios.post('http://localhost:3000/api/fetch-sentiment-news'),
      //   axios.post('http://localhost:3000/api/fetch-videos'),
      //   axios.post('http://localhost:3000/api/fetch-weather'),
      //   axios.post('http://localhost:3000/api/fetch-quotes'),
      // ]);

      alert('Database has been reset and repopulated successfully!');
    } catch (error) {
      console.error('Error during admin operations:', error.message);
      alert('Failed to complete admin operations.');
    }
  };

  return (
    <div>
      <h2>Admin Operations</h2>
      <button onClick={handleAdminButtonClick}>Reset and Repopulate Database</button>
    </div>
  );
};

export default Admin;
