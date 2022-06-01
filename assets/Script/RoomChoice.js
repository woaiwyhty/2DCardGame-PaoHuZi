cc.Class({
      extends: cc.Component,
  
      properties: {
            waitingConnection: cc.Node,
            joinGameWindow: cc.Node,
            createRoomWindow: cc.Node,
            checkbox6Rounds: cc.Sprite,
            checkbox12Rounds: cc.Sprite,

            uncheckedSprite:cc.SpriteFrame,
            checkedSprite:cc.SpriteFrame,
      },

      // use this for initialization
      onLoad: function () {
            cc.utils.joinRoom = this.joinRoom;
            // this.waitingConnection.active = false;
            cc.utils.main.setFitScreenMode();
            this.initEventHandlers();
            
            this.selected6Rounds = false;
            this.on6RoundsSelected();
      },

      initEventHandlers: function() {
            cc.utils.gameNetworkingManager.dataEventHandler = this.node;
            this.node.on('login_result', function (data) {
                  console.log('login_result arrived', data);
                  if (data.errcode === 0) {
                        cc.utils.roomInfo = {
                              room_id: data.room_id,
                              my_seat_id: data.seat_id,
                              other_players: data.other_players,
                        }
                        cc.utils.wc.hide();
                        cc.director.loadScene("PaohuZiGame");
                  }
            });
      },

      onCreateRoomClicked: function() {
            this.createRoomWindow.active = true;
      },

      onJoinRoomClicked: function() {
            this.joinGameWindow.active = true;
      },

      onCloseCreateRoomClicked: function() {
            this.createRoomWindow.active = false;
      },

      onCloseJoinRoomClicked: function() {
            this.joinGameWindow.active = false;
      },

      onCreateRoomConfirmButtonClicked: function() {
            let createRoomCallback = (ret) => {
                  console.log(ret);
                  if (ret.errcode === 0) {
                        this.joinRoom(ret.room_id);
                  } else {
                        cc.utils.alert.show("提示", ret.errmsg);
                  }
            };
            let num_of_games = 6;
            if (!this.selected6Rounds) {
                  num_of_games = 12;
            }
            cc.utils.http.sendRequest("/createRoom", 
                  { username: cc.utils.userInfo.username, token: cc.utils.userInfo.token, num_of_games: num_of_games }, 
                  createRoomCallback.bind(this));
      },

      joinRoom: function(room_id) {
            cc.utils.gameNetworkingManager.connectToGameServer({
                  username: cc.utils.userInfo.username,
                  token: cc.utils.userInfo.token,
                  room_id: room_id,
                  time: Date.now(),
            });
            // cc.utils.room_id = room_id;
            // cc.director.loadScene("PaohuZiGame");
      },

      on6RoundsSelected: function() {
            console.log("on6RoundsSelected");
            if (this.selected6Rounds) {
                  return;
            }
            this.selected6Rounds = true;
            this.checkbox6Rounds.spriteFrame = this.checkedSprite;
            this.checkbox12Rounds.spriteFrame = this.uncheckedSprite;
      },
      
      on12RoundsSelected: function() {
            console.log("on12RoundsSelected");
            if (!this.selected6Rounds) {
                  return;
            }
            this.selected6Rounds = false;
            this.checkbox6Rounds.spriteFrame = this.uncheckedSprite;
            this.checkbox12Rounds.spriteFrame = this.checkedSprite;
      },
});
  