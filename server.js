const express = require('express')
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

const { connectMongoDb } = require("./db")

//Connect mongoose db cloud
connectMongoDb(process.env.MONGOURL).then(()=>{
    console.log("MongoDB connected!");
});

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes.js');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate',candidateRoutes);



app.listen(PORT, ()=>{
    console.log('listening on port 5000');
})