const jwt = require('jsonwebtoken');

    function refreshToken (data) {
    return jwt.sign(data, 'abc1234', {
        expiresIn: '1d'
    });
    }

module.exports = refreshToken;
