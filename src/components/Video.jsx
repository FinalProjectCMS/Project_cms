import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
const Video = () => {
  const [video, setVideo] = useState([]); // Initialize video as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch('http://localhost:3000/api/mongo-videos');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        setVideo(data); 
      } catch (error) {
        console.error("Error Fetching video", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Trending Videos</h1>
      {video.map((item, index) => (
        <div key={index}>
          <h2>{item.snippet.localized.title}</h2>
          <img src={item.snippet.thumbnails.maxres.url} alt="Thumbnail" width="400px" />
          <QRCode value={`https://www.youtube.com/watch?v=${video.id}`} />
        </div>
      ))}
    </div>
  );
}

export default Video;
