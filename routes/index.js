var express = require('express');
var router = express.Router();
var mongodb =  require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/info' , function(req,res) {
  var MongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017";
  MongoClient.connect(url, (err,client) => {
    var db = client.db("sampsite");
    if(err){
      console.log("unable to connect to Database" + err);
    }
    else{
      console.log("connected");
      var collection = db.collection("information");
      collection.find({}).toArray(function(err,result){
        if(err){
          console.log(err);
        }
        else if(result.length){
          res.render('info' , {
            "information" : result
          });
        }
        else{
          res.send("No document found");
        }
        client.close();
      });
    }
  })
});

router.get('/add' , (req,res) =>{
  res.render('add' , {title:"New Info"});
});

router.post('/addinfo', (req,res) => {
  var MongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017";
  MongoClient.connect(url, (err,client)=>{
    var db = client.db("sampsite");
    var collection = db.collection("information");
    if(err){
      console.log(err);
    }
    else{
      console.log("connection successful");
    }
    var info = {
      Name : req.body.name,
      Age : req.body.age
    }
    collection.insert([info], (err,result) =>{
      if(err){
        console.log(err);
      }
      else{
        res.redirect("info");
      }
      client.close();
    })
  })
});
module.exports = router;
