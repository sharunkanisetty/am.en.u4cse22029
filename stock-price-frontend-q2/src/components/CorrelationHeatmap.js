import React, { useState } from 'react';
import axios from 'axios';

function CorrelationHeatmap() {
  const [tickers, setTickers] = useState('NVDA,PYPL');
  const [minutes, setMinutes] = useState(50);
  const [correlation, setCorrelation] = useState(null);
  const [avgPrices, setAvgPrices] = useState({});

  const fetchCorrelation = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/stockcorrelation?ticker=${tickers}&minutes=${minutes}`);
      setCorrelation(res.data.correlation);
      setAvgPrices({
        [res.data.stocks.NVDA.symbol]: res.data.stocks.NVDA.averagePrice.toFixed(2),
        [res.data.stocks.PYPL.symbol]: res.data.stocks.PYPL.averagePrice.toFixed(2),
      });
    } catch (err) {
      alert('Error fetching correlation.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Stock Correlation Heatmap</h2>
      <input
        type="text"
        placeholder="Tickers (e.g. NVDA,PYPL)"
        value={tickers}
        onChange={(e) => setTickers(e.target.value.toUpperCase())}
      />
      <input
        type="number"
        placeholder="Minutes"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
      />
      <button onClick={fetchCorrelation}>Fetch</button>

      {correlation !== null && (
        <div>
          <p>Correlation: <strong>{correlation.toFixed(2)}</strong></p>
          <p>Average Prices:</p>
          <ul>
            {Object.entries(avgPrices).map(([symbol, price]) => (
              <li key={symbol}>{symbol}: ${price}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CorrelationHeatmap;
