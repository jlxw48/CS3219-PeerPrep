import { Row, Spinner } from 'react-bootstrap';
import '../css/LoadingScreen.css'

function LoadingScreen() {
    return <Row className="loading-screen-container"><Spinner animation="border" /></Row>
}

export default LoadingScreen;