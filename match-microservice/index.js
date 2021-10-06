const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const mongoose = require('mongoose');
require("dotenv").config();

const matchApiRoutes = require('./routes/matchApiRoutes');

// Connect to mongodb
const dbURI = process.env.MONGODB_URI;
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
