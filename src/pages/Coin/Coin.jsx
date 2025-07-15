import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams, useNavigate } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from "../../components/LineChart/LineChart";

const Coin = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [coinData, setCoinData] = useState(null);
  const [histoData, setHistoData] = useState(null);
  const { currency } = useContext(CoinContext);

  // ✅ Redirect to Signin if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  // ✅ Fetch coin data
  const fetchCoinData = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-B9QD5cUD6tLMPiGTWdQKueMW',
      },
    };

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      const data = await res.json();
      setCoinData(data);
    } catch (err) {
      console.error('Error fetching coin data:', err);
    }
  };

  // ✅ Fetch historical chart data
  const fetchHistoData = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-B9QD5cUD6tLMPiGTWdQKueMW',
      },
    };

    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
        options
      );
      const data = await res.json();
      setHistoData(data);
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  // ✅ Trigger fetch on mount + currency change
  useEffect(() => {
    fetchCoinData();
    fetchHistoData();
  }, [currency, coinId]);

  if (!coinData || !histoData) {
    return (
      <div className='spinner'>
        <div className='spin'></div>
      </div>
    );
  }

  return (
    <div className='coin'>
      <div className='coin-name'>
        <img src={coinData.image.large} alt='' />
        <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
      </div>

      <div className='coin-chart'>
        <LineChart histoData={histoData} />
      </div>

      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>{currency.symbol}{coinData.market_data.current_price[currency.name].toLocaleString()}</li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>{currency.symbol}{coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>{currency.symbol}{coinData.market_data.high_24h[currency.name].toLocaleString()}</li>
        </ul>
        <ul>
          <li>24 Hour Low</li>
          <li>{currency.symbol}{coinData.market_data.low_24h[currency.name].toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
