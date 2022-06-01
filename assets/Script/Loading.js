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

    testGameAlgorithm: function() {
        let cardsAlreadyUsed = [
            {
                type: 'chi',
                cards: ['x6', 'x7', 'x8'],
                xi: 0,
            },
            {
                type: 'peng',
                cards: ['x1', 'x1', 'x1'],
                xi: 1,
            },
            {
                type: 'wei',
                cards: ['back', 'back', 'x3'],
                xi: 3,
            },
            {
                type: 'pao',
                cards: ['d3', 'd3', 'd3', 'd3'],
                xi: 9,
            },
            {
                type: 'peng',
                cards: ['d10', 'd10', 'd10'],
                xi: 3,
            },
        ]
    
        let cardsOnHand = new Map();
        for (let i = 1; i <= 20; ++i) {
            let key = 'x' + i.toString();
            if (i > 10) {
                key = 'd' + (i - 10).toString();
            }
    
            cardsOnHand.set(key, 0);
        }
    
        cardsOnHand.set('x9', 2);
        cardsOnHand.set('d7', 1);
        cardsOnHand.set('d8', 1);
        cardsOnHand.set('d9', 1);
        console.log("test result  ", cc.utils.gameAlgo.checkHu(cardsAlreadyUsed, cardsOnHand))
    },

    initFrameworks: function() {
        cc.utils = {};
        cc.utils.http = require("HTTPUtil");
        cc.utils.net = require("Net");
        cc.utils.net.ip = "43.138.67.153:9001";
        // cc.utils.net.ip = "http://192.168.1.12:9001";

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
