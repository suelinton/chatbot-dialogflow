const platforms = require('./platforms');

function getCardModel(title,subtitle, imageUri, buttons, platform) {
    let card = {
        "card": {
            "title": title,
            "subtitle":subtitle,
            "imageUri": imageUri,
            "buttons": buttons
        },
        "platform": platform ? platform : platforms.UNSPECIFIED
    }

    return card;
}

module.exports = getCardModel;