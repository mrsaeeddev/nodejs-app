var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/expressdb';

mongoose.connect(url)

var conn = mongoose.connection.once('open',()=>{
    console.log("connect")

}).on('error',()=>{
    console.log("error")
})

module.exports=mongoose;