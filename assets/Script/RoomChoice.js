cc.Class({
      extends: cc.Component,
  
      properties: {
            joinGameWindow: cc.Node,
            createRoomWindow: cc.Node,
      },

      // use this for initialization
      onLoad: function () {
          
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
});
  