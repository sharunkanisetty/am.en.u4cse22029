import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockPage.css';


const StockPage = () => {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [averagePriceData, setAveragePriceData] = useState(null);
  const [minutes, setMinutes] = useState(15); // Default minutes for average price
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticker) return;

    setLoading(true);
    axios
      .get(`http://localhost:3001/stocks/${ticker}`)
      .then((response) => {
        setStockData(response.data);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to fetch stock data');
        setStockData(null);
      })
      .finally(() => setLoading(false));
  }, [ticker]);

  const handleAveragePriceClick = () => {
    if (!ticker) return;

    setLoading(true);
    axios
      .get(`http://localhost:3001/stocks/${ticker}/average?minutes=${minutes}`)
      .then((response) => {
        setAveragePriceData(response.data);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to fetch average price data');
        setAveragePriceData(null);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="stock-page">
      <h1>Stock Tracker</h1>
      
      <div>
        <input
          type="text"
          placeholder="Enter Stock Ticker (e.g., NVDA)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())} // Force uppercase
        />
        <button onClick={handleAveragePriceClick} disabled={loading}>
          {loading ? 'Loading...' : 'Get Average Price'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stockData && (
        <div>
          <h2>Stock Data for {ticker}</h2>
          <pre>{JSON.stringify(stockData, null, 2)}</pre>
        </div>
      )}

      <div>
        <label htmlFor="minutes">Minutes for Average Price:</label>
        <input
          type="number"
          id="minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          min="1"
        />
      </div>

      {averagePriceData && (
        <div>
          <h2>Average Price for {ticker} (Last {minutes} minutes)</h2>
          
          <div>
            <strong>Average Stock Price: </strong>
            <span>{averagePriceData.averageStockPrice}</span>
          </div>

          <div>
            <h3>Price History:</h3>
            <ul>
              {averagePriceData.priceHistory.map((priceItem, index) => (
                <li key={index}>
                  <strong>Price:</strong> {priceItem.price} <br />
                  <strong>Last Updated At:</strong> {new Date(priceItem.lastUpdatedAt).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;
