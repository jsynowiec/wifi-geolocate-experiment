// @ts-check
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

function parseAirportAccessPoints(str) {
  const MAC_RE = /(?:[\da-f]{2}[:]{1}){5}[\da-f]{2}/i;

  return str.split('\n').reduce((acc, line) => {
    const mac = line.match(MAC_RE);

    if (!mac) {
      return acc;
    }

    const macStart = line.indexOf(mac[0]);
    const [macAddress, signalStrength, channel] = line
      .substr(macStart)
      .split(/[ ]+/)
      .map(el => el.trim());

    return [
      ...acc,
      {
        ssid: line.substr(0, macStart).trim(),
        macAddress,
        signalStrength: parseInt(signalStrength, 10),
        channel: parseInt(channel, 10),
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
};
