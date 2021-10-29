const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
var cookieParser = require('cookie-parser')
const userApiRoutes = require('./routes/userApiRoutes');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
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