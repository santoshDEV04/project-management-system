import express from "express"
import cors from "cors"

const app = express()

// basic configuration
app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

// cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:8000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}))


// import the routes

import healthCheckRouter from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"

app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authRouter)

app.get("/", (req, res) => {
    res.send("Welcome to basecampy!")
})


export default app;