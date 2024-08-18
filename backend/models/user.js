const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Scheme = mongoose.Schema;

const userScheme = new Scheme({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    works: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Work' }]
});

userScheme.plugin(uniqueValidator);

module.exports = mongoose.model('User', userScheme);

