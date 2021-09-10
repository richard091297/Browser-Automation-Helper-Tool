var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.owns = function(d, k) {
    return Object.prototype.hasOwnProperty.call(d, k)
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(d, k, e) {
    d != Array.prototype && d != Object.prototype && (d[k] = e.value)
};
$jscomp.getGlobal = function(d) {
    return "undefined" != typeof window && window === d ? d : "undefined" != typeof global && null != global ? global : d
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(d, k, e, h) {
    if (k) {
        e = $jscomp.global;
        d = d.split(".");
        for (h = 0; h < d.length - 1; h++) {
            var q = d[h];
            q in e || (e[q] = {});
            e = e[q]
        }
        d = d[d.length - 1];
        h = e[d];
        k = k(h);
        k != h && null != k && $jscomp.defineProperty(e, d, {
            configurable: !0,
            writable: !0,
            value: k
        })
    }
};
$jscomp.polyfill("Object.assign", function(d) {
    return d ? d : function(d, e) {
        for (var k = 1; k < arguments.length; k++) {
            var q = arguments[k];
            if (q)
                for (var r in q) $jscomp.owns(q, r) && (d[r] = q[r])
        }
        return d
    }
}, "es6-impl", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(d) {
    return $jscomp.SYMBOL_PREFIX + (d || "") + $jscomp.symbolCounter_++
};
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var d = $jscomp.global.Symbol.iterator;
    d || (d = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[d] && $jscomp.defineProperty(Array.prototype, d, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.arrayIterator(this)
        }
    });
    $jscomp.initSymbolIterator = function() {}
};
$jscomp.arrayIterator = function(d) {
    var k = 0;
    return $jscomp.iteratorPrototype(function() {
        return k < d.length ? {
            done: !1,
            value: d[k++]
        } : {
            done: !0
        }
    })
};
$jscomp.iteratorPrototype = function(d) {
    $jscomp.initSymbolIterator();
    d = {
        next: d
    };
    d[$jscomp.global.Symbol.iterator] = function() {
        return this
    };
    return d
};
$jscomp.polyfill("Array.from", function(d) {
    return d ? d : function(d, e, h) {
        $jscomp.initSymbolIterator();
        e = null != e ? e : function(d) {
            return d
        };
        var k = [],
            r = d[Symbol.iterator];
        if ("function" == typeof r)
            for (d = r.call(d); !(r = d.next()).done;) k.push(e.call(h, r.value));
        else
            for (var r = d.length, K = 0; K < r; K++) k.push(e.call(h, d[K]));
        return k
    }
}, "es6-impl", "es3");
$jscomp.iteratorFromArray = function(d, k) {
    $jscomp.initSymbolIterator();
    d instanceof String && (d += "");
    var e = 0,
        h = {
            next: function() {
                if (e < d.length) {
                    var q = e++;
                    return {
                        value: k(q, d[q]),
                        done: !1
                    }
                }
                h.next = function() {
                    return {
                        done: !0,
                        value: void 0
                    }
                };
                return h.next()
            }
        };
    h[Symbol.iterator] = function() {
        return h
    };
    return h
};
$jscomp.polyfill("Array.prototype.keys", function(d) {
    return d ? d : function() {
        return $jscomp.iteratorFromArray(this, function(d) {
            return d
        })
    }
}, "es6-impl", "es3");
$jscomp.polyfill("Object.is", function(d) {
    return d ? d : function(d, e) {
        return d === e ? 0 !== d || 1 / d === 1 / e : d !== d && e !== e
    }
}, "es6-impl", "es3");
$jscomp.polyfill("Array.prototype.includes", function(d) {
    return d ? d : function(d, e) {
        var h = this;
        h instanceof String && (h = String(h));
        var k = h.length;
        for (e = e || 0; e < k; e++)
            if (h[e] == d || Object.is(h[e], d)) return !0;
        return !1
    }
}, "es7", "es3");
$jscomp.checkStringArgs = function(d, k, e) {
    if (null == d) throw new TypeError("The 'this' value for String.prototype." + e + " must not be null or undefined");
    if (k instanceof RegExp) throw new TypeError("First argument to String.prototype." + e + " must not be a regular expression");
    return d + ""
};
$jscomp.polyfill("String.prototype.includes", function(d) {
    return d ? d : function(d, e) {
        return -1 !== $jscomp.checkStringArgs(this, d, "includes").indexOf(d, e || 0)
    }
}, "es6-impl", "es3");
$jscomp.polyfill("Array.prototype.fill", function(d) {
    return d ? d : function(d, e, h) {
        var k = this.length || 0;
        0 > e && (e = Math.max(0, k + e));
        if (null == h || h > k) h = k;
        h = Number(h);
        0 > h && (h = Math.max(0, k + h));
        for (e = Number(e || 0); e < h; e++) this[e] = d;
        return this
    }
}, "es6-impl", "es3");
(function() {
    function d(a, b) {
        var c = [];
        for (a = a[b]; a && 9 !== a.nodeType;) 1 === a.nodeType && c.push(k(a)), a = a[b];
        return c
    }

    function k(a) {
        return {
            el: a,
            getClass: function() {
                return this.el.getAttribute("class") || ""
            },
            getClasses: function() {
                return this.getClass().split(" ").map(function(a) {
                    return a.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
                }).filter(function(a) {
                    return 0 < a.length
                })
            },
            prevAll: function() {
                return d(this.el, "previousSibling")
            },
            nextAll: function() {
                return d(this.el, "nextSibling")
            },
            parent: function() {
                return this.el.parentNode &&
                    11 !== this.el.parentNode.nodeType ? k(this.el.parentNode) : null
            }
        }
    }

    function e(a) {
        return "string" === typeof a && null !== a.match(/^[a-zA-Z0-9]+$/gi) ? a : !1
    }

    function h(a) {
        return "string" === typeof a && null !== a.match(/^\.?[a-zA-Z_\-:0-9]*$/gi) ? a : !1
    }

    function q(a) {
        var b = "undefined" === typeof a ? "undefined" : l(a);
        return !!a && ("object" == b || "function" == b)
    }

    function r(a) {
        if ("number" == typeof a) return a;
        var b = a;
        if ("symbol" == ("undefined" === typeof b ? "undefined" : l(b)) || b && "object" == ("undefined" === typeof b ? "undefined" : l(b)) && "[object Symbol]" ==
            Ha.call(b)) return W;
        q(a) && (a = "function" == typeof a.valueOf ? a.valueOf() : a, a = q(a) ? a + "" : a);
        if ("string" != typeof a) return 0 === a ? a : +a;
        a = a.replace(Ia, "");
        return (b = Ja.test(a)) || Ka.test(a) ? La(a.slice(2), b ? 2 : 8) : Ma.test(a) ? W : +a
    }

    function K(a, b, c) {
        switch (c.length) {
            case 0:
                return a.call(b);
            case 1:
                return a.call(b, c[0]);
            case 2:
                return a.call(b, c[0], c[1]);
            case 3:
                return a.call(b, c[0], c[1], c[2])
        }
        return a.apply(b, c)
    }

    function Ga(a, b) {
        var c;
        if (c = !(!a || !a.length)) {
            a: if (b !== b) b: {
                b = Na;c = a.length;
                for (var g = -1; ++g < c;)
                    if (b(a[g],
                            g, a)) {
                        a = g;
                        break b
                    } a = -1
            }
            else {
                c = -1;
                for (g = a.length; ++c < g;)
                    if (a[c] === b) {
                        a = c;
                        break a
                    } a = -1
            }
            c = -1 < a
        }
        return c
    }

    function Na(a) {
        return a !== a
    }

    function Oa(a, b) {
        return a.has(b)
    }

    function Pa(a) {
        var b = !1;
        if (null != a && "function" != typeof a.toString) try {
            b = !!(a + "")
        } catch (c) {}
        return b
    }

    function x(a) {
        var b = -1,
            c = a ? a.length : 0;
        for (this.clear(); ++b < c;) {
            var g = a[b];
            this.set(g[0], g[1])
        }
    }

    function C(a) {
        var b = -1,
            c = a ? a.length : 0;
        for (this.clear(); ++b < c;) {
            var g = a[b];
            this.set(g[0], g[1])
        }
    }

    function D(a) {
        var b = -1,
            c = a ? a.length : 0;
        for (this.clear(); ++b <
            c;) {
            var g = a[b];
            this.set(g[0], g[1])
        }
    }

    function N(a) {
        var b = -1,
            c = a ? a.length : 0;
        for (this.__data__ = new D; ++b < c;) this.add(a[b])
    }

    function O(a, b) {
        for (var c = a.length; c--;) {
            var g = a[c][0];
            if (g === b || g !== g && b !== b) return c
        }
        return -1
    }

    function X(a, b, c, g, d) {
        var u = -1,
            e = a.length;
        c || (c = Qa);
        for (d || (d = []); ++u < e;) {
            var k = a[u];
            if (0 < b && c(k))
                if (1 < b) X(k, b - 1, c, g, d);
                else
                    for (var h = d, l = -1, v = k.length, z = h.length; ++l < v;) h[z + l] = k[l];
            else g || (d[d.length] = k)
        }
        return d
    }

    function P(a, b) {
        a = a.__data__;
        var c = "undefined" === typeof b ? "undefined" :
            l(b);
        return ("string" == c || "number" == c || "symbol" == c || "boolean" == c ? "__proto__" !== b : null === b) ? a["string" == typeof b ? "string" : "hash"] : a.map
    }

    function Y(a, b) {
        a = null == a ? void 0 : a[b];
        b = !Z(a) || ma && ma in a ? !1 : (aa(a) || Pa(a) ? Ra : Sa).test(Ta(a));
        return b ? a : void 0
    }

    function Qa(a) {
        var b;
        (b = kb(a)) || (b = Q(a) && R.call(a, "callee") && (!lb.call(a, "callee") || "[object Arguments]" == na.call(a)));
        return b || !!(oa && a && a[oa])
    }

    function Ta(a) {
        if (null != a) {
            try {
                return pa.call(a)
            } catch (b) {}
            return a + ""
        }
        return ""
    }

    function Q(a) {
        var b;
        if (b = !!a &&
            "object" == ("undefined" === typeof a ? "undefined" : l(a))) {
            if (b = null != a) b = a.length, b = "number" == typeof b && -1 < b && 0 == b % 1 && 9007199254740991 >= b;
            b = b && !aa(a)
        }
        return b
    }

    function aa(a) {
        a = Z(a) ? na.call(a) : "";
        return "[object Function]" == a || "[object GeneratorFunction]" == a
    }

    function Z(a) {
        var b = "undefined" === typeof a ? "undefined" : l(a);
        return !!a && ("object" == b || "function" == b)
    }

    function mb(a, b) {
        return 0 < nb(a.getClasses(), ob(b, function(a) {
            return a.getClasses()
        })).length || !pb(b).includes(a.el.nodeName)
    }

    function qa(a) {
        var b = "undefined" ===
            typeof a ? "undefined" : l(a);
        return !!a && ("object" == b || "function" == b)
    }

    function qb(a) {
        if ("number" == typeof a) return a;
        var b = a;
        if ("symbol" == ("undefined" === typeof b ? "undefined" : l(b)) || b && "object" == ("undefined" === typeof b ? "undefined" : l(b)) && "[object Symbol]" == rb.call(b)) return ra;
        qa(a) && (a = "function" == typeof a.valueOf ? a.valueOf() : a, a = qa(a) ? a + "" : a);
        if ("string" != typeof a) return 0 === a ? a : +a;
        a = a.replace(sb, "");
        return (b = tb.test(a)) || ub.test(a) ? vb(a.slice(2), b ? 2 : 8) : wb.test(a) ? ra : +a
    }

    function xb(a) {
        var b = a.getMethods();
        return {
            finished: function() {
                return 0 === b.length
            },
            next: function() {
                return this.finished() ? !1 : b.shift().apply(void 0, arguments)
            }
        }
    }

    function yb(a, b) {
        if (0 >= b) throw Error("Simmer: An invalid depth of " + b + " has been specified");
        return Array(b - 1).fill().reduce(function(a, b) {
            a[a.length - 1].parent() && (b = a[a.length - 1].parent(), a.push(b));
            return a
        }, [a])
    }

    function sa() {
        return ta({}, zb, 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {})
    }

    function ba() {
        function a(a, b) {
            if (!0 === g.errorHandling) throw a;
            "function" ===
            typeof g.errorHandling && g.errorHandling(a, b)
        }
        var b = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : window,
            c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : !1,
            g = sa(1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}),
            d = c || ua(b, g.queryEngine),
            c = function eb(b) {
                if (!b) return a.call(eb, Error("Simmer: No element was specified for parsing."), b), !1;
                for (var c = new xb(w), u = yb(k(b), g.depth), e = {
                        stack: Array(u.length).fill().map(function() {
                            return []
                        }),
                        specificity: 0
                    }, h = Ab(b, g, d, a); !c.finished() &&
                    !e.verified;) try {
                    e = c.next(u, e, h, g, d), e.specificity >= g.specificityThreshold && !e.verified && (e.verified = h(e))
                } catch (Bb) {
                    a.call(eb, Bb, b)
                }
                if (void 0 === e.verified || e.specificity < g.specificityThreshold) e.verified = h(e);
                return e.verified ? e.verificationDepth ? S(e, e.verificationDepth) : S(e) : !1
            };
        c.configure = function() {
            var a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : b,
                c = sa(ta({}, g, 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}));
            return ba(a, c, ua(a, c.queryEngine))
        };
        return c
    }
    var Cb = {
            querySelectorAll: function() {
                throw Error("An invalid context has been provided to Simmer, it doesnt know how to query it");
            }
        },
        Db = function(a) {
            var b = "function" === typeof a.querySelectorAll ? a : a.document ? a.document : Cb;
            return function(a, g) {
                try {
                    return b.querySelectorAll(a)
                } catch (u) {
                    g(u)
                }
            }
        },
        ua = function(a, b) {
            var c = "function" === typeof b ? b : Db(a);
            return function(b, d) {
                return "string" !== typeof b ? [] : c(b, d, a)
            }
        },
        l = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(a) {
            return typeof a
        } : function(a) {
            return a && "function" === typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
        },
        ta = Object.assign || function(a) {
            for (var b =
                    1; b < arguments.length; b++) {
                var c = arguments[b],
                    d;
                for (d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
            }
            return a
        },
        Eb = function() {
            return function(a, b) {
                if (Array.isArray(a)) return a;
                if (Symbol.iterator in Object(a)) {
                    var c = [],
                        d = !0,
                        e = !1,
                        k = void 0;
                    try {
                        for (var h = a[Symbol.iterator](), l; !(d = (l = h.next()).done) && (c.push(l.value), !b || c.length !== b); d = !0);
                    } catch (B) {
                        e = !0, k = B
                    } finally {
                        try {
                            if (!d && h["return"]) h["return"]()
                        } finally {
                            if (e) throw k;
                        }
                    }
                    return c
                }
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        }(),
        ca = function(a) {
            if (Array.isArray(a)) {
                for (var b = 0, c = Array(a.length); b < a.length; b++) c[b] = a[b];
                return c
            }
            return Array.from(a)
        },
        da = 1 / 0,
        W = 0 / 0,
        Ia = /^\s+|\s+$/g,
        Ma = /^[-+]0x[0-9a-f]+$/i,
        Ja = /^0b[01]+$/i,
        Ka = /^0o[0-7]+$/i,
        La = parseInt,
        Ha = Object.prototype.toString,
        Fb = function(a, b, c) {
            if (!a || !a.length) return [];
            c || void 0 === b ? c = 1 : ((c = b) ? (c = r(c), c = c === da || c === -da ? 1.7976931348623157e+308 * (0 > c ? -1 : 1) : c === c ? c : 0) : c = 0 === c ? c : 0, b = c % 1, c = c === c ? b ? c - b : c : 0);
            b = c;
            c = 0;
            var d = 0 > b ? 0 : b;
            b = -1;
            var e = a.length;
            0 > c && (c = -c > e ? 0 : e + c);
            d = d > e ?
                e : d;
            0 > d && (d += e);
            e = c > d ? 0 : d - c >>> 0;
            c >>>= 0;
            for (d = Array(e); ++b < e;) d[b] = a[b + c];
            return d
        },
        H = "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : {},
        Sa = /^\[object .+?Constructor\]$/,
        y = "object" == l(H) && H && H.Object === Object && H,
        ea = "object" == ("undefined" === typeof self ? "undefined" : l(self)) && self && self.Object === Object && self,
        y = y || ea || Function("return this")(),
        ea = Array.prototype,
        T = Function.prototype,
        fa = Object.prototype,
        ga = y["__core-js_shared__"],
        ma = function() {
            var a =
                /[^.]+$/.exec(ga && ga.keys && ga.keys.IE_PROTO || "");
            return a ? "Symbol(src)_1." + a : ""
        }(),
        pa = T.toString,
        R = fa.hasOwnProperty,
        na = fa.toString,
        Ra = RegExp("^" + pa.call(R).replace(/[\\^$.*+?()[\]{}|]/g, "\\$\x26").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
        T = y.Symbol,
        lb = fa.propertyIsEnumerable,
        Gb = ea.splice,
        oa = T ? T.isConcatSpreadable : void 0,
        ha = Math.max,
        Hb = Y(y, "Map"),
        L = Y(Object, "create");
    x.prototype.clear = function() {
        this.__data__ = L ? L(null) : {}
    };
    x.prototype["delete"] = function(a) {
        return this.has(a) &&
            delete this.__data__[a]
    };
    x.prototype.get = function(a) {
        var b = this.__data__;
        return L ? (a = b[a], "__lodash_hash_undefined__" === a ? void 0 : a) : R.call(b, a) ? b[a] : void 0
    };
    x.prototype.has = function(a) {
        var b = this.__data__;
        return L ? void 0 !== b[a] : R.call(b, a)
    };
    x.prototype.set = function(a, b) {
        this.__data__[a] = L && void 0 === b ? "__lodash_hash_undefined__" : b;
        return this
    };
    C.prototype.clear = function() {
        this.__data__ = []
    };
    C.prototype["delete"] = function(a) {
        var b = this.__data__;
        a = O(b, a);
        if (0 > a) return !1;
        a == b.length - 1 ? b.pop() : Gb.call(b,
            a, 1);
        return !0
    };
    C.prototype.get = function(a) {
        var b = this.__data__;
        a = O(b, a);
        return 0 > a ? void 0 : b[a][1]
    };
    C.prototype.has = function(a) {
        return -1 < O(this.__data__, a)
    };
    C.prototype.set = function(a, b) {
        var c = this.__data__,
            d = O(c, a);
        0 > d ? c.push([a, b]) : c[d][1] = b;
        return this
    };
    D.prototype.clear = function() {
        this.__data__ = {
            hash: new x,
            map: new(Hb || C),
            string: new x
        }
    };
    D.prototype["delete"] = function(a) {
        return P(this, a)["delete"](a)
    };
    D.prototype.get = function(a) {
        return P(this, a).get(a)
    };
    D.prototype.has = function(a) {
        return P(this,
            a).has(a)
    };
    D.prototype.set = function(a, b) {
        P(this, a).set(a, b);
        return this
    };
    N.prototype.add = N.prototype.push = function(a) {
        this.__data__.set(a, "__lodash_hash_undefined__");
        return this
    };
    N.prototype.has = function(a) {
        return this.__data__.has(a)
    };
    var y = function(a, b) {
            b = ha(void 0 === b ? a.length - 1 : b, 0);
            return function() {
                for (var c = arguments, d = -1, e = ha(c.length - b, 0), h = Array(e); ++d < e;) h[d] = c[b + d];
                d = -1;
                for (e = Array(b + 1); ++d < b;) e[d] = c[d];
                e[b] = h;
                return K(a, this, e)
            }
        }(function(a, b) {
            if (Q(a)) {
                b = X(b, 1, Q, !0);
                var c = -1,
                    d = Ga,
                    e = !0,
                    h = a.length,
                    k = [],
                    l = b.length;
                if (h) b: for (200 <= b.length && (d = Oa, e = !1, b = new N(b)); ++c < h;) {
                    var B = a[c],
                        q = B,
                        B = 0 !== B ? B : 0;
                    if (e && q === q) {
                        for (var v = l; v--;)
                            if (b[v] === q) continue b;
                        k.push(B)
                    } else d(b, q, void 0) || k.push(B)
                }
                a = k
            } else a = [];
            return a
        }),
        kb = Array.isArray,
        nb = y,
        ob = function(a, b) {
            return b = {
                exports: {}
            }, a(b, b.exports), b.exports
        }(function(a, b) {
            function c(f, a) {
                for (var b = -1, m = f ? f.length : 0, c = Array(m); ++b < m;) c[b] = a(f[b], b, f);
                return c
            }

            function d(a, b) {
                for (var f = -1, m = a ? a.length : 0; ++f < m;)
                    if (b(a[f], f, a)) return !0;
                return !1
            }

            function e(a) {
                return function(f) {
                    return null == f ? void 0 : f[a]
                }
            }

            function h(a) {
                return function(f) {
                    return a(f)
                }
            }

            function k(a) {
                var f = !1;
                if (null != a && "function" != typeof a.toString) try {
                    f = !!(a + "")
                } catch (p) {}
                return f
            }

            function q(a) {
                var f = -1,
                    b = Array(a.size);
                a.forEach(function(a, m) {
                    b[++f] = [m, a]
                });
                return b
            }

            function B(a) {
                var f = -1,
                    b = Array(a.size);
                a.forEach(function(a) {
                    b[++f] = a
                });
                return b
            }

            function r(a) {
                var f = -1,
                    b = a ? a.length : 0;
                for (this.clear(); ++f < b;) {
                    var c = a[f];
                    this.set(c[0], c[1])
                }
            }

            function v(a) {
                var f = -1,
                    b = a ? a.length :
                    0;
                for (this.clear(); ++f < b;) {
                    var c = a[f];
                    this.set(c[0], c[1])
                }
            }

            function z(a) {
                var f = -1,
                    b = a ? a.length : 0;
                for (this.clear(); ++f < b;) {
                    var c = a[f];
                    this.set(c[0], c[1])
                }
            }

            function x(a) {
                var f = -1,
                    b = a ? a.length : 0;
                for (this.__data__ = new z; ++f < b;) this.add(a[f])
            }

            function E(a) {
                this.__data__ = new v(a)
            }

            function y(a, b) {
                for (var f = a.length; f--;)
                    if (Y(a[f][0], b)) return f;
                return -1
            }

            function C(a, b, c, d, e) {
                var f = -1,
                    m = a.length;
                c || (c = ga);
                for (e || (e = []); ++f < m;) {
                    var p = a[f];
                    if (0 < b && c(p))
                        if (1 < b) C(p, b - 1, c, d, e);
                        else
                            for (var t = e, g = -1, h = p.length,
                                    k = t.length; ++g < h;) t[k + g] = p[g];
                    else d || (e[e.length] = p)
                }
                return e
            }

            function D(a, b) {
                b = wa(b, a) ? [b] : Q(b);
                for (var f = 0, m = b.length; null != a && f < m;) a = a[xa(b[f++])];
                return f && f == m ? a : void 0
            }

            function w(a, b, c, d, e) {
                if (a === b) return !0;
                if (null == a || null == b || !ia(a) && !ya(b)) return a !== a && b !== b;
                a: {
                    var f = F(a),
                        m = F(b),
                        p = "[object Array]",
                        g = "[object Array]";f || (p = I(a), p = "[object Arguments]" == p ? "[object Object]" : p);m || (g = I(b), g = "[object Arguments]" == g ? "[object Object]" : g);
                    var t = "[object Object]" == p && !k(a),
                        m = "[object Object]" ==
                        g && !k(b);
                    if ((g = p == g) && !t) e || (e = new E),
                    b = f || Ta(a) ? S(a, b, w, c, d, e) : ea(a, b, p, w, c, d, e);
                    else {
                        if (!(d & 2) && (f = t && G.call(a, "__wrapped__"), p = m && G.call(b, "__wrapped__"), f || p)) {
                            a = f ? a.value() : a;
                            b = p ? b.value() : b;
                            e || (e = new E);
                            b = w(a, b, c, d, e);
                            break a
                        }
                        if (g) {
                            e || (e = new E);
                            b: {
                                var h, f = d & 2,
                                    p = za(a),
                                    m = p.length,
                                    g = za(b).length;
                                if (m == g || f) {
                                    for (t = m; t--;) {
                                        var A = p[t];
                                        if (!(f ? A in b : G.call(b, A))) {
                                            b = !1;
                                            break b
                                        }
                                    }
                                    if ((g = e.get(a)) && e.get(b)) b = g == b;
                                    else {
                                        g = !0;
                                        e.set(a, b);
                                        e.set(b, a);
                                        for (var u = f; ++t < m;) {
                                            A = p[t];
                                            var l = a[A],
                                                n = b[A];
                                            c && (h = f ? c(n,
                                                l, A, b, a, e) : c(l, n, A, a, b, e));
                                            if (void 0 === h ? l !== n && !w(l, n, c, d, e) : !h) {
                                                g = !1;
                                                break
                                            }
                                            u || (u = "constructor" == A)
                                        }
                                        g && !u && (c = a.constructor, d = b.constructor, c != d && "constructor" in a && "constructor" in b && !("function" == typeof c && c instanceof c && "function" == typeof d && d instanceof d) && (g = !1));
                                        e["delete"](a);
                                        e["delete"](b);
                                        b = g
                                    }
                                } else b = !1
                            }
                        } else b = !1
                    }
                }
                return b
            }

            function K(a, b, c, d) {
                var f, m = c.length,
                    e = m,
                    p = !d;
                if (null == a) return !e;
                for (a = Object(a); m--;) {
                    var g = c[m];
                    if (p && g[2] ? g[1] !== a[g[0]] : !(g[0] in a)) return !1
                }
                for (; ++m < e;) {
                    g = c[m];
                    var t = g[0],
                        h = a[t],
                        k = g[1];
                    if (p && g[2]) {
                        if (void 0 === h && !(t in a)) return !1
                    } else if (g = new E, d && (f = d(h, k, t, a, b, g)), void 0 === f ? !w(k, h, d, 3, g) : !f) return !1
                }
                return !0
            }

            function L(a) {
                return ya(a) && Ua(a.length) && !!n[U.call(a)]
            }

            function N(a, b) {
                var f = -1,
                    c = Aa(a) ? Array(a.length) : [];
                Qa(a, function(a, m, d) {
                    c[++f] = b(a, m, d)
                });
                return c
            }

            function O(a) {
                var b = fa(a);
                return 1 == b.length && b[0][2] ? X(b[0][0], b[0][1]) : function(f) {
                    return f === a || K(f, a, b)
                }
            }

            function P(a, b) {
                return wa(a) && b === b && !ia(b) ? X(xa(a), b) : function(f) {
                    var c = null == f ?
                        void 0 : D(f, a);
                    c = void 0 === c ? void 0 : c;
                    if (void 0 === c && c === b) {
                        if (c = null != f) {
                            c = a;
                            c = wa(c, f) ? [c] : Q(c);
                            for (var m, d = -1, e = c.length; ++d < e;) {
                                var g = xa(c[d]);
                                if (!(m = null != f && null != f && g in Object(f))) break;
                                f = f[g]
                            }
                            m ? c = m : (e = f ? f.length : 0, c = !!e && Ua(e) && W(g, e) && (F(f) || Va(f)))
                        }
                        g = c
                    } else g = w(b, c, void 0, 3);
                    return g
                }
            }

            function R(a) {
                return function(b) {
                    return D(b, a)
                }
            }

            function T(a) {
                if ("string" == typeof a) return a;
                if (Wa(a)) return fb ? fb.call(a) : "";
                var b = a + "";
                return "0" == b && 1 / a == -aa ? "-0" : b
            }

            function Q(a) {
                return F(a) ? a : Sa(a)
            }

            function S(a,
                b, c, e, g, h) {
                var f, m = g & 2,
                    p = a.length,
                    k = b.length;
                if (p != k && !(m && k > p)) return !1;
                if ((k = h.get(a)) && h.get(b)) return k == b;
                var k = -1,
                    t = !0,
                    u = g & 1 ? new x : void 0;
                h.set(a, b);
                for (h.set(b, a); ++k < p;) {
                    var l = a[k],
                        va = b[k];
                    e && (f = m ? e(va, l, k, b, a, h) : e(l, va, k, a, b, h));
                    if (void 0 !== f) {
                        if (f) continue;
                        t = !1;
                        break
                    }
                    if (u) {
                        if (!d(b, function(a, b) {
                                if (!u.has(b) && (l === a || c(l, a, e, g, h))) return u.add(b)
                            })) {
                            t = !1;
                            break
                        }
                    } else if (l !== va && !c(l, va, e, g, h)) {
                        t = !1;
                        break
                    }
                }
                h["delete"](a);
                h["delete"](b);
                return t
            }

            function ea(a, b, c, d, e, g, h) {
                switch (c) {
                    case "[object DataView]":
                        if (a.byteLength !=
                            b.byteLength || a.byteOffset != b.byteOffset) break;
                        a = a.buffer;
                        b = b.buffer;
                    case "[object ArrayBuffer]":
                        if (a.byteLength != b.byteLength || !d(new gb(a), new gb(b))) break;
                        return !0;
                    case "[object Boolean]":
                    case "[object Date]":
                    case "[object Number]":
                        return Y(+a, +b);
                    case "[object Error]":
                        return a.name == b.name && a.message == b.message;
                    case "[object RegExp]":
                    case "[object String]":
                        return a == b + "";
                    case "[object Map]":
                        var f = q;
                    case "[object Set]":
                        f || (f = B);
                        if (a.size != b.size && !(g & 2)) break;
                        if (c = h.get(a)) return c == b;
                        g |= 1;
                        h.set(a,
                            b);
                        b = S(f(a), f(b), d, e, g, h);
                        h["delete"](a);
                        return b;
                    case "[object Symbol]":
                        if (Xa) return Xa.call(a) == Xa.call(b)
                }
                return !1
            }

            function Ba(a, b) {
                a = a.__data__;
                var f = "undefined" === typeof b ? "undefined" : l(b);
                return ("string" == f || "number" == f || "symbol" == f || "boolean" == f ? "__proto__" !== b : null === b) ? a["string" == typeof b ? "string" : "hash"] : a.map
            }

            function fa(a) {
                for (var b = za(a), f = b.length; f--;) {
                    var c = b[f],
                        d = a[c];
                    b[f] = [c, d, d === d && !ia(d)]
                }
                return b
            }

            function V(a, b) {
                a = null == a ? void 0 : a[b];
                b = !ia(a) || hb && hb in a ? !1 : (Z(a) || k(a) ? Ha :
                    sa).test(M(a));
                return b ? a : void 0
            }

            function ga(a) {
                return F(a) || Va(a) || !!(ib && a && a[ib])
            }

            function W(a, b) {
                b = null == b ? 9007199254740991 : b;
                return !!b && ("number" == typeof a || ta.test(a)) && -1 < a && 0 == a % 1 && a < b
            }

            function wa(a, b) {
                if (F(a)) return !1;
                var f = "undefined" === typeof a ? "undefined" : l(a);
                return "number" == f || "symbol" == f || "boolean" == f || null == a || Wa(a) ? !0 : oa.test(a) || !na.test(a) || null != b && a in Object(b)
            }

            function X(a, b) {
                return function(f) {
                    return null == f ? !1 : f[a] === b && (void 0 !== b || a in Object(f))
                }
            }

            function xa(a) {
                if ("string" ==
                    typeof a || Wa(a)) return a;
                var b = a + "";
                return "0" == b && 1 / a == -aa ? "-0" : b
            }

            function M(a) {
                if (null != a) {
                    try {
                        return jb.call(a)
                    } catch (m) {}
                    return a + ""
                }
                return ""
            }

            function Ya(a, b) {
                if ("function" != typeof a || b && "function" != typeof b) throw new TypeError("Expected a function");
                var f = function A() {
                    var f = arguments,
                        c = b ? b.apply(this, f) : f[0],
                        d = A.cache;
                    if (d.has(c)) return d.get(c);
                    f = a.apply(this, f);
                    A.cache = d.set(c, f);
                    return f
                };
                f.cache = new(Ya.Cache || z);
                return f
            }

            function Y(a, b) {
                return a === b || a !== a && b !== b
            }

            function Va(a) {
                return ya(a) &&
                    Aa(a) && G.call(a, "callee") && (!Ia.call(a, "callee") || "[object Arguments]" == U.call(a))
            }

            function Aa(a) {
                return null != a && Ua(a.length) && !Z(a)
            }

            function Z(a) {
                a = ia(a) ? U.call(a) : "";
                return "[object Function]" == a || "[object GeneratorFunction]" == a
            }

            function Ua(a) {
                return "number" == typeof a && -1 < a && 0 == a % 1 && 9007199254740991 >= a
            }

            function ia(a) {
                var b = "undefined" === typeof a ? "undefined" : l(a);
                return !!a && ("object" == b || "function" == b)
            }

            function ya(a) {
                return !!a && "object" == ("undefined" === typeof a ? "undefined" : l(a))
            }

            function Wa(a) {
                return "symbol" ==
                    ("undefined" === typeof a ? "undefined" : l(a)) || ya(a) && "[object Symbol]" == U.call(a)
            }

            function za(a) {
                if (Aa(a)) {
                    if (F(a) || Va(a)) {
                        var b = a.length;
                        for (var c = String, f = -1, d = Array(b); ++f < b;) d[f] = c(f);
                        b = d
                    } else b = [];
                    var c = b.length,
                        f = !!c;
                    for (e in a) !G.call(a, e) || f && ("length" == e || W(e, c)) || b.push(e);
                    a = b
                } else {
                    var e = a && a.constructor;
                    if (a === ("function" == typeof e && e.prototype || Ca)) {
                        e = [];
                        for (b in Object(a)) G.call(a, b) && "constructor" != b && e.push(b);
                        a = e
                    } else a = Ka(a)
                }
                return a
            }

            function ma(a) {
                return a
            }
            var aa = 1 / 0,
                na = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
                oa = /^\w*$/,
                pa = /^\./,
                qa = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
                ra = /\\(\\)?/g,
                sa = /^\[object .+?Constructor\]$/,
                ta = /^(?:0|[1-9]\d*)$/,
                n = {};
            n["[object Float32Array]"] = n["[object Float64Array]"] = n["[object Int8Array]"] = n["[object Int16Array]"] = n["[object Int32Array]"] = n["[object Uint8Array]"] = n["[object Uint8ClampedArray]"] = n["[object Uint16Array]"] = n["[object Uint32Array]"] = !0;
            n["[object Arguments]"] = n["[object Array]"] = n["[object ArrayBuffer]"] =
                n["[object Boolean]"] = n["[object DataView]"] = n["[object Date]"] = n["[object Error]"] = n["[object Function]"] = n["[object Map]"] = n["[object Number]"] = n["[object Object]"] = n["[object RegExp]"] = n["[object Set]"] = n["[object String]"] = n["[object WeakMap]"] = !1;
            var ba = "object" == l(H) && H && H.Object === Object && H,
                ua = "object" == ("undefined" === typeof self ? "undefined" : l(self)) && self && self.Object === Object && self,
                J = ba || ua || Function("return this")(),
                ca = b && !b.nodeType && b,
                da = ca && !0 && a && !a.nodeType && a,
                ha = da && da.exports === ca &&
                ba.process;
            a: {
                try {
                    var Za = ha && ha.binding("util");
                    break a
                } catch (f) {}
                Za = void 0
            }
            var la = Za && Za.isTypedArray,
                Fa = Array.prototype,
                Ga = Function.prototype,
                Ca = Object.prototype,
                $a = J["__core-js_shared__"],
                hb = function() {
                    var a = /[^.]+$/.exec($a && $a.keys && $a.keys.IE_PROTO || "");
                    return a ? "Symbol(src)_1." + a : ""
                }(),
                jb = Ga.toString,
                G = Ca.hasOwnProperty,
                U = Ca.toString,
                Ha = RegExp("^" + jb.call(G).replace(/[\\^$.*+?()[\]{}|]/g, "\\$\x26").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                Da = J.Symbol,
                gb =
                J.Uint8Array,
                Ia = Ca.propertyIsEnumerable,
                Ja = Fa.splice,
                ib = Da ? Da.isConcatSpreadable : void 0,
                Ka = function(a, b) {
                    return function(c) {
                        return a(b(c))
                    }
                }(Object.keys, Object),
                ab = V(J, "DataView"),
                ja = V(J, "Map"),
                bb = V(J, "Promise"),
                cb = V(J, "Set"),
                db = V(J, "WeakMap"),
                ka = V(Object, "create"),
                La = M(ab),
                Ma = M(ja),
                Na = M(bb),
                Oa = M(cb),
                Pa = M(db),
                Ea = Da ? Da.prototype : void 0,
                Xa = Ea ? Ea.valueOf : void 0,
                fb = Ea ? Ea.toString : void 0;
            r.prototype.clear = function() {
                this.__data__ = ka ? ka(null) : {}
            };
            r.prototype["delete"] = function(a) {
                return this.has(a) && delete this.__data__[a]
            };
            r.prototype.get = function(a) {
                var b = this.__data__;
                return ka ? (a = b[a], "__lodash_hash_undefined__" === a ? void 0 : a) : G.call(b, a) ? b[a] : void 0
            };
            r.prototype.has = function(a) {
                var b = this.__data__;
                return ka ? void 0 !== b[a] : G.call(b, a)
            };
            r.prototype.set = function(a, b) {
                this.__data__[a] = ka && void 0 === b ? "__lodash_hash_undefined__" : b;
                return this
            };
            v.prototype.clear = function() {
                this.__data__ = []
            };
            v.prototype["delete"] = function(a) {
                var b = this.__data__;
                a = y(b, a);
                if (0 > a) return !1;
                a == b.length - 1 ? b.pop() : Ja.call(b, a, 1);
                return !0
            };
            v.prototype.get =
                function(a) {
                    var b = this.__data__;
                    a = y(b, a);
                    return 0 > a ? void 0 : b[a][1]
                };
            v.prototype.has = function(a) {
                return -1 < y(this.__data__, a)
            };
            v.prototype.set = function(a, b) {
                var c = this.__data__,
                    d = y(c, a);
                0 > d ? c.push([a, b]) : c[d][1] = b;
                return this
            };
            z.prototype.clear = function() {
                this.__data__ = {
                    hash: new r,
                    map: new(ja || v),
                    string: new r
                }
            };
            z.prototype["delete"] = function(a) {
                return Ba(this, a)["delete"](a)
            };
            z.prototype.get = function(a) {
                return Ba(this, a).get(a)
            };
            z.prototype.has = function(a) {
                return Ba(this, a).has(a)
            };
            z.prototype.set =
                function(a, b) {
                    Ba(this, a).set(a, b);
                    return this
                };
            x.prototype.add = x.prototype.push = function(a) {
                this.__data__.set(a, "__lodash_hash_undefined__");
                return this
            };
            x.prototype.has = function(a) {
                return this.__data__.has(a)
            };
            E.prototype.clear = function() {
                this.__data__ = new v
            };
            E.prototype["delete"] = function(a) {
                return this.__data__["delete"](a)
            };
            E.prototype.get = function(a) {
                return this.__data__.get(a)
            };
            E.prototype.has = function(a) {
                return this.__data__.has(a)
            };
            E.prototype.set = function(a, b) {
                var c = this.__data__;
                if (c instanceof v) {
                    c = c.__data__;
                    if (!ja || 199 > c.length) return c.push([a, b]), this;
                    c = this.__data__ = new z(c)
                }
                c.set(a, b);
                return this
            };
            var Qa = function(a, b) {
                    return function(c, d) {
                        if (null == c) return c;
                        if (!Aa(c)) return a(c, d);
                        for (var f = c.length, e = b ? f : -1, g = Object(c);
                            (b ? e-- : ++e < f) && !1 !== d(g[e], e, g););
                        return c
                    }
                }(function(a, b) {
                    return a && Ra(a, b, za)
                }),
                Ra = function(a) {
                    return function(b, c, d) {
                        var e = -1,
                            f = Object(b);
                        d = d(b);
                        for (var g = d.length; g--;) {
                            var h = d[a ? g : ++e];
                            if (!1 === c(f[h], h, f)) break
                        }
                        return b
                    }
                }(),
                I = function(a) {
                    return U.call(a)
                };
            if (ab &&
                "[object DataView]" != I(new ab(new ArrayBuffer(1))) || ja && "[object Map]" != I(new ja) || bb && "[object Promise]" != I(bb.resolve()) || cb && "[object Set]" != I(new cb) || db && "[object WeakMap]" != I(new db)) I = function(a) {
                var b = U.call(a);
                if (a = (a = "[object Object]" == b ? a.constructor : void 0) ? M(a) : void 0) switch (a) {
                    case La:
                        return "[object DataView]";
                    case Ma:
                        return "[object Map]";
                    case Na:
                        return "[object Promise]";
                    case Oa:
                        return "[object Set]";
                    case Pa:
                        return "[object WeakMap]"
                }
                return b
            };
            var Sa = Ya(function(a) {
                a = null == a ? "" : T(a);
                var b = [];
                pa.test(a) && b.push("");
                a.replace(qa, function(a, c, d, e) {
                    b.push(d ? e.replace(ra, "$1") : c || a)
                });
                return b
            });
            Ya.Cache = z;
            var F = Array.isArray,
                Ta = la ? h(la) : L;
            a.exports = function(a, b) {
                var d = F(a) ? c : N;
                b = "function" == typeof b ? b : null == b ? ma : "object" == ("undefined" === typeof b ? "undefined" : l(b)) ? F(b) ? P(b[0], b[1]) : O(b) : wa(b) ? e(xa(b)) : R(b);
                a = d(a, b);
                return C(a, 1)
            }
        }),
        pb = function(a) {
            return a.map(function(a) {
                return a.el.nodeName
            })
        },
        la = {
            A: function(a, b) {
                if (b = b.el.getAttribute("href")) a.stack[0].push('A[href\x3d"' + b + '"]'), a.specificity +=
                    10;
                return a
            },
            IMG: function(a, b) {
                if (b = b.el.getAttribute("src")) a.stack[0].push('IMG[src\x3d"' + b + '"]'), a.specificity += 10;
                return a
            }
        },
        w = {
            methods: [],
            getMethods: function() {
                return this.methods.slice(0)
            },
            addMethod: function(a) {
                this.methods.push(a)
            }
        };
    w.addMethod(function(a, b, c, d, e) {
        return a.reduce(function(a, b, g) {
            return a.verified ? a : (b = [b.el.getAttribute("id")].filter(function(a) {
                a = "string" === typeof a && null !== a.match(/^[0-9a-zA-Z][a-zA-Z_\-:0-9.]*$/gi) ? a : !1;
                return a
            }).filter(function(a) {
                return 1 === (e('[id\x3d"' +
                    a + '"]') || []).length
            }).map(function(b) {
                a.stack[g].push("[id\x3d'" + b + "']");
                a.specificity += 100;
                a.specificity >= d.specificityThreshold && c(a) && (a.verified = !0);
                a.verified || 0 !== g || (a.stack[g].pop(), a.specificity -= 100);
                return a
            }), Eb(b, 1)[0] || a)
        }, b)
    });
    w.addMethod(function(a, b) {
        return a.reduce(function(a, b, d) {
            [b.el.nodeName].filter(e).forEach(function(b) {
                a.stack[d].splice(0, 0, b);
                a.specificity += 10
            });
            return a
        }, b)
    });
    w.addMethod(function(a, b, c) {
        a = a[0];
        var d = a.el.nodeName;
        la[d] && (b = la[d](b, a), c(b) ? b.verified = !0 :
            b.stack[0].pop());
        return b
    });
    w.addMethod(function(a, b) {
        return a.reduce(function(a, b, d) {
            b = Fb(b.getClasses(), 10).filter(h).map(function(a) {
                return "." + a
            });
            b.length && (a.stack[d].push(b.join("")), a.specificity += 10 * b.length);
            return a
        }, b)
    });
    w.addMethod(function(a, b, c) {
        return a.reduce(function(a, b, d) {
            if (!a.verified) {
                var e = b.prevAll(),
                    g = b.nextAll(),
                    h = e.length + 1;
                !e.length && !g.length || mb(b, [].concat(ca(e), ca(g))) || (a.stack[d].push(":nth-child(" + h + ")"), a.verified = c(a))
            }
            return a
        }, b)
    });
    var Fa = 1 / 0,
        ra = 0 / 0,
        sb = /^\s+|\s+$/g,
        wb = /^[-+]0x[0-9a-f]+$/i,
        tb = /^0b[01]+$/i,
        ub = /^0o[0-7]+$/i,
        vb = parseInt,
        rb = Object.prototype.toString,
        Ib = function(a, b, c) {
            var d = a ? a.length : 0;
            if (!d) return [];
            c || void 0 === b ? b = 1 : (b ? (b = qb(b), b = b === Fa || b === -Fa ? 1.7976931348623157e+308 * (0 > b ? -1 : 1) : b === b ? b : 0) : b = 0 === b ? b : 0, c = b % 1, b = b === b ? c ? b - c : b : 0);
            b = d - b;
            b = 0 > b ? 0 : b;
            var e = d,
                d = -1;
            c = a.length;
            0 > b && (b = -b > c ? 0 : c + b);
            e = e > c ? c : e;
            0 > e && (e += c);
            c = b > e ? 0 : e - b >>> 0;
            b >>>= 0;
            for (e = Array(c); ++d < c;) e[d] = a[d + b];
            return e
        },
        S = function(a) {
            var b = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] :
                a.stack.length;
            return Ib(a.stack.reduceRight(function(a, b) {
                b.length ? a.push(b.join("")) : a.length && a.push("*");
                return a
            }, []), b).join(" \x3e ") || "*"
        },
        Ab = function(a, b, c, d) {
            var e = b.selectorMaxLength;
            return function(b) {
                for (var g = !1, h = 1; h <= b.stack.length && !g; h += 1) {
                    g = S(b, h).trim();
                    if (!g || !g.length || e && g.length > e) return !1;
                    g = c(g, d);
                    if (g = 1 === g.length && (void 0 !== a.el ? g[0] === a.el : g[0] === a)) b.verificationDepth = h
                }
                return g
            }
        },
        zb = {
            queryEngine: null,
            specificityThreshold: 100,
            depth: 3,
            errorHandling: !1,
            selectorMaxLength: 512
        };
    (function(a, b) {
        var c = a.Simmer;
        a.Simmer = b;
        b.noConflict = function() {
            a.Simmer = c;
            return b
        }
    })(window, ba(window))
})();