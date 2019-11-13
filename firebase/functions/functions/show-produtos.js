module.exports = function (db, request, response) {
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
    }).catch((err) => {
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

}