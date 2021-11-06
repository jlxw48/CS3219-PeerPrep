import React, { useContext, useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import '../css/PeerPrepNav.css'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../App.js';
import { toast } from 'react-toastify'
import { useHistory, useLocation } from "react-router-dom";
import axios from 'axios'
import { LOGOUT_URL, END_MATCH_URL, JWT_TOKEN_NAME } from "../constants.js";
import { Button } from 'react-bootstrap'
import { confirm } from 'react-bootstrap-confirmation';



function PeerPrepNav() {
    const history = useHistory();
    let { user, setUser, matchRef, setMatch, isAdminRef } = useContext(AppContext);
    const [expanded, setExpanded] = useState(false);

    // Calls user API to delete JWT cookie
    const handleLogout = () => {
        localStorage.removeItem(JWT_TOKEN_NAME);
        setUser(null);
        if (matchRef.current !== null) {
            toast.info("Your interview has been ended.");
        }
        setMatch(null);
        toast.success("Succesfully logged out")
        history.push({ pathname: '/' });
    }

    // Calls match API to end interview and set state of match to be none.
    const handleEndInterview = async () => {
        const isEndInterview = await confirm("Are you sure?", { title: 'End interview', okText: 'End interview', okButtonStyle: 'danger', cancelButtonStyle: 'dark' });
        if (!isEndInterview) {
            return;
        }
        axios.delete(END_MATCH_URL, {
            params: { email: user.email }
        }).then(res => {
            if (res.status === 200 && res.data.status === "success") {
                toast.success("Successfully ended interview.");
                setMatch(null);
            } else {
                toast.error("Error ending interview, please try again");
            }
        }).catch(err => {
            toast.error("Error contacting server to end interview, please try again.");
        });
        history.push({ pathname: '/' });
    }

    const closeNavbarOnClick =() => setTimeout(() => {setExpanded(false)}, 30);

    const currRoute = useLocation().pathname;

    return (
        <Navbar collapseOnSelect expanded={expanded} expand="sm" bg="dark" variant="dark">
            <Container fluid>
                <NavLink to="/" exact className="navbar-brand NavbarBrand" onClick={closeNavbarOnClick}>PeerPrep</NavLink>
                <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className="me-auto">
                        <NavLink to="/" exact className="nav-link" onClick={closeNavbarOnClick}>Home</NavLink>

                        {/* Login button */}
                        {
                            user === null && <NavLink to="/login" exact className="nav-link" onClick={closeNavbarOnClick}>Login</NavLink>
                        }

                        {/* Register button */}
                        {
                            user === null && <NavLink to="/register" exact className="nav-link" onClick={closeNavbarOnClick}>Register</NavLink>
                        }

                        {/* Logout button */}
                        {
                            user !== null && <Nav.Link onClick={() => {
                                handleLogout();
                                closeNavbarOnClick();
                            }} className="nav-link">Logout</Nav.Link>
                        }
                        {/* Manage questions button */}
                        {
                            isAdminRef.current &&
                            <NavLink to="/manage_questions" className="nav-link">Manage Questions</NavLink>
                        }
                        {/* Todo: Hide tutorial button for admin user */}
                        {
                        <NavLink to="/tutorial" exact className="nav-link" onClick={closeNavbarOnClick}>Tutorial</NavLink>
                        }
                    </Nav>

                    {/* Resume interview button */}
                    {matchRef.current !== null && currRoute !== "/practice" && <Nav className="ml-auto resume-interview-button" onClick={() => {
                        history.push({ pathname: "/practice" });
                        closeNavbarOnClick();
                    }}><Button variant="success"><b>Resume interview</b></Button></Nav>}

                    {/* End interview button */}
                    {matchRef.current !== null && <Nav className="ml-auto" onClick={() => {
                        handleEndInterview();
                        closeNavbarOnClick();
                    }}><Button variant="danger"><b>End interview</b></Button></Nav>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default PeerPrepNav;
