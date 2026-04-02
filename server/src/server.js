import app from "./app.js"
import { CONSTANTS } from "./config/constants.js"
import { connectDB } from "./config/db.js"

const PORT = CONSTANTS.PORT || 7070
connectDB()
.then(()=>{
    app.listen(PORT , ()=>{
        console.log(`Server is running on port  , ${PORT}`)
    })
})