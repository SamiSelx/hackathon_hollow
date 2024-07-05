const express = require('express');   
require('dotenv').config();

const app=require('./configs/connectDB');  //this will connect the db and the server 
app.use(express.json());

app.use('/api',require('./routers/fileRouter')); 







