const getTextModel = require('../models/richtext-model');

module.exports = (richResponses, err) => {
    richResponses.push(getTextModel('Desculpe, tivemos um problema. Tente novamente mais tarde.'));
    richResponses.push(getTextModel(err.message));
    return richResponses;
}