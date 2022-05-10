cc.Class({
      extends: cc.Component,
  
      properties: {
          dataEventHandler:null,
          roomId:null,
          maxNumOfGames:0,
          numOfGames:0,
          numOfMJ:0,
          seatIndex:-1,
          seats:null,
          turn:-1,
          button:-1,
          dingque:-1,
          chupai:-1,
          isDingQueing:false,
          isHuanSanZhang:false,
          gamestate:"",
          isOver:false,
          dissoveData:null,
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

          
      clear: function(){
            this.dataEventHandler = null;
            if (this.isOver == null) {
                  this.seats = null;
                  this.roomId = null;
                  this.maxNumOfGames = 0;
                  this.numOfGames = 0;        
            }
      },
        
      dispatchEvent: function(event,data){
            if (this.dataEventHandler) {
                  this.dataEventHandler.emit(event,data);
            }    
      },
        
      initEventHandlers: function() {
            let self = this;
            cc.utils.net.addHandler("login_result",function(data){
                self.dispatchEvent('login_result', data);
            });

            cc.utils.net.addHandler("exit_result",function(data){
                  self.dispatchEvent('exit_result', data);
            });

            cc.utils.net.addHandler("disconnect",function(data){
                  self.dispatchEvent('disconnect', data);
            });
      },
      
      connectToGameServer: function(data){
            this.dissoveData = null;
            // console.log(cc.utils.net.ip);
    
            let onConnectOK = function(){
                console.log("onConnectOK");
                var sd = {
                    token: data.token,
                    room_id: data.room_id,
                    time: data.time,
                    username: data.username,
                };
                cc.utils.net.send("login", sd);
            };
            
            let onConnectFailed = function(){
                console.log("failed.");
                cc.utils.wc.hide();
            };

            cc.utils.wc.show("正在加入房间");
            cc.utils.net.connect(onConnectOK, onConnectFailed);
      },

      exitToGameServer: function() {
            let data = {
                  username: cc.utils.userInfo.username,
                  token: cc.utils.userInfo.token,
                  room_id: cc.utils.room_id,
                  time: Date.now()
            }

            cc.utils.wc.show("正在退出房间");
            cc.utils.net.send("exit", data);
      },


  
      // called every frame, uncomment this function to activate update callback
      // update: function (dt) {
  
      // },
  });
  