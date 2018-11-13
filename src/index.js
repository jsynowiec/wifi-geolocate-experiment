// @ts-check

const _omit = require('lodash.omit');

const { geocode, geolocate } = require('./googleApi');
const { getwifiAccessPoints } = require('./wifi-src/macOS')
const { init, setState, setStep, getState } = require('./renderer');

(async () => {
  init();

  setStep('wifi');
  const wifiAccessPoints = await getwifiAccessPoints();
  setState({
    ...getState(),
    wifiAccessPoints,
  });

  setStep('geolocating');
  const { location, accuracy } = await geolocate(
    wifiAccessPoints.reduce((acc, wifi) => [...acc, _omit(wifi, ['ssid'])], []),
  );
  setState({
    ...getState(),
    location,
    accuracy,
  });

  setStep('geocoding');
  const address = await geocode(location.lat, location.lng);
  setState({
    ...getState(),
    address: address[0].formatted_address,
  });

  setStep('done');
})();