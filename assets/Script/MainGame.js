cc.Class({
      extends: cc.Component,
    
      properties: {
            timeLabel: cc.Label,
            roomIdLabel: cc.Label,
      },
  
      // use this for initialization
      onLoad: function () {
            cc.utils.main.setFitScreenMode();
            this.roomIdLabel.string = cc.utils.room_id;
            this.initEventHandlers();
      },

      initEventHandlers: function() {
            cc.utils.gameNetworkingManager.dataEventHandler = this.node;
            this.node.on('exit_result', function (data) {
                  console.log('exit_result arrived');
                  if (data.errcode === 0) {
                        cc.utils.net.close();
                        cc.utils.room_id = null;
                        // cc.director.loadScene('RoomChoice');
                  } else {
                        cc.utils.wc.hide();
                  }
            });
            this.node.on('disconnect', function (data) {
                  console.log('disconnect arrived');
                  cc.director.loadScene('RoomChoice');
            });
      },

      onReturnToLobbyClicked: function() {
            cc.utils.gameNetworkingManager.exitToGameServer();
      },

      update: function() {
            let minutes = Math.floor(Date.now()/1000/60);
            if(this._lastMinute != minutes){
                this._lastMinute = minutes;
                let date = new Date();
                let h = date.getHours();
                h = h < 10 ? "0" + h : h;
                
                let m = date.getMinutes();
                m = m < 10 ? "0" + m : m;
                this.timeLabel.string = "" + h + ":" + m;             
            } 
      },
  });
    