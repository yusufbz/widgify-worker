import express from "express"
import path from "path"

const app = express();

// Define a route to handle GET requests
const __dirname = path.resolve();


// Define a route to handle GET requests
app.get('/worker', (req, res) => {
  // Send the file as a response
  res.sendFile(__dirname + '/index.js');
});

app.get('/styles', (req, res) => {
  // Send the file as a response
  res.sendFile(__dirname + '/src/styles/styles.css');
});

// Start the server
const PORT = process.env.PORT || 9935;
app.listen(PORT, () => {
  console.log(`Worker is running on port ${PORT}`);
});