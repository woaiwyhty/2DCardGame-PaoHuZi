cc.sys.isNative || function(t, e) {
"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).io = e();
}(this, function() {
"use strict";
function t(e) {
return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
return typeof t;
} : function(t) {
return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
})(e);
}
function e(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function n(t, e) {
for (var n = 0; n < e.length; n++) {
var r = e[n];
r.enumerable = r.enumerable || !1;
r.configurable = !0;
"value" in r && (r.writable = !0);
Object.defineProperty(t, r.key, r);
}
}
function r(t, e, r) {
e && n(t.prototype, e);
r && n(t, r);
return t;
}
function i() {
return (i = Object.assign || function(t) {
for (var e = 1; e < arguments.length; e++) {
var n = arguments[e];
for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
}
return t;
}).apply(this, arguments);
}
function o(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
writable: !0,
configurable: !0
}
});
e && a(t, e);
}
function s(t) {
return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
return t.__proto__ || Object.getPrototypeOf(t);
})(t);
}
function a(t, e) {
return (a = Object.setPrototypeOf || function(t, e) {
t.__proto__ = e;
return t;
})(t, e);
}
function c() {
if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
if (Reflect.construct.sham) return !1;
if ("function" == typeof Proxy) return !0;
try {
Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
return !0;
} catch (t) {
return !1;
}
}
function u(t) {
if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return t;
}
function h(t, e) {
if (e && ("object" == typeof e || "function" == typeof e)) return e;
if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
return u(t);
}
function f(t) {
var e = c();
return function() {
var n, r = s(t);
if (e) {
var i = s(this).constructor;
n = Reflect.construct(r, arguments, i);
} else n = r.apply(this, arguments);
return h(this, n);
};
}
function p(t, e) {
for (;!Object.prototype.hasOwnProperty.call(t, e) && null !== (t = s(t)); ) ;
return t;
}
function l(t, e, n) {
return (l = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(t, e, n) {
var r = p(t, e);
if (r) {
var i = Object.getOwnPropertyDescriptor(r, e);
return i.get ? i.get.call(n) : i.value;
}
})(t, e, n || t);
}
function d(t, e) {
if (t) {
if ("string" == typeof t) return y(t, e);
var n = Object.prototype.toString.call(t).slice(8, -1);
"Object" === n && t.constructor && (n = t.constructor.name);
return "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? y(t, e) : void 0;
}
}
function y(t, e) {
(null == e || e > t.length) && (e = t.length);
for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
return r;
}
function v(t, e) {
var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
if (!n) {
if (Array.isArray(t) || (n = d(t)) || e && t && "number" == typeof t.length) {
n && (t = n);
var r = 0, i = function() {};
return {
s: i,
n: function() {
return r >= t.length ? {
done: !0
} : {
done: !1,
value: t[r++]
};
},
e: function(t) {
throw t;
},
f: i
};
}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var o, s = !0, a = !1;
return {
s: function() {
n = n.call(t);
},
n: function() {
var t = n.next();
s = t.done;
return t;
},
e: function(t) {
a = !0;
o = t;
},
f: function() {
try {
s || null == n.return || n.return();
} finally {
if (a) throw o;
}
}
};
}
var m = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, g = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ], k = function(t) {
var e = t, n = t.indexOf("["), r = t.indexOf("]");
-1 != n && -1 != r && (t = t.substring(0, n) + t.substring(n, r).replace(/:/g, ";") + t.substring(r, t.length));
for (var i = m.exec(t || ""), o = {}, s = 14; s--; ) o[g[s]] = i[s] || "";
if (-1 != n && -1 != r) {
o.source = e;
o.host = o.host.substring(1, o.host.length - 1).replace(/;/g, ":");
o.authority = o.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
o.ipv6uri = !0;
}
o.pathNames = b(0, o.path);
o.queryKey = w(0, o.query);
return o;
};
function b(t, e) {
var n = e.replace(/\/{2,9}/g, "/").split("/");
"/" != e.substr(0, 1) && 0 !== e.length || n.splice(0, 1);
"/" == e.substr(e.length - 1, 1) && n.splice(n.length - 1, 1);
return n;
}
function w(t, e) {
var n = {};
e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(t, e, r) {
e && (n[e] = r);
});
return n;
}
function _(t) {
var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", n = arguments.length > 2 ? arguments[2] : void 0, r = t;
n = n || "undefined" != typeof location && location;
null == t && (t = n.protocol + "//" + n.host);
if ("string" == typeof t) {
"/" === t.charAt(0) && (t = "/" === t.charAt(1) ? n.protocol + t : n.host + t);
/^(https?|wss?):\/\//.test(t) || (t = "undefined" != typeof n ? n.protocol + "//" + t : "https://" + t);
r = k(t);
}
r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443"));
r.path = r.path || "/";
var i = -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host;
r.id = r.protocol + "://" + i + ":" + r.port + e;
r.href = r.protocol + "://" + i + (n && n.port === r.port ? "" : ":" + r.port);
return r;
}
var E = {
exports: {}
};
try {
E.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
} catch (t) {
E.exports = !1;
}
var A = E.exports, R = "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("", "return this")();
function T(t) {
var e = t.xdomain;
try {
if ("undefined" != typeof XMLHttpRequest && (!e || A)) return new XMLHttpRequest();
} catch (t) {}
if (!e) try {
return new (R[[ "Active" ].concat("Object").join("X")])("Microsoft.XMLHTTP");
} catch (t) {}
}
function O(t) {
for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
return n.reduce(function(e, n) {
t.hasOwnProperty(n) && (e[n] = t[n]);
return e;
}, {});
}
var C = setTimeout, S = clearTimeout;
function N(t, e) {
if (e.useNativeTimers) {
t.setTimeoutFn = C.bind(R);
t.clearTimeoutFn = S.bind(R);
} else {
t.setTimeoutFn = setTimeout.bind(R);
t.clearTimeoutFn = clearTimeout.bind(R);
}
}
var B = x;
function x(t) {
if (t) return L(t);
}
function L(t) {
for (var e in x.prototype) t[e] = x.prototype[e];
return t;
}
x.prototype.on = x.prototype.addEventListener = function(t, e) {
this._callbacks = this._callbacks || {};
(this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e);
return this;
};
x.prototype.once = function(t, e) {
function n() {
this.off(t, n);
e.apply(this, arguments);
}
n.fn = e;
this.on(t, n);
return this;
};
x.prototype.off = x.prototype.removeListener = x.prototype.removeAllListeners = x.prototype.removeEventListener = function(t, e) {
this._callbacks = this._callbacks || {};
if (0 == arguments.length) {
this._callbacks = {};
return this;
}
var n, r = this._callbacks["$" + t];
if (!r) return this;
if (1 == arguments.length) {
delete this._callbacks["$" + t];
return this;
}
for (var i = 0; i < r.length; i++) if ((n = r[i]) === e || n.fn === e) {
r.splice(i, 1);
break;
}
0 === r.length && delete this._callbacks["$" + t];
return this;
};
x.prototype.emit = function(t) {
this._callbacks = this._callbacks || {};
for (var e = new Array(arguments.length - 1), n = this._callbacks["$" + t], r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
if (n) {
r = 0;
for (var i = (n = n.slice(0)).length; r < i; ++r) n[r].apply(this, e);
}
return this;
};
x.prototype.emitReserved = x.prototype.emit;
x.prototype.listeners = function(t) {
this._callbacks = this._callbacks || {};
return this._callbacks["$" + t] || [];
};
x.prototype.hasListeners = function(t) {
return !!this.listeners(t).length;
};
var j = Object.create(null);
j.open = "0";
j.close = "1";
j.ping = "2";
j.pong = "3";
j.message = "4";
j.upgrade = "5";
j.noop = "6";
var P = Object.create(null);
Object.keys(j).forEach(function(t) {
P[j[t]] = t;
});
for (var q = {
type: "error",
data: "parser error"
}, I = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === Object.prototype.toString.call(Blob), D = "function" == typeof ArrayBuffer, F = function(t, e, n) {
var r, i = t.type, o = t.data;
return I && o instanceof Blob ? e ? n(o) : M(o, n) : D && (o instanceof ArrayBuffer || (r = o, 
"function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(r) : r && r.buffer instanceof ArrayBuffer)) ? e ? n(o) : M(new Blob([ o ]), n) : n(j[i] + (o || ""));
}, M = function(t, e) {
var n = new FileReader();
n.onload = function() {
var t = n.result.split(",")[1];
e("b" + t);
};
return n.readAsDataURL(t);
}, U = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", V = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), H = 0; H < U.length; H++) V[U.charCodeAt(H)] = H;
var K, Y = function(t) {
var e, n, r, i, o, s = .75 * t.length, a = t.length, c = 0;
if ("=" === t[t.length - 1]) {
s--;
"=" === t[t.length - 2] && s--;
}
var u = new ArrayBuffer(s), h = new Uint8Array(u);
for (e = 0; e < a; e += 4) {
n = V[t.charCodeAt(e)];
r = V[t.charCodeAt(e + 1)];
i = V[t.charCodeAt(e + 2)];
o = V[t.charCodeAt(e + 3)];
h[c++] = n << 2 | r >> 4;
h[c++] = (15 & r) << 4 | i >> 2;
h[c++] = (3 & i) << 6 | 63 & o;
}
return u;
}, z = "function" == typeof ArrayBuffer, $ = function(t, e) {
if ("string" != typeof t) return {
type: "message",
data: J(t, e)
};
var n = t.charAt(0);
return "b" === n ? {
type: "message",
data: W(t.substring(1), e)
} : P[n] ? t.length > 1 ? {
type: P[n],
data: t.substring(1)
} : {
type: P[n]
} : q;
}, W = function(t, e) {
if (z) {
var n = Y(t);
return J(n, e);
}
return {
base64: !0,
data: t
};
}, J = function(t, e) {
switch (e) {
case "blob":
return t instanceof ArrayBuffer ? new Blob([ t ]) : t;

case "arraybuffer":
default:
return t;
}
}, X = String.fromCharCode(30), G = function(t, e) {
var n = t.length, r = new Array(n), i = 0;
t.forEach(function(t, o) {
F(t, !1, function(t) {
r[o] = t;
++i === n && e(r.join(X));
});
});
}, Q = function(t, e) {
for (var n = t.split(X), r = [], i = 0; i < n.length; i++) {
var o = $(n[i], e);
r.push(o);
if ("error" === o.type) break;
}
return r;
}, Z = function() {
o(n, B);
var t = f(n);
function n(r) {
var i;
e(this, n);
(i = t.call(this)).writable = !1;
N(u(i), r);
i.opts = r;
i.query = r.query;
i.readyState = "";
i.socket = r.socket;
return i;
}
r(n, [ {
key: "onError",
value: function(t, e) {
var r = new Error(t);
r.type = "TransportError";
r.description = e;
l(s(n.prototype), "emit", this).call(this, "error", r);
return this;
}
}, {
key: "open",
value: function() {
if ("closed" === this.readyState || "" === this.readyState) {
this.readyState = "opening";
this.doOpen();
}
return this;
}
}, {
key: "close",
value: function() {
if ("opening" === this.readyState || "open" === this.readyState) {
this.doClose();
this.onClose();
}
return this;
}
}, {
key: "send",
value: function(t) {
"open" === this.readyState && this.write(t);
}
}, {
key: "onOpen",
value: function() {
this.readyState = "open";
this.writable = !0;
l(s(n.prototype), "emit", this).call(this, "open");
}
}, {
key: "onData",
value: function(t) {
var e = $(t, this.socket.binaryType);
this.onPacket(e);
}
}, {
key: "onPacket",
value: function(t) {
l(s(n.prototype), "emit", this).call(this, "packet", t);
}
}, {
key: "onClose",
value: function() {
this.readyState = "closed";
l(s(n.prototype), "emit", this).call(this, "close");
}
} ]);
return n;
}(), tt = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), et = 64, nt = {}, rt = 0, it = 0;
function ot(t) {
var e = "";
do {
e = tt[t % et] + e;
t = Math.floor(t / et);
} while (t > 0);
return e;
}
function st() {
var t = ot(+new Date());
return t !== K ? (rt = 0, K = t) : t + "." + ot(rt++);
}
for (;it < et; it++) nt[tt[it]] = it;
st.encode = ot;
st.decode = function(t) {
var e = 0;
for (it = 0; it < t.length; it++) e = e * et + nt[t.charAt(it)];
return e;
};
var at = st, ct = {
encode: function(t) {
var e = "";
for (var n in t) if (t.hasOwnProperty(n)) {
e.length && (e += "&");
e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]);
}
return e;
},
decode: function(t) {
for (var e = {}, n = t.split("&"), r = 0, i = n.length; r < i; r++) {
var o = n[r].split("=");
e[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
}
return e;
}
}, ut = function() {
o(n, Z);
var t = f(n);
function n() {
var r;
e(this, n);
(r = t.apply(this, arguments)).polling = !1;
return r;
}
r(n, [ {
key: "name",
get: function() {
return "polling";
}
}, {
key: "doOpen",
value: function() {
this.poll();
}
}, {
key: "pause",
value: function(t) {
var e = this;
this.readyState = "pausing";
var n = function() {
e.readyState = "paused";
t();
};
if (this.polling || !this.writable) {
var r = 0;
if (this.polling) {
r++;
this.once("pollComplete", function() {
--r || n();
});
}
if (!this.writable) {
r++;
this.once("drain", function() {
--r || n();
});
}
} else n();
}
}, {
key: "poll",
value: function() {
this.polling = !0;
this.doPoll();
this.emit("poll");
}
}, {
key: "onData",
value: function(t) {
var e = this;
Q(t, this.socket.binaryType).forEach(function(t) {
"opening" === e.readyState && "open" === t.type && e.onOpen();
if ("close" === t.type) {
e.onClose();
return !1;
}
e.onPacket(t);
});
if ("closed" !== this.readyState) {
this.polling = !1;
this.emit("pollComplete");
"open" === this.readyState && this.poll();
}
}
}, {
key: "doClose",
value: function() {
var t = this, e = function() {
t.write([ {
type: "close"
} ]);
};
"open" === this.readyState ? e() : this.once("open", e);
}
}, {
key: "write",
value: function(t) {
var e = this;
this.writable = !1;
G(t, function(t) {
e.doWrite(t, function() {
e.writable = !0;
e.emit("drain");
});
});
}
}, {
key: "uri",
value: function() {
var t = this.query || {}, e = this.opts.secure ? "https" : "http", n = "";
!1 !== this.opts.timestampRequests && (t[this.opts.timestampParam] = at());
this.supportsBinary || t.sid || (t.b64 = 1);
this.opts.port && ("https" === e && 443 !== Number(this.opts.port) || "http" === e && 80 !== Number(this.opts.port)) && (n = ":" + this.opts.port);
var r = ct.encode(t);
return e + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + n + this.opts.path + (r.length ? "?" + r : "");
}
} ]);
return n;
}();
function ht() {}
var ft = null != new T({
xdomain: !1
}).responseType, pt = function() {
o(n, ut);
var t = f(n);
function n(r) {
var i;
e(this, n);
i = t.call(this, r);
if ("undefined" != typeof location) {
var o = "https:" === location.protocol, s = location.port;
s || (s = o ? "443" : "80");
i.xd = "undefined" != typeof location && r.hostname !== location.hostname || s !== r.port;
i.xs = r.secure !== o;
}
var a = r && r.forceBase64;
i.supportsBinary = ft && !a;
return i;
}
r(n, [ {
key: "request",
value: function() {
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
i(t, {
xd: this.xd,
xs: this.xs
}, this.opts);
return new lt(this.uri(), t);
}
}, {
key: "doWrite",
value: function(t, e) {
var n = this, r = this.request({
method: "POST",
data: t
});
r.on("success", e);
r.on("error", function(t) {
n.onError("xhr post error", t);
});
}
}, {
key: "doPoll",
value: function() {
var t = this, e = this.request();
e.on("data", this.onData.bind(this));
e.on("error", function(e) {
t.onError("xhr poll error", e);
});
this.pollXhr = e;
}
} ]);
return n;
}(), lt = function() {
o(n, B);
var t = f(n);
function n(r, i) {
var o;
e(this, n);
N(u(o = t.call(this)), i);
o.opts = i;
o.method = i.method || "GET";
o.uri = r;
o.async = !1 !== i.async;
o.data = void 0 !== i.data ? i.data : null;
o.create();
return o;
}
r(n, [ {
key: "create",
value: function() {
var t = this, e = O(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
e.xdomain = !!this.opts.xd;
e.xscheme = !!this.opts.xs;
var r = this.xhr = new T(e);
try {
r.open(this.method, this.uri, this.async);
try {
if (this.opts.extraHeaders) {
r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0);
for (var i in this.opts.extraHeaders) this.opts.extraHeaders.hasOwnProperty(i) && r.setRequestHeader(i, this.opts.extraHeaders[i]);
}
} catch (t) {}
if ("POST" === this.method) try {
r.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
} catch (t) {}
try {
r.setRequestHeader("Accept", "*/*");
} catch (t) {}
"withCredentials" in r && (r.withCredentials = this.opts.withCredentials);
this.opts.requestTimeout && (r.timeout = this.opts.requestTimeout);
r.onreadystatechange = function() {
4 === r.readyState && (200 === r.status || 1223 === r.status ? t.onLoad() : t.setTimeoutFn(function() {
t.onError("number" == typeof r.status ? r.status : 0);
}, 0));
};
r.send(this.data);
} catch (e) {
this.setTimeoutFn(function() {
t.onError(e);
}, 0);
return;
}
if ("undefined" != typeof document) {
this.index = n.requestsCount++;
n.requests[this.index] = this;
}
}
}, {
key: "onSuccess",
value: function() {
this.emit("success");
this.cleanup();
}
}, {
key: "onData",
value: function(t) {
this.emit("data", t);
this.onSuccess();
}
}, {
key: "onError",
value: function(t) {
this.emit("error", t);
this.cleanup(!0);
}
}, {
key: "cleanup",
value: function(t) {
if ("undefined" != typeof this.xhr && null !== this.xhr) {
this.xhr.onreadystatechange = ht;
if (t) try {
this.xhr.abort();
} catch (t) {}
"undefined" != typeof document && delete n.requests[this.index];
this.xhr = null;
}
}
}, {
key: "onLoad",
value: function() {
var t = this.xhr.responseText;
null !== t && this.onData(t);
}
}, {
key: "abort",
value: function() {
this.cleanup();
}
} ]);
return n;
}();
lt.requestsCount = 0;
lt.requests = {};
"undefined" != typeof document && ("function" == typeof attachEvent ? attachEvent("onunload", dt) : "function" == typeof addEventListener && addEventListener("onpagehide" in R ? "pagehide" : "unload", dt, !1));
function dt() {
for (var t in lt.requests) lt.requests.hasOwnProperty(t) && lt.requests[t].abort();
}
var yt = "function" == typeof Promise && "function" == typeof Promise.resolve ? function(t) {
return Promise.resolve().then(t);
} : function(t, e) {
return e(t, 0);
}, vt = R.WebSocket || R.MozWebSocket, mt = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(), gt = {
websocket: function() {
o(n, Z);
var t = f(n);
function n(r) {
var i;
e(this, n);
(i = t.call(this, r)).supportsBinary = !r.forceBase64;
return i;
}
r(n, [ {
key: "name",
get: function() {
return "websocket";
}
}, {
key: "doOpen",
value: function() {
if (this.check()) {
var t = this.uri(), e = this.opts.protocols, n = mt ? {} : O(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
try {
this.ws = mt ? new vt(t, e, n) : e ? new vt(t, e) : new vt(t);
} catch (t) {
return this.emit("error", t);
}
this.ws.binaryType = this.socket.binaryType || "arraybuffer";
this.addEventListeners();
}
}
}, {
key: "addEventListeners",
value: function() {
var t = this;
this.ws.onopen = function() {
t.opts.autoUnref && t.ws._socket.unref();
t.onOpen();
};
this.ws.onclose = this.onClose.bind(this);
this.ws.onmessage = function(e) {
return t.onData(e.data);
};
this.ws.onerror = function(e) {
return t.onError("websocket error", e);
};
}
}, {
key: "write",
value: function(t) {
var e = this;
this.writable = !1;
for (var n = function(n) {
var r = t[n], i = n === t.length - 1;
F(r, e.supportsBinary, function(t) {
try {
e.ws.send(t);
} catch (t) {}
i && yt(function() {
e.writable = !0;
e.emit("drain");
}, e.setTimeoutFn);
});
}, r = 0; r < t.length; r++) n(r);
}
}, {
key: "doClose",
value: function() {
if ("undefined" != typeof this.ws) {
this.ws.close();
this.ws = null;
}
}
}, {
key: "uri",
value: function() {
var t = this.query || {}, e = this.opts.secure ? "wss" : "ws", n = "";
this.opts.port && ("wss" === e && 443 !== Number(this.opts.port) || "ws" === e && 80 !== Number(this.opts.port)) && (n = ":" + this.opts.port);
this.opts.timestampRequests && (t[this.opts.timestampParam] = at());
this.supportsBinary || (t.b64 = 1);
var r = ct.encode(t);
return e + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + n + this.opts.path + (r.length ? "?" + r : "");
}
}, {
key: "check",
value: function() {
return !(!vt || "__initialize" in vt && this.name === n.prototype.name);
}
} ]);
return n;
}(),
polling: pt
}, kt = function() {
o(s, B);
var n = f(s);
function s(r) {
var o, a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
e(this, s);
o = n.call(this);
if (r && "object" === t(r)) {
a = r;
r = null;
}
if (r) {
r = k(r);
a.hostname = r.host;
a.secure = "https" === r.protocol || "wss" === r.protocol;
a.port = r.port;
r.query && (a.query = r.query);
} else a.host && (a.hostname = k(a.host).host);
N(u(o), a);
o.secure = null != a.secure ? a.secure : "undefined" != typeof location && "https:" === location.protocol;
a.hostname && !a.port && (a.port = o.secure ? "443" : "80");
o.hostname = a.hostname || ("undefined" != typeof location ? location.hostname : "localhost");
o.port = a.port || ("undefined" != typeof location && location.port ? location.port : o.secure ? "443" : "80");
o.transports = a.transports || [ "polling", "websocket" ];
o.readyState = "";
o.writeBuffer = [];
o.prevBufferLen = 0;
o.opts = i({
path: "/engine.io",
agent: !1,
withCredentials: !1,
upgrade: !0,
timestampParam: "t",
rememberUpgrade: !1,
rejectUnauthorized: !0,
perMessageDeflate: {
threshold: 1024
},
transportOptions: {},
closeOnBeforeunload: !0
}, a);
o.opts.path = o.opts.path.replace(/\/$/, "") + "/";
"string" == typeof o.opts.query && (o.opts.query = ct.decode(o.opts.query));
o.id = null;
o.upgrades = null;
o.pingInterval = null;
o.pingTimeout = null;
o.pingTimeoutTimer = null;
if ("function" == typeof addEventListener) {
o.opts.closeOnBeforeunload && addEventListener("beforeunload", function() {
if (o.transport) {
o.transport.removeAllListeners();
o.transport.close();
}
}, !1);
if ("localhost" !== o.hostname) {
o.offlineEventListener = function() {
o.onClose("transport close");
};
addEventListener("offline", o.offlineEventListener, !1);
}
}
o.open();
return o;
}
r(s, [ {
key: "createTransport",
value: function(t) {
var e = bt(this.opts.query);
e.EIO = 4;
e.transport = t;
this.id && (e.sid = this.id);
var n = i({}, this.opts.transportOptions[t], this.opts, {
query: e,
socket: this,
hostname: this.hostname,
secure: this.secure,
port: this.port
});
return new gt[t](n);
}
}, {
key: "open",
value: function() {
var t, e = this;
if (this.opts.rememberUpgrade && s.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) t = "websocket"; else {
if (0 === this.transports.length) {
this.setTimeoutFn(function() {
e.emitReserved("error", "No transports available");
}, 0);
return;
}
t = this.transports[0];
}
this.readyState = "opening";
try {
t = this.createTransport(t);
} catch (t) {
this.transports.shift();
this.open();
return;
}
t.open();
this.setTransport(t);
}
}, {
key: "setTransport",
value: function(t) {
var e = this;
this.transport && this.transport.removeAllListeners();
this.transport = t;
t.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", function() {
e.onClose("transport close");
});
}
}, {
key: "probe",
value: function(t) {
var e = this, n = this.createTransport(t), r = !1;
s.priorWebsocketSuccess = !1;
var i = function() {
if (!r) {
n.send([ {
type: "ping",
data: "probe"
} ]);
n.once("packet", function(t) {
if (!r) if ("pong" === t.type && "probe" === t.data) {
e.upgrading = !0;
e.emitReserved("upgrading", n);
if (!n) return;
s.priorWebsocketSuccess = "websocket" === n.name;
e.transport.pause(function() {
if (!r && "closed" !== e.readyState) {
f();
e.setTransport(n);
n.send([ {
type: "upgrade"
} ]);
e.emitReserved("upgrade", n);
n = null;
e.upgrading = !1;
e.flush();
}
});
} else {
var i = new Error("probe error");
i.transport = n.name;
e.emitReserved("upgradeError", i);
}
});
}
};
function o() {
if (!r) {
r = !0;
f();
n.close();
n = null;
}
}
var a = function(t) {
var r = new Error("probe error: " + t);
r.transport = n.name;
o();
e.emitReserved("upgradeError", r);
};
function c() {
a("transport closed");
}
function u() {
a("socket closed");
}
function h(t) {
n && t.name !== n.name && o();
}
var f = function() {
n.removeListener("open", i);
n.removeListener("error", a);
n.removeListener("close", c);
e.off("close", u);
e.off("upgrading", h);
};
n.once("open", i);
n.once("error", a);
n.once("close", c);
this.once("close", u);
this.once("upgrading", h);
n.open();
}
}, {
key: "onOpen",
value: function() {
this.readyState = "open";
s.priorWebsocketSuccess = "websocket" === this.transport.name;
this.emitReserved("open");
this.flush();
if ("open" === this.readyState && this.opts.upgrade && this.transport.pause) for (var t = 0, e = this.upgrades.length; t < e; t++) this.probe(this.upgrades[t]);
}
}, {
key: "onPacket",
value: function(t) {
if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
this.emitReserved("packet", t);
this.emitReserved("heartbeat");
switch (t.type) {
case "open":
this.onHandshake(JSON.parse(t.data));
break;

case "ping":
this.resetPingTimeout();
this.sendPacket("pong");
this.emitReserved("ping");
this.emitReserved("pong");
break;

case "error":
var e = new Error("server error");
e.code = t.data;
this.onError(e);
break;

case "message":
this.emitReserved("data", t.data);
this.emitReserved("message", t.data);
}
}
}
}, {
key: "onHandshake",
value: function(t) {
this.emitReserved("handshake", t);
this.id = t.sid;
this.transport.query.sid = t.sid;
this.upgrades = this.filterUpgrades(t.upgrades);
this.pingInterval = t.pingInterval;
this.pingTimeout = t.pingTimeout;
this.onOpen();
"closed" !== this.readyState && this.resetPingTimeout();
}
}, {
key: "resetPingTimeout",
value: function() {
var t = this;
this.clearTimeoutFn(this.pingTimeoutTimer);
this.pingTimeoutTimer = this.setTimeoutFn(function() {
t.onClose("ping timeout");
}, this.pingInterval + this.pingTimeout);
this.opts.autoUnref && this.pingTimeoutTimer.unref();
}
}, {
key: "onDrain",
value: function() {
this.writeBuffer.splice(0, this.prevBufferLen);
this.prevBufferLen = 0;
0 === this.writeBuffer.length ? this.emitReserved("drain") : this.flush();
}
}, {
key: "flush",
value: function() {
if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
this.transport.send(this.writeBuffer);
this.prevBufferLen = this.writeBuffer.length;
this.emitReserved("flush");
}
}
}, {
key: "write",
value: function(t, e, n) {
this.sendPacket("message", t, e, n);
return this;
}
}, {
key: "send",
value: function(t, e, n) {
this.sendPacket("message", t, e, n);
return this;
}
}, {
key: "sendPacket",
value: function(t, e, n, r) {
if ("function" == typeof e) {
r = e;
e = void 0;
}
if ("function" == typeof n) {
r = n;
n = null;
}
if ("closing" !== this.readyState && "closed" !== this.readyState) {
(n = n || {}).compress = !1 !== n.compress;
var i = {
type: t,
data: e,
options: n
};
this.emitReserved("packetCreate", i);
this.writeBuffer.push(i);
r && this.once("flush", r);
this.flush();
}
}
}, {
key: "close",
value: function() {
var t = this, e = function() {
t.onClose("forced close");
t.transport.close();
}, n = function n() {
t.off("upgrade", n);
t.off("upgradeError", n);
e();
}, r = function() {
t.once("upgrade", n);
t.once("upgradeError", n);
};
if ("opening" === this.readyState || "open" === this.readyState) {
this.readyState = "closing";
this.writeBuffer.length ? this.once("drain", function() {
t.upgrading ? r() : e();
}) : this.upgrading ? r() : e();
}
return this;
}
}, {
key: "onError",
value: function(t) {
s.priorWebsocketSuccess = !1;
this.emitReserved("error", t);
this.onClose("transport error", t);
}
}, {
key: "onClose",
value: function(t, e) {
if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
this.clearTimeoutFn(this.pingTimeoutTimer);
this.transport.removeAllListeners("close");
this.transport.close();
this.transport.removeAllListeners();
"function" == typeof removeEventListener && removeEventListener("offline", this.offlineEventListener, !1);
this.readyState = "closed";
this.id = null;
this.emitReserved("close", t, e);
this.writeBuffer = [];
this.prevBufferLen = 0;
}
}
}, {
key: "filterUpgrades",
value: function(t) {
for (var e = [], n = 0, r = t.length; n < r; n++) ~this.transports.indexOf(t[n]) && e.push(t[n]);
return e;
}
} ]);
return s;
}();
kt.protocol = 4;
function bt(t) {
var e = {};
for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
return e;
}
var wt, _t = "function" == typeof ArrayBuffer, Et = function(t) {
return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer;
}, At = Object.prototype.toString, Rt = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === At.call(Blob), Tt = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === At.call(File);
function Ot(t) {
return _t && (t instanceof ArrayBuffer || Et(t)) || Rt && t instanceof Blob || Tt && t instanceof File;
}
function Ct(e) {
if (!e || "object" !== t(e)) return !1;
if (Array.isArray(e)) {
for (var n = 0, r = e.length; n < r; n++) if (Ct(e[n])) return !0;
return !1;
}
if (Ot(e)) return !0;
if (e.toJSON && "function" == typeof e.toJSON && 1 === arguments.length) return Ct(e.toJSON(), !0);
for (var i in e) if (Object.prototype.hasOwnProperty.call(e, i) && Ct(e[i])) return !0;
return !1;
}
function St(t) {
var e = [], n = t.data, r = t;
r.data = Nt(n, e);
r.attachments = e.length;
return {
packet: r,
buffers: e
};
}
function Nt(e, n) {
if (!e) return e;
if (Ot(e)) {
var r = {
_placeholder: !0,
num: n.length
};
n.push(e);
return r;
}
if (Array.isArray(e)) {
for (var i = new Array(e.length), o = 0; o < e.length; o++) i[o] = Nt(e[o], n);
return i;
}
if ("object" === t(e) && !(e instanceof Date)) {
var s = {};
for (var a in e) e.hasOwnProperty(a) && (s[a] = Nt(e[a], n));
return s;
}
return e;
}
function Bt(t, e) {
t.data = xt(t.data, e);
t.attachments = void 0;
return t;
}
function xt(e, n) {
if (!e) return e;
if (e && e._placeholder) return n[e.num];
if (Array.isArray(e)) for (var r = 0; r < e.length; r++) e[r] = xt(e[r], n); else if ("object" === t(e)) for (var i in e) e.hasOwnProperty(i) && (e[i] = xt(e[i], n));
return e;
}
(function(t) {
t[t.CONNECT = 0] = "CONNECT";
t[t.DISCONNECT = 1] = "DISCONNECT";
t[t.EVENT = 2] = "EVENT";
t[t.ACK = 3] = "ACK";
t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR";
t[t.BINARY_EVENT = 5] = "BINARY_EVENT";
t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(wt || (wt = {}));
var Lt = function() {
function t() {
e(this, t);
}
r(t, [ {
key: "encode",
value: function(t) {
if ((t.type === wt.EVENT || t.type === wt.ACK) && Ct(t)) {
t.type = t.type === wt.EVENT ? wt.BINARY_EVENT : wt.BINARY_ACK;
return this.encodeAsBinary(t);
}
return [ this.encodeAsString(t) ];
}
}, {
key: "encodeAsString",
value: function(t) {
var e = "" + t.type;
t.type !== wt.BINARY_EVENT && t.type !== wt.BINARY_ACK || (e += t.attachments + "-");
t.nsp && "/" !== t.nsp && (e += t.nsp + ",");
null != t.id && (e += t.id);
null != t.data && (e += JSON.stringify(t.data));
return e;
}
}, {
key: "encodeAsBinary",
value: function(t) {
var e = St(t), n = this.encodeAsString(e.packet), r = e.buffers;
r.unshift(n);
return r;
}
} ]);
return t;
}(), jt = function() {
o(i, B);
var n = f(i);
function i() {
e(this, i);
return n.call(this);
}
r(i, [ {
key: "add",
value: function(t) {
var e;
if ("string" == typeof t) if ((e = this.decodeString(t)).type === wt.BINARY_EVENT || e.type === wt.BINARY_ACK) {
this.reconstructor = new qt(e);
0 === e.attachments && l(s(i.prototype), "emitReserved", this).call(this, "decoded", e);
} else l(s(i.prototype), "emitReserved", this).call(this, "decoded", e); else {
if (!Ot(t) && !t.base64) throw new Error("Unknown type: " + t);
if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
if (e = this.reconstructor.takeBinaryData(t)) {
this.reconstructor = null;
l(s(i.prototype), "emitReserved", this).call(this, "decoded", e);
}
}
}
}, {
key: "decodeString",
value: function(t) {
var e = 0, n = {
type: Number(t.charAt(0))
};
if (void 0 === wt[n.type]) throw new Error("unknown packet type " + n.type);
if (n.type === wt.BINARY_EVENT || n.type === wt.BINARY_ACK) {
for (var r = e + 1; "-" !== t.charAt(++e) && e != t.length; ) ;
var o = t.substring(r, e);
if (o != Number(o) || "-" !== t.charAt(e)) throw new Error("Illegal attachments");
n.attachments = Number(o);
}
if ("/" === t.charAt(e + 1)) {
for (var s = e + 1; ++e && "," !== t.charAt(e) && e !== t.length; ) ;
n.nsp = t.substring(s, e);
} else n.nsp = "/";
var a = t.charAt(e + 1);
if ("" !== a && Number(a) == a) {
for (var c = e + 1; ++e; ) {
var u = t.charAt(e);
if (null == u || Number(u) != u) {
--e;
break;
}
if (e === t.length) break;
}
n.id = Number(t.substring(c, e + 1));
}
if (t.charAt(++e)) {
var h = Pt(t.substr(e));
if (!i.isPayloadValid(n.type, h)) throw new Error("invalid payload");
n.data = h;
}
return n;
}
}, {
key: "destroy",
value: function() {
this.reconstructor && this.reconstructor.finishedReconstruction();
}
} ], [ {
key: "isPayloadValid",
value: function(e, n) {
switch (e) {
case wt.CONNECT:
return "object" === t(n);

case wt.DISCONNECT:
return void 0 === n;

case wt.CONNECT_ERROR:
return "string" == typeof n || "object" === t(n);

case wt.EVENT:
case wt.BINARY_EVENT:
return Array.isArray(n) && n.length > 0;

case wt.ACK:
case wt.BINARY_ACK:
return Array.isArray(n);
}
}
} ]);
return i;
}();
function Pt(t) {
try {
return JSON.parse(t);
} catch (t) {
return !1;
}
}
var qt = function() {
function t(n) {
e(this, t);
this.packet = n;
this.buffers = [];
this.reconPack = n;
}
r(t, [ {
key: "takeBinaryData",
value: function(t) {
this.buffers.push(t);
if (this.buffers.length === this.reconPack.attachments) {
var e = Bt(this.reconPack, this.buffers);
this.finishedReconstruction();
return e;
}
return null;
}
}, {
key: "finishedReconstruction",
value: function() {
this.reconPack = null;
this.buffers = [];
}
} ]);
return t;
}(), It = Object.freeze({
__proto__: null,
protocol: 5,
get PacketType() {
return wt;
},
Encoder: Lt,
Decoder: jt
});
function Dt(t, e, n) {
t.on(e, n);
return function() {
t.off(e, n);
};
}
var Ft = Object.freeze({
connect: 1,
connect_error: 1,
disconnect: 1,
disconnecting: 1,
newListener: 1,
removeListener: 1
}), Mt = function() {
o(n, B);
var t = f(n);
function n(r, i, o) {
var s;
e(this, n);
(s = t.call(this)).connected = !1;
s.disconnected = !0;
s.receiveBuffer = [];
s.sendBuffer = [];
s.ids = 0;
s.acks = {};
s.flags = {};
s.io = r;
s.nsp = i;
o && o.auth && (s.auth = o.auth);
s.io._autoConnect && s.open();
return s;
}
r(n, [ {
key: "subEvents",
value: function() {
if (!this.subs) {
var t = this.io;
this.subs = [ Dt(t, "open", this.onopen.bind(this)), Dt(t, "packet", this.onpacket.bind(this)), Dt(t, "error", this.onerror.bind(this)), Dt(t, "close", this.onclose.bind(this)) ];
}
}
}, {
key: "active",
get: function() {
return !!this.subs;
}
}, {
key: "connect",
value: function() {
if (this.connected) return this;
this.subEvents();
this.io._reconnecting || this.io.open();
"open" === this.io._readyState && this.onopen();
return this;
}
}, {
key: "open",
value: function() {
return this.connect();
}
}, {
key: "send",
value: function() {
for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
e.unshift("message");
this.emit.apply(this, e);
return this;
}
}, {
key: "emit",
value: function(t) {
if (Ft.hasOwnProperty(t)) throw new Error('"' + t + '" is a reserved event name');
for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
n.unshift(t);
var i = {
type: wt.EVENT,
data: n,
options: {}
};
i.options.compress = !1 !== this.flags.compress;
if ("function" == typeof n[n.length - 1]) {
this.acks[this.ids] = n.pop();
i.id = this.ids++;
}
var o = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable, s = this.flags.volatile && (!o || !this.connected);
s || (this.connected ? this.packet(i) : this.sendBuffer.push(i));
this.flags = {};
return this;
}
}, {
key: "packet",
value: function(t) {
t.nsp = this.nsp;
this.io._packet(t);
}
}, {
key: "onopen",
value: function() {
var t = this;
"function" == typeof this.auth ? this.auth(function(e) {
t.packet({
type: wt.CONNECT,
data: e
});
}) : this.packet({
type: wt.CONNECT,
data: this.auth
});
}
}, {
key: "onerror",
value: function(t) {
this.connected || this.emitReserved("connect_error", t);
}
}, {
key: "onclose",
value: function(t) {
this.connected = !1;
this.disconnected = !0;
delete this.id;
this.emitReserved("disconnect", t);
}
}, {
key: "onpacket",
value: function(t) {
if (t.nsp === this.nsp) switch (t.type) {
case wt.CONNECT:
if (t.data && t.data.sid) {
var e = t.data.sid;
this.onconnect(e);
} else this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
break;

case wt.EVENT:
case wt.BINARY_EVENT:
this.onevent(t);
break;

case wt.ACK:
case wt.BINARY_ACK:
this.onack(t);
break;

case wt.DISCONNECT:
this.ondisconnect();
break;

case wt.CONNECT_ERROR:
var n = new Error(t.data.message);
n.data = t.data.data;
this.emitReserved("connect_error", n);
}
}
}, {
key: "onevent",
value: function(t) {
var e = t.data || [];
null != t.id && e.push(this.ack(t.id));
this.connected ? this.emitEvent(e) : this.receiveBuffer.push(Object.freeze(e));
}
}, {
key: "emitEvent",
value: function(t) {
if (this._anyListeners && this._anyListeners.length) {
var e, r = v(this._anyListeners.slice());
try {
for (r.s(); !(e = r.n()).done; ) e.value.apply(this, t);
} catch (t) {
r.e(t);
} finally {
r.f();
}
}
l(s(n.prototype), "emit", this).apply(this, t);
}
}, {
key: "ack",
value: function(t) {
var e = this, n = !1;
return function() {
if (!n) {
n = !0;
for (var r = arguments.length, i = new Array(r), o = 0; o < r; o++) i[o] = arguments[o];
e.packet({
type: wt.ACK,
id: t,
data: i
});
}
};
}
}, {
key: "onack",
value: function(t) {
var e = this.acks[t.id];
if ("function" == typeof e) {
e.apply(this, t.data);
delete this.acks[t.id];
}
}
}, {
key: "onconnect",
value: function(t) {
this.id = t;
this.connected = !0;
this.disconnected = !1;
this.emitBuffered();
this.emitReserved("connect");
}
}, {
key: "emitBuffered",
value: function() {
var t = this;
this.receiveBuffer.forEach(function(e) {
return t.emitEvent(e);
});
this.receiveBuffer = [];
this.sendBuffer.forEach(function(e) {
return t.packet(e);
});
this.sendBuffer = [];
}
}, {
key: "ondisconnect",
value: function() {
this.destroy();
this.onclose("io server disconnect");
}
}, {
key: "destroy",
value: function() {
if (this.subs) {
this.subs.forEach(function(t) {
return t();
});
this.subs = void 0;
}
this.io._destroy(this);
}
}, {
key: "disconnect",
value: function() {
this.connected && this.packet({
type: wt.DISCONNECT
});
this.destroy();
this.connected && this.onclose("io client disconnect");
return this;
}
}, {
key: "close",
value: function() {
return this.disconnect();
}
}, {
key: "compress",
value: function(t) {
this.flags.compress = t;
return this;
}
}, {
key: "volatile",
get: function() {
this.flags.volatile = !0;
return this;
}
}, {
key: "onAny",
value: function(t) {
this._anyListeners = this._anyListeners || [];
this._anyListeners.push(t);
return this;
}
}, {
key: "prependAny",
value: function(t) {
this._anyListeners = this._anyListeners || [];
this._anyListeners.unshift(t);
return this;
}
}, {
key: "offAny",
value: function(t) {
if (!this._anyListeners) return this;
if (t) {
for (var e = this._anyListeners, n = 0; n < e.length; n++) if (t === e[n]) {
e.splice(n, 1);
return this;
}
} else this._anyListeners = [];
return this;
}
}, {
key: "listenersAny",
value: function() {
return this._anyListeners || [];
}
} ]);
return n;
}(), Ut = Vt;
function Vt(t) {
t = t || {};
this.ms = t.min || 100;
this.max = t.max || 1e4;
this.factor = t.factor || 2;
this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0;
this.attempts = 0;
}
Vt.prototype.duration = function() {
var t = this.ms * Math.pow(this.factor, this.attempts++);
if (this.jitter) {
var e = Math.random(), n = Math.floor(e * this.jitter * t);
t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n;
}
return 0 | Math.min(t, this.max);
};
Vt.prototype.reset = function() {
this.attempts = 0;
};
Vt.prototype.setMin = function(t) {
this.ms = t;
};
Vt.prototype.setMax = function(t) {
this.max = t;
};
Vt.prototype.setJitter = function(t) {
this.jitter = t;
};
var Ht = function() {
o(i, B);
var n = f(i);
function i(r, o) {
var s, a;
e(this, i);
(s = n.call(this)).nsps = {};
s.subs = [];
if (r && "object" === t(r)) {
o = r;
r = void 0;
}
(o = o || {}).path = o.path || "/socket.io";
s.opts = o;
N(u(s), o);
s.reconnection(!1 !== o.reconnection);
s.reconnectionAttempts(o.reconnectionAttempts || Infinity);
s.reconnectionDelay(o.reconnectionDelay || 1e3);
s.reconnectionDelayMax(o.reconnectionDelayMax || 5e3);
s.randomizationFactor(null !== (a = o.randomizationFactor) && void 0 !== a ? a : .5);
s.backoff = new Ut({
min: s.reconnectionDelay(),
max: s.reconnectionDelayMax(),
jitter: s.randomizationFactor()
});
s.timeout(null == o.timeout ? 2e4 : o.timeout);
s._readyState = "closed";
s.uri = r;
var c = o.parser || It;
s.encoder = new c.Encoder();
s.decoder = new c.Decoder();
s._autoConnect = !1 !== o.autoConnect;
s._autoConnect && s.open();
return s;
}
r(i, [ {
key: "reconnection",
value: function(t) {
if (!arguments.length) return this._reconnection;
this._reconnection = !!t;
return this;
}
}, {
key: "reconnectionAttempts",
value: function(t) {
if (void 0 === t) return this._reconnectionAttempts;
this._reconnectionAttempts = t;
return this;
}
}, {
key: "reconnectionDelay",
value: function(t) {
var e;
if (void 0 === t) return this._reconnectionDelay;
this._reconnectionDelay = t;
null === (e = this.backoff) || void 0 === e || e.setMin(t);
return this;
}
}, {
key: "randomizationFactor",
value: function(t) {
var e;
if (void 0 === t) return this._randomizationFactor;
this._randomizationFactor = t;
null === (e = this.backoff) || void 0 === e || e.setJitter(t);
return this;
}
}, {
key: "reconnectionDelayMax",
value: function(t) {
var e;
if (void 0 === t) return this._reconnectionDelayMax;
this._reconnectionDelayMax = t;
null === (e = this.backoff) || void 0 === e || e.setMax(t);
return this;
}
}, {
key: "timeout",
value: function(t) {
if (!arguments.length) return this._timeout;
this._timeout = t;
return this;
}
}, {
key: "maybeReconnectOnOpen",
value: function() {
!this._reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
}
}, {
key: "open",
value: function(t) {
var e = this;
if (~this._readyState.indexOf("open")) return this;
this.engine = new kt(this.uri, this.opts);
var n = this.engine, r = this;
this._readyState = "opening";
this.skipReconnect = !1;
var i = Dt(n, "open", function() {
r.onopen();
t && t();
}), o = Dt(n, "error", function(n) {
r.cleanup();
r._readyState = "closed";
e.emitReserved("error", n);
t ? t(n) : r.maybeReconnectOnOpen();
});
if (!1 !== this._timeout) {
var s = this._timeout;
0 === s && i();
var a = this.setTimeoutFn(function() {
i();
n.close();
n.emit("error", new Error("timeout"));
}, s);
this.opts.autoUnref && a.unref();
this.subs.push(function() {
clearTimeout(a);
});
}
this.subs.push(i);
this.subs.push(o);
return this;
}
}, {
key: "connect",
value: function(t) {
return this.open(t);
}
}, {
key: "onopen",
value: function() {
this.cleanup();
this._readyState = "open";
this.emitReserved("open");
var t = this.engine;
this.subs.push(Dt(t, "ping", this.onping.bind(this)), Dt(t, "data", this.ondata.bind(this)), Dt(t, "error", this.onerror.bind(this)), Dt(t, "close", this.onclose.bind(this)), Dt(this.decoder, "decoded", this.ondecoded.bind(this)));
}
}, {
key: "onping",
value: function() {
this.emitReserved("ping");
}
}, {
key: "ondata",
value: function(t) {
this.decoder.add(t);
}
}, {
key: "ondecoded",
value: function(t) {
this.emitReserved("packet", t);
}
}, {
key: "onerror",
value: function(t) {
this.emitReserved("error", t);
}
}, {
key: "socket",
value: function(t, e) {
var n = this.nsps[t];
if (!n) {
n = new Mt(this, t, e);
this.nsps[t] = n;
}
return n;
}
}, {
key: "_destroy",
value: function() {
for (var t = 0, e = Object.keys(this.nsps); t < e.length; t++) {
var n = e[t];
if (this.nsps[n].active) return;
}
this._close();
}
}, {
key: "_packet",
value: function(t) {
for (var e = this.encoder.encode(t), n = 0; n < e.length; n++) this.engine.write(e[n], t.options);
}
}, {
key: "cleanup",
value: function() {
this.subs.forEach(function(t) {
return t();
});
this.subs.length = 0;
this.decoder.destroy();
}
}, {
key: "_close",
value: function() {
this.skipReconnect = !0;
this._reconnecting = !1;
"opening" === this._readyState && this.cleanup();
this.backoff.reset();
this._readyState = "closed";
this.engine && this.engine.close();
}
}, {
key: "disconnect",
value: function() {
return this._close();
}
}, {
key: "onclose",
value: function(t) {
this.cleanup();
this.backoff.reset();
this._readyState = "closed";
this.emitReserved("close", t);
this._reconnection && !this.skipReconnect && this.reconnect();
}
}, {
key: "reconnect",
value: function() {
var t = this;
if (this._reconnecting || this.skipReconnect) return this;
var e = this;
if (this.backoff.attempts >= this._reconnectionAttempts) {
this.backoff.reset();
this.emitReserved("reconnect_failed");
this._reconnecting = !1;
} else {
var n = this.backoff.duration();
this._reconnecting = !0;
var r = this.setTimeoutFn(function() {
if (!e.skipReconnect) {
t.emitReserved("reconnect_attempt", e.backoff.attempts);
e.skipReconnect || e.open(function(n) {
if (n) {
e._reconnecting = !1;
e.reconnect();
t.emitReserved("reconnect_error", n);
} else e.onreconnect();
});
}
}, n);
this.opts.autoUnref && r.unref();
this.subs.push(function() {
clearTimeout(r);
});
}
}
}, {
key: "onreconnect",
value: function() {
var t = this.backoff.attempts;
this._reconnecting = !1;
this.backoff.reset();
this.emitReserved("reconnect", t);
}
} ]);
return i;
}(), Kt = {};
function Yt(e, n) {
if ("object" === t(e)) {
n = e;
e = void 0;
}
var r, i = _(e, (n = n || {}).path || "/socket.io"), o = i.source, s = i.id, a = i.path, c = Kt[s] && a in Kt[s].nsps;
if (n.forceNew || n["force new connection"] || !1 === n.multiplex || c) r = new Ht(o, n); else {
Kt[s] || (Kt[s] = new Ht(o, n));
r = Kt[s];
}
i.query && !n.query && (n.query = i.queryKey);
return r.socket(i.path, n);
}
i(Yt, {
Manager: Ht,
Socket: Mt,
io: Yt,
connect: Yt
});
return Yt;
});