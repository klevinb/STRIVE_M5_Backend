const badRequest = (err, req, res, next) => {
    if (err.httpStatusCode === 400) {
        res.status(400).send(err.message)
    }
    next(err)
}

const notFound = (err, req, res, next) => {
    if (err.httpStatusCode === 404) {
        res.status(404).send("Not found")
    }
    next(err)
}

const generalError = (err, req, res, next) => {
    if (!res.headersSent) {
        res.status(err.httpStatusCode || 500).send(err.message)
    }
}

module.exports = {
    badRequest,
    notFound,
    generalError
}