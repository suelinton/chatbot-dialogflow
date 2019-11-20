const getTextModel = require('../models/richtext-model');

module.exports = (richResponses) => {
    richResponses.push(getTextModel('Desculpe, não consegui entender'));
    return richResponses;
}