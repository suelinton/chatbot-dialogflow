'use strict';

const functions = require('firebase-functions');

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    let action = request.body.queryResult.intent.displayName;

    let responseJson = {};

    switch (action) {
        case 'Pedir':
            responseJson.fulfillmentText = 'Avaible drones';
            let richResponse = [{
                    "text": {
                        "text": [
                            "Text defined in Dialogflow's console for the intent that was matched"
                        ]
                    },
                    "platform": "FACEBOOK"
                },
                {
                    "card": {
                        "title": 'data.title',
                        "subtitle": 'data.subtitle',
                        "imageUri": 'https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png',
                        "buttons": [{
                            "text": 'data.buttons.text',
                            "postback": 'data.buttons.postback'
                        }]
                    },
                    "platform": "FACEBOOK"
                }
            ]
            responseJson.fulfillmentMessages = richResponse;
            break;
        default:
            responseJson.fulfillmentText = 'Desculpe, não consegui entender';
    }
    // responseJson.fulfillmentText = 'json ' + JSON.stringify(action);
    response.json(responseJson);
});