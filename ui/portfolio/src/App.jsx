import { useState } from "react";
import reactLogo from "./assets/react.svg";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  BrowserRouter,
} from "react-router-dom";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./component/Home";
import Portfolio from "./component/Portfolio";
import Transaction from "./component/Transaction";
import Explore from "./component/Explore";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
