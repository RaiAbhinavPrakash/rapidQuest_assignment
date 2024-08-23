const { MongoClient } = require("mongodb");

require("dotenv").config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let client;

async function getDatabase() {
  if (!client || !client.topology || !client.topology.isConnected()) {
    client = await MongoClient.connect(uri);
  }
  return client.db(dbName);
}

module.exports = { getDatabase };
