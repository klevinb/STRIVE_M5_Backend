const getUsers = () => {
    const usersList = [
        { id: 1, name: "Klevin" },
        { id: 2, name: "Bazaiti" }
    ]
    return JSON.stringify(usersList)
}

const sendRes = (res, statusCode, headers, data) => {
    res.writeHead(statusCode, headers)
    res.end(data)
}

module.exports = (req, res) => {
    switch (req.method) {
        case "GET":
            // retrieve list of users "from the db"
            // send the list as a response
            sendRes(res, 200, { "Content-Type": "application/json" }, getUsers())
            break
        case "POST":
            sendRes(res, 201, { "Content-Type": "application/json" }, "created")
            break
        default:
            break
    }
}