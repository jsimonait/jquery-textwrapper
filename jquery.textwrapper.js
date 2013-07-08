/**
* jQuery Text Wrapper
* @author: jsimonait <jsimonait@gmail.com>
*/

(function ($) {
	
	$.fn.textwrap = function(text, replacement, options){
		return $.textWrapper.wrap($(this), text, replacement, options);
	};

	$.fn.textunwrap = function(text, options){
		$.textWrapper.unwrap($(this), text, options);
	};


	$.textWrapper = new function(){
		var that = this;

		this.options = {
			attributeName: 'tw-text',
			createPattern: function(text){
				return new RegExp("(^\|[ \n\r\t.,'\"\+!?-]+)("+ text + ")([ \n\r\t.,'\"\+!?-]+\|$)", "g");
			}
		};

		this.wrap = function(element, text, replacement, options){
			var result = [];
			options = $.extend(that.options, options  || {});
			element = $(element);

			element.each(function(i, t){
				if (typeof text.push != "undefined") {
					for(var i in text){
						$.merge(result, findAndReplace(t, text[i], replacement, options));
					}
				}else{ 
					$.merge(result, findAndReplace(t, text, replacement, options));
				}
			});

			return result;
		};

		this.unwrap = function(element, text, options){
			options = $.extend(that.options, options  || {});
			element = $(element);

			var $elm = $('[' + options.attributeName + '="' + text + '"]', element);
			$elm.contents().unwrap();
		};

		this.find = function(element, pattern, callback) {
			element = getNode(element);

			for (var childi= element.childNodes.length; childi-->0;) {
		        var child= element.childNodes[childi];
		        if (child.nodeType==1) {
		            that.find(child, pattern, callback);
		        } else if (child.nodeType==3) {
		            var matches= [];
		            var match;
		            while (match= pattern.exec(child.data))
		                matches.push(match);
		            for (var i= matches.length; i-->0;)
		                callback.call(window, child, matches[i]);
		        }
		    }
		};


		var findAndReplace = function(element, text, replacement, options){
			var result = [];

			options = $.extend(that.options, options || {});

			element = getNode(element);

			var pattern = options.createPattern(text);
			that.find(element, pattern, function(node, match) {
				replacement = makeReplacementNode(replacement);
				replacement.setAttribute(options.attributeName, text);

				node.splitText(match.index + match[0].length);
				replacement.appendChild(node.splitText(match.index));
				node.parentNode.insertBefore(replacement, node.nextSibling);
				result.push(replacement);
			});

			return result
		};

		var makeReplacementNode = function(node){
			var rNode;

			if(typeof node == 'string'){
				rNode = document.createElement(node);	
			}else{
				if(node instanceof jQuery) node = node.get(0);

				rNode = document.createElement(node.tagName);

				var attr = node.attributes;
				for (var i = 0; i < attr.length; i++) {
					rNode.setAttribute(attr[i].nodeName, attr[i].nodeValue);
				};	
			}
			
			return rNode;
		}

		var getNode = function(element){
			if(element instanceof jQuery){
				if(element.length == 1){
					element = element.get(0);	
				}else{
					element = element.get();	
				}
			}

			return element
		}

	}

})(jQuery)
