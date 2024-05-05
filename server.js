//importing several modules and configuring them
const express = require('express')
const { mongoose } = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
dotenv.config()
app.use(morgan("common"))

//setting cors policies to accept any request from remotes
app.use(cors({
    origin: ["https://zesty-gelato-272985.netlify.app"],
    methods: ["GET", "POST", "PATCH", "DELETE", "UPDATE", "PUT"],
    
}))

//data parsing configuration
app.use(express.json({extended : true}))
app.use(express.urlencoded({extended : true}))
app.use(bodyParser.json({limit : '30mb', extended : true}))
app.use(bodyParser.urlencoded({limit : '30mb', extended : true}))

//importing routes
const API_PREFIX = "api";
const auth = require('./routes/auth');
app.use(`/${API_PREFIX}/auth`, auth);

//inherit the .env properties
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

//establishing connection with mongo DB
mongoose.set('strictQuery', true)
mongoose
.connect(MONGO_URI)
.then(() => {
    app.listen(PORT, () => {console.log(`nasa system API listning on port ${PORT}`)})
})
.catch((err) => {console.log(`Error occured - ${err}`);})
