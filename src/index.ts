import express from "express";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Someone joined");
  ws.on("error", () => {
    console.log("Error");
  });
  ws.on("message", (data) => {
    console.log("Message:", data.toString());
    ws.send(`Your message: ${data}`);
  });
  ws.send("Something");
});
