// get root of app directory with path module.
const {dirname} = require('path');


// get utilities required for this module.
const {grabpost, convertcomment, convertpost} = require('../utils/util');
// third party modules required 
const SqlString = require('sqlstring');
const {conn} = require('../model/mysqlconnection')

function GetCommentByIdSQLFile(id) {
    fs.readFile(path.join(__dirname, '/sql/GetCommentById.sql'),"ascii", (err, data) => {
        if(err) throw err;
        // data.findSubString("$CommentID")
        console.log("Query:");
        console.log(data);
        conn.query(data, (err, sets, fields) => {
            if(err) throw err;
        })
    })
}
function GetAllCommentsSQLFile() {
    fs.readFile(path.join(__dirname, '/sql/GetAllComments.sql'),"ascii", (err, data) => {
        if(err) throw err;
        console.log("Comments:");
        conn.query(data, (err, sets, fields) => {
            if(err) throw err;
        })
    })
}

function GetCommentsByID (req, res) {
    try {
        
        console.log("In Controller")
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
            res.render('singularcomment', {comment: data});
        })
    } catch {
        console.log("Error:")
        res.send("503 error");
    }
}

function AddLike (req, res) {
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

function GetLikesByID (req, res)  {
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

function AddDislike (req, res) {
    console.log("Add dislike button server handler entered.")
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
                        SET Dislikes = ${dislikes + 1}
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

function GetAllComments (req, res)  {
    try {

        console.log("In GetAllComments");
        conn.pool.execute(`SELECT * FROM Comments`, (err, results) => {
            if(err) {
                console.log("Error retrieving all comments. Error: ");
                console.error(err);
                res.send("Internal Server Error", 503)
                return;
            }
            res.render('allcomments.ejs', {comments: results});
        })
    } catch{
        console.log("Error");
        res.send("503 Internal Server Error");
    }
}
function AddComment (req, res) {
    console.log("Stuff received")
    console.log(req.body);
    const OriginPostId = SqlString.escape(req.body.OriginPostId);
    const InnerText = SqlString.escape(req.body.InnerText);
    const Author = SqlString.escape(req.body.Author);
    const Email = SqlString.escape(req.body.Email);
    const Website = SqlString.escape(req.body.Website);
    // try to find UserID
    conn.pool.execute(`SELECT * FROM Users WHERE Username = ${Author} AND Email = ${Email} AND Website = ${Website}`, function(err, results) {
        if(err) {
            console.log(err);
            res.send("error: " + err);
            return;
        }
        let AuthorID;
        
        console.log("\r\n\r\n\r\nResult of User search:\r\n\r\n\r\n");
        console.log(results);
        console.log("");
        // check if user does not exist.
        /*
            if len(results) = 0: 
                create new user with credentials:
                    UserName inputted
                    Email: inputted
                    Website: inputted ? 'n/a' if not inputted

        */
        if(results.length === 0) {
            const IPADDRESS = SqlString.escape( req.ip); // how to get IP in node
            const query = `INSERT INTO Users (Username, Email, Website, IPADDRESS)
                                VALUES (${Author}, ${Email}, ${Website ? Website : '\'n/a\''}, ${IPADDRESS})`
            console.log("Query to be executed: ");
            console.log(query)
            console.log("\r\n\r\n\r\n\r\n");
            conn.pool.execute(query,
                                    function(err, newuserresults) {
                                        if(err) {
                                            console.log("LOL U DIED LOLOLOL YOU DIED")
                                            res.send({status: "failed", error: err})
                                            return;
                                        }
                                        console.log(newuserresults);
                                        AuthorID = newuserresults.insertId;
                                        conn.pool.execute(`INSERT INTO Comments (OriginPostId, InnerText, AuthorID, Likes, Dislikes, RepliesCount)
                                            VALUES (${OriginPostId}, ${InnerText}, ${AuthorID}, 0,0,0)`,
                                            function(err, results, fields) {
                                            if(err) {
                                                console.log("\r\n\r\n\r\n\r\n");
                                                console.log("An error occurred");
                                                console.log(err);
                                                console.log("\r\n\r\n\r\n\r\n");
                                                if(err.code === 'ER_DATA_TOO_LONG') {
                                                    res.sendStatus(400);
                                                } else {
                                                    res.sendStatus(500);
                                                }
                                                return;
                                            }
                                            console.log("Stuff received back after POST comment:");
                                            console.log(results);
                                            console.log(fields);
                                            res.send(String(results.insertId));
                                        })
                                        
                                    })
        } else {
            AuthorID = results[0].UserID;
            conn.pool.execute(`INSERT INTO Comments (OriginPostId, InnerText, AuthorID, Likes, Dislikes, RepliesCount)
                VALUES (${OriginPostId}, ${InnerText}, ${AuthorID}, 0,0,0)
            `, function(err, results, fields) {
                if(err) {
                    console.log("An error occurred");
                    console.log(err);
                    if(err.code === 'ER_DATA_TOO_LONG') {
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(500);
                    }
                    return;
                }
                console.log("Stuff received back after POST comment:");
                console.log(results);
                console.log(fields);
                res.send(String(results.insertId));
            })
        }    
    })
    
}
function DeleteComment(req, res) {
    const postid = req.params.id;
    const deletecommentquery = `DELETE FROM Comments WHERE Comments.CommentID = ${postid};`;
    conn.pool.execute(deletecommentquery, function(err, result) {
        if(err) {
            console.log("Error deleting comment. Error: ");
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log("Successfully deleted comment.");
            res.sendStatus(200);
        }
    })
}
function EditComment(req, res)  {
    res.send("Not implemented yet");
    
}
module.exports = {
    GetCommentsByID,
    AddLike,
    GetLikesByID,
    AddDislike,
    GetAllComments,
    AddComment,
    DeleteComment,
    EditComment
}