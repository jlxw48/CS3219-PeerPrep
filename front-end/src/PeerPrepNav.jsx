import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import './css/PeerPrepNav.css'
import { NavLink } from 'react-router-dom'

function PeerPrepNav() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand className="NavbarBrand">PeerPrep</Navbar.Brand>
                <Nav className="me-auto">
                    <NavLink to="/" exact className="nav-link">Home</NavLink>
                    <NavLink to="/login" exact className="nav-link">Login</NavLink>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default PeerPrepNav;
