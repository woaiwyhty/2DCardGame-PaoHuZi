cc.Class({
    extends: cc.Component,
  
    properties: {
        inputName:cc.EditBox,
    },
    
    onRandomBtnClicked:function(){
        var names = [
            "上官",
            "欧阳",
            "东方",
            "端木",
            "独孤",
            "司马",
            "南宫",
            "夏侯",
            "诸葛",
            "皇甫",
            "长孙",
            "宇文",
            "轩辕",
            "东郭",
            "子车",
            "东阳",
            "子言",
        ];
        
        var names2 = [
            "雀圣",
            "赌侠",
            "赌圣",
            "稳赢",
            "不输",
            "好运",
            "自摸",
            "有钱",
            "土豪",
        ];
        var idx = Math.floor(Math.random() * (names.length - 1));
        var idx2 = Math.floor(Math.random() * (names2.length - 1));
        this.inputName.string = names[idx] + names2[idx2];
    },

    // use this for initialization
    onLoad: function () {
        cc.utils.main.setFitScreenMode();
        this.onRandomBtnClicked();
    },

    onBtnConfirmClicked:function(){
        var name = this.inputName.string;
        if(name == ""){
            console.log("invalid name.");
            return;
        }
        cc.utils.userInfo.nickname = name;
        cc.utils.userInfo.travellerMode = true;

        var guestSignupCallback = function(ret) {
            if (ret.errcode === 0) {
                cc.utils.userInfo.token = ret.token;
                cc.director.loadScene("RoomChoice");
            }
        };

        cc.utils.http.sendRequest("/guestSignup", {
            username: cc.utils.userInfo.username, 
            nickname: name
        }, guestSignupCallback);
        
    }
});
  