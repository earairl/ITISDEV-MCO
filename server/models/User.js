const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    credentials: {
        userId:         {type: String, required: true, unique: true},
        username:       {type: String, required: true, unique: true},
        email:          {type: String, required: true, unique: true},
        password:       {type: String, required: true}
        // passwordSalt:   {type: String, required: function () { return !this.deleted; }},
        // passwordHash:   {type: String, required: function () { return !this.deleted; }}
    },
    // penalties:          [{ type: mongoose.Schema.Types.ObjectId, ref: 'Penalty' }],
    // currentlyQueued:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
    // matchHistory:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
    deleted:            { type: Boolean, default: false }
}, {collection: 'Users'});

// Mongoose pre-save hook to hash password before saving a user to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('credentials.password') || this.credentials.password === null) return next(); //skip hashing if password is not modified or is exactly null (from user deletion)

    try {
        const salt = await bcrypt.genSalt(10); //Generates salt with 10 rounds (strength of hash)
        this.credentials.password = await bcrypt.hash(this.credentials.password, salt); //Hashes user's password with salt and replaces plaintext to hashed pw
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
