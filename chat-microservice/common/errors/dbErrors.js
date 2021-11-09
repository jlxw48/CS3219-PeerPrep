const readError = err => {
    return "Error reading data from MongoDB: " + err;
}

const writeError = err => {
    return "Error writing data to MongoDB: " + err;
}

const deleteError = err => {
    return "Error deleting data from MongoDB: " + err;
}

module.exports = {
    readError,
    writeError,
    deleteError
}