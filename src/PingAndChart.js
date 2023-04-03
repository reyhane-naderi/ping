import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import Moment from './Moment';
function PingAndChart() {
  const [host, setHost] = useState('');
  const [pingResults, setPingResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const [displayedIndex, setDisplayedIndex] = useState(0);

  const handleInputChange = (e) => {
    setHost(e.target.value);
  };

  const handlePing = async () => {
    try {
      const response = await fetch(`http://localhost:3030?checkhost=${host}`);
      const data = await response.json();
      setPingResults(data.pingResults);
      setDisplayedIndex(0);
      setDisplayedResults([]);
      displayNextResult();
    } catch (error) {
      console.error('Error fetching ping data:', error);
    }
  };

  const displayNextResult = () => {
    if (displayedIndex < pingResults.length && displayedResults.length < 6) {
      setDisplayedResults((prevResults) => [...prevResults, pingResults[displayedIndex]]);
      setDisplayedIndex((prevIndex) => prevIndex + 1);
      setTimeout(displayNextResult, 1000);
    }
  };

  const getPingDataForChart = () => {
    const data = [];
    let totalPingTime = 0;
    let minPingTime = Infinity;
    let maxPingTime = 0;
    let jitter = 0;

    for (let i = 0; i < displayedResults.length; i++) {
      const result = displayedResults[i];
      const pingTime = result.time;
      const time = moment(result.timestamp);

      data.push({
        name: time.format('HH:mm:ss'),
        pingTime: pingTime,
      });

      totalPingTime += pingTime;

      if (pingTime < minPingTime) {
        minPingTime = pingTime;
      }

      if (pingTime > maxPingTime) {
        maxPingTime = pingTime;
      }

      if (i > 0) {
        jitter += Math.abs(pingTime - displayedResults[i - 1].time);
      }
    }

    const avgPingTime = totalPingTime / displayedResults.length;
    const medianPingTime = calculateMedianPingTime(displayedResults);
    jitter /= displayedResults.length;

    return {
      data: data,
      metrics: {
        min: minPingTime,
        avg: avgPingTime,
        max: maxPingTime,
        median: medianPingTime,
        jitter: jitter,
      },
    };
  };

  const calculateMedianPingTime = (results) => {
    const sortedResults = [...results].sort((a, b) => a.time - b.time);
    const medianIndex = Math.floor(sortedResults.length / 2);
    if (sortedResults.length % 2 === 0) {
      return (sortedResults[medianIndex - 1].time + sortedResults[medianIndex].time) / 2
    } else {
        return sortedResults[medianIndex].time;
      }
    };
  
    const renderLines = () => {
      const lines = [];
      const chartData = getPingDataForChart();
    
      for (const metric in chartData.metrics) {
        if (metric !== 'median' && metric !== 'jitter') {
          lines.push(
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={metric === 'avg' ? '#82ca9d' : '#8884d8'}
            />
          );
        }
      }
      
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {lines}
          </LineChart>
        </ResponsiveContainer>
      );
    };
  
    const Ping2 = () => {
      return (
        <div className="container mt-4">
          <h1>Ping Test</h1>
          <div className="row mt-4">
            <div className="col-4">
              <input
                type="text"
                value={host}
                onChange={handleInputChange}
                placeholder="Enter IP or FQDN"
                className="form-control"
              />
            </div>
            <div className="col-2">
              <Button variant="primary" onClick={handlePing}>
                Ping
              </Button>
            </div>
          </div>
  
          {displayedResults.length > 0 && (
            <div className="mt-4">
              <pre>
                {displayedResults.map((result, index) => (
                  <React.Fragment key={index}>
                    Reply from {result.host}: bytes={result.size} time={result.time} TTL={result.ttl}
                    <br />
                  </React.Fragment>
                ))}
              </pre>
            </div>
          )}
  
          {displayedResults.length === 6 && (
            <div className="mt-4">
              <h4>Ping Chart</h4>
              {renderLines()}
            </div>
          )}
        </div>
      );
    };
  
    return (
      <div>
        <Ping2 />
        <Moment />
      </div>
    );
  }
  
  export default PingAndChart;
  