const mongoose = require('mongoose');
const crypto = require('crypto');
const ROLES = require('../variables/roles');

const userSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    Caption: { type: String, required: true, unique: true },
    Login: String,
    Role: { type: String, default: ROLES.patrol },
    PasswordHash: String,
    salt: String,
}, {
    timestamps: true
});

userSchema.virtual('Password')
    .set(function (password) {
        this._plainPassword = password;
        if (password) {
            this.salt = crypto.randomBytes(128).toString('base64');
            this.PasswordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
        } else {
            this.salt = undefined;
            this.PasswordHash = undefined;
        }
    })

    .get(function () {
        return this._plainPassword;
    });

userSchema.methods.checkPassword = function (password) {
    if (!password) return false;
    if (!this.PasswordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.PasswordHash;
};

module.exports = mongoose.model('User', userSchema);