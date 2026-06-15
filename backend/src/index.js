import express from "express"
import "dotenv/config"

const app = express()
const PORT = process.env.PORT
console.log(process.env.lmao_emergency);


app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`);
})