var db = require('../db');

var booksModel = db.Schema({
    name : { type : String, required: true, unique : true},
    author : { type : String, required : true},
    description : { type : String, required : true}
});

module.exports = db.model('book',booksModel);