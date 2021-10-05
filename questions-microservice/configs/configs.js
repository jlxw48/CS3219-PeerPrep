require("dotenv").config();

module.exports = {
    port: process.env.PORT || 3000,
    local: {
        DB_URI: process.env.DB_URI
    }
};