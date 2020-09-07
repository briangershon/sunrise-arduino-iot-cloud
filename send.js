const IotApi = require("@arduino/arduino-iot-client");
const rp = require("request-promise");
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
    const messagePropertyID = process.env.MESSAGE_PROPERTY_ID;

    var thingsAPI = new IotApi.ThingsV2Api(client);
    var opts = {
      deviceId: deviceID,
      ids: [thingID],
      showProperties: true,
    };

    const thingData = await thingsAPI.thingsV2List(opts);
    // console.log(thingData);
    // console.log(thingData[0].properties);
    // console.log(
    //   thingData[0].properties.map((p) => {
    //     return { name: p.name, id: p.id, last_value: p.last_value };
    //   })
    // );

    const now = new Date();
    const propertiesAPI = new IotApi.PropertiesV2Api(client);
    await propertiesAPI.propertiesV2Publish(thingID, messagePropertyID, {
      value: calc().localTimes.sunrise,
    });
    console.log(`Sent sunrise: '${calc().localTimes.sunrise}' to THING: ${process.env.THING_ID}`);
  } catch (err) {
    console.log("ERROR", err);
  }
}

run();
