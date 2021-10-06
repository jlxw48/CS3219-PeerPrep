const { difficulties }  = require('../constants/constants');

const hasMissingFieldsForFindMatch = req => {
    return req.body.username == undefined || req.body.difficulty == undefined;
}

const isValidDifficulty = difficulty => {
    return difficulties.includes(difficulty)
}

module.exports = {
    hasMissingFieldsForFindMatch,
    isValidDifficulty
};