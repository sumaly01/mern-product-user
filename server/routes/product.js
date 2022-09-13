const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const multer= require('multer')//for uploading files
const { auth } = require("../middleware/auth");


var storage= multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'uploads/')//folder
    },
    filename:(req,file,cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)//1323_photo.jpg
    },
    fileFilter:(req,file,cb)=> {
        const ext = path.extname(file.originalname)
        if(ext !== '.jpg' || ext !== '.png'){
            return cb(res.status(400).end('only jpg, png are allowed'),false)
        }
        cb(null,true)
    }
})

var upload= multer({storage: storage}). single("file")

//=================================
//            Product
//=================================

router.post("/uploadImage", auth, (req, res) => {
  
    //after getting the iamge from the front end ko FileUpload
    //we need to save i node server

    //Multer libary for saving photos 
    //success: true or false anusar front end ko FileUpload ma jancha
    upload(req,res,err => {
        if(err) return res.json({success:false, err})
        return res.json({success:true, image: res.req.file.path, fileName:res.req.file.filename})
    })
});



router.post("/uploadProduct", auth, (req, res) => {
  //save all the data we get from the client into the DB
    const product= new Product(req.body)
    product.save((err)=> {
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true})
    })
});


router.post("/getProducts", /*auth*/ (req, res) => {

let order=req.body.order ? req.body.order: "asc"
let sortBy=req.body.sortBy ? req.body.sortBy : "_id"
let limit= req.body.limit ? parseInt(req.body.limit):100
let skip=parseInt(req.body.skip) 

//for filtered data in backedn
let findArgs = {}
let term=req.body.searchTerm //based on search based location ma lekhne kura

// console.log(req.body.filters)
 
//key represents both 'continents' and 'price' from Landingpage.js
for(let key in req.body.filters){
    // console.log(key)

    if(req.body.filters[key].length > 0){
        if(key === "price"){

            //for price ko range read garne
            findArgs[key]={
                $gte: req.body.filters[key][0],
                $lte:req.body.filters[key][1]
            }

        }else{
            findArgs[key]= req.body.filters[key]
            // console.log(req.body.filters[key])//req.body.filters[key] this whole array consists of _id of the continents
            console.log(findArgs)
            // {continents: [1,4,3] }
        }
    }
}
console.log(findArgs)

if(term){
      //sabai products haru Product ma huncha which is extracted from models
      Product.find(/*{continents: [1] }*/ findArgs)
      .find({ $text: { $search: term } })
      .populate("writer")
      .sort([[sortBy,order]])
      .skip(skip)
      .limit(limit)
      .exec((err,products) => {
          if(err) return res.status(400).json({success:false,err})
          res.status(200).json({success: true, products, postSize: products.length})
      })
}else{
      //sabai products haru Product ma huncha which is extracted from models
      Product.find(/*{continents: [1] }*/ findArgs)
      .populate("writer")
      .sort([[sortBy,order]])
      .skip(skip)
      .limit(limit)
      .exec((err,products) => {
          if(err) return res.status(400).json({success:false,err})
          res.status(200).json({success: true, products, postSize: products.length})
      })
}
  
})


module.exports = router;
