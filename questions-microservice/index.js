const express = require('express');

const qnController = require("./db/question_controller");

const app = express();
const port = 3000;

app.route("/get_all_questions")
    .get(qnController.getAllQuestions)
    .all(setErrorMessage("Invalid HTTP Method!", 405));

// for matching
app.route("/get_random_question")
    .get(qnController.getRandomQuestion)
    .all(setErrorMessage("Invalid HTTP Method!", 405));

app.route("/create_question")
    .post(qnController.createQuestion)
    .all(setErrorMessage("Invalid HTTP Method!", 405));

app.route("/update_question")
    .put(qnController.updateQuestion)
    .all(setErrorMessage("Invalid HTTP Method!", 405));

app.route("/delete_question")
    .delete(qnController.deleteQuestion)
    .all(setErrorMessage("Invalid HTTP Method!", 405));

app.listen(port, () => {
    console.log(`Questions microservice listening at http://localhost:${port}`);
});