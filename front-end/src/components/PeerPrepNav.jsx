import React, {useContext} from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import '../css/PeerPrepNav.css'
import { NavLink } from 'react-router-dom'
import {AppContext} from '../App.js';
import { toast } from 'react-toastify'
import { useHistory } from "react-router-dom";



function PeerPrepNav() {
    const history = useHistory();
    let { user, setUser } = useContext(AppContext);
    console.log(user);
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        toast.success("Succesfully logged out")
        history.push({pathname: '/'});
    }
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand className="NavbarBrand">PeerPrep</Navbar.Brand>
                <Nav className="me-auto">
                    <NavLink to="/" exact className="nav-link">Home</NavLink>
                    {
                        user === null && <NavLink to="/login" exact className="nav-link">Login</NavLink>
                    }
                    {
                        user === null && <NavLink to="/register" exact className="nav-link">Register</NavLink>
                    }
                    {
                        user !== null && <Nav.Link onClick={() => handleLogout()} className="nav-link">Logout</Nav.Link>
                    }
                </Nav>
            </Container>
        </Navbar>
    );
}

export default PeerPrepNav;
