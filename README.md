# CommonTongue  WS Server
This is the WebSocket server for the CommonTongue application. Handles user communication.

## Local Development
Steps:\
1.) Clone the repository\
2.) Install the node packages with `npm install`\
3.) Create a .env in the root directory, add the following variables:
- `SECRET`="Some long complicated string (must be same as the one for the back-end)"
- `PORT`="Any port other than the one the client and server side code is running on"

## Deployment
Steps:\
1.) Connect repository to hosting service \
2.) Add the `SECRET` env var.

### WS Server URL: https://commontongue-ws-server-production.up.railway.app/
