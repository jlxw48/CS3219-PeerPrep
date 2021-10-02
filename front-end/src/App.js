import './css/App.css';
import PeerPrepNav from './PeerPrepNav';
import Difficulties from './home/difficulties/Difficulties';
import Container from 'react-bootstrap/Container'
import Questions from './home/questions/Questions';
import Seeds from './Seeds';

function App() {
  const seeds = Seeds();
  return (
    <>
      <PeerPrepNav />
      <Container>
        <Difficulties />
        <br/><br/>
        <Questions questions={seeds.questions} />
      </Container>
    </>
  );
}

export default App;
