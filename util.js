/*********************************辅助类util*************************************/
//辅助类 Util
var util = {};

util.type = function(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
}

util.isArray = function(list) {
    return util.type(list) === 'Array';
}

util.isString = function(list) {
    return util.type(list) == 'String';
}

util.each = function(array, fn) {
    for (var i = 0, len = array.length; i < len; i++) {
        fn(array[i], i);
    }
}

util.toArray = function(listLike) {
    if (!listLike) {
        return [];
    }
    var list = [];
    for (var i = 0, len = listLike.length; i < len; i++) {
        list.push(listLike[i]);
    }
    return list;
}

util.setAttr = function(node, key, value) {
    switch (key) {
        case 'style':
            node.style.cssText = value;
            break;
        case 'value':
            var tagName = node.tagName || '';
            tagName = tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                node.value = value;
            } else {
                node.setAttribute(key, value);
            }
            break;
        default:
            node.setAttribute(key, value);
            break;
    }
}


module.exports = util;
