require('dotenv').config()
const express = require('express')
const indexRoute = require('./routes/index')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// express app
const app = express()
const PORT =  process.env.PORT || 5000

// middleware
app.use(express.json())
app.use((req, res, next) => { // custom, for logging
    console.log(req.path, req.method)
    next()
})

// setup MongoDB session store
const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions',
});

app.use(
    session({
        secret: 'itisdevSmash',
        resave: false,
        cookie: { maxAge: 1.814e9 }, // 3 weeks
        saveUninitialized: false,
        store: store
    })
);

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