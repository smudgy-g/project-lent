import { IItem } from "../src/types";
import { getItemLocations } from "../src/utilities/location";
import { mockGeoLocation, mockItem1, mockItem2 } from "./mocks";

const getItemLocationsMock = jest.fn().mockResolvedValue(mockGeoLocation);

jest.mock('../src/utilities/location', () => {
  const originalModule = jest.requireActual('../src/utilities/location');
  return {
    ...originalModule,
    getItemLocations: getItemLocationsMock,
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Location utility module', () => {
  describe('Get item locations function', () => {
    test('Should return a new array of items objects with locations', async () => {
      const result = await getItemLocations([mockItem1, mockItem2] as IItem[]);
      expect(result).toHaveLength(2);
      result?.forEach((item) => {
        expect(item.item).toBeDefined();
        expect(item.location).toEqual(mockGeoLocation);
      })
    });

    test('Should return null if no items are supplied', () => {
      expect(getItemLocations([] as IItem[])).toBe(null)
    })
  })
})