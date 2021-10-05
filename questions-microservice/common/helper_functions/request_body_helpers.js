exports.isReqBodyNonEmpty = (req) => {
    if (req.body === null || Object.keys(req.body).length === 0) {
        return false;
    }

    return true;
}

exports.isInvalidTitle = (req) => {
    return req.body.title == null || req.body.title == undefined || req.body.title.length() == 0;
}

exports.isInvalidDescription = (req) => {
    return req.body.description == null || req.body.description == undefined || req.body.description.length() == 0;
}

exports.isInvalidDifficulty = (req) => {
    return req.body.difficulty == null || req.body.difficulty == undefined || req.body.difficulty.length() == 0;
}

exports.isInvalidId = (req) => {
    return req.body.id == null || req.body.id == undefined || req.body.id <= 0;
}

exports.isValidPostReq = (req) => {
    if (isInvalidTitle(req)) {
        return false;
    }
    if (isInvalidDescription(req)) {
        return false;
    }
    if (isInvalidDifficulty(req)) {
        return false;
    }

    return true;
}

exports.isValidPutReq = (req) => {
    if (isInvalidDescription(req) && isInvalidDescription(req) && isInvalidTitle(req) && isInvalidId(req)) {
        return false;
    }

    return true;
}

exports.isValidDeleteReq = (req) => {
    return !isInvalidId(req);
}