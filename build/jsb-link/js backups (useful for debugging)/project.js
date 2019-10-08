window.__require = function o(t, c, e) {
function n(r, s) {
if (!c[r]) {
if (!t[r]) {
var a = r.split("/");
a = a[a.length - 1];
if (!t[a]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + r + "'");
}
}
var u = c[r] = {
exports: {}
};
t[r][0].call(u.exports, function(o) {
return n(t[r][1][o] || o);
}, u, u.exports, o, t, c, e);
}
return c[r].exports;
}
for (var i = "function" == typeof __require && __require, r = 0; r < e.length; r++) n(e[r]);
return n;
}({
AppStart: [ function(o, t, c) {
"use strict";
cc._RF.push(t, "464efWj9iVHTL1j6J886qXv", "AppStart");
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
Login: [ function(o, t, c) {
"use strict";
cc._RF.push(t, "a982fjVKdJCPLQYUy78iWqV", "Login");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
onWxLoginClicked: function() {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wxLogin", "()V");
this.schedule(function() {
var o = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wxLoginIsSuccess", "()Z");
console.log("is success " + o);
if (o) {
console.log("2222222222222222222222222222");
var t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getWxAutoMessage", "()Ljava/lang/String;"), c = JSON.parse(t);
console.log("jsonInfo is " + c);
console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$" + t);
console.log("autoInfo is " + t);
this.unscheduleAllCallbacks();
}
}, .5);
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "AppStart", "Login" ]);