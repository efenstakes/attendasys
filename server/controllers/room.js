// import external libraries
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator/check')


// import internal libraries
const db = require('../config/database')
const AppVars = require('../config/vars')
const validators = require('../validators/users')
const utils = require('./utils')



// create a user account
module.exports.save = async function(req, res) {
    let response = { saved: false, id: null, errors: [] }

    // handle errors
    let errors = validationResult(req).formatWith(validators.errorFormatter)
    if (!errors.isEmpty()) {
        response.errors = errors.array()
        return res.json(response)
    }

    // handle adding data to the database
    let query = 'insert into rooms ( name, lat, lng, city, building, type ) values( ?, ?, ?, ?, ?, ? )'

    let { name, lat, lng, city, building, type } = req.body
    console.log(req.body)
    sql_params = [name, lat, lng, city, building, type]

    // if (!lat || !lng) {
    //     query = 'insert into rooms ( name, city, building, type ) values( ?, ?, ?, ? )'
    //     sql_params = [name, city, building, type]
    // }

    let [result] = await db.execute(query, sql_params)

    if (result.affectedRows == 1) {
        response.saved = true
        response.id = result.insertId
    } else {
        throw 'Error'
    }

    res.json(response)
}


// to delete a room
module.exports.delete = async function(req, res) {
    let response = { deleted: false }
    let { id } = req.user

    let query = 'delete from rooms where id = ?'
    let [result] = await db.execute(query, [id])

    if (result.affectedRows == 1) {
        response.deleted = true
    }
    res.json(response)
}



// get room details
module.exports.get_details = async function(req, res) {
    let response = { room: {} }
    let { id } = req.params

    let roomQuery = 'select * from rooms where id = ?'
    let [roomResult] = await db.query(roomQuery, [id])

    if (roomResult && roomResult[0]) {
        response.room = roomResult[0]
    }
    res.json(response)

}

// get all rooms 
module.exports.all = async function(req, res) {
    let response = { rooms: [] }

    let roomQuery = 'select * from rooms'
    let [roomResult] = await db.query(roomQuery, [])

    if (roomResult && roomResult[0]) {
        response.rooms = roomResult
    }
    res.json(response)

}


// get a room bookings
module.exports.get_bookings = async function(req, res) {
    let response = { bookings: [] }
    let { id } = req.params

    let bookingsQuery = 'select * from attendance_bookings where room_id = ?'
    let userQuery = 'select * from users where id = ?'

    let [bkResult] = await db.execute(bookingsQuery, [id])

    let bookings = []
    for (const index in bkResult) {
        let booking = bkResult[index]

        let [userResult] = await db.query(userQuery, [tip.made_by])
        let made_by

        if (userResult && userResult[0]) {
            let { passcode, ...uzer } = userResult[0]
            made_by = uzer
        }
        let bookingg = { booking: booking, made_by: made_by }
        bookings.push(bookingg)
    }
    response.bookings = bookings

    res.json(response)
}


// user_id int,
// room_id int,
// from_time datetime,
// to_time datetime,
// went_in_at datetime,
// left_at datetime,
// get a users tips
module.exports.book = async function(req, res) {
    let response = { saved: false, id: null, errors: [] }
    let { id } = req.params

    // handle adding data to the database
    let query = 'insert into attendance_bookings ( user_id, room_id, from_time, to_time ) values( ?, ?, ?, ? )'

    let { user_id, from_time, to_time } = req.body

    let [result] = await db.execute(query, [user_id, id, from_time, to_time])

    if (result.affectedRows == 1) {
        response.saved = true
        response.id = result.insertId
    }


    res.json(response)
}

module.exports.update_booking_went_in = async function(req, res) {
    let response = { saved: false, errors: [] }
    let { id } = req.params

    // handle adding data to the database
    let query = 'update attendance_bookings set went_in_at = ? where id = ?'

    let [result] = await db.execute(query, [new Date(), id])

    if (result.affectedRows == 1) {
        response.saved = true
    }

    res.json(response)
}


module.exports.update_booking_left_at = async function(req, res) {
    let response = { saved: false, errors: [] }
    let { id } = req.params

    // handle adding data to the database
    let query = 'update attendance_bookings set left_at = ? where id = ?'

    let [result] = await db.execute(query, [new Date(), id])

    if (result.affectedRows == 1) {
        response.saved = true
    }

    res.json(response)
}