require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 47823;
const API_KEY = process.env.API_KEY;
const SERVICE_NAME = process.env.SERVICE_NAME;  

// 汎用関数
function runServiceCommand(command, res) {
  exec(`powershell -Command "${command}"`, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.error("STDERR:", stderr);

    if (error) {
      console.error("Error:", error);
      return res.status(500).send(`❌ サービス操作に失敗しました: ${stderr || error.message}`);
    }
    res.send(`✅ サービスを操作しました: ${stdout}`);
  });
}

// Sunshine 起動
app.get('/sunshine/start', (req, res) => {
  if (req.query.key !== API_KEY) return res.status(403).send('Forbidden');
  runServiceCommand(`Start-Service -Name ${SERVICE_NAME}`, res);
});

// Sunshine 停止
app.get('/sunshine/stop', (req, res) => {
  if (req.query.key !== API_KEY) return res.status(403).send('Forbidden');
  runServiceCommand(`Stop-Service -Name ${SERVICE_NAME}`, res);
});

// 状態確認
app.get('/sunshine/status', (req, res) => {
  if (req.query.key !== API_KEY) return res.status(403).send('Forbidden');
  runServiceCommand(`Get-Service -Name ${SERVICE_NAME} | Select-Object Status`, res);
});

app.listen(PORT, () => {
  console.log(`Sunshine API running at http://localhost:${PORT}`);
});
