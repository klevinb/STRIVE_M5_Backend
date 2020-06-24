const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")
const students = require("../students/students.json")

const router = express.Router()

const portfoliosFilePath = path.join(__dirname, "portfolios.json")
const studentsFilePath = path.join(__dirname, "..", "students", "students.json")


const getPortfolios = () => {
    const filePortfoliosAsBuffer = fs.readFileSync(portfoliosFilePath)
    const portfolios = JSON.parse(filePortfoliosAsBuffer.toString())
    return portfolios
}

router.get("/", (req, res, next) => {
    const portfolios = getPortfolios()
    if (portfolios.length > 0) {
        if (req.query && req.query.name) {
            const filterPortfolio = portfolios.filter(project => project.name.toLowerCase().startsWith(req.query.name))
            res.send(filterPortfolio)
        } else {
            res.send(portfolios)
        }
    } else {
        const error = new Error()
        error.httpStatusCode = 404
        error.message = "We dont have any data!"
        next(error)
    }
})

router.get("/:id", (req, res, next) => {
    const portfolios = getPortfolios()
    if (portfolios.length > 0) {
        const portfolio = portfolios.filter(portfolio => portfolio.id === req.params.id)
        if (portfolio.length > 0) {
            res.status(200).send(portfolio)
        } else {
            const error = new Error()
            error.httpStatusCode = 404
            error.message = "We cannot find a project with this ID"
            next(error)
        }
    } else {
        const error = new Error()
        error.httpStatusCode = 404
        error.message = "We dont have any data!"
        next(error)
    }
})

router.post("/", (req, res) => {

    newPortfolio = { id: uniqid(), ...req.body, createdAt: new Date() }
    const portfolios = getPortfolios()
    portfolios.push(newPortfolio)
    fs.writeFileSync(portfoliosFilePath, JSON.stringify(portfolios))

    const filteredStudents = students.filter(student => student.id !== req.body.studentId)
    const addStudentProjectNr = students.filter(student => student.id === req.body.studentId)
    addStudentProjectNr[0].numberOfProjects++

    filteredStudents.push(addStudentProjectNr[0])

    fs.writeFileSync(studentsFilePath, JSON.stringify(filteredStudents))

    res.status(201).send(portfolios)

})

router.put("/:id", (req, res, next) => {
    const portfolios = getPortfolios()
    if (portfolios.length > 0) {
        const filteredPortfolios = portfolios.filter(portfolio => portfolio.id !== req.params.id)
        const portfolio = { id: req.params.id, ...req.body }

        filteredPortfolios.push(portfolio)

        fs.writeFileSync(portfoliosFilePath, JSON.stringify(filteredPortfolios))
        res.send(portfolio)
    } else {
        const error = new Error()
        error.httpStatusCode = 404
        error.message = "We dont have any data!"
        next(error)
    }
})

router.delete("/:id", (req, res, next) => {
    const portfolios = getPortfolios()
    if (portfolios.length > 0) {
        const filteredPortfolios = portfolios.filter(portfolio => portfolio.id !== req.params.id)
        const projectThatWillBeDeleted = portfolios.filter(portfolio => portfolio.id === req.params.id)
        if (projectThatWillBeDeleted.length > 0) {
            fs.writeFileSync(portfoliosFilePath, JSON.stringify(filteredPortfolios))

            const filteredStudents = students.filter(student => student.id !== projectThatWillBeDeleted[0].studentId)
            const decsStudentProjectNr = students.filter(student => student.id === projectThatWillBeDeleted[0].studentId)
            if (decsStudentProjectNr[0].numberOfProjects > 0) {
                decsStudentProjectNr[0].numberOfProjects--
            }

            filteredStudents.push(decsStudentProjectNr[0])

            fs.writeFileSync(studentsFilePath, JSON.stringify(filteredStudents))

            res.send("That project was deleted!")
        } else {
            const error = new Error()
            error.httpStatusCode = 404
            error.message = "We cannot find a project with this ID"
            next(error)

        }
    } else {
        const error = new Error()
        error.httpStatusCode = 404
        error.message = "We dont have any data!"
        next(error)
    }
})

module.exports = router