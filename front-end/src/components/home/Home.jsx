import React from 'react';
import { useState, useContext } from 'react';
import Difficulties from './difficulties/Difficulties';
import Container from 'react-bootstrap/Container'
import Questions from './questions/Questions';
import Seeds from '../../Seeds';
import FindMatchModal from './match/FindMatchModal';
import { AppContext } from "../../App.js"

function Home() {
    const seeds = Seeds();
    const [matchDifficulty, setMatchDifficulty] = useState("");
    const [showMatchModal, setShowMatchModal] = useState(false);
    const { user } = useContext(AppContext);
    return (
        <>
            <Container>
                <Difficulties setMatchDifficulty={setMatchDifficulty} setShowMatchModal={setShowMatchModal} />
                <br /><br />
                <Questions questions={seeds.questions} />
            </Container>
            <FindMatchModal show={showMatchModal} difficulty={matchDifficulty} setShowMatchModal={setShowMatchModal} enableFindMatch={user !== null}/>
        </>
    )
}

export default Home;