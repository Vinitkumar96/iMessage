import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, { cors: { origin: [allowedOrigin] } });

const userSocketMap = new Map();

function getReceiverSocketIds(userId) {
  return Array.from(userSocketMap.get(String(userId)) ?? []);
}

function getOnlineUserIds() {
  return Array.from(userSocketMap.keys());
}

function addUserSocket(userId, socketId) {
  const normalizedUserId = String(userId);
  const socketIds = userSocketMap.get(normalizedUserId) ?? new Set();
  socketIds.add(socketId);
  userSocketMap.set(normalizedUserId, socketIds);
}

function removeUserSocket(userId, socketId) {
  const normalizedUserId = String(userId);
  const socketIds = userSocketMap.get(normalizedUserId);
  if (!socketIds) return;

  socketIds.delete(socketId);

  if (socketIds.size === 0) {
    userSocketMap.delete(normalizedUserId);
  }
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) addUserSocket(userId, socket.id);

  io.emit("getOnlineUsers", getOnlineUserIds());

  socket.on("disconnect", () => {
    if (userId) removeUserSocket(userId, socket.id);
    io.emit("getOnlineUsers", getOnlineUserIds());
  });
});

export { app, server, io, getReceiverSocketIds };
