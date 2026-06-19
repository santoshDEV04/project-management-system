import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
});
import app from "./app.js"
import connectDB from "./db/index.js"
import dns from "dns"

dns.setServers(["8.8.8.8", "8.8.4.4"])

const port = process.env.PORT


connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Example app is listening on port http://localhost:${port}`);
    })
})
.catch((err) => {
    console.error("MongoDB connection error", err)
    process.exit(1)
})