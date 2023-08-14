const jwt = require('jsonwebtoken');
// import dotenv from 'dotenv';

// dotenv.config();

const secretKey = 'hifflefwiff';

// Define the payload for the JWT
const payload = {
  userId: '64d9d93e41cc9c4828c4589e',
  geoLocation: {
    lat: 52.5075201,
    lng: 13.3778567
  },
};

// Generate the JWT
const token = jwt.sign(payload, secretKey);

console.log(token);