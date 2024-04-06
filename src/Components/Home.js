import React from 'react';
import FileUploadForm from './FileUploadForm';
import MapView from './MapView';
import { Button } from 'react-bootstrap';

export default function Home({onFileUpload,geoJSONData,logout,setGeoJSONData}) {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      {user && (
        <div style={{ position: 'absolute', top: 2, right: 2 }}>
          <span className='me-2'>{user.email}</span>
          <Button variant='outline-primary' onClick={logout}>Logout</Button>
        </div>
      )}
         <FileUploadForm onFileUpload={onFileUpload} />
      <MapView geoJSONData={geoJSONData} setGeoJSONData={setGeoJSONData} />

      
    </div>
  )
}
