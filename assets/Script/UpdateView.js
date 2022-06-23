// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
    },

    onEnable: function() {
        cc.director.on('HotUpdateFinish',this.onHotUpdateFinish, this);
        cc.director.on('HotUpdateRate', this.onHotUpdateRate, this);
    },

    onDisable: function() {
        cc.director.off('HotUpdateFinish',this.onHotUpdateFinish, this);
        cc.director.off('HotUpdateRate', this.onHotUpdateRate, this);
    },


    onUpdateFinish: function () {
        this.tipLabel.string = "正在预加载游戏...";
        cc.director.preloadScene("PaohuZiGame", function () {
            console.log('MainGame preloaded');
            cc.director.loadScene("Login");
        });
    },

    onHotUpdateFinish: function (param) {
        let result = param;
        if (result) {
            this.onUpdateFinish();
        } else {
            this.onUpdateFinish();
        }
    },

    onHotUpdateRate: function (param) {
        let percent = param;
        if (percent > 1) {
            percent = 1;
        }

        this._updatePercent = percent;
        this.tipLabel.string = '正在更新游戏资源，更新进度'+ parseInt(percent * 100)+'%';
    },
    // update (dt) {},
});
