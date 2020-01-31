const express = require("express")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")

const productRoutes = require("./api/routes/products")
const orderRoutes = require("./api/routes/orders")
const userRoutes = require("./api/routes/user")

const port = process.env.PORT || 3000
const mongoose_db_link = "mongodb://localhost:27017/node-rest-shop"

mongoose.connect(mongoose_db_link, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(res=>{
    console.log(`[*SUCCESS*] Mongodb sucessfully connected at ${mongoose_db_link}`)
}).catch(err=>{
    console.log(`[*ERROR*] Mongodb failed to connect at ${mongoose_db_link} => ${err.message}`)
    process.exit()
})

// [**] Middlewares
app.use(morgan("dev"))
app.use("/upload/", express.static("upload/"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(cors())

// [**] Routes
app.use("/products", productRoutes)
app.use("/orders", orderRoutes)
app.use("/user/", userRoutes)


// [**] Error handling
app.use((req, res, next)=>{
    const error = new Error("Not Found!")
    error.status = 404
    next(error)
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})


// [**] Server creation
app.listen(port, err=>{
    if(err){
        console.log("[*ERROR*] Error while creating server => ", err.message)
    }else{
        console.log(`[*SUCCESS*] Server is listening at http://localhost:${port}!`)
    }
})