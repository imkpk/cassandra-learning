require('dotenv').config();
const express = require('express');
const cassandra = require('cassandra-driver');
// const expressCassandra = require('express-cassandra');
const path = require('path');
const secureConnectBundlePath = path.resolve(
  __dirname,
  'secure-connect-pratibhaone.zip'
);

const app = express();
app.use(express.json());

const client = new cassandra.Client({
  cloud: {
    secureConnectBundle: secureConnectBundlePath
  },
  credentials: {
    username: 'token',
    password: process.env.ASTRA_DB_APPLICATION_TOKEN
  },
  keyspace: 'default_keyspace' // Specify your keyspace here
});
// Express routes
app.get('/data', async (req, res) => {
  const query = 'SELECT * FROM posts_by_user';

  const userRawData = await client.execute(query);

  res.status(200).json(userRawData.rows);
});

// Start server
const port = 5000;
app.listen(port, async () => {
  try {
    await client.connect();
    console.log('------- connected to cassandra --------');
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('------- faied to connect-cassandra --------', error);
    process.exit(1);
  }
});
