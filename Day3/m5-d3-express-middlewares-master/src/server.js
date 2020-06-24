const express = require("express")
const listEndpoints = require("express-list-endpoints")
const usersRouter = require("./services/users")
const moviesRouter = require("./services/movies")
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

server.use(express.json()) // Built in middleware
server.use(loggerMiddleware)

// ROUTES
server.use("/users", usersRouter)
server.use("/movies", moviesRouter)
server.use("/problems", problematicRoutes)

// ERROR HANDLERS

server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

console.log(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
