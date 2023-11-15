const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT
connectToMongo();

app.use(cors())
// Available Routes
app.get('/', (req, res) =>{
    res.send('Hello World')
})

app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, ()=>{
    console.log(`iNoteBook backend listening at http://localhost:${port}`)
})