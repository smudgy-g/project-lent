import mongoose from 'mongoose';
import app from '../src/index';
import request from 'supertest';
// import connectDb from '../src/models/_index';
import jwt from 'jsonwebtoken';
import { mockGeoLocation, mockUserId, mockUserUpdatePayload } from './mocks';
import { generateJWT } from '../src/utilities/webToken';




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

describe('User endpoints', () => {
  
  test('Should return 401 if the user is not logged in', async () => {
    const { statusCode } = await request(app.callback()).put('/user').timeout(10000);
    expect(statusCode).toBe(401);
  });
  
  test('Should return 200 if the user is logged in', async () => {
    const jwt = generateJWT(mockUserId, mockGeoLocation);

    const { statusCode, body } = await request(app.callback()).put('/user')
      .set('Cookie', [`jwt=${jwt}`])
      .send(mockUserUpdatePayload);
    expect(statusCode).toBe(200);
    expect(body).toEqual({});
  });


  // test('Should return 200', async () => {
  //   const userId = '64e0cee12796345e05ff87ec'
  //   const response = await request(app.callback()).get(`/user/${userId}`);
  //   expect(response.body).toBeDefined();
  // });


})