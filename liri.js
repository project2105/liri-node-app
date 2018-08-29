require("dotenv").config();
var request = require("request");
var moment = require("moment");
var fs = require('fs');
require('./keys.js');
var spotid = process.env.SPOTIFY_ID;
var spotSecret = process.env.SPOTIFY_SECRET;
var omdbId = process.env.OMDB_apikey;
var bitId = process.env.BiT_appID;
var task = '';
var target;

var inquirer = require("inquirer");
inquirer
    .prompt([
        {
            type: "list",
            message: "What do you want to do?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "task"
        }
    ])
    .then(function (inquirerResponse) {
        if (inquirerResponse.task) {
            task = inquirerResponse.task;
            console.log(task);
        }

        // runTask();

        // function runTask() {
        if (task === 'concert-this') {
            band();
        } else if (task === 'spotify-this-song') {
            song();
        } else if (task === 'movie-this') {
            movie();
        } else if (task === 'do-what-it-says') {
            what();
        }
        // }

    });



function band() {

    inquirer
        .prompt([
            {
                type: "input",
                message: "What band or solo artist do you want to see?",
                name: "band"
            }
        ])
        .then(function (inquirerResponse2) {
            if (inquirerResponse2.band) {
                var band = inquirerResponse2.band;
                var bandArray = band.split();
                var target = bandArray.join('%20').trim();
            }
            var BiTqueryUrl = 'https://rest.bandsintown.com/artists/' + target + '/events?app_id=' + bitId + "'";
            request(BiTqueryUrl, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(JSON.parse(body));
                    console.log('* Artist: ' + band);
                    for (var i = 0; i < 10; i++) {
                        eventDate = JSON.parse(body)[i].datetime;
                        console.log('\n* Venue Name: ' + JSON.parse(body)[i].venue.name);
                        console.log('* Venue Location: ' + JSON.parse(body)[i].venue.city);
                        console.log('* Date of Event: ' + moment(eventDate).format('MMMM Do YYYY, h:mm:ss a'));
                    }
                }
            });
        });
}

function song() {
    var inquirer = require("inquirer");
    inquirer
        .prompt([
            {
                type: "input",
                message: "What song do you want to search?",
                name: "song"
            }
        ])
        .then(function (inquirerResponse3) {
            var Spotify = require('node-spotify-api');
            if (inquirerResponse3.song) {
                var song = inquirerResponse3.song;
                var songArray = song.split();
                var target = songArray.join('%20').trim();
            } else {
                target = 'the sign';
            }

            var spotify = new Spotify({
                id: spotid,
                secret: spotSecret
            });

            spotify.search({ type: 'track', query: target }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log(data.tracks.items[0].album.name);
                // console.log(data.tracks.items[1]);
                // console.log(data.tracks.items[2]);
                // console.log(data.tracks.items[3]);
            });

            //         console.log('* Artist: ' + JSON.parse(body).Year);
            //         console.log('* Song Title: ' + JSON.parse(body).Title);
            //         console.log('* Album: ' + JSON.parse(body).Album);
            //         console.log('* Song Link: ' + JSON.parse(body).Year);
        });

}

function movie() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What movie do you want to search?",
                name: "movie"
            }
        ])
        .then(function (inquirerResponse4) {
            if (inquirerResponse4.movie) {
                var movie = inquirerResponse4.movie;
                var movieArray = movie.split();
                var target = movieArray.join('+').trim();
            }
            var omdbQueryUrl = "http://www.omdbapi.com/?t=" + target + "&y=&plot=short&apikey=" + omdbId;
            request(omdbQueryUrl, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log('* Title: ' + JSON.parse(body).Title);
                    console.log('* Year: ' + JSON.parse(body).Year);
                    console.log('* IMDB Rating: ' + JSON.parse(body).imdbRating);
                    console.log('* Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
                    console.log('* Country of Production: ' + JSON.parse(body).Country);
                    console.log('* Language: ' + JSON.parse(body).Language);
                    console.log('* Plot Synapsis: ' + JSON.parse(body).Plot);
                    console.log('* Actors/Actresses: ' + JSON.parse(body).Actors);
                }
            });
        });

}

function what() {
    console.log(song)
    var fs = require('fs');
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        var search = data.split(',');
        task = search[0];
        tagret = search[1];
        if (task === 'concert-this') {
            band();
        } else if (task === 'spotify-this-song') {
            song();
        } else if (task === 'movie-this') {
            movie();
        } else if (task === 'do-what-it-says') {
            what();
        }
    }

    )
}
