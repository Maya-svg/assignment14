var http = require('http');
var fs = require('fs');
var qs = require('querystring');
	
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Harnaljia:Harnaljia@band.huo1y.mongodb.net/Band?retryWrites=true&w=majority";

http.createServer(function (req, res) 
{
    if (req.url=="/process")
    {
        input = "";
        value = "";
        button = "";
        results = [];

        // Getting info from user => upon recieving the data make it a string
        req.on('data', data =>{ 
            input += data.toString();
        });

        req.on('end', () => {
			input = qs.parse(input);
            value = input['user_input'];
            button = input['choice'];
			res.write ("Inquired about: " + value + '\n' );   
		});

        MongoClient.connect(url, function(err, db) {
            if(err) { return console.log(err); return;}
            var dbo = db.db("Companies");
            var collection = dbo.collection('companies');
            
            if(button == "symbol"){
                //do a query based on the symbol
                collection.find({"Ticker": value}).toArray(function(err,items){
                    if (err) {
                        console.log("Error: " + err);
                    } 
                    else {
                        console.log(items.length);
                        for (i=0; i<items.length; i++){
                            console.log(i + ": " + items[i].Company + " and: " + items[i].Ticker);
                            results.push("Company name: " + items[i].Company + " Symbol: " + items[i].Ticker + '\n');
                        }
                    }
                    db.close();
                    res.write(" Results" + '\n');
                    res.write(" " + results);
                    res.end();
                });
            }else{
                //do a query based on the name
                collection.find({"Company": value}).toArray(function(err,items){
                    if (err) {
                        console.log("Error: " + err);
                    } 
                    else {
                        console.log(items.length);
                        for (i=0; i<items.length; i++){
                            console.log(i + ": " + items[i].Company + " and: " + items[i].Ticker);
                            results.push("Company name: " + items[i].Company + " Symbol: " + items[i].Ticker + '\n');
                        }
                    }
                    db.close();
                    res.write(" Results" + '\n');
                    res.write( " " + results);
                    res.end();
                });
            }
        });
    }
}).listen(8080);
