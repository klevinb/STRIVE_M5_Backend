const express = require("express")
const invitationRoutes = require("./services/tickets")
const cors = require("cors")
const listEndopints = require("express-list-endpoints")
const { badRequest, notFound, generalError } = require("./errorHandlers")

const server = express()

server.use(express.json())
server.use(cors())

const port = process.env.PORT


server.use("/attendees", invitationRoutes)
server.use(badRequest)
server.use(notFound)
server.use(generalError)


console.log(listEndopints(server))
server.listen(port, () => {
    console.log(`Server running on port:${port}`)
})