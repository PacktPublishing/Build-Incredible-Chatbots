const request = require('request');
exports.handler = (event, context, callback) => {
    const {
        lat,
        lng
    } = JSON.parse(event.result).coordinates;
    const type = (JSON.parse(event.customVars).searchType).toLowerCase(); // hospital, pharmacy, doctor
    const apiKey = "your-api-key";
    let opts = {
      url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      qs: {
        location: `${lat},${lng}`,
        type,
        rankby: 'distance',
        key: apiKey
      }
    }

    // this is the object we will return to Motion AI in the callback
    var responseJSON = {
        "response": "", // what the bot will respond with
        "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
        "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
        "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
        "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
        "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
        "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
    }

    request(opts, function(error, response, body) {
      if(body && !error) {
        let {results} = JSON.parse(body);
        let cards = results.map(function(item) {
        let {
          lat,
          lng
        } = item.geometry.location;
          return {
            cardTitle: item.name,
            cardSubtitle: item.vicinity,
            cardImage: null,
            buttons: [{
              buttonText: 'Show on Map',
              buttonType: 'url',
              target: `https://maps.google.com?q=${lat},${lng}`
            }, {
              buttonText: 'More Details',
              buttonType: 'module',
              target: item.place_id
            }]
          }
        });

        responseJSON.cards = cards.slice(0,9);
        responseJSON.quickReplies = ["Search Other", "That's all. Thanks"];
        callback(null, responseJSON);
      } else {
        responseJSON.response = "There seems to be an issue with my server at the moment. Let's try again!";
        responseJSON.nextModule = 778502; // Replace this with your Present Options module code
        callback(null, responseJSON);
      }
    });


};