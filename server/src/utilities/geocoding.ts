import axios from 'axios';
import dotenv from 'dotenv';
import { IAddress, IGeoLocation } from '../types';

dotenv.config();
const apiKey = process.env.GEO_API_KEY as string;

export default async function convertAddressToGeoCode(address: IAddress): Promise<IGeoLocation | null> {
  const stringifiedAddress = `${address.streetName} ${address.streetNumber}, ${address.postalCode} ${address.city}, Germany`;
  const encodedAddress = encodeURIComponent(stringifiedAddress);
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&components=country:DE&key=${apiKey}`;

  return axios
    .get(geocodingUrl)
    .then((response) => {
      const data: any = response.data;
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const geoLocation = {
          latitude: lat,
          longitude: lng,
        };
        return geoLocation;
      } else {
        console.error('Geocoding API request failed');
        return null
      }
    })
    .catch((error) => {
      console.error('Error making Geocoding API request:', error);
      return null
    });
}
