// import external libraries
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator/check')


// import internal libraries
const db = require('../config/database')
const AppVars = require('../config/vars')
const validators = require('../validators/users')
const utils = require('./utils')

// user_id int,
// room_id int,
// from_time datetime,
// to_time datetime,
// went_in_at datetime,
// left_at datetime,

// add attendance
module.exports.book = async function(req, res) {
    let response = { saved: false, id: null, errors: [] }

    // handle errors
    // let errors = validationResult(req).formatWith(validators.errorFormatter)
    // if (!errors.isEmpty()) {
    //     response.errors = errors.array()
    //     return res.json(response)
    // }

    // handle adding data to the database
    let query = 'insert into attendance_bookings ( user_id, room_id, from_time, to_time, ref) values( ?, ?, ?, ?, ? )'

    let { room_id, from_time, to_time } = req.body
    let user_id = req.user.id
    let ref = utils.generate_code()

    let [result] = await db.execute(query, [user_id, room_id, from_time, to_time, ref])

    if (result.affectedRows == 1) {
        response.saved = true
        response.id = result.insertId
    } else {
        throw 'Error'
    }

    res.json(response)
}


// update time someone goes in
module.exports.attend = async function(req, res) {
    let response = { updated: false }

    let user_id = req.user.id
    let { id } = req.params

    // handle adding data to the database
    let query = 'update attendance_bookings set went_in_at = ? where id = ? and user_id = ?'


    let [result] = await db.execute(query, [new Date(), id, user_id])

    if (result.affectedRows == 1) {
        response.updated = true
    }

    res.json(response)
}

// update time someone leaves 
module.exports.leave = async function(req, res) {
    let response = { updated: false }

    let user_id = req.user.id
    let { id } = req.params

    // handle adding data to the database
    let query = 'update attendance_bookings set left_at = ? where id = ? and user_id = ?'


    let [result] = await db.execute(query, [new Date(), id, user_id])

    if (result.affectedRows == 1) {
        response.updated = true
    }

    res.json(response)
}



// get attendance details
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