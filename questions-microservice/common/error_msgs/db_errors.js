exports.mongoReadErr = ( err ) => {
    return "error reading data from MongoDB: " + err;
}

exports.mongoWriteErr = ( err ) => {
    return "error writing data to MongoDB: " + err;
}

exports.mongoDeleteErr = ( err ) => {
    return "error deleting data from MongoDB: " + err;
}

exports.CANNOT_RETRIEVE_DB_URI = "error retrieving dbUri";
exports.CONNECTED = "connected to mongodb";