require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const indexRoute = require('./routes');

// express app
const app = express()
const PORT =  process.env.PORT || 5000

// middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json())
// app.use((req, res, next) => { // custom, for logging
//     console.log(req.path, req.method)
//     next()
// })

// setup MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB,
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
app.use('/', indexRoute);

// listen for requests
mongoose.connect(process.env.MONGODB).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch(e => {
    console.error(e);
});