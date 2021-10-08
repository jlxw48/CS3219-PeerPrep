import React from 'react';
import Difficulties from './difficulties/Difficulties';
import Container from 'react-bootstrap/Container'
import Questions from './questions/Questions';
import Seeds from '../Seeds';
import FindMatchModal from './match/FindMatchModal';

function Home() {
    const seeds = Seeds();
    return (
        <>
            <Container>
                <Difficulties />
                <br /><br />
                <Questions questions={seeds.questions} />
            </Container>
            <FindMatchModal />
        </>
    )
}

export default Home;