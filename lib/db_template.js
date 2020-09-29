var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: '',
    insecureAuth: true
});
db.connect();

module.exports = db;