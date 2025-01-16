import styles from "./styles.module.css";
import Menubar from "../../components/Menubar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useState, useEffect } from "react";

const Register = () => {
    const [ownerName, setOwnerName] = useState("");
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [type, setType] = useState("");
    const [saveTemplate, setSaveTemplate] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState({});
    const [additionalKey, setAdditionalKey] = useState("");
    const [additionalValue, setAdditionalValue] = useState("");
    const [cost, setCost] = useState(0);

    const [showTemplateSwitch, setShowTemplateSwitch] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const [showMessage, setShowMessage] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [userResults, setUserResults] = useState([]);
    const [debounceTimer, setDebounceTimer] = useState(null);  // Para debouncing

    const token = sessionStorage.getItem("AUTH");

    // Função para buscar usuários
    const fetchUsers = async (query) => {
        try {
            const response = await fetch(`http://localhost:3000/user/search-user?name=${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();
            if (Array.isArray(data.users)) setUserResults(data.users);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            setUserResults([]);
        }
    };

    // Debounced search function
    const handleOwnerNameChange = (e) => {
        const { value } = e.target;
        setOwnerName(value);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        setDebounceTimer(
            setTimeout(() => {
                if (value.length >= 3) {  // Pode ser ajustado para mais/menos caracteres
                    fetchUsers(value);
                } else {
                    setUserResults([]);
                }
            }, 500)  // Delay para não fazer uma requisição a cada tecla
        );
    };

    // Função para quando o usuário clica em um nome
    const handleUserClick = (name) => {
        setOwnerName(name);
        setUserResults([]);  // Limpa a lista de resultados
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                if (showTemplateSwitch) {
                    setShowAdditionalInfo(false);
                    const response = await fetch("http://localhost:3000/stock/get-template", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Erro na requisição: ${response.status}`);
                    }

                    const data = await response.json();

                    if (Array.isArray(data.templates)) setTemplates(data.templates);
                }
            } catch (err) {
                console.error("Erro ao buscar templates:", err);
                setTemplates([]);
            }
        };
        fetchTemplates();
    }, [showTemplateSwitch, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const templateData = selectedTemplate ? JSON.parse(selectedTemplate) : {};
        const finalAdditionalInfo = { ...additionalInfo, ...templateData };
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
                saveTemplate,
                templateName,
                additionalInfo: finalAdditionalInfo,
                cost,
            }),
        });

        const data = await response.json();
        if (response.status === 200) {
            setShowMessage(data.message);
            setShowError(false);
        } else {
            setShowError(true);
            setErrorMessage(data.error || data.message);
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
                        {/* Campos do Formulário */}
                        <Form.Group className="mb-3">
                            <Form.Label>Owner</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Owner name"
                                value={ownerName}
                                onChange={handleOwnerNameChange}
                            />
                            {userResults.length > 0 && (
                                <ul className={styles.userResultsList}>
                                    {userResults.map((user) => (
                                        <li key={user.id}>
                                            <button
                                                type="button"
                                                onClick={() => handleUserClick(user.name)}
                                                className={styles.userResultButton}
                                            >
                                                {user.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
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
                            <Form.Select onChange={(e) => setQuantity(Number(e.target.value))}>
                                {[...Array(101).keys()].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select onChange={(e) => setType(e.target.value)}>
                                <option value="">Select Type</option>
                                <option value="keyboard">Keyboard</option>
                                <option value="mouse">Mouse</option>
                                <option value="kit mouse-keyboard">Kit Mouse-Keyboard</option>
                                <option value="headset">Headset</option>
                                <option value="notebook">Notebook</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cost</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Cost"
                                onChange={(e) => setCost(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Check
                            type="switch"
                            label="Add additional info"
                            onChange={(e) => {
                                setShowAdditionalInfo(e.target.checked);
                                if (e.target.checked) {
                                    setShowTemplateSwitch(false);
                                    setSelectedTemplate(null);
                                }
                            }}
                            checked={showAdditionalInfo}
                        />

                        <Form.Check
                            type="switch"
                            label="Use template"
                            onChange={(e) => {
                                setShowTemplateSwitch(e.target.checked);
                                if (e.target.checked) {
                                    setShowAdditionalInfo(false);
                                    setAdditionalInfo({});
                                }
                            }}
                            checked={showTemplateSwitch}
                        />
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
                        {showTemplateSwitch && (
    <>
        <Form.Group className="mb-3">
            <Form.Label>Available Templates</Form.Label>
            <Form.Select
                onChange={(e) => setSelectedTemplate(e.target.value)}
                value={selectedTemplate || ""}
            >
                <option value="">Select a Template</option>
                {templates.map((template, index) => (
                    <option key={index} value={JSON.stringify(template)}>
                        {template.templateName}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
        {selectedTemplate && (
        <div className={styles.selectedTemplate}>
            <strong>Template Selected:</strong>
            <pre>{JSON.stringify(JSON.parse(selectedTemplate), null, 2)}</pre>
        </div>
    )}
    </>
)}
                        {showMessage && (
                            <Alert variant="success" onClose={() => setShowMessage(false)} dismissible>
                                {showMessage}
                            </Alert>
                        )}
                        {showError && (
                            <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                                {errorMessage}
                            </Alert>
                        )}
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
