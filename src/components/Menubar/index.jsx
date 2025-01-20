import styles from "./styles.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Menubar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notification, setNotification] = useState("");
    const [notificationType, setNotificationType] = useState("");
    const [searchMethod, setSearchMethod] = useState("all");
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);  // Novo estado para armazenar as sugestões
    const navigate = useNavigate();

    // Verifica a autenticação do usuário com base no token
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

    const fetchSuggestions = async (method, value) => {
        if (!value) {
            setSuggestions([]);
            return;
        }
        const token = sessionStorage.getItem("AUTH");
        try {
            const response = await fetch(`http://localhost:3000/stock/search-item?method=${method}&value=${value}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (response.ok) {
                setSuggestions(data.items);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        }
    };

    // Atualiza o valor do campo de pesquisa e chama a função de busca de sugestões
    const handleSearchValueChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        fetchSuggestions(searchMethod, value);  // Busca sugestões ao digitar
    };

    // Atualiza o método de pesquisa
    const handleSearchMethodChange = (method) => {
        setSearchMethod(method);
        setSearchValue("");  // Limpa o campo de pesquisa quando mudar o método
        setSuggestions([]);  // Limpa as sugestões
    };

    // Realiza a pesquisa quando o botão de pesquisa for clicado
    const handleSearch = () => {
        if (!searchValue && searchMethod !== "all") {
            setNotification("Please enter a value to search.");
            setNotificationType("error");
            return;
        }

        const url = searchMethod === "all"
            ? `/stock/get-item?method=${searchMethod}`
            : `/stock/get-item?method=${searchMethod}&value=${searchValue}`;
        navigate(url);
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
                                    <NavDropdown.Item href="/stock/get-item">Get Item</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                        {isLoggedIn && (
                            <Form className="d-flex ms-auto">
                                <Dropdown className="me-2">
                                    <Dropdown.Toggle variant="outline-light" id="search-method-dropdown">
                                        {searchMethod}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleSearchMethodChange("id")}>
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
                                        <Dropdown.Item onClick={() => handleSearchMethodChange("all")}>All</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                    style={{ backgroundColor: "white", color: "black" }}
                                    value={searchValue}
                                    onChange={handleSearchValueChange}  // Atualiza as sugestões ao digitar
                                />
                                <Button variant="light" onClick={handleSearch}>
                                    Search
                                </Button>
                                {suggestions.length > 0 && (
                                    <Dropdown.Menu>
                                        {suggestions.map((item, index) => (
                                            <Dropdown.Item key={index} onClick={() => setSearchValue(item)}>
                                                {item}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                )}
                            </Form>
                        )}
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
        </div>
    );
};

export default Menubar;
