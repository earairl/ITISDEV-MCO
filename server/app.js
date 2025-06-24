require('dotenv').config()
const express = require('express')
const indexRoute = require('./routes/index')
const mongoose = require('mongoose');

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
mongoose.connect(process.env.MONGODB).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch(e => {
    console.error(e);
});