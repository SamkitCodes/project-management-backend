import express from "express";
import cors from "cors";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middlewares

app.use(express.json({ limit: "16kb" })); //Parses JSON data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //Parses data from URl
app.use(express.static("public")); // Serves static files from public folder

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
export default app;
