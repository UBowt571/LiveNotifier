const TwitchClient = require('twitch').default;
const fs = require('fs');

const account_details = JSON.parse(fs.readFileSync('twitch/params/account_details.json'));

const clientId = process.env.twitch_consumer_key || account_details.consumer_key;
const accessToken = process.env.twitch_access_token_secret || account_details.access_token_secret;

const twitchClient = TwitchClient.withCredentials(clientId, accessToken);

const WebHookListener = require('twitch-webhooks').default;
startListenForStreams();

let breakpoint = null;

async function getUserDetails(userName) {
	const user = await twitchClient.helix.users.getUserByName(userName);
	if (!user) {
		return false;
	}
    return user;
}

async function startListenForStreams(username){
    const appPort = process.env.PORT || 32770;
    const listener = await WebHookListener.create(twitchClient, {port: appPort});
    listener.listen();
    console.log("twitch module running on port : "+appPort);

    let channel = await getUserDetails("ubowt571")
    console.log("channel.displayName : "+channel.displayName);

    const subscription = await listener.subscribeToStreamChanges(channel.id, async stream => {
        console.log("stream démarré");
        if (stream) {
            console.log(`${stream.userDisplayName} just went live with title: ${stream.title}`);
        } else {
            // no stream, no display name
            console.log(`${channel.displayName} just went offline`);
        }
    });
}