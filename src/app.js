import express from "express";
import cors from "cors";
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouther from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import { projectTaskRouter, taskRouter } from "./routes/task.routes.js";

import cookieParser from "cookie-parser";

const app = express();

// Middlewares

app.use(express.json({ limit: "16kb" })); //Parses JSON data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //Parses data from URl
app.use(express.static("public")); // Serves static files from public folder
app.use(cookieParser()); // Parses cookies from incoming requests

// CORS middleware
app.use(
  cors({
    // Allowed Origins
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouther);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/projects/:projectId/tasks", projectTaskRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export default app;
