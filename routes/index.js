var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/room', function (req, res) {
    var sessionID = req.session.id;
    var speech = global["speeches"][req.param("key")];
    if (speech == undefined) {
        res.render('admin/index', { title: 'Express', url: req.param("url")});
    } else {
        var responseBody = {
            title  : 'Express',
            url    : speech.url,
            title  : speech.title,
            speaker: speech.speaker,
            key    : req.param("key"),
            user   : false
        };
        if (speech['users'] != undefined && speech['users'][sessionID] != undefined) {
            responseBody['user'] = speech['users'][sessionID];
            responseBody['user']['sessionID'] = sessionID;
        }
        res.render('index', responseBody);
    }
});

router.get("/room/:key/users", function (req, res) {
    var speech = global["speeches"][req.param("key")];
    if (speech != undefined && speech["users"] != undefined) {
        var size = Object.keys(speech["users"]).length;
        res.send({state: 200, users: speech["users"], size: size});
    } else {
        res.send({state: 200, users: [], size: 0});
    }
});

router.get("/room/:key/messages", function (req, res) {
    var sessionID = req.session.id;
    var speech = global["speeches"][req.param("key")];
    if (speech != undefined && speech["messages"] != undefined) {
        res.send({state: 200, messages: speech["messages"], sessionID: sessionID});
    } else {
        res.send({state: 200, messages: [], sessionID: sessionID});
    }
});

module.exports = router;
