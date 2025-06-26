// app.js
const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "courseDB";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let enrollments;

client
  .connect()
  .then(() => {
    const db = client.db(dbName);
    enrollments = db.collection("enrollments");
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ Connection error:", err);
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "7b.html"));
});


app.post("/submit", async (req, res) => {
  const { studentId, name, courseName, duration, status } = req.body;

  try {
    await enrollments.insertOne({
      studentId,
      name,
      courseName,
      duration,
      status,
    });

    res.send('<h3>Enrollment submitted.</h3><a href="/">Back</a>');
  } catch {
    res.status(500).send('<h3>Error inserting data.</h3><a href="/">Back</a>');
  }
});



app.put("/update-status", async (req, res) => {
  const { studentId, courseName } = req.body;
  try {
    const query = studentId ? { studentId } : { courseName };
    const result = await enrollments.updateOne(query, {
      $set: { status: "completed" },
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.json({ message: "Status updated to completed." });
  } 
  catch {
    res.status(500).json({ error: "Update failed" });
  }
});




app.get("/active", async (req, res) => {
    try {
      const active = await enrollments.find({ status: "active" }).toArray();
  
      let html = `<h2>Active Enrollments</h2><ul>`;
      active.forEach(e => {
        html += `<li>${e.name} (${e.studentId}) - ${e.courseName}</li>`;
      });
      html += `</ul><a href="/">Back</a>`;
  
      res.send(html);
    } catch {
      res.status(500).send("Error fetching data");
    }
  });





const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
