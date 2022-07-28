'use strict'

// get root of app directory with path module.
const {dirname} = require('path');
const appDir = dirname(require.main.filename);

const conn = require('../mysqlconnection');
const {grabpost, convertcomment, convertpost} = require('../utils/util');
const ejs = require('ejs');
const SqlString = require('sqlstring');

console.log("Initializing connection for posts...");
conn.init();
console.log("Connection: " + conn.pool);
console.log("Connection: " + conn.pool);
exports.getpost = (req, res) => {
    let HTML = "";
    console.log(conn);
    console.log(conn.pool);
    conn.pool.query(`SELECT * FROM Posts WHERE PostID = ${req.params.id}`,function(err, results, fields) {
        if(err) {
            console.log("Error:");
            console.error(err);
            res.send("404 error not found");
            return;
        }
        console.log(results);
        let data = grabpost(results, 0);
        conn.pool.execute(`SELECT * from Comments WHERE OriginPostID = ${req.params.id}`, (err, comments) => {
            if(err) {
                console.log("Error finding comment. Error: ");
                console.error(err);
                res.send(
                    "404 error"
                )
                return;
            }
            data.comments = comments
            const HTML = ejs.renderFile('ejs/post.ejs', data, function(err, string) {
                if(err) {
                    console.log("Error rendering EJS.");
                    console.log(err);
                    res.send("Error Rendering EJS: " + err.message);
                    return;
                }
                res.send(string);
            });
            return;
        })
            

    })
}
exports.getallposts = (req, res) => {
    conn.pool.query('SELECT * FROM Posts', 
    function(err, results, fields) {
        if(err) {
            console.error(err);
            res.send('Error on the server console.');
            return;
        }

        console.log(results);
        let data = grabpost(results, 0);
        conn.pool.query(`SELECT * FROM Comments WHERE OriginPostID = ${results[0].PostID}`, (err, c_results, c_fields) => {
            if(err) {
                console.log(`Error retrieving comments from ${results[0].PostID}: `)
                console.error(err);
                data.comments = [];
                return;
            }
            console.log(`Comments retrieved from post. Post details:
                        PostID: ${results[0].PostID}; 
                        PostTitle: ${results[0].PostTitle};
                        PostID: ${results[0].PostSubtitle}; `);
            console.log(c_results);
            data.comments = c_results;
            
            console.log("Data to be processed: ");
            console.log(data);
            const HTML = ejs.renderFile('ejs/post.ejs', data, function(err, string) {
                if(err) {
                    console.log("Error rendering EJS.");
                    console.log(err);
                    return;
                }
                res.send(string);
            });
        } );
        /*
        data.comments = [{
                            CommentID: 1,
                            InnerText: "meow",
                            Author: "jasmine",
                            Likes: 25,
                            Dislikes: 0},
                        {
                            CommentID: 2,
                            InnerText: "123",
                            Author: "bob",
                            Likes: 0,
                            Dislikes: 1}]
                            */

        
    })   
}
exports.newpost =  (req, res) => {
    res.sendFile(appDir + '/public/newpost.html');
}
exports.newpost_receive = (req, res) => {
    console.log("Stuff received")
    console.log(req.body);
    const body = req.body;
    // https://stackoverflow.com/questions/46718772/how-i-can-sanitize-my-input-values-in-node-js
    /*
    const title = sanitizer.value(req.body.title, 'string');
    const subtitle = sanitizer.value(req.body.subtitle, 'string')
    const mainbody = sanitizer.value(req.body.mainbody, 'string');
    const conclusion = sanitizer.value(req.body.conclusion, 'string');
    */  
    const title = SqlString.escape(req.body.title);
    const subtitle = SqlString.escape(req.body.subtitle);
    const mainbody = SqlString.escape(req.body.mainbody);
    const conclusion = SqlString.escape(req.body.conclusion);

    console.log('\r\n' + mainbody + '\r\n');
    const query ="INSERT INTO Posts (PostTitle, PostSubtitle, PostMainBody, PostConclusion, PostCommentCount) VALUES (" + title + "," + subtitle + ", " + mainbody + ", " + conclusion + ", 0)";
    console.log("\r\n\r\nQuery executed: \r\n\r\n%s\r\n", query);
    conn.pool.execute(query, function(err, results, fields) {
            if(err) {
                console.log("An error occurred");
                console.log(err);
            }
            console.log(results);
            console.log(fields);
        })
    res.send(`{"meow": "meow"}`);
};
