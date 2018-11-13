// @ts-check
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

function parseAirportAccessPoints(str) {
  const MAC_RE = /(?:[\da-f]{2}[:]{1}){5}[\da-f]{2}/;

  return str.split('\n').reduce((acc, line) => {
    const mac = line.match(MAC_RE);

    if (!mac) {
      return acc;
    }

    const macStart = line.indexOf(mac[0]);
    const elements = line.substr(macStart).split(/[ ]+/);

    return [
      ...acc,
      {
        ssid: line.substr(0, macStart).trim(),
        macAddress: elements[0].trim(),
        signalStrength: parseInt(elements[1].trim(), 10),
        channel: parseInt(elements[2].trim(), 10),
      },
    ];
  }, []);
}

async function getwifiAccessPoints() {
  const { stdout } = await execFile(
    '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport',
    ['-s'],
  );
  return parseAirportAccessPoints(stdout);
}

module.exports = {
  getwifiAccessPoints,
}