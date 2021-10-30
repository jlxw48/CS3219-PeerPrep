import React, {useContext} from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import '../css/PeerPrepNav.css'
import { NavLink } from 'react-router-dom'
import {AppContext} from '../App.js';
import { toast } from 'react-toastify'
import { useHistory } from "react-router-dom";
import axios from 'axios'
import { LOGOUT_URL, END_MATCH_URL } from "../Api.js";
import { Button } from 'react-bootstrap'
import {confirm} from 'react-bootstrap-confirmation';



function PeerPrepNav() {
    const history = useHistory();
    let { user, setUser, matchRef, setMatch } = useContext(AppContext);

    // Calls user API to delete JWT cookie
    const handleLogout = () => {
        axios.post(LOGOUT_URL);
        setUser(null);
        toast.success("Succesfully logged out")
        history.push({pathname: '/'});
    }

    // Calls match API to end interview and set state of match to be none.
    const handleEndInterview = async () => {
        const isEndInterview = await confirm("Are you sure?", {title: 'End interview', okText: 'End interview', okButtonStyle: 'danger', cancelButtonStyle: 'dark'});
        if (!isEndInterview) {
            return;
        }
        axios.delete(END_MATCH_URL, {
            params: {email: user.email}
        }).then(res => {
            if (res.status === 200 && res.data.status == "success") {
                toast.success("Successfully ended interview.");
                setMatch(null);
            } else {
                toast.error("Error ending interview, please try again");
            }
        }).catch(err => {
            toast.error("Error contacting server to end interview, please try again.");
        });
        history.push({pathname: '/'});
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <NavLink to="/" exact className="navbar-brand NavbarBrand">PeerPrep</NavLink>
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
                { matchRef.current !== null && <Nav className="ml-auto" onClick={() => handleEndInterview()}><Button variant="danger"><b>End interview</b></Button></Nav> }
            </Container>
        </Navbar>
    );
}

export default PeerPrepNav;
