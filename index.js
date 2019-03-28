var express = require("express");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var app = express();
var userModel = require('./models/users');

// console.log(db);
// db.query('', function (err, rows) {
//     if (err) throw err
  
//     console.log('The solution is: ', rows[0].solution)
//   });

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
app.post("/addtask", function(req, res) {
    var newTask = req.body.newtask;
    //add the new task from the post route
    task.push(newTask);
    res.redirect("/");
});

app.post("/removetask", function(req, res) {
    var completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        //check if the completed task already exits in the task when checked, then remove it
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});

//render the ejs and display added task, completed task
app.get("/", function(req, res) {
    res.render("index", { task: task, complete: complete });
});

//set app to listen on port 3000
app.listen(3000, function() {
    console.log("server is running on port 3000");
});
