module.exports = function (db, request, response) {
    let queryResult = request.body.queryResult;
    let clientFacebookId = Number(queryResult.outputContexts[0].parameters.facebook_sender_id)
    let produto = queryResult.parameters.Produto;
    let quantidade = queryResult.parameters.quantidade;
    let responseJson = {};

    let richResponses = getTextModel(`Preparando o ${produto} na quantidade ${quantidade} do cliente ${clientFacebookId} para salvar.`);

    const pedidoRef = db.collection('clientes').doc(clientFacebookId).collection('pedidos');
    pedidoRef.set({
        itens: [{ produto: produto, quantidade: quantidade }],
        data: admin.firestore.FieldValue.serverTimestamp(),
        concluido: false
    }).then(doc => {
        richResponses[0].text.text.push("Produto " + produto + " adicionado ao carrinho com sucesso!")

        responseJson.fulfillmentMessages = richResponses;
        response.json(responseJson);
    }).catch(err => {
        let richResponses = [];

        responseJson.fulfillmentMessages = richResponses;
        response.json(responseJson);
    });
}