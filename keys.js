
console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
  ombd: process.env.OMDB_apikey,
  bit: process.env.BiT_appID
}