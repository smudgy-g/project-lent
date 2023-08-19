import jwt from 'jsonwebtoken';
import { generateJWT } from '../src/utilities/webToken';
import { IGeoLocation } from '../src/types';
import { mockUserId, mockGeoLocation } from './mocks'
import dotenv from 'dotenv';

jest.mock('jsonwebtoken');

dotenv.config({ path: '.env.test' });

describe('JWT generate function', () => {
  test('should generate a valid JJWT token.', () => {
    const mockToken = 'mock-token';
    (jwt.sign as jest.Mock).mockReturnValueOnce(mockToken);

    const result = generateJWT(mockUserId, mockGeoLocation);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: mockUserId,
        geoLocation: mockGeoLocation
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d'}
    );
    
    expect(result).toBe(mockToken);
   })
})