const express = require('express');
const cors = require('cors');
const app = express();
const cors = require("cors")
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(cors());
const mongoose = require('mongoose');
require("dotenv").config();

const matchApiRoutes = require('./routes/matchApiRoutes');

// Connect to mongodb
var dbURI = process.env.MONGODB_URI;
if (process.env.NODE_ENV === "test") {
    dbURI = process.env.TEST_MONGODB_URI;
}

mongoose.connect(dbURI)
    .then((result) => {
        console.log('Connected to MongoDB');

        const port = process.env.PORT || 8001;
        app.listen(port, () => {
            console.log(`Match microservice listening on port ${port}`);
        });
    })
    .catch((err) => console.log(err));

// Use the match API routes
app.use('/match', matchApiRoutes);

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