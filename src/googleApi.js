// @ts-check
const got = require('got');

const {
  google: { geolocation: geoApiKey },
  // @ts-ignore
} = require('./../keys.json');

async function geolocate(wifiAccessPoints) {
  const response = await got(
    'https://www.googleapis.com/geolocation/v1/geolocate',
    {
      method: 'POST',
      json: true,
      query: {
        key: geoApiKey,
      },
      body: {
        wifiAccessPoints,
      },
    },
  );

  return response.body;
}

async function geocode(lat, lng) {
  const response = await got(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {
      json: true,
      query: {
        key: geoApiKey,
        latlng: `${lat},${lng}`,
      },
    },
  );

  return response.body.results;
}

module.exports = {
  geolocate,
  geocode,
};
