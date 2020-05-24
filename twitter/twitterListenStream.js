module.exports = {
    parameters : [],
    hashlist : {},
    client : "",
    belongInFollowed: function(current){
        if(current.delete != undefined){
            return false;
        }
        return module.exports.parameters.follow.includes(current.user.id_str)
    },
    patternRecognized: function(current,user_id){
        if((typeof current)=="string"){
            if (module.exports.hashlist[user_id]["pattern"] === "") {
                return true;
            }else if(current.includes(module.exports.hashlist[user_id]["pattern"])){
                return true;
            }
            return false;

        }else{console.log("contenu de tweet attendu ici, type reçu : ",typeof(current));process.exit(1);}
    },
    buildParameters: function (content_providers_full,subscribers){
        var follow = content_providers_full.map(element => {
            var twitterDetails = [];
            twitterDetails["screen_name"]= element["twitter"]["screen_name"];
            twitterDetails["pattern"] = element["twitter"]["pattern"];
            module.exports.hashlist[element["twitter"]["user_id"]] = twitterDetails;
            var current_content_provider_subscribers = [];
            subscribers.forEach(current_subscriber => {
                if(current_subscriber["twitter"]["follows"].includes(element["twitter"]["screen_name"])){
                    current_content_provider_subscribers.push(current_subscriber["twitter"]["screen_name"]);
                }
            });
            module.exports.hashlist[element["twitter"]["user_id"]]["subscribers"] = current_content_provider_subscribers;
            return element["twitter"]["user_id"];
        });
        module.exports.parameters["follow"] = follow
    },
    startListenTwitter : async function (client,content_providers,subscribers){
        var twitterResolve = require('./twitterResolve');
        var util = require('./util');
        var resolveNamesPromises = await twitterResolve.resolveNames(content_providers,client,util)
        var content_providers_full = await Promise.all(resolveNamesPromises);
        var breakpoint = null;
        module.exports.buildParameters(content_providers_full,subscribers);
        client.stream("statuses/filter", module.exports.parameters)
        .on("start", response => console.log("start"))
        .on("data", tweet => {
            if(module.exports.belongInFollowed(tweet)){
                if(module.exports.patternRecognized(tweet.text,tweet.user.id_str)){
                    module.exports.publishToSubscribers(tweet.user.id_str,tweet.id_str)
                }
            }
        })
        .on("error", error => console.log("error", error))
        .on("end", response => console.log("end"));
    },
    publishToSubscribers : function(content_provider_id,tweet_id){
        var DMutility = require('./twitterDirectMessage');
        module.exports.hashlist[content_provider_id]["subscribers"].forEach(current_subscriber => {
            var current_content_provider_name = module.exports.hashlist[content_provider_id]["screen_name"];
            var message_content = current_content_provider_name+" a tweeté le pattern \""+module.exports.hashlist[content_provider_id]["pattern"]+"\" https://twitter.com/"+current_content_provider_name+"/status/"+tweet_id;
            DMutility.resolveSendDM(current_subscriber,message_content)
        })
    }
}