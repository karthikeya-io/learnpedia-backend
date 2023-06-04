// const redis = require('redis');

// const client = redis.createClient({
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: 'redis-13870.c264.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 13870
//     }
// });
// client.connect()
// client.on('connect', () => {
//     console.log('Connected to Redis!');
// }
// );

// // A function to get the max memory configuration value
// async function getMaxMemory() {
//     return new Promise((resolve, reject) => {
//       client.send_command('CONFIG', ['GET', 'maxmemory'], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(parseInt(result[1], 10));
//         }
//       });
//     });
//   }

// // A function to store data in Redis if the key's value size is less than the max memory size
// const storeDataIfSizeIsOk = async (key, value) => {
//     try {
//       const valueSizeInBytes = Buffer.byteLength(value, 'utf8');

//       // Get the maxmemory configuration value
//       const maxMemory = await getMaxMemory();

//       // Check if the value size is less than the Redis max memory size
//       if (valueSizeInBytes < maxMemory) {
//         client.set(key, value, (err) => {
//           if (err) {
//             console.error('Error setting the key:', err);
//           } else {
//             console.log('Key set successfully');
//           }
//         });
//       } else {
//         console.error('The value size exceeds the Redis max memory size');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }

// module.exports = client;
