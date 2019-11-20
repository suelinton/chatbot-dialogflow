const getTextModel = require('../models/richtext-model');

module.exports = (db, richResponses) => {
    return new Promise((resolve, reject) => {
        let produtos = db.collection('produtos').get();

        produtos.then((snapshot) => {
            richResponses.push(getTextModel(`Escolha seus produtos`));

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
            resolve(richResponses);
        }).catch((err) => {
            richResponses.push(getTextModel(`Desculpe, erro na exibição dos produtos, tente novamente mais tarde!`));
            reject(richResponses);
        });
    });
}