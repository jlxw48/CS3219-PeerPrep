const Chat = require('../models/Chat');
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

// Add a new message
const new_message = (req, res) => {
    if (requestHelpers.hasMissingFieldsForAddNewMessage(req)) {
            res.status(400).json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.MISSING_REQUEST_BODY
                }
            });
            return;
    }
    Chat.findOne({
        interviewId: req.body.interviewId
    })
    .then(result => {
        const message = { userEmail: req.body.userEmail, message: req.body.message };
        if (!result) {
            const chat = new Chat({
                interviewId: req.body.interviewId,
                history: [message]
            });
            chat.save()
            .then(saveResult => {
                res.json({
                    status: responseStatus.SUCCESS,
                    data: {
                        message: clientMessages.CHAT_SAVED
                    }
                });
            })
            .catch((err) => {
                res.status(400).json({
                    status: responseStatus.ERROR,
                    error_message: dbErrMessages.writeError(err)
                });
            });
        } else {
            Chat.findOneAndUpdate({
                interviewId: req.body.interviewId
            }, {
                $push: {history: message}
            })
            .then(updateResult => {
                res.json({
                    status: responseStatus.SUCCESS,
                    data: {
                        message: clientMessages.CHAT_SAVED
                    }
                });
            })
            .catch((err) => {
                res.status(400).json({
                    status: responseStatus.ERROR,
                    error_message: dbErrMessages.writeError(err)
                });
            });
        }
    })
    .catch((err) => {
        res.status(400).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err)
        });
    });
};

// Gets all messages of an interview
const get_messages = (req, res) => {
    if (requestHelpers.hasMissingFieldsForGetMessages(req)) {
            res.status(400).json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.MISSING_INTERVIEW_ID_PARAM
                }
            });
            return;
    }
    Chat.findOne({
        interviewId: req.params.interviewId
    })
    .then(result => {
        if (!result) {
            res.status(404).json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErrMessages.CHAT_HISTORY_NOT_FOUND
                }
            });
        } else {
            res.json({
                status: responseStatus.SUCCESS,
                data: {
                    history: result.history
                }
            });
        }
    })
    .catch((err) => {
        res.status(400).json({
            status: responseStatus.ERROR,
            error_message: dbErrMessages.readError(err)
        });
    });
};

module.exports = {
    statusCheck,
    new_message,
    get_messages
};