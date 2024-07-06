const mongoose = require("mongoose");

//function to connect to the database
const connectDb = async () => {
   try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    //console log to make sure the connection to the database is established
    console.log("Database connected :" , 
        connect.connection.host, 
        connect.connection.name);
     
   } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
   }
}

module.exports = connectDb;