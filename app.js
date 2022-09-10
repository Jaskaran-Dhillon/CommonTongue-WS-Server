require("dotenv").config();
const { isAuth } = require("./util/helper");
const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: parseInt(process.env.PORT) });

var chatQueue = [];
var connections = {}; //holds the connections so we can quickly send messages and delete onclose

const formatUser = (data, ws) => {
  return {
    id: data.id,
    language: data.language,
    firstName: data.firstName,
    connection: ws,
  };
};

wss.on("connection", function connection(ws) {
  let currentUser;

  ws.on("message", function message(data) {
    try {
      const parsedData = JSON.parse(data);
      const { action } = parsedData;

      if (isAuth(parsedData.token)) {
        if (action === "connect") {
          connections[parsedData.id] = ws;
          const newUser = formatUser(parsedData, ws);
          currentUser = { ...newUser };

          //either connect the user or queue them
          if (chatQueue.length > 0) {
            const user1 = newUser;
            const user2 = chatQueue.pop();
            user1.connection.send(
              JSON.stringify({
                action: "initiate",
                user: {
                  name: user2.firstName,
                  id: user2.id,
                  language: user2.language
                },
              })
            );
            user2.connection.send(
              JSON.stringify({
                action: "initiate",
                user: {
                  name: user1.firstName,
                  id: user1.id,
                  language: user1.language
                },
              })
            );
          } else {
            chatQueue.push(newUser);
            newUser.connection.send(
              JSON.stringify({
                action: "enqueue",
              })
            );
          }
        } else if (action === "message") {
          connections[parsedData.partnerId].send(
            JSON.stringify({
              action: "message",
              message: parsedData.message,
            })
          );
        } else if (action === "close_chat") {
          const { id, partnerId } = parsedData;
          connections[partnerId].close(1000, "partner_left");
          connections[id].close(1000, "close_chat");
          delete connections[parsedData.partnerId];
          delete connections[id];
        } else if (action === "dequeue") {
          const { id } = parsedData;
          connections[id].close(1000, "dequeue");
          delete connections[id];
          chatQueue = chatQueue.filter((user) => {
            user.id !== id;
          });
        }
      } else {
        ws.close(3000, "unauthorized");
      }
    } catch (e) {
      console.log(e);
    }
  });

  ws.on("close", function closeChat(code) {
    console.log(`Closing socket for ${currentUser.id}: ${code}`);
  });

});
