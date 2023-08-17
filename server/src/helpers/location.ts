import { getDistance } from 'geolib';
import { IGeoLocation, IItem } from '../types';
import { getUserGeoLocation } from '../models/user.model'

export async function getItemLocations (items: IItem[]) {
  if (!items) return null;

  return await Promise.all(items.map(async item => ({
    item,
    location: (await getUserGeoLocation(item.user))
  })));
}

export async function sortByDistanceFromUser ({ latitude, longitude }: IGeoLocation, items: any[]) {
  const itemsWithDistance = items.map((item: any) => ({
      item: item.item,
      distance: +(getDistance({ latitude, longitude }, { latitude: item.location.latitude, longitude: item.location.longitude }) / 1000).toFixed(1)
    })
  );

  return itemsWithDistance.sort((a: any, b: any) => a.distance - b.distance);
}

