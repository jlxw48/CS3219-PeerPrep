const mongoose = require( "mongoose" );

const quesetionSchema = mongoose.Schema( {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String, // change ot enum
        required: true
    }
} );

const collectionName = "questions";
module.exports = mongoose.model( "question", quesetionSchema, collectionName );