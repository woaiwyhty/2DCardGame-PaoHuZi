window.__require = function e(t, n, i) {
function o(r, s) {
if (!n[r]) {
if (!t[r]) {
var u = r.split("/");
u = u[u.length - 1];
if (!t[u]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(u, !0);
if (c) return c(u, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = u;
}
var a = n[r] = {
exports: {}
};
t[r][0].call(a.exports, function(e) {
return o(t[r][1][e] || e);
}, a, a.exports, e, t, n, i);
}
return n[r].exports;
}
for (var c = "function" == typeof __require && __require, r = 0; r < i.length; r++) o(i[r]);
return o;
}({
Alert: [ function(e, t) {
"use strict";
cc._RF.push(t, "8d711wD+99JZLDcFizBmkPy", "Alert");
cc.Class({
extends: cc.Component,
properties: {
_alert: null,
_btnOK: null,
_btnCancel: null,
_title: null,
_content: null,
_onok: null
},
onLoad: function() {
if (null != cc.utils) {
this._alert = cc.find("Canvas/alert");
this._title = cc.find("Canvas/alert/title").getComponent(cc.Label);
this._content = cc.find("Canvas/alert/content").getComponent(cc.Label);
this._btnOK = cc.find("Canvas/alert/btn_ok");
this._btnCancel = cc.find("Canvas/alert/btn_cancel");
cc.utils.main.addClickEvent(this._btnOK, this.node, "Alert", "onBtnClicked");
cc.utils.main.addClickEvent(this._btnCancel, this.node, "Alert", "onBtnClicked");
this._alert.active = !1;
cc.utils.alert = this;
console.log(cc.utils.alert);
}
},
onBtnClicked: function(e) {
"btn_ok" == e.target.name && this._onok && this._onok();
this._alert.active = !1;
this._onok = null;
},
show: function(e, t, n, i) {
this._alert.active = !0;
this._onok = n;
this._title.string = e;
this._content.string = t;
if (i) {
this._btnCancel.active = !0;
this._btnOK.x = -150;
this._btnCancel.x = 150;
} else {
this._btnCancel.active = !1;
this._btnOK.x = 0;
}
},
onDestory: function() {
cc.utils && (cc.utils.alert = null);
}
});
cc._RF.pop();
}, {} ],
AppStart: [ function(e, t) {
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
BackgroundScaler: [ function(e, t) {
"use strict";
cc._RF.push(t, "85828i1gn9MEoZl2e+F39PS", "BackgroundScaler");
cc.Class({
extends: cc.Component,
properties: {
scaleMethod: 0
},
start: function() {
var e = cc.find("Canvas").getComponent(cc.Canvas), t = cc.view.getFrameSize(), n = this.scaleMethod;
if (1 == n) e.fitWidth ? this.node.height = this.node.width / t.width * t.height : this.node.width = this.node.height / t.height * t.width; else if (2 == n) if (e.fitWidth) {
var i = this.node.height;
this.node.height = this.node.width / t.width * t.height;
this.node.width = this.node.height / i * this.node.width;
} else {
var o = this.node.width;
this.node.width = this.node.height / t.height * t.width;
this.node.height = this.node.width / o * this.node.height;
}
}
});
cc._RF.pop();
}, {} ],
CreateRole: [ function(e, t) {
"use strict";
cc._RF.push(t, "3f4f5UIF8VLDrReUDEcZGgw", "CreateRole");
cc.Class({
extends: cc.Component,
properties: {
inputName: cc.EditBox
},
onRandomBtnClicked: function() {
var e = [ "上官", "欧阳", "东方", "端木", "独孤", "司马", "南宫", "夏侯", "诸葛", "皇甫", "长孙", "宇文", "轩辕", "东郭", "子车", "东阳", "子言" ], t = [ "雀圣", "赌侠", "赌圣", "稳赢", "不输", "好运", "自摸", "有钱", "土豪" ], n = Math.floor(Math.random() * (e.length - 1)), i = Math.floor(Math.random() * (t.length - 1));
this.inputName.string = e[n] + t[i];
},
onLoad: function() {
cc.utils.main.setFitScreenMode();
this.onRandomBtnClicked();
},
onBtnConfirmClicked: function() {
var e = this.inputName.string;
if ("" != e) {
cc.utils.userInfo.nickname = e;
cc.utils.userInfo.travellerMode = !0;
cc.utils.http.sendRequest("/guestSignup", {
username: cc.utils.userInfo.username,
nickname: e
}, function(e) {
if (0 === e.errcode) {
cc.utils.userInfo.token = e.token;
cc.director.loadScene("RoomChoice");
}
});
} else console.log("invalid name.");
}
});
cc._RF.pop();
}, {} ],
1: [ function(e, t) {
var n = e("util/"), i = Array.prototype.slice, o = Object.prototype.hasOwnProperty, c = t.exports = a;
c.AssertionError = function(e) {
this.name = "AssertionError";
this.actual = e.actual;
this.expected = e.expected;
this.operator = e.operator;
if (e.message) {
this.message = e.message;
this.generatedMessage = !1;
} else {
this.message = u(this);
this.generatedMessage = !0;
}
var t = e.stackStartFunction || l;
if (Error.captureStackTrace) Error.captureStackTrace(this, t); else {
var n = new Error();
if (n.stack) {
var i = n.stack, o = t.name, c = i.indexOf("\n" + o);
if (c >= 0) {
var r = i.indexOf("\n", c + 1);
i = i.substring(r + 1);
}
this.stack = i;
}
}
};
n.inherits(c.AssertionError, Error);
function r(e, t) {
return n.isUndefined(t) ? "" + t : n.isNumber(t) && !isFinite(t) ? t.toString() : n.isFunction(t) || n.isRegExp(t) ? t.toString() : t;
}
function s(e, t) {
return n.isString(e) ? e.length < t ? e : e.slice(0, t) : e;
}
function u(e) {
return s(JSON.stringify(e.actual, r), 128) + " " + e.operator + " " + s(JSON.stringify(e.expected, r), 128);
}
function l(e, t, n, i, o) {
throw new c.AssertionError({
message: n,
actual: e,
expected: t,
operator: i,
stackStartFunction: o
});
}
c.fail = l;
function a(e, t) {
e || l(e, !0, t, "==", c.ok);
}
c.ok = a;
c.equal = function(e, t, n) {
e != t && l(e, t, n, "==", c.equal);
};
c.notEqual = function(e, t, n) {
e == t && l(e, t, n, "!=", c.notEqual);
};
c.deepEqual = function(e, t, n) {
f(e, t) || l(e, t, n, "deepEqual", c.deepEqual);
};
function f(e, t) {
if (e === t) return !0;
if (n.isBuffer(e) && n.isBuffer(t)) {
if (e.length != t.length) return !1;
for (var i = 0; i < e.length; i++) if (e[i] !== t[i]) return !1;
return !0;
}
return n.isDate(e) && n.isDate(t) ? e.getTime() === t.getTime() : n.isRegExp(e) && n.isRegExp(t) ? e.source === t.source && e.global === t.global && e.multiline === t.multiline && e.lastIndex === t.lastIndex && e.ignoreCase === t.ignoreCase : n.isObject(e) || n.isObject(t) ? h(e, t) : e == t;
}
function d(e) {
return "[object Arguments]" == Object.prototype.toString.call(e);
}
function h(e, t) {
if (n.isNullOrUndefined(e) || n.isNullOrUndefined(t)) return !1;
if (e.prototype !== t.prototype) return !1;
if (n.isPrimitive(e) || n.isPrimitive(t)) return e === t;
var o = d(e), c = d(t);
if (o && !c || !o && c) return !1;
if (o) return f(e = i.call(e), t = i.call(t));
var r, s, u = m(e), l = m(t);
if (u.length != l.length) return !1;
u.sort();
l.sort();
for (s = u.length - 1; s >= 0; s--) if (u[s] != l[s]) return !1;
for (s = u.length - 1; s >= 0; s--) if (!f(e[r = u[s]], t[r])) return !1;
return !0;
}
c.notDeepEqual = function(e, t, n) {
f(e, t) && l(e, t, n, "notDeepEqual", c.notDeepEqual);
};
c.strictEqual = function(e, t, n) {
e !== t && l(e, t, n, "===", c.strictEqual);
};
c.notStrictEqual = function(e, t, n) {
e === t && l(e, t, n, "!==", c.notStrictEqual);
};
function p(e, t) {
return !(!e || !t) && ("[object RegExp]" == Object.prototype.toString.call(t) ? t.test(e) : e instanceof t || !0 === t.call({}, e));
}
function g(e, t, i, o) {
var c;
if (n.isString(i)) {
o = i;
i = null;
}
try {
t();
} catch (e) {
c = e;
}
o = (i && i.name ? " (" + i.name + ")." : ".") + (o ? " " + o : ".");
e && !c && l(c, i, "Missing expected exception" + o);
!e && p(c, i) && l(c, i, "Got unwanted exception" + o);
if (e && c && i && !p(c, i) || !e && c) throw c;
}
c.throws = function(e, t, n) {
g.apply(this, [ !0 ].concat(i.call(arguments)));
};
c.doesNotThrow = function(e, t) {
g.apply(this, [ !1 ].concat(i.call(arguments)));
};
c.ifError = function(e) {
if (e) throw e;
};
var m = Object.keys || function(e) {
var t = [];
for (var n in e) o.call(e, n) && t.push(n);
return t;
};
}, {
"util/": 4
} ],
2: [ function(e, t) {
"function" == typeof Object.create ? t.exports = function(e, t) {
e.super_ = t;
e.prototype = Object.create(t.prototype, {
constructor: {
value: e,
enumerable: !1,
writable: !0,
configurable: !0
}
});
} : t.exports = function(e, t) {
e.super_ = t;
var n = function() {};
n.prototype = t.prototype;
e.prototype = new n();
e.prototype.constructor = e;
};
}, {} ],
3: [ function(e, t) {
t.exports = function(e) {
return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8;
};
}, {} ],
4: [ function(e, t, n) {
(function(t, i) {
var o = /%[sdj%]/g;
n.format = function(e) {
if (!b(e)) {
for (var t = [], n = 0; n < arguments.length; n++) t.push(s(arguments[n]));
return t.join(" ");
}
n = 1;
for (var i = arguments, c = i.length, r = String(e).replace(o, function(e) {
if ("%%" === e) return "%";
if (n >= c) return e;
switch (e) {
case "%s":
return String(i[n++]);

case "%d":
return Number(i[n++]);

case "%j":
try {
return JSON.stringify(i[n++]);
} catch (e) {
return "[Circular]";
}

default:
return e;
}
}), u = i[n]; n < c; u = i[++n]) w(u) || !S(u) ? r += " " + u : r += " " + s(u);
return r;
};
n.deprecate = function(e, o) {
if (R(i.process)) return function() {
return n.deprecate(e, o).apply(this, arguments);
};
if (!0 === t.noDeprecation) return e;
var c = !1;
return function() {
if (!c) {
if (t.throwDeprecation) throw new Error(o);
t.traceDeprecation ? console.trace(o) : console.error(o);
c = !0;
}
return e.apply(this, arguments);
};
};
var c, r = {};
n.debuglog = function(e) {
R(c) && (c = t.env.NODE_DEBUG || "");
e = e.toUpperCase();
if (!r[e]) if (new RegExp("\\b" + e + "\\b", "i").test(c)) {
var i = t.pid;
r[e] = function() {
var t = n.format.apply(n, arguments);
console.error("%s %d: %s", e, i, t);
};
} else r[e] = function() {};
return r[e];
};
function s(e, t) {
var i = {
seen: [],
stylize: l
};
arguments.length >= 3 && (i.depth = arguments[2]);
arguments.length >= 4 && (i.colors = arguments[3]);
y(t) ? i.showHidden = t : t && n._extend(i, t);
R(i.showHidden) && (i.showHidden = !1);
R(i.depth) && (i.depth = 2);
R(i.colors) && (i.colors = !1);
R(i.customInspect) && (i.customInspect = !0);
i.colors && (i.stylize = u);
return f(i, e, i.depth);
}
n.inspect = s;
s.colors = {
bold: [ 1, 22 ],
italic: [ 3, 23 ],
underline: [ 4, 24 ],
inverse: [ 7, 27 ],
white: [ 37, 39 ],
grey: [ 90, 39 ],
black: [ 30, 39 ],
blue: [ 34, 39 ],
cyan: [ 36, 39 ],
green: [ 32, 39 ],
magenta: [ 35, 39 ],
red: [ 31, 39 ],
yellow: [ 33, 39 ]
};
s.styles = {
special: "cyan",
number: "yellow",
boolean: "yellow",
undefined: "grey",
null: "bold",
string: "green",
date: "magenta",
regexp: "red"
};
function u(e, t) {
var n = s.styles[t];
return n ? "[" + s.colors[n][0] + "m" + e + "[" + s.colors[n][1] + "m" : e;
}
function l(e) {
return e;
}
function a(e) {
var t = {};
e.forEach(function(e) {
t[e] = !0;
});
return t;
}
function f(e, t, i) {
if (e.customInspect && t && x(t.inspect) && t.inspect !== n.inspect && (!t.constructor || t.constructor.prototype !== t)) {
var o = t.inspect(i, e);
b(o) || (o = f(e, o, i));
return o;
}
var c = d(e, t);
if (c) return c;
var r = Object.keys(t), s = a(r);
e.showHidden && (r = Object.getOwnPropertyNames(t));
if (E(t) && (r.indexOf("message") >= 0 || r.indexOf("description") >= 0)) return h(t);
if (0 === r.length) {
if (x(t)) {
var u = t.name ? ": " + t.name : "";
return e.stylize("[Function" + u + "]", "special");
}
if (C(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
if (k(t)) return e.stylize(Date.prototype.toString.call(t), "date");
if (E(t)) return h(t);
}
var l, y = "", w = !1, _ = [ "{", "}" ];
if (v(t)) {
w = !0;
_ = [ "[", "]" ];
}
x(t) && (y = " [Function" + (t.name ? ": " + t.name : "") + "]");
C(t) && (y = " " + RegExp.prototype.toString.call(t));
k(t) && (y = " " + Date.prototype.toUTCString.call(t));
E(t) && (y = " " + h(t));
if (0 === r.length && (!w || 0 == t.length)) return _[0] + y + _[1];
if (i < 0) return C(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special");
e.seen.push(t);
l = w ? p(e, t, i, s, r) : r.map(function(n) {
return g(e, t, i, s, n, w);
});
e.seen.pop();
return m(l, y, _);
}
function d(e, t) {
if (R(t)) return e.stylize("undefined", "undefined");
if (b(t)) {
var n = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
return e.stylize(n, "string");
}
return _(t) ? e.stylize("" + t, "number") : y(t) ? e.stylize("" + t, "boolean") : w(t) ? e.stylize("null", "null") : void 0;
}
function h(e) {
return "[" + Error.prototype.toString.call(e) + "]";
}
function p(e, t, n, i, o) {
for (var c = [], r = 0, s = t.length; r < s; ++r) T(t, String(r)) ? c.push(g(e, t, n, i, String(r), !0)) : c.push("");
o.forEach(function(o) {
o.match(/^\d+$/) || c.push(g(e, t, n, i, o, !0));
});
return c;
}
function g(e, t, n, i, o, c) {
var r, s, u;
(u = Object.getOwnPropertyDescriptor(t, o) || {
value: t[o]
}).get ? s = u.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : u.set && (s = e.stylize("[Setter]", "special"));
T(i, o) || (r = "[" + o + "]");
s || (e.seen.indexOf(u.value) < 0 ? (s = w(n) ? f(e, u.value, null) : f(e, u.value, n - 1)).indexOf("\n") > -1 && (s = c ? s.split("\n").map(function(e) {
return "  " + e;
}).join("\n").substr(2) : "\n" + s.split("\n").map(function(e) {
return "   " + e;
}).join("\n")) : s = e.stylize("[Circular]", "special"));
if (R(r)) {
if (c && o.match(/^\d+$/)) return s;
if ((r = JSON.stringify("" + o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
r = r.substr(1, r.length - 2);
r = e.stylize(r, "name");
} else {
r = r.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
r = e.stylize(r, "string");
}
}
return r + ": " + s;
}
function m(e, t, n) {
return e.reduce(function(e, t) {
t.indexOf("\n");
return e + t.replace(/\u001b\[\d\d?m/g, "").length + 1;
}, 0) > 60 ? n[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + n[1] : n[0] + t + " " + e.join(", ") + " " + n[1];
}
function v(e) {
return Array.isArray(e);
}
n.isArray = v;
function y(e) {
return "boolean" == typeof e;
}
n.isBoolean = y;
function w(e) {
return null === e;
}
n.isNull = w;
n.isNullOrUndefined = function(e) {
return null == e;
};
function _(e) {
return "number" == typeof e;
}
n.isNumber = _;
function b(e) {
return "string" == typeof e;
}
n.isString = b;
n.isSymbol = function(e) {
return "symbol" == typeof e;
};
function R(e) {
return void 0 === e;
}
n.isUndefined = R;
function C(e) {
return S(e) && "[object RegExp]" === F(e);
}
n.isRegExp = C;
function S(e) {
return "object" == typeof e && null !== e;
}
n.isObject = S;
function k(e) {
return S(e) && "[object Date]" === F(e);
}
n.isDate = k;
function E(e) {
return S(e) && ("[object Error]" === F(e) || e instanceof Error);
}
n.isError = E;
function x(e) {
return "function" == typeof e;
}
n.isFunction = x;
n.isPrimitive = function(e) {
return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e;
};
n.isBuffer = e("./support/isBuffer");
function F(e) {
return Object.prototype.toString.call(e);
}
function O(e) {
return e < 10 ? "0" + e.toString(10) : e.toString(10);
}
var N = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
function I() {
var e = new Date(), t = [ O(e.getHours()), O(e.getMinutes()), O(e.getSeconds()) ].join(":");
return [ e.getDate(), N[e.getMonth()], t ].join(" ");
}
n.log = function() {
console.log("%s - %s", I(), n.format.apply(n, arguments));
};
n.inherits = e("inherits");
n._extend = function(e, t) {
if (!t || !S(t)) return e;
for (var n = Object.keys(t), i = n.length; i--; ) e[n[i]] = t[n[i]];
return e;
};
function T(e, t) {
return Object.prototype.hasOwnProperty.call(e, t);
}
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./support/isBuffer": 3,
_process: 5,
inherits: 2
} ],
5: [ function(e, t) {
var n, i, o = t.exports = {};
function c() {
throw new Error("setTimeout has not been defined");
}
function r() {
throw new Error("clearTimeout has not been defined");
}
(function() {
try {
n = "function" == typeof setTimeout ? setTimeout : c;
} catch (e) {
n = c;
}
try {
i = "function" == typeof clearTimeout ? clearTimeout : r;
} catch (e) {
i = r;
}
})();
function s(e) {
if (n === setTimeout) return setTimeout(e, 0);
if ((n === c || !n) && setTimeout) {
n = setTimeout;
return setTimeout(e, 0);
}
try {
return n(e, 0);
} catch (t) {
try {
return n.call(null, e, 0);
} catch (t) {
return n.call(this, e, 0);
}
}
}
function u(e) {
if (i === clearTimeout) return clearTimeout(e);
if ((i === r || !i) && clearTimeout) {
i = clearTimeout;
return clearTimeout(e);
}
try {
return i(e);
} catch (t) {
try {
return i.call(null, e);
} catch (t) {
return i.call(this, e);
}
}
}
var l, a = [], f = !1, d = -1;
function h() {
if (f && l) {
f = !1;
l.length ? a = l.concat(a) : d = -1;
a.length && p();
}
}
function p() {
if (!f) {
var e = s(h);
f = !0;
for (var t = a.length; t; ) {
l = a;
a = [];
for (;++d < t; ) l && l[d].run();
d = -1;
t = a.length;
}
l = null;
f = !1;
u(e);
}
}
o.nextTick = function(e) {
var t = new Array(arguments.length - 1);
if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
a.push(new g(e, t));
1 !== a.length || f || s(p);
};
function g(e, t) {
this.fun = e;
this.array = t;
}
g.prototype.run = function() {
this.fun.apply(null, this.array);
};
o.title = "browser";
o.browser = !0;
o.env = {};
o.argv = [];
o.version = "";
o.versions = {};
function m() {}
o.on = m;
o.addListener = m;
o.once = m;
o.off = m;
o.removeListener = m;
o.removeAllListeners = m;
o.emit = m;
o.prependListener = m;
o.prependOnceListener = m;
o.listeners = function() {
return [];
};
o.binding = function() {
throw new Error("process.binding is not supported");
};
o.cwd = function() {
return "/";
};
o.chdir = function() {
throw new Error("process.chdir is not supported");
};
o.umask = function() {
return 0;
};
}, {} ],
GameNetworkingManager: [ function(e, t) {
"use strict";
cc._RF.push(t, "39f3bFW8iBAa5gHmVNbYj/Y", "GameNetworkingManager");
cc.Class({
extends: cc.Component,
properties: {
dataEventHandler: null,
roomId: null,
maxNumOfGames: 0,
numOfGames: 0,
numOfMJ: 0,
seatIndex: -1,
seats: null,
turn: -1,
button: -1,
dingque: -1,
chupai: -1,
isDingQueing: !1,
isHuanSanZhang: !1,
gamestate: "",
isOver: !1,
dissoveData: null
},
clear: function() {
this.dataEventHandler = null;
if (null == this.isOver) {
this.seats = null;
this.roomId = null;
this.maxNumOfGames = 0;
this.numOfGames = 0;
}
},
dispatchEvent: function(e, t) {
this.dataEventHandler && this.dataEventHandler.emit(e, t);
},
initEventHandlers: function() {
var e = this;
cc.utils.net.addHandler("login_result", function(t) {
console.log(t);
e.dispatchEvent("login_result", t);
});
},
connectToGameServer: function(e) {
this.dissoveData = null;
console.log(cc.utils.net.ip);
cc.utils.wc.show("正在加入房间");
cc.utils.net.connect(function() {
console.log("onConnectOK");
var t = {
token: e.token,
room_id: e.room_id,
time: e.time,
username: e.username
};
cc.utils.net.send("login", t);
}, function() {
console.log("failed.");
cc.utils.wc.hide();
});
}
});
cc._RF.pop();
}, {} ],
HTTPUtil: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "be25eLIwqZCT5T8cWUa4Xbr", "HTTPUtil");
e("assert").fail;
var i = "http://192.168.1.8:9001";
n.master_url = null;
n.url = null;
n.token = null;
o();
function o() {
n.master_url = i;
n.url = i;
}
n.sendRequest = function e(t, i, o, c, r, s) {
void 0 === r && (r = !1);
void 0 === s && (s = null);
var u = cc.loader.getXMLHttpRequest();
u.timeout = 5e3;
null == i && (i = {});
n.token && (i.token = n.token);
null == c && (c = n.url);
var l = t, a = "?";
for (var f in i) {
"?" != a && (a += "&");
a += f + "=" + i[f];
}
var d = c + l + encodeURI(a);
console.log("RequestURL:" + d);
u.open("GET", d, !0);
cc.sys.isNative && u.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
var h = setTimeout(function() {
u.hasRetried = !0;
u.abort();
console.log("http timeout");
p();
}, 5e3), p = function() {
e(t, i, o, c, !0, s);
};
u.onreadystatechange = function() {
console.log("onreadystatechange");
clearTimeout(h);
if (4 === u.readyState && u.status >= 200 && u.status < 300) {
cc.log("request from [" + u.responseURL + "] data [", t, "]");
var e = u.responseText, t = null;
try {
t = JSON.parse(e);
} catch (e) {
console.log("err:" + e);
t = {
errcode: -10001,
errmsg: e
};
}
o && o(t);
o = null;
} else if (4 === u.readyState) {
if (r) {
s && s({
errcode: 400,
errmsg: "Cannot connect with the server!"
});
return;
}
console.log("other readystate == 4, status:" + u.status);
setTimeout(function() {
p();
}, 5e3);
} else console.log("other readystate:" + u.readyState + ", status:" + u.status);
};
try {
u.send();
} catch (e) {
p();
}
return u;
};
n.setURL = function(e) {
i = e;
o();
};
cc._RF.pop();
}, {
assert: 1
} ],
JoinGameInput: [ function(e, t) {
"use strict";
cc._RF.push(t, "10a1c8jz95Ju4NnpkOWUfin", "JoinGameInput");
cc.Class({
extends: cc.Component,
properties: {
nums: {
default: [],
type: [ cc.Label ]
},
_inputIndex: 0
},
onLoad: function() {},
onEnable: function() {
this.onResetClicked();
},
onInputFinished: function(e) {
var t = this;
cc.utils.http.sendRequest("/joinRoom", {
username: cc.utils.userInfo.username,
token: cc.utils.userInfo.token,
room_id: e
}, function(n) {
if (0 == n.errcode) {
t.node.active = !1;
cc.utils.joinRoom(e);
} else {
var i;
i = 1 === n.errcode ? "房间[" + e + "]不存在，请重新输入!" : 2 === n.errcode ? "房间[" + e + "]已满!" : 3 === n.errcode ? "您已经在别的房间!" : n.errmsg;
cc.utils.alert.show("提示", i);
t.onResetClicked();
}
}.bind(this));
},
onInput: function(e) {
if (!(this._inputIndex >= this.nums.length)) {
this.nums[this._inputIndex].string = e;
this._inputIndex += 1;
if (this._inputIndex == this.nums.length) {
var t = this.parseRoomID();
console.log("ok:" + t);
this.onInputFinished(t);
}
}
},
onN0Clicked: function() {
this.onInput(0);
},
onN1Clicked: function() {
this.onInput(1);
},
onN2Clicked: function() {
this.onInput(2);
},
onN3Clicked: function() {
this.onInput(3);
},
onN4Clicked: function() {
this.onInput(4);
},
onN5Clicked: function() {
this.onInput(5);
},
onN6Clicked: function() {
this.onInput(6);
},
onN7Clicked: function() {
this.onInput(7);
},
onN8Clicked: function() {
this.onInput(8);
},
onN9Clicked: function() {
this.onInput(9);
},
onResetClicked: function() {
for (var e = 0; e < this.nums.length; ++e) this.nums[e].string = "";
this._inputIndex = 0;
},
parseRoomID: function() {
for (var e = "", t = 0; t < this.nums.length; ++t) e += this.nums[t].string;
return parseInt(e);
}
});
cc._RF.pop();
}, {} ],
Loading: [ function(e, t) {
"use strict";
cc._RF.push(t, "7ee377ItBVP9qB/L0MxRA09", "Loading");
cc.Class({
extends: cc.Component,
properties: {
tipLabel: cc.Label
},
onLoad: function() {
this.initFrameworks();
cc.utils.main.setFitScreenMode();
console.log(this.tipLabel.string);
cc.utils.http.sendRequest("/isServerOn", {}, this.onServerOn, null, !1, this.onServerOff.bind(this));
},
initFrameworks: function() {
cc.utils = {};
cc.utils.http = e("HTTPUtil");
cc.utils.net = e("Net");
cc.utils.net.ip = "192.168.1.8:9001";
console.log(window.io, cc.utils.net);
var t = e("GameNetworkingManager");
cc.utils.gameNetworkingManager = new t();
cc.utils.gameNetworkingManager.initEventHandlers();
cc.utils.userInfo = {
username: "",
nickname: "",
token: "",
travellerMode: !1
};
var n = e("Utils");
cc.utils.main = new n();
},
onServerOn: function() {
cc.director.loadScene("Login");
},
onServerOff: function(e) {
console.log("server is down!", e);
this.tipLabel.string = "连接服务器失败!";
setTimeout(function() {
cc.game.end();
}, 2e3);
}
});
cc._RF.pop();
}, {
GameNetworkingManager: "GameNetworkingManager",
HTTPUtil: "HTTPUtil",
Net: "Net",
Utils: "Utils"
} ],
Login: [ function(e, t) {
"use strict";
cc._RF.push(t, "a982fjVKdJCPLQYUy78iWqV", "Login");
cc.Class({
extends: cc.Component,
properties: {
username: cc.EditBox,
password: cc.EditBox,
status: cc.Label
},
onLoad: function() {
cc.utils.main.setFitScreenMode();
},
start: function() {},
onTravellerLogin: function() {
var e = cc.sys.localStorage.getItem("account");
if (null == e) {
e = Date.now();
cc.sys.localStorage.setItem("account", e);
}
cc.utils.userInfo.username = e;
cc.utils.http.sendRequest("/guestLogin", {
username: e
}, function(e) {
if (1 === e.errcode) cc.director.loadScene("CreateRole"); else if (0 === e.errcode) {
cc.utils.userInfo.token = e.token;
cc.director.loadScene("RoomChoice");
}
});
},
onUsernameLogin: function() {
this.username.string.length < 6 || this.password.string.length < 6 ? this.status.string = "帐号或密码太短!" : this.status.string = "正在登录...";
},
onWxLoginClicked: function() {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wxLogin", "()V");
this.schedule(function() {
var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wxLoginIsSuccess", "()Z");
console.log("is success " + e);
if (e) {
var t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getWxAutoMessage", "()Ljava/lang/String;"), n = JSON.parse(t);
console.log("jsonInfo is " + n);
console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$" + t);
console.log("autoInfo is " + t);
this.unscheduleAllCallbacks();
}
}, .5);
}
});
cc._RF.pop();
}, {} ],
MainGame: [ function(e, t) {
"use strict";
cc._RF.push(t, "4d25c3C0IdMhrMamddE4svl", "MainGame");
cc.Class({
extends: cc.Component,
properties: {
timeLabel: cc.Label,
roomIdLabel: cc.Label
},
onLoad: function() {
cc.utils.main.setFitScreenMode();
this.roomIdLabel.string = cc.utils.room_id;
this.initEventHandlers();
},
initEventHandlers: function() {
cc.utils.gameNetworkingManager.dataEventHandler = this.node;
this.node.on("login_result", function() {
console.log("login_result arrived");
});
},
update: function() {
var e = Math.floor(Date.now() / 1e3 / 60);
if (this._lastMinute != e) {
this._lastMinute = e;
var t = new Date(), n = t.getHours();
n = n < 10 ? "0" + n : n;
var i = t.getMinutes();
i = i < 10 ? "0" + i : i;
this.timeLabel.string = n + ":" + i;
}
}
});
cc._RF.pop();
}, {} ],
Net: [ function(e, t) {
"use strict";
cc._RF.push(t, "c67baIDiShFh4/KPZ2AgEis", "Net");
null == window.io && (window.io = e("socket-io"));
cc.Class({
extends: cc.Component,
statics: {
ip: "",
sio: null,
isPinging: !1,
fnDisconnect: null,
handlers: {},
addHandler: function(e, t) {
if (this.handlers[e]) console.log("event:" + e + "' handler has been registered."); else {
var n = function(n) {
"disconnect" != e && "string" == typeof n && (n = JSON.parse(n));
t(n);
};
this.handlers[e] = n;
if (this.sio) {
console.log("register:function " + e);
this.sio.on(e, n);
}
}
},
connect: function(e) {
var t = this;
this.sio = window.io.connect(this.ip, {
reconnection: !1,
"force new connection": !0,
transports: [ "websocket", "polling" ]
});
this.sio.on("reconnect", function() {
console.log("reconnection");
});
this.sio.on("connect", function(n) {
t.sio.connected = !0;
e(n);
});
this.sio.on("disconnect", function() {
console.log("disconnect");
t.sio.connected = !1;
t.close();
});
this.sio.on("connect_failed", function() {
console.log("connect_failed");
});
for (var n in this.handlers) {
var i = this.handlers[n];
if ("function" == typeof i) if ("disconnect" == n) this.fnDisconnect = i; else {
console.log("register:function " + n);
this.sio.on(n, i);
}
}
this.startHearbeat();
},
startHearbeat: function() {
this.sio.on("game_pong", function() {
console.log("game_pong");
e.lastRecieveTime = Date.now();
e.delayMS = e.lastRecieveTime - e.lastSendTime;
console.log(e.delayMS);
});
this.lastRecieveTime = Date.now();
var e = this;
console.log(1);
if (!e.isPinging) {
e.isPinging = !0;
cc.game.on(cc.game.EVENT_HIDE, function() {
e.ping();
});
setInterval(function() {
e.sio && e.ping();
}.bind(this), 5e3);
setInterval(function() {
if (e.sio && Date.now() - e.lastRecieveTime > 1e4) {
console.log("omg... trying to close ws");
e.close();
}
}.bind(this), 500);
}
},
send: function(e, t) {
console.log("sio send", e, t);
if (this.sio.connected) {
null != t && "object" == typeof t && (t = JSON.stringify(t));
null == t && (t = "");
this.sio.emit(e, t);
}
},
ping: function() {
if (this.sio) {
this.lastSendTime = Date.now();
console.log("sent game_ping");
this.send("game_ping");
}
},
close: function() {
console.log("close");
this.delayMS = null;
if (this.sio && this.sio.connected) {
this.sio.connected = !1;
this.sio.disconnect();
}
this.sio = null;
if (this.fnDisconnect) {
this.fnDisconnect();
this.fnDisconnect = null;
}
},
test: function(e) {
cc.utils.main.sendRequest("/hi", null, function(t) {
e(0 == t.errcode);
}, "http://" + this.ip);
}
}
});
cc._RF.pop();
}, {
"socket-io": void 0
} ],
RoomChoice: [ function(e, t) {
"use strict";
cc._RF.push(t, "f9323NccwJOxolqgGoVJwiy", "RoomChoice");
cc.Class({
extends: cc.Component,
properties: {
waitingConnection: cc.Node,
joinGameWindow: cc.Node,
createRoomWindow: cc.Node,
checkbox6Rounds: cc.Sprite,
checkbox12Rounds: cc.Sprite,
uncheckedSprite: cc.SpriteFrame,
checkedSprite: cc.SpriteFrame
},
onLoad: function() {
cc.utils.joinRoom = this.joinRoom;
cc.utils.main.setFitScreenMode();
this.initEventHandlers();
this.selected6Rounds = !1;
this.on6RoundsSelected();
},
initEventHandlers: function() {
cc.utils.gameNetworkingManager.dataEventHandler = this.node;
this.node.on("login_result", function(e) {
console.log("login_result arrived", e);
if (0 === e.errcode) {
cc.utils.room_id = e.room_id;
cc.utils.wc.hide();
cc.director.loadScene("PaohuZiGame");
}
});
},
onCreateRoomClicked: function() {
this.createRoomWindow.active = !0;
},
onJoinRoomClicked: function() {
this.joinGameWindow.active = !0;
},
onCloseCreateRoomClicked: function() {
this.createRoomWindow.active = !1;
},
onCloseJoinRoomClicked: function() {
this.joinGameWindow.active = !1;
},
onCreateRoomConfirmButtonClicked: function() {
var e = this, t = 6;
this.selected6Rounds || (t = 12);
cc.utils.http.sendRequest("/createRoom", {
username: cc.utils.userInfo.username,
token: cc.utils.userInfo.token,
num_of_games: t
}, function(t) {
console.log(t);
0 === t.errcode ? e.joinRoom(t.room_id) : cc.utils.alert.show("提示", t.errmsg);
}.bind(this));
},
joinRoom: function(e) {
cc.utils.gameNetworkingManager.connectToGameServer({
username: cc.utils.userInfo.username,
token: cc.utils.userInfo.token,
room_id: e,
time: Date.now()
});
},
on6RoundsSelected: function() {
console.log("on6RoundsSelected");
if (!this.selected6Rounds) {
this.selected6Rounds = !0;
this.checkbox6Rounds.spriteFrame = this.checkedSprite;
this.checkbox12Rounds.spriteFrame = this.uncheckedSprite;
}
},
on12RoundsSelected: function() {
console.log("on12RoundsSelected");
if (this.selected6Rounds) {
this.selected6Rounds = !1;
this.checkbox6Rounds.spriteFrame = this.uncheckedSprite;
this.checkbox12Rounds.spriteFrame = this.checkedSprite;
}
}
});
cc._RF.pop();
}, {} ],
RoomManagerUtil: [ function(e, t) {
"use strict";
cc._RF.push(t, "8b98fjiOYRF6YvyKYtmCaUW", "RoomManagerUtil");
cc._RF.pop();
}, {} ],
Utils: [ function(e, t) {
"use strict";
cc._RF.push(t, "07e7fdPl0REq5XybOY99ea/", "Utils");
cc.Class({
extends: cc.Component,
properties: {},
addClickEvent: function(e, t, n, i) {
console.log(n + ":" + i);
var o = new cc.Component.EventHandler();
o.target = t;
o.component = n;
o.handler = i;
e.getComponent(cc.Button).clickEvents.push(o);
},
addSlideEvent: function(e, t, n, i) {
var o = new cc.Component.EventHandler();
o.target = t;
o.component = n;
o.handler = i;
e.getComponent(cc.Slider).slideEvents.push(o);
},
addEscEvent: function(e) {
cc.eventManager.addListener({
event: cc.EventListener.KEYBOARD,
onKeyPressed: function() {},
onKeyReleased: function(e) {
e == cc.KEY.back && cc.vv.alert.show("提示", "确定要退出游戏吗？", function() {
cc.game.end();
}, !0);
}
}, e);
},
setFitScreenMode: function() {
var e = cc.find("Canvas"), t = cc.view.getFrameSize(), n = t.width, i = t.height, o = e.getComponent(cc.Canvas);
if (n / i > o.designResolution.width / o.designResolution.height) {
o.fitHeight = !0;
o.fitWidth = !1;
} else {
o.fitHeight = !1;
o.fitWidth = !0;
}
}
});
cc._RF.pop();
}, {} ],
WaitingConnection: [ function(e, t) {
"use strict";
cc._RF.push(t, "9c66cFYHNNLg710XrNY7p24", "WaitingConnection");
cc.Class({
extends: cc.Component,
properties: {
target: cc.Node,
_isShow: !1,
lblContent: cc.Label
},
onLoad: function() {
if (null == cc.utils) return null;
cc.utils.wc = this;
this.node.active = this._isShow;
},
update: function(e) {
this.target.angle = this.target.angle - 45 * e;
},
show: function(e) {
this._isShow = !0;
this.node && (this.node.active = this._isShow);
if (this.lblContent) {
null == e && (e = "");
this.lblContent.string = e;
}
},
hide: function() {
this._isShow = !1;
this.node && (this.node.active = this._isShow);
}
});
cc._RF.pop();
}, {} ],
"use_v2.1-2.2.1_cc.Toggle_event": [ function(e, t) {
"use strict";
cc._RF.push(t, "ada71qWbJFENo33xqQRiWuG", "use_v2.1-2.2.1_cc.Toggle_event");
cc.Toggle && (cc.Toggle._triggerEventInScript_isChecked = !0);
cc._RF.pop();
}, {} ]
}, {}, [ "Alert", "AppStart", "BackgroundScaler", "CreateRole", "GameNetworkingManager", "HTTPUtil", "JoinGameInput", "Loading", "Login", "MainGame", "Net", "RoomChoice", "RoomManagerUtil", "Utils", "WaitingConnection", "use_v2.1-2.2.1_cc.Toggle_event" ]);