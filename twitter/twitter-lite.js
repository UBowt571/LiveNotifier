const twitter_lite = require('twitter-lite');
const fs = require('fs');
var twitterListen = require('./twitterListenStream');

let account_details = JSON.parse(fs.readFileSync('twitter/params/accounts_details.json'));
let subscribers = JSON.parse(fs.readFileSync('twitter/params/subscribers.json'));
let content_providers = JSON.parse(fs.readFileSync('twitter/params/content_providers.json'));

const client = new twitter_lite({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
});
console.log("consumer_key: "+process.env.consumer_key)
console.log("consumer_secret: "+process.env.consumer_secret)
console.log("access_token_key: "+process.env.access_token_key)
console.log("access_token_secret: "+process.env.access_token_secret)

twitterListen.startListenTwitter(client,content_providers,subscribers);