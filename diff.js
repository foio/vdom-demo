var util = require('./util');
var patch = require('./patch');
var listDiff = require('list-diff2');

function diff(oldTree, newTree) {
    var index = 0;
    var patches = {};
    dfsWalk(oldTree, newTree, index, patches);
    return patches;
}


function dfsWalk(oldNode, newNode, index, patches) {
    var currentPatch = [];
    if (newNode === null) {
        //依赖listdiff算法进行标记为删除
    } else if (util.isString(oldNode) && util.isString(newNode)) {
        if (oldNode !== newNode) {
            //如果是文本节点则直接替换文本
            currentPatch.push({
                type: patch.TEXT,
                content: newNode
            });
        }
    } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
        //节点类型相同
        //比较节点的属性是否相同
        var propsPatches = diffProps(oldNode, newNode);
        if (propsPatches) {
            currentPatch.push({
                type: patch.PROPS,
                props: propsPatches
            });
        }
        //比较子节点是否相同
        diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
    } else {
        //节点的类型不同，直接替换
        currentPatch.push({ type: patch.REPLACE, node: newNode });
    }

    if (currentPatch.length) {
        patches[index] = currentPatch;
    }
}

function diffProps(oldNode, newNode) {
    var count = 0;
    var oldProps = oldNode.props;
    var newProps = newNode.props;
    var key, value;
    var propsPatches = {};

    //找出不同的属性
    for (key in oldProps) {
        value = oldProps[key];
        if (newProps[key] != value) {
            count++;
            propsPatches[key] = newProps[key];
        }
    };

    //找出新增的属性
    for (key in newProps) {
        value = newProps[key];
        if (!oldProps.hasOwnProperty(key)) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    if (count === 0) {
        return null;
    }

    return propsPatches;
}


function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    var diffs = listDiff(oldChildren, newChildren, 'key');
    newChildren = diffs.children;

    if (diffs.moves.length) {
        var reorderPatch = {
            type: patch.REORDER,
            moves: diffs.moves
        };
        currentPatch.push(reorderPatch);
    }

    var leftNode = null;
    var currentNodeIndex = index;
    util.each(oldChildren, function(child, i) {
        var newChild = newChildren[i];
        currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
        dfsWalk(child, newChild, currentNodeIndex, patches);
        leftNode = child;
    });
}


module.exports = diff;
