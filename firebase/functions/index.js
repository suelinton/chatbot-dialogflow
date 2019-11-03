'use strict';

const functions = require('firebase-functions');

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    let action = request.body.queryResult;

    let responseJson = {};

    switch (action) {
        case 'Pedir':
            responseJson.fulfillmentText = 'Avaible drones';
            let richResponse = [{
                    "text": {
                        "text": [
                            ""
                        ]
                    },
                    "platform": "FACEBOOK"
                },
                {
                    "card": {
                        "title": 'data.title',
                        "subtitle": 'data.subtitle',
                        "imageUri": 'https://picsum.photos/200/300',
                        "buttons": [{
                            "text": 'data.buttons.text',
                            "postback": 'data.buttons.postback'
                        }]
                    },
                    "platform": "FACEBOOK"
                }
            ]
            responseJson.fulfillmentText = richResponse;
            break;
        default:
            responseJson.fulfillmentText = 'json ' + JSON.stringify(action);
    }
    responseJson.fulfillmentText = 'json ' + JSON.stringify(action);
    response.json(responseJson);
});