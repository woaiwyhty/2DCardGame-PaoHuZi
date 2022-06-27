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
        manifestUrl: cc.Asset,
        versionLabel: {
            default: null,
            type: cc.Label,
        },

        _updating: false,
        _canRetry: false,
        _storagePath: ''
    },
 
    // use this for initialization
    onLoad: function () {
        this.initFrameworks();
        cc.utils.main.setFitScreenMode();
        console.log(this.tipLabel.string);
        cc.utils.http.sendRequest("/isServerOn",{}, this.onServerOn.bind(this), null, false, this.onServerOff.bind(this));
    },

    onDestroy: function () {
        if (this._am) {
            this._am.setEventCallback(null);
            this._am = null;
        }
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

    showLog: function (msg) {
        cc.log('[HotUpdateModule][showLog]----' + msg);
    },

    onServerOn: function(ret){
        this.tipLabel.string = '正在检查更新...';
        this.initHotUpdate();
        if (cc.sys.isNative) {
            this.checkUpdate();
            return;
        }
        
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

    initHotUpdate: function () {
        if (!cc.sys.isNative) {
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'qygame-remote-asset');

        this.versionCompareHandle = function (versionA, versionB) {
            console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);

            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                } else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        this._am = new jsb.AssetsManager(this.manifestUrl.nativeUrl, this._storagePath, this.versionCompareHandle);
        console.log("AssetsManager, ", this.manifestUrl.nativeUrl)
        this._am.setVerifyCallback(function (filePath, asset) {
            return true;
        });

        if (this.versionLabel) {
            console.log("local manifest  ", this._am.getLocalManifest());
            this.versionLabel.string = `${this._am.getLocalManifest().getVersion()}`;
        }
  
        //初始化脚本版本信息
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            //一些安卓设备不支持同时下载文件过多
            this._am.setMaxConcurrentTask(2);
        } else {
            this._am.setMaxConcurrentTask(2);
        }
    },

    retry: function () {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            this._am.downloadFailedAssets();
        }
    },

    updateCallback: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.showLog("没有发现本地manifest文件，跳过了热更新.");
                failed = true;
                break;
            //更新进度
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let percent = event.getPercent();
                if (isNaN(percent)) return;
                var msg = event.getMessage();
                this.disPatchRateEvent(percent, msg);
                this.showLog("updateCallback更新进度：" + percent + ', msg: ' + msg);
                break;

            //下载manifest文件失败，跳过热更新
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.showLog("下载manifest文件失败，跳过热更新.");
                failed = true;
                break;

            //已是最新版本
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.showLog("已是最新版本.");
                failed = true;
                break;
            //更新结束
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.showLog("更新结束."+ event.getMessage());
                this.disPatchRateEvent(1);
                needRestart = true;
                break;
            //更新错误
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.showLog("更新错误."+ event.getMessage());
                this._updating = false;
                this._canRetry = true;
                this._failCount++;
                this.retry();
                break;
            //更新过程中错误
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.showLog('更新过程中错误: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            //解压错误
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.showLog('解压错误');
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
        }
        
        if (needRestart) {
            this._am.setEventCallback(null);
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift.apply(searchPaths, newPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.audioEngine.stopAll();
            setTimeout(() => {
                cc.game.restart();
            }, 100);
        }
    },

    hotUpdate: function () {
        this.showLog("hotUpdate is called");
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCallback.bind(this));
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                var url = this.manifestUrl.nativeUrl;
                if (cc.assetManager.md5Pipe) {
                    url = cc.assetManager.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }
            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },

    checkCallback: function (event) {
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.showLog("没有发现本地manifest文件，跳过了热更新.");
                this.hotUpdateFinish(true);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.showLog("下载manifest文件失败，跳过热更新.");
                this.hotUpdateFinish(false);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.showLog("已更新.");
                this.hotUpdateFinish(true);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND: {
                //有新版本
                this.showLog("有新版本,需要更新");
                this._updating = false;
                this.hotUpdate();
                return;
            }
            case jsb.EventAssetsManager.UPDATE_PROGRESSION: {
                //有新版本
                let percent = event.getPercent();
                if (isNaN(percent)) return;
                var msg = event.getMessage();
                this.showLog("checkCallback更新进度：" + percent + ', msg: ' + msg);
                return;
            }
            default:
                console.log('event.getEventCode():' + event.getEventCode());
                return;
        }
        this._am.setEventCallback(null);
        this._updating = false;
    },

    checkUpdate: function () {
        if (this._updating) {
            cc.log("检测更新中...");
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var url = this.manifestUrl.nativeUrl;
            if (cc.assetManager.md5Pipe) {
                url = cc.assetManager.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.showLog('加载manifest文件失败');
            return;
        }
        this._am.setEventCallback(this.checkCallback.bind(this));
        this._am.checkUpdate();
        this._updating = true;
        this.disPatchRateEvent(0.01);
    },

    hotUpdateFinish: function (result) {
        cc.director.emit('HotUpdateFinish',result);
    },

    disPatchRateEvent: function (percent) {
        if (percent > 1) {
            percent = 1;
        }
        cc.director.emit('HotUpdateRate',percent);
    },
});
