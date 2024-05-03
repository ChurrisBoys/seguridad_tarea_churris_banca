const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3001;

// Setting up the database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'churris',
  password: 'password',
  database: 'churrisbanca_social'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Successfully connected to the database as ID ' + db.threadId);
});

function startServer(db) {
  app.use(cors());
  app.use(express.json());

  app.get('/api/users', (req, res) => {
    fetchUsers(db, res);
  })

  app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the Node.js backend!' });
  });

  prepareDependencies();
  startListening();
}

function prepareDependencies() {
  // add more dependencies here
}

function startListening() {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer(db);

function fetchUsers(db, res) {
  db.query('SELECT * FROM Users', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results);
  });
}



