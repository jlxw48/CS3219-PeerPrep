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

const firstUserInterviewDetails = {
    email: "user1@gmail.com",
    difficulty: "easy",
    createdAt: new Date(2021, 9, 6, 19, 30, 0),
    partnerEmail: "user2@gmail.com",
    interviewId: "615d93afdb4e069cbdfe114a",
    questionTitle: "easy question title 1",
    questionDescription: "easy question description 1"
};
const secondUserInterviewDetails = {
    email: "user2@gmail.com",
    difficulty: "easy",
    createdAt: new Date(2021, 9, 6, 19, 30, 10),
    partnerEmail: "user1@gmail.com",
    interviewId: "615d93afdb4e069cbdfe114a",
    questionTitle: "easy question title 1",
    questionDescription: "easy question description 1"
};
const thirdUserInterviewDetails = {
    email: "user3@gmail.com",
    difficulty: "medium",
    createdAt: new Date(2021, 9, 6, 19, 35, 0),
    partnerEmail: "user4@gmail.com",
    interviewId: "615d93afdb4e069cbdfe114b",
    questionTitle: "medium question title 2",
    questionDescription: "medium question description 2"
};
const fourthUserInterviewDetails = {
    email: "user4@gmail.com",
    difficulty: "medium",
    createdAt: new Date(2021, 9, 6, 19, 35, 10),
    partnerEmail: "user3@gmail.com",
    interviewId: "615d93afdb4e069cbdfe114b",
    questionTitle: "medium question title 2",
    questionDescription: "medium question description 2"
};
const fifthUserInterviewDetails = {
    email: "user5@gmail.com",
    difficulty: "hard",
    createdAt: new Date(2021, 9, 6, 19, 40, 0),
    partnerEmail: "user6@gmail.com",
    interviewId: "615d93afdb4e069cbdfe114c",
    questionTitle: "hard question title 2",
    questionDescription: "hard question description 2"
};
const sixthUserInterviewDetails = {
    email: "user6@gmail.com",
    difficulty: "hard",
    createdAt: new Date(2021, 9, 6, 19, 40, 10),
    partnerEmail: "user5@gmail.com",
    interviewId: "615d93afdb4e069cbdfe114c",
    questionTitle: "hard question title 2",
    questionDescription: "hard question description 2"
};

module.exports = {
    firstUserFindDetails,
    secondUserFindDetails,
    thirdUserFindDetails,
    firstUserMatchDetails,
    firstUserInterviewDetails,
    secondUserInterviewDetails,
    thirdUserInterviewDetails,
    fourthUserInterviewDetails,
    fifthUserInterviewDetails,
    sixthUserInterviewDetails
}