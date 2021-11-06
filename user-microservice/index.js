const express = require('express');
const mongoose = require('mongoose');
const userApiRoutes = require('./routes/userApiRoutes');
var cors = require('cors');
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
var corsOptions = {
    origin: ['https://peerprep.ml', 'https://peerprep-g5.tk', "http://localhost:3000"],
    credentials: true 
};
app.use(cors(corsOptions));
var uri = process.env.MONGO_URI;

mongoose.connect(uri)
     .then((result) => {
         console.log('Connected to MongoDB');

         const port = process.env.PORT || 3600;
         app.listen(port, () => {
             console.log(`User microservice listening on port ${port}!`);
         });
     })
     .catch((err) => console.log(err));

app.use('/api/user', userApiRoutes);

app.use((req, res) => {
    res.status(404).json({
        status: "failed",
        data: {
            message: "invalid API endpoint"
        }
    });
});

 // Export app for testing purposes
module.exports = app;