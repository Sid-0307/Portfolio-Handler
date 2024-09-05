import React, { useState, useEffect } from "react";
import StockChart from "./StockChart";
import Chart, { CategoryScale } from "chart.js/auto";
import axios from "axios";
import "../App.css";

Chart.register(CategoryScale);

const StockGraph = ({ stockSymbol }) => {
  const apiKey = import.meta.env.VITE_APP_GRAPH_KEY;
  const [error, setError] = useState("");
  const [interval, setInterval] = useState("60min");
  const [currentStockData, setCurrentStockData] = useState(null);

  const fetchStockData = async (symbol, interval) => {
    let url;
    if (interval === "daily") {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    } else {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;
    }

    console.log(url);

    try {
      const data = await axios.get(url).then((response) => response.data);
      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }

      let timeSeries;
      if (interval === "daily") {
        timeSeries = data["Time Series (Daily)"];
      } else {
        const timeSeriesKey = `Time Series (${interval})`;
        timeSeries = data[timeSeriesKey];
      }

      if (!timeSeries) {
        throw new Error("Invalid data received from API");
      }

      const labels = [];
      const prices = [];
      for (const time in timeSeries) {
        labels.push(new Date(time));
        prices.push(parseFloat(timeSeries[time]["1. open"]));
      }
      return { labels: labels.reverse(), prices: prices.reverse() };
    } catch (error) {
      setError("Failed to fetch stock data");
      return null;
    }
  };

  useEffect(() => {
    const getStockData = async () => {
      setCurrentStockData(await fetchStockData(stockSymbol, interval));
    };
    getStockData();
    console.log(stockSymbol, interval);
  }, [stockSymbol, interval]);

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  const intervals = [
    { label: "1 minute", value: "1min" },
    { label: "5 minutes", value: "5min" },
    { label: "15 minutes", value: "15min" },
    { label: "30 minutes", value: "30min" },
    { label: "60 minutes", value: "60min" },
  ];

  return (
    <div>
      <div className="stock-actions">
        <div className="graph-company-interval">
          <h1 className="stock-heading">{stockSymbol}</h1>
          <div className="graph-interval graph-company-interval">
            <label htmlFor="interval">Interval: </label>
            <select
              id="interval"
              value={interval}
              onChange={handleIntervalChange}
            >
              {intervals.map((interval) => (
                <option key={interval.value} value={interval.value}>
                  {interval.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {currentStockData ? (
        <div className="stock-div">
          <StockChart
            stockData={currentStockData}
            symbol={stockSymbol}
            interval={interval}
          />
        </div>
      ) : (
        <div className="not-selected">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default StockGraph;
