const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGO_URI
const connectToMongo = async() => {
    try{
        mongoose.connect(mongoURI)
        console.log("Connected to mongo successfully")
    }
    catch(error){
        console.error("Couldn't Connect to mongo successfully")
    }
}
module.exports = connectToMongo