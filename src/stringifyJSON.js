// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:


var stringifyJSON = function(obj) {

  if (shouldReturnUndefined(obj)) { return undefined; }
  if (shouldReturnNull(obj)) { return 'null'; }

  if (isTypeOfObject(obj)) {
    let stringifiedObj = checkObjectInstance(obj);
    if (isPurelyObj(obj)) { stringifiedObj += '}'; }
    return stringifiedObj;
  }

  // otherwise
  return stringifyPrimitiveVal(obj);
};

// Helper Func
var shouldReturnUndefined = function(obj) {
  return obj === undefined || typeof obj === 'function' ||
                              typeof obj === 'symbol';
};

// Helper Func
var isTypeOfObject = function(obj) {
  return typeof obj === 'object' && !shouldReturnNull(obj);
};

// Helper Func
var shouldReturnNull = function(obj) {
  return obj === null || obj === Infinity ||
   typeof obj === 'number' && isNaN(obj);
};

var checkObjectInstance = function(obj) {

  if (Array.isArray(obj)) { return stringifyArray(obj); }

  if (isPurelyObj(obj)) { return stringifyObject(obj); }

  if (isPrimitiveInstance(obj)) {

    if (obj instanceof Date) {
      return '"' + obj.toISOString() + '"';

    } else if (obj instanceof RegExp) {
      return '{}';

    } else if (obj instanceof String) {
      return '"' + obj.toString() + '"';
    }
    // otherwise
    return obj.toString();
  }
};

// Helper Func
var isPurelyObj = function(obj) {
  return !isPrimitiveInstance(obj) && obj !== null && !Array.isArray(obj);
};

// Helper Func
var isPrimitiveInstance = function(obj) {
  return obj instanceof Boolean || obj instanceof Number ||
    obj instanceof String || obj instanceof Date ||
                             obj instanceof RegExp;
};

var stringifyArray = function(arrayObj) {
  let accumulator = '[';
  accumulator = accumulateArrayElements(arrayObj, accumulator);
  accumulator += ']';
  return accumulator;
};

var accumulateArrayElements = function(array, accumulator) {

  array.forEach(function(current, index) {

    accumulator += shouldReturnNullInsideArray(current) ? 'null' : stringifyJSON(current);

    if (!isEndOfArray(index, array)) { accumulator += ','; }
  });

  return accumulator;
};

// Helper Func
var isEndOfArray = function(counter, array) {
  return counter === array.length - 1;
};

// Helper Func
var shouldReturnNullInsideArray = function(value) {
  return typeof value === 'symbol' || value === null ||
  value === Infinity || (typeof value === 'number' && isNaN(value)) ||
  value === undefined || typeof value === 'function';
};

var stringifyObject = function(obj) {
  let accumulator = '{';
  accumulator = accumulateObjectElements(obj, accumulator);
  return accumulator;
};

var accumulateObjectElements = function(obj, accumulator) {

  let keys = Object.keys(obj);

  keys.forEach(function(key, index) {

    let currentVal = obj[key];

    if (!shouldReturnNothing(currentVal)) {
      accumulator += '"' + key + '":';
      accumulator += shouldReturnNull(currentVal) ? 'null' : stringifyJSON(currentVal);
      if (!isEndOfArray(index, keys)) { accumulator += ','; }
    }
  });
  return accumulator;
};

// Helper Func
var shouldReturnNothing = function(value) {
  return value === undefined || typeof value === 'function' ||
                                     typeof value === 'symbol';
};


// Helper Func
var stringifyPrimitiveVal = function(value) {

  if (shouldReturnNull(value)) { return null; }

  if (isString(value) && !hasSingleQuote(value) && !hasDoubleQuote(value)) { return '"' + value + '"'; }

  if (hasSingleQuote(value)) { return value = '"' + value + '"'; }

  if (hasDoubleQuote(value)) {
    value = value.replace(/"/g, '\\\"');
    value = '"' + value + '"';
    return value;
  }

  // otherwise
  return value.toString();
};

// Helper Func
var isString = function(value) {
  return typeof value === 'string';
};

// Helper Func
var hasDoubleQuote = function(obj) {
  return typeof obj === 'string' && obj.indexOf('"') !== -1;
};

// Helper Func
var hasSingleQuote = function(obj) {
  return typeof obj === 'string' && obj.indexOf('\'') !== -1;
};


// Assertion Func()
var assertEqual = function(actual, expected) {
  if (actual === expected) {
    console.log('passed');
  } else {
    console.log('\nfailed, \nexpected "' + expected + '"\n but got "' + actual + '"');
  }
};


// Assertions
var arr = [1, [Infinity, Symbol('')], 3, [null, 1, Infinity, undefined, function() {}], [2, 4, 5]];
var actual = stringifyJSON(arr);
var expected = JSON.stringify(arr);
assertEqual(actual, expected);


var obj = {
  string: 'hi',
  number: 3,
  array: [1, Infinity, 3, 4, {Infinity: Infinity, string: 'hi'}],
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

var obj = new Boolean(true);
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);

var obj = new Date(2006, 0, 2, 15, 4, 5);
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);

var obj = '"hello"';
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);


var obj = [undefined, {null: null, infinity: Infinity, obj: {array: [{obj: {null: null, array: []}}]}}];
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);

var obj = null;
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);

var obj = '\'Hello world\'';
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);

var obj = 'Hello Code\'s world';
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);

var obj = [4, '["hi"]', 6, 9, 12];
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);

var obj = [1, 2, 3, [8], 9];
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);

var obj = {
  'foo': true,
  'bar': false,
  'baz': null
};
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);


var obj = {
  'a': {'b': 'c'}
};
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);


var obj = [
  { a: 'b' }, { b: 'd' }
];
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);


var obj = {a: [], c: {}, b: true};
var actual = stringifyJSON(obj);
var expected = JSON.stringify(obj);
assertEqual(actual, expected);