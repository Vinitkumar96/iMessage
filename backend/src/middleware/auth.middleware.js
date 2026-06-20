import { getAuth } from "@clerk/express";
import User from "../models/user.model.js"


export async function protectRoute(req,res,next){
    try{
        const {userId} = getAuth(req)

        if(!userId){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }

        //if user ... we are getting the user from database
        const user = await User.findOne({
            clerkId:userId
        })

        if(!user){
            return res.status(404).json({
                message:"User profile is not synced yet"
            })
        }

        req.user = user

        next()
    }catch(error){
        console.log("Error in protectRoute middleware:",error.message)
    }
}