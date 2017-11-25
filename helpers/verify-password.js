const bcrypt = require('bcrypt');

verifyPassword = function(plaintextPassword, hash) {
    return bcrypt.compare(plaintextPassword, hash)
    .then(function(res) {
        if (res === true) {
            return true;
        } else {
            return false;
        }
    });
}

module.exports = verifyPassword;