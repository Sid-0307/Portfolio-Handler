import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Dialog = ({ item, action, onClose, onSuccess }) => {
  if (!item) return null;

  const [shares, setShares] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setTotalAmount(shares * item.currentPrice);
  }, [shares]);

  const buyStock = async (shares) => {
    try {
      const response = await axios.post("http://localhost:8080/api/buy", {
        symbol: item.symbol,
        name: item.name,
        quantity: shares,
        price: item.currentPrice,
        investedAmt: parseFloat(totalAmount).toFixed(2),
        revenue: 0,
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Stock bought successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error buying stock:", error);
    }
  };

  const sellStock = async (shares) => {
    try {
      const response = await axios.put("http://localhost:8080/api/sell", {
        symbol: item.symbol,
        name: item.name,
        quantity: shares,
        price: item.currentPrice,
        investedAmt: totalAmount,
        revenue: 0,
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Stock sold successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error selling stock:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    if (action === "Sell") {
      setShares(Math.min(value, item.quantity));
    } else if (action === "Buy") {
      setShares(value);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>
          {action} {item.name}
        </h2>
        {action === "Sell" ? (
          <>
            <p>
              Enter the number of shares you want to {action.toLowerCase()}{" "}
              (max: {item.quantity}):
            </p>
            <input
              type="number"
              className="dialog-input"
              value={shares}
              onChange={handleInputChange}
              min={0}
              max={item.quantity}
            />
            <p>Total Revenue: ${totalAmount.toFixed(2)}</p>
          </>
        ) : action === "Buy" ? (
          <>
            <p>
              Enter the number of shares you want to {action.toLowerCase()}:
            </p>
            <input
              type="number"
              className="dialog-input"
              value={shares}
              onChange={handleInputChange}
              min={0}
            />
            <p>Invested Amount: ${totalAmount.toFixed(2)}</p>
          </>
        ) : null}
        <p>Current Price: ${item.currentPrice}</p>
        <button onClick={onClose} className="dialog-button">
          Cancel
        </button>
        <button
          onClick={() => {
            if (action === "Sell" && shares > 0) {
              sellStock(shares);
            } else if (action === "Buy" && shares > 0) {
              buyStock(shares);
            }
            onClose();
          }}
          className="dialog-button"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Dialog;
