const mysql = require('mysql2');
const express = require('express');
const SqlString = require('sqlstring');


require('dotenv').config();
const postroutes = require('./routes/postroutes')
const commentroutes = require('./routes/comments');
const {grabpost, convertcomment, convertpost} = require('./utils/util');
// import ifixit from './ifixit.json' assert {type: 'json'};



// VARIABLES

// SERVER VARIABLES

const SERVER_PORT = process.env.PORT || 5500;

// MAIN APP CREATION

const app = express();

// MIDDLEWARE
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());
app.set('view engine', 'ejs');


// STATIC SERVERS
app.use('/public/', express.static(__dirname + '/public'));
app.use('/ejs', express.static(__dirname + '/views'));
app.use('/ejs/partials', express.static(__dirname + '/views/partials'));


// ROUTE SETUP
app.get('/', (req, res) => {
    res.render('home', {});
    /*
    const HTML = ejs.renderFile(__dirname + '/views/home.ejs', {}, function(err, string) {
        if(err) {
            console.log("Error rendering home.ejs");
            console.log(err);
            res.send("Error Rendering EJS: " + err.message);
            return;
        }
        res.send(string);
    });
    */
    // res.sendFile(__dirname + '/index.html');
}) 
app.get('/contact', (req, res) => {
    const HTML = ejs.renderFile(__dirname + '/views/contact.ejs', {}, function(err, string) {
        if(err) {
            console.log("Error rendering home.ejs");
            console.log(err);
            res.send("Error Rendering EJS: " + err.message);
            return;
        }
        res.send(string);
    });
})
app.get('/store', (req, res) => {
    const HTML = ejs.renderFile(__dirname + '/views/store.ejs', {}, function(err, string) {
        if(err) {
            console.log("Error rendering home.ejs");
            console.log(err);
            res.send("Error Rendering EJS: " + err.message);
            return;
        }
        res.send(string);
    });
})

// POST ROUTES
app.use('/', postroutes)
app.use('/comments', commentroutes)
app.get('/ejssample', (req, res) => {
    res.render('<%= people.join(",");%>', {people: ['geddy', 'meow']})
    /*
    const HTML = ejs.render('<%= people.join(",");%>', {people: ['geddy', 'meow']})
    console.log(HTML);
    res.send(HTML);
    */
})


// Make server listen on port. 
app.listen(SERVER_PORT, () => {
    console.log(`Server running on ${SERVER_PORT}... Better go catch it!`)
})