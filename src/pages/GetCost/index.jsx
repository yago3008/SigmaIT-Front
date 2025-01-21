import { useState, useEffect } from "react";
import Menubar from "../../components/Menubar";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const GetCost = () => {
    const [department, setDepartment] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [cost, setCost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (showAll) {
            setSuggestions(allDepartments);
        } else if (department === "") {
            setSuggestions([]);
        } else {
            setSuggestions(
                allDepartments.filter(dept =>
                    dept.toLowerCase().includes(department.toLowerCase())
                )
            );
        }
    }, [department, showAll, allDepartments]);

    const fetchDepartments = async () => {
        const token = sessionStorage.getItem("AUTH");

        try {
            const response = await fetch("http://localhost:3000/user/get-department", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch departments.");
            }

            const data = await response.json();
            setAllDepartments(data.departments);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleFetchCost = async () => {
        if (!department) {
            setError("Please enter a department.");
            return;
        }

        setLoading(true);
        setError(null);
        setCost(null);

        const token = sessionStorage.getItem("AUTH");

        try {
            const response = await fetch(`http://localhost:3000/stock/get-cost?department=${department}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch cost. Please try again.");
            }

            const data = await response.json();
            setCost(data.totalCost);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Menubar />
            <div style={{ padding: "20px" }}>
                <h2>Get Department Cost</h2>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Department</Form.Label>
                        <div style={{ position: "relative" }}>
                            <Form.Control
                                type="text"
                                placeholder="Enter department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                autoComplete="off"
                            />
                            <span
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"
                                }}
                                onClick={() => setShowAll(!showAll)}
                            >
                                ▼
                            </span>
                        </div>
                        {suggestions.length > 0 && (
                            <ul style={{ 
                                listStyle: "none", 
                                padding: 0, 
                                border: "1px solid #ccc", 
                                marginTop: "5px", 
                                maxHeight: "150px", 
                                overflowY: "auto" 
                            }}>
                                {suggestions.map((suggestion, index) => (
                                    <li 
                                        key={index} 
                                        style={{ 
                                            padding: "8px", 
                                            cursor: "pointer", 
                                            background: "#f9f9f9" 
                                        }}
                                        onClick={() => {
                                            setDepartment(suggestion);
                                            setShowAll(false);
                                        }}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Form.Group>
                    <Button variant="primary" onClick={handleFetchCost} disabled={loading}>
                        {loading ? "Fetching..." : "Get Cost"}
                    </Button>
                </Form>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {cost !== null && (
                    <Alert variant="success" className="mt-3">
                        The cost for department {department} is: R${cost}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default GetCost;
