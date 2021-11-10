import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import Difficulties from './difficulties/Difficulties';
import Container from 'react-bootstrap/Container'
import Questions from './questions/Questions';
import FindMatchModal from './match/FindMatchModal';
import { AppContext } from "../../App.js"
import QuestionModal from './questions/QuestionModal';

function Home() {
    const [matchDifficulty, setMatchDifficulty] = useState("");
    const [showMatchModal, setShowMatchModal] = useState(false);
    const { user } = useContext(AppContext);
    const [questionToShow, setQuestionToShow] = useState(null);
    
    return (
        <>
            <Container>
                <Difficulties setMatchDifficulty={setMatchDifficulty} setShowMatchModal={setShowMatchModal} />
                <br /><br />
                <Questions setQuestionToShow={setQuestionToShow}/>
            </Container>
            <FindMatchModal show={showMatchModal} difficulty={matchDifficulty} setShowMatchModal={setShowMatchModal} enableFindMatch={user !== null}/>
            { questionToShow ? <QuestionModal question={questionToShow} setQuestionToShow={setQuestionToShow} /> : <></>}
        </>
    )
}

export default Home;