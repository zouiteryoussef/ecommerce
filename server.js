var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

// importing models
var Products = require('./models/products')


var mongoose = require('mongoose'),
    DB_URL = 'mongodb://localhost:27017/myapp';

mongoose.Promise = global.Promise;
//连接
mongoose.connect(DB_URL, {useMongoClient: true,});

//连接成功
mongoose.connection.on('connected', function () {
    console.log('connect successfully ' + DB_URL);
});

//连接异常
mongoose.connection.on('error',function (err) {
    console.log('connnection errors: ' + err);
});

//连接断开
mongoose.connection.on('disconnected', function () {
    console.log('disconnecting....');
});


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());


app.get('/api', function(req,res){
    Products.find({}, function(err,products){
        if(err){
            console.log(err);
        } else{
            res.json(products)
        }
    })
});


app.get('/api/search', function(req,res){
    var name = req.query.name;
    var category = req.query.category;
    var sex = req.query.sex;
    Products.find({$or:[{name:name},{category:category},{sex:sex}]}, function(err,products){
        if(err){
            console.log(err);
        } else{
            res.json(products)
        }
    })
});

app.get('/api/find/:productId', function(req,res){
    Products.findById(req.params.productId, function(err,product){
        if(err){
            console.log(err);
        } else{
            res.json(product)
        }
    })
});

app.put('/api/edit/:productId', function(req,res){
    Products.findByIdAndUpdate(req.params.productId,req.body,function(err,editedProduct){
        if(err){
            console.log(err);
        }else{
            res.json(editedProduct)
        }
    })
});



app.post('/api', function(req,res){
    var name = req.body.name;
    var sex = req.body.sex;
    var manufacturer = req.body.manufacturer;
    var image = req.body.image;
    var description= req.body.description;
    var category = req.body.category;
    var size = req.body.size;
    var newProduct = {name:name,sex:sex,manufacturer:manufacturer,
        image:image,description:description,category:category,size:size};

    Products.create(newProduct, function(err, product){
        if(err){
            console.log(err);
        }else{
            res.json(product)
        }
    });
});






app.listen(3000);