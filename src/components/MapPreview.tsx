import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

// Fix for default marker icon in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

interface MapPreviewProps {
  address: string;
  className?: string;
  height?: string;
  onAddressSelect?: (address: string, lat: number, lon: number) => void;
}

// Component to update map view when coordinates change
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export function MapPreview({
  address,
  className = '',
  height = '200px',
  onAddressSelect
}: MapPreviewProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayAddress, setDisplayAddress] = useState<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastAddressRef = useRef<string>('');

  // Debounced geocoding function
  const geocodeAddress = useCallback(async (searchAddress: string) => {
    if (!searchAddress || searchAddress.length < 3) {
      setCoordinates(null);
      setError(null);
      setDisplayAddress('');
      return;
    }

    // Skip if same address
    if (searchAddress === lastAddressRef.current) {
      return;
    }
    lastAddressRef.current = searchAddress;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Sentra-Scheduling-App'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const results: GeocodingResult[] = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const latNum = parseFloat(lat.toString());
        const lonNum = parseFloat(lon.toString());
        setCoordinates([latNum, lonNum]);
        setDisplayAddress(display_name);
        onAddressSelect?.(display_name, latNum, lonNum);
        setError(null);
      } else {
        setCoordinates(null);
        setError('Location not found');
        setDisplayAddress('');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Unable to find location');
      setCoordinates(null);
      setDisplayAddress('');
    } finally {
      setIsLoading(false);
    }
  }, [onAddressSelect]);

  // Debounce address changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      geocodeAddress(address);
    }, 500); // 500ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [address, geocodeAddress]);

  // Don't render anything if no address provided
  if (!address || address.length < 3) {
    return (
      <div
        className={`rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Enter an address to see map preview</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
          <p className="text-sm">Finding location...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`rounded-lg border border-dashed border-amber-300 dark:border-amber-600 flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 ${className}`}
        style={{ height }}
      >
        <div className="text-center text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-60" />
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-1 opacity-70">Try a more specific address</p>
        </div>
      </div>
    );
  }

  // Map view
  if (coordinates) {
    return (
      <div className={`rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
        <MapContainer
          center={coordinates}
          zoom={15}
          style={{ height, width: '100%' }}
          scrollWheelZoom={false}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coordinates} />
          <MapUpdater center={coordinates} />
        </MapContainer>
        {displayAddress && (
          <div className="px-3 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={displayAddress}>
              {displayAddress}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default MapPreview;
