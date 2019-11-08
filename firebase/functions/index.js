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
    let queryResult = request.body.queryResult;
    let action = queryResult.intent.displayName;
    let responseJson = {};

    switch (action) {
        case 'addPedido':
            //responseJson.fulfillmentText = 'json ' + JSON.stringify(queryResult.outputContexts[0].parameters.facebook_sender_id)
            let clientFacebookId = Number(queryResult.outputContexts[0].parameters.facebook_sender_id)
            let produto = queryResult.parameters.Produto;
            let quantidade = queryResult.parameters.quantidade;
            let responseJson = {};
            let richResponses = [{
                "text": {
                    "text": [
                        `Preparando o ${produto} na quantidade ${quantidade} do cliente ${clientFacebookId} para salvar.`
                    ]
                },
                "platform": "FACEBOOK"
            }];

            const pedidoRef = db.collection('clientes').doc(clientFacebookId).collection('pedidos');
            pedidoRef.add({
                itens: [{ produto: produto, quantidade: quantidade }],
                data: admin.firestore.FieldValue.serverTimestamp(),
                concluido: false
            }).then(doc => {
                richResponses[0].text.text.push("Produto " + produto + " adicionado ao carrinho com sucesso!")

                responseJson.fulfillmentMessages = richResponses;
                response.json(responseJson);
            }).catch(err => {
                let richResponses = [{
                    "text": {
                        "text": [
                            `Error writing to Firestore: ${err}`
                        ]
                    },
                    "platform": "FACEBOOK"
                }];

                responseJson.fulfillmentMessages = richResponses;
                response.json(responseJson);
            });

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
            response.json(responseJson);
    }
    // responseJson.fulfillmentText = 'json ' + JSON.stringify(action);

});