import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Menubar from "../../components/Menubar";

const ItemSearch = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Função para obter os parâmetros da URL
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const method = query.get("method") || "all";
  const value = query.get("value") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = sessionStorage.getItem("AUTH");
        const url = value
          ? `http://localhost:3000/stock/get-item?method=${method}&value=${value}`
          : `http://localhost:3000/stock/get-item?method=${method}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setItems(data.item || []);
        } else {
          setError(data.error || "Failed to fetch items");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }

      setLoading(false);
    };

    fetchData();
  }, [method, value]);

  return (
    <div>
      <Menubar />
      <div className="container mt-4">
        <h3>Item Search Results</h3>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {items.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Owner Name</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Type</th>
                <th>Additional Info</th>
                <th>Cost</th>
                <th>Client ID</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.ownerName}</td>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.type}</td>
                  <td>{JSON.stringify(item.additionalInfo)}</td>
                  <td>{item.cost}</td>
                  <td>{item.clientId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p>No items found.</p>
        )}
      </div>
    </div>
  );
};

export default ItemSearch;
