const xiArray = {
      'da_peng': 3,
      'da_wei': 6,
      'da_pao': 9,
      'da_ti': 12,
      'xiao_wei': 3,
      'xiao_pao': 6,
      'xiao_peng': 1,
      'xiao_ti': 9,
      'xiao_sp_chi': 3,
      'da_sp_chi': 6,
};
cc.Class({
      extends: cc.Component,
  
      properties: {
          // foo: {
          //    default: null,      // The default value will be used only when the component attaching
          //                           to a node for the first time
          //    url: cc.Texture2D,  // optional, default is typeof default
          //    serializable: true, // optional, default is true
          //    visible: true,      // optional, default is true
          //    displayName: 'Foo', // optional
          //    readonly: false,    // optional, default is false
          // },
          // ...
      },

      addToGroup: function(groups, arr) {
            let tempMap = new Map(arr);
            groups.push(tempMap);
      },

      filterEmptyGroup: function(cardGroups) {
            let newGroup = [];
            for (cardGroup of cardGroups) {
                  let sum = 0;
                  for (const [key, value] of cardGroup.entries()) {
                        sum += value;
                  }
                  if (sum > 0) {
                        newGroup.push(cardGroup);
                  }
            }
            return newGroup;
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
                        if (numXiao + numDa >= 2) {
                              this.addToGroup(groups, [[keyXiao, numXiao], [keyDa, numDa]])
                              tempCardSet.set(keyXiao, 0);
                              tempCardSet.set(keyDa, 0);
                        }
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

            let current = [];
            // all remaining
            for (let i = 1; i <= 20; ++i) {
                  let key = 'x' + i.toString();
                  if (i > 10) {
                        key = 'd' + (i - 10).toString();
                  }

                  let num = tempCardSet.get(key);
                  if (num > 0) {
                        current.push([key, num]);
                        if (current.length === 2) {
                              this.addToGroup(groups, current);
                              current = [];
                        }
                        tempCardSet.set(key, 0);
                  }
            }
            if (current.length !== 0) {
                  this.addToGroup(groups, current);
                  current = [];
            }
            return groups;
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

      calculateXi: function(type, card) {
            let key;
            // TODO: implement xi for chi
            if (card[0] === 'x') {
                  return xiArray['xiao_' + type];
            } else {
                  return xiArray['da_' + type];
            }
      },

      checkTi: function(cards) {
            let tiResult = [];
            for (const [key, value] of cards.entries()) {
                  if (value === 4) {
                        tiResult.push(key);
                  }
            }
            return tiResult;
      },
});
  