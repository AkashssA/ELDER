// frontend/src/components/Entertainment.jsx
import React, { useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import './Entertainment.css';

// NEW: Accept an 'onClose' function as a prop to hide the component
const Entertainment = ({ onClose }) => { 
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchVideos = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSelectedVideoId(null); // Close any open video on new search
    try {
      const res = await axios.get(`http://localhost:5000/api/entertainment/search?query=${query}`);
      setVideos(res.data);
    } catch (err) {
      console.error('Failed to search videos', err);
      alert('Failed to fetch videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="entertainment-container">
      {/* NEW: Close button in the top-right corner */}
      <button onClick={onClose} className="close-btn">×</button> 
      
      <div className="header">
        <h2>Entertainment & Media</h2>
        <p>Search for old songs, bhajans, movies, and more.</p>
      </div>

      {/* When a video is selected, show the player and a 'Back' button */}
      {selectedVideoId ? (
        <div className="video-player-active">
          <YouTube videoId={selectedVideoId} opts={opts} />
          {/* NEW: Back button to return to search results */}
          <button onClick={() => setSelectedVideoId(null)} className="back-btn">
            ← Back to Results
          </button> 
        </div>
      ) : (
        // When no video is selected, show the search form and results
        <>
          <form onSubmit={searchVideos} className="search-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Kishore Kumar hits"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          <div className="video-results">
            {videos.map((video) => (
              <div
                key={video.videoId}
                className="video-item"
                onClick={() => setSelectedVideoId(video.videoId)}
              >
                <img src={video.thumbnail} alt={video.title} />
                <p>{video.title}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Entertainment;