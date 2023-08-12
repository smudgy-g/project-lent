import fetch from 'node-fetch'
import dotenv from 'dotenv';
import { IAddress } from '../models/user.schema';

dotenv.config();

const apiKey = process.env.GEO_API_KEY as string;

export function convertAddressToGeoCode(address: IAddress) {
  //convert address object into a single line address
  const stringifiedAddress = `${address.streetName} ${address.streetNumber}, ${address.postalCode} ${address.city}, Germany`;
  // encode the address to be sent over URI
  const encodedAddress = encodeURIComponent(stringifiedAddress);
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&components=country:DE&key=${apiKey}`;
  
  fetch(geocodingUrl)
    .then((response) => response.json())
    .then((data: any) => {
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, long } = data.results[0].geometry.location;
        // Store lat and long in database
        console.log('Latitude:', lat);
        console.log('Longitude:', long);
        return { lat: lat, long: long };
      } else {
        console.error('Geocoding API request failed');
      }
    })
    .catch((error) => {
      console.error('Error making Geocoding API request:', error);
    });
}

