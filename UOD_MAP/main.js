/***********************************************************************************************
Title: UOD MAP					        													    *
BY: ABDULQADIR FARUK                                                                            *
************************************************************************************************/


//Dependencies used 
var mysql = require('mysql'); //Database
var express = require('express'); //web-app fraqmework
var session = require('express-session'); //cookies
var bodyParser = require('body-parser'); //parser
var path = require('path'); //handles paths
var nunjucks = require('nunjucks'); //template engine



// CONNECTION TO MYSQL DATABASE 
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : ' ',
	password : ' ',
	database : 'nodelogin'
});


//declare express app 
var app = express();

//set path for html template engine (views) 
nunjucks.configure('views', {
  autoescape: true,
  express   : app
});

//Define middlewares 
app.use(session({ 	 //Cookies to avoid logging in on viewing each page
	secret: 'lol its confidential',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));


//send LOGIN page to the client, this is the default page of uod map 
app.get('/', function(request, response) {
	response.render('index.html');
});

//send back the user data to the server to process 
app.post('/', function(request, response) {
	// Create variables with the post data
	var username = request.body.username;
	var password = request.body.password;
	// check if the data exists and is not empty
	if (username && password) {
		// Select the account from the accounts table
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				// Account exists (username and password match)
				// Create session variables
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.render('index.html', { msg: 'Incorrect Username and/or Password!' });
			}
		});
	} else {
		response.render('index.html', { msg: 'Please enter Username and Password!' });
	}
});


//send register page to the client 
app.get('/register', function(request, response) {
	response.render('register.html');
});

//send back the user data to the server to process  
app.post('/register', function(request, response) {
	// Create variables and set to the post data
	var username = request.body.username;
	var password = request.body.password;
	var neptunID = request.body.neptunID;
	// Check if the posted user details exists and are not empty
	if (username && password && neptunID) {
		// Check if account exists already in the accounts table, checks for username
		connection.query('SELECT * FROM accounts WHERE username = ? OR neptunID = ?', [username, neptunID, password], function(error, results, fields) {
			if (results.length > 0) {
				response.render('register.html', { msg: 'Account already exists with that username or neptunID' });
			} else if (!/^[a-zA-Z0-9]{6}$/.test(neptunID)) {
				// Make sure neptunID is valid, it must be exactly 6 alphanumeric chars
				response.render('register.html', { msg: 'Invalid NeptunID!' });
			} else if (!/[A-Za-z0-9]+/.test(username)) {
				// Username validation, it must be numbers or alphabets
				response.render('register.html', { msg: 'Username must contain only characters and numbers!' });
			} else {
				//Add the username, password and neptun to database and register user
				connection.query('INSERT INTO accounts VALUES (NULL, ?, ?, ?)', [username, password, neptunID], function(error, results, fields) {
					response.render('register.html', { msg: 'You have successfully registered!' });
				});
			}
		});
	} else {
		// If the form is empty or not complete...
		response.render('register.html', { msg: 'Please complete the registration form!' });
	}
});


//send home page to the client 
app.get('/home', function(request, response) {
	// Check if user is logged in
	if (request.session.loggedin) {
		// DISPLAY home page
		response.render('home.html', { username: request.session.username });
	} else {
		// Redirect to login page
		response.redirect('/');
	}
});


//send profile page to the client 
app.get('/profile', function(request, response) {
	// Check if user is logged in
	if (request.session.loggedin) {
		// Get the user's account details so that we can display them on the profile page
		connection.query('SELECT * FROM accounts WHERE username = ?', [request.session.username], function(error, results, fields) {
			// display profile page
			response.render('profile.html', { account: results[0] });
		});
	} else {
		// Redirect to login page
		response.redirect('/');
	}
});


//when client logs out, display login page 
app.get('/logout', function(request, response) {
	// Destroy session data
	request.session.destroy();
	// Redirect to login page
	response.redirect('/');
});



// Listen on port 3000 (http://localhost:3000/)
app.listen(3000);
