const { difficulties }  = require('../constants/constants');

const hasMissingFieldsForFindMatch = req => {
    return req.body.email == undefined || req.body.difficulty == undefined;
}

const hasMissingFieldsForCancelFindMatch = req => {
    return req.body.email == undefined;
}

const isValidDifficulty = difficulty => {
    return difficulties.includes(difficulty);
}

module.exports = {
    hasMissingFieldsForFindMatch,
    hasMissingFieldsForCancelFindMatch,
    isValidDifficulty
};