import convertAddressToGeoCode from "../src/utilities/geocoding";
import { mockUserAddress } from "./mocks";
import {IGeoLocation} from '../src/types'

describe('Geo Coding utility function',  () => {
  test('should convert an address into a geocoded address', async () => {
    const result = await convertAddressToGeoCode(mockUserAddress);
    
    expect(result).toMatchObject<IGeoLocation>({
      latitude: expect.any(Number),
      longitude: expect.any(Number),
    })
  });
})