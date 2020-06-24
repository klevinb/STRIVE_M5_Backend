const express = require("express")
const listEndpoints = require("express-list-endpoints")
const studentRoute = require("./services/students")
const portfoliosRoute = require("./services/portfolio")
const cors = require("cors")


const server = express()

server.use(cors())

server.use(express.json())

const port = process.env.PORT || 3003

server.use("/students", studentRoute)
server.use("/projects", portfoliosRoute)

console.log(listEndpoints(server))


server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})