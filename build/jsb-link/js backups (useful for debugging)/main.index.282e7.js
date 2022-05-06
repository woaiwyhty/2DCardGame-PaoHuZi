window.__require = function e(t, n, o) {
function i(c, s) {
if (!n[c]) {
if (!t[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!t[u]) {
var a = "function" == typeof __require && __require;
if (!s && a) return a(u, !0);
if (r) return r(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
}
var l = n[c] = {
exports: {}
};
t[c][0].call(l.exports, function(e) {
return i(t[c][1][e] || e);
}, l, l.exports, e, t, n, o);
}
return n[c].exports;
}
for (var r = "function" == typeof __require && __require, c = 0; c < o.length; c++) i(o[c]);
return i;
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
show: function(e, t, n, o) {
this._alert.active = !0;
this._onok = n;
this._title.string = e;
this._content.string = t;
if (o) {
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
var o = this.node.height;
this.node.height = this.node.width / t.width * t.height;
this.node.width = this.node.height / o * this.node.width;
} else {
var i = this.node.width;
this.node.width = this.node.height / t.height * t.width;
this.node.height = this.node.width / i * this.node.height;
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
var e = [ "上官", "欧阳", "东方", "端木", "独孤", "司马", "南宫", "夏侯", "诸葛", "皇甫", "长孙", "宇文", "轩辕", "东郭", "子车", "东阳", "子言" ], t = [ "雀圣", "赌侠", "赌圣", "稳赢", "不输", "好运", "自摸", "有钱", "土豪" ], n = Math.floor(Math.random() * (e.length - 1)), o = Math.floor(Math.random() * (t.length - 1));
this.inputName.string = e[n] + t[o];
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
0 === e.errcode && cc.director.loadScene("RoomChoice");
});
} else console.log("invalid name.");
}
});
cc._RF.pop();
}, {} ],
1: [ function(e, t) {
var n = e("util/"), o = Array.prototype.slice, i = Object.prototype.hasOwnProperty, r = t.exports = l;
r.AssertionError = function(e) {
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
var t = e.stackStartFunction || a;
if (Error.captureStackTrace) Error.captureStackTrace(this, t); else {
var n = new Error();
if (n.stack) {
var o = n.stack, i = t.name, r = o.indexOf("\n" + i);
if (r >= 0) {
var c = o.indexOf("\n", r + 1);
o = o.substring(c + 1);
}
this.stack = o;
}
}
};
n.inherits(r.AssertionError, Error);
function c(e, t) {
return n.isUndefined(t) ? "" + t : n.isNumber(t) && !isFinite(t) ? t.toString() : n.isFunction(t) || n.isRegExp(t) ? t.toString() : t;
}
function s(e, t) {
return n.isString(e) ? e.length < t ? e : e.slice(0, t) : e;
}
function u(e) {
return s(JSON.stringify(e.actual, c), 128) + " " + e.operator + " " + s(JSON.stringify(e.expected, c), 128);
}
function a(e, t, n, o, i) {
throw new r.AssertionError({
message: n,
actual: e,
expected: t,
operator: o,
stackStartFunction: i
});
}
r.fail = a;
function l(e, t) {
e || a(e, !0, t, "==", r.ok);
}
r.ok = l;
r.equal = function(e, t, n) {
e != t && a(e, t, n, "==", r.equal);
};
r.notEqual = function(e, t, n) {
e == t && a(e, t, n, "!=", r.notEqual);
};
r.deepEqual = function(e, t, n) {
f(e, t) || a(e, t, n, "deepEqual", r.deepEqual);
};
function f(e, t) {
if (e === t) return !0;
if (n.isBuffer(e) && n.isBuffer(t)) {
if (e.length != t.length) return !1;
for (var o = 0; o < e.length; o++) if (e[o] !== t[o]) return !1;
return !0;
}
return n.isDate(e) && n.isDate(t) ? e.getTime() === t.getTime() : n.isRegExp(e) && n.isRegExp(t) ? e.source === t.source && e.global === t.global && e.multiline === t.multiline && e.lastIndex === t.lastIndex && e.ignoreCase === t.ignoreCase : n.isObject(e) || n.isObject(t) ? d(e, t) : e == t;
}
function p(e) {
return "[object Arguments]" == Object.prototype.toString.call(e);
}
function d(e, t) {
if (n.isNullOrUndefined(e) || n.isNullOrUndefined(t)) return !1;
if (e.prototype !== t.prototype) return !1;
if (n.isPrimitive(e) || n.isPrimitive(t)) return e === t;
var i = p(e), r = p(t);
if (i && !r || !i && r) return !1;
if (i) return f(e = o.call(e), t = o.call(t));
var c, s, u = m(e), a = m(t);
if (u.length != a.length) return !1;
u.sort();
a.sort();
for (s = u.length - 1; s >= 0; s--) if (u[s] != a[s]) return !1;
for (s = u.length - 1; s >= 0; s--) if (!f(e[c = u[s]], t[c])) return !1;
return !0;
}
r.notDeepEqual = function(e, t, n) {
f(e, t) && a(e, t, n, "notDeepEqual", r.notDeepEqual);
};
r.strictEqual = function(e, t, n) {
e !== t && a(e, t, n, "===", r.strictEqual);
};
r.notStrictEqual = function(e, t, n) {
e === t && a(e, t, n, "!==", r.notStrictEqual);
};
function h(e, t) {
return !(!e || !t) && ("[object RegExp]" == Object.prototype.toString.call(t) ? t.test(e) : e instanceof t || !0 === t.call({}, e));
}
function g(e, t, o, i) {
var r;
if (n.isString(o)) {
i = o;
o = null;
}
try {
t();
} catch (e) {
r = e;
}
i = (o && o.name ? " (" + o.name + ")." : ".") + (i ? " " + i : ".");
e && !r && a(r, o, "Missing expected exception" + i);
!e && h(r, o) && a(r, o, "Got unwanted exception" + i);
if (e && r && o && !h(r, o) || !e && r) throw r;
}
r.throws = function(e, t, n) {
g.apply(this, [ !0 ].concat(o.call(arguments)));
};
r.doesNotThrow = function(e, t) {
g.apply(this, [ !1 ].concat(o.call(arguments)));
};
r.ifError = function(e) {
if (e) throw e;
};
var m = Object.keys || function(e) {
var t = [];
for (var n in e) i.call(e, n) && t.push(n);
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
(function(t, o) {
var i = /%[sdj%]/g;
n.format = function(e) {
if (!C(e)) {
for (var t = [], n = 0; n < arguments.length; n++) t.push(s(arguments[n]));
return t.join(" ");
}
n = 1;
for (var o = arguments, r = o.length, c = String(e).replace(i, function(e) {
if ("%%" === e) return "%";
if (n >= r) return e;
switch (e) {
case "%s":
return String(o[n++]);

case "%d":
return Number(o[n++]);

case "%j":
try {
return JSON.stringify(o[n++]);
} catch (e) {
return "[Circular]";
}

default:
return e;
}
}), u = o[n]; n < r; u = o[++n]) b(u) || !w(u) ? c += " " + u : c += " " + s(u);
return c;
};
n.deprecate = function(e, i) {
if (_(o.process)) return function() {
return n.deprecate(e, i).apply(this, arguments);
};
if (!0 === t.noDeprecation) return e;
var r = !1;
return function() {
if (!r) {
if (t.throwDeprecation) throw new Error(i);
t.traceDeprecation ? console.trace(i) : console.error(i);
r = !0;
}
return e.apply(this, arguments);
};
};
var r, c = {};
n.debuglog = function(e) {
_(r) && (r = t.env.NODE_DEBUG || "");
e = e.toUpperCase();
if (!c[e]) if (new RegExp("\\b" + e + "\\b", "i").test(r)) {
var o = t.pid;
c[e] = function() {
var t = n.format.apply(n, arguments);
console.error("%s %d: %s", e, o, t);
};
} else c[e] = function() {};
return c[e];
};
function s(e, t) {
var o = {
seen: [],
stylize: a
};
arguments.length >= 3 && (o.depth = arguments[2]);
arguments.length >= 4 && (o.colors = arguments[3]);
y(t) ? o.showHidden = t : t && n._extend(o, t);
_(o.showHidden) && (o.showHidden = !1);
_(o.depth) && (o.depth = 2);
_(o.colors) && (o.colors = !1);
_(o.customInspect) && (o.customInspect = !0);
o.colors && (o.stylize = u);
return f(o, e, o.depth);
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
function a(e) {
return e;
}
function l(e) {
var t = {};
e.forEach(function(e) {
t[e] = !0;
});
return t;
}
function f(e, t, o) {
if (e.customInspect && t && E(t.inspect) && t.inspect !== n.inspect && (!t.constructor || t.constructor.prototype !== t)) {
var i = t.inspect(o, e);
C(i) || (i = f(e, i, o));
return i;
}
var r = p(e, t);
if (r) return r;
var c = Object.keys(t), s = l(c);
e.showHidden && (c = Object.getOwnPropertyNames(t));
if (x(t) && (c.indexOf("message") >= 0 || c.indexOf("description") >= 0)) return d(t);
if (0 === c.length) {
if (E(t)) {
var u = t.name ? ": " + t.name : "";
return e.stylize("[Function" + u + "]", "special");
}
if (S(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
if (k(t)) return e.stylize(Date.prototype.toString.call(t), "date");
if (x(t)) return d(t);
}
var a, y = "", b = !1, R = [ "{", "}" ];
if (v(t)) {
b = !0;
R = [ "[", "]" ];
}
E(t) && (y = " [Function" + (t.name ? ": " + t.name : "") + "]");
S(t) && (y = " " + RegExp.prototype.toString.call(t));
k(t) && (y = " " + Date.prototype.toUTCString.call(t));
x(t) && (y = " " + d(t));
if (0 === c.length && (!b || 0 == t.length)) return R[0] + y + R[1];
if (o < 0) return S(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special");
e.seen.push(t);
a = b ? h(e, t, o, s, c) : c.map(function(n) {
return g(e, t, o, s, n, b);
});
e.seen.pop();
return m(a, y, R);
}
function p(e, t) {
if (_(t)) return e.stylize("undefined", "undefined");
if (C(t)) {
var n = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
return e.stylize(n, "string");
}
return R(t) ? e.stylize("" + t, "number") : y(t) ? e.stylize("" + t, "boolean") : b(t) ? e.stylize("null", "null") : void 0;
}
function d(e) {
return "[" + Error.prototype.toString.call(e) + "]";
}
function h(e, t, n, o, i) {
for (var r = [], c = 0, s = t.length; c < s; ++c) I(t, String(c)) ? r.push(g(e, t, n, o, String(c), !0)) : r.push("");
i.forEach(function(i) {
i.match(/^\d+$/) || r.push(g(e, t, n, o, i, !0));
});
return r;
}
function g(e, t, n, o, i, r) {
var c, s, u;
(u = Object.getOwnPropertyDescriptor(t, i) || {
value: t[i]
}).get ? s = u.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : u.set && (s = e.stylize("[Setter]", "special"));
I(o, i) || (c = "[" + i + "]");
s || (e.seen.indexOf(u.value) < 0 ? (s = b(n) ? f(e, u.value, null) : f(e, u.value, n - 1)).indexOf("\n") > -1 && (s = r ? s.split("\n").map(function(e) {
return "  " + e;
}).join("\n").substr(2) : "\n" + s.split("\n").map(function(e) {
return "   " + e;
}).join("\n")) : s = e.stylize("[Circular]", "special"));
if (_(c)) {
if (r && i.match(/^\d+$/)) return s;
if ((c = JSON.stringify("" + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
c = c.substr(1, c.length - 2);
c = e.stylize(c, "name");
} else {
c = c.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
c = e.stylize(c, "string");
}
}
return c + ": " + s;
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
function b(e) {
return null === e;
}
n.isNull = b;
n.isNullOrUndefined = function(e) {
return null == e;
};
function R(e) {
return "number" == typeof e;
}
n.isNumber = R;
function C(e) {
return "string" == typeof e;
}
n.isString = C;
n.isSymbol = function(e) {
return "symbol" == typeof e;
};
function _(e) {
return void 0 === e;
}
n.isUndefined = _;
function S(e) {
return w(e) && "[object RegExp]" === F(e);
}
n.isRegExp = S;
function w(e) {
return "object" == typeof e && null !== e;
}
n.isObject = w;
function k(e) {
return w(e) && "[object Date]" === F(e);
}
n.isDate = k;
function x(e) {
return w(e) && ("[object Error]" === F(e) || e instanceof Error);
}
n.isError = x;
function E(e) {
return "function" == typeof e;
}
n.isFunction = E;
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
var T = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
function j() {
var e = new Date(), t = [ O(e.getHours()), O(e.getMinutes()), O(e.getSeconds()) ].join(":");
return [ e.getDate(), T[e.getMonth()], t ].join(" ");
}
n.log = function() {
console.log("%s - %s", j(), n.format.apply(n, arguments));
};
n.inherits = e("inherits");
n._extend = function(e, t) {
if (!t || !w(t)) return e;
for (var n = Object.keys(t), o = n.length; o--; ) e[n[o]] = t[n[o]];
return e;
};
function I(e, t) {
return Object.prototype.hasOwnProperty.call(e, t);
}
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./support/isBuffer": 3,
_process: 5,
inherits: 2
} ],
5: [ function(e, t) {
var n, o, i = t.exports = {};
function r() {
throw new Error("setTimeout has not been defined");
}
function c() {
throw new Error("clearTimeout has not been defined");
}
(function() {
try {
n = "function" == typeof setTimeout ? setTimeout : r;
} catch (e) {
n = r;
}
try {
o = "function" == typeof clearTimeout ? clearTimeout : c;
} catch (e) {
o = c;
}
})();
function s(e) {
if (n === setTimeout) return setTimeout(e, 0);
if ((n === r || !n) && setTimeout) {
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
if (o === clearTimeout) return clearTimeout(e);
if ((o === c || !o) && clearTimeout) {
o = clearTimeout;
return clearTimeout(e);
}
try {
return o(e);
} catch (t) {
try {
return o.call(null, e);
} catch (t) {
return o.call(this, e);
}
}
}
var a, l = [], f = !1, p = -1;
function d() {
if (f && a) {
f = !1;
a.length ? l = a.concat(l) : p = -1;
l.length && h();
}
}
function h() {
if (!f) {
var e = s(d);
f = !0;
for (var t = l.length; t; ) {
a = l;
l = [];
for (;++p < t; ) a && a[p].run();
p = -1;
t = l.length;
}
a = null;
f = !1;
u(e);
}
}
i.nextTick = function(e) {
var t = new Array(arguments.length - 1);
if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
l.push(new g(e, t));
1 !== l.length || f || s(h);
};
function g(e, t) {
this.fun = e;
this.array = t;
}
g.prototype.run = function() {
this.fun.apply(null, this.array);
};
i.title = "browser";
i.browser = !0;
i.env = {};
i.argv = [];
i.version = "";
i.versions = {};
function m() {}
i.on = m;
i.addListener = m;
i.once = m;
i.off = m;
i.removeListener = m;
i.removeAllListeners = m;
i.emit = m;
i.prependListener = m;
i.prependOnceListener = m;
i.listeners = function() {
return [];
};
i.binding = function() {
throw new Error("process.binding is not supported");
};
i.cwd = function() {
return "/";
};
i.chdir = function() {
throw new Error("process.chdir is not supported");
};
i.umask = function() {
return 0;
};
}, {} ],
HTTPUtil: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "be25eLIwqZCT5T8cWUa4Xbr", "HTTPUtil");
e("assert").fail;
var o = "http://127.0.0.1:9001";
n.master_url = null;
n.url = null;
n.token = null;
i();
function i() {
n.master_url = o;
n.url = o;
}
n.sendRequest = function e(t, o, i, r, c, s) {
void 0 === c && (c = !1);
void 0 === s && (s = null);
var u = cc.loader.getXMLHttpRequest();
u.timeout = 5e3;
null == o && (o = {});
n.token && (o.token = n.token);
null == r && (r = n.url);
var a = t, l = "?";
for (var f in o) {
"?" != l && (l += "&");
l += f + "=" + o[f];
}
var p = r + a + encodeURI(l);
console.log("RequestURL:" + p);
u.open("GET", p, !0);
cc.sys.isNative && u.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
var d = setTimeout(function() {
u.hasRetried = !0;
u.abort();
console.log("http timeout");
h();
}, 5e3), h = function() {
e(t, o, i, r, !0, s);
};
u.onreadystatechange = function() {
console.log("onreadystatechange");
clearTimeout(d);
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
i && i(t);
i = null;
} else if (4 === u.readyState) {
if (c) {
s && s({
errcode: 400,
errmsg: "Cannot connect with the server!"
});
return;
}
console.log("other readystate == 4, status:" + u.status);
setTimeout(function() {
h();
}, 5e3);
} else console.log("other readystate:" + u.readyState + ", status:" + u.status);
};
try {
u.send();
} catch (e) {
h();
}
return u;
};
n.setURL = function(e) {
o = e;
i();
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
onInputFinished: function() {},
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
cc.utils.userInfo = {
username: "",
nickname: "",
token: "",
travellerMode: !1
};
var t = e("Utils");
cc.utils.main = new t();
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
HTTPUtil: "HTTPUtil",
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
properties: {},
onLoad: function() {
cc.utils.main.setFitScreenMode();
var e = cc.view.getFrameSize(), t = e.width, n = e.height;
console.log(t, n);
}
});
cc._RF.pop();
}, {} ],
RoomChoice: [ function(e, t) {
"use strict";
cc._RF.push(t, "f9323NccwJOxolqgGoVJwiy", "RoomChoice");
cc.Class({
extends: cc.Component,
properties: {
joinGameWindow: cc.Node,
createRoomWindow: cc.Node,
checkbox6Rounds: cc.Sprite,
checkbox12Rounds: cc.Sprite,
uncheckedSprite: cc.SpriteFrame,
checkedSprite: cc.SpriteFrame
},
onLoad: function() {
cc.utils.main.setFitScreenMode();
this.selected6Rounds = !1;
this.on6RoundsSelected();
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
var e = 6;
this.selected6Rounds || (e = 12);
cc.utils.http.sendRequest("/createRoom", {
username: cc.utils.userInfo.username,
token: cc.utils.userInfo.token,
num_of_games: e
}, function(e) {
console.log(e);
if (0 === e.errcode) {
cc.utils.room_id = e.room_id;
console.log(cc.utils.room_id);
cc.director.loadScene("PaohuZiGame");
} else cc.utils.alert.show("提示", e.errmsg);
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
addClickEvent: function(e, t, n, o) {
console.log(n + ":" + o);
var i = new cc.Component.EventHandler();
i.target = t;
i.component = n;
i.handler = o;
e.getComponent(cc.Button).clickEvents.push(i);
},
addSlideEvent: function(e, t, n, o) {
var i = new cc.Component.EventHandler();
i.target = t;
i.component = n;
i.handler = o;
e.getComponent(cc.Slider).slideEvents.push(i);
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
var e = cc.find("Canvas"), t = cc.view.getFrameSize(), n = t.width, o = t.height, i = e.getComponent(cc.Canvas);
if (n / o > i.designResolution.width / i.designResolution.height) {
i.fitHeight = !0;
i.fitWidth = !1;
} else {
i.fitHeight = !1;
i.fitWidth = !0;
}
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
}, {}, [ "Alert", "AppStart", "BackgroundScaler", "CreateRole", "HTTPUtil", "JoinGameInput", "Loading", "Login", "MainGame", "RoomChoice", "RoomManagerUtil", "Utils", "use_v2.1-2.2.1_cc.Toggle_event" ]);