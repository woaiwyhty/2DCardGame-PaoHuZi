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

const chiMap = {
    'x1':  [['x1', 'x2', 'x3'], ['x1', 'x1', 'd1'], ['x1', 'd1', 'd1']] ,
    'x2':  [['x1', 'x2', 'x3'], ['x2', 'x3', 'x4'], ['x2', 'x2', 'd2'], ['x2', 'd2', 'd2'], ['x2', 'x7', 'x10']] ,
    'x3':  [['x1', 'x2', 'x3'], ['x2', 'x3', 'x4'], ['x3', 'x4', 'x5'], ['x3', 'x3', 'd3'], ['x3', 'd3', 'd3']] ,
    'x4':  [['x2', 'x3', 'x4'], ['x3', 'x4', 'x5'], ['x4', 'x5', 'x6'], ['x4', 'x4', 'd4'], ['x4', 'd4', 'd4']] ,
    'x5':  [['x3', 'x4', 'x5'], ['x4', 'x5', 'x6'], ['x5', 'x6', 'x7'], ['x5', 'x5', 'd5'], ['x5', 'd5', 'd5']] ,
    'x6':  [['x4', 'x5', 'x6'], ['x5', 'x6', 'x7'], ['x6', 'x7', 'x8'], ['x6', 'x6', 'd6'], ['x6', 'd6', 'd6']] ,
    'x7':  [['x5', 'x6', 'x7'], ['x6', 'x7', 'x8'], ['x7', 'x8', 'x9'], ['x7', 'x7', 'd7'], ['x7', 'd7', 'd7'], ['x2', 'x7', 'x10']] ,
    'x8':  [['x6', 'x7', 'x8'], ['x7', 'x8', 'x9'], ['x8', 'x9', 'x10'], ['x8', 'x8', 'd8'], ['x8', 'd8', 'd8']] ,
    'x9':  [['x7', 'x8', 'x9'], ['x8', 'x9', 'x10'], ['x9', 'x9', 'd9'], ['x9', 'd9', 'd9']] ,
    'x10':  [['x8', 'x9', 'x10'], ['x10', 'x10', 'd10'], ['x10', 'd10', 'd10'], ['x2', 'x7', 'x10']] ,
    'd1':  [['d1', 'd2', 'd3'], ['d1', 'd1', 'x1'], ['d1', 'x1', 'x1']] ,
    'd2':  [['d1', 'd2', 'd3'], ['d2', 'd3', 'd4'], ['d2', 'd2', 'x2'], ['d2', 'x2', 'x2'], ['d2', 'd7', 'd10']] ,
    'd3':  [['d1', 'd2', 'd3'], ['d2', 'd3', 'd4'], ['d3', 'd4', 'd5'], ['d3', 'd3', 'x3'], ['d3', 'x3', 'x3']] ,
    'd4':  [['d2', 'd3', 'd4'], ['d3', 'd4', 'd5'], ['d4', 'd5', 'd6'], ['d4', 'd4', 'x4'], ['d4', 'x4', 'x4']] ,
    'd5':  [['d3', 'd4', 'd5'], ['d4', 'd5', 'd6'], ['d5', 'd6', 'd7'], ['d5', 'd5', 'x5'], ['d5', 'x5', 'x5']] ,
    'd6':  [['d4', 'd5', 'd6'], ['d5', 'd6', 'd7'], ['d6', 'd7', 'd8'], ['d6', 'd6', 'x6'], ['d6', 'x6', 'x6']] ,
    'd7':  [['d5', 'd6', 'd7'], ['d6', 'd7', 'd8'], ['d7', 'd8', 'd9'], ['d7', 'd7', 'x7'], ['d7', 'x7', 'x7'], ['d2', 'd7', 'd10']] ,
    'd8':  [['d6', 'd7', 'd8'], ['d7', 'd8', 'd9'], ['d8', 'd9', 'd10'], ['d8', 'd8', 'x8'], ['d8', 'x8', 'x8']] ,
    'd9':  [['d7', 'd8', 'd9'], ['d8', 'd9', 'd10'], ['d9', 'd9', 'x9'], ['d9', 'x9', 'x9']] ,
    'd10':  [['d8', 'd9', 'd10'], ['d10', 'd10', 'x10'], ['d10', 'x10', 'x10'], ['d2', 'd7', 'd10']] ,
}

const huChiMap = {
    'x1':  [['x1', 'x2', 'x3'], ['x1', 'x1', 'd1'], ['x1', 'd1', 'd1']] ,
    'x2':  [['x2', 'x3', 'x4'], ['x2', 'x2', 'd2'], ['x2', 'd2', 'd2'], ['x2', 'x7', 'x10']] ,
    'x3':  [['x3', 'x4', 'x5'], ['x3', 'x3', 'd3'], ['x3', 'd3', 'd3']] ,
    'x4':  [['x4', 'x5', 'x6'], ['x4', 'x4', 'd4'], ['x4', 'd4', 'd4']] ,
    'x5':  [['x5', 'x6', 'x7'], ['x5', 'x5', 'd5'], ['x5', 'd5', 'd5']] ,
    'x6':  [['x6', 'x7', 'x8'], ['x6', 'x6', 'd6'], ['x6', 'd6', 'd6']] ,
    'x7':  [['x7', 'x8', 'x9'], ['x7', 'x7', 'd7'], ['x7', 'd7', 'd7']] ,
    'x8':  [['x8', 'x9', 'x10'], ['x8', 'x8', 'd8'], ['x8', 'd8', 'd8']] ,
    'x9':  [['x9', 'x9', 'd9'], ['x9', 'd9', 'd9']] ,
    'x10':  [['x10', 'x10', 'd10'], ['x10', 'd10', 'd10']] ,
    'd1':  [['d1', 'd2', 'd3'], ['d1', 'd1', 'x1'], ['d1', 'x1', 'x1']] ,
    'd2':  [['d2', 'd3', 'd4'], ['d2', 'd2', 'x2'], ['d2', 'x2', 'x2'], ['d2', 'd7', 'd10']] ,
    'd3':  [['d3', 'd4', 'd5'], ['d3', 'd3', 'x3'], ['d3', 'x3', 'x3']] ,
    'd4':  [['d4', 'd5', 'd6'], ['d4', 'd4', 'x4'], ['d4', 'x4', 'x4']] ,
    'd5':  [['d5', 'd6', 'd7'], ['d5', 'd5', 'x5'], ['d5', 'x5', 'x5']] ,
    'd6':  [['d6', 'd7', 'd8'], ['d6', 'd6', 'x6'], ['d6', 'x6', 'x6']] ,
    'd7':  [['d7', 'd8', 'd9'], ['d7', 'd7', 'x7'], ['d7', 'x7', 'x7']] ,
    'd8':  [['d8', 'd9', 'd10'], ['d8', 'd8', 'x8'], ['d8', 'x8', 'x8']] ,
    'd9':  [['d9', 'd9', 'x9'], ['d9', 'x9', 'x9']] ,
    'd10':  [['d10', 'd10', 'x10'], ['d10', 'x10', 'x10']] ,
}

const cardRed = ['x2', 'x7', 'x10', 'd2', 'd7', 'd10'];
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
            for (let cardGroup of cardGroups) {
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
                for (let j = 0; j < 3; ++j) {
                    if (tempCardSet.get(special[i][j]) < 1) {
                        satisfied = false;
                        break;
                    }
                    arr.push([special[i][j], tempCardSet.get(special[i][j])]);
                }
                if (satisfied) {
                    this.addToGroup(groups, arr);
                    for (let j = 0; j < 3; ++j) {
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
            for (let i = 1; i <= 20; ++i) {
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
            for (let i = 1; i <= 20; ++i) {
                let key = 'x' + i.toString();
                if (i > 10) {
                    key = 'd' + (i - 10).toString();
                }
                cardSetMap.set(key, 0);
            }
            for (let i = 0; i < 20; ++i) {
                cardSetMap.set(cards[i], cardSetMap.get(cards[i]) + 1);
            }
            return cardSetMap;
        },

        findOneCardToShoot: function(cardsOnHand) {
            for (const [key, value] of cardsOnHand.entries()) {
                if (value < 3 && value > 0) {
                    return key;
                }
            }
        },
    
        checkValidForShoot: function(card, cardsOnHand) {
            return cardsOnHand.get(card) < 3;
        },
    
        calculateXi: function(type, card) {
            let key;
            if (Array.isArray(card)) {
                let mycard = Array.from(card);
                mycard.sort();
                // console.log("calculate xi  ", mycard, card);
                if (mycard.toString() === ['d1', 'd2', 'd3'].toString() ||
                mycard.toString() === ['d10', 'd2', 'd7'].toString()) {
                    return 6;
                }
                if (mycard.toString() === ['x1', 'x2', 'x3'].toString() ||
                mycard.toString() === ['x10', 'x2', 'x7'].toString()) {
                    return 3;
                }
                return 0;
            }
            if (card[0] === 'x') {
                return xiArray['xiao_' + type];
            } else {
                return xiArray['da_' + type];
            }
        },
    
        checkTi: function(cards, dealedCard) {
            let tiResult = [];
            if (dealedCard) {
                if (cards.get(dealedCard) === 3) {
                    tiResult.push(dealedCard);
                }
            }
            for (const [key, value] of cards.entries()) {
                if (value === 4) {
                    tiResult.push(key);
                }
            }
            return tiResult;
        },
    
        checkPeng: function(shootedCard, cardsOnHand) {
            return cardsOnHand.get(shootedCard) === 2;
        },
    
        checkWei: function(dealedCard, cardsOnHand) {
            if (dealedCard) {
                return cardsOnHand.get(dealedCard) === 2;
            }
    
            let result = []
            for (const [card, value] of cardsOnHand.entries()) {
                if (value === 3) {
                    result.push(card);
                }
            }
            return result;
        },
    
        checkPao: function(card, isShoot, cardsOnHand, cardsAlreadyUsed) {
            // case1: 3 cards on hand and other shooted/dealed one
            // case2: 3 wei cards and other shooted/dealed one
            // case3: 3 peng cards and others dealed one
            if (cardsOnHand.get(card) === 3) {
                return {
                    status: true,
                    caseNumber: 1,
                };
            }
            let id = 0;
            for (let usedCards of cardsAlreadyUsed) {
                if (usedCards.type === 'wei') {
                    if ( usedCards.cards[2] === card) {
                        return {
                            status: true,
                            caseNumber: 2,
                            index: id,
                        };
                    }
                } else if (usedCards.type === 'peng') {
                    if ((usedCards.cards[2] === card) && (isShoot === false)) {
                        return {
                            status: true,
                            caseNumber: 3,
                            index: id,
                        }
                    }
                }
                id += 1;
            }
            return {
                status: false,
            }
        },
    
        checkChiOnlyOnHandDfs: function(card, cardsOnHand, finalResult, currentResult) {
            if (cardsOnHand.get(card) === 0) {
                finalResult.push(currentResult);
                return;
            }
            for (let possibility of chiMap[card]) {
                let result = true;
                for (let oneCard of possibility) {
                    if (cardsOnHand.get(oneCard) >= 3 && oneCard != card) {
                        result = false;
                        break;
                    }
                }
                if (!result) {
                    continue;
                }
                for (let oneCard of possibility) {
                    cardsOnHand.set(oneCard, cardsOnHand.get(oneCard) - 1);
                }
                for (let oneCard of possibility) {
                    if (cardsOnHand.get(oneCard) < 0) {
                        result = false;
                        for (let oneCard1 of possibility) {
                            cardsOnHand.set(oneCard1, cardsOnHand.get(oneCard1) + 1);
                        }
                        break;
                    }
                }
                if (result === true) {
                    let newResult = Array.from(currentResult);
                    newResult.push(possibility);
                    this.checkChiOnlyOnHandDfs(card, cardsOnHand, finalResult, newResult);
                    for (let oneCard of possibility) {
                        cardsOnHand.set(oneCard, cardsOnHand.get(oneCard) + 1);
                    }
                }
            }
        },
    
        checkChi: function(card, cardsOnHand) {
            if (cardsOnHand.get(card) >= 3) {
                return {
                    status: false
                };
            }
            let tempCardSet = new Map(JSON.parse(
                JSON.stringify(Array.from(cardsOnHand))
            ));
            tempCardSet.set(card, tempCardSet.get(card) + 1);
            let finalResult = [];
            let currentResult = [];
            // we may chi multiple times to make sure we don't have the same dealed card on hand.
            // it is necessary to use dfs to find all possibilities.
            this.checkChiOnlyOnHandDfs(card, tempCardSet, finalResult, currentResult);
            if (finalResult.length > 0) {
                for (let item of finalResult) {
                    item.sort();
                }
                finalResult = finalResult.sort().filter((item, pos, array) => {
                    return !pos || item.toString() !== array[pos - 1].toString();
                });

                for (let result of finalResult) {
                    for (let item of result) {
                        for (let i = 0; i < 2; ++i) {
                            if (item[i] === card) {
                                item[i] = item[2];
                                item[2] = card;
                            }
                        }
                    }
                }
            }
            return {
                status: finalResult.length > 0,
                chiWays: finalResult,
            };
        },
    
        groupCardsBy3Dfs: function(cardsOnHand, numOfCards, finalResult, currentResult) {
            // cardsOnHand must have no jiang and no wei
            if (numOfCards < 3) {
                if (numOfCards === 0) {
                    // FIND A MATCH!!! Yeahhh!!!!
                    for (let current of currentResult) {
                        current.xi = this.calculateXi('chi', current.cards);
                    }
                    finalResult.push(currentResult);
                }
                return;
            }
            for (const [card, value] of cardsOnHand.entries()) {
                if (value === 0) {
                    continue;
                }
    
                for (let possibility of huChiMap[card]) {
                    let result = true;
                    for (let oneCard of possibility) {
                        cardsOnHand.set(oneCard, cardsOnHand.get(oneCard) - 1);
                    }
                    for (let oneCard of possibility) {
                        if (cardsOnHand.get(oneCard) < 0) {
                            result = false;
                            for (let oneCard1 of possibility) {
                                cardsOnHand.set(oneCard1, cardsOnHand.get(oneCard1) + 1);
                            }
                            break;
                        }
                    }
                    if (result === true) {
                        let newResult = Array.from(currentResult);
                        newResult.push({
                            type: 'chi',
                            cards: possibility,
                            xi: 0, // calculate later to save time
                        });
                        // console.log("before group   ", possibility);
                        this.groupCardsBy3Dfs(cardsOnHand, numOfCards - 3, finalResult, newResult);
                        // console.log("after group   ", possibility);
    
                        for (let oneCard of possibility) {
                            cardsOnHand.set(oneCard, cardsOnHand.get(oneCard) + 1);
                        }
                    }
                }
            }
        },
    
        calculateFanAndTun: function(cardsAlreadyUsed, resultFromGroup3, jiang = null) {
            let all = cardsAlreadyUsed.concat(resultFromGroup3);
            if (jiang) {
                all.push({
                    type: 'jiang',
                    cards: [jiang, jiang],
                    opCard: jiang,
                    xi: 0,
                });
            }
            let sumOfXi = 0;
            for (let group of all) {
                sumOfXi += group.xi;
            }
            if (sumOfXi < 15) {
                return {
                    status: false
                };
            }
    
            let tipaoNum = new Map();
            let numOfRed = 0, numOfBlack = 0, numOfChi = 0, numOfXiao = 0, numOfDa = 0, numOfTuan = 0;
            for (let group of all) {
                if (group.type === 'chi') {
                    for (let card of group.cards) {
                        if (cardRed.indexOf(card) >= 0) {
                            numOfRed += 1;
                        } else {
                            numOfBlack += 1;
                        }
                        if (card[0] === 'd') {
                            numOfDa += 1;
                        } else {
                            numOfXiao += 1;
                        }
                    }
                    numOfChi += 1;
                } else {
                    let cnt = 3;
                    if(['ti', 'pao'].indexOf(group.type) >= 0) {
                        cnt = 4;
                        let oppoCard = group.cards[3].slice(1);
                        if (group.cards[3][0] === 'd') {
                            oppoCard = 'x' + oppoCard;
                        } else {
                            oppoCard = 'd' + oppoCard;
                        }
                        tipaoNum.set(group.cards[3], true);
                        if (tipaoNum.get(oppoCard)) {
                            numOfTuan += 1;
                        }
                    }
                    if (group.type === 'jiang') {
                        cnt = 2;
                    }
    
                    if (group.cards[cnt - 1][0] === 'd') {
                        numOfDa += cnt;
                    } else {
                        numOfXiao += cnt;
                    }
    
                    if (cardRed.indexOf(group.cards[cnt - 1]) >= 0) {
                        numOfRed += cnt;
                    } else {
                        numOfBlack += cnt;
                    }
                }
            }
    
            let fan = 0;
            let huInfo = [];
            if (numOfRed >= 10) {
                huInfo.push("红胡");
                fan += 4 + (numOfRed - 10);
            }
            if (numOfRed === 0) {
                fan += 8;
                huInfo.push("黑胡");
            }
            if (numOfRed === 1) {
                fan += 6;
                huInfo.push("点胡");
            }
            if (numOfChi === 0) {
                fan += 8;
                huInfo.push("对胡");
            }
            if (numOfDa >= 18) {
                fan += 8 + (numOfDa - 18);
                huInfo.push("大胡");
            }
            if (numOfXiao >= 16) {
                fan += 8 + (numOfXiao - 16);
                huInfo.push("小胡");
            }
            if (numOfTuan > 0) {
                huInfo.push("团胡");
                fan += (numOfTuan) * 8;
            }
            if (!fan) {
                fan = 1;
            }
            return {
                status: true,
                fan: fan,
                tun: parseInt((sumOfXi - 12) / 3),
                xi: sumOfXi,
                cardsGroups: all,
                huInfo: huInfo,
            }
        },
    
        checkHuHelper: function(cardsOnHand, alreadyNeedJiang, currentCard, isDealedBySelf, cardsAlreadyUsed) {
            let tempCardSet = new Map(JSON.parse(
                JSON.stringify(Array.from(cardsOnHand))
            ));
            let groupResult = [];
            for (let cardsUsed of cardsAlreadyUsed) {
                groupResult.push({
                    type: cardsUsed.type,
                    xi: cardsUsed.xi,
                    cards: cardsUsed.cards,
                });
            }
    
            // 4x + 3y + 2
            let tiResult = this.checkTi(tempCardSet);
            if (!alreadyNeedJiang) {
                alreadyNeedJiang = tiResult.length > 0;
            }
            for (let ti of tiResult) {
                groupResult.push({
                    cards: [ti, ti, ti, ti],
                    type: 'ti',
                    xi: this.calculateXi('ti', ti)
                })
                tempCardSet.set(ti, 0);
            }
            let maxHu = null, found = false;
            let weiResult = this.checkWei(null, tempCardSet);
            for (let wei of weiResult) {
                if (currentCard && wei === currentCard) {
                    if (!isDealedBySelf) {
                        found = true;
                        continue;
                    }
                }
                groupResult.push({
                    cards: [wei, wei, wei],
                    type: 'wei',
                    xi: this.calculateXi('wei', wei)
                });
                tempCardSet.set(wei, 0);
            }
            let numOfCards = 0;
            for (const [key, value] of tempCardSet.entries()) {
                numOfCards += value;
            }

            if (found) {
                tempCardSet.set(currentCard, 1);
                let finalResult = [], currentResult = [];
                this.groupCardsBy3Dfs(tempCardSet, numOfCards - 2, finalResult, currentResult);
                for (let res of finalResult) {
                    let calcResult = this.calculateFanAndTun(groupResult, res, currentCard);
                    if (!maxHu || (calcResult.status === true
                        && calcResult.fan * calcResult.tun > maxHu.fan * maxHu.tun)) {
                        maxHu = calcResult;
                    }
                }
                tempCardSet.set(currentCard, 0);
                groupResult.push({
                    cards: [currentCard, currentCard, currentCard],
                    type: 'peng',
                    xi: this.calculateXi('peng', currentCard)
                });
                numOfCards -= 3;
            }

            if (alreadyNeedJiang) {
                for (const a of tempCardSet.entries()) {
                    let key = a[0];
                    let value = a[1];
                    if (value === 2 && (numOfCards - 2) % 3 === 0) {
                        // may be jiang
                        tempCardSet.set(key, 0);
                        let finalResult = [], currentResult = [];
                        this.groupCardsBy3Dfs(tempCardSet, numOfCards - 2, finalResult, currentResult);
                        for (let res of finalResult) {
                            let calcResult = this.calculateFanAndTun(groupResult, res, key);
                            if (!maxHu || (calcResult.status === true
                                && calcResult.fan * calcResult.tun > maxHu.fan * maxHu.tun)) {
                                maxHu = calcResult;
                            }
                        }
                        tempCardSet.set(key, 2);
                    }
                }
            } else {
                if (numOfCards % 3 === 0) {
                    // hu without jiang
                    let finalResult = [], currentResult = [];
                    this.groupCardsBy3Dfs(tempCardSet, numOfCards, finalResult, currentResult);
                    for (let res of finalResult) {
                        let calcResult = this.calculateFanAndTun(groupResult, res);
                        if (!maxHu || (calcResult.status === true
                            && calcResult.fan * calcResult.tun > maxHu.fan * maxHu.tun)) {
                            maxHu = calcResult;
                        }
                    }
                }
            }
            if (maxHu === null) {
                return {
                    status: false,
                };
            }
            return maxHu;
        },
    
        checkHu: function(cardsAlreadyUsed, cardsOnHand, currentCard, isDealedBySelf = false) {
            // tian, di, wang should be added later.
            let tempCardSet = new Map(JSON.parse(
                JSON.stringify(Array.from(cardsOnHand))
            ));

            let tempCardsAlreadyUsed = [], resultWithPao;
            for (let usedCard of cardsAlreadyUsed) {
                tempCardsAlreadyUsed.push({
                    type: usedCard.type,
                    cards: Array.from(usedCard.cards),
                    xi: usedCard.xi,
                })
            }
            if (currentCard) {
                let found = false;
                for (let usedCard of tempCardsAlreadyUsed) {
                    if (["peng", "wei"].indexOf(usedCard.type) >= 0 && usedCard.cards[2] === currentCard) {
                        usedCard.type = "pao";
                        usedCard.cards.push(currentCard);
                        usedCard.xi = this.calculateXi("pao", currentCard);
                        found = true;
                        break;
                    }
                }
                if (found) {
                    resultWithPao = this.checkHu(tempCardsAlreadyUsed, tempCardSet);
                }
                tempCardSet.set(currentCard, tempCardSet.get(currentCard) + 1);
            }
            let sumOfCardOnHand = 0;
            for (const a of cardsOnHand.entries()) {
                  sumOfCardOnHand += a[1];
            }
            let needJiang = false;
            for (let cardsUsed of tempCardsAlreadyUsed) {
                if (['pao', 'ti'].indexOf(cardsUsed.type) >= 0) {
                    needJiang = true;
                }
            }
            let resultForJiangHu = this.checkHuHelper(tempCardSet, needJiang, currentCard, isDealedBySelf, tempCardsAlreadyUsed);
            if (resultWithPao && resultWithPao.status === true) {
                if (!resultForJiangHu || resultForJiangHu.status === false ||
                    resultWithPao.fan * resultWithPao.tun > resultForJiangHu.fan * resultForJiangHu.tun) {
                    resultForJiangHu = resultWithPao;
                }
            }
            if (resultForJiangHu && sumOfCardOnHand === 1 && resultForJiangHu.status === true) {
                  resultForJiangHu.huInfo.push("耍猴");
                  resultForJiangHu.fan += 8;
            }
            return resultForJiangHu;
        },
});
  