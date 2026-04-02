import app from "./app.js"
import { CONSTANTS } from "./config/constants.js"

const PORT = CONSTANTS.PORT || 7070
app.listen(process.env.PORT , ()=>{
    console.log("Server is running on port " ,PORT)
})