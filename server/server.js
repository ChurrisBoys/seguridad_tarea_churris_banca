const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
// const {searchUsers} = requiere('./search');

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

  app.get('/api/posts', (req, res) => {
    fetchPosts(db, res);
  })

  app.post('/api/follows/:username', (req, res) => {
    followOrUnfollowUser(db, req, res);
  })

  app.get('/api/friends', (req, res) => {
    searchUsers(db, req, res);
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

function fetchPosts(db, res) {
  db.query('SELECT p.id, p.username, p.description, SUM(l.liked = 1) as likes, SUM(l.liked = 0) as dislikes \
  FROM Posts p \
  LEFT JOIN Likes l ON \
  l.post_id = p.id \
  GROUP BY p.id', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
}


function searchUsers(db, req, res) {
    const searchTerm = req.query.term;
    const currentUser = 'Emilia';  // For demonstration purposes, we're hardcoding this here.

    if (!searchTerm) {
        res.status(400).send('Search term is required');
        return;
    }

    // Enhanced query to check if the current user follows the found users
    const query = `
        SELECT u.username, 
               CASE WHEN f.user1 IS NOT NULL THEN true ELSE false END AS followed
        FROM Users u
        LEFT JOIN Follows f ON u.username = f.user2 AND f.user1 = ?
        WHERE u.username LIKE CONCAT(?, '%')`;

    db.query(query, [currentUser, searchTerm], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        res.json(results);
    });
}



function followOrUnfollowUser(db, req, res) {
  const follower = req.body.follower;
  const followedUser = req.params.username;

  // Check if both users exist
  const checkUsersExistQuery = 'SELECT * FROM Users WHERE username IN (?, ?)';
  db.query(checkUsersExistQuery, [follower, followedUser], (err, users) => {
      if (err) {
          console.error('Error checking user existence:', err);
          res.status(500).send('Database error.');
          return;
      }

      if (users.length !== 2) {
          res.status(400).send('One or both users do not exist.');
          return;
      }

      // Check if the follow relationship already exists
      const checkExistingFollowQuery = 'SELECT * FROM Follows WHERE user1 = ? AND user2 = ?';
      db.query(checkExistingFollowQuery, [follower, followedUser], (err, existingFollow) => {
          if (err) {
              console.error('Error checking existing follow:', err);
              res.status(500).send('Database error.');
              return;
          }

          if (existingFollow.length > 0) {
              // Relationship exists, so we want to unfollow
              const deleteFollowQuery = 'DELETE FROM Follows WHERE user1 = ? AND user2 = ?';
              db.query(deleteFollowQuery, [follower, followedUser], (err) => {
                  if (err) {
                      console.error('Error unfollowing user:', err);
                      res.status(500).send('Database error.');
                      return;
                  }
                  res.status(200).send('Successfully unfollowed user.');
              });
          } else {
              // Relationship does not exist, so create it
              const insertFollowQuery = 'INSERT INTO Follows (user1, user2) VALUES (?, ?)';
              db.query(insertFollowQuery, [follower, followedUser], (err) => {
                  if (err) {
                      console.error('Error following user:', err);
                      res.status(500).send('Database error.');
                      return;
                  }
                  res.status(200).send('Successfully followed user.');
              });
          }
      });
  });
}


