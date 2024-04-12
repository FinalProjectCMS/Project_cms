import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import './video.css';
const Video = () => {
  const [video, setVideo] = useState([]); // Initialize video as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() =>{
    const timer = setTimeout(() =>{
      setCurrentIndex((currentIndex +1)%video.length)
    },15000);
    return () =>clearTimeout(timer);
  },[currentIndex,video]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }
  const video_s = video[currentIndex];
  const videourl = 'https://www.youtube.com/watch?v=${video_s.id}';
  // console.log(video_s);
  return (
    <div>
      {/* <h1>Trending Videos</h1>
      {video.map((item, index) => (
        <div key={index}>
          <h2>{item.snippet.localized.title}</h2>
          <img src={item.snippet.thumbnails.maxres.url} alt="Thumbnail" width="400px" />
          <QRCode value={`https://www.youtube.com/watch?v=${video.id}`} />
        </div>
      ))} */}
      <h1>Video</h1>
      { video_s ? (
        <div>
          <ul>
            <li>
            <img src={video_s.snippet.thumbnails.maxres.url} alt="Thumbnail" width="400px" />
            <h2>{video_s.snippet.localized.title}</h2>
            <QRCode value={`https://www.youtube.com/watch?v=${video_s.id}`} />
            <a href='videourl'>CLICK HERE</a>
            </li>
          </ul>
        </div>
      ):(
        <p>no video</p>
      )}
    </div>
  );
}

export default Video;
