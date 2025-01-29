import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Menubar from "../../components/Menubar";
const serverIP = import.meta.env.VITE_SERVER_IP;

const ItemSearch = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = sessionStorage.getItem("AUTH");
        const response = await fetch(`http://${serverIP}/stock/get-stock`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setItems(data.stock || []);
        } else {
          setError(data.error || "Failed to fetch items");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

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
