cc.Class({
      extends: cc.Component,
    
      properties: {
            timeLabel: cc.Label,
            roomIdLabel: cc.Label,
            remainNumOfGamesLabel: cc.Label,
            delayMSLabel: cc.Label,
            delayMSNode: cc.Node,
      },
  
      // use this for initialization
      onLoad: function () {
            cc.utils.main.setFitScreenMode();
            this.roomIdLabel.string = cc.utils.roomInfo.room_id;
            this.initSeatView();
            this.initEventHandlers();
            this.initCardSetView();

            this.red = new cc.Color(205,0,0);
            this.green = new cc.Color(0,205,0);
            this.yellow = new cc.Color(255,200,0); 
      },

      initCardSetView: function() {
            this.backCards = [];
            this.baseCardNode = cc.find("Canvas/Game/CardSetEffect/CardBlind");
            this.cardSetNode = cc.find("Canvas/Game/CardSetEffect");
            this.remainNumofCardNode = cc.find("Canvas/Game/CardSetEffect/remainNumofCardLabel").getComponent(cc.Node);
            let original_pos = this.baseCardNode.getPosition();

            for (let i = 0; i < 9; ++i) {
                  this.backCards.push(cc.instantiate(this.baseCardNode));
                  this.backCards[i].parent = this.cardSetNode;
                  this.backCards[i].setPosition(original_pos.x, original_pos.y + i * 2);
                  this.backCards[i].active = true;
            }
      },
      
      setSeatInfo: function(seatClientSideId, emptySeat, username = "", xi = 0, score = 0, online = true) {
            if (emptySeat) {
                  this.seats[seatClientSideId].icon.spriteFrame = this.seatNobodyIcon;
                  this.seats[seatClientSideId].ready.active = false;
                  this.seats[seatClientSideId].offline.active = false;
            } else {
                  this.seats[seatClientSideId].icon.spriteFrame = this.seatIcon;
                  this.seats[seatClientSideId].ready.active = true;
                  this.seats[seatClientSideId].offline.active = !online;
            }
            this.seats[seatClientSideId].name.string = username;
            this.seats[seatClientSideId].xi.string = xi.toString();
            this.seats[seatClientSideId].score.string = score.toString();
      },

      initSeatView: function() {
            this.seats = [];
            for (let i = 1; i < 4; ++i) {
                  this.seats.push({
                        icon: cc.find("Canvas/Players/seat" + i.toString() + "/PlayerIcon").getComponent(cc.Sprite),
                        offline: cc.find("Canvas/Players/seat" + i.toString() + "/offline"),
                        name: cc.find("Canvas/Players/seat" + i.toString() + "/nameLabel").getComponent(cc.Label),
                        score: cc.find("Canvas/Players/seat" + i.toString() + "/scoreLabel").getComponent(cc.Label),
                        xi: cc.find("Canvas/Players/seat" + i.toString() + "/xi/xiLabel").getComponent(cc.Label),
                        ready: cc.find("Canvas/Players/seat" + i.toString() + "/ready"),
                  })
            }
            this.seatNobodyIcon = this.seats[1].icon.spriteFrame;
            this.seatIcon = this.seats[0].icon.spriteFrame;
            this.setSeatInfo(1, false, cc.utils.userInfo.nickname, 0, 0, true);
            this.nextPlayerId = cc.utils.roomInfo.my_seat_id + 1;
            if (this.nextPlayerId >= 3) {
                  this.nextPlayerId = 0;
            }
            this.prevPlayerId = cc.utils.roomInfo.my_seat_id - 1;
            if (this.prevPlayerId < 0) {
                  this.prevPlayerId = 2;
            }
            this.setSeatInfo(2, true);
            this.setSeatInfo(0, true);
            for (let i = 0; i < cc.utils.roomInfo.other_players.length; ++i) {
                  let info = cc.utils.roomInfo.other_players[i];
                  if (info.seat_id === this.nextPlayerId) {
                        this.setSeatInfo(2, false, info.nickname, 0, 0, true);
                  } else {
                        this.setSeatInfo(0, false, info.nickname, 0, 0, true);
                  }
            }
      },

      initEventHandlers: function() {
            cc.utils.gameNetworkingManager.dataEventHandler = this.node;
            this.node.on('exit_result', function (data) {
                  console.log('exit_result arrived');
                  if (data.errcode === 0) {
                        cc.utils.net.close();
                        cc.utils.roomInfo = null;
                        // cc.director.loadScene('RoomChoice');
                  } else {
                        cc.utils.wc.hide();
                  }
            });
            this.node.on('disconnect', function (data) {
                  console.log('disconnect arrived');
                  cc.director.loadScene('RoomChoice');
            });
            this.node.on('new_player_entered_room', function (data) {
                  if (data.seat_id === this.nextPlayerId) {
                        this.setSeatInfo(2, false, data.nickname, 0, data.score, data.online);
                  } else {
                        this.setSeatInfo(0, false, data.nickname, 0, data.score, data.online);
                  }
            }.bind(this));
            this.node.on('other_player_exit', function (data) {
                  console.log("other_player_exit", data)
                  if (data.seat_id === this.nextPlayerId) {
                        this.setSeatInfo(2, true);
                  } else {
                        this.setSeatInfo(0, true);
                  }
            }.bind(this));
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
            if (cc.utils.net.delayMS != null){
                  this.delayMSLabel.string = cc.utils.net.delayMS + 'ms';
                  if (cc.utils.net.delayMS > 800){
                        delay.color = this.red;
                  }
                  else if(cc.utils.net.delayMS > 300){
                        this.delayMSNode.color = this.yellow;
                  }
                  else {
                        this.delayMSNode.color = this.green;
                  }
            } else {
                  this.delayMSLabel.string = 'N/A';
                  this.delayMSNode.color = this.red;
            }
      },
  });
    