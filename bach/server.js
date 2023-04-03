

// const express = require('express');
// const ping = require('ping');
// const cors = require('cors');

// const app = express();
// app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }));
// app.use(express.json());

// app.get('/', async (req, res) => {
//   // Check ping
//   const host = req.query.checkhost || '8.8.8.8';

//   // Ping options
//   const pingOptions = {
//     count: 8,
//     packetSize: '32',
//   };

//   // Ping the host
//   const pingResults = await ping.promise.probe(host, pingOptions);

//   const pingSummary = pingResults.output;

//   console.log({ pingSummary: pingSummary });

//   const formattedResponse = {
//     ReplyFrom: pingResults.host,
//     PacketsSent: pingResults.transmitted,
//     PacketsReceived: pingResults.alive,
//     PacketsLost: pingResults.transmitted - pingResults.alive,
//     Minimum: pingResults.min !== 'unknown' ? `${pingResults.min} ms` : 'unknown',
//     Maximum: pingResults.max !== 'unknown' ? `${pingResults.max} ms` : 'unknown',
//     Average: pingResults.avg !== 'unknown' ? `${pingResults.avg} ms` : 'unknown',
//     PacketTransmitted: pingResults.transmitted,
//     PacketReceived: pingResults.alive,
//     bytes: pingOptions.packetSize,
//     time: pingResults.time,
//   };

//   res.json({
//     pingResults: formattedResponse,
//     pingSummary: pingSummary,
//   });
// });

// app.listen(3030, () => {
//   console.log('Server is running on port 3030');
// });


// const express = require('express');
// const ping = require('ping');
// const cors = require('cors');

// const app = express();
// app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }));
// app.use(express.json());

// app.get('/', async (req, res) => {
//   const host = req.query.checkhost || '8.8.8.8';
//   const count = 4;

//   let results = [];

//   const pingHost = async (count) => {
//     if (count === 0) {
//       res.json({ pingResults: results });
//       return;
//     }

//     try {
//       const pingResult = await ping.promise.probe(host);
//       const pingSummary = pingResult.output;

//       const formattedResponse = {
//         ReplyFrom: pingResult.host,
//         PacketsSent: pingResult.transmitted,
//         PacketsReceived: pingResult.alive,
//         PacketsLost: pingResult.transmitted - pingResult.alive,
//         Minimum: pingResult.min !== 'unknown' ? `${pingResult.min} ms` : 'unknown',
//         Maximum: pingResult.max !== 'unknown' ? `${pingResult.max} ms` : 'unknown',
//         Average: pingResult.avg !== 'unknown' ? `${pingResult.avg} ms` : 'unknown',
//         bytes: 32,
//         time: `${pingResult.time} ms`,
//         ttl: pingResult.output.match(/ttl=(\d+)/i)[1],
//         pingSummary: pingSummary,
//       };

//       results.push(formattedResponse);
//     } catch (error) {
//       results.push({
//         replyFrom: host,
//         error: error.toString(),
//       });
//     }

//     pingHost(count - 1);
//   };

//   await pingHost(count);
// });

// app.listen(3030, () => {
//   console.log('Server is running on port 3030');
// });
const express = require('express');
const ping = require('ping');
const cors = require('cors');

const app = express();
app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }));
app.use(express.json());

app.get('/', async (req, res) => {
  const host = req.query.checkhost || '8.8.8.8';
  const count = 6;

  let results = [];

  const pingHost = async (count) => {
    if (count === 0) {
      res.json({ pingResults: results });
      return;
    }

    try {
      const pingResult = await ping.promise.probe(host);
      const pingSummary = pingResult.output;

      const formattedResponse = {
        ReplyFrom: pingResult.host,
        bytes: 32,
        time: `${pingResult.time} ms`,
        ttl: pingResult.output.match(/ttl=(\d+)/i)[1],
        pingSummary: pingSummary,
      };

      results.push(formattedResponse);
    } catch (error) {
      results.push({
        replyFrom: host,
        error: error.toString(),
      });
    }

    pingHost(count - 1);
  };

  await pingHost(count);
});

app.listen(3030, () => {
  console.log('Server is running on port 3030');
});
