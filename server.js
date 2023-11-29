const express = require('express')
const app  = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());


require('./config/database')

const router = require('./routes/route');
const productrouter = require('./routes/productroute')
const blogrouter = require('./routes/blogroute')
const Pcategoryroute = require('./routes/Pcategoryroute')
const blogcategoryroute = require('./routes/blogcategoryroute')
const brandroute = require('./routes/brandroute') 
const coupon = require('./routes/couponroute')


// const { notFound, errorhandler } = require('./middleware/errorhandlers');

// app.use(notFound);
// app.use(errorhandler);

app.use('/', router)
app.use('/product',productrouter)
app.use('/blog',blogrouter);
app.use('/prodcategory',Pcategoryroute)
app.use('/blogcategory',blogcategoryroute)
app.use('/brand',brandroute)
app.use('/coupon',coupon)



app.listen(2000,()=>{
    console.log('server running on http://localhost:2000 ') 
});