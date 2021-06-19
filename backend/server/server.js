const express = require('express')
const http = require('http')

// load env variables
require('dotenv').config()

const server = express()
server.use(express.json())

const httpServer = http.createServer(server)

httpServer.listen(process.env.PORT_API, () => {
    console.log(`> Ready on ${process.env.PORT_API}`)
})

