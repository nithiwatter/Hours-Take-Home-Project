const express = require("express");
const http = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const mockSessionIds = ["abc", "def", "ghi", "jkl"];

// load env variables
require("dotenv").config();

const server = express();
server.use(cors({ origin: process.env.URL_APP }));
server.use(express.json());

server.get("/get-sessions", (_, res) => {
  res.send({
    status: "success",
    data: { sessionIds: mockSessionIds },
  });
});

server.get("/create-session", (_, res) => {
  mockSessionIds.push(uuidv4());
  res.send({ status: "success" });
});

const httpServer = http.createServer(server);

httpServer.listen(process.env.PORT_API, () => {
  console.log(`> Ready on ${process.env.PORT_API}`);
});
