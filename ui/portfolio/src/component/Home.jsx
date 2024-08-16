import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
  const [currency, setCurrency] = useState("$");
  const [slide, setSlide] = useState(null);
  // const currencies = ["$", "€", "¥", "£", "₹", "₩", "₪", "₫", "₽", "฿"];
  const currencies = ["$", "€", "¥", "£", "₹"];
  const switchDuration = 2000;
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrency(currencies[index]);
      index = (index + 1) % currencies.length;
    }, 400);

    // const timeout = setTimeout(() => {
    //   clearInterval(interval);
    //   setCurrency("$");
    // }, switchDuration);

    // return () => {
    //   clearInterval(interval);
    //   clearTimeout(timeout);
    // };
  }, []);

  const handleButtonClick = (path) => {
    if (path == "/portfolio") {
      setSlide("slide-left");
    } else if (path == "/transaction") {
      setSlide("slide-right");
    }
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  return (
    <div className={`home-div ${slide ? slide : ""}`}>
      <h1 className="home-heading">
        Welcome
        <br />U<span style={{ color: "#008080" }}>{currency}</span>er
      </h1>
      <div className="home-options">
        <button
          className="home-portfolio"
          onClick={() => handleButtonClick("/portfolio")}
        >
          Portfolio
        </button>
        <button
          className="home-explore"
          onClick={() => handleButtonClick("/explore")}
        >
          Explore
        </button>
        <button
          className="home-transaction"
          onClick={() => handleButtonClick("/transaction")}
        >
          Transaction History
        </button>
      </div>
    </div>
  );
};

export default Home;
