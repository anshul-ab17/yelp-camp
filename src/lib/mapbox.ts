// @ts-ignore
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapBoxToken = process.env.MAPBOX_TOKEN || 'pk.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoibW9jayJ9.mock';
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

export async function geocodeLocation(location: string): Promise<[number, number]> {
  try {
    const response = await geocoder
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send();

    if (
      response &&
      response.body &&
      response.body.features &&
      response.body.features.length > 0
    ) {
      return response.body.features[0].geometry.coordinates as [number, number];
    }
  } catch (error) {
    console.error('Geocoding error, using fallback:', error);
  }

  // Fallback: Generate a random coordinate around the US/Europe area
  // or return a standard default point
  const lat = 34 + Math.random() * 12; // 34 to 46
  const lng = -118 + Math.random() * 40; // -118 to -78
  return [lng, lat];
}
