const helpers = require( "../common/helper_functions/request_helpers" );
const clientErr = require( "../common/error_msgs/client_errors" );
const dbErr = require( "../common/error_msgs/db_errors" );
const responseStatus = require( "../common/status" );
const httpMethods = require( "../common/http_methods" );
const functionality = require( "../common/helper_functions/functionality" );

Question = require( "./question_model" );

exports.getAllQuestions = ( req, res ) => {
    if ( req.method != httpMethods.GET ) {
        return;
    }

    var offset = helpers.parsePositiveInt( req.query.offset );
    var limit = helpers.parsePositiveInt( req.query.limit, 10 );
    var difficulty = req.query.difficulty;

    const query = difficulty ? Question.where( { difficulty: difficulty } ) : Question;
    query
        .find()
        .skip( offset )
        .limit( limit )
        .exec( ( err, questions ) => {
            if ( err ) {
                res.statusCode = 500;
                res.json( {
                    status: responseStatus.ERROR,
                    error_message: dbErr.mongoReadErr( err )
                } );
                return;
            }

            res.statusCode = 200;
            res.json( {
                status: responseStatus.SUCCESS,
                data: {
                    questions: questions
                }
            } );
        } );
}

exports.getRandomQuestion = ( req, res ) => {
    if ( req.method != httpMethods.GET ) {
        return;
    }

    var difficulty = req.query.difficulty;
    const countQuery = difficulty ? Question.where( { difficulty: difficulty } ) : Question;
    countQuery
        .count( ( err, count ) => {
            if ( err ) {
                res.statusCode = 500;
                res.json( {
                    status: responseStatus.ERROR,
                    error_message: dbErr.mongoReadErr( err )
                } );
                return;
            }

            const questionQuery = difficulty ? Question.where( { difficulty: difficulty } ) : Question;
            var random = functionality.randomNumBetween( 1, count ) - 1;
            questionQuery
                .findOne()
                .skip( random )
                .exec( ( err, questions ) => {
                    if ( err ) {
                        res.statusCode = 500;
                        res.json( {
                            status: responseStatus.ERROR,
                            error_message: dbErr.mongoReadErr( err )
                        } );
                        return;
                    }

                    res.statusCode = 200;
                    res.json( {
                        status: responseStatus.SUCCESS,
                        data: {
                            questions: [questions]
                        }
                    } );
                } );
        } )

}

exports.createQuestion = ( req, res ) => {
    if ( req.method != httpMethods.POST ) {
        return;
    }

    if ( !helpers.isReqBodyNonEmpty( req ) ) {
        res.statusCode = 400;
        res.json( {
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_REQ_BODY
            }
        } );
        return;
    }

    if ( !helpers.isValidPostReq( req ) ) {
        res.statusCode = 400;
        res.json( {
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_SOME_INPUT
            }
        } );
        return;
    }

    if ( req.body.difficulty && !helpers.isValidEnumDifficulty( req.body.difficulty ) ) {
        res.statusCode = 400;
        res.json( {
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.INVALID_DIFFICULTY
            }
        } );
        return;
    }

    var question = new Question();
    question.title = req.body.title;
    question.description = req.body.description;
    question.difficulty = req.body.difficulty;

    Question.count( ( err, count ) => {
        if ( err ) {
            res.statusCode = 500;
            res.json( {
                status: responseStatus.ERROR,
                error_message: dbErr.mongoReadErr( err )
            } );
            return;
        }

        question.save( ( errNested ) => {
            if ( errNested ) {
                res.statusCode = 500;
                res.json( {
                    status: responseStatus.ERROR,
                    error_message: dbErr.mongoWriteErr( errNested )
                } );
                return;
            }

            res.statusCode = 200;
            res.json( {
                status: responseStatus.SUCCESS,
                data: null
            } );
        } );
    } );
}

exports.updateQuestion = ( req, res ) => {
    if ( req.method != httpMethods.PUT ) {
        return;
    }

    if ( !helpers.isReqBodyNonEmpty( req ) ) {
        res.statusCode = 400;
        res.json( {
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_REQ_BODY
            }
        } );
        return;
    }

    if ( !helpers.isValidPutReq( req ) ) {
        res.statusCode = 400;
        res.json( {
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_SOME_INPUT
            }
        } );
        return;
    }

    if ( req.body.difficulty && !helpers.isValidEnumDifficulty( req.body.difficulty ) ) {
        res.statusCode = 400;
        res.json( {
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.INVALID_DIFFICULTY
            }
        } );
        return;
    }

    Question.findById( req.params.id, ( err, question ) => {
        if ( err || req.params.id.length != 24 ) {
            if ( ( err !== null && typeof err === "object" && err.name === "CastError" ) || req.params.id.length != 24 ) {
                res.statusCode = 400;
                res.json( {
                    status: responseStatus.FAILED,
                    data: {
                        error_message: clientErr.INVALID_ID
                    }
                } );
                return;
            }

            res.statusCode = 500;
            res.json( {
                status: responseStatus.ERROR,
                error_message: dbErr.mongoReadErr( err )
            } );
            return;
        }

        if ( question === null ) {
            res.statusCode = 404;
            res.json( {
                status: responseStatus.FAILED,
                data: {
                    error_message: clientErr.QUESTION_DOES_NOT_EXIST
                }
            } );
            return;
        }

        question.title = req.body.title ? req.body.title : question.title;
        question.description = req.body.description ? req.body.description : question.description;
        question.difficulty = req.body.difficulty ? req.body.difficulty : question.difficulty;

        question.save( ( err ) => {
            if ( err ) {
                res.statusCode = 500;
                res.json( {
                    status: responseStatus.ERROR,
                    error_message: dbErr.mongoWriteErr( err )
                } );
                return;
            }

            res.statusCode = 200;
            res.json( {
                status: responseStatus.SUCCESS,
                data: null
            } );
        } );
    } );
}

exports.deleteQuestion = ( req, res ) => {
    if ( req.method != httpMethods.DELETE ) {
        return;
    }

    if ( !helpers.isReqBodyNonEmpty( req ) ) {
        res.statusCode = 400;
        res.json( {
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_REQ_BODY
            }
        } );
        return;
    }

    if ( !helpers.isValidDeleteReq( req ) ) {
        res.statusCode = 400;
        res.json( {
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_SOME_INPUT
            }
        } );
        return;
    }

    Question.findById( req.params.id, ( err, question ) => {
        if ( err || req.params.id.length != 24 ) {
            if ( ( err !== null && typeof err === "object" && err.name === "CastError" ) || req.params.id.length != 24 ) {
                res.statusCode = 400;
                res.json( {
                    status: responseStatus.FAILED,
                    data: {
                        error_message: clientErr.INVALID_ID
                    }
                } );
                return;
            }

            res.statusCode = 500;
            res.json( {
                status: responseStatus.ERROR,
                error_message: dbErr.mongoWriteErr( err )
            } );
            return;
        }

        if ( question === null ) {
            res.statusCode = 404;
            res.json( {
                status: responseStatus.FAILED,
                data: {
                    error_message: clientErr.QUESTION_DOES_NOT_EXIST
                }
            } );
            return;
        }

        Question.deleteOne(
            {
                _id: req.params.id
            },
            ( deleteErr, question ) => {
                if ( deleteErr ) {
                    res.statusCode = 500;
                    res.json( {
                        status: responseStatus.ERROR,
                        error_message: dbErr.mongoDeleteErr( err )
                    } );
                    return;
                }

                res.statusCode = 200;
                res.json( {
                    status: responseStatus.SUCCESS,
                    data: null
                } );
            }
        );
    } );
}