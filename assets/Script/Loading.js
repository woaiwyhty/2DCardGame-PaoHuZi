// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
  
 	
    properties: {
        tipLabel:cc.Label,
        
    },
 
    // use this for initialization
    onLoad: function () {
        this.initFrameworks();
        cc.utils.main.setFitScreenMode();
        console.log(this.tipLabel.string);
        cc.utils.http.sendRequest("/isServerOn",{}, this.onServerOn, null, false, this.onServerOff.bind(this));
    },

    initFrameworks: function() {
        cc.utils = {};
        cc.utils.http = require("HTTPUtil");
        cc.utils.net = require("Net");
        cc.utils.net.ip = "192.168.1.8:9001";
        console.log(window.io,cc.utils.net);

        let gameNetworkingManager = require("GameNetworkingManager");
        cc.utils.gameNetworkingManager = new gameNetworkingManager();
        cc.utils.gameNetworkingManager.initEventHandlers();
        cc.utils.userInfo = {
            username: "",
            nickname: "",
            token: "",
            travellerMode: false,
        };
        let utilsMain = require("Utils");
        cc.utils.main = new utilsMain();

        let gameAlgo = require("GameAlgorithm");
        cc.utils.gameAlgo = new gameAlgo();

        let gameAudio = require("GameAudioEffect");
        cc.utils.gameAudio = new gameAudio();
        cc.utils.gameAudio.initAudios();
    },

    onServerOn: function(ret){
        cc.director.loadScene("Login");
    },

    onServerOff: function(ret){
        console.log("server is down!", ret);
        
        this.tipLabel.string = "连接服务器失败!";
        setTimeout(() => {
            cc.game.end();
        }, 2000);
    },
});
