const getTextModel = require('../models/text-model');

module.exports = (db, request, richResponses) => {
    return new Promise((resolve, reject) => {
        let queryResult = request.body.queryResult;
        let clientFacebookId = queryResult.outputContexts[0].parameters.facebook_sender_id;

        let carrinho = db.collection('clientes').doc(clientFacebookId).collection('carrinho').get();

        carrinho.then((snapshot) => {
            richResponses.push(getTextModel('Aqui estão os produtos do seu carrinho: '));
            let total = 0;

            snapshot.forEach((doc) => {
                var produto = doc.data();

                let text = getTextModel(`produto: ${produto.nome}, quantidade ${produto.quantidade}`)

                total += produto.quantidade;

                richResponses.push(text);
            });

            richResponses.push(getTextModel(`Quantidade de itens no carrinho = ${total}`));


            return richResponses;
        }).then((richResponses) => {
            resolve( richResponses );
        }).catch((err) => {
            richResponses.push(getTextModel(`Desculpe, erro na exibição dos produtos, tente novamente mais tarde!`));
            reject( richResponses );
        });
    });
}