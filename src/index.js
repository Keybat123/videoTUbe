import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import {app} from "./app.js"

dotenv.config({path: "./.env"})
//database connection
mongoose
.connect(process.env.MONGODB)
.then(()=> console.log("Database connected sucessfully."))
.catch(e => console.log(e))


app.listen(process.env.PORT,()=>{
    console.log(`App is listening on PORT ${process.env.PORT}`)
})



