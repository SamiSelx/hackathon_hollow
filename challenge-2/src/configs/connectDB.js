const mongoose = require('mongoose');
const PORT= process.env.PORT||3000;
const express=require('express');
const app=express()

//should connect to data base first then run the server
mongoose.connect(process.env.DATABASE_MONGO)
    .then(() => {
        console.log('Connected to DB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to DB:", err);
    });

module.exports=app