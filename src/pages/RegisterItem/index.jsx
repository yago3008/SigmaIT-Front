import styles from "./styles.module.css";
import Menubar from "../../components/Menubar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [ownerName, setOwnerName] = useState("");
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [saveTemplate, setSaveTemplate] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState({});
    const [additionalKey, setAdditionalKey] = useState("");
    const [additionalValue, setAdditionalValue] = useState("");
    const [cost, setCost] = useState(0);


    const [showMessage, setShowMessage] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const navigate = useNavigate();
    const token = sessionStorage.getItem("AUTH");


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3000/stock/register-item", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                ownerName,
                itemName,
                quantity,
                type,
                description,
                saveTemplate,
                templateName,
                additionalInfo,
                cost,
            }),
        });

        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
            setShowMessage(data.message);
            setShowError(false);
        } else {
            setShowError(true);
            if(!data.error){
                setErrorMessage(data.message);
                setShowMessage("");
            } else {
                setErrorMessage(data.error);
                setShowMessage("");
            }

        }
    };

    const handleAddAdditionalInfo = () => {
        if (additionalKey && additionalValue) {
            setAdditionalInfo({
                ...additionalInfo,
                [additionalKey]: additionalValue,
            });
            setAdditionalKey("");
            setAdditionalValue("");
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
                    <h2>Register Item</h2>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Owner</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Owner name"
                                onChange={(e) => setOwnerName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Item</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Item name"
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Quantity"
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Type"
                                onChange={(e) => setType(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Description"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cost</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Cost"
                                onChange={(e) => setCost(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                label="Add additional info"
                                onChange={(e) => setShowAdditionalInfo(e.target.checked)}
                            />
                        </Form.Group>
                        
                        {showAdditionalInfo && (
                            <>
                                <div className={styles.additionalInfo}>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Key"
                                            value={additionalKey}
                                            onChange={(e) => setAdditionalKey(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Value"
                                            value={additionalValue}
                                            onChange={(e) => setAdditionalValue(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button
                                        onClick={handleAddAdditionalInfo}
                                        className={styles.addButton}
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className={styles.additionalInfoList}>
                                    <strong>Current Additional Info:</strong>
                                    <pre>{JSON.stringify(additionalInfo, null, 2)}</pre>
                                </div>
                            </>
                        )}

                        <Button type="submit" className={styles.button} onClick={handleSubmit}>
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
