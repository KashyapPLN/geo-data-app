// FileUploadForm.js
import React, { useState } from 'react';

const FileUploadForm = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <h2>Upload GeoJSON or KML file:</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".geojson,.kml" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUploadForm;
