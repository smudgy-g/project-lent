import mongoose, { Types } from 'mongoose';
import app from '../src/index';
import request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { mockGeoLocation, mockNewUser, mockUserAddress, mockUserId, mockUserUpdatePayload } from './mocks';
import { generateJWT } from '../src/utilities/webToken';
import connectDb from '../src/models/_index';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

beforeAll((done) => {
  connectDb()
    .then(() => {
      console.log('database connected');
      done();
    })
    .catch((error: Error) => {
      console.error('MongoDB connection error:', error);
      done(error);
    });
});

afterAll((done) => {
  mongoose.disconnect()
    .then(() => {
      console.log('database disconnected');
      done();
    })
    .catch((error) => {
      console.error('Failed to disconnect from database:', error);
      done(error);
    });
});

jest.mock('jsonwebtoken', () => {
  let callCount = 0;
  return {
    sign: jest.fn().mockImplementation(({ userId, location }) => {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGUwY2VlMTI3OTYzNDVlMDVmZjg3ZWUiLCJnZW9Mb2NhdGlvbiI6eyJsYXRpdHVkZSI6NTIuNTM5MzM3LCJsb25naXR1ZGUiOjEzLjQyNTIzNX0sImlhdCI6MTY5MjYzMzcyMywiZXhwIjoxNjkyNzIwMTIzfQ.4daBg7FlF3AYzg9e_ZIz4D9v2xpAqqCuK5ad__LYJ0Q'
    }),
    verify: jest.fn().mockImplementation((token, secretKey) => {
      return jwt.decode(token);
    })
  }
})

describe('Server', () => {

  test('Server works', async () => {
    const mockListen = jest.fn();
    app.listen = mockListen;

    require('../src/server');
    expect(mockListen.mock.calls.length).toBe(1);
    expect(mockListen.mock.calls[0][0]).toBe(process.env.PORT || 3000);

    mockListen.mockReset();
  });

  test('Should return 404 when accessing unknown endpoints', async () => {
    const response = await request(app.callback()).get('/unknown');
    expect(response.statusCode).toBe(404);
  });

  test('Should return 200 when accessing known endpoint.', async () => {
    const response = await request(app.callback()).get('/test');
    expect(response.statusCode).toBe(200);
  });
});
  
describe('Test database connection', () => {

  it('should establish a connection to the MongoDB database', (done) => {
    if (mongoose.connection.readyState === 1) {
      expect(mongoose.connection.readyState).toBe(1);
      done();
    } else {
      mongoose.connection.on('connected', () => {
        expect(mongoose.connection.readyState).toBe(1);
        done();
      });
      mongoose.connection.on('error', (error) => {
        done(error);
      });
    }
  });
});

describe('User API endpoints', () => {
  let newUserId: Types.ObjectId;
  let jwtToken: any
  test('Should create a new user', async () => {
    const response = await request(app.callback()).post('/register').send(mockNewUser).expect(201);
    expect(response.body.username).toBe(mockNewUser.username);
    newUserId = response.body._id;
    const mockUserId = newUserId && newUserId.toString();
    jwtToken = jwt.sign(
      {
        userId: mockUserId,
        geoLocation: mockGeoLocation,
      },
      'hifflefwiff'
    );
  });

  test('Should find new user', async () => {
    const mockUserId = newUserId && newUserId.toString();
    
    const response = await request(app.callback()).get(`/user/${mockUserId}`)
    expect(response.body.username).toBe(mockNewUser.username);
  })

  test('Should delete a user', async () => {
    
    const response = await request(app.callback()).delete('/user').set('Cookie', `token=${jwtToken}`).send(mockNewUser).expect(200);
    expect(response.body.success).toBe(true);
  });
});