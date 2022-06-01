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

            huInfo: cc.Label,
      },
   
      // LIFE-CYCLE CALLBACKS:
   
      onLoad () {

      },

      onEnable () {

      },
      // update (dt) {},
  });
   
  