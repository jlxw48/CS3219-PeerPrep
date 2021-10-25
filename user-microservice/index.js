const express = require('express');
const mongoose = require('mongoose');
const userApiRoutes = require('./routes/userApiRoutes');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
var uri = process.env.MONGO_URI;

mongoose.connect(uri)
     .then((result) => {
         console.log('Connected to MongoDB');

         const port = process.env.PORT || 3600;
         app.listen(port, () => {
             console.log(`User microservice listening on port ${port}`);
         });
     })
     .catch((err) => console.log(err));


 app.use('/user', userApiRoutes);

 app.use((req, res) => {
     res.status(404).json({
         status: "failed",
         data: {
             message: "invalid API endpoint"
         }
     });
 });
