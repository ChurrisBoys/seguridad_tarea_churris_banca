const bcrypt = require('bcrypt');

const salt = 10;

function hashPassword(password) {
  return bcrypt.hash(password, salt);
}

function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
    }