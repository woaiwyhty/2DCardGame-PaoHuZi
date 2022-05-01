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
  