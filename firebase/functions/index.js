'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _verCarrinho = require('./functions/ver-carrinho');
const _addPedido = require('./functions/add-pedido');
const _showProdutos = require('./functions/show-produtos');
const getTextModel = require('./models/text-model');

var serviceAccount = require("./config/projecttest-169318-sfqltl-firebase-adminsdk-vw8ch-ca8c8f5a98.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://projecttest-169318-sfqltl.firebaseio.com"
});

var db = admin.firestore()

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    let action = request.body.queryResult.intent.displayName;
    let richResponses = [];
    switch (action) {
        case 'verCarrinho':
            _verCarrinho(db, request, richResponses)
                .then(
                    (richResponses) => {
                        let responseJson = { fulfillmentMessages: richResponses };

                        response.json(responseJson);
                    }
                ).catch(
                    (richResponses) => {
                        let responseJson = { fulfillmentMessages: richResponses };

                        response.json(responseJson);
                    }
                );
            break;
        case 'addPedido':
            _addPedido(db, request, richResponses)
                .then(
                    (richResponsesPedido) => {
                        _verCarrinho(db, request, richResponsesPedido)
                            .then(
                                (richResponses) => {
                                    let responseJson = { fulfillmentMessages: richResponses };

                                    response.json(responseJson);
                                }
                            ).catch(
                                (richResponses) => {
                                    let responseJson = { fulfillmentMessages: richResponses };

                                    response.json(responseJson);
                                }
                            );
                    }
                ).catch(
                    (richResponses) => {
                        let responseJson = { fulfillmentMessages: richResponses };

                        response.json(responseJson);
                    }
                );
            break;
        case "showProducts":
            _showProdutos(db, request, response);
            break;
        default:
            let responseJson = {};
            responseJson.fulfillmentText = 'Desculpe, não consegui entender';
            response.json(responseJson);
    }
});

