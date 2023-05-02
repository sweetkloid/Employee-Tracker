
// Import and require mysql2
const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    //Add MySQL password
    password: 'rootroot',
    database: 'employees_db'
  });
  connection.connect((err) => {
    if (err) throw err;
  console.log(`Connected to the employees_db database.`);
  });
module.exports= connection;
