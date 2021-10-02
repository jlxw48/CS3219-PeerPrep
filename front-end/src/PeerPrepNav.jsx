import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import './css/PeerPrepNav.css'

function PeerPrepNav() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand className="NavbarBrand" href="#home">Navbar</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link className="my-nav-link" href="#home">Home</Nav.Link>
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default PeerPrepNav;
