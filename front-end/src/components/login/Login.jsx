import React, { useContext } from "react";
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import '../../css/Login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { ErrorContext } from "../../App";

function Login(props) {
    const { errors, addError } = useContext(ErrorContext);

    const handleRegister = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        addError("nabei");
    }

    const handleLogin = (event) => {
        console.log(event);
        console.log("HI")
    }

    return (
        <>
            <Container className="login-container">
                <Row className="card-row justify-content-md-center align-items-center">
                    <Col md="6">
                        <Card>
                            <Card.Header className="bg-dark text-light">{props.isRegister ? "Register" : "Login"} &nbsp;<FontAwesomeIcon icon={faLock} /></Card.Header>
                            <Card.Body>
                                <Form onSubmit={props.isRegister ? handleRegister : handleLogin}>
                                    <Row className="justify-content-md-center">
                                        <Col md="8">
                                            {props.isRegister &&
                                                <Form.Group className="mb-3" controlId="formBasicName">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" name="name" placeholder="Enter your name" />
                                                </Form.Group>
                                            }
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="email" name="email" placeholder="Enter email" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-md-center">
                                        <Col md="8">
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" name="password" placeholder="Password" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="10">
                                            <Button variant="dark" type="submit" className="float-end">
                                                {props.isRegister ? "Register" : "Login"}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );

}

export default Login;