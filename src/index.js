// require('dotenv').config()
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "/.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`SERVER VIS RUNNIG O PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO DB CONECTION FAILED ", error);
  });

/*

import express from 'express'
const app = express()

;(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)    
       app.on("error",(error)=>{
        console.log("Some error for tailking",error);
        throw error
       })    
       app.listen(process.env.PORT,()=>{
        console.log(`App is listining on ${process.env.PORT}` );
       })
    } catch (error) {
        console.log("error",error);
    }
})();
*/
