exports.isReqBodyNonEmpty = ( req ) => {
    if ( req.body === null || Object.keys( req.body ).length === 0 ) {
        return false;
    }

    return true;
}

const isInvalidTitle = ( req ) => {
    return req.body.title == null || req.body.title == undefined || req.body.title.length == 0;
}

const isInvalidDescription = ( req ) => {
    console.log( req.body.description == undefined )
    return req.body.description == null || req.body.description == undefined || req.body.description.length == 0;
}

const isInvalidDifficulty = ( req ) => {
    return req.body.difficulty == null || req.body.difficulty == undefined || req.body.difficulty.length == 0;
}

const isInvalidId = ( req ) => {
    return req.params.id == null || req.params.id == undefined || req.params.id.length == 0;
}

exports.isValidPostReq = ( req ) => {
    if ( isInvalidTitle( req ) ) {
        return false;
    }
    if ( isInvalidDescription( req ) ) {
        return false;
    }
    if ( isInvalidDifficulty( req ) ) {
        return false;
    }

    return true;
}

exports.isValidPutReq = ( req ) => {
    console.log( isInvalidDescription( req ), isInvalidTitle( req ), isInvalidId( req ) )
    if ( ( isInvalidDescription( req ) && isInvalidTitle( req ) ) ) {
        return false;
    }

    return true;
}

exports.isValidDeleteReq = ( req ) => {
    return !isInvalidId( req );
}

exports.parsePositiveInt = ( input, defaultInt ) => {
    if ( !input || isNaN( parseInt( input ) ) ) {
        return defaultInt || 0;
    }

    return parseInt( input );
}

exports.isValidEnumDifficulty = ( difficulty ) => {
    return difficulty === "easy" || difficulty === "medium" || difficulty === "hard";
}