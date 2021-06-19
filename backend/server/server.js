const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

var mockSessions = [
  { sessionId: "abc", participants: [] },
  { sessionId: "def", participants: [] },
  { sessionId: "ghi", participants: [] },
  { sessionId: "jkl", participants: [] },
];

// load env variables
require("dotenv").config();

const server = express();
server.use(cors({ origin: process.env.URL_APP }));
server.use(express.json());

server.get("/get-sessions", (_, res) => {
  res.send({
    status: "success",
    data: { sessions: mockSessions },
  });
});

server.get("/create-session", (_, res) => {
  const newSessionId = uuidv4();
  mockSessions.push({ sessionId: newSessionId, participants: [] });

  res.send({
    status: "success",
    data: {
      sessionId: newSessionId,
    },
  });
});

server.get("/clear-sessions", (_, res) => {
  mockSessions = [];
  res.send({ status: "success" });
});

const httpServer = http.createServer(server);
io = socketio(httpServer, {
  cors: {
    origin: process.env.URL_APP,
  },
});

io.on("connect", (socket) => {
  console.log(`Connected socket:  ${socket.id}`);

  socket.on("join", ({ id, name }) => {
    const session = mockSessions.find((session) => session.sessionId === id);

    // if the session exists
    if (session) {
      const participants = session.participants;

      // if the user with this name is not in the participants' list
      if (!participants.includes(name)) {
        session.participants.push(name);
        console.log(`${name} joining session ${id}`);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected socket:  ${socket.id}`);
  });
});

httpServer.listen(process.env.PORT_API, () => {
  console.log(`> Ready on ${process.env.PORT_API}`);
});
