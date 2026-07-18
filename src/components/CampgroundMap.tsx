'use client';

import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Info } from 'lucide-react';

interface CampgroundMapProps {
  coordinates: [number, number];
  title: string;
  location: string;
}

export default function CampgroundMap({ coordinates, title, location }: CampgroundMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapError, setMapError] = useState<string>('');

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!coordinates || coordinates.length !== 2) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoibW9jayJ9.mock';
    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11', // Beautiful clean light map
        center: coordinates,
        zoom: 9,
        cooperativeGestures: true,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapRef.current = map;

      map.on('load', () => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = '#0b6638';
        el.style.width = '18px';
        el.style.height = '18px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid #ffffff';
        el.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';
        el.style.cursor = 'pointer';

        const popupContent = `
          <div class="p-1">
            <h4 class="font-bold text-sm text-emerald-800 dark:text-emerald-400 mb-1 font-display">${title}</h4>
            <p class="text-xs text-foreground/70 flex items-center">📍 ${location}</p>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

        new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map);

        // Open popup by default
        popup.setLngLat(coordinates).addTo(map);
      });
    } catch (error: any) {
      console.error('Failed to initialize Mapbox Map:', error);
      setMapError(error.message || 'WebGL not supported or Mapbox failed to initialize.');
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates, title, location]);

  if (mapError) {
    return (
      <div className="w-full h-64 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center p-6 text-center">
        <Info className="h-7 w-7 text-primary-emerald mb-2" />
        <h4 className="font-bold mb-1">Map Offline</h4>
        <p className="text-xs text-foreground/50 max-w-xs">
          Interactive map could not load. This might be due to WebGL limitations or missing configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative h-[300px] rounded-3xl overflow-hidden border border-emerald-500/10 shadow-lg shadow-emerald-500/5">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
