const express = require("express")
const path = require("path")
const uniqid = require("uniqid")
const fs = require("fs")
const { writeFile } = require("fs-extra")
const { check, validationResult } = require("express-validator")

const router = express.Router()

const readFile = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName))
  const fileContent = buffer.toString()
  return JSON.parse(fileContent)
}

/*
     {
        "_id": "123455", //SERVER GENERATED
        "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
        "rate": 3, //REQUIRED, max 5
        "elementId": "5d318e1a8541744830bef139", //REQUIRED
        "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
    }
*/

router.get("/", (req, res) => {
  const reviewsDB = readFile("reviews.json")
  res.send(reviewsDB)
})


router.post(
  "/",
  [
    check("comment")
      .isLength({ min: 4 })
      .withMessage("Write more text please!")
      .exists()
      .withMessage("Write your comment please!"),

    check("rate")
      .isInt({ max: 5 })
      .withMessage("Rate cannot be more than 5 please!")
      .exists()
      .withMessage("Give your rating please!"),

    check("elementId")
      .exists()
      .withMessage("Insert product ID please!"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        let err = new Error()
        err.message = errors
        err.httpStatusCode = 444
        next(err)
      }
      else {
        const reviewsDB = readFile("reviews.json")
        const newReview = {
          _id: uniqid(),
          ...req.body,
          createdAt: new Date(),
        }

        reviewsDB.push(newReview)

        fs.writeFileSync(
          path.join(__dirname, "reviews.json"),
          JSON.stringify(reviewsDB)
        )

        res.status(201).send(reviewsDB)
      }
    } catch (error) {
      next(error)
    }
  }
)

// router.post("/", (req, res, next) => {
//     try {
//       const reviewsDB = readFile("reviews.json")
//       const newReview = {
//         ...req.body,
//         _id: uniqid(),
//         createdAt: new Date(),
//       }

//       reviewsDB.push(newReview)

//       fs.writeFileSync(
//         path.join(__dirname, "reviews.json"),
//         JSON.stringify(reviewsDB)
//       )

//       res.send(reviewsDB)

//     } catch (error) {
//       error.httpStatusCode = 404
//       next(error) 
//     }
//   })


router.delete("/:id", (req, res) => {
  const reviewsDB = readFile("reviews.json")
  const newDb = reviewsDB.filter((x) => x._id !== req.params.id)
  fs.writeFileSync(path.join(__dirname, "reviews.json"), JSON.stringify(newDb))

  res.send(newDb)
})

router.put("/:id", (req, res) => {
  const reviewsDB = readFile("reviews.json")
  const newDb = reviewsDB.filter((x) => x._id !== req.params.id)
  const reviews = req.body
  reviews._id = req.params.id
  newDb.push(reviews)
  fs.writeFileSync(path.join(__dirname, "reviews.json"), JSON.stringify(newDb))

  res.send(newDb)
})

module.exports = router