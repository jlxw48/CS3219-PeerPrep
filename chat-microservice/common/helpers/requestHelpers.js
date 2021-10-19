const hasMissingFieldsForAddNewMessage = req => {
    return req.body.interviewId == undefined || req.body.userEmail == undefined || req.body.message == undefined;
}

const hasMissingFieldsForGetMessages = req => {
    return req.body.interviewId == undefined;
}

module.exports = {
    hasMissingFieldsForAddNewMessage,
    hasMissingFieldsForGetMessages
};