const express = require('express'); // like importing express
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000; // setting my port listener

require('dotenv').config(); // load dotenv library

app.use(express.urlencoded({ extended: true })); // inbuilt express method to recognize incoming request as string or arrays
app.use(express.static('public')); // helps saving the path folders for imgs etc
app.use(expressLayouts); 
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave:true
}));
app.use(flash());
app.use(fileUpload());




const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

app.listen(port, () => console.log(`Listening to port ${port}`)); // bind and listen to the specified host and port