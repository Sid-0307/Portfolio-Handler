import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { LuRefreshCw } from "react-icons/lu";
import Dialog from "./Dialog";
import axios from "axios";

const Portfolio = () => {
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
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [action, setAction] = useState(null);
  const [investedValue, setInvestedValue] = useState([0, 0]);
  const [revenue, setRevenue] = useState([0, 0]);
  const [stockValue, setStockValue] = useState([0, 0]);
  const [prevPrices, setPrevPrices] = useState([]);
  const [priceChangeArrows, setPriceChangeArrows] = useState({});
  const [prevStockValue, setPrevStockValue] = useState();

  const fetchValues = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/myInvestments"
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      setInvestedValue([
        parseFloat(response.data[0]).toFixed(2),
        parseFloat(response.data[0] * currencyRate[currency]).toFixed(2),
      ]);
      setRevenue([
        parseFloat(response.data[1]).toFixed(2),
        parseFloat(response.data[1] * currencyRate[currency]).toFixed(2),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/myHoldings");
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      await fetchValues();
      await fetchPrices(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPrices = async (response) => {
    try {
      let value = 0;
      const updatedResponse = await Promise.all(
        response.map(async (res) => {
          const newPrice = await axios
            .get(
              `http://neilapi.neueda.com/API/StockFeed/GetStockPricesForSymbol/${res.symbol.toLowerCase()}`
              // `https://financialmodelingprep.com/api/v3/quote/${res.symbol.toUpperCase()}?apikey=${process.env.REACT_APP_FINANCIAL_MODEL_API_KEY}`
            )
            .then((res) => res.data)
            .then((r) => parseFloat(r[0].price).toFixed(2));

          const prevPrice = prevPrices.find(
            (p) => p.symbol === res.symbol
          )?.price;
          const arrow =
            newPrice > prevPrice ? "▲" : newPrice < prevPrice ? "▼" : "";

          res.currentPrice = newPrice;
          res.updatedPrice = parseFloat(
            newPrice * currencyRate[currency]
          ).toFixed(2);
          res.worth = parseFloat(res.quantity * newPrice).toFixed(2);
          res.updatedWorth = parseFloat(
            res.quantity * newPrice * currencyRate[currency]
          ).toFixed(2);

          res.updatedInvestedAmt = parseFloat(
            res.investedAmt * currencyRate[currency]
          ).toFixed(2);
          value += res.quantity * newPrice;

          setPriceChangeArrows((prev) => ({
            ...prev,
            [res.symbol]: arrow,
          }));

          return res;
        })
      );

      const newStockValue = parseFloat(value).toFixed(2);
      const stockArrow =
        newStockValue > prevStockValue
          ? "▲"
          : newStockValue < prevStockValue
          ? "▼"
          : "";

      setStockValue([
        newStockValue,
        parseFloat(newStockValue * currencyRate[currency]).toFixed(2),
      ]);
      setData(updatedResponse);
      setPrevPrices(
        updatedResponse.map((res) => ({
          symbol: res.symbol,
          price: res.currentPrice,
        }))
      );
      setPrevStockValue(newStockValue);
      setPriceChangeArrows((prev) => ({
        ...prev,
        stock: stockArrow,
      }));
    } catch (error) {
      console.log("Error fetching prices: ", error);
    }
  };

  const getCurrencyRate = async () => {
    const rates = await axios
      .get(
        `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_CURRENCY_API_KEY}/latest/USD`
      )
      .then((response) => response.data.conversion_rates);
    setCurrencyRate(rates);
  };

  const convertPrices = async () => {
    const rate = currencyRate[currency];
    const newData = data.map((holding) => ({
      ...holding,
      updatedInvestedAmt: (holding.investedAmt * rate).toFixed(2),
      updatedPrice: (holding.currentPrice * rate).toFixed(2),
      updatedWorth: (holding.quantity * holding.currentPrice * rate).toFixed(2),
    }));

    if (investedValue[1] !== 0 && revenue[1] !== 0 && stockValue[1] !== 0) {
      const updatedInvestedValue = (investedValue[0] * rate).toFixed(2);
      const updatedRevenue = (revenue[0] * rate).toFixed(2);
      const updatedStockValue = (stockValue[0] * rate).toFixed(2);
      setInvestedValue([investedValue[0], updatedInvestedValue]);
      setRevenue([revenue[0], updatedRevenue]);
      setStockValue([stockValue[0], updatedStockValue]);
      setPrevPrices(
        prevPrices.map((p) => ({
          ...p,
          price: (p.price * rate).toFixed(2),
        }))
      );
      setPrevStockValue((prevStockValue * rate).toFixed(2));
    }
    setData(newData);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const openDialog = (x, item) => {
    setSelectedItem(item);
    setAction(x);
  };

  const closeDialog = () => {
    setSelectedItem(null);
    setAction(null);
  };

  useEffect(() => {
    getCurrencyRate();
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrices(data);
    }, 5000);

    return () => clearInterval(interval);
  }, [data, currency]);

  useEffect(() => {
    convertPrices();
  }, [currency]);

  return (
    <div>
      <Navbar />
      <div className="portfolio-content left-page">
        <div className="portfolio-overall">
          <div className="overall-values">
            <p className="portfolio-p">Total Invested Amount</p>
            <p className="portfolio-p value">
              {currencyList[currency]}{" "}
              {investedValue.length > 0 ? investedValue[1] : "Loading..."}
            </p>
          </div>

          <div className="overall-values">
            <p className="portfolio-p">Total Revenue</p>
            <p className="portfolio-p value">
              {currencyList[currency]}{" "}
              {revenue.length > 0 ? revenue[1] : "Loading..."}
            </p>
          </div>

          <div className="overall-values dynamic">
            <p className="portfolio-p">Holdings Net Worth</p>
            <p className="portfolio-p value">
              {currencyList[currency]}
              {stockValue.length > 0 ? stockValue[1] : "Loading..."}{" "}
              <span
                className={
                  stockValue[1] - investedValue[1] > 0 ? "profit" : "loss"
                }
              >
                (
                {(
                  ((stockValue[1] - investedValue[1]) / investedValue[1]) *
                  100
                ).toFixed(3)}
                %)
              </span>
            </p>
          </div>
        </div>

        <div className="holding">
          <div className="holding-table-heading-div">
            <p className="holding-table-heading">Your holding</p>
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
          <table className="holding-table">
            <thead>
              <tr className="holding-columns">
                <th>Symbol</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Invested Amount</th>
                <th>Current Price</th>
                <th>Holding Worth</th>
                <th></th>
              </tr>
            </thead>
            {data && data.length > 0 ? (
              <tbody className="holding-body">
                {data.map((holding, index) => (
                  <tr key={index}>
                    <td>{holding.symbol}</td>
                    <td>{holding.name}</td>
                    <td>{holding.quantity}</td>
                    <td>
                      {currencyList[currency]} {holding.updatedInvestedAmt}
                    </td>
                    <td>
                      {currencyList[currency]} {holding.updatedPrice}{" "}
                      {priceChangeArrows[holding.symbol] && (
                        <span
                          className={`price-change-arrow-${
                            priceChangeArrows[holding.symbol] === "▲"
                              ? "up"
                              : "down"
                          }`}
                        >
                          {priceChangeArrows[holding.symbol]}
                        </span>
                      )}
                    </td>
                    <td>
                      {currencyList[currency]} {holding.updatedWorth}{" "}
                      <span
                        className={
                          holding.updatedWorth - holding.updatedInvestedAmt > 0
                            ? "profit"
                            : "loss"
                        }
                      >
                        (
                        {(
                          ((holding.updatedWorth - holding.updatedInvestedAmt) /
                            holding.updatedInvestedAmt) *
                          100
                        ).toFixed(3)}
                        %)
                      </span>
                    </td>

                    <td>
                      <button
                        className="actions buy"
                        onClick={() => openDialog("Buy", holding)}
                      >
                        Buy
                      </button>
                      <button
                        className="actions sell"
                        onClick={() => openDialog("Sell", holding)}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr
                style={{
                  color: "rgb(58, 81, 127)",
                  textAlign: "center",
                }}
              >
                <td colSpan={6}>
                  <h1>Fetching data...</h1>
                </td>
              </tr>
            )}
          </table>
        </div>
      </div>
      <Dialog
        item={selectedItem}
        action={action}
        onClose={closeDialog}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Portfolio;
