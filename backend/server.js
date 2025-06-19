// server.js
import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import { socketSetup } from './server/socket/socket.js'; // ✅ correct

import dotenv from 'dotenv'
import userRouter from './server/routes/user.route.js'
import dbConnect from './server/database/dbConnect.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cloudconnection from './server/config/Cloudniary.js'
import cors from 'cors'
import messageRouter from './server/routes/message.route.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

//! middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

//! test route
app.get("/", (req, res) => {
  res.send("API is running...")
})

//! api endpoints
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

//! server + socket setup
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
})

socketSetup(io)

//! SERVER START
server.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`)
  dbConnect()
  cloudconnection()
})
