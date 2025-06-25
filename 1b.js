const express = require('express')
const { MongoClient } = require('mongodb')
const path = require('path')

const app = express();
const uri = "mongodb://127.0.0.1:27017";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '1b.html'));
});

app.post('/insert', async (req, res) => {
  const { user, issue } = req.body;
  const client = await MongoClient.connect(uri);
  const collection = client.db('mydb').collection('complaints');

  await collection.insertOne({ user, issue, status: "pending" });
  await client.close();
  res.send("Data inserted successfully");
});

app.post('/update', async (req, res) => {
  const { user, status } = req.body;
  const client = await MongoClient.connect(uri);
  const collection = client.db('mydb').collection('complaints');

  const result = await collection.findOneAndUpdate(
    { user: user },
    { $set: { status } },
    { returnDocument: 'after' }
  );

  await client.close();
  res.send(result);
});

app.get('/pending', async (req, res) => {
  const client = await MongoClient.connect(uri);
  const collection = client.db('mydb').collection('complaints');

  const result = await collection.find({ status: 'pending' }).toArray();
  await client.close();
  res.send(result);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
