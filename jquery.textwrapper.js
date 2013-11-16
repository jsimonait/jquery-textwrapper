/**
* jQuery Text Wrapper
* @author: jsimonait <jsimonait@gmail.com>
*/

(function ($) {

	$.fn.textwrap = function(text, replacement){
		return $.textWrapper.wrap($(this), text, replacement);
	};

	$.fn.textunwrap = function(text){
		$.textWrapper.unwrap($(this), text);
	};


    $.textWrapper = new function() {
        var that = this;

        this.options = {
            dataTextName: 'text',
            createPattern: function (text) {
                return new RegExp("()("+ text + ")()", "g");
            }
        };

        this.wrap = function (element, text, replacement, options) {
        	options = $.extend(this.options, options || {});

            var result = [], $element = $(element);

            var singleWrap = function(elm, txt){
            	$.merge(result, findAndReplace(elm, txt, replacement, options));
            };

            // Clean html
            $element.html(clean($element.html()));

            $element.each(function(i, t) {
                if (typeof text.push != "undefined") {
                    for (var i in text) {
                    	singleWrap(t, text[i])
                    }
                } else {
                    singleWrap(t, text)
                }
            });

            return result;
        };

        this.unwrap = function(element, text, options) {
            options = $.extend(this.options, options || {});

            var $element = $(element);

            var singleUnwrap = function($elm, txt){
				var $wrappedElements = $elm.find('[' + getDataTextAttrName(options.dataTextName) + '="' + txt + '"]');

				$wrappedElements.each(function(i, el){
					var pnode = el.parentNode;
					pnode.insertBefore(el.firstChild, el);
					pnode.removeChild(el);
					pnode.normalize();
				});
			};

            $element.each(function(i, t) {
                if (typeof text.push != "undefined") {
                    for (var i in text) {
                    	singleUnwrap($(t), text[i]);
                    }
                } else {
                    singleUnwrap($(t), text);
                }
            });
        };

        this.find = function(element, pattern, callback) {
            element = getNode(element);

            for (var childi = element.childNodes.length; childi-- > 0;) {
                var child = element.childNodes[childi];

                if (child.nodeType == 1) {
                    that.find(child, pattern, callback);
                } else if (child.nodeType == 3) {
                    var matches = [];
                    var match;

                    while (match = pattern.exec(child.data)) {
                        matches.push(match);
                    }
                    for (var i = matches.length; i-- > 0;) {
                        callback.call(window, child, matches[i]);
                    }
                }
            }
        };

        var findAndReplace = function(element, text, replacement, options) {
            var result = [];

            options = $.extend(that.options, options || {});

            element = getNode(element);

            var pattern = options.createPattern(text);

            that.find(element, pattern, function (node, match) {
                // If wrapped, exit
                if (node.parentNode.getAttribute(getDataTextAttrName(options.dataTextName))) return;

                replacement = makeReplacementNode(replacement);
                replacement.setAttribute(getDataTextAttrName(options.dataTextName), text);
                
                var mIndexes = getMatchIndexes(match, 2);
                node.splitText(mIndexes[1]);
                replacement.appendChild(node.splitText(mIndexes[0]));
                node.parentNode.insertBefore(replacement, node.nextSibling);

                result.push(replacement);
            });

            return result;
        };

        var makeReplacementNode = function(node) {
            var rNode;

            if (typeof node == 'string') {
                rNode = document.createElement(node);
            } else {
                if (node instanceof jQuery) node = node.get(0);

                rNode = document.createElement(node.tagName);

                var attr = node.attributes;
                for (var i = 0; i < attr.length; i++) {
                    rNode.setAttribute(attr[i].nodeName, attr[i].nodeValue);
                }
                ;
            }

            return rNode;
        };

        var getNode = function(element) {
            if (element instanceof jQuery) {
                if (element.length == 1) {
                    element = element.get(0);
                } else {
                    element = element.get();
                }
            }

            return element;
        };

        var getMatchIndexes = function (m, captureGroup) {
            captureGroup = captureGroup || 0;

            if (!m[0]) throw 'textWrapper cannot handle zero-length matches';

            var index = m.index;

            if (captureGroup > 0) {
                var cg = m[captureGroup];
                if (!cg) throw 'Invalid capture group';
                index += m[0].indexOf(cg);
                m[0] = cg;
            }

            return [index, index + m[0].length, [m[0]]];
        };

        var getDataTextAttrName = function (dataTextName) {
            return 'data-' + dataTextName;
        };

        var clean = function (text) {
            text = '' + text; // Typecast to string
            text = $('<div />').html(text).html(); // Decode HTML characters
            text = text.replace(/\xA0|\s+|(&nbsp;)/mg, ' '); // Convert whitespace
            return text;
        };
    };

})(jQuery)
