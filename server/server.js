const express = require('express');
const cors = require('cors'); 

const app = express();
const port = 3001; 

app.use(cors()); 
app.use(express.json()); 


app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the Node.js backend!' });
});

app.listen(port, () => {
  console.log("Server listening on port ${port}");
});