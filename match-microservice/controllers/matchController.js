const mongoose = require('mongoose');
const Match = require('../models/Match');
const Interview = require('../models/Interview');
const axios = require('axios');
const responseStatus = require('../common/status/responseStatus');
const requestHelpers = require('../common/helpers/requestHelpers');
const clientMessages = require('../common/messages/clientMessages');
const clientErrMessages = require('../common/errors/clientErrors');
const dbErrMessages = require('../common/errors/dbErrors');

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
const getInterview = async (req, res) => {
    const email = req.query.email;

    try {
        const interview = await Interview.findOne({
            $or: [
                { firstUserEmail: email },
                { secondUserEmail: email }
            ]
        });
    
        if (!interview) {
            res.status(404).json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.NO_INTERVIEW
                }
            });
            return;
        }
    
        var partnerEmail = interview.firstUserEmail;
        if (partnerEmail == email) {
            partnerEmail = interview.secondUserEmail;
        }

        // Calculate time left for interview
        var secondsPassed = Math.floor((new Date().getTime() - interview.createdAt.getTime()) / 1000);
        const durationLeft = 3600 - secondsPassed;
        
        res.json({
            status: responseStatus.SUCCESS,
            data: {
                partnerEmail: partnerEmail,
                interviewId: interview.interviewId,
                question: interview.question,
                durationLeft: durationLeft
            }
        });
    } catch (err) {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err)
        });
    }
}

// End the interview for the requested user
const endInterview = async (req, res) => {
    const email = req.query.email;

    try {
        const interview = await Interview.findOne({
            $or: [
                { firstUserEmail: email },
                { secondUserEmail: email }
            ]
        });
    
        if (!interview) {
            res.status(404).json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.DELETE_INTERVIEW_FAILED
                }
            });
            return;
        }

        const firstUserEmail = interview.firstUserEmail;
        const secondUserEmail = interview.secondUserEmail;
        
        // partner has already ended the interview
        if (firstUserEmail == undefined || secondUserEmail == undefined) {
            await Interview.findOneAndDelete({ interviewId : interview.interviewId }).exec();
            res.json({
                status: responseStatus.SUCCESS,
                data: {
                    message: clientMessages.INTERVIEW_ENDED
                }
            });
            return;
        }

        if (email == firstUserEmail) {
            interview.firstUserEmail = undefined;
        } else {
            interview.secondUserEmail = undefined;
        }
        await interview.save();

        res.json({
            status: responseStatus.SUCCESS,
            data: {
                message: clientMessages.INTERVIEW_ENDED
            }
        });
    } catch (err) {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err)
        });
    }
}

// Tries to find a match for a user for 30s
const findMatch = async (req, res) => {
    if (requestHelpers.hasMissingFieldsForFindMatch(req)) {
        res.status(400).json({
            status: responseStatus.FAILED,
            data: {
                message: clientErrMessages.MISSING_REQUEST_BODY
            }
        });
        return;
    }
    
    try {
        const numInterviews = await Interview.countDocuments({});
        if (numInterviews >= 5) {
            res.status(404).json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.MAX_INTERVIEW_REACHED
                }
            });
            return;
        }
    } catch (err) {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err)
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
    
    try {
        const matchExists = await Match.findOne({ email: email }).exec();
        if (matchExists) {
            await Match.findOneAndDelete({ email: email }).exec();
        }
        
        const match = new Match({
            email: email,
            difficulty: difficulty,
        });
        await match.save();
    } catch (err) {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err)
        });
        return;
    }

    req.on("close", async () => {
        await Match.findOneAndDelete({ email: email }).exec();
    });
        
    var count = 0;
    const ONE_HOUR = 3600;
    const intervalId = setInterval(async () => {
        count = count + 1;
        // 30s time limit reached
        if (count >= 6) {
            clearInterval(intervalId);
            await Match.findOneAndDelete({ email: email }).exec();
            res.status(404).json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.TIMEOUT_30_SECONDS
                }
            });
            return;
        }

        try {
            const interviewExists = await Interview.findOne({
                $or: [
                    { firstUserEmail: email },
                    { secondUserEmail: email }
                ]
            });
            
            if (interviewExists) {
                // user is already matched with a partner
                clearInterval(intervalId);
                var partnerEmail = interviewExists.firstUserEmail;
                if (partnerEmail == email) {
                    partnerEmail = interviewExists.secondUserEmail;
                }

                res.json({
                    status: responseStatus.SUCCESS,
                    data: {
                        partnerEmail: partnerEmail,
                        interviewId: interviewExists.interviewId,
                        question: interviewExists.question,
                        durationLeft: ONE_HOUR
                    }
                });
                return;
            }
            
            // if user is not matched with a partner yet, try to find a partner
            const partnerResult = await Match.findOne({
                email: { $ne: email},  // exclude the current user
                difficulty: difficulty
            }, {}, {
                sort: { "createdAt": 1}  // find the earliest queueing user
            })
            .exec();
            
            if (!partnerResult) {
                // no suitable match found
                return;
            }
            
            // match is found
            clearInterval(intervalId);

            // Delete both match records
            await Match.findOneAndDelete({ email: email }).exec();
            await Match.findOneAndDelete({ email: partnerResult.email }).exec();
                    
            // Fetch a random question from question-microservice for the interview
            const questionResult = await axios.get(`http://questions:3000/api/questions/get_random_question?difficulty=${difficulty}`);
            const response = questionResult.data;
            
            // failed to retrieve question for interview
            if (response.status != responseStatus.SUCCESS || !response.data || response.data.questions.length < 1) {
                res.status(404).json({  
                    status: responseStatus.FAILED,
                    data: {
                        message: clientErrMessages.RETRIEVE_QUESTION_FAILED
                    }  
                });
                return;
            }
            
            const question = response.data.questions[0];

            const interview = new Interview({
                interviewId: mongoose.Types.ObjectId(),  // Generate a random inverviewId
                difficulty: difficulty,
                question: question,
                firstUserEmail: email,
                secondUserEmail: partnerResult.email
            });
            await interview.save();
            
            res.json({
                status: responseStatus.SUCCESS,
                data: {
                    partnerEmail: partnerResult.email,
                    interviewId: interview.interviewId,
                    question: question,
                    durationLeft: ONE_HOUR
                }
            });
        } catch (err) {
            clearInterval(intervalId);
            res.status(500).json({
                status: responseStatus.ERROR,
                error_message: dbErrMessages.writeError(err)
            });
            return;
        }
    }, 5000);  // Try to find a match every 5s, until 30s is up
}

const cancelFindMatch = async (req, res) => {
    if (req.body.email === undefined) {
        res.status(400).json({
            status: responseStatus.FAILED,
            data: {
                message: clientErrMessages.MISSING_REQUEST_BODY
            }
        });
        return;
    }
    const email = req.body.email;

    await Match.findOneAndDelete({ email: email }).exec();

    res.status(204);
}

// Get number of current ongoing interviews
const interviewsCount = async (req, res) => {
    try {
        const numInterviews = await Interview.countDocuments({});
        res.json({
            status: responseStatus.SUCCESS,
            data: {
                count: numInterviews
            }
        });
    } catch (err) {
        res.status(500).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err) // failed to get number of interviews
        });
    }
}

module.exports = {
    statusCheck,
    getInterview,
    endInterview,
    findMatch,
    interviewsCount,
    cancelFindMatch
};
