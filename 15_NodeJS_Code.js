const request = require('request');
exports.handler = (event, context, callback) => {
    const placeid = event.reply;
    const apiKey = "your-api-key";
    var responseJSON = {
        "response": "", // what the bot will respond with
        "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
        "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
        "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
        "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
        "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
        "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
    }

    let opts = {
      url: 'https://maps.googleapis.com/maps/api/place/details/json',
      qs: {
        placeid,
        key: apiKey
      }
    }

    request(opts, function(error, response, body) {
      if(body && !error) {
        let {
          formatted_phone_number,
          formatted_address,
          name
        } = JSON.parse(body).result;

        responseJSON.response = `{${name}, ${formatted_address}. Tel: ${formatted_phone_number || 'N.A'}}::next-200::{Would you like to search for something else?}`;
        responseJSON.quickReplies = ["Yes please", "No thanks"];
        callback(null, responseJSON);
      } else {
        responseJSON.response = "There seems to be an issue with my server at the moment. Let's try again!";
        callback(null, responseJSON);
      }
    });
    

    // callback to return data to Motion AI (must exist, or bot will not work)
    
};