import styles from "./styles.module.css";
import Menubar from "../../components/Menubar";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3000/user/login', {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            const token = data.user.token;
            sessionStorage.setItem('AUTH', token);
            navigate('/');
        } else {
            if (username  === 'admin' && password === 'admin') {
                setShowError(true);
                setErrorMessage('GET OUT HERE NOW!😡');
            }
            else{
                setShowError(true);
                setErrorMessage(data.error);
            };

        }
    };

    useEffect(() => {
        if (showError) {
            const timeout = setTimeout(() => {
                setShowError(false);
            }, 3000);

            return () => clearTimeout(timeout); 
        }
    }, [showError]);

    return (
        <div>
            <Menubar />
            <div className={styles.page}>
                <div className={styles.form}>
                    <h2>Login</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicuser">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter user" 
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button 
                            type="submit" 
                            className={styles.button} 
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                        <div>
                            {showError && <Alert variant="danger">{errorMessage}</Alert>}
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
