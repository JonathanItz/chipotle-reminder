const express = require('express'),
      router = express.Router(),
      validator = require("email-validator");

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
        return res.send( { status: false, reason: 'An error occurred' } )
    }

    if( ! validator.validate( email ) ) {
        return res.send( { status: false, reason: 'Please enter a valid email' } )
    }

    connection.query(
        `CREATE TABLE IF NOT EXISTS users(
            id INT NOT NULL AUTO_INCREMENT,
            PRIMARY         KEY(id),
            email           varchar(255) NOT NULL UNIQUE,
            duration        varchar(10) NOT NULL,
            time            varchar(5),
            date_inserted   DATE NOT NULL
        )`,
        function ( error, results, fields) {
            if ( error ) {
                return res.send( { status: false, reason: 'Email already exists' } )
            }
        });

    const now = new Date()

    var user  = { email, duration, time, date_inserted: now };    

    connection.query('INSERT INTO users SET ?', user, function ( error, results, fields ) {
        if( error && error.code == 'ER_DUP_ENTRY' ) {
            return res.send( { status: false, reason: 'Email already exists' } )
        } else if( error ) {
            return res.send( { status: false, reason: 'An error occurred' } )
        }
        return res.send( { status: true } )
    });
})

module.exports = router
