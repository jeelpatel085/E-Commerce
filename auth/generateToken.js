const jwt = require('jsonwebtoken');

function generateToken(data) {
  return jwt.sign(data, 'abc1234', {
    expiresIn: '3d'
  });
}

module.exports = generateToken;
