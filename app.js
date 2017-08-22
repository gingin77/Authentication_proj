const express = require('express');
const mustache = require('mustache-express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const session = require('express-session');
// const expressValidator = require('express-validator');

// validator.isEmail('foo@bar.com'); //=> true

const app = express();
const port = 3000;

const loginRouter = require('./routes/login');
const users = require('./users/users');

app.engine('mustache',mustache());
app.set('view engine', 'mustache');
app.set('views','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressValidator());

app.use(session({
  resave: false,
  secret: 'keyboard pitbull',
  cookie: { maxAge: 300000 }
}));

// Access the session as req.session; refer to the session object (that must be defined or you get an error)
app.get('/', function(req, res, next) {
  if (req.session.views) {
    req.session.views++
    // res.render('index', req.session.views, req.session.cookie.maxAge );
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  }else {
    // res.write('<p>"You need to login"</p>')
    console.log("redirect???")
    return res.redirect('/login')
  }
});

app.get('/login', function(req,res) {
  res.render('login');
});

app.post('/login', function(req, res){
  let usernameInput = req.body.username;
  let passwordInput = req.body.password;
  console.log(username);
  authenticate(req, username, password);
  if (req.session && req.session.authenticated){
    res.render('index', { usernameInput: usernameInput });
  } else {
    res.redirect('/login');
  }
})

// arr.find(callback[, thisArg])

function authenticate(req, username, password){
  var authenticatedUser = data.users.find(function (users) {
    if (username === users.username && password === users.password) {
      req.session.authenticated = true;
      console.log('User & Password Authenticated');
    } else {
      return false
    }
  });
  console.log(req.session);
  return req.session;
}

app.listen(3000, function () {
  console.log('Successfully started express application!');
})



// app.post('/check', function(req, res){
//   console.log("button clicked");
// });




// Reference for  - parseurl(req).pathname https://stackoverflow.com/questions/17184791/node-js-url-parse-and-pathname-property

// Reference on how to redirect to the login page: https://stackoverflow.com/questions/9346579/how-can-i-tell-when-an-html5-audio-element-has-finished-playing


// // If I use the following, I can see a counter for page loads in the browser window:
// app.get('/', function(req, res, next) {
//   req.session.views++
//   res.write('<p>views: ' + req.session.views + '</p>')
//   res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
//   res.end()
// })
