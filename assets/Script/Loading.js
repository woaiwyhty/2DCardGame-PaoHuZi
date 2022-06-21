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
        let cardsOnHand = new Map();
        for (let i = 1; i <= 20; ++i) {
            let key = 'x' + i.toString();
            if (i > 10) {
                key = 'd' + (i - 10).toString();
            }
            cardsOnHand.set(key, 0);
        }


        cardsOnHand.set('x3', 3);
        cardsOnHand.set('d2', 3);
        cardsOnHand.set('d7', 3);
        cardsOnHand.set('d10', 3);
        cardsOnHand.set('x10', 3);
        cardsOnHand.set('x1', 2);

        let start = Date.now();
        console.log(cc.utils.gameAlgo.checkHu([{
            type:'ti',
            cards: ['d1', 'd1', 'd1', 'd1'],
            xi: 12
        }], cardsOnHand));
        console.log("time consume  ", Date.now() - start);
    },

    testGameAlgorithm1: function() {
        let times = [];
        let cards = [];
        for (let i = 0; i < 100; ++i) {
            let cardsOnHand = cc.utils.gameAlgo.dealWhenGameStarts();
            // for (const [k, v] of cardsOnHand.entries()) {
            //     console.log(k, v);
            // }

            for (let j = 1; j <= 1; ++j) {
                let key = 'x' + j.toString();
                if (j > 10) {
                    key = 'd' + (j - 10).toString();
                }
                let start = Date.now();
                cc.utils.gameAlgo.checkHu([], cardsOnHand, key);
                times.push(Date.now() - start);
            }
            cards.push(cardsOnHand);
        }

        let maxTime = 0, maxCards = null;
        let sum = times.reduce((a, b) => a + b, 0);
        for (let i = 0; i < times.length; ++i) {
            if (times[i] > maxTime) {
                maxTime = times[i];
                maxCards = cards[i]
            }
        }
        console.log("testGameAlgorithm complete  ", sum, sum / times.length, Math.max(...times));
        console.log(maxTime, maxCards);
    },

    initFrameworks: function() {
        cc.utils = {};
        cc.utils.http = require("HTTPUtil");
        cc.utils.net = require("Net");
        cc.utils.net.ip = "43.138.67.153:9001";
        // cc.utils.net.ip = "http://192.168.1.7:9001";

        console.log(window.io,cc.utils.net.ip);

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
