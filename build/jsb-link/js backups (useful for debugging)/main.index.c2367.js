window.__require = function c(e, o, t) {
function n(r, s) {
if (!o[r]) {
if (!e[r]) {
var u = r.split("/");
u = u[u.length - 1];
if (!e[u]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = u;
}
var a = o[r] = {
exports: {}
};
e[r][0].call(a.exports, function(c) {
return n(e[r][1][c] || c);
}, a, a.exports, c, e, o, t);
}
return o[r].exports;
}
for (var i = "function" == typeof __require && __require, r = 0; r < t.length; r++) n(t[r]);
return n;
}({
AppStart: [ function(c, e) {
"use strict";
cc._RF.push(e, "464efWj9iVHTL1j6J886qXv", "AppStart");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {},
start: function() {
this.scheduleOnce(function() {
cc.director.loadScene("Login");
}, 2);
}
});
cc._RF.pop();
}, {} ],
Login: [ function(c, e) {
"use strict";
cc._RF.push(e, "a982fjVKdJCPLQYUy78iWqV", "Login");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
onTravellerLogin: function() {
cc.director.loadScene("RoomChoice");
},
onWxLoginClicked: function() {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wxLogin", "()V");
this.schedule(function() {
var c = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wxLoginIsSuccess", "()Z");
console.log("is success " + c);
if (c) {
var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getWxAutoMessage", "()Ljava/lang/String;"), o = JSON.parse(e);
console.log("jsonInfo is " + o);
console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$" + e);
console.log("autoInfo is " + e);
this.unscheduleAllCallbacks();
}
}, .5);
}
});
cc._RF.pop();
}, {} ],
"use_v2.1-2.2.1_cc.Toggle_event": [ function(c, e) {
"use strict";
cc._RF.push(e, "ada71qWbJFENo33xqQRiWuG", "use_v2.1-2.2.1_cc.Toggle_event");
cc.Toggle && (cc.Toggle._triggerEventInScript_isChecked = !0);
cc._RF.pop();
}, {} ]
}, {}, [ "AppStart", "Login", "use_v2.1-2.2.1_cc.Toggle_event" ]);