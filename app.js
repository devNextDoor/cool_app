var request = require('request'),
    express = require("express"),
    holidays = require('public-holidays'),
    app     = express();
app.use(express.static("public"));
var filter = {country: 'in', lang: 'en', start:'2018-05-08', end:'2018-05-31'};
var ret=[], client_access_token, name, approved=false;
holidays(filter, (error, result) => {
  if(!error){
      var date = new Date(), year = date.getFullYear(), monthId = date.getMonth(), month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      for(var i=0; i<result.length; i++)
      {
          var current = result[i];
          if((""+result[i].start).indexOf(""+month[monthId])>=0 && (""+result[i].start).indexOf(""+year)>=0){
            ret.push((""+result[i].start).substr(0,11)+" "+result[i].summary);
          }
      }
  }
});

function getUser(client_access_token){
    var body;
    var headers = {
        'Access-Token': ""+client_access_token
    };
    var options = {
        url: 'https://api.pushbullet.com/v2/users/me',
        headers: headers
    };
    function cback(error, response, body) {
        console.log("ffff");
        if (!error && response.statusCode == 200) {
            console.log("ffff");
            body = JSON.parse(body);
            console.log((body).name);
            name = body.name;
            console.log(name);
        }
    }
    console.log(options);
    request(options, cback);
}
app.get("/home", function(req, res) {
    res.redirect("https://www.pushbullet.com/authorize?client_id=12mqTAUtJjStnPP3j49V905Vd5aFfsxR&redirect_uri=https%3A%2F%2Fwww.proj1-koduri.c9users.io&response_type=code&scope=everything");
})
app.get("/", function(req, res){
    console.log(req.url);
    var code = req.url.substr(7,req.url.length-14);
    console.log(code);
    
    var headers = {
        'Access-Token': '<your_pushbullet_access_token_here>',
        'Content-Type': 'application/json'
    };
    var dataString = '{"client_id":"12mqTAUtJjStnPP3j49V905Vd5aFfsxR","client_secret":"7b4RKMpjFlYJXWfceMEXmn5SSlrfvJsM","code":\"'+code+'\","grant_type":"authorization_code"}';
    console.log(dataString);
    var options = {
        url: 'https://api.pushbullet.com/oauth2/token',
        method: 'POST',
        headers: headers,
        body: dataString
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body).access_token);
            client_access_token = ""+JSON.parse(body).access_token;
            console.log(client_access_token);
            getUser(client_access_token);
            res.redirect("/cool"); 
        }
    }
    request(options, callback);
    
});

app.get("/cool", function(req, res){
        console.log(req.url);
        request("https://newsapi.org/v2/top-headlines?country=in&apiKey=<news_api_key_here>", function(error, response, body){
            if(!error && response.statusCode==200){
                var articles = JSON.parse(body).articles;
                res.render("cool.ejs", {articles : articles, holidays : ret, client_access_token : client_access_token, name : name});
            }
        });
});

app.get("/coola", function(req, res) {
    request("https://newsapi.org/v2/top-headlines?country=in&apiKey=<news_api_key_here>", function(error, response, body){
            if(!error && response.statusCode==200){
                var articles = JSON.parse(body).articles;
                res.render("coola.ejs", {articles : articles, holidays : ret, client_access_token : client_access_token, name : name});
            }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Push Server Up!!!"); 
});
