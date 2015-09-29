var key = $.trim($("#input-key").val());
var sessionID = $("#input-sessionID").val();
var socket = io();

socket.on("message", function (msg) {
    var source = $("#tpl-message-list").html();
    var template = Handlebars.compile(source);
    var messages = [];
    if(msg['user']["sessionID"] == sessionID){
        msg['user']["isMine"] = true;
    }
    messages.push(msg);
    var html = template({messages: messages});
    $("#li-message-list").append(html);
    $(".room .content ul").scrollTop($(".room .content ul")[0].scrollHeight);
});

var closeWrapper = function (msg) {
    $(".room .wrapper").remove();
    $("#div-send-box .portrait").text(msg["firstWorld"]);
    $("#div-send-box .portrait").attr("title", msg["name"]);
    sessionID = msg["sessionID"];
    $("#input-sessionID").val(msg["sessionID"]);
}

var findUserList = function (key) {
    $.get("room/" + key + "/users", function (data) {
        if (data.state == 200) {
            var source = $("#tpl-user-list").html();
            var template = Handlebars.compile(source);
            var html = template({users: data["users"], size: data["size"]});
            $("#div-user-list").html(html);
        }
    });
}
findUserList(key);

var findMessageList = function (key) {
    $.get("room/" + key + "/messages", function (data) {
        console.log(data);
        if (data.state == 200) {
            var source = $("#tpl-message-list").html();
            var template = Handlebars.compile(source);
            $.each(data["messages"], function(i, v){
                if(v['user']['sessionID'] == sessionID){
                    v['user']['isMine'] = true;
                }
            })
            var html = template({messages: data["messages"]});
            $("#li-message-list").html(html);
            $(".room .content ul").scrollTop($(".room .content ul")[0].scrollHeight);
        }
    });
}
findMessageList(key);

socket.on('joined', function (msg) {
    closeWrapper(msg);
});

socket.on('refreshUserList', function(msg){
    findUserList(key);
});

var x = $("#content-inner").width() * 7 / 12;
var y = x * 0.56;

jwplayer('myplayer').setup({
    file         : $("#url").val(),
    controlbar   : "over",//控制条位置
    screencolor  : "#fff",//播放器颜色
    repeat       : "always",//重复播放
    autostart    : true,//自动播放
    width        : x,
    height       : y,
    label        : "1024x720",
    stretching: "exactfit"
});
var el_can = $("#myplayer");
el_can.parent().css("height", 700).css("background", "#000");
el_can.css("margin-top", (700 - y) / 2);
$("#btn-join").click(function () {
    var el_input = $("#input-name");
    var name = $.trim(el_input.val());
    if (name != "") {
        socket.emit("join", {name: name, key: key});
    }
});

$("#btn-send").click(function () {
    var el_input = $("#input-message");
    var message = el_input.val();
    if (message != "") {
        socket.emit("sendMessage", {message: message, key: key, sessionID: sessionID});
    }
    el_input.val("");
});

$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        $("#btn-send").trigger("click");
    }
});

