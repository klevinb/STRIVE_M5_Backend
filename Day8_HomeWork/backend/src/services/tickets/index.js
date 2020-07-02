const express = require("express")
const { join } = require("path")
const { readTickets, writeTickets } = require("../../functions")
const fs = require("fs-extra")
const uniqid = require("uniqid")
const { check, validationResult } = require("express-validator")


const sgMail = require('@sendgrid/mail')
const PdfPrinter = require('pdfmake')
const qr = require("qrcode")

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
        var fonts = {
            Roboto: {
                normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
                bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
                italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
                bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
            }
        };
        var printer = new PdfPrinter(fonts);
        var docDefinition = {
            pageMargins: [150, 50, 150, 50],
            content: [
                { text: 'YEEYY PARTY TIME!!', fontSize: 25, background: 'yellow', italics: true },
                "                                                                      ",
                `Thanks for joining ${newTicket.firstname} ${newTicket.secondname}!`,
                'I hope you will have fun, and dont forget to get drunk!',
            ]
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(join(pdfSaver, `${newTicket.id}.pdf`)));
        pdfDoc.end();


        const pdfData = join(__dirname, `pdf/${newTicket.id}.pdf`)

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const sendEmail = async () => {
            fs.readFile(pdfData, function (err, data) {
                let data_base64 = data.toString('base64')
                sgMail.send({
                    to: `${newTicket.email}`,
                    from: 'developersParty@gmail.com',
                    subject: 'Party Ticket',
                    text: 'report',
                    attachments: [{
                        filename: `${newTicket.firstname}Ticket.pdf`,
                        content: data_base64,
                        type: 'application/pdf',
                        disposition: 'attachment',
                    }],
                })
            })
        }

        const intervalFunc = async () => {
            const tickets = await readTickets(invitationsPath)
            tickets.push(newTicket)
            await writeTickets(invitationsPath, tickets)
            console.log("here")
        }

        setTimeout(sendEmail, 1000);
        setTimeout(intervalFunc, 5000);

        res.status(201).send("Created")
    }
})





module.exports = router