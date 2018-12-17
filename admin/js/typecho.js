(function (a) {
    a.Typecho = {
        insertFileToEditor: function (c, b, d) {
        }, editorResize: function (c, b) {
            $("#" + c).resizeable({
                minHeight: 100, afterResize: function (d) {
                    $.post(b, {size: d})
                }
            })
        }, uploadComplete: function (b) {
        }
    }
})(window);
(function (a) {
    a.fn.dropdownMenu = function (b) {
        this.each(function () {
            var d = this, c = a.extend({menuEl: null, btnEl: null}, b);
            a(c.btnEl, d).click(function () {
                var e = a(this);
                e.toggleClass("active");
                a(c.menuEl, d).toggle();
                return false
            })
        })
    };
    a.fn.resizeable = function (b) {
        var c = a.extend({minHeight: 100, afterResize: null}, b);
        return this.each(function () {
            var d = a('<span class="resize"><i></i></span>').insertAfter(this), j, g = 0, e = c.minHeight, l = this;

            function f(m) {
                textarea = a(m.data.el);
                textarea.blur();
                g = k(m).y;
                j = textarea.height() - g;
                textarea.css("opacity", 0.25);
                a(document).mousemove(i).mouseup(h);
                return false
            }

            function i(o) {
                var m = k(o).y, n = j + m;
                if (g >= (m)) {
                    n -= 5
                }
                g = m;
                n = Math.max(e, n);
                textarea.height(n + "px");
                if (n < e) {
                    h(o)
                }
                return false
            }

            function h(n) {
                var m = textarea.outerHeight();
                a(document).unbind("mousemove", i).unbind("mouseup", h);
                textarea.css("opacity", 1);
                textarea.focus();
                textarea = null;
                j = null;
                g = 0;
                if (c.afterResize) {
                    c.afterResize.call(l, m)
                }
            }

            function k(m) {
                return {
                    x: m.clientX + document.documentElement.scrollLeft,
                    y: m.clientY + document.documentElement.scrollTop
                }
            }

            d.bind("mousedown", {el: this}, f)
        })
    };
    a.fn.tableSelectable = function (c) {
        var e = this, d = a.extend({checkEl: null, rowEl: null, selectAllEl: null, actionEl: null}, c);

        function b(g) {
            var g = a(g), f = a(d.checkEl, g), h = f.prop("checked");
            if (!f.length) {
                return
            }
            f.prop("checked", !h);
            if (h) {
                g.removeClass("checked")
            } else {
                g.addClass("checked")
            }
        }

        a(d.rowEl, this).each(function () {
            a(d.checkEl, this).click(function (f) {
                b(a(this).parents(d.rowEl))
            })
        }).click(function (h) {
            var g = a(h.toElement ? h.toElement : h.target), f = g.prop("tagName").toLowerCase();
            if (a.inArray(f, ["input", "textarea", "a", "button", "i"]) >= 0 && "checkbox" != g.attr("type")) {
                h.stopPropagation()
            } else {
                b(this)
            }
        });
        a(d.selectAllEl).click(function () {
            var f = a(this), g = f.prop("checked");
            if (g) {
                a(d.rowEl, e).each(function () {
                    var h = a(this), i = a(d.checkEl, this).prop("checked", true);
                    if (i.length > 0) {
                        h.addClass("checked")
                    }
                })
            } else {
                a(d.rowEl, e).each(function () {
                    var h = a(this), i = a(d.checkEl, this).prop("checked", false);
                    if (i.length > 0) {
                        h.removeClass("checked")
                    }
                })
            }
        });
        a(d.actionEl).click(function () {
            var f = a(this), g = f.attr("lang");
            if (!g || confirm(g)) {
                e.parents("form").attr("action", f.attr("href")).submit()
            }
            return false
        })
    }
})($);
(function (a) {
    a.tableDnD = {
        currentTable: null, dragObject: null, mouseOffset: null, oldY: 0, build: function (b) {
            b = b || {};
            this.each(function () {
                this.tableDnDConfig = {
                    onDragStyle: b.onDragStyle,
                    onDropStyle: b.onDropStyle,
                    onDragClass: b.onDragClass ? b.onDragClass : "tDnD_whileDrag",
                    onDrop: b.onDrop,
                    onDragStart: b.onDragStart,
                    scrollAmount: b.scrollAmount ? b.scrollAmount : 5
                };
                a.tableDnD.makeDraggable(this);
                if (0 == $("tfoot", this).length && 0 < $("thead", this).length) {
                    var d = $("thead", this), e = $("th", d).length,
                        i = $('<tfoot><tr><td style="padding:0;height:0;line-height:0;border:none" colspan="' + e + '"></td></tr></tfoot>').insertAfter(d),
                        c = $("tr:last", this);
                    if (c.parent().prop("tagName").toLowerCase() != "tfoot") {
                        var j = $("td", c), g = j.height();
                        j.height(g - i.outerHeight())
                    }
                }
            });
            a(document).bind("mousemove", a.tableDnD.mousemove).bind("mouseup", a.tableDnD.mouseup);
            return this
        }, makeDraggable: function (e) {
            var f = e.rows;
            var c = e.tableDnDConfig;
            for (var d = 0; d < f.length; d++) {
                var b = $(f[d]).hasClass("nodrag");
                if (!b) {
                    a(f[d]).mousedown(function (g) {
                        if (g.target.tagName == "TD") {
                            a.tableDnD.dragObject = this;
                            a.tableDnD.currentTable = e;
                            a.tableDnD.mouseOffset = a.tableDnD.getMouseOffset(this, g);
                            if (c.onDragStart) {
                                c.onDragStart(e, this)
                            }
                            return false
                        }
                    }).css("cursor", "move")
                }
            }
        }, mouseCoords: function (b) {
            if (b.pageX || b.pageY) {
                return {x: b.pageX, y: b.pageY}
            }
            return {
                x: b.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: b.clientY + document.body.scrollTop - document.body.clientTop
            }
        }, getMouseOffset: function (e, d) {
            d = d || window.event;
            var c = this.getPosition(e);
            var b = this.mouseCoords(d);
            return {x: b.x - c.x, y: b.y - c.y}
        }, getPosition: function (d) {
            var c = 0;
            var b = 0;
            if (d.offsetHeight == 0) {
                d = d.firstChild
            }
            while (d.offsetParent) {
                c += d.offsetLeft;
                b += d.offsetTop;
                d = d.offsetParent
            }
            c += d.offsetLeft;
            b += d.offsetTop;
            return {x: c, y: b}
        }, mousemove: function (h) {
            if (a.tableDnD.dragObject == null) {
                return
            }
            var e = a(a.tableDnD.dragObject);
            var c = a.tableDnD.currentTable.tableDnDConfig;
            var j = a.tableDnD.mouseCoords(h);
            var g = j.y - a.tableDnD.mouseOffset.y;
            var d = window.pageYOffset;
            if (document.all) {
                if (typeof document.compatMode != "undefined" && document.compatMode != "BackCompat") {
                    d = document.documentElement.scrollTop
                } else {
                    if (typeof document.body != "undefined") {
                        d = document.body.scrollTop
                    }
                }
            }
            if (j.y - d < c.scrollAmount) {
                window.scrollBy(0, -c.scrollAmount)
            } else {
                var b = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
                if (b - (j.y - d) < c.scrollAmount) {
                    window.scrollBy(0, c.scrollAmount)
                }
            }
            if (g != a.tableDnD.oldY) {
                var f = g > a.tableDnD.oldY;
                a.tableDnD.oldY = g;
                if (c.onDragClass) {
                    e.addClass(c.onDragClass)
                } else {
                    e.css(c.onDragStyle)
                }
                var i = a.tableDnD.findDropTargetRow(e, g);
                if (i) {
                    if (f && a.tableDnD.dragObject != i) {
                        a.tableDnD.dragObject.parentNode.insertBefore(a.tableDnD.dragObject, i.nextSibling)
                    } else {
                        if (!f && a.tableDnD.dragObject != i) {
                            a.tableDnD.dragObject.parentNode.insertBefore(a.tableDnD.dragObject, i)
                        }
                    }
                }
            }
            return false
        }, findDropTargetRow: function (g, h) {
            var k = a.tableDnD.currentTable.rows;
            for (var f = 0; f < k.length; f++) {
                var j = k[f];
                var c = this.getPosition(j).y;
                var b = parseInt(j.offsetHeight) / 2;
                if (j.offsetHeight == 0) {
                    c = this.getPosition(j.firstChild).y;
                    b = parseInt(j.firstChild.offsetHeight) / 2
                }
                if ((h > c - b) && (h < (c + b))) {
                    if (j == g) {
                        return null
                    }
                    var d = a.tableDnD.currentTable.tableDnDConfig;
                    if (d.onAllowDrop) {
                        if (d.onAllowDrop(g, j)) {
                            return j
                        } else {
                            return null
                        }
                    } else {
                        var e = $(j).hasClass("nodrop");
                        if (!e) {
                            return j
                        } else {
                            return null
                        }
                    }
                    return j
                }
            }
            return null
        }, mouseup: function (d) {
            if (a.tableDnD.currentTable && a.tableDnD.dragObject) {
                var c = a.tableDnD.dragObject;
                var b = a.tableDnD.currentTable.tableDnDConfig;
                if (b.onDragClass) {
                    a(c).removeClass(b.onDragClass)
                } else {
                    a(c).css(b.onDropStyle)
                }
                a.tableDnD.dragObject = null;
                if (b.onDrop) {
                    b.onDrop(a.tableDnD.currentTable, c)
                }
                a.tableDnD.currentTable = null
            }
        }, serialize: function () {
            if (a.tableDnD.currentTable) {
                var b = "";
                var d = a.tableDnD.currentTable.id;
                var e = a.tableDnD.currentTable.rows;
                for (var c = 0; c < e.length; c++) {
                    if (b.length > 0) {
                        b += "&"
                    }
                    b += d + "[]=" + e[c].id
                }
                return b
            } else {
                return "Error: No Table id set, you need to set an id on your table and every row"
            }
        }
    };
    a.fn.extend({tableDnD: a.tableDnD.build})
})($);
(function (e) {
    function g() {
        var i = document.createElement("input"), h = "onpaste";
        i.setAttribute(h, "");
        return (typeof i[h] === "function") ? "paste" : "input"
    }

    var b = g() + ".mask", d = navigator.userAgent, c = /iphone/i.test(d), a = /android/i.test(d), f;
    e.mask = {definitions: {"9": "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]"}, dataName: "rawMaskFn", placeholder: "_",};
    e.fn.extend({
        caret: function (j, h) {
            var i;
            if (this.length === 0 || this.is(":hidden")) {
                return
            }
            if (typeof j == "number") {
                h = (typeof h === "number") ? h : j;
                return this.each(function () {
                    if (this.setSelectionRange) {
                        this.setSelectionRange(j, h)
                    } else {
                        if (this.createTextRange) {
                            i = this.createTextRange();
                            i.collapse(true);
                            i.moveEnd("character", h);
                            i.moveStart("character", j);
                            i.select()
                        }
                    }
                })
            } else {
                if (this[0].setSelectionRange) {
                    j = this[0].selectionStart;
                    h = this[0].selectionEnd
                } else {
                    if (document.selection && document.selection.createRange) {
                        i = document.selection.createRange();
                        j = 0 - i.duplicate().moveStart("character", -100000);
                        h = j + i.text.length
                    }
                }
                return {begin: j, end: h}
            }
        }, unmask: function () {
            return this.trigger("unmask")
        }, mask: function (j, n) {
            var k, i, m, o, l, h;
            if (!j && this.length > 0) {
                k = e(this[0]);
                return k.data(e.mask.dataName)()
            }
            n = e.extend({placeholder: e.mask.placeholder, completed: null}, n);
            i = e.mask.definitions;
            m = [];
            o = h = j.length;
            l = null;
            e.each(j.split(""), function (p, q) {
                if (q == "?") {
                    h--;
                    o = p
                } else {
                    if (i[q]) {
                        m.push(new RegExp(i[q]));
                        if (l === null) {
                            l = m.length - 1
                        }
                    } else {
                        m.push(null)
                    }
                }
            });
            return this.trigger("unmask").each(function () {
                var y = e(this), t = e.map(j.split(""), function (C, B) {
                    if (C != "?") {
                        return i[C] ? n.placeholder : C
                    }
                }), A = y.val();

                function x(B) {
                    while (++B < h && !m[B]) {
                    }
                    return B
                }

                function u(B) {
                    while (--B >= 0 && !m[B]) {
                    }
                    return B
                }

                function s(E, B) {
                    var D, C;
                    if (E < 0) {
                        return
                    }
                    for (D = E, C = x(B); D < h; D++) {
                        if (m[D]) {
                            if (C < h && m[D].test(t[C])) {
                                t[D] = t[C];
                                t[C] = n.placeholder
                            } else {
                                break
                            }
                            C = x(C)
                        }
                    }
                    w();
                    y.caret(Math.max(l, E))
                }

                function p(F) {
                    var D, E, B, C;
                    for (D = F, E = n.placeholder; D < h; D++) {
                        if (m[D]) {
                            B = x(D);
                            C = t[D];
                            t[D] = E;
                            if (B < h && m[B].test(C)) {
                                E = C
                            } else {
                                break
                            }
                        }
                    }
                }

                function v(E) {
                    var C = E.which, F, D, B;
                    if (C === 8 || C === 46 || (c && C === 127)) {
                        F = y.caret();
                        D = F.begin;
                        B = F.end;
                        if (B - D === 0) {
                            D = C !== 46 ? u(D) : (B = x(D - 1));
                            B = C === 46 ? x(B) : B
                        }
                        q(D, B);
                        s(D, B - 1);
                        E.preventDefault()
                    } else {
                        if (C == 27) {
                            y.val(A);
                            y.caret(0, r());
                            E.preventDefault()
                        }
                    }
                }

                function z(E) {
                    var B = E.which, G = y.caret(), D, F, C;
                    if (E.ctrlKey || E.altKey || E.metaKey || B < 32) {
                        return
                    } else {
                        if (B) {
                            if (G.end - G.begin !== 0) {
                                q(G.begin, G.end);
                                s(G.begin, G.end - 1)
                            }
                            D = x(G.begin - 1);
                            if (D < h) {
                                F = String.fromCharCode(B);
                                if (m[D].test(F)) {
                                    p(D);
                                    t[D] = F;
                                    w();
                                    C = x(D);
                                    if (a) {
                                        setTimeout(e.proxy(e.fn.caret, y, C), 0)
                                    } else {
                                        y.caret(C)
                                    }
                                    if (n.completed && C >= h) {
                                        n.completed.call(y)
                                    }
                                }
                            }
                            E.preventDefault()
                        }
                    }
                }

                function q(D, B) {
                    var C;
                    for (C = D; C < B && C < h; C++) {
                        if (m[C]) {
                            t[C] = n.placeholder
                        }
                    }
                }

                function w() {
                    y.val(t.join(""))
                }

                function r(C) {
                    var F = y.val(), E = -1, B, D;
                    for (B = 0, pos = 0; B < h; B++) {
                        if (m[B]) {
                            t[B] = n.placeholder;
                            while (pos++ < F.length) {
                                D = F.charAt(pos - 1);
                                if (m[B].test(D)) {
                                    t[B] = D;
                                    E = B;
                                    break
                                }
                            }
                            if (pos > F.length) {
                                break
                            }
                        } else {
                            if (t[B] === F.charAt(pos) && B !== o) {
                                pos++;
                                E = B
                            }
                        }
                    }
                    if (C) {
                        w()
                    } else {
                        if (E + 1 < o) {
                            y.val("");
                            q(0, h)
                        } else {
                            w();
                            y.val(y.val().substring(0, E + 1))
                        }
                    }
                    return (o ? B : l)
                }

                y.data(e.mask.dataName, function () {
                    return e.map(t, function (C, B) {
                        return m[B] && C != n.placeholder ? C : null
                    }).join("")
                });
                if (!y.attr("readonly")) {
                    y.one("unmask", function () {
                        y.unbind(".mask").removeData(e.mask.dataName)
                    }).bind("focus.mask", function () {
                        clearTimeout(f);
                        var C, B;
                        A = y.val();
                        C = r();
                        f = setTimeout(function () {
                            w();
                            if (C == j.length) {
                                y.caret(0, C)
                            } else {
                                y.caret(C)
                            }
                        }, 10)
                    }).bind("blur.mask", function () {
                        r();
                        if (y.val() != A) {
                            y.change()
                        }
                    }).bind("keydown.mask", v).bind("keypress.mask", z).bind(b, function () {
                        setTimeout(function () {
                            var B = r(true);
                            y.caret(B);
                            if (n.completed && B == y.val().length) {
                                n.completed.call(y)
                            }
                        }, 0)
                    })
                }
                r()
            })
        }
    })
})(jQuery);
jQuery.fn.extend({
    getSelection: function () {
        var a = this.get(0);
        if (!a) {
            return null
        }
        return (("selectionStart" in a && function () {
            var b = a.selectionEnd - a.selectionStart;
            return {start: a.selectionStart, end: a.selectionEnd, length: b, text: a.value.substr(a.selectionStart, b)}
        }) || (window.getSelection() && function () {
            var c = window.getSelection(), b = c.getRangeAt(0);
            return {start: b.startOffset, end: b.endOffset, length: b.endOffset - b.startOffset, text: b.toString()}
        }) || (document.selection && function () {
            a.focus();
            var c = document.selection.createRange();
            if (c === null) {
                return {start: 0, end: a.value.length, length: 0}
            }
            var b = a.createTextRange();
            var d = b.duplicate();
            b.moveToBookmark(c.getBookmark());
            d.setEndPoint("EndToStart", b);
            return {start: d.text.length, end: d.text.length + c.text.length, length: c.text.length, text: c.text}
        }) || function () {
            return null
        })()
    }, setSelection: function (d, a) {
        var c = this.get(0);
        if (!c) {
            return
        }
        if (c.setSelectionRange) {
            c.focus();
            c.setSelectionRange(d, a)
        } else {
            if (c.createTextRange) {
                var b = c.createTextRange();
                b.collapse(true);
                b.moveEnd("character", a);
                b.moveStart("character", d);
                b.select()
            }
        }
    }, replaceSelection: function () {
        var a = this.get(0);
        if (!a) {
            return null
        }
        var b = arguments[0] || "";
        return (("selectionStart" in a && function () {
            a.value = a.value.substr(0, a.selectionStart) + b + a.value.substr(a.selectionEnd, a.value.length);
            return this
        }) || (document.selection && function () {
            a.focus();
            document.selection.createRange().text = b;
            return this
        }) || function () {
            a.value += b;
            return jQuery(a)
        })()
    }
});
jQuery.cookie = function (d, e, b) {
    if (arguments.length > 1 && String(e) !== "[object Object]") {
        b = jQuery.extend({}, b);
        if (e === null || e === undefined) {
            b.expires = -1
        }
        if (typeof b.expires === "number") {
            var g = b.expires, c = b.expires = new Date();
            c.setDate(c.getDate() + g)
        }
        e = String(e);
        return (document.cookie = [encodeURIComponent(d), "=", b.raw ? e : encodeURIComponent(e), b.expires ? "; expires=" + b.expires.toUTCString() : "", b.path ? "; path=" + b.path : "", b.domain ? "; domain=" + b.domain : "", b.secure ? "; secure" : ""].join(""))
    }
    b = e || {};
    var a, f = b.raw ? function (h) {
        return h
    } : decodeURIComponent;
    return (a = new RegExp("(?:^|; )" + encodeURIComponent(d) + "=([^;]*)").exec(document.cookie)) ? f(a[1]) : null
};
/*
 * jQuery.ScrollTo
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 4/09/2012
 *
 * @projectDescription Easy element scrolling using jQuery.
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @author Ariel Flesler
 * @version 1.4.3.1
 *
 * @id jQuery.scrollTo
 * @id jQuery.fn.scrollTo
 * @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.
 *	  The different options for target are:
 *		- A number position (will be applied to all axes).
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
 *		- A jQuery/DOM element ( logically, child of the element to scroll )
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
 *		- A percentage of the container's dimension/s, for example: 50% to go to the middle.
 *		- The string 'max' for go-to-end. 
 * @param {Number, Function} duration The OVERALL length of the animation, this argument can be the settings object instead.
 * @param {Object,Function} settings Optional set of settings or the onAfter callback.
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
 *	 @option {Number, Function} duration The OVERALL length of the animation.
 *	 @option {String} easing The easing method for the animation.
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
 *	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }.
 *	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends. 
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @desc Scroll to a fixed position
 * @example $('div').scrollTo( 340 );
 *
 * @desc Scroll relatively to the actual position
 * @example $('div').scrollTo( '+=340px', { axis:'y' } );
 *
 * @desc Scroll using a selector (relative to the scrolled element)
 * @example $('div').scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );
 *
 * @desc Scroll to a DOM element (same for jQuery object)
 * @example var second_child = document.getElementById('container').firstChild.nextSibling;
 *			$('#container').scrollTo( second_child, { duration:500, axis:'x', onAfter:function(){
 *				alert('scrolled!!');																   
 *			}});
 *
 * @desc Scroll on both axes, to different values
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );
 */
(function (c) {
    var a = c.scrollTo = function (f, e, d) {
        c(window).scrollTo(f, e, d)
    };
    a.defaults = {axis: "xy", duration: parseFloat(c.fn.jquery) >= 1.3 ? 0 : 1, limit: true};
    a.window = function (d) {
        return c(window)._scrollable()
    };
    c.fn._scrollable = function () {
        return this.map(function () {
            var e = this,
                d = !e.nodeName || c.inArray(e.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"]) != -1;
            if (!d) {
                return e
            }
            var f = (e.contentWindow || e).document || e.ownerDocument || e;
            return /webkit/i.test(navigator.userAgent) || f.compatMode == "BackCompat" ? f.body : f.documentElement
        })
    };
    c.fn.scrollTo = function (f, e, d) {
        if (typeof e == "object") {
            d = e;
            e = 0
        }
        if (typeof d == "function") {
            d = {onAfter: d}
        }
        if (f == "max") {
            f = 9000000000
        }
        d = c.extend({}, a.defaults, d);
        e = e || d.duration;
        d.queue = d.queue && d.axis.length > 1;
        if (d.queue) {
            e /= 2
        }
        d.offset = b(d.offset);
        d.over = b(d.over);
        return this._scrollable().each(function () {
            if (f == null) {
                return
            }
            var l = this, j = c(l), k = f, i, g = {}, m = j.is("html,body");
            switch (typeof k) {
                case"number":
                case"string":
                    if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(k)) {
                        k = b(k);
                        break
                    }
                    k = c(k, this);
                    if (!k.length) {
                        return
                    }
                case"object":
                    if (k.is || k.style) {
                        i = (k = c(k)).offset()
                    }
            }
            c.each(d.axis.split(""), function (q, r) {
                var s = r == "x" ? "Left" : "Top", u = s.toLowerCase(), p = "scroll" + s, o = l[p], n = a.max(l, r);
                if (i) {
                    g[p] = i[u] + (m ? 0 : o - j.offset()[u]);
                    if (d.margin) {
                        g[p] -= parseInt(k.css("margin" + s)) || 0;
                        g[p] -= parseInt(k.css("border" + s + "Width")) || 0
                    }
                    g[p] += d.offset[u] || 0;
                    if (d.over[u]) {
                        g[p] += k[r == "x" ? "width" : "height"]() * d.over[u]
                    }
                } else {
                    var t = k[u];
                    g[p] = t.slice && t.slice(-1) == "%" ? parseFloat(t) / 100 * n : t
                }
                if (d.limit && /^\d+$/.test(g[p])) {
                    g[p] = g[p] <= 0 ? 0 : Math.min(g[p], n)
                }
                if (!q && d.queue) {
                    if (o != g[p]) {
                        h(d.onAfterFirst)
                    }
                    delete g[p]
                }
            });
            h(d.onAfter);

            function h(n) {
                j.animate(g, e, d.easing, n && function () {
                    n.call(this, f, d)
                })
            }
        }).end()
    };
    a.max = function (j, i) {
        var h = i == "x" ? "Width" : "Height", e = "scroll" + h;
        if (!c(j).is("html,body")) {
            return j[e] - c(j)[h.toLowerCase()]()
        }
        var g = "client" + h, f = j.ownerDocument.documentElement, d = j.ownerDocument.body;
        return Math.max(f[e], d[e]) - Math.min(f[g], d[g])
    };

    function b(d) {
        return typeof d == "object" ? d : {top: d, left: d}
    }
})(jQuery);
jQuery.fn.css2 = jQuery.fn.css;
jQuery.fn.css = function () {
    if (arguments.length) {
        return jQuery.fn.css2.apply(this, arguments)
    }
    var b = ["font-family", "font-size", "font-weight", "font-style", "color", "box-sizing", "text-transform", "text-decoration", "letter-spacing", "box-shadow", "line-height", "text-align", "vertical-align", "direction", "background-color", "background-image", "background-repeat", "background-position", "background-attachment", "opacity", "width", "height", "top", "right", "bottom", "left", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style", "position", "display", "visibility", "z-index", "overflow-x", "overflow-y", "white-space", "clip", "float", "clear", "cursor", "list-style-image", "list-style-position", "list-style-type", "marker-offset"];
    var a = b.length, d = {};
    for (var c = 0; c < a; c++) {
        d[b[c]] = jQuery.fn.css2.call(this, b[c])
    }
    return d
};