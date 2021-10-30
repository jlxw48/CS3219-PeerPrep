const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    difficulty: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 30,
        default: Date.now
    }
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;