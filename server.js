const mysql = require('mysql2');
const express = require('express');
const ejs = require('ejs');
const SqlString = require('sqlstring');


require('dotenv').config();
const post = require('./routes/postroutes')
const comment = require('./routes/comments');
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


// STATIC SERVERS
app.use('/public/', express.static(__dirname + '/public'));
app.use('/ejs', express.static(__dirname + '/ejs'));
app.use('/ejs/partials', express.static(__dirname + '/views/partials'));


// ROUTE SETUP
app.get('/', (req, res) => {
    const HTML = ejs.renderFile(__dirname + '/views/home.ejs', {}, function(err, string) {
        if(err) {
            console.log("Error rendering home.ejs");
            console.log(err);
            res.send("Error Rendering EJS: " + err.message);
            return;
        }
        res.send(string);
    });
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
app.get('/posts', post.getallposts);
app.get('/newpost', post.newpost);
app.post('/newpost', post.newpost_receive);
app.get('/posts/:id', post.getpost)
app.get('/editpost/:id', post.editpost);
app.put('/editpost/:id', post.editpost_receive);
app.get('/deletepost/:id', post.deletepost);
app.get('/ejssample', (req, res) => {
    const HTML = ejs.render('<%= people.join(",");%>', {people: ['geddy', 'meow']})
    console.log(HTML);
    res.send(HTML);
})
app.get('/comments/:id', comment.getcommentbyid)
app.put('/comments/addlike/:id', comment.addlike);
app.get('/comments/addlike/:id', comment.getlikesbyid);
app.put('/comments/adddislike/:id', comment.adddislike)
app.get('/comments', comment.getallcomments)
app.post('/comments', comment.addcomment);
app.put('/comments/:id', comment.editcommentbyid);
app.delete('/comments/:id', comment.deletecommentbyid);

// Make server listen on port. 
app.listen(SERVER_PORT, () => {
    console.log(`Server running on ${SERVER_PORT}... Better go catch it!`)
})