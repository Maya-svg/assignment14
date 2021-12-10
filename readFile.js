
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Harnaljia:Harnaljia@band.huo1y.mongodb.net/Band?retryWrites=true&w=majority";

// Declare needed modules
var fs = require('fs');

// create file variable
file = "companies.csv";

// read in and process the file 
fs.readFile(file, 'utf8', function(err, data) {
  edited = data.split("\r\n");
  x = edited.toString();
  info = x.split(",");

  // organize input  
  company=[];
  ticker=[];

  for(i=2; i<info.length; i+=2){
    company.push(info[i]);
  }
  for(j=3; j<info.length; j+=2){ 
    ticker.push(info[j]);
  }

  // connect to Mongo database 
  MongoClient.connect(url, function(err, db) {
    if(err) { return console.log(err); return;}

    var dbo = db.db("Companies");
    var collection = dbo.collection('companies');

    //Clear database to stop overlap
    collection.deleteMany({});

    // insert data to database 
    for(i=0; i<company.length-1; i++){
        var newData = {"Company": company[i], "Ticker": ticker[i]};
        console.log( newData);
        collection.insertOne(newData);
    }
    console.log("Inserted");

    console.log("Success!");
    //db.close();
  });
});
