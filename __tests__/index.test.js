import MixedTupleMap from '../index';

describe('MixedTupleMap', () => {
  let cache
  const obj = {'Carole Granade-Segers': 'Human unicorn'};
  const hashableObj = Object.assign({}, obj, {hashCode: () => '#yolo'});
  const hashableObjClone = Object.assign({}, hashableObj);
  const arr = ['Carole', 'Granade', 'Segers', 'we', 'love', 'you'];
  const str = 'Knee Breaker';
  const int = 1337;
  const fun = function() { return 'president forever'; };
  const res = ['♥'];

  beforeEach(() => {
    cache = new MixedTupleMap();
  });

  describe('#_hash', () => {
    it('should throw with ("str")', () => {
      expect(() => { cache._hash([str]); }).toThrow();
    });

    it('should work with ({})', () => {
      expect(cache._hash([obj])).toEqual({
        nonPrimOrder: [0],
        primHash: '[0]'
      });
    });

    it('should return previous hash when reusing previous tuple', () => {
      let tuple = [obj];
      let hash = cache._hash(tuple);

      expect(cache._hash(tuple)).toBe(hash);
    });

    it('should work with ({}, "str")', () => {
      expect(cache._hash([obj, str])).toEqual({
        nonPrimOrder: [0],
        primHash: ['"Knee Breaker"','[0,1]'].join('/<[MI_SEP]>/')
      });
    });

    it('should work with ("str", {})', () => {
      expect(cache._hash([str, obj])).toEqual({
        nonPrimOrder: [1],
        primHash: ['"Knee Breaker"','[1,0]'].join('/<[MI_SEP]>/')
      });
    });

    it('should work with (int, [], "str", {})', () => {
      expect(cache._hash([int, arr, str, obj])).toEqual({
        nonPrimOrder: [1,3],
        primHash: ['1337', '"Knee Breaker"','[1,3,0,2]'].join('/<[MI_SEP]>/')
      });
    });
  });

  describe('#set, #has and then #get', () => {
    it('should work with `({})`', () => {
      cache.set([obj], res);

      expect(cache.has([obj])).toEqual(true);
      expect(cache.has([arr])).toEqual(false);
      expect(cache.get([obj])).toBe(res);
      expect(cache.get([fun])).toEqual(undefined);
    });

    it('should work with `({})` with hashCode function', () => {
      cache.set([hashableObj], res);

      expect(cache.has([hashableObj])).toEqual(true);
      expect(cache.has([hashableObjClone])).toEqual(true);
      expect(cache.has([obj])).toEqual(false);
      expect(cache.get([hashableObj])).toBe(res);
      expect(cache.get([hashableObjClone])).toBe(res);
      expect(cache.get([obj])).toEqual(undefined);
    });

    it('should work with ({}, "str")', () => {
      cache.set([obj, 'str'], res);

      expect(cache.has([obj, 'str'])).toEqual(true);
      expect(cache.get([obj, 'str'])).toBe(res);
    });

    it('should work with ("str", {})', () => {
      cache.set(['str', obj], res);

      expect(cache.has(['str', obj])).toEqual(true);
      expect(cache.get(['str', obj])).toBe(res);
    });

    it('should work with (int, [], "str", {})', () => {
      cache.set([int, arr, str, obj], res);

      expect(cache.has([int, arr, str, obj])).toEqual(true);
      expect(cache.get([int, arr, str, obj])).toBe(res);

      cache.set([int, arr, str, obj], fun);

      expect(cache.has([int, arr, str, obj])).toEqual(true);
      expect(cache.get([int, arr, str, obj])).toBe(fun);
    });
  });

  describe('.toString', () => {
    it('should return a special identifier', () => {
      expect(cache.toString()).toEqual('[object MixedTupleMap]');
    });
  });
});
