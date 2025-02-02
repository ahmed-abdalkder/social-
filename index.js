import path from 'path'
 import dotenv from 'dotenv'
 dotenv.config({path:path.resolve('config/.env')})
import express from 'express'
import connectionDB from './db/connectiondb.js'
import Userrouter from './src/modules/Users/User.routes.js'
import Postrouter from './src/modules/Posts/Postroutes.js'
import messagerouter from './src/modules/Messages/Message.routes.js'
 

const app = express()
const port = process.env.PORT

app.use(express.json())

connectionDB()

app.use("/users", Userrouter)

app.use("/posts",  Postrouter)

app.use("/messages",messagerouter)


app.use('*', (req, res) => res.json('Hello World !'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))