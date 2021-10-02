import './css/App.css';
import PeerPrepNav from './PeerPrepNav';
import Difficulties from './home/difficulties/Difficulties';
import Container from 'react-bootstrap/Container'

function App() {
  return (
    <>
      <PeerPrepNav />
      <Container>
        <Difficulties />
      </Container>
    </>
  );
}

export default App;
