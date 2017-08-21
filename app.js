const express = require('express');
const mustache = require('mustache-express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');

// validator.isEmail('foo@bar.com'); //=> true

const app = express();
const port = 3000;

const loginRouter = require('./routes/login');
const User = require('./users/users');

app.engine('mustache',mustache());
app.set('view engine', 'mustache');
app.set('views','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// app.use(session({
//   resave: false,
//   secret: 'keyboard pitbull'
// }));

// app.use(function (req, res, next) {
//   let vists = req.session.views;
//   if (!vists) {
//     vists = req.session.views = {};
//   }
//   // get the url pathname
//   var pathname = parseurl(req).pathname;
//   // count the views
//   vists[pathname] = (vists[pathname] || 0) + 1
//   console.log("views[pathname] = " + vists[pathname]);
//   next();
// })


app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// Access the session as req.session
app.get('/', function(req, res, next) {
  if (req.session.views) {
    req.session.views++
    // console.log("views[pathname] = " + vists[pathname]);
    // res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})
// Reference for  - parseurl(req).pathname https://stackoverflow.com/questions/17184791/node-js-url-parse-and-pathname-property

// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }

app.get('/',function(req, res){
  res.render('index');
  // next();
});

app.get('/login', function(req,res) {
  res.render('login');
});

// app.post('/login', function(req, res, ){
//   console.log(input.value);
//
// });

app.post('/check', function(req, res){
  console.log("button clicked");
  // todones.push(req.body.todoCheck);
  //res.redirect('/');
});

app.listen(3000, function () {
  console.log('Successfully started express application!');
})
