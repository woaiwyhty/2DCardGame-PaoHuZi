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
        cc.utils.http.sendRequest("/isServerOn",{}, this.onServerOn.bind(this), null, false, this.onServerOff.bind(this));
    },

    testGameAlgorithm: function() {
        const data = {
            'x1' : 1,
            'x2' : 2,
            'x3' : 1,
            'x4' : 2,
            'x5' : 2,
            'x6' : 2,
            'x7' : 1,
            'x8' : 1,
            'x9' : 0,
            'x10' : 1,
            'd1' : 1,
            'd2' : 2,
            'd3' : 1,
            'd4' : 2,
            'd5' : 1,
            'd6' : 0,
            'd7' : 1,
            'd8' : 0,
            'd9' : 0,
            'd10' : 0
        };
        let cardsOnHand = new Map(Object.entries(data));
    
        console.log(cc.utils.gameAlgo.checkChi('x2', cardsOnHand).chiWays)
    },

    initFrameworks: function() {
        cc.utils = {};
        cc.utils.http = require("HTTPUtil");
        cc.utils.net = require("Net");
        // cc.utils.net.ip = "43.138.67.153:9001";
        cc.utils.net.ip = "http://192.168.1.12:9001";

        console.log(window.io,cc.utils.net);

        let gameNetworkingManager = require("GameNetworkingManager");
        cc.utils.gameNetworkingManager = new gameNetworkingManager();
        cc.utils.gameNetworkingManager.initEventHandlers();
        cc.utils.userInfo = {
            username: "",
            nickname: "",
            token: "",
            currentXi: 0,
            currentScore: 0,
            travellerMode: false,
        };
        let utilsMain = require("Utils");
        cc.utils.main = new utilsMain();

        let gameAlgo = require("GameAlgorithm");
        cc.utils.gameAlgo = new gameAlgo();

        let gameAudio = require("GameAudioEffect");
        cc.utils.gameAudio = new gameAudio();
        cc.utils.gameAudio.initAudios();

        // this.testGameAlgorithm();
    },

    onServerOn: function(ret){
        this.tipLabel.string = "正在预加载游戏...";
        cc.director.preloadScene("PaohuZiGame", function () {
            console.log('MainGame preloaded');
            cc.director.loadScene("Login");
        });
    },

    onServerOff: function(ret){
        console.log("server is down!", ret);
        
        this.tipLabel.string = "连接服务器失败!";
        setTimeout(() => {
            cc.game.end();
        }, 2000);
    },
});
