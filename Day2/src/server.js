const express = require("express")
const usersRoutes = require("../services/users/index")

const server = express()

server.use(express.json()) //parse the bodies when they are in json format

server.use("/users", usersRoutes)

server.listen(3001, () => {
    console.log("Server is running on port 3001")
})