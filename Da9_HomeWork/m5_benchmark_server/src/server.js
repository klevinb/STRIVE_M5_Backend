const express = require("express")
const productsRoutes = require("./routes/products")
const reviewsRoutes = require("./routes/reviews")
const listEndpoints = require("express-list-endpoints")
const { notFound, generalError, checkReviewError } = require('./errorHandlers')
const { join } = require("path")
const cors = require("cors")

const server = express()

const publicFolderPath = join(__dirname, "./public")

server.use(cors())
server.use(express.json())
server.use(express.static(publicFolderPath))
const port = process.env.PORT || 3003

// Routes
server.use("/products", productsRoutes)
server.use("/reviews", reviewsRoutes)
console.log(listEndpoints(server))
server.use(checkReviewError)

server.use(notFound)
server.use(generalError)

server.listen(port, () => {
    console.log(`Server is running on PORT:${port}`)
})