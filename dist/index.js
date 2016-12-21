'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// generate a random hash delimiter to avoid malicious hash collisions
function MixedTupleMap() {
  this.clear();
}

MixedTupleMap.prototype = {
  toString: function toString() {
    return '[object MixedTupleMap]';
  },
  // The difference between MixedTupleMap and WeakTupleMap is that this one has
  // a hash method that sorts key parts by putting non-primitive parts first.
  // This enables optimal garbage collection of values in the map.
  _hash: function _hash(tuple) {
    // Speed up hash generation for the folowing pattern:
    // if ( !cache.has(t) ) { cache.set( t, slowFn(t) ); }
    if (tuple === this._lastTuple) {
      return this._lastHash;
    }

    var l = tuple.length;
    var prim = [];
    var primOrder = [];
    var nonPrimOrder = [];

    for (var i = 0; i < l; i++) {
      var arg = tuple[i];
      var argType = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
      if (argType !== null && (argType === 'object' || argType === 'function')) {
        nonPrimOrder.push(i);
      } else {
        prim.push(argType === 'string' ? '"' + arg + '"' : '' + arg);
        primOrder.push(i);
      }
    }

    if (nonPrimOrder.length === 0) {
      throw new Error('Tuple must have at least one non-primitive part');
    }

    prim.push('[' + nonPrimOrder.concat(primOrder).join() + ']');

    this._lastTuple = tuple;
    this._lastHash = {
      nonPrimOrder: nonPrimOrder,
      // concatenate serialized arguments using a complex separator
      // (to avoid key collisions)
      primHash: prim.join('/<[MI_SEP]>/')
    };

    return this._lastHash;
  },

  has: function has(tuple) {
    var curr = this._cache;
    var hash = this._hash(tuple);
    var l = hash.nonPrimOrder.length;

    for (var i = 0; i < l; i++) {
      var arg = tuple[hash.nonPrimOrder[i]];
      if (curr.has && curr.has(arg)) {
        curr = curr.get(arg);
      } else {
        return false;
      }
    }

    return (curr.has || false) && curr.has(hash.primHash);
  },

  set: function set(tuple, value) {
    var curr = this._cache;
    var hash = this._hash(tuple);
    var l = hash.nonPrimOrder.length;
    var mustCreate = false;

    for (var i = 0; i < l; i++) {
      var arg = tuple[hash.nonPrimOrder[i]];
      if (!mustCreate && curr.has(arg)) {
        curr = curr.get(arg);
      } else {
        mustCreate = true;
        curr.set(arg, curr = i < l - 1 ? new WeakMap() : new Map());
      }
    }

    curr.set(hash.primHash, value);

    return this;
  },

  get: function get(tuple) {
    var curr = this._cache;
    var hash = this._hash(tuple);
    var l = hash.nonPrimOrder.length;

    for (var i = 0; i < l; i++) {
      var arg = tuple[hash.nonPrimOrder[i]];
      var ret = curr.get && curr.get(arg);
      if (ret === undefined) {
        return ret;
      } else {
        curr = ret;
      }
    }

    return curr.get && curr.get(hash.primHash);
  },

  clear: function clear() {
    this._cache = new WeakMap();
    delete this._lastTuple;
    delete this._lastHash;
  }
};

exports.default = MixedTupleMap;
module.exports = exports['default'];

//# sourceMappingURL=index.js.map