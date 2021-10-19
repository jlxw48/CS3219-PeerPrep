const firstInterviewId = "1234567890";
const secondInterviewId = "9876543210";

const firstInterviewIdChatHistory = [
    { userEmail: "user1@gmail.com", message: "message 1" },
    { userEmail: "user1@gmail.com", message: "message 2" },
    { userEmail: "user2@gmail.com", message: "message 3" },
    { userEmail: "user2@gmail.com", message: "message 4" },
    { userEmail: "user2@gmail.com", message: "message 5" },
    { userEmail: "user1@gmail.com", message: "message 6" },
    { userEmail: "user1@gmail.com", message: "message 7" },
];

const firstInterviewIdDetails = {
    interviewId: firstInterviewId,
    history: firstInterviewIdChatHistory
}

module.exports = {
    firstInterviewId,
    secondInterviewId,
    firstInterviewIdDetails
} 