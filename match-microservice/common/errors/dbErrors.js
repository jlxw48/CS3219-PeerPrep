const readError = err => {
    return "error reading data from MongoDB: " + err;
}

const writeError = err => {
    return "error writing data to MongoDB: " + err;
}

const deleteError = err => {
    return "error deleting data from MongoDB: " + err;
}

module.exports = {
    readError,
    writeError,
    deleteError
}