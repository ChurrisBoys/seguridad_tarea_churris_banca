const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config({ path: './secrets.env'});

// Packages for image processing
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

// Routers for the different functionalities
const createAuthRouter = require('./apps/auth/authEntry');

// Middleware
const authenticateToken = require('./libraries/Session/authMiddleware');

//Services
const UserService = require('./apps/user/userService');

const app = express();
const port = 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const upload = multer({ dest: 'userPostImages/' }); // Destination folder to store the images received

// Setting up the database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

const jwtSecretKey = process.env.JWT_SECRET;

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

  prepareDependencies();

  app.get('/api/users', (req, res) => {
    fetchUsers(db, res);
  })

  app.post('/api/createpost', authenticateToken, upload.single('user_image'), (req, res) => {
    createPosts(db, req, res);
  })

  app.get('/api/posts', authenticateToken , (req, res) => {
    fetchPosts(db, req, res);
  })

  app.post('/api/posts/liked', authenticateToken, (req, res) => {
    likeOrDislikePost(db, req, res);
  })

  app.get('/api/posts/', (req, res) => {
    fetchPostsFromUser(db, req, res);
  })

  app.get('/api/follows/:username', authenticateToken, (req, res) => {
    followOrUnfollowUser(db, req, res);
  })

  app.get('/api/friends', authenticateToken, (req, res) => {
    searchUsers(db, req, res);
  })
  
  app.post('/getBalance', async (req, res) => {
    getBalance(db, req, res);
  })

  
  app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the Node.js backend!' });
  })

  app.get('/api/profile/:username', (req, res) => {
    fetchUserData(db, req, res);
  })

  app.put('/api/profile/:username', (req, res) => {
    updateProfile(db, req, res);
  })

  startListening();
}


function prepareDependencies() {
  // add more dependencies here
  app.use('/auth', createAuthRouter(new UserService(db), jwtSecretKey));

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

function createPosts(db, req, res) {
  const binaryImageData = null;
  const file = req.file;

  const createPost = (req, binaryImageData) => {
    // Creating the Post
    const createPostQuery = 'INSERT INTO churrisbanca_social.Posts (username,description,image) VALUES (?,?,?);';
    db.query(createPostQuery, [req.user.username, req.body.user_description, binaryImageData], (err, results) => {
      if (err) {
        res.status(500).send('Error creating Post, image may be too big');
        return;
      }
      res.status(200).json('Post created succesfully');
    });
  }
  // Use fs.readFile to read the image file
  const processImage = (req) => {
    fs.readFile(req.file.path, (err, readBinaryImageData) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      createPost(req, readBinaryImageData);
    });
  }

  if (file !== undefined)
    processImage(req);
  else
    createPost(req, null);
}

function fetchPosts(db, req, res) {
  const currentUser = '\'' + req.user.username + '\'';
  const postFromFollowingQuery = `
    SELECT p.id, p.username, p.description, SUM(l.liked = 1) as likes, p.image, SUM(l.liked = 0) as dislikes
    FROM Posts p
    LEFT JOIN Likes l ON
    l.post_id = p.id
    WHERE p.username IN (SELECT u.user2 FROM Follows u WHERE u.user1 = ${currentUser})
    GROUP BY p.id`;
  
  db.query(postFromFollowingQuery, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
}

function likeOrDislikePost(db, req, res) {
  const post_liker = '\'' + req.user.username + '\'';
  const post_id = req.query.post_id;
  const post_creator = '\'' + req.query.post_creator + '\'';
  const liked = req.query.liked;

  // Query to know if there was already a like or dislike to this post from the post_liker
  const likesQuery = `SELECT * FROM Likes l
  WHERE l.username = ${post_liker}
  AND l.post_id = ${post_id}
  AND l.post_creator = ${post_creator}`;
  db.query(likesQuery, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching likes');
      return;
    }

    // If the user already liked or disliked the post and clicked the same button, then remove its reaction
    if (results.length > 0 && results[0].liked === parseInt(liked)) {
      const deleteQuery = `DELETE FROM Likes
      WHERE username = ${post_liker}
      AND post_id = ${post_id}
      AND post_creator = ${post_creator}`;
      db.query(deleteQuery, (err, results) => {
        if (err) {
          res.status(500).send('Error removing reaction');
          return;
        }
        res.json(results);
      });
    }

    // If the post_liker already had a reaction to the post, then update the value
    else if (results.length > 0) {
      const updateQuery = `UPDATE Likes l
      SET l.username = ${post_liker}
      , l.post_id = ${post_id}
      , l.post_creator = ${post_creator}
      , l.liked = ${liked}
      WHERE l.username = ${post_liker}
      AND l.post_id = ${post_id}
      AND l.post_creator = ${post_creator}`;
      db.query(updateQuery, (err, results) => {
        if (err) {
          res.status(500).send('Error updating likes');
          return;
        }
        res.json(results);
      });
    }
    // If there wasn't any reaction in the database, then create it
    else {
      const insertQuery = `INSERT INTO churrisbanca_social.Likes (username,post_id,post_creator,liked) VALUES
      (${post_liker},${post_id},${post_creator},${liked});`;
      db.query(insertQuery, (err, results) => {
        if (err) {
          res.status(500).send('Error inserting likes');
          return;
        }
        res.json(results);
      });
    }
  });
}


function fetchPostsFromUser(db, req, res) {
  const username = req.params.username;
  if (!validators.validateUsername(username)) { 
    return res.status(403).json({ error: 'Invalid data' });
  }
  const query = `
      SELECT p.id, p.username, p.description, SUM(l.liked = 1) as likes, SUM(l.liked = 0) as dislikes
      FROM Posts p
      LEFT JOIN Likes l ON l.post_id = p.id
      WHERE p.username = ?
      GROUP BY p.id
      ORDER BY p.publish_date DESC
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching posts from user:', err);
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
}

function searchUsers(db, req, res) {
  const searchTerm = req.query.term;
  const currentUser = req.user.username;

  if (!searchTerm || !currentUser) {
    res.status(400).send('Search term and current user are required');
    return;
  }

  const query = `
        SELECT 
        u.username, 
        CASE WHEN EXISTS (
            SELECT 1
            FROM Follows AS f
            WHERE f.user1 = ? AND f.user2 = u.username
        ) THEN true ELSE false END AS followed,
        EXISTS (
            SELECT 1
            FROM Follows AS f1
            JOIN Follows AS f2 ON f1.user1 = f2.user2 AND f1.user2 = f2.user1
            WHERE f1.user1 = ? AND f1.user2 = u.username
        ) AS isMutual
      FROM Users u
      WHERE u.username LIKE CONCAT(?, '%')
      `;

  db.query(query, [currentUser, currentUser, searchTerm], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
}


function followOrUnfollowUser(db, req, res) {
  const follower = req.user.username;
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

function updateProfile(db, req, res) {
  const username = req.params.username;
  const { email, telnum } = req.body;

  const query = 'UPDATE Users SET email = ?, telnum = ? WHERE username = ?';
  const values = [email, telnum, username];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Error updating profile' });
      console.log(err);
      return
    }
    res.status(200).send({ message: 'Profile updated successfully' });
  });
}

function fetchUserData(db, req, res) {
  const username = req.params.username;

  const query = 'SELECT email, telnum FROM Users WHERE username = ?';
  const values = [username];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching user data' });
      console.log(err);
      return
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  })
}

async function getBalance(db, req, res) {
  const { username } = req.body;
  console.log("estoy en getBalance");
  console.log(username);
  try {
    const response = await fetch('http://172.24.131.198/cgi-bin/seguridad_tarea_churris_banca_cgi/bin/seguridad_tarea_churris_banca_cgi.cgi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json\n\n',
      },
      body: `username=${username}`, // Ensure encoding for safety
    });

    console.log("response");
    console.log(response);

    const data = await response.json();
    console.log("Received Data:", data);

    // Sanitizing received data from cgi
    const usernameMatch = data.Username.match(/[a-zA-Z]+/);
    const balanceMatch = data.Balance.toString().match(/[0-9]+(\.[0-9]+)?/);
    const currencyMatch = data.Currency.match(/[a-zA-Z]+/);
    if (usernameMatch && balanceMatch && currencyMatch) {
      const balanceData = {
        username: usernameMatch[0],
        balance: parseFloat(balanceMatch),
        currency: currencyMatch[0]
      };

      console.log("res: ");
      console.log(balanceData);
      res.json(balanceData);
    } else {
      res.status(500).json({ error: 'Unexpected response format from CGI script' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from CGI server', details: error.message });
  }
}

