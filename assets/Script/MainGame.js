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

            this.gameOver = cc.find("Canvas/GameOver");
            cc.utils.gameNetworkingManager.checkIfGameReady();
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
                        if (this.currentState === 1) {
                              this.shootCardOnHand(node.name, node);
                        }
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
                        if (this.currentState === 1) {
                              this.shootCardOnHand(node.name, node);
                        }
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
            this.GameCanvas = cc.find("Canvas/Game");
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

            this.cardsAlreadyChoseToNotUse = [];

            // cc.utils.gameAudio.dealCardWhenGameStartEffect();
            // let testCards = cc.utils.gameAlgo.dealWhenGameStarts();
            // console.log("testedCards  ", testCards)
            // let cardGroups = cc.utils.gameAlgo.groupCards(testCards);
            // this.renderCardsOnHand(cardGroups);

            // this.addUsedCards(this.cardsAlreadyUsedMySelf, this.cardsAlreadyUsedMySelfNode, ['back', 'back', 'x1'], 'wei', 0, false, 0);
            // this.addUsedCards(this.cardsAlreadyUsedMySelf, this.cardsAlreadyUsedMySelfNode, ['back', 'back', 'back', 'x1'], 'ti', 0, false, 1);

            // this.addUsedCards(this.cardsAlreadyUsedMySelf, this.cardsAlreadyUsedMySelfNode, ['d1', 'd2', 'd3'], 'chi', 0);
            // this.addUsedCards(this.cardsAlreadyUsedMySelf, this.cardsAlreadyUsedMySelfNode, ['d2', 'd7', 'd10'], 'chi', 0);
            // this.addUsedCards(this.cardsAlreadyUsedMySelf, this.cardsAlreadyUsedMySelfNode, ['x1', 'x1', 'x1', 'x1'], 'chi', 0);

            // this.addUsedCards(this.cardsAlreadyUsedPrev, this.cardsAlreadyUsedPrevNode, ['d1', 'd2', 'd3'], 'chi', 0);
            // this.addUsedCards(this.cardsAlreadyUsedPrev, this.cardsAlreadyUsedPrevNode, ['d2', 'd7', 'd10'], 'chi', 0);
            // this.addUsedCards(this.cardsAlreadyUsedPrev, this.cardsAlreadyUsedPrevNode, ['x1', 'x1', 'x1', 'x1'], 'chi', 0);

            // this.addUsedCards(this.cardsAlreadyUsedNext, this.cardsAlreadyUsedNextNode, ['d1', 'd2', 'd3'], 'chi', 0, true);
            // this.addUsedCards(this.cardsAlreadyUsedNext, this.cardsAlreadyUsedNextNode, ['d2', 'd7', 'd10'], 'chi', 0, true);
            // this.addUsedCards(this.cardsAlreadyUsedNext, this.cardsAlreadyUsedNextNode, ['x1', 'x1', 'x1', 'x1'], 'chi', 0, true);

            // this.addDiscardedCard(this.cardsDiscardedMySelf, this.cardsDiscardedMySelfNode, 'x5', true);
            // this.addDiscardedCard(this.cardsDiscardedMySelf, this.cardsDiscardedMySelfNode, 'd3', true);
   
            // this.addDiscardedCard(this.cardsDiscardedPrev, this.cardsDiscardedPrevNode, 'x5', false);
            // this.addDiscardedCard(this.cardsDiscardedPrev, this.cardsDiscardedPrevNode, 'd3', false);
 
            // this.addDiscardedCard(this.cardsDiscardedNext, this.cardsDiscardedNextNode, 'x5', true);
            // this.addDiscardedCard(this.cardsDiscardedNext, this.cardsDiscardedNextNode, 'd3', true);
 
            // this.dealHoleCard('x5', 1);
            // this.shootCardOthers('x7', 0, true);
      },

      dealHoleCard: function(card, destSeatId) {
            console.log("dealHoleCard   ", this.currentOnBoardCardNode);
            if (this.currentOnBoardCardNode) {
                  this.currentOnBoardCardNode.removeAllChildren(false);
                  this.currentOnBoardCardNode.destroy();
                  this.currentOnBoardCardNode = null;
            }

            let node = cc.instantiate(this.cardsFull.get(card));
            this.dealCardFrame.parent = node;
            this.dealCardFrame.width = 65;
            this.dealCardFrame.height = 194;
            this.dealCardFrame.x = 0, this.dealCardFrame.y = 0;
            this.dealCardFrame.active = true;
            this.currentOnBoardCardNode = node;
            node.interactable = false;
            node.parent = this.cardSetNode;
            node.width = 65;
            node.height = 194;
            node.x = 0, node.y = 0; 
            node.scaleX = 0.1, node.scaleY = 0.1;
            let targetX = 0, targetY = 0;
            if (destSeatId === 1) {
                  targetY = -100;
            } else if (destSeatId === 0) {
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
            if (!cc.utils.gameAlgo.checkValidForShoot(card, this.cardsOnHand)) {
                  return;
            }

            console.log("shootcard   ", this.currentOnBoardCardNode);

            if (this.currentOnBoardCardNode) {
                  this.currentOnBoardCardNode.removeAllChildren(false);

                  this.currentOnBoardCardNode.destroy();
                  this.currentOnBoardCardNode = null;
            }
            
            let targetX = 0, targetY = -100;
            this.shootCardFrame.parent = cardNode;
            this.shootCardFrame.width = 65;
            this.shootCardFrame.height = 194;
            this.shootCardFrame.x = 0, this.shootCardFrame.y = 0;
            this.shootCardFrame.active = true;
            this.currentOnBoardCardNode = cardNode;

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
            cc.utils.gameNetworkingManager.shootCard('onHand', card);
            this.hiderTimer(cc.utils.roomInfo.my_seat_id);
            this.currentState = 0; // IDLE
      },

      shootCardOthers: function(card, seatId, leftToRight = true) {
            console.log("shootCardOthers  ", this.currentOnBoardCardNode)

            if (this.currentOnBoardCardNode) {
                  this.currentOnBoardCardNode.removeAllChildren(false);
                  this.currentOnBoardCardNode.destroy();
                  this.currentOnBoardCardNode = null;
            }

            let targetX = -130;

            let node = cc.instantiate(this.cardsFull.get(card));
            node.interactable = false;
            node.parent = this.seats[seatId].self;

            node.width = 65;
            node.height = 194;
            node.x = 100, node.y = 0; 
            node.scaleX = 0.1, node.scaleY = 0.1;
            node.active = true;
            this.currentOnBoardCardNode = node;
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
            this.buttonsNode.set('hu', cc.find("Canvas/Game/Actions/hu"));
            this.buttonsNode.set('chiWaysBox', cc.find("Canvas/Game/Actions/chiWaysBox"));


            // cc.utils.roomInfo.chiResult = {
            //       status: true,
            //       chiWays: [
            //             [ [ 'x1', 'x2', 'x3' ], [ 'x2', 'd2', 'd2' ], [ 'x2', 'x7', 'x10' ] ],
            //             [ [ 'x1', 'x2', 'x3' ], [ 'x2', 'x2', 'd2' ] ],
            //             [ [ 'x2', 'x2', 'd2' ], [ 'x2', 'x7', 'x10' ] ]
            //           ],                      
            // }
            // this.renderActionsList(['peng', 'chi', 'guo']);
      },

      renderActionsList: function(buttons) {
            this.actionsNode.active = true;
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
      
      addUsedCards: function(target, parentNode, cards, type, xi, addToLeft = false, from_wei_or_peng = 0, needsHide = false) {
            if (from_wei_or_peng) {
                  for (let usedCards of target) {
                        if (['wei', 'peng'].indexOf(usedCards.type) >= 0
                        && usedCards.cards[2] == cards[cards.length - 1]) {
                              usedCards.nodes.push(cc.instantiate(this.cardsSmall.get(cards[cards.length - 1])));
                              usedCards.nodes[usedCards.nodes.length - 1].parent = parentNode;
                              usedCards.nodes[usedCards.nodes.length - 1].x = usedCards.nodes[usedCards.nodes.length - 2].x;
                              usedCards.nodes[usedCards.nodes.length - 1].y = usedCards.nodes[usedCards.nodes.length - 2].y + this.cardSmallWidth;
                              nodes[nodes.length - 1].active = true;
                        }

                        usedCards.type = type;
                        usedCards.xi = xi;
                  }
            } else {
                  let nodes = [];
                  let offSetx = 30 + (target.length * this.cardSmallWidth), offSety = 0;
                  if (addToLeft === true) {
                        offSetx = -30 - (target.length * this.cardSmallWidth);
                  }
                  for (card of cards) {
                        if ((type === 'ti' && needsHide) || (type === 'wei' && target !== this.cardsAlreadyUsedMySelf)) {
                              nodes.push(cc.instantiate(this.cardsSmall.get('back')));
                        } else {
                              nodes.push(cc.instantiate(this.cardsSmall.get(card)));
                        }
                        nodes[nodes.length - 1].parent = parentNode;
                        nodes[nodes.length - 1].x = offSetx;
                        nodes[nodes.length - 1].y = offSety;
                        nodes[nodes.length - 1].active = true;
                        offSety += this.cardSmallWidth;
                  }
                  target.push({
                        cards: cards,
                        nodes: nodes,
                        type: type,
                        xi: xi,
                  });
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
            this.exitButton = cc.find("Canvas/Players/exitButton");
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
                        'peng': cc.find("Canvas/Players/seat" + i.toString() + "/peng"),
                        'chi': cc.find("Canvas/Players/seat" + i.toString() + "/chi"),
                        'ti': cc.find("Canvas/Players/seat" + i.toString() + "/ti"),
                        'wei': cc.find("Canvas/Players/seat" + i.toString() + "/wei"),
                        'hu': cc.find("Canvas/Players/seat" + i.toString() + "/hu"),
                        'pao': cc.find("Canvas/Players/seat" + i.toString() + "/pao"),
                        timerBg: cc.find("Canvas/Players/seat" + i.toString() + "/timerBg"),
                        timerLabel: cc.find("Canvas/Players/seat" + i.toString() + "/timerLabel"),
                  });
            }

            this.seats[1].timerBg = cc.find("Canvas/Game/CardsOnMyHand/timerBg"),
            this.seats[1].timerLabel = cc.find("Canvas/Game/CardsOnMyHand/timerLabel"),
            
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

            this.node.on('game_start', function (data) {
                  console.log("game_start", data);
                  this.exitButton.active = false;
                  cc.utils.roomInfo.number_of_wang = data.number_of_wang;
                  cc.utils.roomInfo.current_played_games = data.current_played_games;
                  cc.utils.roomInfo.total_games = data.total_games;

                  for (let i = 0; i < 3; ++i) {
                        this.seats[i].ready.active = false;
                  }
                  this.cardsOnHand = new Map(data.cardsOnHand);
                  let cardGroups = cc.utils.gameAlgo.groupCards(this.cardsOnHand);
                  this.renderCardsOnHand(cardGroups);

                  let tiResult = cc.utils.gameAlgo.checkTi(this.cardsOnHand);
                  if (tiResult.length > 0) {
                        cc.utils.gameAudio.actionsEffect('ti');
                        for (ti of tiResult) {
                              // cc.utils.gameNetworkingManager.takeNormalAction('ti', ti, ['back', 'back', 'back', ti], true);
                              this.takeNormalAction('ti', ti, ['back', 'back', 'back', ti], true);
                        }
                  }

                  cc.utils.gameAudio.dealCardWhenGameStartEffect();

                  if (cc.utils.roomInfo.my_seat_id === 0) {
                        // zhuang jia
                        if (data.tianHuResult && data.tianHuResult.status === true) {
                              data.tianHuResult.huInfo.push("天胡");
                              data.tianHuResult.fan += 4;

                              cc.utils.roomInfo.huResult = data.tianHuResult;
                              this.currentState = 2; // wait for tianhu decision
                              this.showTimer(cc.utils.roomInfo.my_seat_id);
                              this.renderActionsList(['hu', 'guo']);
                        } else {
                              cc.utils.gameNetworkingManager.tianhuResult();
                        }
                  }
                  // cc.utils.gameNetworkingManager.askForCardsOnHand();
            }.bind(this));

            this.node.on('check_dihu', function (data) {
                  let huResult = cc.utils.gameAlgo.checkHu(this.cardsAlreadyUsedMySelf, this.cardsOnHand, data.card21st);
                  this.currentSession = data.sessionKey;
                  if (huResult && huResult.status === true) {
                        data.tianHuResult.huInfo.push("地胡");
                        data.tianHuResult.fan += 4;
                        cc.utils.roomInfo.huResult = huResult;
                        this.renderActionsList(['hu', 'guo']);
                        this.showTimer(cc.utils.roomInfo.my_seat_id);
                  } else {
                        cc.utils.gameNetworkingManager.takeNormalAction('guo', null, null, false, data.sessionKey);
                  }
            }.bind(this));

            this.node.on('dealed_card', function (data) {
                  let local_seat_id = data.op_seat_id === this.nextPlayerId ? 2 : 0;
                  if (data.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                        local_seat_id = 1;
                  }
                  this.sessionKey = data.sessionKey;
                  cc.utils.roomInfo.currentCard = data.dealed_card;
                  console.log('dealed_card  ',  local_seat_id);
                  this.showHideTiCard(local_seat_id);

                  if (data.ti_wei_pao_result.status === true) {
                        if (data.ti_wei_pao_result.type !== 'wei' || data.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                              // not showing the dealed card to others if it is wei
                              this.dealHoleCard(data.dealed_card, local_seat_id);
                        } 
                        if (data.ti_wei_pao_result.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                              cc.utils.gameAudio.actionsEffect(data.ti_wei_pao_result.type);
                              this.takeNormalAction(
                                    data.ti_wei_pao_result.type, 
                                    data.ti_wei_pao_result.opCard, 
                                    data.ti_wei_pao_result.cards, 
                                    false,
                                    data.ti_wei_pao_result.from_wei_or_peng,
                              );
                              this.sessionKey = null;
                        }
                  } else {
                        this.dealHoleCard(data.dealed_card, local_seat_id);

                        let actionList = this.calculateAvailableActions(data.dealed_card, false, data.op_seat_id);
                        if (actionList.length > 0) {
                              this.showTimer(cc.utils.roomInfo.my_seat_id);
                              this.renderActionsList(actionList);
                        } else {
                              cc.utils.gameNetworkingManager.takeNormalAction('guo', null, null, false, this.sessionKey);
                              this.sessionKey = null;
                        }
                  }
            }.bind(this));

            this.node.on('other_player_hu', function (data) {
                  let local_seat_id = data.op_seat_id === this.nextPlayerId ? 2 : 0;
                  cc.utils.gameAudio.actionsEffect('hu');
                  this.seats[local_seat_id]['hu'].active = true;
                  this.scheduleOnce(function() {
                        this.seats[local_seat_id]['hu'].active = false;
                  }.bind(this), 1);
            }.bind(this));
            this.node.on('self_action_result', function (data) {
                  if (data.type === 'hu') {
                        this.takeHuAction();
                  } else if (data.type === 'peng') {
                        cc.utils.gameAudio.actionsEffect('peng');
                        this.takeNormalAction('peng', data.cards[0], data.cards);
                  }
            }.bind(this));
            this.node.on('other_player_action', function (data) {
                  cc.utils.gameAudio.actionsEffect(data.type);
                  console.log(this.nextPlayerId, this.prevPlayerId);
                  let target = this.cardsAlreadyUsedPrev;
                  let targetNode = this.cardsAlreadyUsedPrevNode;
                  let addToLeft = false;
                  let local_op_seat_id = 0;
                  if (data.op_seat_id === this.nextPlayerId) {
                        target = this.cardsAlreadyUsedNext;
                        targetNode = this.cardsAlreadyUsedNextNode;
                        addToLeft = true;
                        local_op_seat_id = 2;
                  }
                  this.seats[local_op_seat_id].xi.string = data.xi.toString();
                  if (data.type === 'chi') {
                        for (let cards of data.manyCards) {
                              this.addUsedCards(
                                    target, 
                                    targetNode, 
                                    cards, 
                                    data.type,
                                    0,
                                    addToLeft,
                                    0
                              ); // xi doesn't matter on other players side, so set it be 0.
                        }
                  } else {
                        let needsHide = false;
                        if (data.type === 'ti') {
                              needsHide = data.needsHide;
                        }
                        this.addUsedCards(
                              target, 
                              targetNode, 
                              data.cards, 
                              data.type,
                              0,
                              addToLeft,
                              data.from_wei_or_peng,
                              needsHide
                        ); // xi doesn't matter on other players side, so set it be 0.
                  }
            }.bind(this));
            this.node.on('need_shoot', function (data) {
                  if (data.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                        this.currentState = 1; // need shoot
                  }
                  this.showTimer(data.op_seat_id);
            }.bind(this));
            this.node.on('other_player_shoot', function (data) {
                  this.sessionKey = data.sessionKey;
                  let leftToRight = data.op_seat_id === this.prevPlayerId;
                  let local_seat_id = data.op_seat_id === this.nextPlayerId ? 2 : 0;
                  this.shootCardOthers(data.opCard, local_seat_id, leftToRight);
                  this.showHideTiCard(local_seat_id);

                  this.seats[local_seat_id].timerBg.active = false;
                  this.seats[local_seat_id].timerLabel.active = false;
                  cc.utils.roomInfo.currentCard = data.opCard;
                  // check if I can use the shooted card
                  let paoResult = cc.utils.gameAlgo.checkPao(data.opCard, true, this.cardsOnHand, this.cardsAlreadyUsedMySelf);
                  if (paoResult.status === true) {
                        let from_wei_or_peng = paoResult.caseNumber - 1;
                        cc.utils.gameAudio.actionsEffect('pao');
                        this.takeNormalAction(
                              'pao',
                              data.opCard,
                              [data.opCard, data.opCard, data.opCard, data.opCard],
                              false,
                              from_wei_or_peng
                        );
                        this.sessionKey = null;
                        return;
                  }
                  let actionList = this.calculateAvailableActions(data.opCard, true, data.op_seat_id);
                  if (actionList.length > 0) {
                        this.showTimer(cc.utils.roomInfo.my_seat_id);
                        this.renderActionsList(actionList);
                  } else {
                        cc.utils.gameNetworkingManager.takeNormalAction('guo', null, null, false, this.sessionKey);
                  }
            }.bind(this));
      },

      calculateAvailableActions: function(card, isShoot, op_seat_id) {
            let actionsList = [];
            if ((op_seat_id === this.prevPlayerId || 
                  op_seat_id === cc.utils.roomInfo.my_seat_id) && this.cardsAlreadyChoseToNotUse.indexOf(card) < 0) {
                  // I am next player of shooted player or I am the shooted player, so chi is available
                  let chiResult = cc.utils.gameAlgo.checkChi(card, this.cardsOnHand);
                  if (chiResult && chiResult.status === true) {
                        actionsList.push('chi');
                        cc.utils.roomInfo.chiResult = chiResult;
                  }
            }

            let pengResult = cc.utils.gameAlgo.checkPeng(card, this.cardsOnHand);
            if (pengResult && this.cardsAlreadyChoseToNotUse.indexOf(card) < 0) {
                  actionsList.push('peng');
                  cc.utils.roomInfo.pengResult = {
                        status: true,
                        opCard: card,
                  };
            }

            if (isShoot === false) {
                  let huResult = cc.utils.gameAlgo.checkPeng(card, this.cardsOnHand);
                  if (huResult && huResult.status === true) {
                        actionsList.push('hu');
                        if (op_seat_id === cc.utils.roomInfo.my_seat_id) {
                              huResult.huInfo.push("自摸");
                              huResult.tun += 1;
                        }
                        huResult.fan += (4 * cc.utils.roomInfo.number_of_wang);
                        cc.utils.roomInfo.huResult = huResult;
                  }
            }

            if (actionsList.length > 0) {
                  actionsList.push('guo');
            }

            return actionsList;
      },

      hideActionList: function() {
            if (cc.utils.roomInfo.chiWaysNode) {
                  cc.utils.roomInfo.chiWaysNode.destroy();
                  cc.utils.roomInfo.chiWaysNode = null;
            }
            for (const [key, value] of this.buttonsNode.entries()) {
                  value.active = false;
            }
            this.actionsNode.active = false;
      },

      clearActionResult: function() {
            cc.utils.roomInfo.pengResult = null;
            cc.utils.roomInfo.huResult = null;
            cc.utils.roomInfo.chiResult = null;
            cc.utils.roomInfo.currentCard = null;
      },

      takeHuAction: function() {
            this.hideActionList();
            cc.utils.gameAudio.actionsEffect('hu');
            this.seats[1]['hu'].active = true;
            this.scheduleOnce(function() {
                  this.seats[1]['hu'].active = false;
            }.bind(this), 1);
      },

      takeNormalAction: function(type, opCard, cards, needsHide = false, from_wei_or_peng = 0) {
            this.seats[1][type].active = true;
            this.scheduleOnce(function() {
                  this.seats[1][type].active = false;
            }.bind(this), 1);
            let xi = 0;
            if (type === 'chi') {
                  xi = cc.utils.gameAlgo.calculateXi(type, cards);
                  for (let card of cards) {
                        for (let i = 0; i < this.cardGroups.length; ++i) {
                              if (this.cardGroups[i].get(card) > 0) {
                                    this.cardGroups[i].set(card, this.cardGroups[i].get(card) - 1);
                              }
                        }
                  }
            } else {
                  xi = cc.utils.gameAlgo.calculateXi(type, opCard);
                  this.cardsOnHand.set(opCard, 0);
                  for (let i = 0; i < this.cardGroups.length; ++i) {
                        if (this.cardGroups[i].get(opCard) > 0) {
                              this.cardGroups[i].set(opCard, 0);
                        }
                  }
            }
            if (from_wei_or_peng) {
                  for (let usedCards of target) {
                        if (['wei', 'peng'].indexOf(type) >= 0
                        && usedCards.cards[2] == cards[cards.length - 1]) {
                              cc.utils.userInfo.currentXi -= usedCards.xi;
                        }
                  }
            } 
            cc.utils.userInfo.currentXi += xi;
            this.seats[1].xi.string = cc.utils.userInfo.currentXi.toString();
            this.cardGroups = cc.utils.gameAlgo.filterEmptyGroup(this.cardGroups);
            this.clearAllCardNodes();
            this.renderCardsOnHand(this.cardGroups);

            this.addUsedCards(
                  this.cardsAlreadyUsedMySelf, 
                  this.cardsAlreadyUsedMySelfNode, 
                  cards, 
                  type, xi, false, from_wei_or_peng
            );
            cc.utils.gameNetworkingManager.takeNormalAction(type, opCard, cards, needsHide, this.sessionKey, from_wei_or_peng);
      },

      onReturnToLobbyClicked: function() {
            cc.utils.gameNetworkingManager.exitToGameServer();
      },

      hiderTimer: function(remote_seat_id) {
            let timerBg = this.seats[1].timerBg;
            let timerLabel = this.seats[1].timerLabel;
            if (remote_seat_id === this.prevPlayerId) {
                  timerBg = this.seats[0].timerBg;
                  timerLabel = this.seats[0].timerLabel;            
            } else if (remote_seat_id === this.nextPlayerId) {
                  timerBg = this.seats[2].timerBg;
                  timerLabel = this.seats[2].timerLabel;      
            }

            timerBg.active = false;
            timerLabel.active = false;
      },

      showTimer: function(remote_seat_id) {
            let timerBg = this.seats[1].timerBg;
            let timerLabel = this.seats[1].timerLabel;
            if (remote_seat_id === this.prevPlayerId) {
                  timerBg = this.seats[0].timerBg;
                  timerLabel = this.seats[0].timerLabel;            
            } else if (remote_seat_id === this.nextPlayerId) {
                  timerBg = this.seats[2].timerBg;
                  timerLabel = this.seats[2].timerLabel;      
            }

            timerBg.active = true;
            timerLabel.active = true;
            let label = timerLabel.getComponent(cc.Label);
            label.string = '30';
            let currentTime = 30;
            let callback = function() {
                  // 这里的 this 指向 component
                  currentTime -= 1;
                  label.string = currentTime.toString();
                  if (currentTime === 0) {
                        // TODO: random shoot a card or pass the operation
                        timerBg.active = false;
                        timerLabel.active = false;
                  } else {
                        if (!timerBg.active) {
                              this.unschedule(callback);
                        }
                  }
            };
            this.schedule(callback, 1, 29, 1);
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

      onHuClicked: function() {
            if (this.currentState === 2) {
                  cc.utils.gameNetworkingManager.tianhuResult(cc.utils.roomInfo.huResult);
                  return;
            }
            cc.utils.gameNetworkingManager.takeHuAction(cc.utils.roomInfo.huResult, this.currentSession, cc.utils.roomInfo.my_seat_id);
            this.hideActionList();
            this.hiderTimer(cc.utils.roomInfo.my_seat_id);
            this.clearActionResult();
      },
      
      onGuoClicked: function() {
            cc.utils.gameNetworkingManager.takeNormalAction('guo', null, null, false, this.sessionKey);

            if (this.currentState === 2) {
                  // pass for tianhu
                  cc.utils.gameNetworkingManager.tianhuResult();
                  return;
            }
            if (cc.utils.roomInfo.currentCard) {
                  this.cardsAlreadyChoseToNotUse.push(cc.utils.roomInfo.currentCard);
            }

            this.hideActionList();
            this.hiderTimer(cc.utils.roomInfo.my_seat_id);
            this.clearActionResult();
      },

      onPengClicked: function() {
            if (!cc.utils.roomInfo.pengResult || cc.utils.roomInfo.pengResult.status === false) {
                  return;
            }

            let cards = [cc.utils.roomInfo.pengResult.opCard, cc.utils.roomInfo.pengResult.opCard, cc.utils.roomInfo.pengResult.opCard];
            cc.utils.gameNetworkingManager.takeNormalAction('peng',
                  cc.utils.roomInfo.pengResult.opCard, cards, 
                  false, this.sessionKey
            );

            this.hideActionList();
            this.hiderTimer(cc.utils.roomInfo.my_seat_id);
            // cc.utils.gameAudio.actionsEffect('peng');
            // this.takeNormalAction('peng', cc.utils.roomInfo.pengResult.opCard, cards, false);
            this.sessionKey = null;
            this.clearActionResult();
      },
      
      onChiClicked: function() {
            if (!cc.utils.roomInfo.chiResult || cc.utils.roomInfo.chiResult.status === false) {
                  return;
            }

            let offSetX = 0;
            cc.utils.roomInfo.chiWaysNode = new cc.Node('Sprite');
            cc.utils.roomInfo.chiWaysNode.parent = this.actionsNode;
            cc.utils.roomInfo.chiWaysNode.x = 0;
            cc.utils.roomInfo.chiWaysNode.y = 0;
            for (let method of cc.utils.roomInfo.chiResult.chiWays) {
                  let box = cc.instantiate(this.buttonsNode.get('chiWaysBox'));
                  box.parent = cc.utils.roomInfo.chiWaysNode;
                  box.active = true;
                  box.method = method;
                  for (let possibility of method) {
                        let offSetY = 90;
                        for (let oneCard of possibility) {
                              let node = cc.instantiate(this.cardsSmall.get(oneCard));
                              node.parent = box;
                              node.x = offSetX;
                              node.y = offSetY;
                              node.interactable = true;
                              node.active = true;
                              offSetY += this.cardSmallWidth;
                        }
                        offSetX += this.cardSmallWidth;
                  }
                  box.on('click', (button) => {
                        // TODO: send chi action to server
                        cc.utils.gameNetworkingManager.takeChiAction(button.node.method, this.sessionKey);
                        this.hideActionList();
                        this.hiderTimer(cc.utils.roomInfo.my_seat_id);
                        // cc.utils.gameAudio.actionsEffect('chi');
                        // for (let possibility of button.node.method) {
                        //       this.takeNormalAction('chi', possibility[2], possibility, false);
                        // }
                        this.sessionKey = null;
                  }, this);
                  offSetX += 15;
            }
            cc.utils.roomInfo.chiWaysNode.x -= (offSetX);
            cc.utils.roomInfo.chiWaysNode.active = true;
      },

      showHideTiCard: function(local_seat_id) {
            if (local_seat_id !== 1) {
                  let target = local_seat_id === 2 ? this.cardsAlreadyUsedNext : this.cardsAlreadyUsedPrev;
                  for (let usedCards of target) {
                        if (usedCards.type === 'ti' && usedCards.nodes[3].name === 'back') {
                              let x = usedCards.nodes[3].x, y = usedCards.nodes[3].y;
                              usedCards.nodes[3].destroy();
                              usedCards.nodes[3] = cc.instantiate(this.cardsSmall.get(usedCards.cards[3]));
                              usedCards.nodes[3].x = x;
                              usedCards.nodes[3].y = y;
                              usedCards.nodes[3].parent = usedCards.nodes[2].parent;
                              usedCards.nodes[3].active = true;
                        }
                  }
            }
      },
  });
    