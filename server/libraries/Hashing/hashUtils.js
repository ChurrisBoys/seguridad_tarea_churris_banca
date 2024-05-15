const bcrypt = require('bcrypt');

const salt = 10;

function hashPassword(password) {
  return bcrypt.hash(password, salt);
}

function compare(text, hash) {
  return bcrypt.compare(text, hash);
}

module.exports = {

  hashPassword,
  compare,
};