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
    