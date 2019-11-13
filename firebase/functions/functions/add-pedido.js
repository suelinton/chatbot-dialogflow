const getTextModel = require('../models/text-model');

module.exports = function (db, request, response) {
    let queryResult = request.body.queryResult;
    let clientFacebookId = Number(queryResult.outputContexts[0].parameters.facebook_sender_id)

    let produto = queryResult.parameters.Produto;
    let quantidade = queryResult.parameters.quantidade;

    const pedidoRef = db.collection('clientes').doc('ZtTGZafoGDmusvaLaosX').collection('carrinho').doc('gyi7GxtPPGFKx8dnmfXq');

    db.runTransaction(t => {
        t.set(pedidoRef, {
            nome: produto,
            quantidade: 1
        });

        return Promise.resolve('Write complete');
    }).then(doc => {
        let richResponses = [getTextModel('Adicionado o produto com sucesso!')]

        let responseJson = { fulfillmentMessages: richResponses };

        response.json(responseJson);
    }).catch(err => {
        let richResponses = [getTextModel('Erro ao adicionar o produto ao carrinho, tente novamente.')]
        richResponses.push(getTextModel(`${err}`))
        let responseJson = { fulfillmentMessages: richResponses };

        response.json(responseJson);
    });
}