// api.js
require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const SUNSHINE_PATH = process.env.SUNSHINE_PATH;

app.get('/start-sunshine', (req, res) => {
  if (req.query.key !== API_KEY) {
    return res.status(403).send('Forbidden');
  }

  exec(`"${SUNSHINE_PATH}"`, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Sunshine の起動に失敗しました');
    }
    res.send('Sunshine を起動しました 🚀');
  });
});

app.listen(PORT, () => {
  console.log(`Sunshine API running at http://localhost:${PORT}`);
});
