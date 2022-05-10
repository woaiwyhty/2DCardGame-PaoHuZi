cc.Class({
    extends: cc.Component,

    properties: {
        nums: {
            default: [],
            type: [cc.Label]
        },
        _inputIndex:0,
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        
    },
    
    onEnable: function(){
        this.onResetClicked();
    },
    
    onInputFinished: function(roomId) {
        let joinRoomCallback = (ret) => {
            if (ret.errcode == 0){
                this.node.active = false;
                cc.utils.joinRoom(roomId);
                // cc.utils.room_id = ret.room_id;
                // window.io.co
                // cc.director.loadScene("PaohuZiGame");
            }
            else {
                let content = "";
                if (ret.errcode === 1) {
                    content = "房间[" + roomId + "]不存在，请重新输入!";
                } else if (ret.errcode === 2) {
                    content = "房间[" + roomId + "]已满!";
                } else if (ret.errcode === 3) {
                    content = "您已经在别的房间!";
                } else {
                    content = ret.errmsg;
                }
                cc.utils.alert.show("提示", content);
                this.onResetClicked();
            }
        };
        cc.utils.http.sendRequest(
            "/joinRoom", 
            { 
                username: cc.utils.userInfo.username, 
                token: cc.utils.userInfo.token,
                room_id: roomId,
            }, 
            joinRoomCallback.bind(this)
        );

    },
    
    onInput: function(num){
        if(this._inputIndex >= this.nums.length){
            return;
        }
        this.nums[this._inputIndex].string = num;
        this._inputIndex += 1;
        
        if(this._inputIndex == this.nums.length){
            var roomId = this.parseRoomID();
            console.log("ok:" + roomId);
            this.onInputFinished(roomId);
        }
    },
    
    onN0Clicked: function(){
        this.onInput(0);  
    },
    onN1Clicked: function(){
        this.onInput(1);  
    },
    onN2Clicked: function(){
        this.onInput(2);
    },
    onN3Clicked :function(){
        this.onInput(3);
    },
    onN4Clicked: function(){
        this.onInput(4);
    },
    onN5Clicked: function(){
        this.onInput(5);
    },
    onN6Clicked: function(){
        this.onInput(6);
    },
    onN7Clicked: function(){
        this.onInput(7);
    },
    onN8Clicked: function(){
        this.onInput(8);
    },
    onN9Clicked: function(){
        this.onInput(9);
    },
    onResetClicked: function(){
        for(var i = 0; i < this.nums.length; ++i){
            this.nums[i].string = "";
        }
        this._inputIndex = 0;
    },

    parseRoomID: function(){
        let str = "";
        for(let i = 0; i < this.nums.length; ++i){
            str += this.nums[i].string;
        }
        return parseInt(str);
    }
});
