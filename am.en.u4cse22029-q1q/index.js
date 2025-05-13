const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

const apiBaseUrl = 'http://20.244.56.144/evaluation-service/stocks/';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDY0MDY5LCJpYXQiOjE3NDcwNjM3NjksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjFkNmEzOWFmLTc4MDctNDVlNy05NmRkLTMyMzU3MGU3NjI0OSIsInN1YiI6InNoYXJ1bmthbmlzZXR0eTEyM0BnbWFpbC5jb20ifSwiZW1haWwiOiJzaGFydW5rYW5pc2V0dHkxMjNAZ21haWwuY29tIiwibmFtZSI6InNoYXJ1biBrYW5pc2V0dHkiLCJyb2xsTm8iOiJhbS5lbi51NGNzZTIyMDI5IiwiYWNjZXNzQ29kZSI6IlN3dXVLRSIsImNsaWVudElEIjoiMWQ2YTM5YWYtNzgwNy00NWU3LTk2ZGQtMzIzNTcwZTc2MjQ5IiwiY2xpZW50U2VjcmV0Ijoid0trc1ptVWdRSmpDQk56RSJ9.Dj1VfVTcfkEte0OQNG2LtM4gO0v9GBvTDgLe5Vidxtg';
app.use(express.json());

app.use(cors());

app.get('/stocks/:ticker', async (req, res, next) => {
  const ticker = req.params.ticker;
  try {
    const response = await axios.get(`${apiBaseUrl}${ticker}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      timeout: 5000, 
    });
    res.json(response.data);
  } catch (error) {
    next(error); 
  }
});

app.get('/stocks/:ticker/average', async (req, res, next) => {
  const ticker = req.params.ticker;
  const minutes = req.query.minutes;

  if (!minutes || isNaN(minutes)) {
    return res.status(400).json({ error: 'Please provide a valid "minutes" query parameter.' });
  }

  try {
    const response = await axios.get(`${apiBaseUrl}${ticker}?minutes=${minutes}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      timeout: 5000, 
    });

    const priceHistory = response.data;

    if (Array.isArray(priceHistory) && priceHistory.length > 0) {
      const sum = priceHistory.reduce((acc, curr) => acc + curr.price, 0);
      const averagePrice = sum / priceHistory.length;

      res.json({
        averageStockPrice: averagePrice,
        priceHistory: priceHistory,
      });
    } else {
      res.status(404).json({ error: 'No price data available for this stock' });
    }
  } catch (error) {
    next(error); 
  }
});

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.response && err.response.status === 401) {
    return res.status(401).json({ error: 'Unauthorized: Token might be expired or invalid' });
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
