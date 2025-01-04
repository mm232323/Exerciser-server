const { MongoClient } = require("mongodb");
const uri = require("./atlas-uri");
const client = new MongoClient(uri);
const connectToDB = async () => {
  try {
    await client.connect();
    console.log(`Connected to Exerciser database 💪💪💪`);
  } catch (err) {
    console.log("Error occured when connecting to DB: " + err);
  }
};

const db = client.db("Exerciser");

module.exports = { connectToDB, client, db };
