import express from "express"
import "dotenv/config"
import { connectDB } from "./lib/db.js";
import cors from "cors"
import { clerkMiddleware } from '@clerk/express'

const app = express()
const PORT = process.env.PORT
const FRONTEND_URL = process.env.FRONTEND_URL

app.use(cors({origin:FRONTEND_URL,credentials:true}))
app.use(express.json())
app.use(clerkMiddleware())


app.get("/health",(req,res)=> {
    res.status(200).json({
        ok:true
    })
})


app.listen(PORT,async () => {
    await connectDB()
    console.log("Server is up and running on port ",PORT);
})


//await is wait until this promise is resolved
//async function return promise immediately