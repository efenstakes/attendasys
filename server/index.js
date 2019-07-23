// import external libraries
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')

// import internal libraries

// routes
const userRoutes = require('./routes/users')
const roomRoutes = require('./routes/room')
const attendaceRoutes = require('./routes/attendace')



// initializing the application instance
const app = express()
app.use(cors())

// setup body parser to help access json and other data from clients
// parse application/x-www-form-urlencoded and json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// setup passport authentication
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')


// hook up routes with controllers
app.use('/api/user', userRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/attendace', attendaceRoutes)

app.get('/', function(req, res) {
    res.json({ 'message': 'works' })
})


// start app on
app.listen(4444, function() {
    console.log('server started at port: 4444')
})