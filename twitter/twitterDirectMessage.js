module.exports = {
    MessageContent : {},
    twitterResolve : "",
    initialized : false,
    resolveSendDM: async function(recipient_user_name, message_content){
        if(!module.exports.initialized){module.exports.init()}
        var DMtemplate = module.exports.MessageContent;
        module.exports.setContent(message_content);
        var resultResolve = await module.exports.resolveTwitter(recipient_user_name);
        module.exports.sendDM(resultResolve.user_id,message_content)
    },
    sendDM: function(recipient_id, message_content){
        if(!module.exports.initialized){module.exports.init()}
        var DMtemplate = module.exports.MessageContent;
        module.exports.setRecipientID(recipient_id);
        module.exports.setContent(message_content);
        return module.exports.twitterResolve.client.post("direct_messages/events/new", {event : DMtemplate})
    },
    init : function(){
        module.exports.twitterResolve = require('./twitterResolve');
        var message_content = module.exports.MessageContent;
        message_content["type"]="message_create";
        message_content["message_create"] = {};
        message_content["message_create"]["target"] = {};
        message_content["message_create"]["target"]["recipient_id"] = "none";
        message_content["message_create"]["message_data"] = {};
        message_content["message_create"]["message_data"]["text"] = "Hello World!";
        module.exports.initialized = true;
    },
    setRecipientID : function(recipient_id){
        module.exports.MessageContent["message_create"]["target"]["recipient_id"] = recipient_id;
        if(module.exports.MessageContent["message_create"]["target"]["recipient_id"] == recipient_id){return true}else{console.log("setRecipientID failed !!");process.exit(1)}
    },
    setContent : function(message_content){
        module.exports.MessageContent["message_create"]["message_data"]["text"] = message_content;
        if(module.exports.MessageContent["message_create"]["message_data"]["text"] === message_content){return true}else{console.log("setContent failed !!");process.exit(1)}
    },
    resolveTwitter: async function(recipient_user_name){
        var recipient = {};
        recipient["screen_name"] = recipient_user_name;
        var result = await module.exports.twitterResolve.resolveTwitter(recipient)
        return result;
    }
}