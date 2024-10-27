import express from "express";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("New Client connected");
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
