exports.handler = (event, context, callback) => {
    let {
      first_name
    } = JSON.parse(event.fbUserData);
    
    var responseJSON = {
        "response": "Hello World!", // what the bot will respond with
        "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
        "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
        "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
        "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
        "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
        "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
    }

    responseJSON.response = `Hi ${first_name || ""}`;
    responseJSON.customVars = {
      fbUser: first_name || ""
    }

    // callback to return data to Motion AI (must exist, or bot will not work)
    callback(null, responseJSON);
};