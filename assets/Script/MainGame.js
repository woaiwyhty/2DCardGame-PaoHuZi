cc.Class({
      extends: cc.Component,
    
      properties: {
            timeLabel: cc.Label,
            roomIdLabel: cc.Label,
            remainNumOfGamesLabel: cc.Label,
            remainNumofCardLabel: cc.Label,
            delayMSLabel: cc.Label,
            delayMSNode: cc.Node,
      },
  
      // use this for initialization
      onLoad: function () {
            cc.utils.wc.show("正在加载游戏");
            cc.utils.main.setFitScreenMode();

            this.red = new cc.Color(205,0,0);
            this.green = new cc.Color(0,205,0);
            this.yellow = new cc.Color(255,200,0); 
            this.reconnection = cc.find("Canvas/ReConnection");
            this.cardOnDrag = cc.find("Canvas/Game/CardOnDrag");
            this.shootLine = cc.find("Canvas/Game/LeftBottom/ShootLine");
            this.roomIdLabel.string = cc.utils.roomInfo.room_id;
            this.initSeatView();
            this.initEventHandlers();
            this.initCardSetView();
            this.initActionsView();

            this.gameOver = cc.find("Canvas/GameOver");
            cc.utils.mainGame = this;
            this.processLoginData();
            cc.utils.wc.hide();

            // cc.utils.roomInfo.huInfo = {
            //       op_seat_id: 2,
            //       type: 'hu',
            //       xi: 20,
            //       fan: 2,
            //       tun: 4,
            //       loseMark: 8,
            //       afterScore: [-8, -8, 16],
            //       nicknames: ['test 1', 'test 2', 'test3'],
            //       huInfo: ["红胡", "点胡", "自摸"],
            //       holeCards: [],
            //       lastGame: true,
            //       cardsGroups: [
            //             { cards: ["d1", "d1", "d1", "d1"] },
            //             { cards: ["d1", "d1", "d1"] },
            //             { cards: ["x2", "x7", "x10"] },
            //             { cards: ["d1", "d1", "d1", "d1"] },
            //             { cards: ["d1", "d1", "d1"] },
            //             { cards: ["x2", "x7", "x10"] },
            //       ]
            // }
            // this.gameOver.active = true;
      },

      determinePossibleMerge: function(endPosx, endPosy) {
            let index = 0;
            for (let cardGroup of this.cardGroupsNodes) {
                  let lastNode = cardGroup[0];
                  console.log(cardGroup.length, lastNode);
                  let pos = lastNode.convertToWorldSpaceAR(cc.v2(0, 0));
                  if (cardGroup.length <= 3 && endPosy >= 0 && endPosy <= pos.y + lastNode.height / 2 &&
                        endPosx >= pos.x - lastNode.width / 2 && endPosx <= pos.x + lastNode.width / 2) {
                        return index;
                  }
                  if (index === 0 && endPosy >= 0 && endPosy <= 300 && 
                        endPosx < pos.x - lastNode.width / 2) {
                        return -1;
                        
                  }
                  if (index === this.cardGroupsNodes.length - 1 && endPosy >= 0 && endPosy <= 300 && 
                        endPosx > pos.x + lastNode.width / 2 ) {
                        return this.cardGroupsNodes.length;
                  }
                  index += 1;
            }
            return -2;
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
                        if (possibleDrug !== -2) {
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
                        if (possibleDrug !== -2) {
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
            let changedIndex = possibleDrug;
            if (possibleDrug === -1) {
                  this.cardGroups.splice(0, 0, new Map());
                  changedIndex = 0;
            } else if (possibleDrug === this.cardGroups.length) {
                  this.cardGroups.push(new Map());
            }
            let num = 0;
            if (this.cardGroups[changedIndex].has(node.name)) {
                  num = this.cardGroups[changedIndex].get(node.name);
            }
            this.cardGroups[changedIndex].set(node.name, num + 1);
            this.cardGroups = cc.utils.gameAlgo.filterEmptyGroup(this.cardGroups);
            this.clearAllCardNodes();
            this.renderCardsOnHand(this.cardGroups);
      },

      clearAllCardNodes: function() {
            for (let cardGroup of this.cardGroupsNodes) {
                  for (let node of cardGroup) {
                        node.destroy();
                  }
            }
      },

      initCardSetView: function() {
            this.GameCanvas = cc.find("Canvas/Game");
            this.dealCardFrame = cc.find("Canvas/Game/DealCardFrame");
            this.shootCardFrame = cc.find("Canvas/Game/ShootCardFrame");

            this.baseCardNode = cc.find("Canvas/Game/CardSetEffect/CardBlind");
            this.cardSetNode = cc.find("Canvas/Game/CardSetEffect");
            this.remainNumofCardNode = cc.find("Canvas/Game/CardSetEffect/remainNumofCardLabel");

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
            cc.utils.roomInfo.cardsSmall = this.cardsSmall;
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

      shootCardOnHand: function(card, cardNode, locally = false) {
            if (!cc.utils.gameAlgo.checkValidForShoot(card, this.cardsOnHand)) {
                  return;
            }

            console.log("shootcard   ", this.currentOnBoardCardNode);
            this.cardsAlreadyChoseToNotUse.push(card);

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

            console.log("current cards on hand", this.cardsOnHand);
            let pos = this.cardSetNode.convertToWorldSpaceAR(cc.v2(0, 0));
            cc.utils.gameAudio.playCardOutEffect(card);
            cc.tween(cardNode)
            .to(0.4, { position: cc.v2(targetX, pos.y + targetY), scale: 0.8  })
            .call(() => {
                  cardNode.getComponent(cc.Button).interactable = false;
                  this.cardsOnHand.set(card, this.cardsOnHand.get(card) - 1);
                  this.cardGroups[cardNode.bucket].set(
                        card, 
                        this.cardGroups[cardNode.bucket].get(card) - 1
                  );
                  this.cardGroups = cc.utils.gameAlgo.filterEmptyGroup(this.cardGroups);
                  this.cardGroupsNodes[cardNode.bucket].splice(cardNode.innerIndex, 1);
                  this.clearAllCardNodes();
                  this.renderCardsOnHand(this.cardGroups);

                  console.log("after cards on hand", this.cardsOnHand);

            })
            .start()
            if (!locally) {
                  cc.utils.gameNetworkingManager.shootCard('onHand', card);
            }
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

            for (let cardGroup of this.cardGroupsNodes) {
                  for (let node of cardGroup) {
                        this.initDrag(node);
                  }
            }
      },

      addDiscardedCard: function(target, parentNode, card, addToLeft = false) {
            let names = [], names_after = [];
            for (let t of target) {
                  names.push(t.name);
            }
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
            for (let t of target) {
                  names_after.push(t.name);
            }
            console.log("addDiscardedCard result  ", names, names_after);
      },
      
      addUsedCards: function(target, parentNode, cards, type, xi, addToLeft = false, from_wei_or_peng = 0, needsHide = false) {
            console.log("addusedcard before  ", target, from_wei_or_peng);
            if (from_wei_or_peng) {
                  if (target === this.cardsAlreadyUsedMySelf) {
                        console.log("myself", target);
                  }
                  for (let usedCards of target) {
                        if (['wei', 'peng'].indexOf(usedCards.type) >= 0
                        && usedCards.cards[2] == cards[cards.length - 1]) {
                              console.log("from_wei_or_peng find ", usedCards);
                              if (type === "pao" && usedCards.type === "wei") {
                                    for (let i = 0; i < 3; ++i) {
                                          usedCards.cards[i] = cards[cards.length - 1];
                                          usedCards.nodes[i].getComponent(cc.Sprite).spriteFrame = 
                                                this.cardsSmall.get(cards[cards.length - 1]).getComponent(cc.Sprite).spriteFrame;
                                    }
                              }
                              usedCards.cards.push(cards[cards.length - 1]);
                              usedCards.nodes.push(cc.instantiate(this.cardsSmall.get(cards[cards.length - 1])));
                              usedCards.nodes[usedCards.nodes.length - 1].parent = parentNode;
                              usedCards.nodes[usedCards.nodes.length - 1].x = usedCards.nodes[usedCards.nodes.length - 2].x;
                              usedCards.nodes[usedCards.nodes.length - 1].y = usedCards.nodes[usedCards.nodes.length - 2].y + this.cardSmallWidth;
                              usedCards.nodes[usedCards.nodes.length - 1].active = true;
                              
                              usedCards.type = type;
                              usedCards.xi = xi;
                              console.log("from_wei_or_peng processed ", usedCards);
                        }
                  }
            } else {
                  let nodes = [];
                  let offSetx = 30 + (target.length * this.cardSmallWidth), offSety = 0;
                  if (addToLeft === true) {
                        offSetx = -30 - (target.length * this.cardSmallWidth);
                  }
                  for (let card of cards) {
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

            console.log("addusedcard after  ", target, from_wei_or_peng);

      },
      
      setSeatInfo: function(seatClientSideId, emptySeat, username = "", xi = 0, score = 0, online = true, isReady = true) {
            if (emptySeat) {
                  this.seats[seatClientSideId].icon.spriteFrame = this.seatNobodyIcon;
                  this.seats[seatClientSideId].ready.active = false;
                  this.seats[seatClientSideId].offline.active = false;
            } else {
                  this.seats[seatClientSideId].icon.spriteFrame = this.seatIcon;
                  this.seats[seatClientSideId].ready.active = isReady;
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
      },

      initEventHandlers: function() {
            cc.utils.gameNetworkingManager.dataEventHandler = this.node;
            this.node.on('exit_result', function (data) {
                  console.log('exit_result arrived');
                  if (data.errcode === 0) {
                        cc.utils.net.close();
                        cc.utils.roomInfo = null;
                        cc.director.loadScene('RoomChoice');
                  } else {
                        cc.utils.wc.hide();
                  }
            });
            this.node.on('disconnect', function (data) {
                  if (cc.utils.roomInfo.exited !== true) {
                        console.log('disconnect arrived');
                        this.reconnection.active = true;
                  }
                  // cc.director.loadScene('RoomChoice');
            }.bind(this));
            this.node.on('new_player_entered_room', function (data) {
                  let local_seat_id = data.seat_id === this.nextPlayerId ? 2 : 0;
                  if (data.relogin === true) {
                        this.seats[local_seat_id].offline.active = false;
                  } else {
                        this.setSeatInfo(local_seat_id, false, data.nickname, 0, data.score, data.online);
                  }
            }.bind(this));
            this.node.on('other_player_exit', function (data) {
                  console.log("other_player_exit", data)
                  let local_seat_id = data.seat_id === this.nextPlayerId ? 2 : 0;
                  if (data.completely_left === true) {
                        this.setSeatInfo(local_seat_id, true);
                  } else {
                        this.seats[local_seat_id].offline.active = true;
                  }
            }.bind(this));

            this.node.on('game_start', function (data) {
                  this.resetEverything();
                  this.renderHoleCards();
                  this.gameOver.active = false;
                  console.log("game_start", data);
                  this.exitButton.active = false;
                  cc.utils.roomInfo.number_of_wang = data.number_of_wang;
                  cc.utils.roomInfo.current_played_games = data.current_played_games;
                  this.remainNumOfGamesLabel.string = (data.total_games - data.current_played_games).toString();
                  cc.utils.roomInfo.total_games = data.total_games;
                  cc.utils.roomInfo.isLastCard = false;
                  this.remainNumofCardNode.active = true;
                  this.remainNumofCardLabel.string = "19";

                  for (let i = 0; i < 3; ++i) {
                        this.seats[i].ready.active = false;
                  }
                  this.cardsOnHand = new Map(data.cardsOnHand);
                  let cardGroups = cc.utils.gameAlgo.groupCards(this.cardsOnHand);
                  this.renderCardsOnHand(cardGroups);

                  let tiResult = cc.utils.gameAlgo.checkTi(this.cardsOnHand);
                  if (tiResult.length > 0) {
                        cc.utils.gameAudio.actionsEffect('ti');
                        for (let ti of tiResult) {
                              // cc.utils.gameNetworkingManager.takeNormalAction('ti', ti, ['back', 'back', 'back', ti], true);
                              this.takeNormalAction('ti', ti, ['back', 'back', 'back', ti], true);
                        }
                  }

                  cc.utils.gameAudio.dealCardWhenGameStartEffect();
                  this.sessionKey = data.sessionKey;
                  let currentCard = data.card21st;
                  let huSpecial = "地胡";
                  if (cc.utils.roomInfo.my_seat_id === 0) {
                        currentCard = null;
                        huSpecial = "天胡";
                  }
                  let huResult = cc.utils.gameAlgo.checkHu(this.cardsAlreadyUsedMySelf, this.cardsOnHand, currentCard);
                  if (huResult && huResult.status === true) {
                        huResult.huInfo.push(huSpecial);
                        huResult.fan += 4;
                        if (cc.utils.roomInfo.number_of_wang > 0) {
                              huResult.huInfo.push("王" + cc.utils.roomInfo.number_of_wang.toString());
                              huResult.fan += (4 * cc.utils.roomInfo.number_of_wang);
                        }
                        cc.utils.roomInfo.huResult = huResult;
                        this.showTimer(cc.utils.roomInfo.my_seat_id);
                        this.renderActionsList(['hu', 'guo']);
                  } else {
                        cc.utils.gameNetworkingManager.takeGuoAction(false, data.sessionKey);
                  }
            }.bind(this));

            this.node.on('dealed_card_check_hu', function (data) {
                  cc.utils.roomInfo.isLastCard = data.isLastCard;
                  this.currentDealShootInfo = {
                        type: 1,
                        op_seat_id: data.op_seat_id,
                        opCard: data.dealed_card,
                  };

                  this.remainNumofCardLabel.string = parseInt(this.remainNumofCardLabel.string) - 1;
                  ++this.backCardsCulm;
                  if ((this.backCardsLast === 8 && this.backCards === 3) || this.backCardsCulm === 2) {
                        this.backCards[this.backCardsLast].active = false;
                        this.backCardsLast--;
                        this.backCardsCulm = 0;
                  }

                  let local_seat_id = data.op_seat_id === this.nextPlayerId ? 2 : 0;
                  if (data.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                        local_seat_id = 1;
                  }
                  this.sessionKey = data.sessionKey;
                  this.dealHoleCard(data.dealed_card, local_seat_id);
                  this.showHideTiCard(local_seat_id);
                  cc.utils.roomInfo.currentCard = null;

                  let actionList = this.calculateAvailableActions(data.dealed_card, false, data.op_seat_id, true);
                  if (actionList.length > 0) {
                        this.showTimer(cc.utils.roomInfo.my_seat_id);
                        this.renderActionsList(actionList);
                  } else {
                        cc.utils.gameNetworkingManager.takeGuoAction(false, this.sessionKey);
                        this.sessionKey = null;
                  }
            }.bind(this))

            this.node.on('dealed_card', function (data) {
                  cc.utils.roomInfo.isLastCard = data.isLastCard;
                  this.currentDealShootInfo = {
                        type: 1,
                        op_seat_id: data.op_seat_id,
                        opCard: data.dealed_card,
                  };
                  if (data.hasPrevCheckHu === false) {
                        this.remainNumofCardLabel.string = parseInt(this.remainNumofCardLabel.string) - 1;
                        ++this.backCardsCulm;
                        if ((this.backCardsLast === 8 && this.backCards === 3) || this.backCardsCulm === 2) {
                              this.backCards[this.backCardsLast].active = false;
                              this.backCardsLast--;
                              this.backCardsCulm = 0;
                        }
                  }
                  
                  let local_seat_id = data.op_seat_id === this.nextPlayerId ? 2 : 0;
                  if (data.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                        local_seat_id = 1;
                  }
                  this.sessionKey = data.sessionKey;
                  cc.utils.roomInfo.currentCard = data.dealed_card;
                  for (let c of this.cardsAlreadyUsedMySelf) {
                        console.log('dealed_card  ',  local_seat_id, c);
                  }
                  this.showHideTiCard(local_seat_id);

                  if (data.ti_wei_pao_result.status === true) {
                        if (data.ti_wei_pao_result.type !== 'wei' || data.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                              // not showing the dealed card to others if it is wei
                              if (data.hasPrevCheckHu === false) {
                                    this.dealHoleCard(data.dealed_card, local_seat_id);
                              }
                        } 
                        cc.utils.gameAudio.actionsEffect(data.ti_wei_pao_result.type);
                        if (data.ti_wei_pao_result.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                              this.takeNormalAction(
                                    data.ti_wei_pao_result.type, 
                                    data.ti_wei_pao_result.opCard, 
                                    data.ti_wei_pao_result.cards, 
                                    false,
                                    false,
                                    data.ti_wei_pao_result.from_wei_or_peng,
                              );
                              if (['ti', 'wei'].indexOf(data.ti_wei_pao_result.type) >= 0) {
                                    // check hu
                                    console.log("need to check hu in ti wei case!!!");
                                    this.sessionKey = data.sessionKey;
                                    this.currentState = 3;
                                    let actionList = this.calculateAvailableActions(null, false, data.op_seat_id, true);
                                    if (actionList.length > 0) {
                                          this.showTimer(cc.utils.roomInfo.my_seat_id);
                                          this.renderActionsList(actionList);
                                    } else {
                                          cc.utils.gameNetworkingManager.takeGuoAction(false, this.sessionKey);
                                          this.sessionKey = null;
                                    }
                              }
                        } else {
                              local_seat_id = data.ti_wei_pao_result.op_seat_id === this.nextPlayerId ? 2 : 0;
                              let target = this.cardsAlreadyUsedPrev;
                              let targetNode = this.cardsAlreadyUsedPrevNode;
                              let addToLeft = false;
                              if (data.ti_wei_pao_result.op_seat_id === this.nextPlayerId) {
                                    target = this.cardsAlreadyUsedNext;
                                    targetNode = this.cardsAlreadyUsedNextNode;
                                    addToLeft = true;
                              }
                              this.seats[local_seat_id].xi.string = data.xi.toString();
                              this.seats[local_seat_id][data.ti_wei_pao_result.type].active = true;
                              this.scheduleOnce(function() {
                                    this.seats[local_seat_id][data.ti_wei_pao_result.type].active = false;
                              }.bind(this), 1);
                              this.addUsedCards(
                                    target, 
                                    targetNode, 
                                    data.ti_wei_pao_result.cards, 
                                    data.ti_wei_pao_result.type,
                                    0,
                                    addToLeft,
                                    data.ti_wei_pao_result.from_wei_or_peng,
                                    false
                              ); // xi doesn't matter on other players side, so set it be 0.
                        }
                  } else {
                        if (data.hasPrevCheckHu === false) {
                              this.dealHoleCard(data.dealed_card, local_seat_id);
                        }

                        let actionList = this.calculateAvailableActions(data.dealed_card, false, data.op_seat_id);
                        if (actionList.length > 0) {
                              this.showTimer(cc.utils.roomInfo.my_seat_id);
                              this.renderActionsList(actionList);
                        } else {
                              cc.utils.gameNetworkingManager.takeGuoAction(false, this.sessionKey);
                              this.sessionKey = null;
                        }
                  }
            }.bind(this));

            this.node.on('other_player_hu', function (data) {
                  let local_seat_id = data.op_seat_id === this.nextPlayerId ? 2 : 0;
                  cc.utils.gameAudio.actionsEffect('hu');
                  this.seats[local_seat_id]['hu'].active = true;
                  cc.utils.roomInfo.huInfo = data;
                  this.scheduleOnce(function() {
                        this.seats[local_seat_id]['hu'].active = false;
                  }.bind(this), 1);

                  for (let i = 0; i < 3; ++i) {
                        let target = 1;
                        if (i === this.nextPlayerId) {
                              target = 2;
                        } else if (i === this.prevPlayerId) {
                              target = 0;
                        }
                        this.seats[target].score.string = cc.utils.roomInfo.huInfo.afterScore[i].toString();
                  }

                  this.scheduleOnce(function() {
                        this.gameOver.active = true;
                  }.bind(this), 2);
            }.bind(this));
            this.node.on('wang_hu', function (data) {
                  cc.utils.roomInfo.huInfo = data;

                  this.scheduleOnce(function() {
                        this.gameOver.active = true;
                  }.bind(this), 1);
            }.bind(this));
            this.node.on('self_action_result', function (data) {
                  if (data.type === 'hu') {
                        this.takeHuAction(data);
                  } else if (data.type === 'peng') {
                        cc.utils.gameAudio.actionsEffect('peng');
                        this.takeNormalAction('peng', data.cards[0], data.cards, false, false);
                  } else if (data.type === 'chi') {
                        cc.utils.gameAudio.actionsEffect('chi');
                        if (!this.cardGroups[0].has(data.opCard)) {
                              this.cardGroups[0].set(data.opCard, 1);
                        } else {
                              this.cardGroups[0].set(data.opCard, this.cardGroups[0].get(data.opCard) + 1);
                        }
                        this.cardsOnHand.set(data.opCard, this.cardsOnHand.get(data.opCard) + 1);
                        for (let cards of data.manyCards) {
                              this.takeNormalAction('chi', data.opCard, cards, false, false);
                        }
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
                  this.seats[local_op_seat_id][data.type].active = true;
                  this.scheduleOnce(function() {
                        this.seats[local_op_seat_id][data.type].active = false;
                  }.bind(this), 1);
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

                        // if (this.currentDealShootInfo && this.currentDealShootInfo.type === 1) {
                        //       // console.log("checkHu  in need_shoot  ", this.cardsAlreadyUsedMySelf, this.cardsOnHand);
                        //       // let huResult = cc.utils.gameAlgo.checkHu(this.cardsAlreadyUsedMySelf, this.cardsOnHand);
                        //       // let actionsList = [];
                        //       // if (huResult && huResult.status === true) {
                        //       //       actionsList.push('hu');
                        //       //       if (this.currentDealShootInfo.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                        //       //             huResult.huInfo.push("自摸");
                        //       //             huResult.tun += 1;
                        //       //       }
                        //       //       if (cc.utils.roomInfo.number_of_wang > 0) {
                        //       //             huResult.huInfo.push("王" + cc.utils.roomInfo.number_of_wang.toString());
                        //       //             huResult.fan += (4 * cc.utils.roomInfo.number_of_wang);
                        //       //       }
                        //       //       cc.utils.roomInfo.huResult = huResult;
                        //       // }
                        //       // if (actionsList.length > 0) {
                        //       //       actionsList.push('guo');
                        //       //       this.renderActionsList(actionsList);
                        //       //       this.currentState = 3; // check hu locally
                        //       // } else {
                        //       //       this.currentState = 1; // need shoot
                        //       // }
                        //       this.currentState = 1; // need shoot
                        // } else {
                        //       this.currentState = 1; // need shoot
                        // }
                  }
                  this.showTimer(data.op_seat_id);
            }.bind(this));
            this.node.on('other_player_shoot', function (data) {
                  this.currentDealShootInfo = {
                        type: 0,
                        op_seat_id: data.op_seat_id
                  };
                  this.sessionKey = data.sessionKey;
                  let leftToRight = data.op_seat_id === this.prevPlayerId;
                  let local_seat_id = data.op_seat_id === this.nextPlayerId ? 2 : 0;
                  this.shootCardOthers(data.opCard, local_seat_id, leftToRight);
                  this.showHideTiCard(local_seat_id);

                  this.seats[local_seat_id].timerBg.active = false;
                  this.seats[local_seat_id].timerLabel.active = false;
                  if (data.paoResult) {
                        if (data.paoResult.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                              cc.utils.gameAudio.actionsEffect('pao');
                              this.takeNormalAction(
                                    'pao',
                                    data.opCard,
                                    [data.opCard, data.opCard, data.opCard, data.opCard],
                                    false,
                                    false,
                                    data.paoResult.from_wei,
                              );
                        } else {
                              let target = this.cardsAlreadyUsedPrev;
                              let targetNode = this.cardsAlreadyUsedPrevNode;
                              let addToLeft = false;
                              let local_pao_seat_id = 0; 
                              if (data.paoResult.op_seat_id === this.nextPlayerId) {
                                    target = this.cardsAlreadyUsedNext;
                                    targetNode = this.cardsAlreadyUsedNextNode;
                                    addToLeft = true;
                                    local_pao_seat_id = 2;
                              }
                              this.seats[local_pao_seat_id].xi.string = data.paoResult.xi.toString();
                              this.seats[local_pao_seat_id]['pao'].active = true;
                              this.scheduleOnce(function() {
                                    this.seats[local_pao_seat_id]['pao'].active = false;
                              }.bind(this), 1);
                              this.addUsedCards(
                                    target, 
                                    targetNode, 
                                    data.paoResult.cards, 
                                    data.paoResult.type,
                                    0,
                                    addToLeft,
                                    data.paoResult.from_wei,
                                    false
                              );
                        }
                  } else {
                        cc.utils.roomInfo.currentCard = data.opCard;
                        let actionList = this.calculateAvailableActions(data.opCard, true, data.op_seat_id, false);
                        if (actionList.length > 0) {
                              this.showTimer(cc.utils.roomInfo.my_seat_id);
                              this.renderActionsList(actionList);
                        } else {
                              cc.utils.gameNetworkingManager.takeGuoAction(false, this.sessionKey);
                        }
                  }
            }.bind(this));
            this.node.on('discarded_dealed_card', function (data) {
                  let local_seat_id = data.op_seat_id === this.nextPlayerId ? 2 : 0;
                  if (data.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                        local_seat_id = 1;
                  }
                  let addToLeft = false;
                  let target = this.cardsDiscardedPrev, targetNode = this.cardsDiscardedPrevNode;
                  if (local_seat_id === 2) {
                        target = this.cardsDiscardedNext, targetNode = this.cardsDiscardedNextNode;
                        addToLeft = true;
                  } else if (local_seat_id === 1) {
                        target = this.cardsDiscardedMySelf, targetNode = this.cardsDiscardedMySelfNode;
                        addToLeft = true;
                  }
                  this.addDiscardedCard(target, targetNode, data.opCard, addToLeft);

                  if (this.currentOnBoardCardNode) {
                        let pos = target[target.length - 1].convertToWorldSpaceAR(cc.v2(target[target.length - 1].x, target[target.length - 1].y));
                        let toPos = this.currentOnBoardCardNode.convertToNodeSpaceAR(pos);
                        cc.tween(this.currentOnBoardCardNode)
                        .to(0.4, { position: toPos } )
                        .call(() => {
                              this.currentOnBoardCardNode.removeAllChildren(false);
                              this.currentOnBoardCardNode.destroy();
                              this.currentOnBoardCardNode = null;
                        }).start()
                  }
            }.bind(this));
            this.node.on('askGameReady', function (data) {
                  cc.utils.gameNetworkingManager.checkIfGameReady();
            }.bind(this));
            this.node.on('timer_passed', function (data) {
                  if (data.type === "shoot_card") {
                        for (let groupNodes of this.cardGroupsNodes) {
                              for (let node of groupNodes) {
                                    if (node.name === data.opCard) {
                                          this.shootCardOnHand(data.opCard, node, true);
                                          break;
                                    }
                              }
                        }
                        this.hideActionList();
                  } else if (data.type === "operation") {
                        if (cc.utils.roomInfo.currentCard) {
                              this.cardsAlreadyChoseToNotUse.push(cc.utils.roomInfo.currentCard);
                        }
            
                        this.hideActionList();
                        this.hiderTimer(cc.utils.roomInfo.my_seat_id);
                        this.clearActionResult();
                  }

            }.bind(this));
      },

      calculateAvailableActions: function(card, isShoot, op_seat_id, huOnly = false) {
            console.log("current cardsonhand  ", this.cardGroups, this.cardsAlreadyChoseToNotUse);
            let actionsList = [];
            if (!huOnly) {
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
            }
            
            if (isShoot === false && huOnly) {
                  let huResult = cc.utils.gameAlgo.checkHu(this.cardsAlreadyUsedMySelf, this.cardsOnHand, card);
                  if (huResult && huResult.status === true) {
                        actionsList.push('hu');
                        if (op_seat_id === cc.utils.roomInfo.my_seat_id) {
                              huResult.huInfo.push("自摸");
                              huResult.tun += 1;
                        }
                        if (cc.utils.roomInfo.number_of_wang > 0) {
                              huResult.huInfo.push("王" + cc.utils.roomInfo.number_of_wang.toString());
                              huResult.fan += (4 * cc.utils.roomInfo.number_of_wang);
                        }
                        if (cc.utils.isLastCard === true) {
                              huResult.huInfo.push("海底");
                              huResult.fan += 4;
                        }
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

      takeHuAction: function(data) {
            this.hideActionList();
            cc.utils.gameAudio.actionsEffect('hu');
            this.seats[1]['hu'].active = true;
            this.scheduleOnce(function() {
                  this.seats[1]['hu'].active = false;
            }.bind(this), 1);

            cc.utils.roomInfo.huInfo = data;
            for (let i = 0; i < 3; ++i) {
                  let target = 1;
                  if (i === this.nextPlayerId) {
                        target = 2;
                  } else if (i === this.prevPlayerId) {
                        target = 0;
                  }
                  this.seats[target].score.string = cc.utils.roomInfo.huInfo.afterScore[i].toString();
            }
            this.scheduleOnce(function() {
                  this.gameOver.active = true;
            }.bind(this), 2);
      },

      takeNormalAction: function(type, opCard, cards, needsHide = false, needSent = true, from_wei_or_peng = 0, sessionKey = null) {
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

                        if (this.cardsOnHand.get(card) > 0) {
                              this.cardsOnHand.set(card, this.cardsOnHand.get(card) - 1);
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
                  for (let usedCards of this.cardsAlreadyUsedMySelf) {
                        if (['wei', 'peng'].indexOf(usedCards.type) >= 0
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
            if (needSent) {
                  cc.utils.gameNetworkingManager.takeNormalAction(type, opCard, cards, needsHide, sessionKey, from_wei_or_peng);
            }
      },

      onReturnToLobbyClicked: function() {
            cc.utils.roomInfo.exited = true;
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

      showTimer: function(remote_seat_id, remain_seconds = 30) {
            if (this.timerCallback) {
                  this.unschedule(this.timerCallback);
                  this.timerCallback = null;
            }
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
            label.string = remain_seconds.toString();
            let currentTime = remain_seconds;
            this.timerCallback = function() {
                  // 这里的 this 指向 component
                  currentTime -= 1;
                  label.string = currentTime.toString();
                  if (currentTime === 0) {
                        // TODO: random shoot a card or pass the operation
                        timerBg.active = false;
                        timerLabel.active = false;
                  } else {
                        if (!timerBg.active) {
                              this.unschedule(this.timerCallback);
                              this.timerCallback = null;
                        }
                  }
            };
            this.schedule(this.timerCallback, 1, remain_seconds - 1, 1);
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
                        this.delayMSNode.color = this.red;
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
            cc.utils.gameNetworkingManager.takeHuAction(cc.utils.roomInfo.huResult, this.sessionKey, cc.utils.roomInfo.my_seat_id);
            this.hideActionList();
            this.hiderTimer(cc.utils.roomInfo.my_seat_id);
            this.clearActionResult();
      },
      
      onGuoClicked: function() {
            cc.utils.gameNetworkingManager.takeGuoAction(true, this.sessionKey);

            if (cc.utils.roomInfo.currentCard && this.currentState !== 3) {
                  this.cardsAlreadyChoseToNotUse.push(cc.utils.roomInfo.currentCard);
                  cc.utils.roomInfo.currentCard = null;
            }

            if (this.currentState === 3) {
                  this.currentState = 0;
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
            if (!cc.utils.roomInfo.chiResult || cc.utils.roomInfo.chiResult.status === false || cc.utils.roomInfo.chiWaysNode) {
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
                        this.clearActionResult();
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

      renderHoleCards: function(remainCard = 19) {
            let groups = Math.ceil(remainCard / 2);
            if (remainCard === 19) {
                  groups = 9;
            }
            this.backCards = [];
            this.backCardsLast = groups - 1;
            this.backCardsCulm = 0;
            let original_pos = this.baseCardNode.getPosition();

            for (let i = 0; i < groups; ++i) {
                  this.backCards.push(cc.instantiate(this.baseCardNode));
                  this.backCards[i].parent = this.cardSetNode;
                  this.backCards[i].setPosition(original_pos.x, original_pos.y + i * 2);
                  this.backCards[i].active = true;
            }
      },

      clearUsedCards: function(usedCards) {
            for (let cards of usedCards) {
                  for (let node of cards.nodes) {
                        node.destroy();
                  }
            }
      },

      clearDiscardedCards: function(discardedCards) {
            for (let node of discardedCards) {
                  node.destroy();
            }
      },

      resetEverything: function() {
            if (this.cardGroupsNodes) {
                  this.clearAllCardNodes();
            }
            this.hideActionList();
            this.clearActionResult();
            this.cardGroupsNodes = [];
            this.cardsGroups = [];
            console.log(this.cardsAlreadyUsedMySelf, this.cardsDiscardedMySelf);
            this.clearUsedCards(this.cardsAlreadyUsedMySelf);
            this.clearUsedCards(this.cardsAlreadyUsedPrev)
            this.clearUsedCards(this.cardsAlreadyUsedNext)

            this.clearDiscardedCards(this.cardsDiscardedMySelf);
            this.clearDiscardedCards(this.cardsDiscardedPrev)
            this.clearDiscardedCards(this.cardsDiscardedNext)

            this.cardsAlreadyUsedMySelf = [];
            this.cardsAlreadyUsedPrev = [];
            this.cardsAlreadyUsedNext = [];
            this.cardsDiscardedMySelf = [];
            this.cardsDiscardedPrev = [];
            this.cardsDiscardedNext = [];
            this.cardsAlreadyChoseToNotUse = [];

            if (this.currentOnBoardCardNode) {
                  this.currentOnBoardCardNode.removeAllChildren(false);
                  this.currentOnBoardCardNode.destroy();
                  this.currentOnBoardCardNode = null;
            }

            cc.utils.roomInfo.huInfo = null;
            cc.utils.userInfo.currentXi = 0;
            for (let i = 0; i < 3; ++i) {
                  this.seats[i].xi.string = "0";
            }
            this.currentState = 0;
      },

      processLoginData: function() {
            if (cc.utils.roomInfo.relogin === false) {
                  for (let i = 0; i < cc.utils.roomInfo.other_players.length; ++i) {
                        let info = cc.utils.roomInfo.other_players[i];
                        if (info.seat_id === this.nextPlayerId) {
                              this.setSeatInfo(2, false, info.nickname, 0, 0, true);
                        } else {
                              this.setSeatInfo(0, false, info.nickname, 0, 0, true);
                        }
                  }
                  cc.utils.gameNetworkingManager.checkIfGameReady();
                  return;
            }

            this.exitButton.active = false;
            this.resetEverything();
            for (let i = 0; i < 3; ++i) {
                  let player = cc.utils.roomInfo.playersInfo[i];
                  let local_seat_id = i === cc.utils.roomInfo.my_seat_id ? 
                        1 : (i === this.nextPlayerId ? 2 : 0);
                  let usedCardsTarget = this.cardsAlreadyUsedMySelf, usedCardsNode = this.cardsAlreadyUsedMySelfNode;
                  let discardedCardsTarget = this.cardsDiscardedMySelf, discardedCardsNode = this.cardsDiscardedMySelfNode;
                  let addToLeftUsedCards = false, addToLeftDiscardedCards = true;

                  if (i === this.nextPlayerId) {
                        usedCardsTarget = this.cardsAlreadyUsedNext;
                        usedCardsNode = this.cardsAlreadyUsedNextNode;
                        discardedCardsTarget = this.cardsDiscardedNext;
                        discardedCardsNode = this.cardsDiscardedNextNode;
                        addToLeftUsedCards = true;
                        addToLeftDiscardedCards = true;
                  } else if (i === this.prevPlayerId) {
                        usedCardsTarget = this.cardsAlreadyUsedPrev;
                        usedCardsNode = this.cardsAlreadyUsedPrevNode;
                        discardedCardsTarget = this.cardsDiscardedPrev;
                        discardedCardsNode = this.cardsDiscardedPrevNode;
                        addToLeftUsedCards = false;
                        addToLeftDiscardedCards = false;
                  } else {
                        this.renderHoleCards(cc.utils.roomInfo.numberOfHoleCards);
                        this.remainNumofCardNode.active = true;
                        this.remainNumofCardLabel.string = cc.utils.roomInfo.numberOfHoleCards.toString();
                        this.cardsAlreadyChoseToNotUse = Array.from(player.cardsChooseToNotUsed);
                        for (let i = 0; i < 3; ++i) {
                              this.seats[i].ready.active = false;
                        }
                        this.cardsOnHand = new Map(cc.utils.roomInfo.cardsOnHand);
                        let cardGroups = cc.utils.gameAlgo.groupCards(this.cardsOnHand);
                        this.renderCardsOnHand(cardGroups);
                        this.processOperation(player);
                        cc.utils.userInfo.currentXi = player.xi;
                  }

                  this.setSeatInfo(local_seat_id, false, player.nickname, 
                        player.xi, player.score, player.online, false);
                  for (let card of player.cardsAlreadyUsed) {
                        this.addUsedCards(usedCardsTarget, 
                              usedCardsNode, card.cards, card.type, card.xi, addToLeftUsedCards);
                  }
                  for (let card of player.cardsDiscarded) {
                        this.addDiscardedCard(discardedCardsTarget, 
                              discardedCardsNode, card, addToLeftDiscardedCards);
                  }
            }
      },

      processOperation(player) {
            if (player.operation) {
                  let remainTime = parseInt((Date.now() - player.operation.startTime) / 1000);
                  if (player.operation.type === 'operation') {
                        this.sessionKey = player.operation.sessionKey;
                        let isShoot = false;
                        if (player.operation.isDealed === true) {
                              this.dealHoleCard(player.operation.opCard, player.operation.op_seat_id);
                        } else {
                              isShoot = true;
                              let leftToRight = player.operation.op_seat_id === this.prevPlayerId;
                              let local_seat_id = player.operation.op_seat_id === this.nextPlayerId ? 2 : 0;
                              this.shootCardOthers(player.operation.opCard, local_seat_id, leftToRight);
                        }
                        let actionList = this.calculateAvailableActions(player.operation.opCard, isShoot, player.operation.op_seat_id, player.operation.isCheckHu);
                        if (actionList.length > 0) {
                              this.showTimer(cc.utils.roomInfo.my_seat_id, remainTime);
                              this.renderActionsList(actionList);
                        } else {
                              cc.utils.gameNetworkingManager.takeGuoAction(false, this.sessionKey);
                              this.sessionKey = null;
                        }
                  } else {
                        this.showTimer(cc.utils.roomInfo.my_seat_id, remainTime);
                        if (player.operation.is_last_card_dealed === 1) {
                              console.log("checkHu  in need_shoot  ", this.cardsAlreadyUsedMySelf, this.cardsOnHand);
                              let huResult = cc.utils.gameAlgo.checkHu(this.cardsAlreadyUsedMySelf, this.cardsOnHand);
                              let actionsList = [];
                              if (huResult && huResult.status === true) {
                                    actionsList.push('hu');
                                    if (this.currentDealShootInfo.op_seat_id === cc.utils.roomInfo.my_seat_id) {
                                          huResult.huInfo.push("自摸");
                                          huResult.tun += 1;
                                    }
                                    if (cc.utils.roomInfo.number_of_wang > 0) {
                                          huResult.huInfo.push("王" + cc.utils.roomInfo.number_of_wang.toString());
                                          huResult.fan += (4 * cc.utils.roomInfo.number_of_wang);
                                    }
                                    cc.utils.roomInfo.huResult = huResult;
                              }
                              if (actionsList.length > 0) {
                                    actionsList.push('guo');
                                    this.renderActionsList(actionsList);
                                    this.currentState = 3; // check hu locally
                              } else {
                                    this.currentState = 1; // need shoot
                              }
                        } else {
                              this.currentState = 1; // need shoot
                        }
                  }
            }
      },
  });
    