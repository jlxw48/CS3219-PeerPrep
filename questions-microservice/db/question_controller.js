const helpers = require("../common/helper_functions/request_body_helpers");
const clientErr = require("../common/error_msgs/client_errors");
const dbErr = require("../common/error_msgs/db_errors");
const responseStatus = require("../common/status");
const httpMethods = require("../common/http_methods");

Question = require("./question_model");

exports.getAllQuestions = (req, res) => {
    if (req.method != httpMethods.GET) {
        return;
    }

    Question.find()
        .skip(0)
        .limit(10)
        .exec((err, questions) => {
            if (err) {
                res.statusCode = 500;
                res.json({
                    status: responseStatus.ERROR,
                    error_message: dbErr.mongoReadErr(err)
                });
                return;
            }
            
            res.statusCode = 200;
            res.json({
                status: responseStatus.SUCCESS,
                data: questions
            });
        });  
}

exports.getRandomQuestion = (req, res) => {
    if (req.method != httpMethods.GET) {
        return;
    }

    var random = Math.random();
    Question
        .findOne()
        .skip(random)
        .exec((err, questions) => {
            if (err) {
                res.statusCode = 500;
                res.json({
                    status: responseStatus.ERROR,
                    error_message: dbErr.mongoReadErr(err)
                });
                return;
            }
            
            res.statusCode = 200;
            res.json({
                status: responseStatus.SUCCESS,
                data: questions
            });
        });
}

exports.createQuestion = (req, res) => {
    if (req.method != httpMethods.POST) {
        return;
    }

    if (!helpers.isReqBodyNonEmpty(req)) {
        res.statusCode = 400;
        res.json({
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_REQ_BODY
            }
        });
        return;
    }

    if (!helpers.isValidPostReq(req)) {
        res.statusCode = 400;
        res.json({
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_SOME_INPUT
            }
        });
        return;
    } 

    var question = new Question();
    question.title = req.body.title;
    question.description = req.body.description;
    question.difficulty = req.body.difficulty;

    Question.count((err, count) => {
        if (err) {
            res.statusCode = 500;
            res.json({
                status: responseStatus.ERROR,
                error_message: dbErr.mongoReadErr(err)
            });
            return;
        }

        question.id = count + 1; // because MongoDB does not support autoincrement
        question.save((errNested) => {
            if (errNested) {
                res.statusCode = 500;
                res.json({
                    status: responseStatus.ERROR,
                    error_message: dbErr.mongoWriteErr(errNested)
                });
                return;
            }
    
            res.statusCode = 200;
            res.json({
                status: responseStatus.SUCCESS,
                data: null
            });
        });
    });
}

exports.updateQuestion = (req, res) => {
    if (req.method != httpMethods.PUT) {
        return;
    }

    if (!helpers.isReqBodyNonEmpty(req)) {
        res.statusCode = 400;
        res.json({
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_REQ_BODY
            }
        });
        return;
    }

    if (!helpers.isValidPutReq(req)) {
        res.statusCode = 400;
        res.json({
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_SOME_INPUT
            }
        });
        return;
    } 

    var question = new Question();
    question.title = req.body.title;
    question.description = req.body.description;
    question.difficulty = req.body.difficulty;

    Question.findById(req.body.id, (err, question) => {
        if (err || req.body.id.length != 24) {
            if ((err !== null && typeof err === "object" && err.name === "CastError") || req.body.id.length != 24) {
                res.statusCode = 400;
                res.json({
                    status: responseStatus.FAILED,
                    data: {
                        error_message: clientErr.INVALID_ID
                    }
                });
                return;
            }
            
            res.statusCode = 500;
            res.json({
                status: responseStatus.ERROR,
                error_message: dbErr.mongoReadErr(err)
            });
            return;
        }

        if (question === null) {
            res.statusCode = 404;
            res.json({
                status: responseStatus.FAILED,
                data: {
                    error_message: clientErr.QUESTION_DOES_NOT_EXIST
                }
            });
            return;
        }

        // todo: check the correctness of this
        question.title = req.body.title ? req.body.title : question.title;
        question.description = req.body.description ? req.body.description : question.description;
        question.difficulty = req.body.difficulty ? req.body.difficulty : question.difficulty;

        question.save((err) => {
            if (err) {
                res.statusCode = 500;
                res.json({
                    status: responseStatus.ERROR,
                    error_message: dbErr.mongoWriteErr(err)
                });
                return;
            }
    
            res.statusCode = 200;
            res.json({
                status: responseStatus.SUCCESS,
                data: null
            });
        });
    });
}

exports.deleteQuestion = (req, res) => {
    if (req.method != httpMethods.DELETE) {
        return;
    }

    if (!helpers.isReqBodyNonEmpty(req)) {
        res.statusCode = 400;
        res.json({
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_REQ_BODY
            }
        });
        return;
    }

    if (!helpers.isValidDeleteReq(req)) {
        res.statusCode = 400;
        res.json({
            status: responseStatus.FAILED,
            data: {
                error_message: clientErr.MISSING_SOME_INPUT
            }
        });
        return;
    } 

    Question.findById(req.body.id, (err, question) => {
        if (err || req.body.id.length != 24) {
            if ((err !== null && typeof err === "object" && err.name === "CastError") || req.body.id.length != 24) {
                res.statusCode = 400;
                res.json({
                    status: responseStatus.FAILED,
                    data: {
                        error_message: clientErr.INVALID_ID
                    }
                });
                return;
            }

            res.statusCode = 500;
            res.json({
                status: responseStatus.ERROR,
                error_message: dbErr.mongoWriteErr(err)
            });
            return;
        }

        if (question === null) {
            res.statusCode = 404;
            res.json({
                status: responseStatus.FAILED,
                data: {
                    error_message: clientErr.QUESTION_DOES_NOT_EXIST
                }
            });
            return;
        }

        Question.deleteOne(
            {
                _id: req.body.id
            },
            (deleteErr, question) => {
                if (deleteErr) {
                    res.statusCode = 500;
                    res.json({
                        status: responseStatus.ERROR,
                        error_message: dbErr.mongoDeleteErr(err)
                    });
                    return;
                }
    
                res.statusCode = 200;
                res.json({
                    status: responseStatus.SUCCESS,
                    data: null
                });
            }
        );
    });
}