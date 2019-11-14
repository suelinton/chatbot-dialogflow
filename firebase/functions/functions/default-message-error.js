const getTextModel = require('../models/text-model');

module.exports = (richResponses) => {
    richResponses.push(getTextModel('Desculpe, não consegui entender'));
    return richResponses;
}