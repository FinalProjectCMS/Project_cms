import React, { useEffect, useState } from 'react'
import LoadingScreen from './LoadingScreen';

const Quotes = () => {
    const [positiveQuotes, setPositiveQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPositiveQuotes() {
        try {
            const response = await fetch('http://localhost:3000/api/positive-quotes');
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

  return (
    <>
        <div className="positivequote">
        <ul>
        {positiveQuotes.map((quote, index) => (
          <li key={index}>
            <p>{quote.text} - <em>{quote.author ? quote.author : "Unknown"}</em></p>
          </li>
        ))}
      </ul>

        </div>
    </>

  )
}

export default Quotes;