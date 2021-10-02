import React from 'react';
import Difficulties from './difficulties/Difficulties';
import Container from 'react-bootstrap/Container'
import Questions from './questions/Questions';
import Seeds from '../Seeds';

function Home() {
    const seeds = Seeds();
    return (
        <>
            <Container>
                <Difficulties />
                <br /><br />
                <Questions questions={seeds.questions} />
            </Container>
        </>
    )
}

export default Home;