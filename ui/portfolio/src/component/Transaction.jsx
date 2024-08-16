import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";

const Transaction = () => {
  const currencyList = {
    USD: "$",
    GBP: "£",
    EUR: "€",
    INR: "₹",
    JPY: "¥",
  };

  const [currency, setCurrency] = useState("USD");
  const [currencyRate, setCurrencyRate] = useState({
    USD: 1,
    GBP: 0.7832,
    EUR: 0.915,
    INR: 83.9675,
    JPY: 147.2188,
  });
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios
        .get("http://localhost:8080/api/myTransactions")
        .then((res) => res.data);
      if (!response.status == 200) {
        throw new Error("Network response was not ok");
      }
      response.map((r) => {
        r.price = parseFloat(r.price).toFixed(2);
        r.total = parseFloat(r.total).toFixed(2);
        r.updatedPrice = r.price;
        r.updatedTotal = r.total;
      });
      setTransactions(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCurrencyRate = async () => {
    const rates = await axios
      .get(
        "https://v6.exchangerate-api.com/v6/6595bf45b4dff451300a1112/latest/USD"
      )
      .then((response) => response.data.conversion_rates);
    setCurrencyRate(rates);
  };

  useEffect(() => {
    getCurrencyRate();
    fetchData();
  }, []);

  const convertPrices = () => {
    const rate = currencyRate[currency];
    const newData = transactions.map((transaction) => ({
      ...transaction,
      updatedTotal: parseFloat(transaction.total * rate).toFixed(2),
      updatedPrice: parseFloat(transaction.price * rate).toFixed(2),
    }));
    setTransactions(newData);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  useEffect(() => {
    convertPrices();
  }, [currency]);

  return (
    <div>
      <Navbar />
      <div className="transaction right-page">
        <div className="transaction-table-heading-div">
          <p className="transaction-table-heading">Your transactions</p>
          <select
            id="currency"
            name="currency"
            value={currency}
            onChange={handleCurrencyChange}
            className="currency-list"
          >
            <option value="USD">$</option>
            <option value="EUR">€</option>
            <option value="GBP">£</option>
            <option value="INR">₹</option>
            <option value="JPY">¥</option>
          </select>
        </div>

        <table className="transaction-table">
          <thead>
            <tr className="transaction-columns">
              <th>TransactionId</th>
              <th>Symbol</th>
              <th>Trade</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Timestamp</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="transaction-body">
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className={transaction.trade == "BUY" ? "buy-row" : "sell-row"}
              >
                <td>{transaction.transactionId}</td>
                <td>{transaction.stockSymbol}</td>
                <td>{transaction.trade}</td>
                <td>{transaction.quantity}</td>
                <td>
                  {currencyList[currency]}
                  {transaction.updatedPrice}
                </td>
                <td>
                  {currencyList[currency]}
                  {transaction.updatedTotal}
                </td>
                <td>{transaction.timeStamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaction;
