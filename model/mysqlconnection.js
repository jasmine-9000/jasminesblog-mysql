const fs = require('fs');
const mysql = require('mysql2');
const readline = require('readline');
const path = require('path');
// grab environment variables.
// some of them 
const PORT = process.env.DB_PORT;
const XPROTOCOLPORT = process.env.DB_XPROTOCOLPORT;
const ROOT_PASSWORD = process.env.DB_ROOT_PASSWORD;

const HOST = process.env.DB_HOST;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const WINDOWS_SERVICE_NAME = process.env.WINDOWS_SERVICE_NAME_MYSQL;
const DBNAME = process.env.DB_NAME;
const POOLSIZE = 100;
function Connection() {
    console.log("Trying login to database with these credentials: ");
    console.log("Database Host:", HOST);
    console.log("Database Username:", USERNAME);
    console.log("Database Password:", PASSWORD);

    this.pool = null;
    this.init = async function() {
        this.pool = mysql.createPool(
            {
                connectionLimit: POOLSIZE,
                host: HOST,
                database: DBNAME,
                user: USERNAME,
                password: PASSWORD,
                debug: false,
                multipleStatements: true
            }
        )
        let pool = this.pool;
        function process(data, pool) {
            pool.query(data, (err, sets, fields) => {
                if(err) throw err;
            })
        }
        // create tables if not already there.
        fs.readFile(path.join(__dirname, '/sql/Users.sql'),"ascii", (err, data) => {
            if(err) throw err;
            console.log("Users: ");
        
            process(data, pool);
        })
        fs.readFile(path.join(__dirname, '/sql/Posts.sql'),"ascii", (err, data) => {
            if(err) throw err;
            console.log("Posts: ")
            process(data, pool);
        })
        fs.readFile(path.join(__dirname, '/sql/Replies.sql') ,"ascii", (err, data) => {
            if(err) throw err;
            console.log("Replies: ");
            process(data, pool)
        })
        fs.readFile(path.join(__dirname, '/sql/Comments.sql'),"ascii", (err, data) => {
            if(err) throw err;
            console.log("Comments:");
            process(data, pool)
        })
        /*
        let rl = readline.createInterface({
            input:  fs.createReadStream('./sql/oldsql/CreatePostTablesQuery.sql'),
            terminal: false
        });
        let pool = this.pool;
        rl.on('line', function(chunk) {
            
            pool.query(chunk.toString('ascii'), function(err, sets, fields) {
                if(err) console.log(err);
            });
        })

        rl.on('close', function() {
            console.log("Finished");
        })
        */
    }
    this.acquire = function(callback) {
        this.pool.getConnection(function(err, connection) {
            callback(err, connection);
        });
    };
    this.executequery = function(querystring, callback) {
        this.executepromise();
    }
    this.executepromise = function() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err, connection) {
                if(err) {
                    return reject(err);
                }
                resolve(connection);
            });
        })
    }
    console.log("Connection: " + this.pool);
}

const conn = new Connection();
conn.init();



module.exports = {conn}