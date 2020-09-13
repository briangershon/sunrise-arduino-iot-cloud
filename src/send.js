const IotApi = require("@arduino/arduino-iot-client");
const rp = require("request-promise");
const got = require('got');
const { calc } = require('./library');

async function getToken() {
  const options = {
    method: "POST",
    url: "https://api2.arduino.cc/iot/v1/clients/token",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    json: true,
    form: {
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: "https://api2.arduino.cc/iot",
    },
  };

  try {
    const response = await rp(options);
    return response["access_token"];
  } catch (error) {
    console.error("Failed getting an access token: " + error);
  }
}

async function run() {
  const client = IotApi.ApiClient.instance;
  const oauth2 = client.authentications["oauth2"];
  oauth2.accessToken = await getToken();

  try {
    const api = new IotApi.DevicesV2Api(client);
    const devices = await api.devicesV2List();
    // console.log(devices);

    const deviceID = process.env.DEVICE_ID;
    const thingID = process.env.THING_ID;

    var thingsAPI = new IotApi.ThingsV2Api(client);
    var opts = {
      deviceId: deviceID,
      ids: [thingID],
      showProperties: true,
    };

    const thingData = await thingsAPI.thingsV2List(opts);
    // console.log(thingData);
    // console.log(thingData[0].properties);
    console.log(
      thingData[0].properties.map((p) => {
        return { name: p.name, id: p.id, last_value: p.last_value };
      })
    );

    const propertiesAPI = new IotApi.PropertiesV2Api(client);

    await propertiesAPI.propertiesV2Publish(thingID, process.env.SUNRISE_PROPERTY_ID, {
      value: calc().localTimes.sunrise,
    });
    console.log(`Set sunrise to '${calc().localTimes.sunrise}' for ${process.env.THING_ID} thing.`);

    await propertiesAPI.propertiesV2Publish(thingID, process.env.SUNSET_PROPERTY_ID, {
      value: calc().localTimes.sunset,
    });
    console.log(`Set sunset to '${calc().localTimes.sunset}' for ${process.env.THING_ID} thing.`);

    const nowFormatted = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    await propertiesAPI.propertiesV2Publish(thingID, process.env.UPDATED_PROPERTY_ID, {
      value: nowFormatted,
    });
    console.log(`Set updated to '${nowFormatted}' for ${process.env.THING_ID} thing.`);

    const airQuality = await getAirQualityJSON();
    // console.log(airQuality);
    const ozoneCategory = airQuality.filter((v) => { return v.ParameterName == 'O3'})[0].Category.Number;
    const pm25Category = airQuality.filter((v) => { return v.ParameterName == 'PM2.5'})[0].Category.Number;

    await propertiesAPI.propertiesV2Publish(thingID, process.env.OZONE_PROPERTY_ID, {
      value: ozoneCategory,
    });
    console.log(`Set ozoneCategory to ${ozoneCategory} for ${process.env.THING_ID} thing.`);

    await propertiesAPI.propertiesV2Publish(thingID, process.env.PM25_PROPERTY_ID, {
      value: pm25Category,
    });
    console.log(`Set pm25Category to ${pm25Category} for ${process.env.THING_ID} thing.`);

  } catch (err) {
    console.log("ERROR", err);
  }
}

async function getAirQualityJSON() {
  return got('http://www.airnowapi.org/aq/observation/zipCode/current/', {
    searchParams: {
      zipCode: '98104',
      format: 'application/json',
      distance: 25,
      API_KEY: process.env.AIRNOW_API_KEY,
    }
  }).json();
}

run();
