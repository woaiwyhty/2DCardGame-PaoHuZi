// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    onEnable() {
        let fnTestServerOn = function () {
            cc.utils.net.test(function (ret) {
                if (ret) {
                    //cc.director.loadScene('hall');
                    if (ret.errcode === 0) {
                        let roomId = cc.utils.roomInfo.room_id;
                        if (roomId != null) {
                            cc.utils.joinRoom(roomId);
                        }
                    } else {
                        cc.utils.wc.hide();
                        cc.utils.roomInfo = null;
                        cc.director.loadScene('RoomChoice');
                    }
                    
                }
                else {
                    console.log("setTimeout(fnTestServerOn, 5000)");
                    setTimeout(fnTestServerOn, 5000);
                }
            });
        }

        let fn = function (data) {
            cc.utils.wc.show("正在重连...");
            fnTestServerOn();
        }

        cc.utils.mainGame.node.on('login_result', function (data) {
            cc.utils.wc.hide();
            if (data.errcode != 0 || data.relogin !== true) {
                cc.utils.roomInfo = null;
                cc.director.loadScene('RoomChoice');
            }
            cc.utils.roomInfo = {
                room_id: data.room_id,
                my_seat_id: data.seat_id,
                playersInfo: data.playersInfo,
                cardsOnHand: data.cardsOnHand,
                numberOfHoleCards: data.numberOfHoleCards,
                number_of_wang: data.number_of_wang,
                current_played_games: data.current_played_games,
                total_games: data.total_games,
                relogin: true,
            }
            console.log(data);
            cc.utils.mainGame.processLoginData();
            this.node.active = false;
        }.bind(this));

        fn();
    },

    want_to_test() {
        console.log("hello");
    },

    start () {

    },

    // update (dt) {},
});
