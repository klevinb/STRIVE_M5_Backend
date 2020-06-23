const http = require('http');
const { parse } = require("url")
const handler = require('./libraries/handler')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((request, response) => {
    const parsedUrl = parse(request.url)
    console.log(request.url)
    console.log(parsedUrl)

    switch (parsedUrl.pathname) {
        case "/":
            response.end("Main Page")
            break
        case "/about":
            response.end("About page")
            break
        case "/users":
            handler(request, response)
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});