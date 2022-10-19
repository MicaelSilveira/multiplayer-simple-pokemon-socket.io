import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
const app = express();
app.use("/public", express.static("public", {}));

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = http.createServer(app);
const io = new Server(server);

let users: any = {};
io.on("connection", (socket) => {
  console.log("users: ", users);
  console.log(JSON.stringify({ user_connect: socket.id }));
  users[socket.id] = { id: socket.id, x: 0, y: 0 };

  socket.on("disconnect", () => {
    console.log(JSON.stringify({ user_disconnect: socket.id }));
    users[socket.id] = undefined;
  });

  socket.on("ON_USER_MOVE", (newPosition) => {
    const user = users[socket.id];
    user.x = user.x + (newPosition.move.x || 0);
    user.y = user.y + (newPosition.move.y || 0);
    io.emit("ON_USER_UPDATE", JSON.stringify(users));
  });
});

server.listen(3000, () => {
  console.log(`server is running in localhost:3000`);
});
