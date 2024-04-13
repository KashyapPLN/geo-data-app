import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'; // Import Leaflet.draw CSS
import 'leaflet-draw'; // Import Leaflet.draw

const MapView = ({ geoJSONData,setGeoJSONData }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const geoJSONLayerRef = useRef(null);
  const drawControlRef = useRef(null);
  const editControlRef = useRef(null);
   const userId = JSON.parse(localStorage.getItem('user'))._id;

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
      
      // Initialize the draw control
      drawControlRef.current = new L.Control.Draw({
        draw: {
          polygon: false,
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false
        },
        edit: false // Disable editing for now
      });
      mapInstance.current.addControl(drawControlRef.current);

      // Event listener for when a shape is created
      mapInstance.current.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        geoJSONLayerRef.current.addLayer(layer);
        setGeoJSONData(geoJSONLayerRef.current.toGeoJSON());
      });
    }

    if (mapInstance.current && geoJSONData) {
      // Clear previous GeoJSON layer if exists
      if (geoJSONLayerRef.current) {
        geoJSONLayerRef.current.clearLayers();
      }

      // Create a new GeoJSON layer and add it to the map
      const geoJSONLayer = L.geoJSON(geoJSONData);
      geoJSONLayer.addTo(mapInstance.current);
      geoJSONLayerRef.current = geoJSONLayer;

      // Fit the map to the bounds of the GeoJSON data
      mapInstance.current.fitBounds(geoJSONLayer.getBounds());

      // Initialize the edit control
      editControlRef.current = new L.Control.Draw({
        edit: {
          featureGroup: geoJSONLayerRef.current
        }
      });
      mapInstance.current.addControl(editControlRef.current);

      // Event listener for when a shape is edited
      mapInstance.current.on('draw:edited', (event) => {
        const layers = event.layers;
        layers.eachLayer((layer) => {
          const editedShape = layer.toGeoJSON();
          // Update the shape's geometry and attributes in your data model or perform other actions
          console.log('Edited shape:', editedShape);
          setGeoJSONData(geoJSONLayerRef.current.toGeoJSON());
        });
      });
    }
  }, [geoJSONData]);

  const handleUpdate = async () => {
    try {
        const response = await fetch('http://localhost:5000/geospatial/update-geojson', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, updatedData: geoJSONData })
        });
        if (!response.ok) {
            throw new Error('Failed to update GeoJSON data');
        }
        // Handle success, e.g., show success message
    } catch (error) {
        console.error('Error updating GeoJSON data:', error);
        // Handle error
    }
};


  return (
    <div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
      <button onClick={handleUpdate}>Update GeoJSON Data</button>
    </div>
  );
};

export default MapView;
