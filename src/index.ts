import express from "express";
import http from "node:http";
import url from "node:url";
import { WebSocketServer } from "ws";

const httpServer = http.createServer();
const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws, req) => {
  console.log("New Client connected");
  const reqUrl = new URL(req.url!, `http://${req.headers.host}`); // new URL() expects a complete url path instead of elative path; req.url generally gives a relative path. Hence  we use `http://${req.headers.host}` to create a complete url path.
  const username = reqUrl.searchParams.get("username");

  console.log("Username: ", username);
  ws.on("error", () => {
    console.log("Error");
  });
  ws.on("message", (data) => {
    console.log("Recieved:", data.toString());
    // Broadcast the messagge to all clients
    wss.clients.forEach((client) => {
      // Currently broadcasting back to the sender itself too.
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ message: data.toString() }));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client dissconnected");
  });

  ws.send("Something");
});

httpServer.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});
