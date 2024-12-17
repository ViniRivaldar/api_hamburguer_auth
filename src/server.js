import dotenv from "dotenv";

import app from "./app.js";

dotenv.config()
const PORT = process.env.PORT
const URL = process.env.URL

app.listen(PORT,()=>{
    console.log(`Server Running: ${URL}${PORT}/`)
})