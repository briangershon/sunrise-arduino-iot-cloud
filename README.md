# sunrise-arduino-iot-cloud

Sends sunrise, sunset and air quality data for Seattle WA to Arduino IoT Cloud.

An Arduino can then grab this information from IoT Cloud and display it.

Where does the data come from?

- Sunset and sunrise calculated by [suncalc](https://github.com/mourner/suncalc) library. No API needed.
- Air quality data (Ozone and PM2.5) comes from AirNow API <https://docs.airnowapi.org>

Server hosted on Heroku at <https://sunrise-arduino-iot-cloud.herokuapp.com>

Example output from `src/send.js` script:

![Example output from send.js script](update-properties-from-node.png)

## Heroku Setup

Setup heroku CLI on MacOS via `brew tap heroku/brew && brew install heroku`.

`heroku login`

Clone repo then run `heroku git:remote -a sunrise-arduino-iot-cloud` to setup remote to Heroku for deploying.

## Running Locally

Create a local `.env` file by copying `.envSAMPLE` and then updating all the env vars.

    heroku local        # runs local server and loads .env vars

Run command that pushes data to Arduino IoT Cloud:

    heroku local:run npm run send-sunrise

## Heroku Setup

Add your config:

    heroku config:edit

Then add:

```
CLIENT_ID=Arduino_IoT_ClientID_goes_here
CLIENT_SECRET=Arduino_IoT_ClientSecret_goes_here
DEVICE_ID=Arduino_IoT_DeviceID_goes_here
THING_ID=Arduino_IoT_ThingID_goes_here
SUNRISE_PROPERTY_ID=property_id_goes_here
SUNSET_PROPERTY_ID=property_id_goes_here
OZONE_PROPERTY_ID=property_id_goes_here
PM25_PROPERTY_ID=property_id_goes_here
UPDATED_PROPERTY_ID=property_id_goes_here
AIRNOW_API_KEY=key_from_https://docs.airnowapi.org
```

Test sending data from server via:

    heroku run npm run send-sunrise

## Useful Heroku commands

    heroku logs --tail
