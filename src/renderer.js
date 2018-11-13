// @ts-check
const chalk = require('chalk').default;
const logUpdate = require('log-update');
const ora = require('ora');

const ALLOWED_STEPS = ['', 'wifi', 'geolocating', 'geocoding', 'done'];

const state = {
  step: '',
  data: {
    wifiAccessPoints: [],
    accuracy: '',
    location: {},
    url: '',
    address: '',
  },
};

const spinner = new ora();
const getSpinner = x => (x === state.step ? spinner.frame() : '');

function render() {
  const { wifiAccessPoints, location, accuracy, address } = state.data;

  const renderProps = {
    wifiAccessPointsCount:
      wifiAccessPoints.length > 0
        ? chalk.yellow(wifiAccessPoints.length.toFixed(0))
        : '',
    location:
      Object.keys(location).length > 0
        ? chalk.yellow(`${location.lat}, ${location.lng}`)
        : '',
    url:
      location.lat && location.lng
        ? chalk.yellow(
            `https://www.google.com/maps/search/?api=1&query=${location.lat},${
              location.lng
            }`,
          )
        : '',
    accuracy: accuracy ? chalk.yellow(accuracy + chalk.dim('m')) : '',
    address: chalk.yellow(address),
  };

  const output = `
  WiFi networks ${getSpinner('wifi')}${renderProps.wifiAccessPointsCount}
       Location ${getSpinner('geolocating')}${renderProps.location}
       Accuracy ${getSpinner('geolocating')}${renderProps.accuracy}
    Google Maps ${getSpinner('geolocating')}${renderProps.url}
        Address ${getSpinner('geocoding')}${renderProps.address}
`;

  logUpdate(output);
}

function init() {
  setInterval(render, 50);
}

function setStep(s) {
  if (s && ALLOWED_STEPS.includes(s)) {
    state.step = s;

    if (s === 'done') {
      render();
      process.exit();
    }
  }
}

function setState(s) {
  state.data = s;
}

function getState() {
  return state.data;
}

module.exports = {
  init,
  setStep,
  setState,
  getState,
};
