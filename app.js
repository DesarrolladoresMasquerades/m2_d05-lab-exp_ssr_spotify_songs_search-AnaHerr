require('dotenv/config');

const express = require("express");
const res = require("express/lib/response");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:

app.get("/", (req, res) => {
  res.render("home");
})

app.get("/artist-search", (req, res) =>{

    const artistName = req.query.artistName;

  spotifyApi
  .searchArtists(artistName)
  .then(data => {
    const resultArtists = data.body.artists.items
    console.log('The received data from the API: ', resultArtists)
    res.render("artist-search-results", {artists: resultArtists})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  })

app.get("/albums/:albumId", (req, res, next) => {
    const id = req.params.albumId;
  
    spotifyApi
      .getArtistAlbums(id)
      .then((data) => {
        console.log("the album", data.body.items)
        res.render("albums", {albums: data.body.items});
      })
      .catch((err) => console.log(err));
  });


app.get("/tracks/:id", (req, res, next) => {
    const id = req.params.id;
  
    spotifyApi
      .getAlbumTracks(id)
      .then((data) => {
        console.log("tracks", data.body.items)           
        res.render("tracks", {tracks: data.body.items});
      })
      .catch((err) => console.log(err));
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
