'use strict';

var BLOCK_ELEMENTS = {
  h1: 'header1',
  h2: 'header2',
  h3: 'header3',
  h4: 'header4',
  h5: 'header5',
  h6: 'header6',
  p: 'paragraph',
  div: 'div'
};

module.exports = getResult;

function getResult (elm) {
  var result = [];

  parse(elm, extend({
    content: null,
    href: null,
    bold: false,
    italic: false
  }, {}), result);

  return result;
}

function parse (elm, opts, result) {
  // ELEMENT_NODE
  if (elm.nodeType === 1) {
    elementNode(elm, opts, result);
  }

  // TEXT_NODE
  if (elm.nodeType === 3 && elm.nodeValue.length > 0) {
    result.push(
      extend(opts, {
        content: elm.nodeValue
      })
    );
  }

  // take next sibling
  if (elm.nextSibling) {
    parse(elm.nextSibling, opts, result);
  }
}

function elementNode (elm, opts, result) {
  var nodeName = elm.nodeName.toLowerCase();
  var isBlockElement = !!BLOCK_ELEMENTS[nodeName];

  if (nodeName === 'br') {
    result.push({ type: 'linebreak' });
    return;
  }

  if (isBlockElement) {
    var blockElement = { type: BLOCK_ELEMENTS[nodeName], children: [] };
    result.push(blockElement);
    if (elm.firstChild) {
      parse(elm.firstChild, optsFromElm(opts, elm), blockElement.children);
    }
    return;
  }

  if (elm.firstChild) {
    parse(elm.firstChild, optsFromElm(opts, elm), result);
  }
}

function optsFromElm (opts, elm) {
  var nodeName = elm.nodeName.toLowerCase();
  if (nodeName === 'b') {
    return extend(opts, {
      bold: true
    });
  }
  if (nodeName === 'i') {
    return extend(opts, {
      italic: true
    });
  }
  if (nodeName === 'a') {
    return extend(opts, {
      href: elm.href
    });
  }
  return opts;
}

function extend (opts, update) {
  return {
    type: 'text',
    content: update.content || opts.content,
    href: update.href || opts.href,
    bold: update.bold || opts.bold,
    italic: update.italic || opts.italic
  };
}