var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('admin/index', { title: 'Express', url: req.param("url")});
});

router.post('/', function (req, res) {
    var host = req.headers.host;
    var url = req.param('url');
    var title = req.param('title');
    var speaker = req.param('speaker');
    url = url ? url.trim() : "";
    title = title ? title.trim() : "";
    speaker = speaker ? speaker.trim() : "";
    var md5 = crypto.createHash("md5");
    md5.update(url + title + speaker);
    md5 = md5.digest("hex");
    global["speeches"][md5] = {url: url, title: title, speaker: speaker};
    res.render('admin/success', {md5 : md5, host : host, title : 'EB Room'});
});

module.exports = router;
