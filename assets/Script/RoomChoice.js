cc.Class({
      extends: cc.Component,
  
      properties: {
            joinGameWindow: cc.Node,
            createRoomWindow: cc.Node,
            checkbox6Rounds: cc.Sprite,
            checkbox12Rounds: cc.Sprite,

            uncheckedSprite:cc.SpriteFrame,
            checkedSprite:cc.SpriteFrame,
      },

      // use this for initialization
      onLoad: function () {
            cc.utils.main.setFitScreenMode();
            this.selected6Rounds = false;
            this.on6RoundsSelected();
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
                        cc.utils.room_id = ret.room_id;
                        console.log(cc.utils.room_id);
                        cc.director.loadScene("PaohuZiGame");
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
                  createRoomCallback);
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
  