module.exports = {
    // JWT_stub: {
    //     details : {
    //         email: "stub@stub.com",
    //         name: "stub",
    //         permissionLevel: 2
    //     }, 
    //     key : process.env.SECRET_KEY,
    //     options: {
    //         expiresIn: "7d",
    //     }
    // },
    post: {
        validQuestion1: {
            title: "4Sum",
            description: "4Sum super tough",
            difficulty: "medium"
        },
        validQuestion2: {
            title: "5Sum",
            description: "5Sum why so easy?",
            difficulty: "easy"
        }
    },
    put: {
        updateQuestionDifficulty: {
            difficulty: "hard"
        }
    }
}