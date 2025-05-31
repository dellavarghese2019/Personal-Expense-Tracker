const { MongoClient } = require('mongodb');

let db;

async function connectToDB() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db('expensesdb'); // use your actual DB name here
  console.log('🟢 Connected to MongoDB');
}

function getDB() {
  if (!db) {
    throw new Error('❌ DB not initialized. Call connectToDB() first.');
  }
  return db;
}

module.exports = { connectToDB, getDB };
