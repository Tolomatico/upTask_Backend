import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./config/db";
import projectRoutes from "./routes/ProjectRoutes"
import cors from "cors"
import morgan from "morgan";
import { corsConfig } from "./config/cors";
import authRoutes from "./routes/authRoutes"

dotenv.config()
const app=express()

    // midleware //
app.use(express.json())
app.use(cors(corsConfig))
    // login //
app.use(morgan("dev"))   
    // DB Connection //
connectDB()
    // Routes //
app.use("/api/projects",projectRoutes)
app.use("/api/auth",authRoutes)


export default app