const { exec } = require("child_process");

const ping = (ip, options) => {
  let command = `ping ${ip}`;
  if (options) {
    if (options.count) command += ` -c ${options.count}`;
    if (options.interval) command += ` -i ${options.interval}`;
    if (options.packetSize) command += ` -s ${options.packetSize}`;
    if (options.timeout) command += ` -W ${options.timeout}`;
    if (options.ttl) command += ` -t ${options.ttl}`;
    if (options.ipv6) command += ` -6`;
    if (options.doNotFragment) command += ` -M do`;
    if (options.sourceAddress) command += ` -S ${options.sourceAddress}`;
    if (options.verbose) command += ` -v`;
  }
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Example usage
ping("google.com", {
  count: 5,
  packetSize: 64,
  verbose: true
})
  .then((response) => {
    console.log("Ping successful!\n\n" + response);
  })
  .catch((error) => {
    console.error("Ping failed.\n" + error);
  });
