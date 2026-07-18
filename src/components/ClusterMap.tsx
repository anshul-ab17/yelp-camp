'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
// @ts-ignore
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Info } from 'lucide-react';

interface MapCampground {
  _id: string;
  title: string;
  location: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface ClusterMapProps {
  campgrounds: MapCampground[];
}

export default function ClusterMap({ campgrounds }: ClusterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapError, setMapError] = useState<string>('');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoibW9jayJ9.mock';
    mapboxgl.accessToken = token;

    try {
      // Find center coordinate based on campgrounds
      let center: [number, number] = [-98.5795, 39.8283]; // USA Center default
      if (campgrounds.length > 0) {
        // Average coordinates for center
        const totalCoords = campgrounds.reduce(
          (acc, camp) => {
            if (camp.geometry?.coordinates?.length === 2) {
              acc[0] += camp.geometry.coordinates[0];
              acc[1] += camp.geometry.coordinates[1];
              acc[2]++;
            }
            return acc;
          },
          [0, 0, 0]
        );
        if (totalCoords[2] > 0) {
          center = [totalCoords[0] / totalCoords[2], totalCoords[1] / totalCoords[2]];
        }
      }

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v12', // Beautiful outdoors style
        center: center,
        zoom: campgrounds.length > 1 ? 3 : 5,
        cooperativeGestures: true, // Pinch/zoom easily on touch devices
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapRef.current = map;

      // Wait for map to load to add markers
      map.on('load', () => {
        campgrounds.forEach((campground) => {
          if (!campground.geometry || !campground.geometry.coordinates) return;

          const [lng, lat] = campground.geometry.coordinates;

          // Create a custom element for the marker
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.backgroundColor = '#0b6638';
          el.style.width = '14px';
          el.style.height = '14px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid #ffffff';
          el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
          el.style.cursor = 'pointer';

          // Popup HTML content
          const popupContent = `
            <div class="p-1">
              <h4 class="font-bold text-sm text-emerald-800 dark:text-emerald-400 mb-1 font-display">${campground.title}</h4>
              <p class="text-xs text-foreground/70 mb-2 flex items-center"><span class="mr-1">📍</span>${campground.location}</p>
              <a href="/campgrounds/${campground._id}" class="inline-flex items-center text-xs font-semibold text-primary-emerald hover:underline">
                View Details <span class="ml-1">→</span>
              </a>
            </div>
          `;

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

          new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map);
        });
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
  }, [campgrounds]);

  if (mapError) {
    return (
      <div className="w-full h-80 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center p-6 text-center">
        <Info className="h-8 w-8 text-primary-emerald mb-2" />
        <h4 className="font-bold mb-1">Interactive Map Offline</h4>
        <p className="text-xs text-foreground/50 max-w-sm">
          Mapbox cluster map could not load. This might be due to WebGL limitations or missing configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative h-[400px] rounded-3xl overflow-hidden border border-emerald-500/10 shadow-lg shadow-emerald-500/5">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
