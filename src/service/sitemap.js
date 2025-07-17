const { SitemapStream } = require('sitemap');
const router = require('express').Router();
const config = require('../config/config');

router.get('/sitemap.xml', async (req, res) => {
    try {
        const links = [
            { url: '/', changefreq: 'daily', priority: 1.0 },
            { url: '/login', changefreq: 'monthly', priority: 0.7 },
            { url: '/dashboard', changefreq: 'daily', priority: 0.7 },
            { url: '/register', changefreq: 'monthly', priority: 0.5 },
        ];

        const isDev = config.NODE_ENV === 'development'
        const baseUrl = isDev
            ? `${config.BASE_URL}:${config.PORT}`
            : `${config.BASE_URL}`

        const stream = new SitemapStream({
            hostname: baseUrl,
            xmlns: {
                news: false,
                image: false,
                video: false
            }
        });

        res.header('Content-Type', 'application/xml');
        res.header('Cache-Control', 'public, max-age=3600');
        res.header('X-Robots-Tag', 'noindex');

        stream.pipe(res);
        links.forEach(link => stream.write(link));
        stream.end();
    } catch (e) {
        console.error('Sitemap Error:', e);
        res.status(500).send('Error generating sitemap');
    }
});

module.exports = router;