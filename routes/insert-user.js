const express   = require('express'),
      router    = express.Router(),
      validator = require("email-validator"),
      path      = require( 'path' ),
      fs        = require( 'fs' )

router.post( '/insert-user', (req, res, next) => {
    const { email, duration, time } = req.body

    if( ! email || ! duration || ! time ) {
        return res.send( { status: false, reason: 'An error occurred' } )
    }

    if( ! validator.validate( email ) ) {
        return res.send( { status: false, reason: 'Please enter a valid email' } )
    }

    const mysql = require('mysql'),
         connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'chipotle'
        });

    const nodemailer = require( "nodemailer" );

    // async..await is not allowed in global scope, must use a wrapper
    async function main( email, duration, time ) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        const secret = fs.readFileSync(path.join(__dirname, '../secret.txt'), { encoding: 'utf-8' }, function (err, data) {
            return data
        })

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'madelyn.shields78@ethereal.email',
                pass: secret
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'Smith. John Smith', // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `You have a reminder every ${ duration } at ${ time }.`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    connection.query(
        `CREATE TABLE IF NOT EXISTS users(
            id INT NOT NULL AUTO_INCREMENT,
            PRIMARY         KEY(id),
            email           varchar(255) NOT NULL UNIQUE,
            duration        varchar(10) NOT NULL,
            time            varchar(5),
            verified        tinyint(1) default 0,
            subscribed      tinyint(1) default 0,
            date_inserted   DATE NOT NULL
        )`,
        function ( error, results, fields) {
            console.log(error);
            
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

        main( email, duration, time ).catch(console.error);
        
        return res.send( { status: true } )
    });
})

module.exports = router
