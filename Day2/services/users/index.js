/* What we would like to  achive
1. get all user's data on url: localhost:3001/users/ GET
2. get single user's data on url: localhost:3001/users/:id GET
3. create single user's record on url: localhost:3001/users/ POST
4. modify single user's data on url: localhost:3001/users/:id PUT
5. delete single user's data on url: localhost:3001/users/:id DELETE
*/

const express = require("express") // third party module
const fs = require("fs") //core module
const path = require("path") //core module
const uniqid = require("uniqid")

const router = express.Router()

const usersFilePath = path.join(__dirname, "users.json")

// 1.
router.get("/", (request, response) => {
    //(request, response)=> is the handler for this specific route

    // a) retrive users list from a file on dick ( we do not have a real database yet)

    // console.log(__dirname + "\\users.json") // AVOID
    // console.log(path.join(__dirname, "users.json")) // USE PATH
    const fileContentAsBuffer = fs.readFileSync(usersFilePath) // please read the file( we are getting a buffer)

    const fileContent = fileContentAsBuffer.toString()
    // we need to translate the buffer into something human readble

    // b) send the list as a json in the response
    response.send(JSON.parse(fileContent))  //JSON.parse converts strings into json format
})

// 2.

router.get("/:id", (request, response) => {
    // retrive single user data from a file on dick ( we do not have a real database yet) and send it back

    // a) read the file on disk and get back an array of users

    const fileContentAsBuffer = fs.readFileSync(usersFilePath)
    const usersArray = JSON.parse(fileContentAsBuffer.toString())

    // b) filter out the array to retrive the specified user( we're gonna be using id to retrive the uniqe user)
    console.log("ID: ", request.params.id)
    const user = usersArray.filter(user =>
        user.id === request.params.id)
    response.send(user)
})

// 3.
router.post("/", (request, response) => {
    console.log(request.body)
    const newUser = { ...request.body, id: uniqid() }

    // 1. read the content of the file and get back an array
    const fileContentAsBuffer = fs.readFileSync(usersFilePath)
    const usersArray = JSON.parse(fileContentAsBuffer.toString())

    // 2. adding the new user to the array

    usersArray.push(newUser)

    // 3. writing the new content into the same file

    fs.writeFileSync(usersFilePath, JSON.stringify(usersArray))

    // 4. respond with status 201 === "Created"
    response.status(201).send(newUser)

})

// 4.

router.put("/:id", (request, response) => {

    // 1. read the content of the file and get back an array
    const fileContentAsBuffer = fs.readFileSync(usersFilePath)
    const usersArray = JSON.parse(fileContentAsBuffer.toString())

    // 2. filter users by exluding the one with specified id

    const filteredArray = usersArray.filter(user =>
        user.id !== request.params.id)

    // 3. adding back the user with the modified body

    const user = request.body // request.body is holding the new data for the specified user
    user.id = request.params.id

    // 4. write it back to the same file

    filteredArray.push(user)
    fs.writeFileSync(usersFilePath, JSON.stringify(filteredArray))

    // 5. respond with ok

    response.send("ok")
})

// 5.

router.delete("/:id", (request, response) => {

    // 1. read the content of the file and get back an array
    const fileContentAsBuffer = fs.readFileSync(usersFilePath)
    const usersArray = JSON.parse(fileContentAsBuffer.toString())

    // 2. filter users by exluding the one with specified id 
    const filteredArray = usersArray.filter(user =>
        user.id !== request.params.id)


    // 3. write the filtered content back into the same file

    fs.writeFileSync(usersFilePath, JSON.stringify(filteredArray))

    // 4. respond with ok

    response.send("ok")
})


module.exports = router