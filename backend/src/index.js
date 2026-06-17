import express from "express"
import fs from "fs"
import path from "path"
import "dotenv/config"
import { connectDB } from "./lib/db.js";
import cors from "cors"
import { clerkMiddleware } from '@clerk/express'
import job from "./lib/cron.js";

const app = express()
const PORT = process.env.PORT
const FRONTEND_URL = process.env.FRONTEND_URL

const publicDir = path.join(process.cwd(),"public")

app.use(cors({origin:FRONTEND_URL,credentials:true}))
app.use(express.json())
app.use(clerkMiddleware())


app.get("/health",(req,res)=> {
    res.status(200).json({
        ok:true
    })
})

if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir))

    app.get("/{*any}",(req,res,next) => {
        res.sendFile(path.join(publicDir,"index.html"), (err) => next(err))
    })
}

app.listen(PORT,async () => {
    await connectDB()
    console.log("Server is up and running on port ",PORT);

    if(process.env.NODE_ENV === "production"){
        job.start()
    }
})


//await is wait until this promise is resolved
//async function return promise immediately