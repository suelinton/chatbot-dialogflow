const platforms = require('./platforms');

function getTextModel(text, platform) {
    return {
        "text": {
            "text": [
                text
            ]
        },
        "platform": platform ? platform : platforms.UNSPECIFIED
    }
}

module.exports = getTextModel;