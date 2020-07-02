const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const uniqid = require("uniqid")
const multer = require("multer")
const { xml2js } = require("xml-js")
const { begin } = require("xmlbuilder")
const axios = require("axios")
const PdfPrinter = require('pdfmake')
const pump = require("pump")
const { Transform } = require("json2csv")

const router = express.Router()
const upload = multer()
const port = process.env.PORT || 3003

const productsPath = path.join(__dirname, "products.json")
const imagePath = path.join(__dirname, "../../public/img/products")
const reviewsPath = path.join(__dirname, "../reviews/reviews.json")
const pdfSaverPath = path.join(__dirname, "../../public/pdf")

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
router.get("/calculate/sumTwoPrices", async (req, res, next) => {
    if (req.query && req.query.p1price && req.query.p2price) {
        const product1 = parseInt(req.query.p1price)
        const product2 = parseInt(req.query.p1price)
        console.log(product1, product2)
        try {
            const xml = begin({
                version: "1.0",
                encoding: "utf-8",
            })
                .ele('soap:Envelope',
                    {
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                        "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/"
                    })
                .ele("soap:Body")
                .ele("Add", { "xmlns": "http://tempuri.org/" })
                .ele("intA")
                .text(product1)
                .up()
                .ele("intB")
                .text(product2)
                .end()

            const response = await axios({
                method: "post",
                url: "http://www.dneonline.com/calculator.asmx?op=Add",
                data: xml,
                headers: { "Content-type": "text/xml" },
            })

            const xmlRespons = await response.data
            const result = xml2js(xmlRespons, { compact: true })

            res.status(200).send(result)

        } catch (error) {
            next(error)
        }
    }

})
router.get("/:id/exportToPDF", async (req, res, next) => {
    try {
        const products = await getProducts()
        const findProduct = products.find(product => product.id === req.params.id)
        if (findProduct) {
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
                    { text: 'Product Info', fontSize: 25, background: 'yellow', italics: true },
                    {
                        image: `${path.join(imagePath, `${findProduct.id}.png`)}`,
                        width: 150
                    },
                    "                                                                         ",
                    `             Name: ${findProduct.name}`,
                    `             Brand: ${findProduct.brand}`,
                    `             Description: ${findProduct.description}`,
                    `             Price: ${findProduct.price} $`,
                    `             Category: ${findProduct.category}`,
                ]
            }

            var pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.pipe(fs.createWriteStream(path.join(pdfSaverPath, `${findProduct.id}.pdf`)))
            pdfDoc.end();

            res.setHeader("Content-Disposition", `attachment; filename=${findProduct.id}.pdf`)
            fs.createReadStream(path.join(pdfSaverPath, `${findProduct.id}.pdf`)).pipe(res)

        } else {
            const err = new Error()
            err.httpStatusCode = 404
            next(err)
        }


    } catch (error) {
        next(error)
    }
})
router.get("/convert/exportToCSV", async (req, res, next) => {
    const products = await getProducts()
    if (products.length > 0) {
        try {
            const fields = [
                "id",
                "name",
                "brand",
                "description",
                "price",
                "imageUrl",
                "category",
                "createdAt",
                "updatedAt"
            ]
            const opts = { fields }
            const input = fs.createReadStream(productsPath, { encoding: 'utf8' })
            const json2csv = new Transform(opts)

            res.setHeader("Content-Disposition", "attachment; filename=products.csv")
            pump(input, json2csv, res)

        } catch (error) {

        }
    } else {
        const err = new Error()
        err.httpStatusCode = 404
        next(err)
    }
})


module.exports = router