function getButtonModel(text, postback) {
    return {
        "text": text,
        "postback": postback
    }
}

module.exports = getButtonModel;