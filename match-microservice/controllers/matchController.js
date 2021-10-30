const mongoose = require('mongoose');
const Match = require('../models/Match');
const axios = require('axios');
const responseStatus = require('../common/status/responseStatus');
const requestHelpers = require('../common/helpers/requestHelpers');
const clientMessages = require('../common/messages/clientMessages');
const clientErrMessages = require('../common/errors/clientErrors');
const dbErrMessages = require('../common/errors/dbErrors');

var totalInterviews = 0;

// Check if match API is working
const statusCheck = (req, res) => {
    res.json({
        status: responseStatus.SUCCESS,
        data: {
            message: clientMessages.STATUS_WORKING
        }
    });
};

// Get interview of user (if it exist)
const getInterview = (req, res) => {
    const email = req.query.email;
    Match.findOne({
        email: email
    })
    .then(result => {
        if (result && result.interviewId) {
            res.json({
                status: responseStatus.SUCCESS,
                data: {
                    partnerEmail: result.partnerEmail,
                    interviewId: result.interviewId,
                    question: {
                        title: result.questionTitle,
                        description: result.questionDescription
                    }
                }
            });
            return;
        }
        res.status(404).json({
            status: responseStatus.FAILED,
            data: {
                message: clientErrMessages.NO_INTERVIEW
            }
        });
        return;
    })
    .catch(err => {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err)
        });
    });
}

// End the interview for the requested user
const endInterview = (req, res) => {
    const email = req.query.email;
    Match.findOneAndDelete({
        email: email
    })
    .then(result => {
        if (!result) {
            res.status(404).json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.DELETE_INTERVIEW_FAILED
                }
            });
            return;
        }
        res.json({
            status: responseStatus.SUCCESS,
            data: {
                message: clientMessages.INTERVIEW_ENDED
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err)
        });
    });
}

// Tries to find a match for a user for 30s
const findMatch = (req, res) => {
    if (requestHelpers.hasMissingFieldsForFindMatch(req)) {
        res.status(400).json({
            status: responseStatus.FAILED,
            data: {
                message: clientErrMessages.MISSING_REQUEST_BODY
            }
        });
        return;
    }
    if (totalInterviews >= 5) {
        res.status(404).json({
            status: responseStatus.FAILED,
            data: {
                message: clientErrMessages.MAX_INTERVIEW_REACHED
            }
        });
        return;
    }
    const email = req.body.email;
    const difficulty = req.body.difficulty;
    if (!requestHelpers.isValidDifficulty(difficulty)) {
        res.status(400).json({
            status: responseStatus.FAILED,
            data: {
                message: clientErrMessages.INVALID_DIFFICULTY
            }
        });
        return;
    }

    const match = new Match({
        email: email,
        difficulty: difficulty,
        createdAt: Date()
    });

    Match.findOne({
        email: email
    })
    .then(existResult => {
        if (existResult) {
            res.status(404).json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.DUPLICATE_FIND
                }
            });
            return;
        }

        match.save()
        .then(saveResult => {
            var count = 0;
            const intervalId = setInterval(() => {
                // In case some of the db operations below fails and never go into the 'count === 6' clause
                if (count >= 6) {
                    clearInterval(intervalId);
                    Match.findOneAndDelete({
                        email: email
                    })
                    .then(result => {
                        res.status(404).json({
                            status: responseStatus.FAILED,
                            data: {
                                message: clientErrMessages.TIMEOUT_30_SECONDS
                            }
                        });
                        return;
                    })
                    .catch(err => {
                        res.status(500).json({
                            status: responseStatus.ERROR,
                            error_message: dbErrMessages.deleteError(err) // failed to delete match details after 30s timeout
                        });
                        return;
                    });
                }

                // Try to see if a partner has already updated the match details of this user
                Match.findOne({
                    email: email
                })
                .then(userResult => {
                    // if user is already matched with a partner (the partner has already updated the current user's document)
                    if (userResult.partnerEmail && userResult.interviewId) {
                        clearInterval(intervalId);

                        if (!userResult.questionTitle || !userResult.questionDescription) {
                            res.status(404).json({
                                status: responseStatus.FAILED,
                                data: {
                                    message: clientErrMessages.NO_QUESTION
                                }
                            });
                            return;
                        }

                        res.json({
                            status: responseStatus.SUCCESS,
                            data: {
                                partnerEmail: userResult.partnerEmail,
                                interviewId: userResult.interviewId,
                                question: {
                                    title: userResult.questionTitle,
                                    description: userResult.questionDescription
                                }
                            }
                        });
                        return;
                    }
                    
                    // if user is not matched with a partner yet, try to find a partner and update info for partner 
                    Match.findOneAndUpdate({
                        email: { $ne: email},  // exclude the current user
                        partnerEmail: { $exists : false },  // make sure the other user has no partner yet
                        difficulty: difficulty
                    }, {
                        partnerEmail: email,
                        interviewId: mongoose.Types.ObjectId()  // Generate a random inverviewId
                    }, {
                        sort: { "createdAt": 1},  // find the earliest queueing user
                        new: true                 // return the updated document
                    })
                    .then(partnerResult => {
                        // no suitable match found
                        if (!partnerResult) {
                            if (count === 6) {
                                clearInterval(intervalId);
                                Match.findOneAndDelete({
                                    email: email
                                })
                                .then(result => {
                                    res.status(404).json({
                                        status: responseStatus.FAILED,
                                        data: {
                                            message: clientErrMessages.TIMEOUT_30_SECONDS
                                        }
                                    });
                                    return;
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        status: responseStatus.ERROR,
                                        error_message: dbErrMessages.deleteError(err) // failed to delete match details after 30s timeout
                                    });
                                })
                            }
                            return;
                        }

                        // match is found
                        clearInterval(intervalId);
                        
                        // Fetch a random question from question-microservice for the interview
                        axios.get(`http://localhost:3000/api/questions/get_random_question?difficulty=${difficulty}`)
                        .then(questionResult => {
                            const response = questionResult.data;
                            
                            // failed to retrieve question for interview
                            if (response.status != responseStatus.SUCCESS || !response.data 
                                || response.data.questions.length < 1) {
                                res.status(404).json({  
                                    status: responseStatus.FAILED,
                                    data: {
                                        message: clientErrMessages.RETRIEVE_QUESTION_FAILED
                                    }  
                                });
                                return;
                            }

                            // Update question for partner
                            const question = response.data.questions[0];
                            const questionTitle = question.title;
                            const questionDescription = question.description;
                            Match.findOneAndUpdate({
                                email: partnerResult.email
                            }, {
                                questionTitle: questionTitle,
                                questionDescription: questionDescription
                            }, {
                                new: true                 // return the updated document
                            })
                            .then(partnerUpdateQuestionResult => {
                                // Update partner info for current user
                                Match.findOneAndUpdate({
                                    email: email,
                                    partnerEmail: { $exists : false }    // make sure the current user has no partner yet (to mitigate race conditions?)
                                }, { 
                                    partnerEmail: partnerResult.email,
                                    interviewId: partnerResult.interviewId,
                                    questionTitle: partnerUpdateQuestionResult.questionTitle,
                                    questionDescription: partnerUpdateQuestionResult.questionDescription
                                }, { new : true })
                                .then(finalResult => {
                                    if (!finalResult) {
                                        // Clean up match record
                                        Match.findOneAndDelete({
                                            email: email
                                        })
                                        .then(cleanUpResult => {
                                            res.status(404).json({
                                                status: responseStatus.FAILED,
                                                data: {
                                                    message: clientErrMessages.INCONSISTENT_PARTNERS
                                                }
                                            });
                                            return;
                                        })
                                        .catch(cleanUpErr => {
                                            res.status(500).json({
                                                status: responseStatus.ERROR,
                                                error_message: dbErrMessages.deleteError(finalResultErr)  // failed to delete match details of current user after detecting inconsistencies
                                            });
                                            return;
                                        });
                                    }

                                    res.json({
                                        status: responseStatus.SUCCESS,
                                        data: {
                                            partnerEmail: partnerResult.email,
                                            interviewId: partnerResult.interviewId,
                                            question: {
                                                title: partnerUpdateQuestionResult.questionTitle,
                                                description: partnerUpdateQuestionResult.questionDescription
                                            }
                                        }
                                    });
                                    return;
                                })
                                .catch(finalResultErr => {
                                    clearInterval(intervalId);
                                    res.status(500).json({
                                        status: responseStatus.ERROR,
                                        error_message: dbErrMessages.writeError(finalResultErr)  // failed to update match details of current user after finding a match
                                    });
                                    return;
                                });
                            })
                            .catch(partnerUpdateQuestionErr => {
                                clearInterval(intervalId);
                                res.status(500).json({
                                    status: responseStatus.ERROR,
                                    error_message: dbErrMessages.writeError(partnerUpdateQuestionErr)  // failed to update question details of partner user after finding a match
                                });
                                return;
                            });
                        })
                        .catch(questionResultErr => {
                            clearInterval(intervalId);
                            res.status(500).json({
                                status: responseStatus.ERROR,
                                error_message: dbErrMessages.readError(questionResultErr) // failed to retrieve random question details after finding a match
                            });
                            return;
                        });
                    })
                    .catch(partnerResultErr => {
                        clearInterval(intervalId);
                        res.status(500).json({
                            status: responseStatus.ERROR,
                            error_message: dbErrMessages.writeError(partnerResultErr) // failed to update match details of partner user after finding a match
                        });
                        return;
                    });
                })
                .catch(userResultErr => {
                    clearInterval(intervalId);
                    res.status(500).json({
                        status: responseStatus.ERROR,
                        error_message: dbErrMessages.readError(userResultErr) // this should not happen but failed to find match details of current user
                    });
                    return;
                });
                
                count = count + 1;
            }, 5000);  // Try to find a match every 5s, until 30s is up
        })
        .catch((err) => {
            res.status(500).json({
                status: responseStatus.ERROR,
                error_message: dbErrMessages.writeError(err) // failed to store find match details
            });
        });
    });
};

// Get number of current ongoing interviews
const interviewsCount = (req, res) => {
    Match.find()
    .distinct("interviewId")
    .then(result => {
        res.json({
            status: responseStatus.SUCCESS,
            data: {
                count: result.length
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err) // failed to get number of interviews
        });
    })
}

// Get the current partner of the user
const getPartner = (req, res) => {
    const email = req.query.email;
    Match.findOne({
        email: email
    })
    .then(result => {
        if (result) {
            const partnerEmail = result.partnerEmail;
            if (partnerEmail) {
                res.json({
                    status: responseStatus.SUCCESS,
                    data: {
                        partnerEmail: partnerEmail
                    }
                });
                return;
            }
        }
        res.status(404).json({
            status: responseStatus.FAILED,
            data: {
                message: clientErrMessages.NO_PARTNER
            }
        });
        return;
    })
    .catch(err => {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err)
        });
    })
};

module.exports = {
    statusCheck,
    getInterview,
    endInterview,
    findMatch,
    interviewsCount,
    getPartner
};