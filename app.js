const createError    = require( 'http-errors' ),
      express        = require( 'express' ),
      path           = require( 'path' ),
      cookieParser   = require( 'cookie-parser' ),
      logger         = require( 'morgan' ),
      sassMiddleware = require( 'node-sass-middleware' ),
      app            = express()

// Paths
const publicPath = path.join( __dirname, 'public' )

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) )
app.set( 'view engine', 'ejs' )

app.use( logger('dev') )
app.use( express.json() )
app.use( express.urlencoded( { extended: false } ) )
app.use( cookieParser() )
app.use( sassMiddleware( {
    src: publicPath,
    dest: publicPath,
    debug: true,
    outputStyle: 'compressed'
}))
app.use(express.static(publicPath))

// Routes
const indexRouter = require( './routes/index' ),
      postRouter = require( './routes/insert-user' )

app.get( '/', indexRouter )

app.post( '/insert-user', postRouter )

// catch 404 and forward to error handler
app.use( (req, res, next) => {
    next(createError(404))
})

// error handler
app.use( ( err, req, res, next ) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status( err.status || 500 )
    res.render( 'error' )
})

module.exports = app
