module.exports = {
    client : "",
    util : "",
    resolveTwitter : function (currentScreenname){
        return new Promise(resolve => {
            module.exports.client.get("users/show",{screen_name: currentScreenname["screen_name"]}).then(result => {
                currentScreenname["user_id"] = result.id_str;
                resolve(currentScreenname);
            }).catch(error => {
                console.log("error : "+error)
            })
        })
    },
    resolve_Current_Names : async function (current_content_provider){
        if(current_content_provider["twitter"] != undefined){
            current_content_provider["twitter"] = await module.exports.resolveTwitter(current_content_provider["twitter"])
        } else {process.exit(1);}
        return current_content_provider;
    },
    resolveNames : async function (array_to_solve,pClient,pUtils){
        module.exports.client = pClient;
        module.exports.util = pUtils;
        var result = await module.exports.resolve_Each_Name(array_to_solve);
        return result;
    },
    resolve_Each_Name : async function  (content_providers){
        return module.exports.util.doForAllElements(content_providers,module.exports.resolve_Current_Names)
    }
}