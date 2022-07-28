const mysql = require('mysql2');
const express = require('express');
const ejs = require('ejs');
const SqlString = require('sqlstring');


require('dotenv').config();
const post = require('./routes/postroutes')
const {grabpost, convertcomment, convertpost} = require('./utils/util');
// import ifixit from './ifixit.json' assert {type: 'json'};

// VARIABLES

// SERVER VARIABLES

const SERVER_PORT = 5500;

/**
    // DATABASE VARIABLES
    const PORT = process.env.DB_PORT;
    const XPROTOCOLPORT = process.env.DB_XPROTOCOLPORT;
    const ROOT_PASSWORD = process.env.DB_ROOT_PASSWORD;
    
    const HOST = process.env.DB_HOST;
    const USERNAME = process.env.DB_USERNAME;
    const PASSWORD = process.env.DB_PASSWORD;
    const WINDOWS_SERVICE_NAME = process.env.WINDOWS_SERVICE_NAME_MYSQL;
    const DBNAME = process.env.DB_NAME;
*/

// MAIN APP CREATION

const app = express();
// MIDDLEWARE
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());
const conn = require('./mysqlconnection');
// server stuff
app.use('/', express.static(__dirname + '/public'));
app.use('/ejs/partials', express.static(__dirname + '/ejs/partials'));
/*
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
}) */

app.get('/posts', post.getallposts);
app.get('/newpost', post.newpost);
app.post('/newpost', post.newpost_receive);
app.get('/posts/:id', post.getpost)

app.get('/ejssample', (req, res) => {
    const HTML = ejs.render('<%= people.join(",");%>', {people: ['geddy', 'meow']})
    console.log(HTML);
    res.send(HTML);
})

app.get('/comments/:id', (req, res) => {
    let HTML = "";
    conn.execute(`SELECT * FROM Comments WHERE CommentID = ${req.params.id}`, function(err, results, fields) {
        if(err) {
            console.log("Error retrieving comment: ");
            console.error(err);
            res.send("404 error");
            return;
        }
        console.log(results);
        let data = convertcomment(results[0]);
        console.log(data);
        data.CommentID = req.params.id;
        const HTML = ejs.renderFile(__dirname + '/ejs/singularcomment.ejs', {comment: data}, function(err, string) {
            if(err) {
                console.log("Error rendering Comment EJS.");
                console.log(err);
                res.send("Error rendering comment: " + err);
                return;
            }
            res.send(string);
        });
    })
})

app.put('/comments/addlike/:id', (req, res) => {
    conn.execute(`SELECT Likes from Comments WHERE CommentID = ${req.params.id}`, (err, field) => {
        if(err) {
            console.log("Error finding comment. Error: ");
            console.error(err);
        }
        let likes = field[0].likes
        conn.execute(`UPDATE Comments
                        SET Likes = ${likes + 1}
                        WHERE CommentID = ${req.params.id}`, (err, result) => {
                            if(err) {
                                console.log("Error updating like count. Error: ");
                                console.err(err);
                                res.send(err);
                                return;
                            }
                        })
        res.send(field);
    })
        
    res.send(502);
});
app.get('/comments/addlike/:id', (req, res) => {
    conn.execute(`SELECT Likes from Comments WHERE CommentID = ${req.params.id}`, (err, field) => {
        if(err) {
            console.log("Error finding comment. Error: ");
            console.error(err);
            res.send(
                "404 error"
            )
            return;
        }
        let likes = field[0].Likes
        console.log(typeof likes);
        res.send(field);
        return;
    })
});

app.put('/comments/:id/add_dislike', (req, res) => {
    res.send("Not implemented")
})
app.get('/comments', (req, res) => {
    conn.execute(`SELECT * FROM Comments`, (err, results) => {
        if(err) {
            console.log("Error retrieving all comments. Error: ");
            console.error(err);
            res.send("Internal Server Error", 503)
            return;
        }
        const HTML = ejs.renderFile( __dirname + '/ejs/allcomments.ejs', {comments: results}, (err, string) => {
            if(err) {
                console.log("Error rendering all comment EJS file. Error: ");
                console.log(err);
                res.send(results);
            }
            res.send(string); 
        })
        console.log(results);
    })
})

app.post('/comments', (req, res) => {
    console.log("Stuff received")
    console.log(req.body);
    const OriginPostId = SqlString.escape(req.body.OriginPostId);
    const InnerText = SqlString.escape(req.body.InnerText);
    const Author = SqlString.escape(req.body.Author);
    conn.execute(`INSERT INTO Comments (OriginPostId, InnerText, Author, Likes, Dislikes, RepliesCount)
            VALUES (${OriginPostId}, ${InnerText}, ${Author}, 0,0,0)
        `, function(err, results, fields) {
            if(err) {
                console.log("An error occurred");
                console.log(err);
                res.sendStatus(500);
                return;
            }
            console.log("Stuff received back after POST comment:");
            console.log(results);
            console.log(fields);
            res.send(String(results.insertId));
        })
})



app.listen(SERVER_PORT, () => {
    console.log(`Server running on ${SERVER_PORT}... Better go catch it!`)
})