const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")

const { check, validationResult } = require("express-validator")

const router = express.Router()

const readFile = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName))
  const fileContent = buffer.toString()
  return JSON.parse(fileContent)
}

router.get("/:id", (req, res, next) => {
  try {
    const usersDB = readFile("user.json")
    const user = usersDB.filter((user) => user.ID === req.params.id)
    res.send(user)
  } catch (error) {
    error.httpStatusCode = 404
    next(error) // next is sending the error to the error handler
  }
})

router.get("/", (req, res) => {
  const usersDB = readFile("users.json")
  if (req.query && req.query.name) {
    const filteredUsers = usersDB.filter(
      (user) =>
        user.hasOwnProperty("name") &&
        user.name.toLowerCase() === req.query.name.toLowerCase()
    )
    res.send(filteredUsers)
  } else {
    res.send(usersDB)
  }
})

router.post(
  "/",
  [
    check("name")
      .isLength({ min: 4 })
      .withMessage("No no no no no")
      .exists()
      .withMessage("Insert a name please!"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        let err = new Error()
        err.message = errors
        err.httpStatusCode = 400
        next(err) // I'm sending validation errors to the middleware
      }
      const usersDB = readFile("users.json")
      const newUser = {
        ...req.body,
        ID: uniqid(),
        createdAt: new Date(),
      }

      usersDB.push(newUser)

      fs.writeFileSync(
        path.join(__dirname, "users.json"),
        JSON.stringify(usersDB)
      )

      res.status(201).send(usersDB)
    } catch (error) {
      next(error)
    }
  }
)

router.delete("/:id", (req, res) => {
  const usersDB = readFile("users.json")
  const newDb = usersDB.filter((x) => x.ID !== req.params.id)
  fs.writeFileSync(path.join(__dirname, "users.json"), JSON.stringify(newDb))

  res.send(newDb)
})

router.put("/:id", (req, res) => {
  const usersDB = readFile("users.json")
  const newDb = usersDB.filter((x) => x.ID !== req.params.id) //removing previous item
  const users = req.body
  users.ID = req.params.id
  newDb.push(users) //adding new item
  fs.writeFileSync(path.join(__dirname, "users.json"), JSON.stringify(newDb))

  res.send(newDb)
})

router.get("/whatever", (req, res) => {})

module.exports = router
