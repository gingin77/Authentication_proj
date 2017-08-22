const express = require('express');
const mustache = require('mustache-express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const session = require('express-session');
// const expressValidator = require('express-validator');

// validator.isEmail('foo@bar.com'); //=> true

const app = express();
const port = 3000;

// const loginRouter = require('./routes/login');
const squirrel = require('./users/users');

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
  console.log("you want to know what ..views is, right?");
  console.log(req.session.views);
  console.log(typeof req.session.views);

  if (req.session.views) {
    req.session.views++
    // res.render('index', req.session.views, req.session.cookie.maxAge );
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
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
  // res.render('login');
  let usernameInput = req.body.username;
  let passwordInput = req.body.password;
  console.log(usernameInput);
  authenticate(req, usernameInput, passwordInput);

  if (req.session && req.session.authenticated){
    req.session.views = 1;
    res.redirect('/');
    // res.render('index', { usernameInput: usernameInput });
  } else {
    res.redirect('/login');
  }
})

function authenticate(req, usernameInput, passwordInput){
  var authenticatedUser = squirrel.users.find(function (users) {
    if (usernameInput === users.username && passwordInput === users.password) {
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

// Reference for  - parseurl(req).pathname https://stackoverflow.com/questions/17184791/node-js-url-parse-and-pathname-property

// Reference on how to redirect to the login page: https://stackoverflow.com/questions/9346579/how-can-i-tell-when-an-html5-audio-element-has-finished-playing


// // If I use the following, I can see a counter for page loads in the browser window:
// app.get('/', function(req, res, next) {
//   req.session.views++
//   res.write('<p>views: ' + req.session.views + '</p>')
//   res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
//   res.end()
// })
