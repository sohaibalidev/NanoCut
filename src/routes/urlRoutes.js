const express = require('express');
const router = express.Router();

const { createNewUrl, userUrls, deleteUrl, editUrl } = require('../controllers/urlController');

router.delete('/urls/:id', deleteUrl);
router.post('/urls', createNewUrl);
router.put('/urls/:id', editUrl);
router.get('/urls', userUrls);

module.exports = router;
