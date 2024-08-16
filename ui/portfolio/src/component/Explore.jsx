import React, { useState } from "react";
import Navbar from "./Navbar";
import StockGraph from "./StockGraph";
import News from "./News";
import Dialog from "./Dialog";
import axios from "axios";

const Explore = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [hasPressed, setHasPressed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState(null);
  const [action, setAction] = useState("");

  const handleSymbolChange = (e) => {
    setHasPressed(false);
    setStockSymbol(e.target.value);
  };

  const getStockData = async () => {
    setHasPressed(true);
    try {
      const newData = await axios
        .get(
          `http://neilapi.neueda.com/API/StockFeed/GetStockPricesForSymbol/${stockSymbol.toLowerCase()}`
          // `https://financialmodelingprep.com/api/v3/quote/${stockSymbol.toUpperCase()}?apikey=C6lESxodopbdnyTOl9Fud6w9sixrWZMD`
        )
        .then((res) => res.data)
        .then((res) => res[0]);
      const item = {
        symbol: stockSymbol,
        name: newData.companyName,
        // name: newData.name,
        currentPrice: parseFloat(newData.price).toFixed(2),
      };
      setDialogItem(item);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const handleBuyClick = () => {
    setAction("Buy");
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setDialogItem(null);
  };

  return (
    <div>
      <Navbar />
      <div className="explore">
        <div className="search">
          <input
            id="tickerSymbol"
            name="ticker"
            type="text"
            placeholder="Search Stock"
            className="searchbar"
            value={stockSymbol}
            onChange={handleSymbolChange}
          />
          <button className="stock-btn" onClick={getStockData}>
            Fetch Data
          </button>
        </div>
        {stockSymbol !== "" && hasPressed ? (
          <div>
            <div className="content">
              <div className="chart">
                <StockGraph stockSymbol={stockSymbol} />
                <button className="chart-buy" onClick={handleBuyClick}>
                  Buy
                </button>
              </div>
            </div>
            <div className="ooga">
              <News stockSymbol={stockSymbol} />
            </div>
          </div>
        ) : null}
      </div>
      {showDialog && dialogItem && (
        <Dialog item={dialogItem} action={action} onClose={handleDialogClose} />
      )}
    </div>
  );
};

export default Explore;
