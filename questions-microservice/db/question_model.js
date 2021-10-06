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
        type: String, 
        enum: ["easy", "medium", "hard"],
        required: true
    }
} );

const collectionName = "questions";
module.exports = mongoose.model( "question", quesetionSchema, collectionName );