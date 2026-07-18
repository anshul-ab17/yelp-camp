'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

interface CampgroundMapProps {
  coordinates: [number, number];
  title: string;
  location: string;
}

export default function CampgroundMap({ coordinates, title, location }: CampgroundMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;
    if (!coordinates || coordinates.length !== 2) return;

    const [lng, lat] = coordinates;
    if (isNaN(lat) || isNaN(lng)) {
      setMapError('Invalid coordinates');
      return;
    }

    // Import Leaflet on client-side
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      try {
        if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: [lat, lng],
            zoom: 11,
            scrollWheelZoom: false,
          });

          // Add free open-source Mapbox-independent Voyager tile layer
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
          }).addTo(map);

          // Add custom pinging marker
          const customIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `<div class="relative flex items-center justify-center">
              <div class="absolute h-6 w-6 rounded-full bg-emerald-500 animate-ping opacity-60"></div>
              <div class="h-5 w-5 rounded-full bg-primary-emerald border-2 border-white shadow-lg"></div>
            </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const popupContent = `
            <div style="font-family: sans-serif; min-width: 140px; padding: 2px;">
              <h4 style="margin: 0 0 4px 0; font-weight: 700; color: #0b6638; font-size: 13px;">${title}</h4>
              <p style="margin: 0; color: #666; font-size: 11px;">📍 ${location}</p>
            </div>
          `;

          const marker = L.marker([lat, lng], { icon: customIcon })
            .bindPopup(popupContent)
            .addTo(map);

          // Auto-open popup
          marker.openPopup();

          mapInstanceRef.current = map;
        } else {
          // Update center if coordinates changed
          mapInstanceRef.current.setView([lat, lng], 11);
        }
      } catch (err: any) {
        console.error('Leaflet single map error:', err);
        setMapError(err.message || 'Map failed to load');
      }
    });

    return () => {
      // Clean up map instance on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, coordinates, title, location]);

  if (mapError) {
    return (
      <div className="w-full h-64 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center p-6 text-center">
        <Info className="h-7 w-7 text-primary-emerald mb-2" />
        <h4 className="font-bold mb-1">Map Offline</h4>
        <p className="text-xs text-foreground/50 max-w-xs">
          Interactive map could not load. Coordinates may be missing or invalid.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative h-[300px] rounded-3xl overflow-hidden border border-emerald-500/10 shadow-lg shadow-emerald-500/5">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          border: 1px solid rgba(11, 102, 56, 0.15);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          padding: 4px !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
