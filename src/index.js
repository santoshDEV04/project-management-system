import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
});
import app from "./app.js"
const port = process.env.PORT


app.listen(port, () =>{
    console.log(`Example app is running on the port : http://localhost:${port}`);
})