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
        username: cc.EditBox,
        password: cc.EditBox,
        status: cc.Label,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.utils.main.setFitScreenMode();
    },

    start () {

    },

    onTravellerLogin() {
        var account = cc.sys.localStorage.getItem("account");
        if (account == null){
            account = Date.now();
            cc.sys.localStorage.setItem("account", account);
        }

        var travellerLoginCallback = function(ret) {
            if (ret.errcode === 1) {
                cc.director.loadScene("CreateRole");
            } else if (ret.errcode === 0) {
                // cc.director.loadScene("PaohuZiGame");
                cc.utils.userInfo.token = ret.token;
                cc.utils.userInfo.nickname = ret.nickname;
                cc.director.loadScene("RoomChoice");
            }
        }
        cc.utils.userInfo.username = account.toString();
        cc.utils.http.sendRequest("/guestLogin", {username: account}, travellerLoginCallback);
    },

    onUsernameLogin() {
        if (this.username.string.length < 6 || this.password.string.length < 6) {
            this.status.string = "帐号或密码太短!";
            return;
        }
        this.status.string = "正在登录...";
    },

    onWxLoginClicked() {
        
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","wxLogin","()V");
        this.schedule(function(){
           var wxLoginSuccess = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","wxLoginIsSuccess","()Z");
           console.log("is success " + wxLoginSuccess);
           if(wxLoginSuccess){
               //获得授权信息
               var autoInfo = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getWxAutoMessage","()Ljava/lang/String;");
               var jsonInfo = JSON.parse(autoInfo);
               console.log("jsonInfo is " + jsonInfo);
               console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$" + autoInfo);
               //如果登录成功的话将授权信息发送给后端
               console.log("autoInfo is " + autoInfo);
               //关闭所有计数器
               this.unscheduleAllCallbacks(); 
               if(autoInfo != ""){
                   // need to send info to server
                    //this.sendRequestToWXServer(autoInfo);
               }
               
           }
        }, 0.5);
    },

    // update (dt) {},
});
