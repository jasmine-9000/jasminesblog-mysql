
const SqlString = require('sqlstring');
const {conn} = require('../model/mysqlconnection');
const {grabpost, convertcomment, convertpost} = require('../utils/util');

function GetPostByIdSQL(id) {
    fs.readFile(path.join(__dirname, '/sql/GetPostById.sql'),"ascii", (err, data) => {
        if(err) throw err;
        console.log("Query:");
        console.log(data);
        conn.query(data, (err, sets, fields) => {
            if(err) throw err;
        })
    })
}
function GetPostByID (req, res) {
    let HTML = "";
    console.log(conn);
    console.log(conn.pool);
    // in /post/:id, req.params.id is defined.
    // execute mysql query to retrieve the post. 
    conn.pool.query(`SELECT * FROM Posts WHERE PostID = ${req.params.id}`,function(err, results, fields) {
        // error handling
        if(err) {
            console.log("Error:");
            console.error(err);
            res.send("404 error not found");
            return;
        }
        console.log("Stuff received from MySQL query: ")
        console.log(results);
        // format data
        let data = grabpost(results, 0);
        
        // grab all comments left under that post with MySQL, and the Username with information with it.
        conn.pool.execute(`SELECT * from Comments INNER JOIN Users ON Users.UserID = Comments.AuthorID AND OriginPostID = ${req.params.id}`, (err, comments) => {
            // error handling
            if(err) {
                console.log("Error finding comment. Error: ");
                console.error(err);
                res.send("Error: " + err
                )
                return;
            }
            console.log("Stuff received from new INNER JOIN query:");
            console.log(comments);
            data.comments = comments
            // render the data
            res.render('post.ejs', data);
        })
    })
}

function GetAllPosts (req, res) {
    conn.pool.query('SELECT * FROM Posts', 
    function(err, results, fields) {
        if(err) {
            console.error(err);
            res.send('Error on the server console.');
            return;
        }

        console.log(results);
        res.render('allposts.ejs', {posts: results})
        /*
        let data = grabpost(results, 0);
        conn.pool.query(`SELECT * FROM Comments INNER JOIN Users ON Users.UserID = Comments.AuthorID AND OriginPostID = ${results[0].PostID}`, (err, c_results, c_fields) => {
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
        */

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

function NewPost(req, res) {
    res.render('newpost');
}

function CreateNewPost(req, res)  {
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
}

function EditPostPage(req, res) {
    const postid = req.params.id; 
    const query = `SELECT * FROM Posts WHERE PostID = ${postid}`;
    conn.pool.execute(query, function(err, results) {
        const data = grabpost(results,0);
        res.render('editpost', data);
    });
    
}
function EditPost (req, res)  {
    const postid = req.params.id;
    const title = SqlString.escape(req.body.title);
    const subtitle = SqlString.escape(req.body.subtitle);
    const mainbody = SqlString.escape(req.body.mainbody);
    const conclusion = SqlString.escape(req.body.conclusion);
    const query = `UPDATE Posts 
                    SET PostTitle = ${title}, PostSubtitle = ${subtitle}, PostMainbody = ${mainbody}, PostConclusion=${conclusion}
                    WHERE PostID = ${postid}`;
    conn.pool.execute(query, function(err, results) {
        if(err) {
            console.log('Error updating post. Error: ');
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log("Successfully updated database. Results:");
            console.log(results);
            res.redirect('/posts/' + postid)
        }
    })
}

function DeletePost (req, res)  {
    const postid = req.params.id;
    const deletepostquery = `DELETE FROM Posts WHERE Posts.PostID = ${postid};`;
    console.log(deletepostquery);
    conn.pool.execute(deletepostquery, function(err, results) {
        if(err) {
            console.log('Error deleting post and comments. Error: ');
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log('Successfully deleted post. ')
            res.redirect('/posts');
        }
    })
}

module.exports = {
    GetPostByID,
    GetAllPosts,
    NewPost,
    CreateNewPost,
    EditPostPage,
    EditPost,
    DeletePost
}