// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Login/Signup';
import Home from './Components/Home';
import axios from 'axios';

const App = () => {
  const [geoJSONData, setGeoJSONData] = useState(null);
  const navigate = useNavigate();
  const [user,setUser]= useState(null);
  useEffect(() => {
    // Check if user is logged in
    if(JSON.parse(localStorage.getItem('user'))){
setUser(JSON.parse(localStorage.getItem('user')))
    }
     if (user && user._id) {
     navigate('/');
    } else {
    navigate('/login');
    }
  }, []);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    // const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      console.error('User ID not found.');
      // Handle error appropriately, such as redirecting to the login page
      return;
    }
  
    formData.append('userId', user._id); // Include user ID in the form data
  
    try {
      // Make a POST request to the backend endpoint for file upload
      const response = await axios.post('http://localhost:5000/geospatial/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // If upload is successful, set the retrieved GeoJSON data
      setGeoJSONData(response.data.geoJSONData);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error appropriately
    }
  };
  
function logout(){
  localStorage.clear();
  navigate('/login');

}
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Home onFileUpload={handleFileUpload} geoJSONData={geoJSONData} setGeoJSONData={setGeoJSONData} logout={logout} user={user} setUser={setUser}/>}
        />
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
