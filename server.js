const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`The Temperamental Glass is running at http://localhost:${port}`);
  console.log(`Press Ctrl+C to stop the server.`);
});