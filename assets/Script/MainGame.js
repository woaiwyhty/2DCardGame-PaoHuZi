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

            this.red = new cc.Color(205,0,0);
            this.green = new cc.Color(0,205,0);
            this.yellow = new cc.Color(255,200,0); 

            this.cardOnDrag = cc.find("Canvas/Game/CardOnDrag");
            this.shootLine = cc.find("Canvas/Game/LeftBottom/ShootLine");
            this.roomIdLabel.string = cc.utils.roomInfo.room_id;
            this.initSeatView();
            this.initEventHandlers();
            this.initCardSetView();
            this.initActionsView();
      },

      determinePossibleMerge: function(endPosx, endPosy) {
            let index = 0;
            for (cardGroup of this.cardGroupsNodes) {
                  let lastNode = cardGroup[0];
                  console.log(cardGroup.length, lastNode);
                  let pos = lastNode.convertToWorldSpaceAR(cc.v2(0, 0));
                  if (cardGroup.length <= 3 && endPosy >= 0 && endPosy <= pos.y + lastNode.height / 2 &&
                        endPosx >= pos.x - lastNode.width / 2 && endPosx <= pos.x + lastNode.width / 2) {
                        return index;
                  }
                  index += 1;
            }
            return -1;
      },

      initDrag: function(node) {
            node.on(cc.Node.EventType.TOUCH_START, function (event) {
                  console.log("cc.Node.EventType.TOUCH_START");
                  node.interactable = node.getComponent(cc.Button).interactable;
                  if (!node.interactable) {
                      return;
                  }
                  node.opacity = 150;
                  this.shootLine.active = true;
                  this.cardOnDrag.active = false;
                  this.cardOnDrag.getComponent(cc.Sprite).spriteFrame = node.getComponent(cc.Sprite).spriteFrame;
                  this.cardOnDrag.x = event.getLocationX() - this.node.width / 2;
                  this.cardOnDrag.y = event.getLocationY() - this.node.height / 2;
            }.bind(this));
      
            node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                  console.log("cc.Node.EventType.TOUCH_MOVE");
                  if (!node.interactable) {
                      return;
                  }
                  if (Math.abs(event.getDeltaX()) + Math.abs(event.getDeltaY()) < 0.5) {
                      return;
                  }
                  this.cardOnDrag.active = true;
                  node.opacity = 150;
                  this.cardOnDrag.opacity = 255;
                  this.cardOnDrag.scaleX = 1;
                  this.cardOnDrag.scaleY = 1;
                  this.cardOnDrag.x = event.getLocationX() - this.node.width / 2;
                  this.cardOnDrag.y = event.getLocationY() - this.node.height / 2;
                  // node.y = 0;
            }.bind(this));
      
            node.on(cc.Node.EventType.TOUCH_END, function (event) {
                  if (!node.interactable) {
                      return;
                  }
                  console.log("cc.Node.EventType.TOUCH_END  ", event.getLocationX(), event.getLocationY(), this.shootLine.y);
                  this.cardOnDrag.active = false;
                  this.shootLine.active = false;

                  node.opacity = 255;
                  
                  if (event.getLocationY() >= 320) {
                        this.shootCardOnHand(node.name, node);
                  } else {
                        let possibleDrug = this.determinePossibleMerge(event.getLocationX(), event.getLocationY());
                        if (possibleDrug !== -1) {
                              this.mergeCards(node, possibleDrug);
                        }
                  }
            }.bind(this));
      
            node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                  if (!node.interactable) {
                      return;
                  }
                  console.log("cc.Node.EventType.TOUCH_CANCEL  ", event.getLocationX(), event.getLocationY(), this.shootLine.y);
                  this.cardOnDrag.active = false;
                  this.shootLine.active = false;
                  node.opacity = 255;
                  this.determinePossibleMerge(event);

                  if (event.getLocationY() >= 320) {
                        this.shootCardOnHand(node.name, node);
                  } else {
                        let possibleDrug = this.determinePossibleMerge(event.getLocationX(), event.getLocationY());
                        if (possibleDrug !== -1) {
                              this.mergeCards(node, possibleDrug);
                        }
                  }
            }.bind(this));
      },

      mergeCards: function(node, possibleDrug) {
            this.cardGroups[node.bucket].set(
                  node.name, 
                  this.cardGroups[node.bucket].get(node.name) - 1
            );
            let num = 0;
            if (this.cardGroups[possibleDrug].has(node.name)) {
                  num = this.cardGroups[possibleDrug].get(node.name);
            }
            this.cardGroups[possibleDrug].set(node.name, num + 1);
            this.cardGroups = cc.utils.gameAlgo.filterEmptyGroup(this.cardGroups);
            this.clearAllCardNodes();
            this.renderCardsOnHand(this.cardGroups);
      },

      clearAllCardNodes: function() {
            for (cardGroup of this.cardGroupsNodes) {
                  for (node of cardGroup) {
                        node.destroy();
                  }
            }
      },

      initCardSetView: function() {
            this.dealCardFrame = cc.find("Canvas/Game/DealCardFrame");
            this.shootCardFrame = cc.find("Canvas/Game/ShootCardFrame");

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
            this.cardsSmall.set('back', cc.find("Canvas/Game/CardSetSmall/back"));


            this.cardsOnMyHandNode = cc.find("Canvas/Game/CardsOnMyHand");
            this.cardFullWidth = 65;
            this.cardSmallWidth = 40;
            this.cardsAlreadyUsedMySelfNode = cc.find("Canvas/Game/CardsAlreadyUsedMySelf");
            this.cardsAlreadyUsedPrevNode = cc.find("Canvas/Game/CardsAlreadyUsedPrev");
            this.cardsAlreadyUsedNextNode = cc.find("Canvas/Game/CardsAlreadyUsedNext");
            this.cardsAlreadyUsedMySelf = [];
            this.cardsAlreadyUsedPrev = [];
            this.cardsAlreadyUsedNext = [];

            this.cardsDiscardedMySelfNode = cc.find("Canvas/Game/CardsDiscardedMySelf");
            this.cardsDiscardedPrevNode = cc.find("Canvas/Game/CardsDiscardedPrev");
            this.cardsDiscardedNextNode = cc.find("Canvas/Game/CardsDiscardedNext");
            this.cardsDiscardedMySelf = [];
            this.cardsDiscardedPrev = [];
            this.cardsDiscardedNext = [];

            let testCards = cc.utils.gameAlgo.dealWhenGameStarts();
            console.log("testedCards  ", testCards)
            let cardGroups = cc.utils.gameAlgo.groupCards(testCards);
            this.renderCardsOnHand(cardGroups);

            this.addUsedCards(this.cardsAlreadyUsedMySelf, this.cardsAlreadyUsedMySelfNode, ['d1', 'd2', 'd3'], 'chi', 0);
            this.addUsedCards(this.cardsAlreadyUsedMySelf, this.cardsAlreadyUsedMySelfNode, ['d2', 'd7', 'd10'], 'chi', 0);
            this.addUsedCards(this.cardsAlreadyUsedMySelf, this.cardsAlreadyUsedMySelfNode, ['x1', 'x1', 'x1', 'x1'], 'chi', 0);

            this.addUsedCards(this.cardsAlreadyUsedPrev, this.cardsAlreadyUsedPrevNode, ['d1', 'd2', 'd3'], 'chi', 0);
            this.addUsedCards(this.cardsAlreadyUsedPrev, this.cardsAlreadyUsedPrevNode, ['d2', 'd7', 'd10'], 'chi', 0);
            this.addUsedCards(this.cardsAlreadyUsedPrev, this.cardsAlreadyUsedPrevNode, ['x1', 'x1', 'x1', 'x1'], 'chi', 0);

            this.addUsedCards(this.cardsAlreadyUsedNext, this.cardsAlreadyUsedNextNode, ['d1', 'd2', 'd3'], 'chi', 0, true);
            this.addUsedCards(this.cardsAlreadyUsedNext, this.cardsAlreadyUsedNextNode, ['d2', 'd7', 'd10'], 'chi', 0, true);
            this.addUsedCards(this.cardsAlreadyUsedNext, this.cardsAlreadyUsedNextNode, ['x1', 'x1', 'x1', 'x1'], 'chi', 0, true);

            this.addDiscardedCard(this.cardsDiscardedMySelf, this.cardsDiscardedMySelfNode, 'x5', true);
            this.addDiscardedCard(this.cardsDiscardedMySelf, this.cardsDiscardedMySelfNode, 'd3', true);
   
            this.addDiscardedCard(this.cardsDiscardedPrev, this.cardsDiscardedPrevNode, 'x5', false);
            this.addDiscardedCard(this.cardsDiscardedPrev, this.cardsDiscardedPrevNode, 'd3', false);
 
            this.addDiscardedCard(this.cardsDiscardedNext, this.cardsDiscardedNextNode, 'x5', true);
            this.addDiscardedCard(this.cardsDiscardedNext, this.cardsDiscardedNextNode, 'd3', true);
 
            this.dealHoleCard('x5', 1);
            // this.shootCardOthers('x7', 2, false);
      },

      dealHoleCard: function(card, destSeatId) {
            let node = cc.instantiate(this.cardsFull.get(card));
            this.dealCardFrame.parent = node;
            this.dealCardFrame.width = 65;
            this.dealCardFrame.height = 194;
            this.dealCardFrame.x = 0, this.dealCardFrame.y = 0;
            this.dealCardFrame.active = true;
            node.interactable = false;
            node.parent = this.cardSetNode;
            node.width = 65;
            node.height = 194;
            node.x = 0, node.y = 0; 
            node.scaleX = 0.1, node.scaleY = 0.1;
            let targetX = 0, targetY = 0;
            if (destSeatId === 0) {
                  targetY = -100;
            } else if (destSeatId === 1) {
                  targetX = -130;
            } else {
                  targetX = 130;
            }
            cc.utils.gameAudio.playCardOutEffect(card);
            cc.tween(node)
            .to(0.4, { position: cc.v2(targetX, targetY), scale: 0.8  })
            .start()
      },

      shootCardOnHand: function(card, cardNode) {
            // TODO: check if it is allowed to shoot the target card
            // TODO: communicate with the server
            let targetX = 0, targetY = -100;
            this.shootCardFrame.parent = cardNode;
            this.shootCardFrame.width = 65;
            this.shootCardFrame.height = 194;
            this.shootCardFrame.x = 0, this.shootCardFrame.y = 0;
            this.shootCardFrame.active = true;

            let pos = this.cardSetNode.convertToWorldSpaceAR(cc.v2(0, 0));
            cc.utils.gameAudio.playCardOutEffect(card);
            cc.tween(cardNode)
            .to(0.4, { position: cc.v2(targetX, pos.y + targetY), scale: 0.8  })
            .call(() => {
                  this.cardGroups[cardNode.bucket].set(
                        card, 
                        this.cardGroups[cardNode.bucket].get(card) - 1
                  );
                  this.cardGroups = cc.utils.gameAlgo.filterEmptyGroup(this.cardGroups);
                  this.cardGroupsNodes[cardNode.bucket].splice(cardNode.innerIndex, 1);
                  this.clearAllCardNodes();
                  this.renderCardsOnHand(this.cardGroups);
            })
            .start()
      },

      shootCardOthers: function(card, seatId, leftToRight = true) {
            let targetX = -130;

            let node = cc.instantiate(this.cardsFull.get(card));
            node.interactable = false;
            node.parent = this.seats[seatId].self;

            node.width = 65;
            node.height = 194;
            node.x = 100, node.y = 0; 
            node.scaleX = 0.1, node.scaleY = 0.1;
            node.active = true;
            this.shootCardFrame.parent = node;
            this.shootCardFrame.width = 65;
            this.shootCardFrame.height = 194;
            this.shootCardFrame.x = 0, this.shootCardFrame.y = 0;
            this.shootCardFrame.active = true;

            if (!leftToRight) {
                  targetX = 130;
            }
            let pos = this.cardSetNode.convertToWorldSpaceAR(cc.v2(0, 0));
            let localPos = this.seats[seatId].self.convertToNodeSpaceAR(cc.v2(pos.x + targetX, pos.y))
            cc.utils.gameAudio.playCardOutEffect(card);
            cc.tween(node)
            .to(0.4, { position: localPos, scale: 0.8  })
            .start();
      },

      initActionsView: function() {
            this.actionsNode = cc.find("Canvas/Game/Actions");
            this.buttonsNode = new Map();
            this.buttonsNode.set('peng', cc.find("Canvas/Game/Actions/peng"));
            this.buttonsNode.set('chi', cc.find("Canvas/Game/Actions/chi"));
            this.buttonsNode.set('guo', cc.find("Canvas/Game/Actions/guo"));

            this.renderActionsList(['peng', 'guo']);
      },

      renderActionsList: function(buttons) {
            let currentX = -80;
            for (let i = buttons.length - 1; i >= 0; --i) {
                  this.buttonsNode.get(buttons[i]).x = currentX;
                  this.buttonsNode.get(buttons[i]).active = true;
                  currentX -= 130;
            }
      },

      renderCardsOnHand: function(cardGroups) {
            this.cardGroups = cardGroups;
            this.cardGroupsNodes = [];
            let left = Math.min(parseInt(cardGroups.length / 2), 4);
            let currentX = 0 - (left * this.cardFullWidth);
            for (let i = 1; i <= cardGroups.length; ++i) {
                  let nodes = [];
                  for (const [key, value] of cardGroups[i - 1].entries()) {
                        for (let cnt = 0; cnt < value; ++cnt) {
                              nodes.push(cc.instantiate(this.cardsFull.get(key)));
                              nodes[nodes.length - 1].parent = this.cardsOnMyHandNode;
                              nodes[nodes.length - 1].width = 65;
                              nodes[nodes.length - 1].height = 194;
                        }
                  }
                  let currentY = 115;
                  for (let j = nodes.length - 1; j >= 0; j -= 1) {
                        nodes[j].setPosition(currentX, currentY);
                        nodes[j].active = true;
                        currentY += 60;
                        nodes[j].bucket = i - 1;
                        nodes[j].innerIndex = j;
                  }
                  this.cardGroupsNodes.push(nodes);
                  currentX += this.cardFullWidth;
            }

            for (cardGroup of this.cardGroupsNodes) {
                  for (node of cardGroup) {
                        this.initDrag(node);
                  }
            }
      },

      addDiscardedCard: function(target, parentNode, card, addToLeft = false) {
            let node = null;
            let offSetx = 30 + (target.length * this.cardSmallWidth), offSety = 0;
            if (addToLeft === true) {
                  offSetx = -30 - (target.length * this.cardSmallWidth);
            }
            node = cc.instantiate(this.cardsSmall.get(card));
            node.parent = parentNode;
            node.x = offSetx;
            node.y = offSety;
            node.active = true;
            target.push(node);
      },
      
      addUsedCards: function(target, parentNode, cards, type, xi, addToLeft = false) {
            let nodes = [];
            let offSetx = 30 + (target.length * this.cardSmallWidth), offSety = 0;
            if (addToLeft === true) {
                  offSetx = -30 - (target.length * this.cardSmallWidth);
            }
            for (card of cards) {
                  nodes.push(cc.instantiate(this.cardsSmall.get(card)));
                  nodes[nodes.length - 1].parent = parentNode;
                  nodes[nodes.length - 1].x = offSetx;
                  nodes[nodes.length - 1].y = offSety;
                  nodes[nodes.length - 1].active = true;
                  offSety += this.cardSmallWidth;
            }
            target.push({
                  nodes: nodes,
                  type: type,
                  xi: xi,
            });
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
                        self: cc.find("Canvas/Players/seat" +  i.toString()),
                        peng: cc.find("Canvas/Players/seat" + i.toString() + "/peng"),
                        chi: cc.find("Canvas/Players/seat" + i.toString() + "/chi"),
                        ti: cc.find("Canvas/Players/seat" + i.toString() + "/ti"),
                        wei: cc.find("Canvas/Players/seat" + i.toString() + "/wei"),
                        pao: cc.find("Canvas/Players/seat" + i.toString() + "/pao"),
                  })
            }
            this.seatNobodyIcon = this.seats[1].icon.spriteFrame;
            this.seatNobodyIcon.width = 74;
            this.seatNobodyIcon.height = 74;

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
    