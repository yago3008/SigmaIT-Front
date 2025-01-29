import styles from "./styles.module.css";
import Menubar from "../../components/Menubar";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const serverIP = import.meta.env.VITE_SERVER_IP;

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [showMessage, setShowMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const token = sessionStorage.getItem("AUTH");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(token);
        const response = await fetch(`http://${serverIP}/user/register`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            setShowMessage(data.message)
            setShowError(false);
        } else {
            setShowError(true);
            setErrorMessage(data.error);
            setShowMessage('')
        }
    };

    useEffect(() => {
        if (showError || showMessage) {
            const timeout = setTimeout(() => {
                setShowError(false);
                setShowMessage("");
            }, 3000);

            return () => clearTimeout(timeout); 
        }
    }, [showError, showMessage]);

    return (
        <div>
            <Menubar />
            <div className={styles.page}>
                <div className={styles.form}>
                    <h2>Register</h2>
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
                            {showMessage && <Alert variant="success">{showMessage}</Alert>}
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
