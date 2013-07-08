# jQuery Text Wrapper

Text wrapper and unwrapper. (beta)

**!IMPORTANT: Text should be without tags**

##### For example:
We have HTML:
```html
<div class="text">
	Lorem Ipsum is simply <span>dummy</span> text of the printing.
</div>
```
We need to wrap text **"Lorem Ipsum"** (without tags):
```javascript
$('.text').textwrap('Lorem Ipsum', 'span');
```
This would result in (**success** wrap):
```html
<div class="text">
	<span>Lorem Ipsum </span>is simply <span>dummy</span> text of the printing.
</div>
```
If we need to wrap text **"dummy text"** (with tag):
```javascript
$('.text').textwrap('dummy text', 'span');
```
This would result in (**fail** wrap, because "dummy" in tag):
```html
<div class="text">
	Lorem Ipsum is simply <span>dummy</span> text of the printing.
</div>
```

## Requirements
* jQuery 1.6+

## Tested on

 * IE 10
 * Opera 12
 * Firefox 22
 * Chrome 27
 

##  API Reference

### **$.textWrapper.wrap(element, text, replacement, options)**
Alternative function **$(selector).textwrap(text, replacement, options)**

* **element** - (jQuery|Node) 
* **text** - (String|Array) 
* **replacement** - (String|Node|jQuery)
* **options** - (Object) OPTIONAL

Argument **text**:
```javascript
$.textWrapper.wrap($('.text'), 'Lorem', 'span'); // String
$.textWrapper.wrap($('.text'), ['Lorem', 'Ipsum'], 'span'); // Array
```

Argument **replacement**:
```javascript
$.textWrapper.wrap($('.text'), 'Lorem', 'span'); // String
$.textWrapper.wrap($('.text'), 'Lorem', document.createElement('span')); // Node
$.textWrapper.wrap($('.text'), 'Lorem', $('<span>')); // jQuery
```

### **$.textWrapper.unwrap(element, text, options)**
Alternative function **$(selector).textunwrap(text, options)**

* **element** - (jQuery|Node) 
* **text** - (String|Array)
* **options** - (Object) OPTIONAL

```javascript
$.textWrapper.unwrap($('.text'), 'Lorem'); // String
$.textWrapper.unwrap($('.text'), ['Lorem', 'Ipsum']); // Array
```

### **$.textWrapper.find(element, pattern, callback)**

* **element** - (jQuery|Node) 
* **pattern** - (RegExp) 
* **callback** - (Function)

```javascript
$.textWrapper.find(
	$('.text'), 
	new RegExp("(^\|[ \n\r\t.,'\"\+!?-]+) (Lorem) ([ \n\r\t.,'\"\+!?-]+\|$)", "g"),
    function(node, match){ console.log(node, match);}
);
```

##  Default options

* **attributeName** - (String) attribute that identifies and store wrapped text
* **createPattern** - (Function) pattern for find **text**

```javascript
$.textWrapper.options = {
	attributeName: 'tw-text',
	createPattern: function(text){
		return new RegExp("(^\|[ \n\r\t.,'\"\+!?-]+)("+ text + ")([ \n\r\t.,'\"\+!?-]+\|$)", "g");
	}
};
```

