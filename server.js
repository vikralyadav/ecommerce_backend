const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
dotenv.config();

const connect = require('./db/db'); 
connect();


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true}))




PORT=process.env.PORT || 5001

const userRoutes = require('./routes/user.routes')
const cartRoutes = require('./routes/cart.routes')




app.use('/user', userRoutes)
app.use('/cart', cartRoutes)

app.listen(PORT,()=>{
    console.log('listening on port',{PORT})
})