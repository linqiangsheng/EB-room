var users = {
    //room key : user name
};

var Room = function(io){
    io.on('connection', function (socket) {

        var _parseCookies = function (com) {
            var secret = "room V1.0.1";
            var cookies = require('cookie-parser/node_modules/cookie').parse(com.request.headers.cookie);
            if (secret) {
                var signedCookies = require('cookie-parser/lib/parse').signedCookies(cookies, secret);
                signedCookies = require('cookie-parser/lib/parse').JSONCookies(signedCookies);
            }
            return signedCookies["room"];
        }

        console.log('a user connected');

        socket.on('chat message', function (msg) {
            console.log('message: ' + msg);

            io.emit('chat message', msg);
        });
        socket.on("join", function (msg) {
            var sessionID = _parseCookies(socket);
            var name = msg["name"];
            var key = msg["key"];
            if(key != undefined){
                var speeches = global["speeches"][key];
                if(speeches == undefined){
                    speeches = {};
                }
                if(speeches["users"] == undefined){
                    speeches["users"] = {};
                }
                var firstWord = name.substr(0, 1);
                var user = {name : name, firstWorld : firstWord, sessionID : sessionID};
                speeches["users"][sessionID] = user;
                socket.emit('joined', user);
                io.emit('refreshUserList');
            }
        });

        socket.on("sendMessage", function(msg){
            var text = msg["message"];
            var sessionID = _parseCookies(socket);
            var authID = msg["sessionID"];
            var key = msg["key"];
            if(key != undefined){
                var speeches = global["speeches"][key];
                if(speeches == undefined){
                    speeches = {};
                }
                if(speeches["messages"] == undefined){
                    speeches["messages"] = [];
                }
                if(speeches["users"] == undefined){
                    speeches["users"] = {};
                }
                var user = speeches["users"][authID];
                if(user == undefined){
                    user = {};
                }
                user["sessionID"] = authID;
                var message = {user : user, message : text, time : new Date().toDateString()};
                speeches["messages"].push(message);
                io.emit("message", message);
            }
        });
        socket.on("init", function () {
            console.log("init")
        });
    });
}


module.exports = Room;