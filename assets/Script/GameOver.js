// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
 
cc.Class({
      extends: cc.Component,
   
      properties: {
            nicknames: {
                  default: [],
                  type: [cc.Label]
            },
            scores: {
                  default: [],
                  type: [cc.Label]
            },
            allscores: {
                  default: [],
                  type: [cc.Label]
            },

            exitButton: cc.Button,
            huInfo: cc.Label,
      },
   
      // LIFE-CYCLE CALLBACKS:
   
      onLoad () {
            this.holeCardBg = cc.find("Canvas/GameOver/holeCardsBg");
            this.cardsGroups = cc.find("Canvas/GameOver/checkout/cardsGroups");
            this.nodes = [];
      },

      onEnable () {
            if (!cc.utils.roomInfo.huInfo) {
                  return;
            }
            for (let node of this.nodes) {
                  node.destroy();
            }
            this.nodes = [];
            this.exitButton.node.active = cc.utils.roomInfo.huInfo.lastGame;
            this.huInfo.string = cc.utils.roomInfo.huInfo.huInfo.join(' ');
            
            if (cc.utils.roomInfo.huInfo.type === "wang_hu") {
                  for (let i = 0; i < 3; ++i) {
                        this.nicknames[i].string = cc.utils.roomInfo.huInfo.nicknames[i];
                        this.scores[i].string = "0";
                        this.allscores[i].string = cc.utils.roomInfo.huInfo.afterScore[i].toString();
                  }
                  return;
            }

            for (let i = 0; i < 3; ++i) {
                  this.nicknames[i].string = cc.utils.roomInfo.huInfo.nicknames[i];
                  if (i === cc.utils.roomInfo.huInfo.op_seat_id) {
                        this.scores[i].string = "+" + (cc.utils.roomInfo.huInfo.loseMark * 2).toString();
                  } else {
                        this.scores[i].string = "-" + (cc.utils.roomInfo.huInfo.loseMark).toString();
                  }
                  this.allscores[i].string = cc.utils.roomInfo.huInfo.afterScore[i].toString();
            }

            let totalHoleCards = cc.utils.roomInfo.huInfo.holeCards.length;
            this.holeCardBg.width = totalHoleCards * 50;
            let offsetX = (this.holeCardBg.width / 2) - (50 / 2);
            for (let i = 0; i < totalHoleCards; ++i) {
                  let node = cc.instantiate(cc.utils.roomInfo.cardsSmall.get(cc.utils.roomInfo.huInfo.holeCards[i]));
                  node.parent = this.holeCardBg;
                  node.width = 48;
                  node.height = 48;
                  node.x = offsetX;
                  node.y = 0;
                  offsetX -= 50;
                  this.nodes.push(node);
            }

            this.cardsGroups.width = 60 * (cc.utils.roomInfo.huInfo.cardsGroups.length);
            offsetX = (this.cardsGroups.width / 2) - (60 / 2);
            for (let i = 0; i < cc.utils.roomInfo.huInfo.cardsGroups.length; ++i) {
                  let offsetY = 30;
                  for (let card of cc.utils.roomInfo.huInfo.cardsGroups[i].cards) {
                        let node = cc.instantiate(cc.utils.roomInfo.cardsSmall.get(card));
                        node.parent = this.cardsGroups;
                        node.width = 48;
                        node.height = 48;
                        node.x = offsetX;
                        node.y = offsetY;
                        offsetY += 48;
                        this.nodes.push(node);
                  }
                  offsetX -= 60;
            }
      },
      // update (dt) {},
  });
   
  