import axios from 'axios';
// staging server
export default axios.create({
  baseURL: 'https://api.carny.io/api/v1',
});

// // Local
// export const server_url = "http://127.0.0.1:4000/";

// aws s3 bucket confiurations
export const awsRegion = 'eu-central-1';
export const awsIdentityPoolId =
  'eu-central-1:949b9487-ed35-4eb3-a2d3-1866e6ad890b';
export const awsBucket = 'avangrat-development';

// set expiry time for the localstorage/cookie data
export const expiryTime = 2; // 2 hours


// Instragram config 
export const client_id = '4418122684888051';
export const redirect_url = 'https://api.carny.io/user/edit-profile/';