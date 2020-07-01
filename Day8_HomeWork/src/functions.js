const fs = require("fs-extra")

const readTickets = async (path) => {
    try {
        const tickets = await fs.readJSON(path)
        return tickets
    } catch (error) {
        throw new Error(error)
    }
}

const writeTickets = async (path, data) => {
    try {
        await fs.writeJSON(path, data)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    readTickets,
    writeTickets
}