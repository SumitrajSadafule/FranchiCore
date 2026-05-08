// src/components/common/MapView.jsx
import React, { useEffect, useRef, useState } from 'react';

const MapView = ({ locations, center, zoom = 10 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [mapId] = useState('DEMO_MAP_ID'); // Required for advanced markers

  // Load Google Maps script with marker library
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is missing!');
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps) {
      setApiLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('#google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => setApiLoaded(true));
      return;
    }

    // Create and add script with marker library
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Global callback function
    window.initMap = () => {
      setApiLoaded(true);
      delete window.initMap;
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
    };
    
    document.head.appendChild(script);

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.map = null);
    };
  }, []);

  // Initialize map when API loads
  useEffect(() => {
    if (!apiLoaded || !mapRef.current || !window.google || !window.google.maps) return;
    
    setTimeout(() => {
      initializeMap();
    }, 100);
  }, [apiLoaded]);

  // Update markers when locations change
  useEffect(() => {
    if (mapInstanceRef.current && locations.length > 0 && window.google && window.google.maps) {
      addMarkers();
    }
  }, [locations]);

  const initializeMap = async () => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    const defaultCenter = center || { lat: 20.5937, lng: 78.9629 }; // India center
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: zoom,
      mapId: mapId, // Required for advanced markers
    });

    addMarkers();
  };

  const addMarkers = async () => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    // Import marker library if needed
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');

    const validLocations = locations.filter(location => location.latitude && location.longitude);
    
    validLocations.forEach(location => {
      // Create advanced marker
      const marker = new AdvancedMarkerElement({
        position: { lat: location.latitude, lng: location.longitude },
        map: mapInstanceRef.current,
        title: location.name,
      });

      // Add info window on click
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #D62323;">${location.name}</h3>
            <p style="margin: 5px 0;"><strong>📍 Address:</strong> ${location.address}</p>
            <p style="margin: 5px 0;"><strong>📞 Phone:</strong> ${location.phone}</p>
            <p style="margin: 5px 0;"><strong>🕒 Hours:</strong> ${location.operatingHours || '10:00 AM - 11:00 PM'}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}" 
               target="_blank" 
               style="color: #D62323; text-decoration: none; font-weight: bold;">
              Get Directions →
            </a>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.position);
      });
      mapInstanceRef.current.fitBounds(bounds);
      
      // Don't zoom too far if only one marker
      if (markersRef.current.length === 1) {
        mapInstanceRef.current.setZoom(14);
      }
    }
  };

  // Show loading state while API loads
  if (!apiLoaded) {
    return (
      <div style={{ 
        width: '100%', 
        height: '500px', 
        borderRadius: '12px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: '#666'
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '500px', borderRadius: '12px' }}
    />
  );
};

export default MapView;