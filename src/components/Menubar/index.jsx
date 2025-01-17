import styles from "./styles.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";

const Menubar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notification, setNotification] = useState("");
    const [notificationType, setNotificationType] = useState("");
    const [searchMethod, setSearchMethod] = useState("all");
    const [searchValue, setSearchValue] = useState("");
    const [item, setItem] = useState(null);

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
                setNotificationType("success");
            } else {
                setNotification(`Error: ${data.error || data.message}`);
                setNotificationType("error");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setNotification("An unexpected error occurred.");
            setNotificationType("error");
        }

        setTimeout(() => setNotification(""), 5000);
    };

    const getItem = async (method, value) => {
        const token = sessionStorage.getItem("AUTH");
        const url = method === "all" ? `http://localhost:3000/stock/get-item?method=${method}` : `http://localhost:3000/stock/get-item?${method}=${value}`
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setItem(data.item);
                setNotification(`Success: ${data.message}`);
                setNotificationType("success");
            } else {
                setNotification(`Error: ${data.error || data.message}`);
                setNotificationType("error");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setNotification("An unexpected error occurred.");
            setNotificationType("error");
        }

        setTimeout(() => setNotification(""), 5000);
    };

    const handleSearchMethodChange = (method) => {
        setSearchMethod(method);
    };

    const handleSearch = () => {
        getItem(searchMethod, searchValue);
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
                                    <NavDropdown.Item href="/stock/get-item">Get Item</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                        <Form className="d-flex ms-auto">
                            <Dropdown className="me-2">
                                <Dropdown.Toggle variant="outline-light" id="search-method-dropdown">
                                    {searchMethod}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleSearchMethodChange("itemID")}>
                                        Item ID
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSearchMethodChange("itemName")}>
                                        Item Name
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSearchMethodChange("type")}>
                                        Item Type
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSearchMethodChange("ownerName")}>
                                        Owner Name
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSearchMethodChange("additionalInfo")}>
                                        Additional Info
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSearchMethodChange("all")}>
                                        All
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                style={{ backgroundColor: "white", color: "black" }}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <Button variant="light" onClick={handleSearch}>
                                Search
                            </Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {notification && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        backgroundColor: notificationType === "success" ? "#d4edda" : "#f8d7da",
                        color: notificationType === "success" ? "#155724" : "#721c24",
                        padding: "10px",
                        borderRadius: "5px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                    }}
                >
                    {notification}
                </div>
            )}
            {item && (
                <div className="container mt-4">
                    <h3>Item Details</h3>
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Owner Name:</strong> {item.ownerName}</p>
                    <p><strong>Item Name:</strong> {item.itemName}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Type:</strong> {item.type}</p>
                    <p><strong>Additional Info:</strong> {item.additionalInfo}</p>
                    <p><strong>Cost:</strong> {item.cost}</p>
                    <p><strong>Client ID:</strong> {item.clientId}</p>
                </div>
            )}
        </div>
    );
};

export default Menubar;
