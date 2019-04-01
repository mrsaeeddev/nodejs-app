var db = require('../db');

var usersModel = db.Schema({
    name : { type: String, required: true},
    email: {
        type: String, required: true, unique: [true,'notttt'],
    },
    password : { type: String, required: true},
});

module.exports = db.model('user',usersModel);

