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

            this.cardsFull = new Map();
            this.cardsSmall = new Map();
            for (let i = 1; i <= 10; ++i) {
                  this.cardsFull.set('x' + i.toString(), cc.find("Canvas/Game/CardSetFull/x" + i.toString()));
                  this.cardsFull.set('d' + i.toString(), cc.find("Canvas/Game/CardSetFull/d" + i.toString()));
            }


            for (let i = 1; i <= 10; ++i) {
                  this.cardsSmall.set('x' + i.toString(), cc.find("Canvas/Game/CardSetSmall/x" + i.toString()));
                  this.cardsSmall.set('d' + i.toString(), cc.find("Canvas/Game/CardSetSmall/d" + i.toString()));
            }

            this.cardsOnMyHandNode = cc.find("Canvas/Game/CardsOnMyHand");
            this.cardFullWidth = 76;

            let testCards = this.dealWhenGameStarts();
            console.log("testedCards  ", testCards)
            this.renderCardsOnHand(testCards);
      },

      addToGroup: function(groups, arr) {
            let tempMap = new Map(arr);
            groups.push(tempMap);
      },

      groupCards: function(cardSet) {
            // all keys must be inserted, sth like: x1: 0.
            // if there is no specific card, just set the value to be 0.
            let groups = [];
            let tempCardSet = new Map(JSON.parse(
                  JSON.stringify(Array.from(cardSet))
            ));
            // pick all >=3 card arrangements
            for (let i = 1; i <= 20; ++i) {
                  let key = 'x' + i.toString();
                  if (i > 10) {
                        key = 'd' + (i - 10).toString();
                  }

                  let num = tempCardSet.get(key);
                  if (num >= 3) {
                        this.addToGroup(groups, [[key, num]]);
                        tempCardSet.set(key, 0);
                  }
            }

            // da and xiao with the same number can be put together
            for (let i = 1; i <= 10; ++i) {
                  let keyXiao = 'x' + i.toString();
                  let keyDa = 'd' + i.toString();
                  let numXiao = tempCardSet.get(keyXiao), numDa = tempCardSet.get(keyDa);
                  if (numXiao === 0 && numDa === 0){
                        continue;
                  }
                  if (numXiao === 2 && numDa === 2) {
                        this.addToGroup(groups, [[keyXiao, numXiao]]);
                        this.addToGroup(groups, [[keyDa, numDa]]);
                        tempCardSet.set(keyXiao, 0);
                        tempCardSet.set(keyDa, 0);
                  } else {
                        this.addToGroup(groups, [[keyXiao, numXiao], [keyDa, numDa]])
                        tempCardSet.set(keyXiao, 0);
                        tempCardSet.set(keyDa, 0);
                  }
            }

            // 1,2,3 and 2,7,10
            let special = [
                  ['x1', 'x2', 'x3'],
                  ['d1', 'd2', 'd3'],
                  ['x2', 'x7', 'x10'],
                  ['d2', 'd7', 'd10'],
            ]
            for (let i = 0; i < 4; ++i) {
                  let satisfied = true;
                  let arr = [];
                  for (j = 0; j < 3; ++j) {
                        if (tempCardSet.get(special[i][j]) < 1) {
                              satisfied = false;
                              break;
                        }
                        arr.push([special[i][j], tempCardSet.get(special[i][j])]);
                  }
                  if (satisfied) {
                        this.addToGroup(groups, arr);
                        for (j = 0; j < 3; ++j) {
                              tempCardSet.set(special[i][j], 0);
                        }
                  }
            }

            // all remaining
            for (let i = 1; i <= 20; ++i) {
                  let key = 'x' + i.toString();
                  if (i > 10) {
                        key = 'd' + (i - 10).toString();
                  }

                  let num = tempCardSet.get(key);
                  if (num > 0) {
                        this.addToGroup(groups, [[key, num]]);
                        tempCardSet.set(key, 0);
                  }
            }
            return groups;
      },

      renderCardsOnHand: function(cardSet) {
            let cardGroups = this.groupCards(cardSet);
            this.cardGroups = cardGroups;
            this.cardGroupsNodes = [];
            let left = parseInt(cardGroups.length / 2), right = cardGroups.length - left;
            let currentX = 0 - (left * this.cardFullWidth);
            for (let i = 1; i <= cardGroups.length; ++i) {
                  let nodes = [];
                  for (const [key, value] of cardGroups[i - 1].entries()) {
                        for (let cnt = 0; cnt < value; ++cnt) {
                              nodes.push(cc.instantiate(this.cardsFull.get(key)));
                              nodes[nodes.length - 1].parent = this.cardsOnMyHandNode;
                        }
                  }
                  let currentY = 130;
                  for (let j = nodes.length - 1; j >= 0; j -= 1) {
                        nodes[j].setPosition(currentX, currentY);
                        nodes[j].active = true;
                        currentY += 65;
                  }
                  currentX += this.cardFullWidth;
            }
      },

      generateAllCardSet: function() {
            let cards = [];
            for (let i = 0; i <= 20; ++i) {
                  let key = 'x' + i.toString();
                  if (i > 10) {
                        key = 'd' + (i - 10).toString();
                  }
                  for (let j = 0; j < 4; ++j) {
                        cards.push(key);
                  }
            }
            return cards;
      },

      shuffle: function(cards) {
            return cards.map(value => ({ value, sort: Math.random() }))
                  .sort((a, b) => a.sort - b.sort)
                  .map(({ value }) => value)
      },

      dealWhenGameStarts: function() {
            let cards = this.generateAllCardSet();
            cards = this.shuffle(cards);
            let cardSetMap = new Map();
            for (let i = 0; i <= 20; ++i) {
                  let key = 'x' + i.toString();
                  if (i > 10) {
                        key = 'd' + (i - 10).toString();
                  }
                  cardSetMap.set(key, 0);
            }
            for (let i = 0; i < 21; ++i) {
                  cardSetMap.set(cards[i], cardSetMap.get(cards[i]) + 1);
            }
            return cardSetMap;
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
    