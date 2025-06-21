const crypto = require('crypto');

function generateLinkId(email) {
    const hash = crypto.createHash('sha256')
        .update(email + Date.now() + crypto.randomBytes(16).toString('hex'))
        .digest('hex');

    return hash.substring(0, 24);
}

// Helper function to generate short ID
function generateShortId() {
    const time = Date.now().toString();
    const map = { '0': 'j', '1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e', '6': 'f', '7': 'g', '8': 'h', '9': 'i' };

    return [...time].map(d => map[d]).join('').slice(-6);;
}

module.exports = { generateLinkId, generateShortId }