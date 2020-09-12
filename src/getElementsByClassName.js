// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {

  var elements = [];
  var startNode = document.body;

  // recursively look for (matching className) & (collect elements) if match
  return searchThruDom(startNode, className, elements);
};


// (!) (depth first traversal) with recursion
var searchThruDom = function(current, className, elements) {

  // check for (matching className) & collect (current) if match..
  checkNcollectElement(current, className, elements);

  // get to (current)'s (child)..
  current = current.firstChild;

  // if (current child) exists
  while (current) {

    // recursively search thru (current)'s (child) & (grandChild) & (so on)..
    // until a (current) has (no child)..
    searchThruDom(current, className, elements);

    // once a (current) has (no child), check (current)'s (sibling)..
    // if a (current) has (no sibling)..
    // get back to (current)'s (parent) on call stack..
    // to check for (current)'s (uncle) & (so on)
    current = current.nextSibling;

  }
  // return (collected elements) once the (whole tree) is covered
  return elements;
};


var checkNcollectElement = function(current, className, elements) {

  if (current.classList && current.classList.contains(className)) {
    elements.push(current);
  }

};
