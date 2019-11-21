const getTextModel = require('../models/richtext-model');
const getCardModel = require('../models/card-model');
const getButtonModel = require('../models/buttons-model');
const platformsModel = require('../models/platforms');

module.exports = (db, request, richResponses) => {
    return new Promise((resolve, reject) => {

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
            richResponses.push(getTextModel(`Adicionado o produto "${produto}" com sucesso!`));

            let buttons = []
            buttons.push(getButtonModel('Sim','carrinho'));
            buttons.push(getButtonModel('Não','galeria'));

            richResponses.push(getCardModel(`Você gostaria de ver o carrinho?`,null,null,buttons,platformsModel.FACEBOOK));
            richResponses.push(card);

            resolve(richResponses);

        }).catch(err => {
            richResponses.push(getTextModel(`Erro ao adicionar o produto "${produto}" ao carrinho, tente novamente.`))
            richResponses.push(getTextModel(`${err}`));

            reject(richResponses);
        });
    });
}