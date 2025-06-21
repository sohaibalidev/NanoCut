const { getDB } = require('../config/db');
const auth = require('../utils/auth')
const config = require('../config/config')
const path = require('path')
const { generateLinkId, generateShortId } = require('../utils/helper')

exports.redirectToOriginal = async (req, res) => {
    try {
        const { shortId } = req.params;
        const db = getDB();
        const urls = db.collection('urls');

        const url = await urls.findOne({ shortId, isActive: true });

        // if (!url) {
        //     return res.status(404).send('URL not found or inactive');
        // }

        if (!url) {
            return res.sendFile(path.join(__dirname, '../../views', '404-url.html'));
        }

        if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
            // return res.status(410).send('URL has expired');
            return res.sendFile(path.join(__dirname, '../../views', '404-url.html'));
        }

        await urls.updateOne(
            { uid: url.uid },
            { $inc: { clicks: 1 }, $set: { updatedAt: new Date() } }
        );

        res.redirect(url.originalUrl);
    } catch (err) {
        console.error('URL redirection error:', err);
        res.status(500).send('Internal server error');
    }
}

exports.createNewUrl = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = auth.verifyToken(token);
        const userId = decoded.email;

        let { originalUrl, customName, expiresIn } = req.body;
        customName = customName.replaceAll(' ', '-')

        if (!originalUrl) {
            return res.status(400).json({ error: 'Original URL is required' });
        }

        try {
            new URL(originalUrl);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const db = getDB();
        const urls = db.collection('urls');

        let shortId;
        if (customName) {
            const existingUrl = await urls.findOne({ shortId: customName });
            if (existingUrl) {
                return res.status(400).json({ error: 'Custom name is already taken' });
            }
            shortId = customName;
        } else {
            shortId = generateShortId();
            let exists = await urls.findOne({ shortId });
            while (exists) {
                shortId = generateShortId();
                exists = await urls.findOne({ shortId });
            }
        }
        const expiryDate = expiresIn ?
            new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000) :
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default: 30 days

        const newUrl = {
            uid: generateLinkId(userId),
            shortId,
            originalUrl,
            userId,
            clicks: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: expiryDate
        };

        await urls.insertOne(newUrl);

        res.status(201).json({
            shortUrl: `${config.BASE_URL}/u/${shortId}`,
            url: newUrl
        });
    } catch (err) {
        console.error('URL creation error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.userUrls = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = auth.verifyToken(token);
        const userId = decoded.email;

        const db = getDB();
        const urls = db.collection('urls');

        const userUrls = await urls.find({ userId }, { projection: { _id: 0 } })
            .sort({ createdAt: -1 }).toArray();

        res.json(userUrls);

    } catch (err) {
        console.error('URL fetch error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// exports.editUrl = async (req, res) => {
//     try {
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         const decoded = auth.verifyToken(token);
//         const userId = decoded.email;
//         const uid = req.params.id;

//         const { isActive } = req.body;

//         const db = getDB();
//         const urls = db.collection('urls');

//         const result = await urls.updateOne(
//             { uid, userId },
//             { $set: { isActive, updatedAt: new Date() } }
//         );

//         if (result.matchedCount === 0) {
//             return res.status(404).json({ error: 'URL not found' });
//         }

//         res.json({ message: 'URL updated successfully' });
//     } catch (err) {
//         console.error('URL update error:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

exports.editUrl = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = auth.verifyToken(token);
        const userId = decoded.email;
        const uid = req.params.id;
        const { isActive } = req.body;

        const db = getDB();
        const urls = db.collection('urls');

        // First get the current URL data
        const url = await urls.findOne({ uid, userId });
        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        const updateData = {
            isActive,
            updatedAt: new Date()
        };

        // If activating an expired URL, extend expiration by 1 month
        if (isActive && url.expiresAt && new Date(url.expiresAt) < new Date()) {
            const newExpiration = new Date();
            newExpiration.setMonth(newExpiration.getMonth() + 1);
            updateData.expiresAt = newExpiration;
        }

        const result = await urls.updateOne(
            { uid, userId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.json({ 
            message: 'URL updated successfully',
            expiresAt: updateData.expiresAt || url.expiresAt
        });
    } catch (err) {
        console.error('URL update error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUrl = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = auth.verifyToken(token);
        const userId = decoded.email;
        const uid = req.params.id;

        const db = getDB();
        const urls = db.collection('urls');

        const result = await urls.deleteOne({ uid, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.json({ message: 'URL deleted successfully' });
    } catch (err) {
        console.error('URL deletion error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}