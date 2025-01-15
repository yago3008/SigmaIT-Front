import styles from "./styles.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useEffect, useState } from "react";

const Menubar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default Menubar;
