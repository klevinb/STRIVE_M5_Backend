const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const uniqid = require("uniqid")
const multer = require("multer")

const router = express.Router()
const upload = multer()
const port = process.env.PORT || 3003

const productsPath = path.join(__dirname, "products.json")
const imagePath = path.join(__dirname, "../../public/img/products")
const reviewsPath = path.join(__dirname, "../reviews/reviews.json")

const getProducts = async () => {
    try {
        const buffer = await fs.readFile(productsPath)
        const products = await JSON.parse(buffer)
        return products

    } catch (error) {
        console.log(error)
    }
}
const getReviews = async () => {
    try {
        const buffer = await fs.readFile(reviewsPath)
        const reviews = await JSON.parse(buffer)
        return reviews
    } catch (error) {
        console.log(error)
    }
}
router.get("/", async (req, res, next) => {
    const products = await getProducts()
    if (products.length > 0) {
        if (req.query && req.query.category) {
            const filteredProducts = products.filter(product => product.category === req.query.category)
            if (filteredProducts.length > 0) {
                res.status(200).send(filteredProducts)
            } else {
                const err = new Error()
                err.message = "We dont have products for this category yet!"
                err.httpStatusCode = 404
                next(err)
            }
        } else {
            res.status(200).send(products)
        }
    } else {
        const err = new Error()
        err.message = "We dont have products yet!"
        err.httpStatusCode = 404
        next(err)
    }
})
router.get("/:id", async (req, res, next) => {
    const products = await getProducts()
    if (products.length > 0) {
        const specificProduct = products.filter(product => product.id === req.params.id)

        if (specificProduct.length > 0) {
            res.status(200).send(specificProduct)
        } else {
            const err = new Error()
            err.message = "We dont have any product with that ID!"
            err.httpStatusCode = 404
            next(err)
        }

    } else {
        const err = new Error()
        err.message = "We dont have products yet!"
        err.httpStatusCode = 404
        next(err)
    }

})
router.get("/:id/reviews", async (req, res, next) => {
    const reviews = await getReviews()
    if (reviews.length > 0) {
        const filteredReviews = reviews.filter(review => review.elementId === req.params.id)
        if (filteredReviews.length > 0) {
            res.status(200).send(filteredReviews)
        } else {
            const err = new Error()
            err.message = "We dont have any reviews for this product!"
            err.httpStatusCode = 404
            next(err)
        }
    } else {
        const err = new Error()
        err.message = "We dont have any reviews yet!"
        err.httpStatusCode = 404
        next(err)
    }
})
router.post("/", async (req, res, next) => {
    const newProduct = {
        id: uniqid(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const products = await getProducts()
    products.push(newProduct)

    await fs.writeJSON(productsPath, products)

    res.status(201).send(products)
})
router.post("/:id/upload", upload.single("product"), async (req, res, next) => {

    await fs.writeFile(path.join(imagePath, `${req.params.id}.png`), req.file.buffer)
    const products = await getProducts()
    const specificProduct = products.filter(product => product.id === req.params.id)
    const productsWithoutSP = products.filter(product => product.id !== req.params.id)

    if (specificProduct.length > 0) {
        const addProductPhoto = specificProduct[0]
        addProductPhoto.imageUrl = `http://127.0.0.1:${port}/img/products/${req.params.id}.png`

        productsWithoutSP.push(addProductPhoto)

        await fs.writeJSON(productsPath, productsWithoutSP)

        res.status(200).send(productsWithoutSP)
    } else {
        const err = new Error()
        err.message = "We dont have any product with that ID!"
        err.httpStatusCode = 404
        next(err)
    }

})
router.put("/:id", async (req, res, next) => {
    const products = await getProducts()
    if (products.length > 0) {
        const specificProduct = products.filter(product => product.id === req.params.id)
        const productsWithoutSP = products.filter(product => product.id !== req.params.id)

        if (specificProduct.length > 0) {

            const editedProduct = {
                id: req.params.id,
                ...req.body,
                createdAt: specificProduct[0].createdAt,
                updatedAt: new Date()
            }
            productsWithoutSP.push(editedProduct)
            console.log(productsWithoutSP)
            await fs.writeJSON(productsPath, productsWithoutSP)
            res.status(200).send(editedProduct)
        } else {
            const err = new Error()
            err.message = "We dont have any product with that ID!"
            err.httpStatusCode = 404
            next(err)
        }

    } else {
        const err = new Error()
        err.message = "We dont have products yet!"
        err.httpStatusCode = 404
        next(err)
    }

})
router.delete("/:id", async (req, res, next) => {
    const products = await getProducts()
    const reviews = await getReviews()
    if (products.length > 0) {
        const specificProduct = products.filter(product => product.id === req.params.id)
        const productReviews = reviews.filter(review => review.elementId === req.params.id)

        if (specificProduct.length > 0) {
            const productsWithoutSP = products.filter(product => product.id !== req.params.id)
            await fs.writeJSON(productsPath, productsWithoutSP)

            if (productReviews.length > 0) {
                const reviewsWithoutSP = reviews.filter(review => review.elementId !== req.params.id)
                await fs.writeJSON(reviewsPath, reviewsWithoutSP)
                res.status(200).send("The product and reviews got deleted from the server!")
            } else {
                res.status(200).send("The product got deleted from the server!")
            }
        } else {
            const err = new Error()
            err.message = "We dont have any product with that ID!"
            err.httpStatusCode = 404
            next(err)
        }

    } else {
        const err = new Error()
        err.message = "We dont have products yet!"
        err.httpStatusCode = 404
        next(err)
    }

})

module.exports = router