const express = require("express")
const { join } = require("path")
const { readTickets, writeTickets } = require("../../functions")
const fs = require("fs-extra")
const uniqid = require("uniqid")
const { check, validationResult } = require("express-validator")


const sgMail = require('@sendgrid/mail')

const { Transform } = require('json2csv')
const pump = require("pump")

const router = express.Router()

const invitationsPath = join(__dirname, 'tickets.json')
const pdfSaver = join(__dirname, 'pdf')

router.get("/csv", async (req, res, next) => {
    const fields = ['id', 'firstname', 'secondname', 'email', 'time']
    const opts = { fields }

    const input = createReadStream(invitationsPath)
    const json2csv = new Transform(opts)

    res.setHeader("Content-Disposition", "attachment; filename=tickets.csv")
    pump(input, json2csv, res)
})

router.post("/", [
    check('firstname').exists().withMessage("Every ticket should have a name!"),
    check('secondname').exists().withMessage("Every ticket should have a surname!"),
    check('email').exists().withMessage("You should put your email!"),
    check('time').exists().withMessage("We need to know when you'll arrive!"),
    check("email").isEmail().withMessage("This is not a proper email")
], async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err = new Error()
        err.httpStatusCode = 400
        err.message = errors
        next(err)
    } else {
        const newTicket = { id: uniqid(), ...req.body }
        const tickets = await readTickets(invitationsPath)
        tickets.push(newTicket)
        await writeTickets(invitationsPath, tickets)
        res.status(201).send("Created")
    }
})



module.exports = router