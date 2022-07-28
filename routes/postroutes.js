'use strict'

const conn = require('../mysqlconnection');
const {grabpost} = require('../utils/util');
const ejs = require('ejs');

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