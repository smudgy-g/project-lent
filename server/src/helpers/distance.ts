import { getDistance } from 'geolib';
import { IGeoLocation, IItem } from '../types';
import { getUserGeoLocation } from '../models/user.model'

export async function distanceBetweenPoints ({ latitude, longitude }: IGeoLocation, items: IItem[]) {
  if (!items) return null;

  const itemsWithLocation: any = await Promise.all(items.map(async item => ({
    item,
    location: (await getUserGeoLocation(item.user))
  })));
  
  const itemsWithDistance = itemsWithLocation.map((item: any) => ({
      item: item.item,
      distance: +(getDistance({ latitude, longitude }, { latitude: item.location.latitude, longitude: item.location.longitude }) / 1000).toFixed(1)
    })
  );

  return itemsWithDistance.sort((a: any, b: any) => b.distance - a.distance);
}
