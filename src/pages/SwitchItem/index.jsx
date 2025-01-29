import { useState, useEffect } from "react";
import Menubar from "../../components/Menubar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
const serverIP = import.meta.env.VITE_SERVER_IP;

const SwitchItem = () => {
    const [user, setUser] = useState("");
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [item, setItem] = useState("");
    const [itemSuggestions, setItemSuggestions] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addAdditionalInfo, setAddAdditionalInfo] = useState(false); // State to control the visibility of the checkbox
    const [saveTemplate, setSaveTemplate] = useState(false); // Checkbox state for saving template

    const token = sessionStorage.getItem("AUTH");

    useEffect(() => {
        if (user) {
            fetchUsers(user);
        } else {
            setUserSuggestions([]);
        }
    }, [user]);

    useEffect(() => {
        if (item) {
            fetchItems();
        } else {
            setItemSuggestions([]);
            setFilteredItems([]);
        }
    }, [item]);

    useEffect(() => {
        if (item) {
            const filtered = itemSuggestions.filter((i) =>
                i.itemName.toLowerCase().includes(item.toLowerCase())
            );
            setFilteredItems(filtered);
        } else {
            setFilteredItems(itemSuggestions);
        }
    }, [item, itemSuggestions]);

    const fetchUsers = async (query) => {
        try {
            const response = await fetch(`http://${serverIP}/user/search-user?name=${query}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setError(data.error)
            }

            const data = await response.json();
            setUserSuggestions(data.users);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`http://${serverIP}/stock/get-item?method=all`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch items.");
            }

            const data = await response.json();
            setItemSuggestions(data.item);
            setFilteredItems(data.item);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSubmit = async () => {
        if (!selectedUser || !selectedItem) {
            setError("Please select both user and item.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`http://${serverIP}/stock/switch-item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    receiver: selectedUser.name,
                    itemID: selectedItem.id,
                    saveTemplate: saveTemplate, // Send the saveTemplate status along with other data
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            alert(`Item ${selectedItem.id} successfully assigned to ${selectedUser.name}`);
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
                <h2>Switch Item</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Select User</Form.Label>
                        <div style={{ position: "relative" }}>
                            <Form.Control
                                type="text"
                                placeholder="Search user by name"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                autoComplete="off"
                            />
                            {userSuggestions.length > 0 && (
                                <ul style={{
                                    listStyle: "none",
                                    padding: 0,
                                    border: "1px solid #ccc",
                                    marginTop: "5px",
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                    position: "absolute",
                                    width: "100%",
                                    background: "#fff",
                                    zIndex: 10
                                }}>
                                    {userSuggestions.map((u) => (
                                        <li
                                            key={u.id}
                                            style={{ padding: "8px", cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setUser(u.name);
                                                setUserSuggestions([]);
                                            }}
                                        >
                                            {u.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Select Item</Form.Label>
                        <div style={{ position: "relative" }}>
                            <Form.Control
                                type="text"
                                placeholder="Enter item name"
                                value={item}
                                onChange={(e) => setItem(e.target.value)}
                                autoComplete="off"
                            />
                            {filteredItems.length > 0 && (
                                <ul style={{
                                    listStyle: "none",
                                    padding: 0,
                                    border: "1px solid #ccc",
                                    marginTop: "5px",
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                    position: "absolute",
                                    width: "100%",
                                    background: "#fff",
                                    zIndex: 10
                                }}>
                                    {filteredItems.map((i) => (
                                        <li
                                            key={i.id}
                                            style={{ padding: "8px", cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedItem(i);
                                                setItem(i.itemName);
                                                setFilteredItems([]);
                                            }}
                                        >
                                            
                                            {i.itemName?.toString()} - {i.type?.toString()} - {i.ownerName?.toString()}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Form.Group>

                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Processing..." : "Switch Item"}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default SwitchItem;
