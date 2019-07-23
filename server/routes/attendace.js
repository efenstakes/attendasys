// import external libraries
const router = require('express').Router()
const passport = require('passport')

// import internal libraries
const attendaceController = require('../controllers/attendace')



router.get('/:id/attend', attendaceController.attend)

router.get('/:id/leave', attendaceController.leave)

router.get('/:id', attendaceController.get_details)


router.get('/book', attendaceController.book)



// export our routes
module.exports = router