const express = require("express");
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// create an express app
const app = express();

app.use(cors());
app.use(express.json());

// set the strictQuery to false, so that it will disable the strict mode for the query filters
// mongoose will not throw any error when we use an undefined field in the query (ignored)
mongoose.set('strictQuery', false);

console.log('connecting to MongoDB');

// to connect to the database
mongoose.connect(MONGO_URL)
    .then(result => {
        console.log('Connected to MongoDB Database');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    })


// set the endpoints
const usersRouter = require('./controllers/users');


// root end point: prints Welcome sms as an HTML
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Chat App Backend!</h1>');
});

// fetching all resourse
app.use('/users', usersRouter);

// Listen to the PORT for requests
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
