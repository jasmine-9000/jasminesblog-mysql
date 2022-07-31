'use strict'

// get root of app directory with path module.
const {dirname} = require('path');
const appDir = dirname(require.main.filename);

// get mysql connection
const conn = require('../mysqlconnection');
// get utilities required for this module.
const {grabpost, convertcomment, convertpost} = require('../utils/util');
// third party modules required 
const ejs = require('ejs');
const SqlString = require('sqlstring');

// initialize connection to mysql
console.log("Initializing connection for comments...");
conn.init();
console.log("Connection: " + conn.pool);

exports.getcommentbyid = (req, res) => {
    let HTML = "";
    conn.pool.execute(`SELECT * FROM Comments INNER JOIN Users ON Users.UserID = Comments.AuthorID AND CommentID = ${req.params.id}`, function(err, results, fields) {
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
        const HTML = ejs.renderFile(appDir + '/ejs/singularcomment.ejs', {comment: data}, function(err, string) {
            if(err) {
                console.log("Error rendering Comment EJS.");
                console.log(err);
                res.send("Error rendering comment: " + err);
                return;
            }
            res.send(string);
        });
    })
};

exports.addlike = (req, res) => {
    let errorfound = false;
    conn.pool.execute(`SELECT Likes from Comments WHERE CommentID = ${req.params.id}`, (err, field) => {
        if(err) {
            console.log("Error finding comment. Error: ");
            console.error(err);
            res.send('Error: ' + err);
            errorfound = true;
            return;
        }
        console.log("Stuff received from Likes request MySQL Query:")
        console.log(field);
        let likes = field[0].Likes;
        const query = `UPDATE Comments
                        SET Likes = ${likes + 1}
                        WHERE CommentID = ${req.params.id}`;
        conn.pool.execute(query, (err, result) => {
                                if(err) {
                                    console.log("Error updating like count. Error: ");
                                    console.error(err);
                                    res.send({"status": "failed", "error": err});
                                    return;
                                }
                                res.send({"status": "good"});
                            })
                            
    })
}

exports.getlikesbyid = (req, res) => {
    conn.pool.execute(`SELECT Likes from Comments WHERE CommentID = ${req.params.id}`, (err, field) => {
        if(err) {
            console.log("Error finding comment. Error: ");
            console.error(err);
            res.send(
                "Error: " + err
            )
            return;
        }
        let likes = field[0].Likes
        console.log(typeof likes);
        res.send(field);
        return;
    })
};

exports.adddislike = (req, res) => {
    let errorfound = false;
    conn.pool.execute(`SELECT Dislikes from Comments WHERE CommentID = ${req.params.id}`, (err, field) => {
        if(err) {
            console.log("Error finding comment. Error: ");
            console.error(err);
            res.send({"status": "failed", "error": err});
            errorfound = true;
            return;
        }
        console.log("Stuff received from Likes request MySQL Query:")
        console.log(field);
        let dislikes = field[0].Dislikes;
        const query = `UPDATE Comments
                        SET Likes = ${dislikes + 1}
                        WHERE CommentID = ${req.params.id}`;
        conn.pool.execute(query, (err, result) => {
                                if(err) {
                                    console.log("Error updating dislike count. Error: ");
                                    console.error(err);
                                    res.send({"status": "failed", "error": err});
                                    return;
                                }
                                res.send({"status": "good"});
                            })
                            
    })
}
exports.getallcomments =  (req, res) => {
    conn.pool.execute(`SELECT * FROM Comments`, (err, results) => {
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
}

exports.addcomment = (req, res) => {
    console.log("Stuff received")
    console.log(req.body);
    const OriginPostId = SqlString.escape(req.body.OriginPostId);
    const InnerText = SqlString.escape(req.body.InnerText);
    const Author = SqlString.escape(req.body.Author);
    const Email = SqlString.escape(req.body.Email);
    const Website = SqlString.escape(req.body.Website);
    conn.pool.execute(`SELECT * FROM Users WHERE Username = ${Author} AND Email = ${Email} AND Website = ${Website}`, function(err, results) {
        if(err) {
            console.log(err);
            res.send("error: " + err);
            return;
        }
        let AuthorID = results[0];
        // check if user does not exist.
        
        conn.pool.execute(`INSERT INTO Comments (OriginPostId, InnerText, AuthorID, Likes, Dislikes, RepliesCount)
            VALUES (${OriginPostId}, ${InnerText}, ${AuthorID}, 0,0,0)
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
    
}