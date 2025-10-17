// src/components/PhotoGallery.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhotoGallery.css';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/photos');
      setPhotos(res.data);
    } catch (err) { console.error("Could not fetch photos", err); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a photo to upload.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    try {
      await axios.post('http://localhost:5000/api/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchPhotos(); // Refresh gallery
      setFile(null);
      setCaption('');
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gallery-container">
      <h2>Family Photo Gallery</h2>
      <div className="upload-form">
        <h3>Upload a New Photo</h3>
        <form onSubmit={handleUpload}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <input type="text" placeholder="Add a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload'}</button>
        </form>
      </div>
      <div className="photo-grid">
        {photos.map(photo => (
          <div key={photo._id} className="photo-card">
            <img src={photo.imageUrl} alt={photo.caption} />
            <p>{photo.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PhotoGallery;