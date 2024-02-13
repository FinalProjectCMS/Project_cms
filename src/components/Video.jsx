import React, { useEffect, useState } from 'react'

const [video,setVideo] = useState([]);
useEffect(()=>{
    async function fetchVideo(){
        try{
          const response = await fetch('http://localhost:3000/trending-videos/IN');
          const data = await response.json();
          setVideo(data);
        } catch(error){
          console.error("Error Fetching video",error.message);
        } finally{
          //setLoading(false);
        }
      }
      fetchVideo();
},[]);

const Video = () => {
  return (
    <div>Video
        {video}

    </div>
  )
}

export default Video