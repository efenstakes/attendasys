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
    // let errors = validationResult(req).formatWith(validators.errorFormatter)
    // if (!errors.isEmpty()) {
    //     response.errors = errors.array()
    //     return res.json(response)
    // }


    // handle adding data to the database
    let query = 'insert into users ( name, passcode, email, user_type ) values( ?, ?, ?, ? )'

    let { username, password, password_confirmation, email, type } = req.body

    if (password !== password_confirmation) {
        response.errors.push({ password: 'Passwords must match' })
        return response
    }
    let passwordHash = bcrypt.hashSync(password, 10)
    console.log('add user', req.body)
    let [result] = await db.execute(query, [username, passwordHash, email, 'REGULAR'])

    if (result.affectedRows == 1) {
        response.saved = true
        response.id = result.insertId
    }

    res.json(response)
}


// to delete a user
module.exports.delete = async function(req, res) {
    let response = { deleted: false }
    let { id } = req.user

    let query = 'delete from users where id = ?'
    let [result] = await db.execute(query, [id])

    if (result.affectedRows == 1) {
        response.deleted = true
    }
    res.json(response)
}


// uodate user profile
module.exports.update = async function(req, res) {
    let response = { updated: false }

    // handle errors
    let errors = validationResult(req).formatWith(validators.errorFormatter)
    if (!errors.isEmpty()) {
        response.errors = errors.array()
        return res.json(response)
    }

    let { id } = req.user
    let { username, dob, city, email } = req.body

    let query = 'update users set username = ?, email = ?, dob = ?, city = ? where id = ?'
    let [result] = await db.execute(query, [username, email, dob, city, id])

    if (result.affectedRows == 1) {
        response.updated = true
    }
    res.json(response)

}


// get user details
module.exports.get_details = async function(req, res) {
    let response = { user: {} }
    let { id } = req.params

    let userQuery = 'select * from users where id = ?'
    let [userResult] = await db.query(userQuery, [id])

    if (userResult && userResult[0]) {
        let { passcode, ...user } = userResult[0]
        response.user = user
    }
    res.json(response)

}

// get a users tips
module.exports.get_tips = async function(req, res) {
    let response = { tips: [] }
    let { id } = req.params

    let tipQuery = 'select * from transactions where content_creator = ?'
    let userQuery = 'select * from users where id = ?'

    let [tipResult] = await db.execute(tipQuery, [id])

    let tips = []
    for (const tipIndex in tipResult) {
        let tip = tipResult[tipIndex]

        let [userResult] = await db.query(userQuery, [tip.made_by])
        let made_by = { type: 'Anonymous' }

        if (userResult && userResult[0]) {
            let { passcode, ...uzer } = userResult[0]
            made_by = uzer
        }
        let tipp = { tip: tip, made_by: made_by }
        tips.push(tipp)
    }
    response.tips = tips

    res.json(response)
}

// log a user in
module.exports.login = async function(req, res) {
    let response = { token: null, user: {} }

    if (req.user && req.user.id) {

        let token_data = { id: req.user.id, timestamp: Date.now() }
        let token = jwt.sign({ data: token_data }, AppVars.jwt.secret)
        response.token = token
        response.user = req.user

    }
    res.json(response)
}


// verify a user account
module.exports.verify = async function(req, res) {
    let response = { verified: false }

    let { code } = req.params

    let verificatnQuery = 'select * from verifications where code = ?'
    let delQuery = 'delete from verifications where code = ?'
    let query = 'update users set verified = ? where id = ?'

    const temp_con = await db.getConnection()
    await temp_con.beginTransaction()

    try {

        let [verificatnResult] = await temp_con.execute(verificatnQuery, [code])

        if (verificatnResult && verificatnResult[0]) {
            let verification_record = verificatnResult[0]

            let [queryResult] = await temp_con.execute(query, [true, verification_record.user_id])

            if (queryResult.affectedRows == 1) {
                response.verified = true
            } else {
                throw 'Error'
            }

            await temp_con.execute(delQuery, [code])

        } else {
            throw 'Error'
        }

        await temp_con.commit()
    } catch (e) {
        temp_con.rollback()
    } finally {
        temp_con.release()
    }

    res.json(response)
}