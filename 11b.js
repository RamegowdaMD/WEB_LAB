const express = require('express')
const {MongoClient} = require('mongodb')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
const uri = "mongodb://127.0.0.1:27017";


app.get('/',async (req , res )=>
{
    res.sendFile(path.join(__dirname , '11b.html'));
})


app.post('/submit' , async (req , res)=>
{
    const {name, usn, dept, attendance }  = req.body;
    const AttendenceMarks = parseInt(attendance);
    try{
        const client = await MongoClient.connect(uri);
        const db = client.db('mydb');
        const collection = db.collection('Attendence');

        await collection.insertOne({name, usn, dept, attendance:AttendenceMarks });
        console.log("data inserted successfully");
        res.send(`data inserted successfully <a href="/">Go back To Home</a>`)
    }
    catch(error)
    {
        console.error(error);
    }
})

app.get('/details' , async(req  , res )=>
{
    try{
        const client = await MongoClient.connect(uri);
        const db = client.db('mydb');
        const collection = db.collection('Attendence');

        const result =  await collection.find({attendance : {$lt : 75 }}).toArray();
        let html = `<h2>Not Eligible Students (Attendance < 75%)</h2><ul>`;
        result.forEach(student => {
            html += `<li>${student.name} - ${student.attendance}</li>`;
        });
        html += `</ul><a href="/">Go Back</a>`;

        res.send(html);
    }
    catch(e)
    {
        console.log(e);
    }
})


app.listen(3000);
