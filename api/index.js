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

  // start コマンド経由で GUI アプリを起動しつつログを全部拾う
  exec(`start "" "${SUNSHINE_PATH}"`, { shell: 'cmd.exe' }, (error, stdout, stderr) => {
    console.log("===== Sunshine 起動ログ =====");
    if (error) {
      console.error("Error object:", error);
    }
    if (stdout) {
      console.log("STDOUT:", stdout);
    }
    if (stderr) {
      console.error("STDERR:", stderr);
    }
    console.log("=============================");

    if (error) {
      return res.status(500).send('Sunshine の起動に失敗しました');
    }
    res.send('Sunshine を起動しました 🚀');
  });
});

app.listen(PORT, () => {
  console.log(`Sunshine API running at http://localhost:${PORT}`);
});
