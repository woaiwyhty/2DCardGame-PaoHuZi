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

            cc.utils.net.addHandler("new_player_entered_room",function(data){
                  self.dispatchEvent('new_player_entered_room', data);
            });
            cc.utils.net.addHandler("other_player_exit",function(data){
                  self.dispatchEvent('other_player_exit', data);
            });
            cc.utils.net.addHandler("game_start", function(data) {
                  console.log("game_start received!!!  ", data);
                  if (data.errcode === 0) {
                        self.dispatchEvent('game_start', data);
                  }
            });
            cc.utils.net.addHandler("cardsOnHand_result", function(data){
                  console.log("cardsOnHand_result received!!!  ", data);

                  if (data.errcode === 0) {
                        data.cardsOnHand = new Map(data.cardsOnHand);
                        self.dispatchEvent('cardsOnHand_result', data);
                  }
            });
            cc.utils.net.addHandler("other_player_action", function(data){
                  console.log("other_player_action received!!!  ", data);

                  if (data.errcode === 0) {
                        data.cardsOnHand = new Map(data.cardsOnHand);
                        self.dispatchEvent('other_player_action', data);
                  }
            });
            cc.utils.net.addHandler("need_shoot", function(data){
                  console.log("need_shoot received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('need_shoot', data);
                  }
            });
            cc.utils.net.addHandler("other_player_shoot", function(data){
                  console.log("other_player_shoot received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('other_player_shoot', data);
                  }
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
                  room_id: cc.utils.roomInfo.room_id,
                  time: Date.now()
            }

            cc.utils.wc.show("正在退出房间");
            cc.utils.net.send("exit", data);
      },

      checkIfGameReady: function() {
            console.log("checkIfGameReady is called!");
            let data = {
                  username: cc.utils.userInfo.username,
                  token: cc.utils.userInfo.token,
                  room_id: cc.utils.roomInfo.room_id,
            }

            cc.utils.net.send("ifGameReady", data);
      },

      askForCardsOnHand: function() {
            console.log("askForCardsOnHand is called!");
            let data = {
                  username: cc.utils.userInfo.username,
                  token: cc.utils.userInfo.token,
                  time: Date.now()
            }

            cc.utils.wc.show("正在开始游戏");
            cc.utils.net.send("cardsOnHand", data);
      },

      takeNormalAction: function(type, opCard, cards, needsHide = false) {
            console.log("takeNormalAction is called!");
            let data = {
                  username: cc.utils.userInfo.username,
                  token: cc.utils.userInfo.token,
                  opCard: opCard,
                  cards: cards,
                  needsHide: needsHide,
                  time: Date.now(),
            }

            cc.utils.net.send(type, data);
      },

      shootCard: function(type, opCard) {
            console.log("shootCard is called!");
            let data = {
                  opCard: opCard,
                  type: type,
                  time: Date.now(),
            }

            cc.utils.net.send('shootCard', data);
      },

  
      // called every frame, uncomment this function to activate update callback
      // update: function (dt) {
  
      // },
  });
  