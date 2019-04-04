var express = require("express");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var app = express();

var userModel = require('./models/users');
var bookModel = require('./models/books');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//render css files
app.use(express.static("public"));

//placeholders for added task
var task = ["buy socks", "practise with nodejs"];
//placeholders for removed task
var complete = ["finish jquery"];

app.get('/signup',(req,res)=>{
    res.render('signup');
});



app.post('/signuprequest',(req,res) => {
    let user = { name : req.body.name,
                password: req.body.password,
                email: req.body.email };
    console.log(req.body);
    if ((user.name && user.password && user.email) != '' ||
     (user.name && user.password && user.email) != ' ' ||
      (user.name && user.password && user.email) != null || 
      (user.name && user.password && user.email) != undefined) {
      let newUser = new userModel({ name:user.name, email: user.email, password:user.password });
      var signOptions = {
        expiresIn:  "20m",
        algorithm:  "HS256"
       };
      var token = jwt.sign({name:req.body.name,email:req.body.email},'123456',signOptions);
      newUser.save((err,doc)=>{
           if(doc != undefined){
            return res.json({ 'status':'Successfully registered','token':token});
           }
           else {
               res.json({'error':'Error in registeration'});
           }
      });
    }
})

app.get('/login',(req,res) => {
    res.render('login');
});

app.post('/loginrequest', (req,res) => {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email, password);
    userModel.find({'email':req.body.email},(err,doc)=>{
        if (doc.length>0) {
            var signOptions = {
                expiresIn:  "20m",
                algorithm:  "HS256"
               };
              var token = jwt.sign({name:req.body.name,email:req.body.email},'123456',signOptions);
              return res.json({'status':'Successfully logged in','token':token});
        }
       else {
           return res.json({'error':'Error in logging in'});
       }
    });
})
//post route for adding new task 
app.post("/addbook", function(req, res) {
    var name = req.body.name;
    var author = req.body.author;
    var description = req.body.description;
    let newBook = new bookModel({ name : req.body.name, author : req.body.author, description : req.body.description });
    newBook.save((err,doc) => {
        if(doc != undefined) {
            res.json({'success':'Successfully added to books list'});
        }
        else {
            res.json({'error':'Error in adding book to books list'});
        }
    });
});

app.post("/removebook", function(req, res) {
    var name = req.body.name;
    if (name != '') {
        bookModel.deleteMany({'name':name},(err,doc) => {
            if (doc.deletedCount > 0) {
                res.json({'success' : 'Successfully removed book from db'});
            }
            else if (doc.deletedCount == 0) {
                res.json({'warning':'No book matching the name found'});
            }
            else if (err) {
                res.json({'error':'Error in removing book'});
            }
        });
    }
});

app.post("/updatebook", function(req, res) {
    var name = req.body.name;
    if (name != '') {
        bookModel.findOneAndUpdate({'name':name},
        {$set : {
            name:'Updated name'
        }},{new :true},(err,doc)=>{
            if (doc != null) {
                if (Object.keys(doc).length > 0) {
                    res.json({'success':'Book name has been updated successfully'})
                }
            }
            else if (err) {
                res.json({'error':'Error in updating name'});
            }
            else {
                res.json({'warning':'No book name to update'});
            }
           
        });
    }
});

//render the ejs and display added task, completed task
app.get("/", function(req, res) {
    res.render("index", { task: task, complete: complete });
});

//set app to listen on port 3000
app.listen(3000, function() {
    console.log("server is running on port 3000");
});
