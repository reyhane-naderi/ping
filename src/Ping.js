import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, FormControl } from 'react-bootstrap';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Ping() {
  const [host, setHost] = useState('');
  const [pingResults, setPingResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', '#8dd1e1'];

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const getPingDataForChart = () => {
    return displayedResults.map((result, index) => ({
      name: `Packet ${index + 1}`,
      time: result.time,
    }));
  };

  const renderLines = () => {
    return displayedResults.map((_, index) => (
      <Line
        key={index}
        type="monotone"
        dataKey="time"
        stroke={colors[index % colors.length]}
        activeDot={{ r: 8 }}
        dot={{ stroke: colors[index % colors.length], strokeWidth: 2 }}
      />
    ));
  };

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

  const handleShareResult = () => {
    const params = new URLSearchParams();
    params.append('host', host);
    params.append('results', JSON.stringify(displayedResults));
    const url = `${window.location.origin}/result?${params.toString()}`;
    setShareUrl(url);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  useEffect(() => {
    if (displayedResults.length === 6) {
      navigateTo('/result');
    }
  }, [displayedResults]);

  return (
    <div className="ping-component">
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
            <Button
              variant="primary"
              onClick={() => {
                handlePing();
                setTimeout(displayNextResult, 1000);
              }}
            >
              Ping
            </Button>
          </div>
          {shareUrl && (
            <>
<div className="col-6">
<InputGroup>
<FormControl readOnly value={shareUrl} />
<Button variant="secondary" onClick={handleCopyUrl}>
Copy
</Button>
</InputGroup>
</div>
</>
)}
<div className="col-2">
{displayedResults.length > 0 && (
<Button variant="secondary" onClick={handleShareResult}>
Share Result
</Button>
)}
</div>
</div>
{displayedResults.length <= 6 && (
<div className="mt-4">
<pre>
<h4>Pinging {host} with 32 bytes of data:</h4>
{displayedResults.map((result, index) => (
<React.Fragment key={index}>
Reply from {result.ReplyFrom}: bytes={result.bytes} time={result.time} TTL={result.ttl}
<br />
</React.Fragment>
))}
</pre>
</div>
)}
{displayedResults.length === 6 && (
<div className="mt-4">
<h4>Ping Chart</h4>
<ResponsiveContainer width="100%" height={300}>
<LineChart data={getPingDataForChart()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Legend />
{renderLines()}
</LineChart>
</ResponsiveContainer>
</div>
)}
</div>
</div>
);
}

export default Ping;