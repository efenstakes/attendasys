// import external libraries
const router = require('express').Router()
const passport = require('passport')

// import internal libraries
const roomController = require('../controllers/room')
var validators = require('../validators/users')


router.post('/', roomController.save)



router.delete('/', passport.authenticate('users-jwt', { session: false }), roomController.delete)


router.get('/:id', roomController.get_details)


router.get('/', roomController.all)


router.get('/:id/bookings', roomController.get_bookings)


router.get('/:id/book', roomController.book)



// export our routes
module.exports = router