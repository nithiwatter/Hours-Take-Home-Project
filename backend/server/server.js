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

server.get("/get-session/:id", (_, res) => {
  const session = mockSessions.find((session) => session.sessionId === id);

  if (session) {
    res.send({
      status: "success",
      data: {
        session,
      },
    });
  } else {
    res.send({
      status: "failure",
    });
  }
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
  console.log(`Connected socket: ${socket.id}`);
  socket.name = "";
  socket.session = { sessionId: "", participants: [] };

  socket.on("join", ({ id, name }, callback) => {
    const session = mockSessions.find((session) => session.sessionId === id);

    if (session) {
      // if the session exists
      // associate the name and session with this socket for easy disconnect notification
      socket.name = name;
      socket.session = session;
      const participants = session.participants;

      // if the user with this name is not in the participants' list
      if (!participants.includes(name)) {
        session.participants.push(name);
        socket.join(id);
        // emit to client the recently-joined socket and the updated session object
        socket.to(id).emit("joined", { session, name });
        console.log(`${name} joining session ${id}`);
      }

      // pass back the requested session to be displayed on client
      callback({
        status: "success",
        description: `Successfully joining session ${id}`,
        data: {
          session,
        },
      });
    } else {
      // notify error to client by calling callback
      callback({
        status: "failure",
        description: "No session belongs to this session id...",
      });
    }
  });

  socket.on("disconnect", () => {
    socket.session.participants = socket.session.participants.filter(
      (name) => name != socket.name
    );
    io.to(socket.session.sessionId).emit("left", { name: socket.name });
    console.log(`Disconnected socket:  ${socket.id}, User: ${socket.name}`);
  });
});

httpServer.listen(process.env.PORT_API, () => {
  console.log(`> Ready on ${process.env.PORT_API}`);
});
