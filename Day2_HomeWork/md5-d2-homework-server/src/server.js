const express = require("express")
const studentRoute = require("./services/students")
const cors = require("cors")

const server = express()

server.use(cors())

server.use(express.json())

server.use("/students", studentRoute)


server.listen(3003, () => {
    console.log("Server running at port 3003")
})