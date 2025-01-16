import styles from "./styles.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useEffect, useState } from "react";

const Menubar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notification, setNotification] = useState("");
    const [notificationType, setNotificationType] = useState(""); // Novo estado para tipo de notificação

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem("AUTH");
            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/auth?token=${token}`);
                if (response.status === 200) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsLoggedIn(false);
            }
        };

        checkAuth();
    }, []);

    const updateClient = async () => {
        const token = sessionStorage.getItem("AUTH");

        try {
            const response = await fetch("http://localhost:3000/user/update-client", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setNotification(`Success: ${data.message}`);
                setNotificationType("success"); // Definir tipo como "sucesso"
            } else {
                setNotification(`Error: ${data.error || data.message}`);
                setNotificationType("error"); // Definir tipo como "erro"
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setNotification("An unexpected error occurred.");
            setNotificationType("error"); // Definir tipo como "erro"
        }

        // Remove notification after 5 seconds
        setTimeout(() => setNotification(""), 5000);
    };

    return (
        <div>
            <Navbar expand="lg" className={styles.menubar} data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">Sigma IT</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/register">Register</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                            {isLoggedIn && (
                                <NavDropdown title="Actions" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/stock/register-item">Register Item</NavDropdown.Item>
                                    <NavDropdown.Item onClick={updateClient}>Update Clients</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {notification && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        backgroundColor: notificationType === "success" ? "#d4edda" : "#f8d7da", // Cor de fundo dependendo do tipo
                        color: notificationType === "success" ? "#155724" : "#721c24", // Cor do texto dependendo do tipo
                        padding: "10px",
                        borderRadius: "5px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                    }}
                >
                    {notification}
                </div>
            )}
        </div>
    );
};

export default Menubar;
