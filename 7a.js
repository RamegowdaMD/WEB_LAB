
const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <h1>Engineering Branches</h1>
    <ul>
      <li><a href="/cse">(CSE)</a></li>
      <li><a href="/ece">(ECE)</a></li>
      <li><a href="/me">(ME)</a></li>
    </ul>
  `);
});

app.get('/cse', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cse.html'));
});

app.get('/ece', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ece.html'));
});

app.get('/me', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'me.html'));
});

app.listen(3000);
