function getByTag (tag) {
	return $(tag);
}
function getByClass (classList, node) {
	return $('.'+classList, (node || document));
}
function getById (node) {
	console.log($('#'+node));
	return $('#'+node);
}
function addEvent(node, eventName, fn) {
	$(node).bind(eventName,fn);
}
function addClass(o, c){
    $(o).addClass(c);
}
function removeClass(o, c){
    $(o).removeClass(c);
}
function hasClass (node, className) {
	return $(node).hasClass(className);
}
function injectNode(parent, node) {
	parent.appendChild(node);
}
function insertAfter(parent, node, referenceNode) {
    parent.insertBefore(node, referenceNode.nextSibling);
}
function createElement (nodeName) {
	return $('<'+nodeName+'>')[0];
}
function getAttr (node, attr) {
	return $(node).attr(attr);
}
function setAttr(node, attr, value) {
	$(node).attr(attr,value);
}
function removeAttr (node, attr) {
	$(node).removeAttr(attr,value);
}
function setStyle (node, style, value) {
	$(node).css(style, value);
}
function setHtml (node, html) {
	$(node).html(html);
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
	return {width:$(node).width(),height:$(node).height()};
}