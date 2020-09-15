// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:


var stringifyJSON = function(obj) {

  // returns (undefined) if a (condition) is (true)
  if (obj === undefined || typeof obj === 'function' || typeof obj === 'symbol') {
    return undefined;
  }

  // If (obj) is an []
  if (Array.isArray(obj)) {
    return stringifyArray(obj);
  }

  // If (obj) is of (type object), check its (instance)
  if (typeof obj === 'object') {
    return checkObjectInstance(obj);
  }

  // returns (null) if a (condition) is (true)
  if (obj === null || obj === Infinity) {
    return null;
  }


  // If (obj) is a (primitive)
  return stringifyValue(obj);
};


// Stringify (string / number) value
var stringifyValue = function(obj) {
  if (typeof obj === 'number' && isNaN(obj)) {

    return null;
  }

  if (typeof obj === 'string' && obj.indexOf('"') !== -1) {
    obj = obj.replace(/"/, '"\\');
    obj = obj.replace(/'""'/, '"\\\"');
    return obj;
  }
  return obj.toString();
};


var checkObjectInstance = function(obj) {

  // If (obj) is NOT (purely) an (Object)..
  // return (obj)'s (value) accordingly
  if (obj instanceof Boolean || obj instanceof Number ||
       obj instanceof String || obj instanceof Date ||
                                obj instanceof RegExp) {

    if (obj instanceof Date) {
      return obj.toISOString();

    } else if (obj instanceof RegExp) {
      return '{}';

    } else {

      if (obj instanceof String) {

        return '"' + obj.toString() + '"';
      }

      return obj.toString();
    }

  // If (obj) is (purely) an (Object)
  } else {
    return stringifyObject(obj);
  }
};


var stringifyObject = function(obj) {
  let args = arguments;

  let accumulator = '{';
  accumulator = accumulateObjectElements(obj, accumulator);
  accumulator += '}';
  return accumulator;
};

var accumulateObjectElements = function(obj, accumulator) {

  // Iterate thru (obj)
  for (let key in obj) {

    let currentVal = obj[key];

    if (currentVal === undefined || typeof currentVal === 'function' || typeof currentVal === 'symbol') {
      continue;

    } else if (typeof currentVal === 'string') {
      accumulator += '"' + key + '":"' + currentVal + '",';

    } else if (typeof currentVal === 'number') {

      accumulator += '"' + key + '":';
      accumulator += currentVal === Infinity ? 'null,' : (currentVal + ',');

    } else if (Array.isArray(currentVal)) {

      accumulator += '"' + key + '":';
      accumulator += stringifyArray(currentVal);
      accumulator = accumulator.slice(0, accumulator.length - 1);
      accumulator += ',';

    } else if (typeof currentVal === 'object') {

      accumulator += '"' + key + '":';

      if (!isPrimitiveInstance(currentVal)) {
        accumulator += '{';
        accumulator = accumulateObjectElements(currentVal, accumulator);
        accumulator = accumulator.slice(0, accumulator.length - 1);
        accumulator += '}';

      } else {
        accumulator += checkObjectInstance(currentVal);
      }

    } else if (currentVal === null || currentVal === Infinity || isNaN(currentVal) ) {
      accumulator += '"' + key + '":"null",';
    }
  }

  return accumulator;

};

var isPrimitiveInstance = function(obj) {

  return obj instanceof Boolean || obj instanceof Number ||
    obj instanceof String || obj instanceof Date ||
                             obj instanceof RegExp;
};


var stringifyArray = function(arrayObj) {

  let accumulator = '[';
  accumulator = accumulateArrayElements(arrayObj, accumulator);

  accumulator = accumulator.slice(0, accumulator.length - 1);
  accumulator += ']';

  return accumulator;
};


var accumulateArrayElements = function(array, accumulator) {

  for (let i = 0; i < array.length; i++) {

    let current = array[i];

    // If (current) is NOT an [] / {}
    if (!(Array.isArray(current)) || typeof current !== 'object') {

      if (typeof current === 'symbol' || current === null ||
          current === Infinity || isNaN(current) ||
          current === undefined || typeof current === 'function') {

        accumulator += 'null';
        accumulator += isEndOfArray(i, array) ? '],' : ',';

      // (Current) is a (primitive)
      } else {
        accumulator += current.toString();
        accumulator += isEndOfArray(i, array) ? '],' : ',';
      }

    // If (current) is an [], recursively (collect) [] s' (elements) into (accumulator)
    } else if (Array.isArray(current)) {
      accumulator += '[';
      accumulator = accumulateArrayElements(current, accumulator);

    // If (current) is a (type of object), check (array)'s (instance)
    } else if (typeof current === 'object') {
      return checkObjectInstance(current);
    }

  }
  return accumulator;
};



var isEndOfArray = function(counter, array) {
  return counter === array.length - 1;
};



// Assertion Func()
var assertEqual = function(actual, expected) {
  if (actual === expected) {
    console.log('passed');
  } else {
    console.log('failed, \n\nexpected "' + expected + '"\n\n but got "' + actual + '"');
  }
};




// Assertions
var arr = [1, [Infinity, Symbol('')], 3, [null, 1, Infinity, undefined, function() {}], [2, 4, 5]];

var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);


var obj = {
  string: 'hi',
  number: 3,
  array: [1, Infinity, 3, 4],
  Infinity: Infinity,
  Undefined: undefined,
  object: {string: 'bye', number: 10, func: function() {}, array: [Infinity, null, undefined]}
};

var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);


var obj = new String('hello');

var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);



var obj = '"hello"';

var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);

