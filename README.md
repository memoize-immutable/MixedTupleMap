MixedTupleMap [![npm version](https://badge.fury.io/js/mixedtuplemap.svg)](https://badge.fury.io/js/mixedtuplemap) [![Build Status](https://travis-ci.org/memoize-immutable/mixedtuplemap.svg?branch=master)](https://travis-ci.org/memoize-immutable/mixedtuplemap) [![Dependency Status](https://david-dm.org/memoize-immutable/mixedtuplemap.svg)](https://david-dm.org/memoize-immutable/mixedtuplemap) [![Coverage Status](https://coveralls.io/repos/github/memoize-immutable/mixedtuplemap/badge.svg?branch=master)](https://coveralls.io/github/memoize-immutable/mixedtuplemap?branch=master)
=============

A memory-efficient Map which accepts multiple objects as a key.
This lib is one of the several possible cache for [memoize-immutable](/louisremi/memoize-immutable),
but it can suit other use-cases as it implements a usual Map API.

## Install

`npm install --save MixedTupleMap`

This lib has no dependency, but requires a native implementation of WeakMap.

## Usage

**Restrictions**. This map should be used when:
-

```js
var MixedTupleMap = require('MixedTupleMap');

var cache = new MixedTupleMap();

var keyPart1 = {};
var keyPart2 = 'yolo';
var keyPart3 = [];
var value = {any: 'thing'};

// Note that following keyPart tuples are wrapped in new arrays that are !==
// (otherwise a WeakMap would have been enough).
cache.set([keyPart1, keyPart2, keyPart3], value);

cache.has([keyPart1, keyPart2, keyPart3]) === true;
cache.get([keyPart1, keyPart2, keyPart3]) === value;
```

## When should you use this map?

This map is the best alternative to a WeakMap, when you need keys composed
of multiple parts that mix primitive and non-primitive types. Note shouldn't be used if ALL parts
of the key are likely to have primitive types
(`number`, `string`, `boolean`, `undefined` or even `null`).

## Author

[@louis_remi](https://twitter.com/louis_remi)

## License

MPL-2.0
