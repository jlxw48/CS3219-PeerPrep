const mongoose = require('mongoose');
const Match = require('../models/Match');
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
    const username = req.body.username;
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
        username: username,
        difficulty: difficulty,
        createdAt: Date()
    });

    match.save()
    .then(saveResult => {
        var count = 0;
        const intervalId = setInterval(() => {
            // In case some of the db operations below fails and never go into the 'count === 6' clause
            if (count >= 6) {
                clearInterval(intervalId);
                Match.findOneAndDelete({
                    username: username
                })
                .then(result => {
                    res.status(404).json({  // check what status code this should be
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
                username: username
            })
            .then(userResult => {
                // if user is already matched with a partner (the partner has already updated the current user's document)
                if (userResult.partnerUsername) {
                    clearInterval(intervalId);
                    res.json({
                        status: responseStatus.SUCCESS,
                        data: {
                            partnerUsername: userResult.partnerUsername,
                            interviewId: userResult.interviewId
                        }
                    });
                    return;
                }
                
                // if user is not matched with a partner yet, try to find a partner and update info for partner 
                Match.findOneAndUpdate({
                    username: { $ne: username},  // exclude the current user
                    partnerUsername: { $exists : false },  // make sure the other user has no partner yet
                    difficulty: difficulty
                }, {
                    partnerUsername: username,
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
                                username: username
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
                    // Update partner info for current user
                    Match.findOneAndUpdate({
                        username: username,
                        partnerUsername: { $exists : false }    // make sure the current user has no partner yet (to mitigate race conditions?)
                    }, { 
                        partnerUsername: partnerResult.username,
                        interviewId: partnerResult.interviewId
                    }, { new : true })
                    .then(finalResult => {
                        if (!finalResult) {
                            // maybe clean up the match records here
                            res.json({
                                status: responseStatus.FAILED,
                                data: {
                                    message: clientErrMessages.INCONSISTENT_PARTNERS
                                }
                            });
                            return;
                        }
                        res.json({
                            status: responseStatus.SUCCESS,
                            data: {
                                partnerUsername: partnerResult.username,
                                interviewId: partnerResult.interviewId
                            }
                        });
                        return;
                    })
                    .catch(finalResultErr => {
                        res.status(500).json({
                            status: responseStatus.ERROR,
                            error_message: dbErrMessages.writeError(finalResultErr)  // failed to update match details of current user after finding a match
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
};

// Get the current partner of the user
const getPartner = (req, res) => {
    const username = req.query.username;
    Match.findOne({
        username: username
    })
    .then(result => {
        if (result) {
            const partnerUsername = result.partnerUsername;
            if (partnerUsername) {
                res.json({
                    status: responseStatus.SUCCESS,
                    data: {
                        partnerUsername: partnerUsername
                    }
                });
                return;
            }
        }
        res.json({
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

// End the interview for the requested interviewId
const endInterview = (req, res) => {
    const interviewId = req.query.interviewId;
    Match.findOneAndDelete({
        interviewId: interviewId
    })
    .then(firstResult => {
        if (!firstResult) {
            res.json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.INVALID_INTERVIEW_ID
                }
            });
            return;
        }
        Match.findOneAndDelete({
            interviewId: interviewId
        })
        .then(secondResult => {
            if (!secondResult) {
                res.json({
                    status: responseStatus.FAILED,
                    data: {
                        message: clientErrMessages.MISSING_SECOND_USER_FOR_INTERVIEW_ID
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
            return;
        })
        .catch(secondResultErr => {
            res.status(500).json({
                status: responseStatus.ERROR,
                error_message: db.deleteError(secondResultErr) // failed to delete interview for second user
            });
            return;
        })
    })
    .catch(firstResultErr => {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: db.deleteError(firstResultErr) // failed to delete interview for first user
        })
    });
}

module.exports = {
    statusCheck,
    interviewsCount,
    findMatch,
    getPartner,
    endInterview
};