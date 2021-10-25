const WRITE_ERROR = err => {
 	return "Error writing to database " + err;
 }
 const READ_ERROR = err => {
 	return "Error reading from database " + err;
 }

 module.exports = {
 	WRITE_ERROR,
 	READ_ERROR
 }