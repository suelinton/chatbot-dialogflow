const getTextModel = require('../models/text-model');

module.exports = function (db, request, response) {
    let queryResult = request.body.queryResult;
    let clientFacebookId = queryResult.outputContexts[0].parameters.facebook_sender_id;

    let produto = queryResult.parameters.Produto;
    let quantidade = queryResult.parameters.number;

    const pedidoRef = db.collection('clientes').doc(clientFacebookId).collection('carrinho').doc(produto);

    db.runTransaction(t => {
        t.set(pedidoRef, {
            nome: produto,
            quantidade: quantidade
        });

        return Promise.resolve('Write complete');
    }).then(doc => {
        let richResponses = [ getTextModel(`Adicionado o produto "${produto}" com sucesso!`) ]

        let responseJson = { fulfillmentMessages: richResponses };

        response.json(responseJson);
    }).catch(err => {
        let richResponses = [getTextModel(`Erro ao adicionar o produto "${produto}" ao carrinho, tente novamente.`)]
        richResponses.push(getTextModel(`${err}`))
        let responseJson = { fulfillmentMessages: richResponses };

        response.json(responseJson);
    });
}