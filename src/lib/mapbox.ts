/**
 * Open-source geocoding service using OpenStreetMap Nominatim API (no tokens needed!).
 */
export async function geocodeLocation(location: string): Promise<[number, number]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'YelpCampNextjsApp/1.0 (campsites directory geocoding helper)',
      },
    });

    const data = await response.json();

    if (data && data.length > 0) {
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);
      if (!isNaN(lon) && !isNaN(lat)) {
        return [lon, lat];
      }
    }
  } catch (error) {
    console.error('Nominatim open geocoding error, using fallback:', error);
  }

  // Fallback: Generate a random coordinate around the US area
  const lat = 34 + Math.random() * 12; // 34 to 46
  const lng = -118 + Math.random() * 40; // -118 to -78
  return [lng, lat];
}
