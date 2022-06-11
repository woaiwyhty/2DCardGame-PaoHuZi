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
                        self.dispatchEvent('other_player_action', data);
                  }
            });
            cc.utils.net.addHandler("other_player_hu", function(data){
                  console.log("other_player_hu received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('other_player_hu', data);
                  }
            });
            cc.utils.net.addHandler("need_shoot", function(data){
                  console.log("need_shoot received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('need_shoot', data);
                  }
            });
            cc.utils.net.addHandler("dealed_card", function(data){
                  console.log("dealed_card received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('dealed_card', data);
                  }
            });
            cc.utils.net.addHandler("other_player_shoot", function(data){
                  console.log("other_player_shoot received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('other_player_shoot', data);
                  }
            });
            cc.utils.net.addHandler("check_dihu", function(data){
                  console.log("check_dihu received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('check_dihu', data);
                  }
            });
            cc.utils.net.addHandler("self_action_result", function(data){
                  console.log("self_action_result received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('self_action_result', data);
                  }
            });
            cc.utils.net.addHandler("discarded_dealed_card", function(data){
                  console.log("discarded_dealed_card received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('discarded_dealed_card', data);
                  }
            });
            cc.utils.net.addHandler("wang_hu", function(data){
                  console.log("wang_hu received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('wang_hu', data);
                  }
            });

            cc.utils.net.addHandler("askGameReady", function(data){
                  console.log("askGameReady received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('askGameReady', data);
                  }
            });

            cc.utils.net.addHandler("timer_passed", function(data){
                  console.log("timer_passed received!!!  ", data);

                  if (data.errcode === 0) {
                        self.dispatchEvent('timer_passed', data);
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

      takeHuAction: function(huResult, sessionKey, seat_id) {
            let data = {
                  status: huResult.status,
                  fan: huResult.fan,
                  xi: huResult.xi,
                  tun: huResult.tun,
                  huInfo: huResult.huInfo,
                  cardsGroups: huResult.cardsGroups,
                  sessionKey: sessionKey,
                  seat_id: seat_id,
            }
            cc.utils.net.send('hu', data);
      },

      takeNormalAction: function(type, opCard, cards, needsHide = false, sessionKey = null, from_wei_or_peng = 0) {
            console.log("takeNormalAction is called!  ", sessionKey);
            let data = {
                  username: cc.utils.userInfo.username,
                  token: cc.utils.userInfo.token,
                  seat_id: cc.utils.roomInfo.my_seat_id,
                  opCard: opCard,
                  cards: cards,
                  needsHide: needsHide,
                  sessionKey: sessionKey,
                  from_wei_or_peng: from_wei_or_peng,
                  time: Date.now(),
            }

            cc.utils.net.send(type, data);
      },

      takeGuoAction: function(isDoneByUser, sessionKey) {
            console.log("takeGuoAction is called!  ", sessionKey);
            let data = {
                  username: cc.utils.userInfo.username,
                  token: cc.utils.userInfo.token,
                  seat_id: cc.utils.roomInfo.my_seat_id,
                  isDoneByUser: isDoneByUser,
                  sessionKey: sessionKey,
                  time: Date.now(),
            };

            cc.utils.net.send('guo', data);
      },

      takeChiAction: function(manyCards, sessionKey = null) {
            let data = {
                  manyCards: manyCards,
                  sessionKey: sessionKey,
                  token: cc.utils.userInfo.token,
            };
            cc.utils.net.send('chi', data);
      },

      shootCard: function(type, opCard) {
            console.log("shootCard is called!");
            let data = {
                  opCard: opCard,
                  type: type,
                  time: Date.now(),
            };

            cc.utils.net.send('shootCard', data);
      },
  
      // called every frame, uncomment this function to activate update callback
      // update: function (dt) {
  
      // },
  });
  