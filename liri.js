
require("dotenv").config();
var keys = require('./keys');

//var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var song = process.argv[3];
var nodeArgs = process.argv;
var temp2 = 0;
var temp1 = 0;

var tweets = function()
{
    var Twitter = require('twitter');
    
    var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
    });

    var params = {
        count: 20
    };
    client.get('statuses/home_timeline', params, function(error, tweets, response) {
    if (!error) {
    // console.log(tweets[0]);
        for (var i=0;i<tweets.length;i++){
        console.log("Tweet No."+(i+1)+": "+tweets[i].text+" created at: "+tweets[i].created_at);
        }}
    else{
        console.log(error);
        };
    });
}

var spotifythis = function (){
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret
    });
    // if no argument given, then search default
    if (song === undefined){
         song = "The Sign by Ace of Base"
    }

    spotify.search({ type: 'track', query: song }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
     var items = data.tracks.items[0];
     var artist = items.artists[0];

    //console.log(items);
    console.log("========= SONG THIS =========");
    console.log("Song: "+ items.name);
    console.log("Artista: " + artist.name);
    console.log("Preview Link: " + items.external_urls.spotify);
    console.log("Album: " + items.album.name);
    console.log("========= SONG THIS =========");
     
    });
}

var movie = function (){
    var request = require("request");
    var temp=0;
    var movieName = ""
    if (process.argv[3] === undefined && temp2===0){
        movieName = "Mr.+Nobody"
   }
   else if (temp2===1){
        var fs = require("fs");
        fs.readFile("random.txt", "utf8", function(err, data) {
            if (err) {
                return console.log(error);
              }
            var dataArr = data.split(",");
            movieName = dataArr[1];
       });
    }else 
        {
         movieName = "";
        for (var i = 3; i < nodeArgs.length; i++) {
            if (i > 3 && i < nodeArgs.length) {
                movieName = movieName + "+" + nodeArgs[i];
            }
            else {
                movieName += nodeArgs[i];
        }
        }
   }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    //console.log(queryUrl);
    request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        if (JSON.parse(body).Title !== undefined){
        console.log("========= MOVIE THIS =========")
        console.log("TITLE: "+JSON.parse(body).Title)
        console.log("YEAR: "+JSON.parse(body).Year)
        console.log("IMDB Rating: "+JSON.parse(body).imdbRating)
        for (var i=0; i<JSON.parse(body).Ratings.length; i++)
        {  
            if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes"){
            console.log("ROTTEN TOMATOES: "+JSON.parse(body).Ratings[i].Value)
            temp = 1;
         } }
        if (temp === 0, console.log("ROTTEN TOMATOES: No aviable data"));
        console.log("COUNTRY: "+JSON.parse(body).Country)
        console.log("LANGUAGE: "+JSON.parse(body).Language)
        console.log("PLOT: "+JSON.parse(body).Plot)
        console.log("ACTORS: "+JSON.parse(body).Actors)
        console.log("========= MOVIE THIS =========") 
        }
        else{
            console.log("========= MOVIE THIS =========") 
            console.log("MOVIE NOT FOUND")
            console.log("========= MOVIE THIS =========") 
        }
  }
});
}

var says = function(){
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(error);
          }
          console.log(data);
          var dataArr = data.split(",");
          console.log(dataArr);
        song = dataArr[1];
        nodeArgs = dataArr[1];
        switch (dataArr[0]){
            case "spotify-this-song":
            spotifythis();
            break;
        case "movie-this":
            movie();
            break; 
        }

          
    }); 
}


switch (command) {
    case "my-tweets":
        tweets();
        break;
    case "spotify-this-song":
        spotifythis();
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        says();
    break;
    default:
        console.log("You need to give a command");

}

