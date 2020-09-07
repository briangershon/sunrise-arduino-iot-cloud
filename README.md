# sunrise-arduino-iot-cloud

Send sunrise time to Arduino IoT Cloud.

Updates `message` property in IoT Cloud for DEVICE_ID and THING_ID.

An Arduino can then grab this information and display it.

Hosted on Heroku at <https://sunrise-arduino-iot-cloud.herokuapp.com>

## Running Locally

Create a local `.env` file with following environment vars to test locally.

    heroku local        # runs local server and loads .env vars

Run command that pushes sunrise to Arduino IoT Cloud:

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
MESSAGE_PROPERTY_ID=Arduino_IoT_MessagePropertyID_goes_here
```

## Useful Heroku commands

    heroku logs --tail