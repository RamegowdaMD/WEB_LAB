const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const uri = "mongodb://127.0.0.1:27017";

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '12b.html'));
});

app.post('/submit', async (req, res) => {

  const { id, name, subject, marks } = req.body;
  const numericMarks = parseInt(marks);
  const eligibility_status = numericMarks < 20 ? "Not Eligible" : "Eligible";

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('mydb');
    const collection = db.collection('Students');

    await collection.insertOne({
      student_id: id,
      name,
      subject,
      marks: numericMarks,
      eligibility_status
    });

    client.close();

    console.log("Data inserted successfully");
    res.send("Student data submitted successfully! <a href='/'>Go Back</a>");
  }
   catch (error) {
    console.error("Database error:", error);
  }
});



app.get('/not-eligible', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('mydb');
    const collection = db.collection('Students');

    const notEligibleStudents = await collection
      .find({ eligibility_status: "Not Eligible" })
      .toArray();

    let responseHTML = `<h2>Not Eligible Students (Marks < 20)</h2><ul>`;
    notEligibleStudents.forEach((student) => {
      responseHTML += `<li>${student.name} (${student.marks} marks)</li>`;
    });
    responseHTML += `</ul><a href="/">Go Back</a>`;

    client.close();

    res.send(responseHTML);
  } catch (error) {
    console.error("Error fetching not eligible students:", error);
  }
});

app.listen(3000);
