import express from "express"
import apiRoutes from "./routes/userRoutes.js"
import connectToDatabase from "./config/config.js";

const app = express();

app.use("/api", apiRoutes);

let PORT = 3000 ;

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);    
});

connectToDatabase();
