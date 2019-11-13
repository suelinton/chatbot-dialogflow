const getTextModel = require('../models/text-model');

module.exports = function (db, request, response) {
    let queryResult = request.body.queryResult;
    let clientFacebookId = Number(queryResult.outputContexts[0].parameters.facebook_sender_id);
    
    let carrinho = db.collection('clientes').doc('ZtTGZafoGDmusvaLaosX').collection('carrinho').get();
    
    carrinho.then((snapshot) => {
        let richResponses = [getTextModel('Aqui estão os produtos do seu carrinho: ')];
        let total = 0;

        snapshot.forEach((doc) => {
            var produto = doc.data();

            let text = getTextModel(`produto: ${produto.nome}, quantidade ${produto.quantidade}`)
            
            //total += produto.valor;

            richResponses.push(text);
        });

        richResponses.push( getTextModel(`Total = ${total}`) );


        return richResponses;
    }).then((richResponses) => {
        let responseJson = {};
        responseJson.fulfillmentMessages = richResponses;
        response.json(responseJson);
    }).catch((err) => {
        let richResponses = [getTextModel(`Desculpe, erro na exibição dos produtos, tente novamente mais tarde!`)];
        let responseJson = { fulfillmentMessages: richResponses };
        response.json(responseJson);
        console.log('', err);
    });
}