import axios from 'axios';
import dotenv from 'dotenv';
import { IAddress } from '../types';

dotenv.config();
const apiKey = process.env.GEO_API_KEY as string;

export default function convertAddressToGeoCode(
  address: IAddress
): Promise<any> {
  //convert address object into a single line address
  const stringifiedAddress = `${address.streetName} ${address.streetNumber}, ${address.postalCode} ${address.city}, Germany`;
  // encode the address to be sent over URI
  const encodedAddress = encodeURIComponent(stringifiedAddress);
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&components=country:DE&key=${apiKey}`;

  // make call to google api
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
      }
    })
    .catch((error) => {
      console.error('Error making Geocoding API request:', error);
    });
}
