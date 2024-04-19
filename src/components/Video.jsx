import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
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
    },3000);
    return () =>clearTimeout(timer);
  },[currentIndex,video]);

  if (loading) {
    return <div>Loading...</div>;
  }
  const video_s = video[currentIndex];
  const videourl = `https://www.youtube.com/watch?v=${video_s.id}`;
  return (
    <div className='video-page'>
      
      { video_s ? (
        <div className='video-container'>
          <h1 className='page-title'>Video</h1>
          <div className="videotitle">
          <a href={videourl}>
            <QRCode className='QR' value={videourl} />
          </a>
          <h2>{video_s.snippet.localized.title}</h2>
          </div>
          <img className='videoimg' src={video_s.snippet.thumbnails.maxres.url} alt="Thumbnail" width="400px" />
        </div>
      ):(
        <p>no video</p>
      )}
    </div>
  );
}

export default Video;
