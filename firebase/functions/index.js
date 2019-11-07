'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./config/projecttest-169318-sfqltl-firebase-adminsdk-vw8ch-ca8c8f5a98.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://projecttest-169318-sfqltl.firebaseio.com"
});

var db = admin.firestore()

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    let action = request.body.queryResult.intent.displayName;

    let responseJson = {};

    switch (action) {
        case 'addPedido':
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
            response.json(responseJson);
            break;
        case "showProducts":

            //let droneTypes = request.body.queryResult.parameters['drone-types'];
            //let droneTypesKey = droneTypes.replace(/\s/g, '');

            let produtos = db.collection('produtos').get();
            produtos.then((snapshot) => {
                    let richResponses = [{
                        "text": {
                            "text": [
                                `Escolha seus produtos`
                            ]
                        },
                        "platform": "FACEBOOK"
                    }];

                    snapshot.forEach((doc) => {
                        var data = doc.data();
                        let card = {
                            "card": {
                                "title": data.nome,
                                "subtitle": data.valor,
                                "imageUri": data.imageUri,
                                "buttons": [{
                                    "text": data.nome
                                        // ,"postback": data.nome
                                }]
                            },
                            "platform": "FACEBOOK"
                        };
                        richResponses.push(card);

                    });

                    return richResponses;
                }).then((richResponses) => {
                    let responseJson = {};
                    responseJson.fulfillmentMessages = richResponses;
                    response.json(responseJson);
                })
                .catch((err) => {
                    let richResponses = [{
                        "text": {
                            "text": [
                                `Desculpe, erro na exibição dos produtos, tente novamente mais tarde!`
                            ]
                        },
                        "platform": "FACEBOOK"
                    }];
                    let responseJson = {};
                    responseJson.fulfillmentMessages = richResponses;
                    response.json(responseJson);
                    console.log('', err);
                });
            break;
        default:
            responseJson.fulfillmentText = 'Desculpe, não consegui entender';
    }
    // responseJson.fulfillmentText = 'json ' + JSON.stringify(action);

});