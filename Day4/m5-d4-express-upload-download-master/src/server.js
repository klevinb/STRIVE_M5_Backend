const express = require("express")
const listEndpoints = require("express-list-endpoints")
const { join } = require("path")
const cors = require("cors")
const usersRouter = require("./services/users")
const moviesRouter = require("./services/movies")
const filesRouter = require("./services/files")
const problematicRoutes = require("./services/problematicRoutes")
const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} = require("./errorHandling")

const server = express()

const port = process.env.PORT || 3002

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`)
  next()
}

const publicFolderPath = join(__dirname, "../public")

server.use(cors())
server.use(express.static(publicFolderPath))
server.use(express.json()) // Built in middleware to parse application/json bodies
server.use(loggerMiddleware)

// ROUTES
server.use("/users", usersRouter)
server.use("/movies", moviesRouter)
server.use("/problems", problematicRoutes)
server.use("/files", filesRouter)

// ERROR HANDLERS

server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

console.log(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
