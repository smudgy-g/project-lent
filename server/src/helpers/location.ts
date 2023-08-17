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
      _id: item.item._id,
      user: item.item.user,
      name: item.item.name,
      img_url: item.item.img_url,
      value: item.item.value,
      description: item.item.description,
      lendable: item.item.lendable,
      available: item.item.available,
      collections: item.item.collections,
      borrowed: item.item.borrowed, 
      distance: +(getDistance({ latitude, longitude }, { latitude: item.location.latitude, longitude: item.location.longitude }) / 1000).toFixed(1)
    })
  );

  return itemsWithDistance.sort((a: any, b: any) => a.distance - b.distance);
}

