import express from "express"
import cors from "cors"

const app = express()

// basic configuration
app.use(express.json)
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

// cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:8000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}))

app.get("/", (req, res) => {
    res.send("Welcome to basecampy!")
})

app.get("/instagram", (req, res) => {
    res.send("This is instagram page.")
})

export default app;