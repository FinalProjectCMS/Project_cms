import React from 'react';
import axios from 'axios';

const Admin = () => {
  const handleAdminButtonClick = async () => {
    try {
      //  Clear the database
      await axios.post('http://localhost:3000/api/clear-database');
      
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
