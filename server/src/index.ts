import MongoStore from "connect-mongo";
import cors from "cors";
import express from "express";
import expressSession from "express-session";
import sharedSession from "express-socket.io-session";
import http from "http";
import mongoose from "mongoose";
import logger from "morgan";
import { Server, Socket } from "socket.io";
import UserEvents from "./events/User";
import "./models/Friend";
import notificationRoutes from "./routes/notificationRoutes";
import userRoutes from "./routes/userRoutes";
import { EventClassConstructor } from "./types";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URL = "mongodb://localhost:27017/better-chat-app";
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URL,
});

const session = expressSession({
  secret: "TEST",
  name: "qid",
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    sameSite: "lax",
    secure: false,
    httpOnly: true,
  },
  store: sessionStore,
});

const whitelist = ["http://localhost:3000"];

const corsConfig: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();
app.use(logger("dev"));
app.use(cors(corsConfig));

app.use(session);
app.use(express.json());
app.get("/", (_, res) => {
  res.send("Working");
});

app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationRoutes);

const server = http.createServer(app);

/**
 *
 * SOCKET IMPLEMENTATION
 *
 */

const io = new Server(server, { cors: corsConfig });

// Attaching io to express app
app.io = io;
app.sessionQIDtoSocketMap = {};
io.use(sharedSession(session, { autoSave: true }));
// io.use(socketIoLogger());
io.on("connection", (socket: Socket) => {
  // console.log(socket.id, "connected");
  // console.log("Socket Handshake: ", (socket.handshake as any).session.qid);
  app.sessionQIDtoSocketMap[(socket.handshake as any).session.qid] = socket.id;
  const eventClasses: Record<string, EventClassConstructor> = {
    user: UserEvents,
  };

  for (let eventClass in eventClasses) {
    const eventClassInit = new eventClasses[eventClass](socket, app, io);
    const events = eventClassInit.events;
    for (let event in events) {
      const finalEventName = `${eventClassInit.name}:${event}`;
      console.log(finalEventName);
      socket.on(finalEventName, events[event]);
    }
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
