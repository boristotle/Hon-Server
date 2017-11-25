const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

hashPassword = function(plaintextPassword) {
    return bcrypt.hash(plaintextPassword, SALT_ROUNDS)
        .then(function(hash) {
            console.log('hash', hash);
            return hash;
        });
};

module.exports = hashPassword;