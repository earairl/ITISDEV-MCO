require('dotenv').config()
const express = require('express')
const indexRoute = require('./routes/index')

// express app
const app = express()
const PORT =  process.env.PORT || 4000

// middleware
app.use(express.json())
app.use((req, res, next) => { // custom, for logging
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/index', indexRoute)

// listen for requests
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
    console.log(`Server: http://localhost:${PORT}`)
})