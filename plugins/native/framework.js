function getByTag (tag, element) {
	return document.getElementsByTagName(tag);
}
function getByClass (classList, node) {
	return (node || document).getElementsByClassName(classList)
}
function getById (node) {
	return typeof node == 'string' ? document.getElementById(node) : node
}
function addEvent(node, event, fn) {
	node.addEventListener(event, fn, false);
}
function addClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
}
function removeClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
}
function hasClass (node, className) {
	var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
	return node.className.match(re) || false;
}
function injectNode(parent, node) {
	parent.appendChild(node);
}
function insertAfter(parent, node, referenceNode) {
    parent.insertBefore(node, referenceNode.nextSibling);
}
function createElement (nodeName) {
	return document.createElement(nodeName);
}
function getAttr (node, attr) {
	return node.getAttribute(attr);
}
function setAttr(node, attr, value) {
	node.setAttribute(attr, value);
}
function removeAttr (node, attr) {
	node.removeAttribute(attr);
}
function setStyle (node, style, value) {
	node.style[style] = value;
}
function setHtml (node, html) {
	node.innerHTML = html;
}
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function toggle(node) {
    node.style.display = (node.style.display == 'none') ? '' : 'none'
}
function toPct(value1, value2) {
	if( value1 === Infinity) value1 = 1000;
	return Math.round((100*value2)/value1);
};
function secondsToTime(secs) {
	var hours = Math.floor(secs / (60 * 60));
	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);
	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);
	if(secs >= 3600) {
		 var arr = [
				hours > 9 ? parseInt(hours) : '0'+parseInt(hours),
				minutes > 9 ? parseInt(minutes) : '0'+parseInt(minutes),
				seconds > 9 ? parseInt(seconds) : '0'+parseInt(seconds)
		 ];
	} else{
		 var arr = [
				minutes > 9 ? parseInt(minutes) : '0'+parseInt(minutes),
				seconds > 9 ? parseInt(seconds) : '0'+parseInt(seconds)
		 ];
	}

	return arr;
}
function getSize (node) {

	return {width:(node.innerWidth || node.scrollWidth),height:(node.innerHeight || node.scrollHeight)};
}