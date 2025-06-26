const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'studentDB';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let studentCollection;

client.connect().then(() => {
  const db = client.db(dbName);
  studentCollection = db.collection('students');
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error:', err);
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '5b.html'));
});


app.post('/submit', async (req, res) => {
  const { name, usn, department, grade } = req.body;
  if (!name || !usn || !department || !grade) {
    return res.send('<h3>All fields required.</h3><a href="/">Back</a>');
  }
  try {
    await studentCollection.insertOne({ name, usn, department, grade });
    res.send('<h3>Student record added.</h3><a href="/">Back</a>');
  } catch {
    res.status(500).send('<h3>Error inserting data.</h3><a href="/">Back</a>');
  }
});


app.put('/update-grade', async (req, res) => {
  const { name, grade } = req.body;
  try {
    const result = await studentCollection.updateOne(
      { name },
      { $set: { grade } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: '✅ Grade updated successfully' });
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.post('/students', async (req, res) => {
    try {
      const records = await studentCollection.find().toArray();
  
      let html = `<h2>All Student Records</h2><ul>`;
      records.forEach(s => {
        html += `<li>${s.name} (${s.usn}) - ${s.department} - Grade: ${s.grade}</li>`;
      });
      html += `</ul><a href="/">Back</a>`;
  
      res.send(html);
    } catch {
      res.status(500).send('<h3>Failed to fetch students.</h3><a href="/">Back</a>');
    }
  });
  
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


