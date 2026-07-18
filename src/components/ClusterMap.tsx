'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface MapCampground {
  _id: string;
  title: string;
  location: string;
  price: number;
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
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    // Dynamically import Leaflet on client-side
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      if (!mapInstanceRef.current) {
        // Setup map centered on USA
        const map = L.map(mapContainerRef.current, {
          center: [39.8283, -98.5795],
          zoom: 4,
          scrollWheelZoom: true,
        });

        // Add free OpenStreetMap tile layer (zero tokens needed!)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        mapInstanceRef.current = map;
        markersGroupRef.current = L.featureGroup().addTo(map);
      }

      const map = mapInstanceRef.current;
      const markersGroup = markersGroupRef.current;

      // Clear existing markers
      markersGroup.clearLayers();

      if (campgrounds.length === 0) return;

      const bounds: any[] = [];

      campgrounds.forEach((camp) => {
        const [lng, lat] = camp.geometry.coordinates;
        if (isNaN(lat) || isNaN(lng)) return;

        // Custom divIcon styled with Tailwind
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div class="relative flex items-center justify-center">
            <div class="absolute h-5 w-5 rounded-full bg-emerald-500 animate-ping opacity-60"></div>
            <div class="h-4.5 w-4.5 rounded-full bg-primary-emerald border-2 border-white shadow-md"></div>
          </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const popupContent = `
          <div style="font-family: sans-serif; min-width: 140px; padding: 2px;">
            <h4 style="margin: 0 0 4px 0; font-weight: 700; color: #0b6638; font-size: 13px;">${camp.title}</h4>
            <p style="margin: 0 0 6px 0; color: #666; font-size: 11px; display: flex; align-items: center;">📍 ${camp.location}</p>
            <div style="display: flex; align-items: center; justify-between; border-top: 1px solid #eee; padding-top: 6px; margin-top: 4px;">
              <span style="font-weight: 700; color: #333; font-size: 11px;">$${camp.price}/night</span>
              <a href="/campgrounds/${camp._id}" style="color: #0b6638; font-weight: 600; text-decoration: none; font-size: 11px; margin-left: auto;">Details &rarr;</a>
            </div>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: customIcon })
          .bindPopup(popupContent)
          .addTo(markersGroup);

        bounds.push([lat, lng]);
      });

      // Fit map to markers bounds
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
      }
    });
  }, [isClient, campgrounds]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      {/* Styles for Leaflet popups */}
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
        .leaflet-popup-close-button {
          top: 6px !important;
          right: 6px !important;
          color: #999 !important;
        }
      `}</style>
    </div>
  );
}
