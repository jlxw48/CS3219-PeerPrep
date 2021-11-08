const firstUserFindDetails = {
    email: "user1@gmail.com",
    difficulty: "easy",
};

const secondUserFindDetails = {
    email: "user2@gmail.com",
    difficulty: "easy",
};

const thirdUserFindDetails = {
    email: "user3@gmail.com",
    difficulty: "medium",
};

const firstUserMatchDetails = {
    email: "user1@gmail.com",
    difficulty: "easy",
    createdAt: new Date(2021, 9, 6, 19, 30, 0)
};

const firstUserStopFindDetails = {
    email: "user1@gmail.com"
};

const firstInterviewDetails = {
    interviewId: "615d93afdb4e069cbdfe114a",
    difficulty: "easy",
    question: {
        title: "easy question",
        description: "easy question description",
        difficulty: "easy"
    },
    firstUserEmail: "user1@gmail.com",
    secondUserEmail: "user2@gmail.com",
    createdAt: new Date(2021, 9, 6, 19, 30, 0)
};
const secondInterviewDetails = {
    interviewId: "615d93afdb4e069cbdfe114b",
    difficulty: "medium",
    question: {
        title: "medium question",
        description: "medium question description",
        difficulty: "medium"
    },
    firstUserEmail: "user3@gmail.com",
    secondUserEmail: "user4@gmail.com",
    createdAt: new Date(2021, 9, 6, 19, 30, 10)
};
const thirdInterviewDetails = {
    interviewId: "615d93afdb4e069cbdfe114c",
    difficulty: "hard",
    question: {
        title: "hard question",
        description: "hard question description",
        difficulty: "hard"
    },
    firstUserEmail: "user5@gmail.com",
    secondUserEmail: "user6@gmail.com",
    createdAt: new Date(2021, 9, 6, 19, 35, 0)
};

module.exports = {
    firstUserFindDetails,
    secondUserFindDetails,
    thirdUserFindDetails,
    firstUserMatchDetails,
    firstUserStopFindDetails,
    firstInterviewDetails,
    secondInterviewDetails,
    thirdInterviewDetails
}