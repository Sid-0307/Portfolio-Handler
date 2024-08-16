import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsSearch = ({ stockSymbol }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "GT637JHD8M47S23C";

  const handleSearch = async () => {
    if (!stockSymbol) {
      alert("Please enter a stock symbol.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("News: ", stockSymbol);
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: "NEWS_SENTIMENT",
          tickers: stockSymbol,
          apikey: apiKey,
        },
      });

      setNews(response.data.feed.slice(0, 10) || []);
    } catch (err) {
      setError("Failed to fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [stockSymbol]);

  return (
    <div className="news-container-over">
      <h1 className="news-title">Stock News</h1>

      {/* {error && <p className='news-error'>{error}</p>} */}

      <div className="news-Container">
        {news.length > 0 ? (
          news.map((article, index) => (
            <div key={index} className="article-Item">
              <a href={article.url} target="_blank" className="article-Link">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-snippet">{article.summary}</p>
              </a>
            </div>
          ))
        ) : (
          <p className="article-title">No news articles found.</p>
        )}
      </div>
    </div>
  );
};

export default NewsSearch;
