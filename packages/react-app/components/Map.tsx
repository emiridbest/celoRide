import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const Map: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [destinationLocation, setDestinationLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  // Detect user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error detecting location', error);
        }
      );
    }
  }, []);

  // Handle destination input and route calculation
  const handleDestinationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Geocode the destination address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: destination }, (results, status) => {
      if (status === 'OK' && results) {
        const destinationLatLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        setDestinationLocation(destinationLatLng);

        if (currentLocation) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: currentLocation,
              destination: destinationLatLng,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === 'OK' && result) {
                setDirections(result);
              } else {
                console.error('Error calculating route', status);
              }
            }
          );
        }
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation || { lat: 37.7749, lng: -122.4194 }} // Default to San Francisco if no location detected
          zoom={12}
        >
          {currentLocation && <Marker position={currentLocation} label="You" />}
          {destinationLocation && <Marker position={destinationLocation} label="Destination" />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      {/* Form for entering destination */}
      <form onSubmit={handleDestinationSubmit} className="mt-4">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          className="border p-2 rounded-md w-full"
        />
        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded-md">Set Destination</button>
      </form>
    </div>
  );
};

export default Map;
