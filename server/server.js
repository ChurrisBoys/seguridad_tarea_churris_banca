const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config({ path: './secrets.env'});
const axios = require('axios');
const https = require('https');

// Packages for image processing
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

// Packages for validating data
const validators = require('./libraries/Validators/validators');


// Routers for the different functionalities
const createAuthRouter = require('./apps/auth/authEntry');

// Middleware
const authenticateToken = require('./libraries/Session/authMiddleware');

//Services
const UserService = require('./apps/user/userService');

const app = express();
const port = 3003;
const httpsPort = 3001; // Used this port because of iptables
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const upload = multer({ dest: 'userPostImages/' }); // Destination folder to store the images received

// Setting up https for express js
const options = {
  key: fs.readFileSync('../../equipo1_churris_server.key'),
  cert: fs.readFileSync('../../equipo1_churris_server.crt') // TODO: Add more security to the access of the private key cert from javascript based attacks or related
};
https.createServer(options, app).listen(httpsPort, function(){
  console.log("Express server listening on port " + httpsPort);
});

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

  app.post('/api/createpost', authenticateToken, upload.single('user_image'), (req, res) => {
    createPosts(db, req, res);
  })

  app.get('/api/posts', authenticateToken , (req, res) => {
    fetchPosts(db, req, res);
  })

  app.post('/api/posts/liked', authenticateToken, (req, res) => {
    likeOrDislikePost(db, req, res);
  })

  app.get('/api/posts/:username', authenticateToken, (req, res) => {
    fetchPostsFromUser(db, req, res);
  })

  app.get('/api/follows/:username', authenticateToken, (req, res) => {
    followOrUnfollowUser(db, req, res);
  })

  app.get('/api/friends', authenticateToken, (req, res) => {
    searchUsers(db, req, res);
  })
  
  app.get('/getBalance', authenticateToken, async (req, res) => {
    getBalance(db, req, res);
  })
  
  app.post('/getUserTransactions', authenticateToken, async (req, res) => {
    fetchUserTransactions(db, req, res);
  })
  
  app.get('/api/profile/:username', authenticateToken, (req, res) => {
    fetchUserData(db, req, res);
  })

  app.put('/api/myprofile/edit', authenticateToken, (req, res) => {
    updateProfile(db, req, res);
  })

  app.get('/api/myprofile', authenticateToken, (req, res) => {
    fetchMyPosts(db, req, res);
  })

  app.get('/api/myprofile/data', authenticateToken, (req, res) => {
    fetchMyProfileData(db, req, res);
  })

  app.put('/api/delete/:postId', authenticateToken, (req, res) => {
    deletePost(db, req, res);
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

function createPosts(db, req, res) {
  const binaryImageData = null;
  const file = req.file;

  

  const createPost = (req, binaryImageData) => {

    if (!validators.validateNormalText(req.body.user_description)) {
      return res.status(500).json({ error: 'Invalid data' });
    }

    if (!validators.validateUsername(req.body.logged_in_user)) {
      return res.status(403).json({ error: 'Invalid data' });
    }
  

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

  if (!validators.validateUsername(req.query.cu)){
    return res.status(403).json({ error: 'Invalid data' });
  }
  const postFromFollowingQuery = `
    SELECT p.id, p.username, p.description, SUM(l.liked = 1) as likes, p.image, SUM(l.liked = 0) as dislikes
    FROM Posts p
    LEFT JOIN Likes l ON
    l.post_id = p.id
    WHERE p.username IN (SELECT u.user2 FROM Follows u WHERE u.user1 = ?) AND p.is_deleted != 1
    GROUP BY p.id`;
  
  db.query(postFromFollowingQuery, [req.user.username], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
}

function likeOrDislikePost(db, req, res) {
  const post_liker = req.user.username;
  const post_id = req.query.post_id;
  const post_creator = req.query.post_creator;
  const liked = req.query.liked;

  if (!validators.validateUsername(req.query.post_liker) || !validators.validateUsername(req.query.post_creator)) {
    return res.status(403).json({ error: 'Invalid data' });
  }


  // Query to know if there was already a like or dislike to this post from the post_liker
  const likesQuery = `SELECT * FROM Likes l
  WHERE l.username = ?
  AND l.post_id = ?
  AND l.post_creator = ?`;
  db.query(likesQuery, [post_liker, post_id, post_creator], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching likes');
      return;
    }

    // If the user already liked or disliked the post and clicked the same button, then remove its reaction
    if (results.length > 0 && results[0].liked === parseInt(liked)) {
      const deleteQuery = `DELETE FROM Likes
      WHERE username = ?
      AND post_id = ?
      AND post_creator = ?`;
          db.query(deleteQuery, [post_liker, post_id, post_creator], (err, results) => {
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
      SET l.username = ?
      , l.post_id = ?
      , l.post_creator = ?
      , l.liked = ?
      WHERE l.username = ?
      AND l.post_id = ?
      AND l.post_creator = ?`;
      db.query(updateQuery, [post_liker, post_id, post_creator, liked, post_liker, post_id, post_creator], (err, results) => {
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
      (?, ?, ?, ?);`;
      db.query(insertQuery, [post_liker, post_id, post_creator, liked], (err, results) => {
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
      WHERE p.username = ? AND p.is_deleted != 1
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

  if (!validators.validateUsername(searchTerm)) {
    return res.status(500).json({ error: 'Invalid data' });
  }

  if (!validators.validateUsername(currentUser)) {
    return res.status(403).json({ error: 'Invalid data' });
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

  if (!validators.validateUsername(follower) || !validators.validateUsername(followedUser)) {
    return res.status(500).json({ error: 'Invalid data' });
  }


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
  const currentUser = req.user;

  // Verify if user is logged in
  if (!currentUser) {
    return res.status(401).json({error: 'Unauthorized, user not logged in'});
  } else {
    // Obtain the username
    const username = req.user.username;

    if (!validators.validateUsername(username)) { 
      return res.status(403).json({ error: 'Invalid data' });
    }
    const { email, telnum } = req.body;

    if(!validators.validateEmail(email) || !validators.validatePhoneNumber(telnum)) {
      return res.status(500).json({ error: 'Invalid data' });
    }
    
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
}

function fetchUserData(db, req, res) {
  const username = req.params.username;
  const actualUser = req.user.username;

  if(!validators.validateUsername(username)) {
    return res.status(403).json({ error: 'Invalid data' });
  }

  const query = `
    SELECT u.email, u.telnum 
    FROM Users u
    JOIN Follows f1 ON f1.user1 = ? AND f1.user2 = u.username
    JOIN Follows f2 ON f2.user1 = u.username AND f2.user2 = ?
    WHERE u.username = ?;
  `;
  const values = [actualUser, actualUser, username];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching user data' });
      console.log(err);
      return;
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  });
}


async function getBalance(db, req, res) {

  if(!validators.validateUsername(req.user.username)) {
    return res.status(403).json({ error: 'Invalid data' });
  }

  try {
    const response = await axios.post('http://172.24.131.198/cgi-bin/seguridad_tarea_churris_banca_cgi/bin/seguridad_tarea_churris_banca_cgi.cgi', 
      `username=${req.user.username}`, 
      {
        headers: {
          'Content-Type': 'text/plain'
        },
      }
    );
    // console.log("response");
    // console.log(typeof response.data);

    const data = JSON.stringify(response.data);
    console.log("Received Balance Data :", data);

    // Sanitizing received data from cgi
    const usernameMatch = response.data.Username.match(/[a-zA-Z]+/);
    const balanceMatch = response.data.Balance.toString().match(/[0-9]+(\.[0-9]+)?/);
    const currencyMatch = response.data.Currency.match(/[a-zA-Z]+/);
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

function fetchMyPosts(db, req, res) {
  const currentUser = req.user;

  // Verify if user is logged in
  if (!currentUser) {
    return res.status(401).json({error: 'Unauthorized, user not logged in'});
  } else {
    // Obtain the username
    const username = req.user.username;

    if (!validators.validateUsername(username)) { 
      return res.status(403).json({ error: 'Invalid data' });
    }
    const query = `
        SELECT p.id, p.username, p.description, SUM(l.liked = 1) as likes, SUM(l.liked = 0) as dislikes
        FROM Posts p
        LEFT JOIN Likes l ON l.post_id = p.id
        WHERE p.username = ? AND p.is_deleted != 1
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
}

function fetchMyProfileData(db, req, res) {
  const currentUser = req.user

  // Verify if user is logged in
  if (!currentUser) {
    return res.status(401).json({error: 'Unauthorized, user not logged in'});
  } else {
    // Obtain the username
    const username = req.user.username;

    if (!validators.validateUsername(username)) { 
      return res.status(403).json({ error: 'Invalid data' });
    }

    const query = `
      SELECT u.username, u.email, u.telnum 
      FROM Users u
      WHERE u.username = ?
    `;

    db.query(query, [username], (err, results) => {
      if (err) {
        res.status(500).send({ error: 'Error fetching user data' });
        console.log(err);
        return;
      }
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).send({ error: 'User not found' });
      }
    });
  }
}

function deletePost(db, req, res){
  const currentUser = req.user

  // Verify if user is logged in
  if (!currentUser) {
    return res.status(401).json({error: 'Unauthorized, user not logged in'});
  } else {
    // Obtain the username
    const username = req.user.username;

    if (!validators.validateUsername(username)) { 
      return res.status(403).json({ error: 'Invalid data' });
    }

    const postId = req.params.postId;
    const query = 'UPDATE Posts SET is_deleted = 1 WHERE id = ? AND username = ?';
    const values = [postId, username];
    
    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error deleting post:', err);
            res.status(500).send({ error: 'Error deleting post' });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'Post not found' });
        } else {
            res.status(200).send({ message: 'Post deleted successfully' });
        }
    });
  }
  }

async function fetchUserTransactions(db, req, res) {
  if(!validators.validateUsername(req.user.username)) {
    return res.status(403).json({ error: 'Invalid data' });
  }
  
  try {
    const response = await axios.post('http://172.24.131.198/cgi-bin/seguridad_tarea_churris_banca_cgi/bin/seguridad_tarea_churris_banca_cgi.cgi?a=S', 
    `username=${req.user.username}`, 
      {
        headers: {
          'Content-Type': 'text/plain'
        },
      }
    );

    // const data = await response.json();
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from CGI server', details: error.message });
  }
}
