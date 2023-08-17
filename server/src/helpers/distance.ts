import { getDistance, orderByDistance } from 'geolib';
import { IGeoLocation, IItem } from '../types';
import { getUserGeoLocation } from '../models/user.model'

export async function distanceBetweenPoints ({ latitude, longitude }: IGeoLocation, items: IItem[]) {
  if (!items) return null;

  const itemsWithLocation: any = await Promise.all(items.map(async item => ({
    item,
    latitude: (await getUserGeoLocation(item.user)).latitude,
    longitude: (await getUserGeoLocation(item.user)).longitude
  })));
  const test = getDistance(
  { latitude, longitude },
  { latitude: itemsWithLocation[0].latitude, longitude: itemsWithLocation[0].longitude }
);

  const itemsWithDistance = itemsWithLocation.map((item: any) => ({
      item: item.item,
      distance: +(getDistance({ latitude, longitude }, { latitude: item.latitude, longitude: item.longitude }) / 1000).toFixed(1)
    })
  );
  // const itemsSortedByDistance = orderByDistance(user, itemsWithDistance)
  // return itemsSortedByDistance;
  console.log(test);
  return itemsWithDistance;
}

/*

// sort by distance, nearest first
geolib.orderByDistance({ latitude: 51.515, longitude: 7.453619 }, [
    { latitude: 52.516272, longitude: 13.377722 },
    { latitude: 51.518, longitude: 7.45425 },
    { latitude: 51.503333, longitude: -0.119722 },
]);

// Convert the distances to kilometers
const distancesInKm = distances.map((distance) => {
  const distanceInKm = convertDistance(distance, 'km');
  return distanceInKm;
});

*/