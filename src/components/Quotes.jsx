import React, { useEffect, useState } from 'react'
import LoadingScreen from './LoadingScreen';
import './quotes.css'
const Quotes = () => {
    const [positiveQuotes, setPositiveQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPositiveQuotes() {
        try {
            const response = await fetch('http://localhost:3000/api/mongo-quotes');
            const data = await response.json();
            setPositiveQuotes(data);
        } catch (error) {
            console.error("Error fetching positive quotes", error.message);
        } finally {
            setLoading(false);
        }
        }

        fetchPositiveQuotes();
    }, []);

    if (loading) {
        return <LoadingScreen/>;
    }
    const quote = positiveQuotes[1];
  return (
    <>
        <div className="positivequote">
          <h2>Today's Quote</h2>
          <h1>{quote.text}</h1>
          <h3>-{quote.author}</h3>
        </div>
    </>

  )
}

export default Quotes;