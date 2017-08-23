const express = require('express');
const mustacheExpress = require('mustache-express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator'); /* "An express.js middleware for validator."*/
const validator = require('validator')/*"A library of string validators and sanitizers.""*/
// ^^^ if the above line is commented out, then you get an error related to line 71, ReferenceError: validator is not defined

// validator.isEmail('foo@bar.com'); //=> true
// ^^^^This is taken straight from the documentation for validator.js and is the model for the line I used, which worked.

const app = express();
const port = 3000;

// const loginRouter = require('./routes/login');
const squirrel = require('./users/users');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());/* this line needs to be expressValidator and won't work if set to validator*/
// this line must be immediately after any of the bodyParser middlewares!
// ^^straight from the documentation for https://github.com/ctavan/express-validator I cannot find an app.use line for validator

let usernameInput = "";
let passwordInput = "";
let visitCount = "";
let expireTime = "";

app.use(session({
  resave: false,
  secret: 'keyboard pitbull',
  cookie: { maxAge: 300000 }
}));

// Access the session as req.session; refer to the session object (that must be defined or you get an error)
app.get('/', function(req, res, next) {
  console.log("you want to know what req.session.views is, right?");
  console.log(req.session.views);
  console.log(typeof req.session.views);
  // console.log("fun times");

  if (req.session.views) {
    visitCount = req.session.views++
    console.log(visitCount)
    expireTime = req.session.cookie.maxAge/1000/60
    console.log(expireTime);
    res.render('index', { usernameInput: usernameInput, visitCount: visitCount, expirationTime: expireTime});

    // res.end()

  }else {
    // res.write('<p>"You need to login"</p>')
    // res.end('welcome to the session demo. refresh!')
    console.log("redirect???")
    return res.redirect('/login')
  }
});

app.get('/login', function(req,res) {
  res.render('login');
  // res.write('<p>"You should be on the login page now"</p>')
  console.log("login page???")
});



app.post('/login', function(req, res){
  console.log("app.post has been activated");

  if (validator.isEmail(req.body.username)) {
    // Render validation messages; ^^expressValidator can NOT be used instead of validator
    console.log("Wonderful!!!!! You did enter an email... moving on....")
    var html3 = '<p>Wonderful!!!!! You did enter an email... moving on....</p>';
    // res.send(html3);
            usernameInput = req.body.username;
            passwordInput = req.body.password;
            console.log(usernameInput);
            authenticate(req, usernameInput, passwordInput);

            if (req.session && req.session.authenticated){
              req.session.views = 1;
              res.redirect('/');
              console.log("You were authenticated and redirected to the homepage")
            } else {
              res.redirect('/login');
              console.log("You were not authenticated")
            }
  } else {
    // var html2 = '<p>You did NOT enter an email address.</p>';
    // res.send(html2);
    console.log("You did NOT enter an email address.");
    res.redirect('/login');
      }
});

// app.post('/login', function(req, res){
//   console.log("app.post has been activated");
//
//   req.check('email', "invalid email address").isEmail();
//         var errors = req.getValidationResult();
//          if (!errors) {
//            // Render validation error messages
//            var html2 = '<p>You did NOT enter an email address.</p>';
//            res.send(html2);
//            console.log("You did NOT enter an email address.");
//          } else {
//               //  res.redirect('/');
//                console.log("You did enter an email... moving on....")
//                usernameInput = req.body.username;
//                passwordInput = req.body.password;
//                console.log(usernameInput);
//                authenticate(req, usernameInput, passwordInput);
//
//                if (req.session && req.session.authenticated){
//                  req.session.views = 1;
//                  res.redirect('/');
//                  console.log("You were authenticated and redirected to the homepage")
//                } else {
//                  res.redirect('/login');
//                  console.log("You were not authenticated")
//                }
//              }
// });

function authenticate(req, usernameInput, passwordInput){
  console.log("The authenticate function was initiated")
  var authenticatedUser = squirrel.users.find(function (users) {
    if (usernameInput === users.username && passwordInput === users.password) {
      req.session.authenticated = true;
      console.log('User & Password Authenticated');
    } else {
      return false
      console.log("wrong username AND/OR password")
    }
  });
  console.log(req.session);
  return req.session;
}

app.listen(3000, function () {
  console.log('Successfully started express application!');
})

// Reference for  - parseurl(req).pathname https://stackoverflow.com/questions/17184791/node-js-url-parse-and-pathname-property

// Reference on how to redirect to the login page: https://stackoverflow.com/questions/9346579/how-can-i-tell-when-an-html5-audio-element-has-finished-playing


// // If I use the following, I can see a counter for page loads in the browser window:
// app.get('/', function(req, res, next) {
//   req.session.views++
//   res.write('<p>views: ' + req.session.views + '</p>')
//   res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
//   res.end()
// })


// this is what printed out the promise..... in the app.post function
// req.check('username', "valid email address").isEmail();
//
//   var valid = req.getValidationResult().then(result =>{
//     res.send(result.array())
//     console.log(result.array())
//
//   })
// console.log(valid)
