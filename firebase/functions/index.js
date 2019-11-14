'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _verCarrinho = require('./functions/ver-carrinho');
const _addPedido = require('./functions/add-pedido');
const _showProdutos = require('./functions/show-produtos');
const _getDefaultMensageError = require('./functions/default-message-error');
const _getMensageError = require('./functions/error-message');

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

    var _returnResult = (richResponses) => {
        let responseJson = { fulfillmentMessages: richResponses };

        response.json(responseJson);
    }

    var _returnResultConfirmation = (richResponses) => {
        let responseJson = {
            fulfillmentMessages: richResponses,
            "payload": {
                "google": {
                    "expectUserResponse": true,
                    "systemIntent": {
                        "intent": "actions.intent.CONFIRMATION",
                        "data": {
                            "@type": "type.googleapis.com/google.actions.v2.ConfirmationValueSpec",
                            "dialogSpec": {
                                "requestConfirmationText": "Please confirm your order."
                            }
                        }
                    }
                }
            }
        };

        response.json(responseJson);
    }

    try {
        switch (action) {
            case 'addProdutoCarrinhoYes':
            case 'verCarrinho':
                _verCarrinho(db, request, richResponses).then(_returnResult).catch(_returnResult);
                break;
            case 'addPedido':
                _addPedido(db, request, richResponses).then(_returnResultConfirmation).catch(_returnResult);
                break;
            case "showProducts":
                _showProdutos(db, richResponses).then(_returnResult).catch(_returnResult);
                break;
            default:
                richResponses = _getDefaultMensageError(richResponses);
                _showProdutos(db, richResponses).then(_returnResult).catch(_returnResult);
                break;
        }
    } catch (error) {
        _returnResult(_getMensageError(richResponses, error));
    }
});