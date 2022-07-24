const mysql = require('mysql2');
const express = require('express');
const ejs = require('ejs');
const SqlString = require('sqlstring');


require('dotenv').config();
// import ifixit from './ifixit.json' assert {type: 'json'};

// VARIABLES

// SERVER VARIABLES

const SERVER_PORT = 5500;

// DATABASE VARIABLES
const PORT = process.env.DB_PORT;
const XPROTOCOLPORT = process.env.DB_XPROTOCOLPORT;
const ROOT_PASSWORD = process.env.DB_ROOT_PASSWORD;

const HOST = process.env.DB_HOST;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const WINDOWS_SERVICE_NAME = process.env.WINDOWS_SERVICE_NAME_MYSQL;

// MAIN APP CREATION

const app = express();
// MIDDLEWARE
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());



// file imports 

const conn = mysql.createConnection({
    host: HOST, 
    user: USERNAME,
    password: PASSWORD,
    database: 'MyPosts'
})

// server stuff
app.use('/', express.static(__dirname + '/public'));
/*
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
}) */
function grabpost(results, place=0) {
    const post = results[place];
    return convertpost(post);
}

function convertpost(post) {
    let data;
    if(post) {
        data = {   
                  PostID: post.PostID,
                  title: post.PostTitle ? post.PostTitle :  "",
                  subtitle: post.PostSubtitle ? post.PostSubtitle :  "",
                  mainbody: post.PostMainBody ? post.PostMainBody : "",
                  conclusion: post.PostConclusion ? post.PostConclusion :  ""}
    }
    else {
        data = {title: "404 not found",
                subtitle: "",
                mainbody: "",
                conclusion: ""}
    }
    return data;
}

function convertcomment(comment) {
    let data;
    if(comment) {
        data = comment
    }
    else {
        data = {CommentID: "-1",
                OriginPostId: "-1",
                InnerText: "404 Not Found",
                Author: "unknown",
                Likes: 0,
                Dislikes: 0,
                RepliesCount: 0}
    }
    return data;
}

app.get('/posts', (req, res) => {
    conn.query('SELECT * FROM Posts', 
    function(err, results, fields) {
        if(err) {
            console.error(err);
            res.send('Error on the server console.');
            return;
        }

        console.log(results);
        let data = grabpost(results, 0);
        conn.query(`SELECT * FROM Comments WHERE OriginPostID = ${results[0].PostID}`, (err, c_results, c_fields) => {
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
            const HTML = ejs.renderFile(__dirname + '/ejs/post.ejs', data, function(err, string) {
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
    
})

app.get('/newpost', (req, res) => {
    res.sendFile(__dirname + '/public/newpost.html');
})
app.post('/newpost', (req, res) => {
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
    conn.execute(query, function(err, results, fields) {
            if(err) {
                console.log("An error occurred");
                console.log(err);
            }
            console.log(results);
            console.log(fields);
        })
    res.send(`{"meow": "meow"}`);
});


app.get('/ejssample', (req, res) => {
    const HTML = ejs.render('<%= people.join(",");%>', {people: ['geddy', 'meow']})
    console.log(HTML);
    res.send(HTML);
})



app.get('/posts/:id', (req, res) => {
    let HTML = "";
    conn.execute(`SELECT * FROM Posts WHERE PostID = ${req.params.id}`,function(err, results, fields) {
        if(err) {
            console.log("Error:");
            console.error(err);
            return;
        }
        console.log(results);
        let data = grabpost(results, 0);
        conn.execute(`SELECT * from Comments WHERE OriginPostID = ${req.params.id}`, (err, comments) => {
            if(err) {
                console.log("Error finding comment. Error: ");
                console.error(err);
                res.send(
                    "404 error"
                )
                return;
            }
            data.comments = comments
            const HTML = ejs.renderFile(__dirname + '/ejs/post.ejs', data, function(err, string) {
                if(err) {
                    console.log("Error rendering EJS.");
                    console.log(err);
                    return;
                }
                res.send(string);
            });
            return;
        })
            

    })
    // res.send(`not implemented. Post id: ${req.params.id}`)
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
        const HTML = ejs.renderFile(__dirname + '/ejs/partials/comment.ejs', data, function(err, string) {
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
    conn.execute(`INSERT INTO Comments (OriginPostId, InnerText, Author, Likes, Dislikes, RepliesCount)
            VALUES ('${req.body.OriginPostId}', '${req.body.InnerText}', '${req.body.Author}', 0,0,0)
        `, function(err, results, fields) {
            if(err) {
                console.log("An error occurred");
                console.log(err);
            }
            console.log(results);
            console.log(fields);
        })
    res.send(`{"meow": "meow"}`);
})



app.listen(SERVER_PORT, () => {
    console.log(`Server running on ${SERVER_PORT}... Better go catch it!`)
})