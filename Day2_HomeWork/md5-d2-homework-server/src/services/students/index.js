const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")

const router = express.Router()


const studentFilePath = path.join(__dirname, "students.json")

const getStudents = () => {
    const fileStudentsAsBuffer = fs.readFileSync(studentFilePath)
    const students = JSON.parse(fileStudentsAsBuffer.toString())
    return students
}

router.get("/", (req, res) => {
    const students = getStudents()
    if (students.length > 0) {
        res.send(students)
    } else {
        res.status(404).send("We are sorry but we dont have any students yet!")
    }
})

router.get("/:id", (req, res) => {
    const students = getStudents()
    if (students.length > 0) {
        const student = students.filter(student => student.id === req.params.id)
        if (student.length > 0) {
            res.status(200).send(student)
        } else {
            res.status(404).send("We cant find a student with this ID")
        }
    } else {
        res.status(404).send("We are sorry but we dont have any students yet!")
    }
})

router.post("/", (req, res) => {
    newStudent = { id: uniqid(), ...req.body }
    const students = getStudents()
    if (students.length > 0) {
        const filteredStudents = students.filter(student => student.email === newStudent.email)
        if (filteredStudents.length > 0) {
            res.status(400).send(false)
        } else {
            students.push(newStudent)
            fs.writeFileSync(studentFilePath, JSON.stringify(students))
            res.status(201).send(students)
        }
    } else {
        students.push(newStudent)
        fs.writeFileSync(studentFilePath, JSON.stringify(students))
        res.status(201).send(students)
    }
})

router.put("/:id", (req, res) => {
    const students = getStudents()
    if (students.length > 0) {
        const filteredStudents = students.filter(student => student.id !== req.params.id)
        const student = { id: req.params.id, ...req.body }

        filteredStudents.push(student)

        fs.writeFileSync(studentFilePath, JSON.stringify(filteredStudents))
        res.send(student)
    } else {
        res.status(404).send("We are sorry but we dont have any students yet!")
    }
})

router.delete("/:id", (req, res) => {
    const students = getStudents()
    if (students.length > 0) {
        const filteredStudents = students.filter(student => student.id !== req.params.id)
        fs.writeFileSync(studentFilePath, JSON.stringify(filteredStudents))
        res.send("That student was deleted!")
    } else {
        res.status(404).send("We are sorry but we dont have any students yet!")
    }
})

module.exports = router