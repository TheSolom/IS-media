import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

import indexRoutes from "./routes/indexRoutes.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.use(express.json());

app.use(indexRoutes);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    console.log(`message: ${msg}`);

    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => console.log("user disconnected"));
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
