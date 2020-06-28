const express = require('express'),
      router = express.Router()

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chipotle'
});

router.post( '/insert-user', (req, res, next) => {
    const { email, duration, time } = req.body
    
    if( ! email || ! duration || ! time ) {
        res.send( `so. you're probably wondering why i invited you here.` )
        return
    }

    connection.query( "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), DATE    DATE NOT NULL, VALUE   SMALLINT(4) UNSIGNED NOT NULL", function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });

    console.log(email);
    console.log(duration);
    console.log(time);
})

module.exports = router
