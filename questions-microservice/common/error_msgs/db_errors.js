exports.mongoReadErr = ( err ) => {
    return "Error reading data from MongoDB: " + err;
}

exports.mongoWriteErr = ( err ) => {
    return "Error writing data to MongoDB: " + err;
}

exports.mongoDeleteErr = ( err ) => {
    return "Error deleting data from MongoDB: " + err;
}

exports.CANNOT_RETRIEVE_DB_URI = "Error retrieving dbUri";
exports.CONNECTED = "Connected to mongodb";