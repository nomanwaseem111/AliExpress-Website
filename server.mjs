import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 3000


const productSchema = new mongoose.Schema({
    productName: String,
    productPrice : Number,
    shopName : String,
    numberOfSale : Number,
    productRating : Number,
    isFreeShipping : Boolean,
    currencyCode : String,
    createdOn : {type : Date , default : Date.now}
  });

  const productModel = mongoose.model('product', productSchema);


  app.get('/products', async (req,res) => {

    
       let result = await productModel
       .find({})
       .exec()
       .catch(e => {
          console.log("db error :" , e);
          res.status(500).send({message : "db error getting saved products"})
          return;    
        })
        console.log("data Saved :", result);
        res.status(201).send({data : result})
    })

app.post('/product', (req, res) => {

     let body = req.body


     if(!body.productName || !body.productPrice || !body.shopName || !body.numberOfSale || !body.productRating || !body.isFreeShipping || !body.currencyCode){

         res.status(400).send(`required field missing, all fields are required
         
         productName,
         productPrice,
         shopName,
         numberOfSale,
         productRating,
         isFreeShipping,
         currencyCode
         `)
         return;
     }

  
      let result = productModel.create({
 
         productName : body.productName,
         productPrice : body.productPrice,
        shopName : body.shopName,
         numberOfSale : body.numberOfSale,
         productRating : body.productRating,
         isFreeShipping : body.isFreeShipping,
         currencyCode : body.currencyCode
       }).catch(e => {

         console.log("db error :",e);
         res.status(500).send({message : "db error product is not saved in database"})
         return;
       })
        console.log("product Saved :", result);
        res.status(201).send({message : "Product is Saved in Database"})




})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


let dbURI = "mongodb+srv://abc:abc@cluster0.ko1vloy.mongodb.net/aliexpressdatabase?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////