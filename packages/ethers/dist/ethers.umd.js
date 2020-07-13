(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.ethers = {}));
}(this, function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var _nodeResolve_empty = {};

	var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
		'default': _nodeResolve_empty
	});

	var require$$0 = getCjsExportFromNamespace(_nodeResolve_empty$1);

	var bn = createCommonjsModule(function (module) {
	(function (module, exports) {
	  'use strict';

	  // Utils
	  function assert (val, msg) {
	    if (!val) throw new Error(msg || 'Assertion failed');
	  }

	  // Could use `inherits` module, but don't want to move from single file
	  // architecture yet.
	  function inherits (ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  }

	  // BN

	  function BN (number, base, endian) {
	    if (BN.isBN(number)) {
	      return number;
	    }

	    this.negative = 0;
	    this.words = null;
	    this.length = 0;

	    // Reduction context
	    this.red = null;

	    if (number !== null) {
	      if (base === 'le' || base === 'be') {
	        endian = base;
	        base = 10;
	      }

	      this._init(number || 0, base || 10, endian || 'be');
	    }
	  }
	  if (typeof module === 'object') {
	    module.exports = BN;
	  } else {
	    exports.BN = BN;
	  }

	  BN.BN = BN;
	  BN.wordSize = 26;

	  var Buffer;
	  try {
	    Buffer = require$$0.Buffer;
	  } catch (e) {
	  }

	  BN.isBN = function isBN (num) {
	    if (num instanceof BN) {
	      return true;
	    }

	    return num !== null && typeof num === 'object' &&
	      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
	  };

	  BN.max = function max (left, right) {
	    if (left.cmp(right) > 0) return left;
	    return right;
	  };

	  BN.min = function min (left, right) {
	    if (left.cmp(right) < 0) return left;
	    return right;
	  };

	  BN.prototype._init = function init (number, base, endian) {
	    if (typeof number === 'number') {
	      return this._initNumber(number, base, endian);
	    }

	    if (typeof number === 'object') {
	      return this._initArray(number, base, endian);
	    }

	    if (base === 'hex') {
	      base = 16;
	    }
	    assert(base === (base | 0) && base >= 2 && base <= 36);

	    number = number.toString().replace(/\s+/g, '');
	    var start = 0;
	    if (number[0] === '-') {
	      start++;
	    }

	    if (base === 16) {
	      this._parseHex(number, start);
	    } else {
	      this._parseBase(number, base, start);
	    }

	    if (number[0] === '-') {
	      this.negative = 1;
	    }

	    this.strip();

	    if (endian !== 'le') return;

	    this._initArray(this.toArray(), base, endian);
	  };

	  BN.prototype._initNumber = function _initNumber (number, base, endian) {
	    if (number < 0) {
	      this.negative = 1;
	      number = -number;
	    }
	    if (number < 0x4000000) {
	      this.words = [ number & 0x3ffffff ];
	      this.length = 1;
	    } else if (number < 0x10000000000000) {
	      this.words = [
	        number & 0x3ffffff,
	        (number / 0x4000000) & 0x3ffffff
	      ];
	      this.length = 2;
	    } else {
	      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
	      this.words = [
	        number & 0x3ffffff,
	        (number / 0x4000000) & 0x3ffffff,
	        1
	      ];
	      this.length = 3;
	    }

	    if (endian !== 'le') return;

	    // Reverse the bytes
	    this._initArray(this.toArray(), base, endian);
	  };

	  BN.prototype._initArray = function _initArray (number, base, endian) {
	    // Perhaps a Uint8Array
	    assert(typeof number.length === 'number');
	    if (number.length <= 0) {
	      this.words = [ 0 ];
	      this.length = 1;
	      return this;
	    }

	    this.length = Math.ceil(number.length / 3);
	    this.words = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	      this.words[i] = 0;
	    }

	    var j, w;
	    var off = 0;
	    if (endian === 'be') {
	      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
	        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
	        this.words[j] |= (w << off) & 0x3ffffff;
	        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
	        off += 24;
	        if (off >= 26) {
	          off -= 26;
	          j++;
	        }
	      }
	    } else if (endian === 'le') {
	      for (i = 0, j = 0; i < number.length; i += 3) {
	        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
	        this.words[j] |= (w << off) & 0x3ffffff;
	        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
	        off += 24;
	        if (off >= 26) {
	          off -= 26;
	          j++;
	        }
	      }
	    }
	    return this.strip();
	  };

	  function parseHex (str, start, end) {
	    var r = 0;
	    var len = Math.min(str.length, end);
	    for (var i = start; i < len; i++) {
	      var c = str.charCodeAt(i) - 48;

	      r <<= 4;

	      // 'a' - 'f'
	      if (c >= 49 && c <= 54) {
	        r |= c - 49 + 0xa;

	      // 'A' - 'F'
	      } else if (c >= 17 && c <= 22) {
	        r |= c - 17 + 0xa;

	      // '0' - '9'
	      } else {
	        r |= c & 0xf;
	      }
	    }
	    return r;
	  }

	  BN.prototype._parseHex = function _parseHex (number, start) {
	    // Create possibly bigger array to ensure that it fits the number
	    this.length = Math.ceil((number.length - start) / 6);
	    this.words = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	      this.words[i] = 0;
	    }

	    var j, w;
	    // Scan 24-bit chunks and add them to the number
	    var off = 0;
	    for (i = number.length - 6, j = 0; i >= start; i -= 6) {
	      w = parseHex(number, i, i + 6);
	      this.words[j] |= (w << off) & 0x3ffffff;
	      // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
	      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
	      off += 24;
	      if (off >= 26) {
	        off -= 26;
	        j++;
	      }
	    }
	    if (i + 6 !== start) {
	      w = parseHex(number, start, i + 6);
	      this.words[j] |= (w << off) & 0x3ffffff;
	      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
	    }
	    this.strip();
	  };

	  function parseBase (str, start, end, mul) {
	    var r = 0;
	    var len = Math.min(str.length, end);
	    for (var i = start; i < len; i++) {
	      var c = str.charCodeAt(i) - 48;

	      r *= mul;

	      // 'a'
	      if (c >= 49) {
	        r += c - 49 + 0xa;

	      // 'A'
	      } else if (c >= 17) {
	        r += c - 17 + 0xa;

	      // '0' - '9'
	      } else {
	        r += c;
	      }
	    }
	    return r;
	  }

	  BN.prototype._parseBase = function _parseBase (number, base, start) {
	    // Initialize as zero
	    this.words = [ 0 ];
	    this.length = 1;

	    // Find length of limb in base
	    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
	      limbLen++;
	    }
	    limbLen--;
	    limbPow = (limbPow / base) | 0;

	    var total = number.length - start;
	    var mod = total % limbLen;
	    var end = Math.min(total, total - mod) + start;

	    var word = 0;
	    for (var i = start; i < end; i += limbLen) {
	      word = parseBase(number, i, i + limbLen, base);

	      this.imuln(limbPow);
	      if (this.words[0] + word < 0x4000000) {
	        this.words[0] += word;
	      } else {
	        this._iaddn(word);
	      }
	    }

	    if (mod !== 0) {
	      var pow = 1;
	      word = parseBase(number, i, number.length, base);

	      for (i = 0; i < mod; i++) {
	        pow *= base;
	      }

	      this.imuln(pow);
	      if (this.words[0] + word < 0x4000000) {
	        this.words[0] += word;
	      } else {
	        this._iaddn(word);
	      }
	    }
	  };

	  BN.prototype.copy = function copy (dest) {
	    dest.words = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	      dest.words[i] = this.words[i];
	    }
	    dest.length = this.length;
	    dest.negative = this.negative;
	    dest.red = this.red;
	  };

	  BN.prototype.clone = function clone () {
	    var r = new BN(null);
	    this.copy(r);
	    return r;
	  };

	  BN.prototype._expand = function _expand (size) {
	    while (this.length < size) {
	      this.words[this.length++] = 0;
	    }
	    return this;
	  };

	  // Remove leading `0` from `this`
	  BN.prototype.strip = function strip () {
	    while (this.length > 1 && this.words[this.length - 1] === 0) {
	      this.length--;
	    }
	    return this._normSign();
	  };

	  BN.prototype._normSign = function _normSign () {
	    // -0 = 0
	    if (this.length === 1 && this.words[0] === 0) {
	      this.negative = 0;
	    }
	    return this;
	  };

	  BN.prototype.inspect = function inspect () {
	    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
	  };

	  /*

	  var zeros = [];
	  var groupSizes = [];
	  var groupBases = [];

	  var s = '';
	  var i = -1;
	  while (++i < BN.wordSize) {
	    zeros[i] = s;
	    s += '0';
	  }
	  groupSizes[0] = 0;
	  groupSizes[1] = 0;
	  groupBases[0] = 0;
	  groupBases[1] = 0;
	  var base = 2 - 1;
	  while (++base < 36 + 1) {
	    var groupSize = 0;
	    var groupBase = 1;
	    while (groupBase < (1 << BN.wordSize) / base) {
	      groupBase *= base;
	      groupSize += 1;
	    }
	    groupSizes[base] = groupSize;
	    groupBases[base] = groupBase;
	  }

	  */

	  var zeros = [
	    '',
	    '0',
	    '00',
	    '000',
	    '0000',
	    '00000',
	    '000000',
	    '0000000',
	    '00000000',
	    '000000000',
	    '0000000000',
	    '00000000000',
	    '000000000000',
	    '0000000000000',
	    '00000000000000',
	    '000000000000000',
	    '0000000000000000',
	    '00000000000000000',
	    '000000000000000000',
	    '0000000000000000000',
	    '00000000000000000000',
	    '000000000000000000000',
	    '0000000000000000000000',
	    '00000000000000000000000',
	    '000000000000000000000000',
	    '0000000000000000000000000'
	  ];

	  var groupSizes = [
	    0, 0,
	    25, 16, 12, 11, 10, 9, 8,
	    8, 7, 7, 7, 7, 6, 6,
	    6, 6, 6, 6, 6, 5, 5,
	    5, 5, 5, 5, 5, 5, 5,
	    5, 5, 5, 5, 5, 5, 5
	  ];

	  var groupBases = [
	    0, 0,
	    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
	    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
	    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
	    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
	    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
	  ];

	  BN.prototype.toString = function toString (base, padding) {
	    base = base || 10;
	    padding = padding | 0 || 1;

	    var out;
	    if (base === 16 || base === 'hex') {
	      out = '';
	      var off = 0;
	      var carry = 0;
	      for (var i = 0; i < this.length; i++) {
	        var w = this.words[i];
	        var word = (((w << off) | carry) & 0xffffff).toString(16);
	        carry = (w >>> (24 - off)) & 0xffffff;
	        if (carry !== 0 || i !== this.length - 1) {
	          out = zeros[6 - word.length] + word + out;
	        } else {
	          out = word + out;
	        }
	        off += 2;
	        if (off >= 26) {
	          off -= 26;
	          i--;
	        }
	      }
	      if (carry !== 0) {
	        out = carry.toString(16) + out;
	      }
	      while (out.length % padding !== 0) {
	        out = '0' + out;
	      }
	      if (this.negative !== 0) {
	        out = '-' + out;
	      }
	      return out;
	    }

	    if (base === (base | 0) && base >= 2 && base <= 36) {
	      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
	      var groupSize = groupSizes[base];
	      // var groupBase = Math.pow(base, groupSize);
	      var groupBase = groupBases[base];
	      out = '';
	      var c = this.clone();
	      c.negative = 0;
	      while (!c.isZero()) {
	        var r = c.modn(groupBase).toString(base);
	        c = c.idivn(groupBase);

	        if (!c.isZero()) {
	          out = zeros[groupSize - r.length] + r + out;
	        } else {
	          out = r + out;
	        }
	      }
	      if (this.isZero()) {
	        out = '0' + out;
	      }
	      while (out.length % padding !== 0) {
	        out = '0' + out;
	      }
	      if (this.negative !== 0) {
	        out = '-' + out;
	      }
	      return out;
	    }

	    assert(false, 'Base should be between 2 and 36');
	  };

	  BN.prototype.toNumber = function toNumber () {
	    var ret = this.words[0];
	    if (this.length === 2) {
	      ret += this.words[1] * 0x4000000;
	    } else if (this.length === 3 && this.words[2] === 0x01) {
	      // NOTE: at this stage it is known that the top bit is set
	      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
	    } else if (this.length > 2) {
	      assert(false, 'Number can only safely store up to 53 bits');
	    }
	    return (this.negative !== 0) ? -ret : ret;
	  };

	  BN.prototype.toJSON = function toJSON () {
	    return this.toString(16);
	  };

	  BN.prototype.toBuffer = function toBuffer (endian, length) {
	    assert(typeof Buffer !== 'undefined');
	    return this.toArrayLike(Buffer, endian, length);
	  };

	  BN.prototype.toArray = function toArray (endian, length) {
	    return this.toArrayLike(Array, endian, length);
	  };

	  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
	    var byteLength = this.byteLength();
	    var reqLength = length || Math.max(1, byteLength);
	    assert(byteLength <= reqLength, 'byte array longer than desired length');
	    assert(reqLength > 0, 'Requested array length <= 0');

	    this.strip();
	    var littleEndian = endian === 'le';
	    var res = new ArrayType(reqLength);

	    var b, i;
	    var q = this.clone();
	    if (!littleEndian) {
	      // Assume big-endian
	      for (i = 0; i < reqLength - byteLength; i++) {
	        res[i] = 0;
	      }

	      for (i = 0; !q.isZero(); i++) {
	        b = q.andln(0xff);
	        q.iushrn(8);

	        res[reqLength - i - 1] = b;
	      }
	    } else {
	      for (i = 0; !q.isZero(); i++) {
	        b = q.andln(0xff);
	        q.iushrn(8);

	        res[i] = b;
	      }

	      for (; i < reqLength; i++) {
	        res[i] = 0;
	      }
	    }

	    return res;
	  };

	  if (Math.clz32) {
	    BN.prototype._countBits = function _countBits (w) {
	      return 32 - Math.clz32(w);
	    };
	  } else {
	    BN.prototype._countBits = function _countBits (w) {
	      var t = w;
	      var r = 0;
	      if (t >= 0x1000) {
	        r += 13;
	        t >>>= 13;
	      }
	      if (t >= 0x40) {
	        r += 7;
	        t >>>= 7;
	      }
	      if (t >= 0x8) {
	        r += 4;
	        t >>>= 4;
	      }
	      if (t >= 0x02) {
	        r += 2;
	        t >>>= 2;
	      }
	      return r + t;
	    };
	  }

	  BN.prototype._zeroBits = function _zeroBits (w) {
	    // Short-cut
	    if (w === 0) return 26;

	    var t = w;
	    var r = 0;
	    if ((t & 0x1fff) === 0) {
	      r += 13;
	      t >>>= 13;
	    }
	    if ((t & 0x7f) === 0) {
	      r += 7;
	      t >>>= 7;
	    }
	    if ((t & 0xf) === 0) {
	      r += 4;
	      t >>>= 4;
	    }
	    if ((t & 0x3) === 0) {
	      r += 2;
	      t >>>= 2;
	    }
	    if ((t & 0x1) === 0) {
	      r++;
	    }
	    return r;
	  };

	  // Return number of used bits in a BN
	  BN.prototype.bitLength = function bitLength () {
	    var w = this.words[this.length - 1];
	    var hi = this._countBits(w);
	    return (this.length - 1) * 26 + hi;
	  };

	  function toBitArray (num) {
	    var w = new Array(num.bitLength());

	    for (var bit = 0; bit < w.length; bit++) {
	      var off = (bit / 26) | 0;
	      var wbit = bit % 26;

	      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
	    }

	    return w;
	  }

	  // Number of trailing zero bits
	  BN.prototype.zeroBits = function zeroBits () {
	    if (this.isZero()) return 0;

	    var r = 0;
	    for (var i = 0; i < this.length; i++) {
	      var b = this._zeroBits(this.words[i]);
	      r += b;
	      if (b !== 26) break;
	    }
	    return r;
	  };

	  BN.prototype.byteLength = function byteLength () {
	    return Math.ceil(this.bitLength() / 8);
	  };

	  BN.prototype.toTwos = function toTwos (width) {
	    if (this.negative !== 0) {
	      return this.abs().inotn(width).iaddn(1);
	    }
	    return this.clone();
	  };

	  BN.prototype.fromTwos = function fromTwos (width) {
	    if (this.testn(width - 1)) {
	      return this.notn(width).iaddn(1).ineg();
	    }
	    return this.clone();
	  };

	  BN.prototype.isNeg = function isNeg () {
	    return this.negative !== 0;
	  };

	  // Return negative clone of `this`
	  BN.prototype.neg = function neg () {
	    return this.clone().ineg();
	  };

	  BN.prototype.ineg = function ineg () {
	    if (!this.isZero()) {
	      this.negative ^= 1;
	    }

	    return this;
	  };

	  // Or `num` with `this` in-place
	  BN.prototype.iuor = function iuor (num) {
	    while (this.length < num.length) {
	      this.words[this.length++] = 0;
	    }

	    for (var i = 0; i < num.length; i++) {
	      this.words[i] = this.words[i] | num.words[i];
	    }

	    return this.strip();
	  };

	  BN.prototype.ior = function ior (num) {
	    assert((this.negative | num.negative) === 0);
	    return this.iuor(num);
	  };

	  // Or `num` with `this`
	  BN.prototype.or = function or (num) {
	    if (this.length > num.length) return this.clone().ior(num);
	    return num.clone().ior(this);
	  };

	  BN.prototype.uor = function uor (num) {
	    if (this.length > num.length) return this.clone().iuor(num);
	    return num.clone().iuor(this);
	  };

	  // And `num` with `this` in-place
	  BN.prototype.iuand = function iuand (num) {
	    // b = min-length(num, this)
	    var b;
	    if (this.length > num.length) {
	      b = num;
	    } else {
	      b = this;
	    }

	    for (var i = 0; i < b.length; i++) {
	      this.words[i] = this.words[i] & num.words[i];
	    }

	    this.length = b.length;

	    return this.strip();
	  };

	  BN.prototype.iand = function iand (num) {
	    assert((this.negative | num.negative) === 0);
	    return this.iuand(num);
	  };

	  // And `num` with `this`
	  BN.prototype.and = function and (num) {
	    if (this.length > num.length) return this.clone().iand(num);
	    return num.clone().iand(this);
	  };

	  BN.prototype.uand = function uand (num) {
	    if (this.length > num.length) return this.clone().iuand(num);
	    return num.clone().iuand(this);
	  };

	  // Xor `num` with `this` in-place
	  BN.prototype.iuxor = function iuxor (num) {
	    // a.length > b.length
	    var a;
	    var b;
	    if (this.length > num.length) {
	      a = this;
	      b = num;
	    } else {
	      a = num;
	      b = this;
	    }

	    for (var i = 0; i < b.length; i++) {
	      this.words[i] = a.words[i] ^ b.words[i];
	    }

	    if (this !== a) {
	      for (; i < a.length; i++) {
	        this.words[i] = a.words[i];
	      }
	    }

	    this.length = a.length;

	    return this.strip();
	  };

	  BN.prototype.ixor = function ixor (num) {
	    assert((this.negative | num.negative) === 0);
	    return this.iuxor(num);
	  };

	  // Xor `num` with `this`
	  BN.prototype.xor = function xor (num) {
	    if (this.length > num.length) return this.clone().ixor(num);
	    return num.clone().ixor(this);
	  };

	  BN.prototype.uxor = function uxor (num) {
	    if (this.length > num.length) return this.clone().iuxor(num);
	    return num.clone().iuxor(this);
	  };

	  // Not ``this`` with ``width`` bitwidth
	  BN.prototype.inotn = function inotn (width) {
	    assert(typeof width === 'number' && width >= 0);

	    var bytesNeeded = Math.ceil(width / 26) | 0;
	    var bitsLeft = width % 26;

	    // Extend the buffer with leading zeroes
	    this._expand(bytesNeeded);

	    if (bitsLeft > 0) {
	      bytesNeeded--;
	    }

	    // Handle complete words
	    for (var i = 0; i < bytesNeeded; i++) {
	      this.words[i] = ~this.words[i] & 0x3ffffff;
	    }

	    // Handle the residue
	    if (bitsLeft > 0) {
	      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
	    }

	    // And remove leading zeroes
	    return this.strip();
	  };

	  BN.prototype.notn = function notn (width) {
	    return this.clone().inotn(width);
	  };

	  // Set `bit` of `this`
	  BN.prototype.setn = function setn (bit, val) {
	    assert(typeof bit === 'number' && bit >= 0);

	    var off = (bit / 26) | 0;
	    var wbit = bit % 26;

	    this._expand(off + 1);

	    if (val) {
	      this.words[off] = this.words[off] | (1 << wbit);
	    } else {
	      this.words[off] = this.words[off] & ~(1 << wbit);
	    }

	    return this.strip();
	  };

	  // Add `num` to `this` in-place
	  BN.prototype.iadd = function iadd (num) {
	    var r;

	    // negative + positive
	    if (this.negative !== 0 && num.negative === 0) {
	      this.negative = 0;
	      r = this.isub(num);
	      this.negative ^= 1;
	      return this._normSign();

	    // positive + negative
	    } else if (this.negative === 0 && num.negative !== 0) {
	      num.negative = 0;
	      r = this.isub(num);
	      num.negative = 1;
	      return r._normSign();
	    }

	    // a.length > b.length
	    var a, b;
	    if (this.length > num.length) {
	      a = this;
	      b = num;
	    } else {
	      a = num;
	      b = this;
	    }

	    var carry = 0;
	    for (var i = 0; i < b.length; i++) {
	      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
	      this.words[i] = r & 0x3ffffff;
	      carry = r >>> 26;
	    }
	    for (; carry !== 0 && i < a.length; i++) {
	      r = (a.words[i] | 0) + carry;
	      this.words[i] = r & 0x3ffffff;
	      carry = r >>> 26;
	    }

	    this.length = a.length;
	    if (carry !== 0) {
	      this.words[this.length] = carry;
	      this.length++;
	    // Copy the rest of the words
	    } else if (a !== this) {
	      for (; i < a.length; i++) {
	        this.words[i] = a.words[i];
	      }
	    }

	    return this;
	  };

	  // Add `num` to `this`
	  BN.prototype.add = function add (num) {
	    var res;
	    if (num.negative !== 0 && this.negative === 0) {
	      num.negative = 0;
	      res = this.sub(num);
	      num.negative ^= 1;
	      return res;
	    } else if (num.negative === 0 && this.negative !== 0) {
	      this.negative = 0;
	      res = num.sub(this);
	      this.negative = 1;
	      return res;
	    }

	    if (this.length > num.length) return this.clone().iadd(num);

	    return num.clone().iadd(this);
	  };

	  // Subtract `num` from `this` in-place
	  BN.prototype.isub = function isub (num) {
	    // this - (-num) = this + num
	    if (num.negative !== 0) {
	      num.negative = 0;
	      var r = this.iadd(num);
	      num.negative = 1;
	      return r._normSign();

	    // -this - num = -(this + num)
	    } else if (this.negative !== 0) {
	      this.negative = 0;
	      this.iadd(num);
	      this.negative = 1;
	      return this._normSign();
	    }

	    // At this point both numbers are positive
	    var cmp = this.cmp(num);

	    // Optimization - zeroify
	    if (cmp === 0) {
	      this.negative = 0;
	      this.length = 1;
	      this.words[0] = 0;
	      return this;
	    }

	    // a > b
	    var a, b;
	    if (cmp > 0) {
	      a = this;
	      b = num;
	    } else {
	      a = num;
	      b = this;
	    }

	    var carry = 0;
	    for (var i = 0; i < b.length; i++) {
	      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
	      carry = r >> 26;
	      this.words[i] = r & 0x3ffffff;
	    }
	    for (; carry !== 0 && i < a.length; i++) {
	      r = (a.words[i] | 0) + carry;
	      carry = r >> 26;
	      this.words[i] = r & 0x3ffffff;
	    }

	    // Copy rest of the words
	    if (carry === 0 && i < a.length && a !== this) {
	      for (; i < a.length; i++) {
	        this.words[i] = a.words[i];
	      }
	    }

	    this.length = Math.max(this.length, i);

	    if (a !== this) {
	      this.negative = 1;
	    }

	    return this.strip();
	  };

	  // Subtract `num` from `this`
	  BN.prototype.sub = function sub (num) {
	    return this.clone().isub(num);
	  };

	  function smallMulTo (self, num, out) {
	    out.negative = num.negative ^ self.negative;
	    var len = (self.length + num.length) | 0;
	    out.length = len;
	    len = (len - 1) | 0;

	    // Peel one iteration (compiler can't do it, because of code complexity)
	    var a = self.words[0] | 0;
	    var b = num.words[0] | 0;
	    var r = a * b;

	    var lo = r & 0x3ffffff;
	    var carry = (r / 0x4000000) | 0;
	    out.words[0] = lo;

	    for (var k = 1; k < len; k++) {
	      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
	      // note that ncarry could be >= 0x3ffffff
	      var ncarry = carry >>> 26;
	      var rword = carry & 0x3ffffff;
	      var maxJ = Math.min(k, num.length - 1);
	      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
	        var i = (k - j) | 0;
	        a = self.words[i] | 0;
	        b = num.words[j] | 0;
	        r = a * b + rword;
	        ncarry += (r / 0x4000000) | 0;
	        rword = r & 0x3ffffff;
	      }
	      out.words[k] = rword | 0;
	      carry = ncarry | 0;
	    }
	    if (carry !== 0) {
	      out.words[k] = carry | 0;
	    } else {
	      out.length--;
	    }

	    return out.strip();
	  }

	  // TODO(indutny): it may be reasonable to omit it for users who don't need
	  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
	  // multiplication (like elliptic secp256k1).
	  var comb10MulTo = function comb10MulTo (self, num, out) {
	    var a = self.words;
	    var b = num.words;
	    var o = out.words;
	    var c = 0;
	    var lo;
	    var mid;
	    var hi;
	    var a0 = a[0] | 0;
	    var al0 = a0 & 0x1fff;
	    var ah0 = a0 >>> 13;
	    var a1 = a[1] | 0;
	    var al1 = a1 & 0x1fff;
	    var ah1 = a1 >>> 13;
	    var a2 = a[2] | 0;
	    var al2 = a2 & 0x1fff;
	    var ah2 = a2 >>> 13;
	    var a3 = a[3] | 0;
	    var al3 = a3 & 0x1fff;
	    var ah3 = a3 >>> 13;
	    var a4 = a[4] | 0;
	    var al4 = a4 & 0x1fff;
	    var ah4 = a4 >>> 13;
	    var a5 = a[5] | 0;
	    var al5 = a5 & 0x1fff;
	    var ah5 = a5 >>> 13;
	    var a6 = a[6] | 0;
	    var al6 = a6 & 0x1fff;
	    var ah6 = a6 >>> 13;
	    var a7 = a[7] | 0;
	    var al7 = a7 & 0x1fff;
	    var ah7 = a7 >>> 13;
	    var a8 = a[8] | 0;
	    var al8 = a8 & 0x1fff;
	    var ah8 = a8 >>> 13;
	    var a9 = a[9] | 0;
	    var al9 = a9 & 0x1fff;
	    var ah9 = a9 >>> 13;
	    var b0 = b[0] | 0;
	    var bl0 = b0 & 0x1fff;
	    var bh0 = b0 >>> 13;
	    var b1 = b[1] | 0;
	    var bl1 = b1 & 0x1fff;
	    var bh1 = b1 >>> 13;
	    var b2 = b[2] | 0;
	    var bl2 = b2 & 0x1fff;
	    var bh2 = b2 >>> 13;
	    var b3 = b[3] | 0;
	    var bl3 = b3 & 0x1fff;
	    var bh3 = b3 >>> 13;
	    var b4 = b[4] | 0;
	    var bl4 = b4 & 0x1fff;
	    var bh4 = b4 >>> 13;
	    var b5 = b[5] | 0;
	    var bl5 = b5 & 0x1fff;
	    var bh5 = b5 >>> 13;
	    var b6 = b[6] | 0;
	    var bl6 = b6 & 0x1fff;
	    var bh6 = b6 >>> 13;
	    var b7 = b[7] | 0;
	    var bl7 = b7 & 0x1fff;
	    var bh7 = b7 >>> 13;
	    var b8 = b[8] | 0;
	    var bl8 = b8 & 0x1fff;
	    var bh8 = b8 >>> 13;
	    var b9 = b[9] | 0;
	    var bl9 = b9 & 0x1fff;
	    var bh9 = b9 >>> 13;

	    out.negative = self.negative ^ num.negative;
	    out.length = 19;
	    /* k = 0 */
	    lo = Math.imul(al0, bl0);
	    mid = Math.imul(al0, bh0);
	    mid = (mid + Math.imul(ah0, bl0)) | 0;
	    hi = Math.imul(ah0, bh0);
	    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
	    w0 &= 0x3ffffff;
	    /* k = 1 */
	    lo = Math.imul(al1, bl0);
	    mid = Math.imul(al1, bh0);
	    mid = (mid + Math.imul(ah1, bl0)) | 0;
	    hi = Math.imul(ah1, bh0);
	    lo = (lo + Math.imul(al0, bl1)) | 0;
	    mid = (mid + Math.imul(al0, bh1)) | 0;
	    mid = (mid + Math.imul(ah0, bl1)) | 0;
	    hi = (hi + Math.imul(ah0, bh1)) | 0;
	    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
	    w1 &= 0x3ffffff;
	    /* k = 2 */
	    lo = Math.imul(al2, bl0);
	    mid = Math.imul(al2, bh0);
	    mid = (mid + Math.imul(ah2, bl0)) | 0;
	    hi = Math.imul(ah2, bh0);
	    lo = (lo + Math.imul(al1, bl1)) | 0;
	    mid = (mid + Math.imul(al1, bh1)) | 0;
	    mid = (mid + Math.imul(ah1, bl1)) | 0;
	    hi = (hi + Math.imul(ah1, bh1)) | 0;
	    lo = (lo + Math.imul(al0, bl2)) | 0;
	    mid = (mid + Math.imul(al0, bh2)) | 0;
	    mid = (mid + Math.imul(ah0, bl2)) | 0;
	    hi = (hi + Math.imul(ah0, bh2)) | 0;
	    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
	    w2 &= 0x3ffffff;
	    /* k = 3 */
	    lo = Math.imul(al3, bl0);
	    mid = Math.imul(al3, bh0);
	    mid = (mid + Math.imul(ah3, bl0)) | 0;
	    hi = Math.imul(ah3, bh0);
	    lo = (lo + Math.imul(al2, bl1)) | 0;
	    mid = (mid + Math.imul(al2, bh1)) | 0;
	    mid = (mid + Math.imul(ah2, bl1)) | 0;
	    hi = (hi + Math.imul(ah2, bh1)) | 0;
	    lo = (lo + Math.imul(al1, bl2)) | 0;
	    mid = (mid + Math.imul(al1, bh2)) | 0;
	    mid = (mid + Math.imul(ah1, bl2)) | 0;
	    hi = (hi + Math.imul(ah1, bh2)) | 0;
	    lo = (lo + Math.imul(al0, bl3)) | 0;
	    mid = (mid + Math.imul(al0, bh3)) | 0;
	    mid = (mid + Math.imul(ah0, bl3)) | 0;
	    hi = (hi + Math.imul(ah0, bh3)) | 0;
	    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
	    w3 &= 0x3ffffff;
	    /* k = 4 */
	    lo = Math.imul(al4, bl0);
	    mid = Math.imul(al4, bh0);
	    mid = (mid + Math.imul(ah4, bl0)) | 0;
	    hi = Math.imul(ah4, bh0);
	    lo = (lo + Math.imul(al3, bl1)) | 0;
	    mid = (mid + Math.imul(al3, bh1)) | 0;
	    mid = (mid + Math.imul(ah3, bl1)) | 0;
	    hi = (hi + Math.imul(ah3, bh1)) | 0;
	    lo = (lo + Math.imul(al2, bl2)) | 0;
	    mid = (mid + Math.imul(al2, bh2)) | 0;
	    mid = (mid + Math.imul(ah2, bl2)) | 0;
	    hi = (hi + Math.imul(ah2, bh2)) | 0;
	    lo = (lo + Math.imul(al1, bl3)) | 0;
	    mid = (mid + Math.imul(al1, bh3)) | 0;
	    mid = (mid + Math.imul(ah1, bl3)) | 0;
	    hi = (hi + Math.imul(ah1, bh3)) | 0;
	    lo = (lo + Math.imul(al0, bl4)) | 0;
	    mid = (mid + Math.imul(al0, bh4)) | 0;
	    mid = (mid + Math.imul(ah0, bl4)) | 0;
	    hi = (hi + Math.imul(ah0, bh4)) | 0;
	    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
	    w4 &= 0x3ffffff;
	    /* k = 5 */
	    lo = Math.imul(al5, bl0);
	    mid = Math.imul(al5, bh0);
	    mid = (mid + Math.imul(ah5, bl0)) | 0;
	    hi = Math.imul(ah5, bh0);
	    lo = (lo + Math.imul(al4, bl1)) | 0;
	    mid = (mid + Math.imul(al4, bh1)) | 0;
	    mid = (mid + Math.imul(ah4, bl1)) | 0;
	    hi = (hi + Math.imul(ah4, bh1)) | 0;
	    lo = (lo + Math.imul(al3, bl2)) | 0;
	    mid = (mid + Math.imul(al3, bh2)) | 0;
	    mid = (mid + Math.imul(ah3, bl2)) | 0;
	    hi = (hi + Math.imul(ah3, bh2)) | 0;
	    lo = (lo + Math.imul(al2, bl3)) | 0;
	    mid = (mid + Math.imul(al2, bh3)) | 0;
	    mid = (mid + Math.imul(ah2, bl3)) | 0;
	    hi = (hi + Math.imul(ah2, bh3)) | 0;
	    lo = (lo + Math.imul(al1, bl4)) | 0;
	    mid = (mid + Math.imul(al1, bh4)) | 0;
	    mid = (mid + Math.imul(ah1, bl4)) | 0;
	    hi = (hi + Math.imul(ah1, bh4)) | 0;
	    lo = (lo + Math.imul(al0, bl5)) | 0;
	    mid = (mid + Math.imul(al0, bh5)) | 0;
	    mid = (mid + Math.imul(ah0, bl5)) | 0;
	    hi = (hi + Math.imul(ah0, bh5)) | 0;
	    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
	    w5 &= 0x3ffffff;
	    /* k = 6 */
	    lo = Math.imul(al6, bl0);
	    mid = Math.imul(al6, bh0);
	    mid = (mid + Math.imul(ah6, bl0)) | 0;
	    hi = Math.imul(ah6, bh0);
	    lo = (lo + Math.imul(al5, bl1)) | 0;
	    mid = (mid + Math.imul(al5, bh1)) | 0;
	    mid = (mid + Math.imul(ah5, bl1)) | 0;
	    hi = (hi + Math.imul(ah5, bh1)) | 0;
	    lo = (lo + Math.imul(al4, bl2)) | 0;
	    mid = (mid + Math.imul(al4, bh2)) | 0;
	    mid = (mid + Math.imul(ah4, bl2)) | 0;
	    hi = (hi + Math.imul(ah4, bh2)) | 0;
	    lo = (lo + Math.imul(al3, bl3)) | 0;
	    mid = (mid + Math.imul(al3, bh3)) | 0;
	    mid = (mid + Math.imul(ah3, bl3)) | 0;
	    hi = (hi + Math.imul(ah3, bh3)) | 0;
	    lo = (lo + Math.imul(al2, bl4)) | 0;
	    mid = (mid + Math.imul(al2, bh4)) | 0;
	    mid = (mid + Math.imul(ah2, bl4)) | 0;
	    hi = (hi + Math.imul(ah2, bh4)) | 0;
	    lo = (lo + Math.imul(al1, bl5)) | 0;
	    mid = (mid + Math.imul(al1, bh5)) | 0;
	    mid = (mid + Math.imul(ah1, bl5)) | 0;
	    hi = (hi + Math.imul(ah1, bh5)) | 0;
	    lo = (lo + Math.imul(al0, bl6)) | 0;
	    mid = (mid + Math.imul(al0, bh6)) | 0;
	    mid = (mid + Math.imul(ah0, bl6)) | 0;
	    hi = (hi + Math.imul(ah0, bh6)) | 0;
	    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
	    w6 &= 0x3ffffff;
	    /* k = 7 */
	    lo = Math.imul(al7, bl0);
	    mid = Math.imul(al7, bh0);
	    mid = (mid + Math.imul(ah7, bl0)) | 0;
	    hi = Math.imul(ah7, bh0);
	    lo = (lo + Math.imul(al6, bl1)) | 0;
	    mid = (mid + Math.imul(al6, bh1)) | 0;
	    mid = (mid + Math.imul(ah6, bl1)) | 0;
	    hi = (hi + Math.imul(ah6, bh1)) | 0;
	    lo = (lo + Math.imul(al5, bl2)) | 0;
	    mid = (mid + Math.imul(al5, bh2)) | 0;
	    mid = (mid + Math.imul(ah5, bl2)) | 0;
	    hi = (hi + Math.imul(ah5, bh2)) | 0;
	    lo = (lo + Math.imul(al4, bl3)) | 0;
	    mid = (mid + Math.imul(al4, bh3)) | 0;
	    mid = (mid + Math.imul(ah4, bl3)) | 0;
	    hi = (hi + Math.imul(ah4, bh3)) | 0;
	    lo = (lo + Math.imul(al3, bl4)) | 0;
	    mid = (mid + Math.imul(al3, bh4)) | 0;
	    mid = (mid + Math.imul(ah3, bl4)) | 0;
	    hi = (hi + Math.imul(ah3, bh4)) | 0;
	    lo = (lo + Math.imul(al2, bl5)) | 0;
	    mid = (mid + Math.imul(al2, bh5)) | 0;
	    mid = (mid + Math.imul(ah2, bl5)) | 0;
	    hi = (hi + Math.imul(ah2, bh5)) | 0;
	    lo = (lo + Math.imul(al1, bl6)) | 0;
	    mid = (mid + Math.imul(al1, bh6)) | 0;
	    mid = (mid + Math.imul(ah1, bl6)) | 0;
	    hi = (hi + Math.imul(ah1, bh6)) | 0;
	    lo = (lo + Math.imul(al0, bl7)) | 0;
	    mid = (mid + Math.imul(al0, bh7)) | 0;
	    mid = (mid + Math.imul(ah0, bl7)) | 0;
	    hi = (hi + Math.imul(ah0, bh7)) | 0;
	    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
	    w7 &= 0x3ffffff;
	    /* k = 8 */
	    lo = Math.imul(al8, bl0);
	    mid = Math.imul(al8, bh0);
	    mid = (mid + Math.imul(ah8, bl0)) | 0;
	    hi = Math.imul(ah8, bh0);
	    lo = (lo + Math.imul(al7, bl1)) | 0;
	    mid = (mid + Math.imul(al7, bh1)) | 0;
	    mid = (mid + Math.imul(ah7, bl1)) | 0;
	    hi = (hi + Math.imul(ah7, bh1)) | 0;
	    lo = (lo + Math.imul(al6, bl2)) | 0;
	    mid = (mid + Math.imul(al6, bh2)) | 0;
	    mid = (mid + Math.imul(ah6, bl2)) | 0;
	    hi = (hi + Math.imul(ah6, bh2)) | 0;
	    lo = (lo + Math.imul(al5, bl3)) | 0;
	    mid = (mid + Math.imul(al5, bh3)) | 0;
	    mid = (mid + Math.imul(ah5, bl3)) | 0;
	    hi = (hi + Math.imul(ah5, bh3)) | 0;
	    lo = (lo + Math.imul(al4, bl4)) | 0;
	    mid = (mid + Math.imul(al4, bh4)) | 0;
	    mid = (mid + Math.imul(ah4, bl4)) | 0;
	    hi = (hi + Math.imul(ah4, bh4)) | 0;
	    lo = (lo + Math.imul(al3, bl5)) | 0;
	    mid = (mid + Math.imul(al3, bh5)) | 0;
	    mid = (mid + Math.imul(ah3, bl5)) | 0;
	    hi = (hi + Math.imul(ah3, bh5)) | 0;
	    lo = (lo + Math.imul(al2, bl6)) | 0;
	    mid = (mid + Math.imul(al2, bh6)) | 0;
	    mid = (mid + Math.imul(ah2, bl6)) | 0;
	    hi = (hi + Math.imul(ah2, bh6)) | 0;
	    lo = (lo + Math.imul(al1, bl7)) | 0;
	    mid = (mid + Math.imul(al1, bh7)) | 0;
	    mid = (mid + Math.imul(ah1, bl7)) | 0;
	    hi = (hi + Math.imul(ah1, bh7)) | 0;
	    lo = (lo + Math.imul(al0, bl8)) | 0;
	    mid = (mid + Math.imul(al0, bh8)) | 0;
	    mid = (mid + Math.imul(ah0, bl8)) | 0;
	    hi = (hi + Math.imul(ah0, bh8)) | 0;
	    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
	    w8 &= 0x3ffffff;
	    /* k = 9 */
	    lo = Math.imul(al9, bl0);
	    mid = Math.imul(al9, bh0);
	    mid = (mid + Math.imul(ah9, bl0)) | 0;
	    hi = Math.imul(ah9, bh0);
	    lo = (lo + Math.imul(al8, bl1)) | 0;
	    mid = (mid + Math.imul(al8, bh1)) | 0;
	    mid = (mid + Math.imul(ah8, bl1)) | 0;
	    hi = (hi + Math.imul(ah8, bh1)) | 0;
	    lo = (lo + Math.imul(al7, bl2)) | 0;
	    mid = (mid + Math.imul(al7, bh2)) | 0;
	    mid = (mid + Math.imul(ah7, bl2)) | 0;
	    hi = (hi + Math.imul(ah7, bh2)) | 0;
	    lo = (lo + Math.imul(al6, bl3)) | 0;
	    mid = (mid + Math.imul(al6, bh3)) | 0;
	    mid = (mid + Math.imul(ah6, bl3)) | 0;
	    hi = (hi + Math.imul(ah6, bh3)) | 0;
	    lo = (lo + Math.imul(al5, bl4)) | 0;
	    mid = (mid + Math.imul(al5, bh4)) | 0;
	    mid = (mid + Math.imul(ah5, bl4)) | 0;
	    hi = (hi + Math.imul(ah5, bh4)) | 0;
	    lo = (lo + Math.imul(al4, bl5)) | 0;
	    mid = (mid + Math.imul(al4, bh5)) | 0;
	    mid = (mid + Math.imul(ah4, bl5)) | 0;
	    hi = (hi + Math.imul(ah4, bh5)) | 0;
	    lo = (lo + Math.imul(al3, bl6)) | 0;
	    mid = (mid + Math.imul(al3, bh6)) | 0;
	    mid = (mid + Math.imul(ah3, bl6)) | 0;
	    hi = (hi + Math.imul(ah3, bh6)) | 0;
	    lo = (lo + Math.imul(al2, bl7)) | 0;
	    mid = (mid + Math.imul(al2, bh7)) | 0;
	    mid = (mid + Math.imul(ah2, bl7)) | 0;
	    hi = (hi + Math.imul(ah2, bh7)) | 0;
	    lo = (lo + Math.imul(al1, bl8)) | 0;
	    mid = (mid + Math.imul(al1, bh8)) | 0;
	    mid = (mid + Math.imul(ah1, bl8)) | 0;
	    hi = (hi + Math.imul(ah1, bh8)) | 0;
	    lo = (lo + Math.imul(al0, bl9)) | 0;
	    mid = (mid + Math.imul(al0, bh9)) | 0;
	    mid = (mid + Math.imul(ah0, bl9)) | 0;
	    hi = (hi + Math.imul(ah0, bh9)) | 0;
	    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
	    w9 &= 0x3ffffff;
	    /* k = 10 */
	    lo = Math.imul(al9, bl1);
	    mid = Math.imul(al9, bh1);
	    mid = (mid + Math.imul(ah9, bl1)) | 0;
	    hi = Math.imul(ah9, bh1);
	    lo = (lo + Math.imul(al8, bl2)) | 0;
	    mid = (mid + Math.imul(al8, bh2)) | 0;
	    mid = (mid + Math.imul(ah8, bl2)) | 0;
	    hi = (hi + Math.imul(ah8, bh2)) | 0;
	    lo = (lo + Math.imul(al7, bl3)) | 0;
	    mid = (mid + Math.imul(al7, bh3)) | 0;
	    mid = (mid + Math.imul(ah7, bl3)) | 0;
	    hi = (hi + Math.imul(ah7, bh3)) | 0;
	    lo = (lo + Math.imul(al6, bl4)) | 0;
	    mid = (mid + Math.imul(al6, bh4)) | 0;
	    mid = (mid + Math.imul(ah6, bl4)) | 0;
	    hi = (hi + Math.imul(ah6, bh4)) | 0;
	    lo = (lo + Math.imul(al5, bl5)) | 0;
	    mid = (mid + Math.imul(al5, bh5)) | 0;
	    mid = (mid + Math.imul(ah5, bl5)) | 0;
	    hi = (hi + Math.imul(ah5, bh5)) | 0;
	    lo = (lo + Math.imul(al4, bl6)) | 0;
	    mid = (mid + Math.imul(al4, bh6)) | 0;
	    mid = (mid + Math.imul(ah4, bl6)) | 0;
	    hi = (hi + Math.imul(ah4, bh6)) | 0;
	    lo = (lo + Math.imul(al3, bl7)) | 0;
	    mid = (mid + Math.imul(al3, bh7)) | 0;
	    mid = (mid + Math.imul(ah3, bl7)) | 0;
	    hi = (hi + Math.imul(ah3, bh7)) | 0;
	    lo = (lo + Math.imul(al2, bl8)) | 0;
	    mid = (mid + Math.imul(al2, bh8)) | 0;
	    mid = (mid + Math.imul(ah2, bl8)) | 0;
	    hi = (hi + Math.imul(ah2, bh8)) | 0;
	    lo = (lo + Math.imul(al1, bl9)) | 0;
	    mid = (mid + Math.imul(al1, bh9)) | 0;
	    mid = (mid + Math.imul(ah1, bl9)) | 0;
	    hi = (hi + Math.imul(ah1, bh9)) | 0;
	    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
	    w10 &= 0x3ffffff;
	    /* k = 11 */
	    lo = Math.imul(al9, bl2);
	    mid = Math.imul(al9, bh2);
	    mid = (mid + Math.imul(ah9, bl2)) | 0;
	    hi = Math.imul(ah9, bh2);
	    lo = (lo + Math.imul(al8, bl3)) | 0;
	    mid = (mid + Math.imul(al8, bh3)) | 0;
	    mid = (mid + Math.imul(ah8, bl3)) | 0;
	    hi = (hi + Math.imul(ah8, bh3)) | 0;
	    lo = (lo + Math.imul(al7, bl4)) | 0;
	    mid = (mid + Math.imul(al7, bh4)) | 0;
	    mid = (mid + Math.imul(ah7, bl4)) | 0;
	    hi = (hi + Math.imul(ah7, bh4)) | 0;
	    lo = (lo + Math.imul(al6, bl5)) | 0;
	    mid = (mid + Math.imul(al6, bh5)) | 0;
	    mid = (mid + Math.imul(ah6, bl5)) | 0;
	    hi = (hi + Math.imul(ah6, bh5)) | 0;
	    lo = (lo + Math.imul(al5, bl6)) | 0;
	    mid = (mid + Math.imul(al5, bh6)) | 0;
	    mid = (mid + Math.imul(ah5, bl6)) | 0;
	    hi = (hi + Math.imul(ah5, bh6)) | 0;
	    lo = (lo + Math.imul(al4, bl7)) | 0;
	    mid = (mid + Math.imul(al4, bh7)) | 0;
	    mid = (mid + Math.imul(ah4, bl7)) | 0;
	    hi = (hi + Math.imul(ah4, bh7)) | 0;
	    lo = (lo + Math.imul(al3, bl8)) | 0;
	    mid = (mid + Math.imul(al3, bh8)) | 0;
	    mid = (mid + Math.imul(ah3, bl8)) | 0;
	    hi = (hi + Math.imul(ah3, bh8)) | 0;
	    lo = (lo + Math.imul(al2, bl9)) | 0;
	    mid = (mid + Math.imul(al2, bh9)) | 0;
	    mid = (mid + Math.imul(ah2, bl9)) | 0;
	    hi = (hi + Math.imul(ah2, bh9)) | 0;
	    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
	    w11 &= 0x3ffffff;
	    /* k = 12 */
	    lo = Math.imul(al9, bl3);
	    mid = Math.imul(al9, bh3);
	    mid = (mid + Math.imul(ah9, bl3)) | 0;
	    hi = Math.imul(ah9, bh3);
	    lo = (lo + Math.imul(al8, bl4)) | 0;
	    mid = (mid + Math.imul(al8, bh4)) | 0;
	    mid = (mid + Math.imul(ah8, bl4)) | 0;
	    hi = (hi + Math.imul(ah8, bh4)) | 0;
	    lo = (lo + Math.imul(al7, bl5)) | 0;
	    mid = (mid + Math.imul(al7, bh5)) | 0;
	    mid = (mid + Math.imul(ah7, bl5)) | 0;
	    hi = (hi + Math.imul(ah7, bh5)) | 0;
	    lo = (lo + Math.imul(al6, bl6)) | 0;
	    mid = (mid + Math.imul(al6, bh6)) | 0;
	    mid = (mid + Math.imul(ah6, bl6)) | 0;
	    hi = (hi + Math.imul(ah6, bh6)) | 0;
	    lo = (lo + Math.imul(al5, bl7)) | 0;
	    mid = (mid + Math.imul(al5, bh7)) | 0;
	    mid = (mid + Math.imul(ah5, bl7)) | 0;
	    hi = (hi + Math.imul(ah5, bh7)) | 0;
	    lo = (lo + Math.imul(al4, bl8)) | 0;
	    mid = (mid + Math.imul(al4, bh8)) | 0;
	    mid = (mid + Math.imul(ah4, bl8)) | 0;
	    hi = (hi + Math.imul(ah4, bh8)) | 0;
	    lo = (lo + Math.imul(al3, bl9)) | 0;
	    mid = (mid + Math.imul(al3, bh9)) | 0;
	    mid = (mid + Math.imul(ah3, bl9)) | 0;
	    hi = (hi + Math.imul(ah3, bh9)) | 0;
	    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
	    w12 &= 0x3ffffff;
	    /* k = 13 */
	    lo = Math.imul(al9, bl4);
	    mid = Math.imul(al9, bh4);
	    mid = (mid + Math.imul(ah9, bl4)) | 0;
	    hi = Math.imul(ah9, bh4);
	    lo = (lo + Math.imul(al8, bl5)) | 0;
	    mid = (mid + Math.imul(al8, bh5)) | 0;
	    mid = (mid + Math.imul(ah8, bl5)) | 0;
	    hi = (hi + Math.imul(ah8, bh5)) | 0;
	    lo = (lo + Math.imul(al7, bl6)) | 0;
	    mid = (mid + Math.imul(al7, bh6)) | 0;
	    mid = (mid + Math.imul(ah7, bl6)) | 0;
	    hi = (hi + Math.imul(ah7, bh6)) | 0;
	    lo = (lo + Math.imul(al6, bl7)) | 0;
	    mid = (mid + Math.imul(al6, bh7)) | 0;
	    mid = (mid + Math.imul(ah6, bl7)) | 0;
	    hi = (hi + Math.imul(ah6, bh7)) | 0;
	    lo = (lo + Math.imul(al5, bl8)) | 0;
	    mid = (mid + Math.imul(al5, bh8)) | 0;
	    mid = (mid + Math.imul(ah5, bl8)) | 0;
	    hi = (hi + Math.imul(ah5, bh8)) | 0;
	    lo = (lo + Math.imul(al4, bl9)) | 0;
	    mid = (mid + Math.imul(al4, bh9)) | 0;
	    mid = (mid + Math.imul(ah4, bl9)) | 0;
	    hi = (hi + Math.imul(ah4, bh9)) | 0;
	    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
	    w13 &= 0x3ffffff;
	    /* k = 14 */
	    lo = Math.imul(al9, bl5);
	    mid = Math.imul(al9, bh5);
	    mid = (mid + Math.imul(ah9, bl5)) | 0;
	    hi = Math.imul(ah9, bh5);
	    lo = (lo + Math.imul(al8, bl6)) | 0;
	    mid = (mid + Math.imul(al8, bh6)) | 0;
	    mid = (mid + Math.imul(ah8, bl6)) | 0;
	    hi = (hi + Math.imul(ah8, bh6)) | 0;
	    lo = (lo + Math.imul(al7, bl7)) | 0;
	    mid = (mid + Math.imul(al7, bh7)) | 0;
	    mid = (mid + Math.imul(ah7, bl7)) | 0;
	    hi = (hi + Math.imul(ah7, bh7)) | 0;
	    lo = (lo + Math.imul(al6, bl8)) | 0;
	    mid = (mid + Math.imul(al6, bh8)) | 0;
	    mid = (mid + Math.imul(ah6, bl8)) | 0;
	    hi = (hi + Math.imul(ah6, bh8)) | 0;
	    lo = (lo + Math.imul(al5, bl9)) | 0;
	    mid = (mid + Math.imul(al5, bh9)) | 0;
	    mid = (mid + Math.imul(ah5, bl9)) | 0;
	    hi = (hi + Math.imul(ah5, bh9)) | 0;
	    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
	    w14 &= 0x3ffffff;
	    /* k = 15 */
	    lo = Math.imul(al9, bl6);
	    mid = Math.imul(al9, bh6);
	    mid = (mid + Math.imul(ah9, bl6)) | 0;
	    hi = Math.imul(ah9, bh6);
	    lo = (lo + Math.imul(al8, bl7)) | 0;
	    mid = (mid + Math.imul(al8, bh7)) | 0;
	    mid = (mid + Math.imul(ah8, bl7)) | 0;
	    hi = (hi + Math.imul(ah8, bh7)) | 0;
	    lo = (lo + Math.imul(al7, bl8)) | 0;
	    mid = (mid + Math.imul(al7, bh8)) | 0;
	    mid = (mid + Math.imul(ah7, bl8)) | 0;
	    hi = (hi + Math.imul(ah7, bh8)) | 0;
	    lo = (lo + Math.imul(al6, bl9)) | 0;
	    mid = (mid + Math.imul(al6, bh9)) | 0;
	    mid = (mid + Math.imul(ah6, bl9)) | 0;
	    hi = (hi + Math.imul(ah6, bh9)) | 0;
	    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
	    w15 &= 0x3ffffff;
	    /* k = 16 */
	    lo = Math.imul(al9, bl7);
	    mid = Math.imul(al9, bh7);
	    mid = (mid + Math.imul(ah9, bl7)) | 0;
	    hi = Math.imul(ah9, bh7);
	    lo = (lo + Math.imul(al8, bl8)) | 0;
	    mid = (mid + Math.imul(al8, bh8)) | 0;
	    mid = (mid + Math.imul(ah8, bl8)) | 0;
	    hi = (hi + Math.imul(ah8, bh8)) | 0;
	    lo = (lo + Math.imul(al7, bl9)) | 0;
	    mid = (mid + Math.imul(al7, bh9)) | 0;
	    mid = (mid + Math.imul(ah7, bl9)) | 0;
	    hi = (hi + Math.imul(ah7, bh9)) | 0;
	    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
	    w16 &= 0x3ffffff;
	    /* k = 17 */
	    lo = Math.imul(al9, bl8);
	    mid = Math.imul(al9, bh8);
	    mid = (mid + Math.imul(ah9, bl8)) | 0;
	    hi = Math.imul(ah9, bh8);
	    lo = (lo + Math.imul(al8, bl9)) | 0;
	    mid = (mid + Math.imul(al8, bh9)) | 0;
	    mid = (mid + Math.imul(ah8, bl9)) | 0;
	    hi = (hi + Math.imul(ah8, bh9)) | 0;
	    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
	    w17 &= 0x3ffffff;
	    /* k = 18 */
	    lo = Math.imul(al9, bl9);
	    mid = Math.imul(al9, bh9);
	    mid = (mid + Math.imul(ah9, bl9)) | 0;
	    hi = Math.imul(ah9, bh9);
	    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
	    w18 &= 0x3ffffff;
	    o[0] = w0;
	    o[1] = w1;
	    o[2] = w2;
	    o[3] = w3;
	    o[4] = w4;
	    o[5] = w5;
	    o[6] = w6;
	    o[7] = w7;
	    o[8] = w8;
	    o[9] = w9;
	    o[10] = w10;
	    o[11] = w11;
	    o[12] = w12;
	    o[13] = w13;
	    o[14] = w14;
	    o[15] = w15;
	    o[16] = w16;
	    o[17] = w17;
	    o[18] = w18;
	    if (c !== 0) {
	      o[19] = c;
	      out.length++;
	    }
	    return out;
	  };

	  // Polyfill comb
	  if (!Math.imul) {
	    comb10MulTo = smallMulTo;
	  }

	  function bigMulTo (self, num, out) {
	    out.negative = num.negative ^ self.negative;
	    out.length = self.length + num.length;

	    var carry = 0;
	    var hncarry = 0;
	    for (var k = 0; k < out.length - 1; k++) {
	      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
	      // note that ncarry could be >= 0x3ffffff
	      var ncarry = hncarry;
	      hncarry = 0;
	      var rword = carry & 0x3ffffff;
	      var maxJ = Math.min(k, num.length - 1);
	      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
	        var i = k - j;
	        var a = self.words[i] | 0;
	        var b = num.words[j] | 0;
	        var r = a * b;

	        var lo = r & 0x3ffffff;
	        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
	        lo = (lo + rword) | 0;
	        rword = lo & 0x3ffffff;
	        ncarry = (ncarry + (lo >>> 26)) | 0;

	        hncarry += ncarry >>> 26;
	        ncarry &= 0x3ffffff;
	      }
	      out.words[k] = rword;
	      carry = ncarry;
	      ncarry = hncarry;
	    }
	    if (carry !== 0) {
	      out.words[k] = carry;
	    } else {
	      out.length--;
	    }

	    return out.strip();
	  }

	  function jumboMulTo (self, num, out) {
	    var fftm = new FFTM();
	    return fftm.mulp(self, num, out);
	  }

	  BN.prototype.mulTo = function mulTo (num, out) {
	    var res;
	    var len = this.length + num.length;
	    if (this.length === 10 && num.length === 10) {
	      res = comb10MulTo(this, num, out);
	    } else if (len < 63) {
	      res = smallMulTo(this, num, out);
	    } else if (len < 1024) {
	      res = bigMulTo(this, num, out);
	    } else {
	      res = jumboMulTo(this, num, out);
	    }

	    return res;
	  };

	  // Cooley-Tukey algorithm for FFT
	  // slightly revisited to rely on looping instead of recursion

	  function FFTM (x, y) {
	    this.x = x;
	    this.y = y;
	  }

	  FFTM.prototype.makeRBT = function makeRBT (N) {
	    var t = new Array(N);
	    var l = BN.prototype._countBits(N) - 1;
	    for (var i = 0; i < N; i++) {
	      t[i] = this.revBin(i, l, N);
	    }

	    return t;
	  };

	  // Returns binary-reversed representation of `x`
	  FFTM.prototype.revBin = function revBin (x, l, N) {
	    if (x === 0 || x === N - 1) return x;

	    var rb = 0;
	    for (var i = 0; i < l; i++) {
	      rb |= (x & 1) << (l - i - 1);
	      x >>= 1;
	    }

	    return rb;
	  };

	  // Performs "tweedling" phase, therefore 'emulating'
	  // behaviour of the recursive algorithm
	  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
	    for (var i = 0; i < N; i++) {
	      rtws[i] = rws[rbt[i]];
	      itws[i] = iws[rbt[i]];
	    }
	  };

	  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
	    this.permute(rbt, rws, iws, rtws, itws, N);

	    for (var s = 1; s < N; s <<= 1) {
	      var l = s << 1;

	      var rtwdf = Math.cos(2 * Math.PI / l);
	      var itwdf = Math.sin(2 * Math.PI / l);

	      for (var p = 0; p < N; p += l) {
	        var rtwdf_ = rtwdf;
	        var itwdf_ = itwdf;

	        for (var j = 0; j < s; j++) {
	          var re = rtws[p + j];
	          var ie = itws[p + j];

	          var ro = rtws[p + j + s];
	          var io = itws[p + j + s];

	          var rx = rtwdf_ * ro - itwdf_ * io;

	          io = rtwdf_ * io + itwdf_ * ro;
	          ro = rx;

	          rtws[p + j] = re + ro;
	          itws[p + j] = ie + io;

	          rtws[p + j + s] = re - ro;
	          itws[p + j + s] = ie - io;

	          /* jshint maxdepth : false */
	          if (j !== l) {
	            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

	            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
	            rtwdf_ = rx;
	          }
	        }
	      }
	    }
	  };

	  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
	    var N = Math.max(m, n) | 1;
	    var odd = N & 1;
	    var i = 0;
	    for (N = N / 2 | 0; N; N = N >>> 1) {
	      i++;
	    }

	    return 1 << i + 1 + odd;
	  };

	  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
	    if (N <= 1) return;

	    for (var i = 0; i < N / 2; i++) {
	      var t = rws[i];

	      rws[i] = rws[N - i - 1];
	      rws[N - i - 1] = t;

	      t = iws[i];

	      iws[i] = -iws[N - i - 1];
	      iws[N - i - 1] = -t;
	    }
	  };

	  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
	    var carry = 0;
	    for (var i = 0; i < N / 2; i++) {
	      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
	        Math.round(ws[2 * i] / N) +
	        carry;

	      ws[i] = w & 0x3ffffff;

	      if (w < 0x4000000) {
	        carry = 0;
	      } else {
	        carry = w / 0x4000000 | 0;
	      }
	    }

	    return ws;
	  };

	  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
	    var carry = 0;
	    for (var i = 0; i < len; i++) {
	      carry = carry + (ws[i] | 0);

	      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
	      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
	    }

	    // Pad with zeroes
	    for (i = 2 * len; i < N; ++i) {
	      rws[i] = 0;
	    }

	    assert(carry === 0);
	    assert((carry & ~0x1fff) === 0);
	  };

	  FFTM.prototype.stub = function stub (N) {
	    var ph = new Array(N);
	    for (var i = 0; i < N; i++) {
	      ph[i] = 0;
	    }

	    return ph;
	  };

	  FFTM.prototype.mulp = function mulp (x, y, out) {
	    var N = 2 * this.guessLen13b(x.length, y.length);

	    var rbt = this.makeRBT(N);

	    var _ = this.stub(N);

	    var rws = new Array(N);
	    var rwst = new Array(N);
	    var iwst = new Array(N);

	    var nrws = new Array(N);
	    var nrwst = new Array(N);
	    var niwst = new Array(N);

	    var rmws = out.words;
	    rmws.length = N;

	    this.convert13b(x.words, x.length, rws, N);
	    this.convert13b(y.words, y.length, nrws, N);

	    this.transform(rws, _, rwst, iwst, N, rbt);
	    this.transform(nrws, _, nrwst, niwst, N, rbt);

	    for (var i = 0; i < N; i++) {
	      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
	      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
	      rwst[i] = rx;
	    }

	    this.conjugate(rwst, iwst, N);
	    this.transform(rwst, iwst, rmws, _, N, rbt);
	    this.conjugate(rmws, _, N);
	    this.normalize13b(rmws, N);

	    out.negative = x.negative ^ y.negative;
	    out.length = x.length + y.length;
	    return out.strip();
	  };

	  // Multiply `this` by `num`
	  BN.prototype.mul = function mul (num) {
	    var out = new BN(null);
	    out.words = new Array(this.length + num.length);
	    return this.mulTo(num, out);
	  };

	  // Multiply employing FFT
	  BN.prototype.mulf = function mulf (num) {
	    var out = new BN(null);
	    out.words = new Array(this.length + num.length);
	    return jumboMulTo(this, num, out);
	  };

	  // In-place Multiplication
	  BN.prototype.imul = function imul (num) {
	    return this.clone().mulTo(num, this);
	  };

	  BN.prototype.imuln = function imuln (num) {
	    assert(typeof num === 'number');
	    assert(num < 0x4000000);

	    // Carry
	    var carry = 0;
	    for (var i = 0; i < this.length; i++) {
	      var w = (this.words[i] | 0) * num;
	      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
	      carry >>= 26;
	      carry += (w / 0x4000000) | 0;
	      // NOTE: lo is 27bit maximum
	      carry += lo >>> 26;
	      this.words[i] = lo & 0x3ffffff;
	    }

	    if (carry !== 0) {
	      this.words[i] = carry;
	      this.length++;
	    }

	    return this;
	  };

	  BN.prototype.muln = function muln (num) {
	    return this.clone().imuln(num);
	  };

	  // `this` * `this`
	  BN.prototype.sqr = function sqr () {
	    return this.mul(this);
	  };

	  // `this` * `this` in-place
	  BN.prototype.isqr = function isqr () {
	    return this.imul(this.clone());
	  };

	  // Math.pow(`this`, `num`)
	  BN.prototype.pow = function pow (num) {
	    var w = toBitArray(num);
	    if (w.length === 0) return new BN(1);

	    // Skip leading zeroes
	    var res = this;
	    for (var i = 0; i < w.length; i++, res = res.sqr()) {
	      if (w[i] !== 0) break;
	    }

	    if (++i < w.length) {
	      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
	        if (w[i] === 0) continue;

	        res = res.mul(q);
	      }
	    }

	    return res;
	  };

	  // Shift-left in-place
	  BN.prototype.iushln = function iushln (bits) {
	    assert(typeof bits === 'number' && bits >= 0);
	    var r = bits % 26;
	    var s = (bits - r) / 26;
	    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
	    var i;

	    if (r !== 0) {
	      var carry = 0;

	      for (i = 0; i < this.length; i++) {
	        var newCarry = this.words[i] & carryMask;
	        var c = ((this.words[i] | 0) - newCarry) << r;
	        this.words[i] = c | carry;
	        carry = newCarry >>> (26 - r);
	      }

	      if (carry) {
	        this.words[i] = carry;
	        this.length++;
	      }
	    }

	    if (s !== 0) {
	      for (i = this.length - 1; i >= 0; i--) {
	        this.words[i + s] = this.words[i];
	      }

	      for (i = 0; i < s; i++) {
	        this.words[i] = 0;
	      }

	      this.length += s;
	    }

	    return this.strip();
	  };

	  BN.prototype.ishln = function ishln (bits) {
	    // TODO(indutny): implement me
	    assert(this.negative === 0);
	    return this.iushln(bits);
	  };

	  // Shift-right in-place
	  // NOTE: `hint` is a lowest bit before trailing zeroes
	  // NOTE: if `extended` is present - it will be filled with destroyed bits
	  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
	    assert(typeof bits === 'number' && bits >= 0);
	    var h;
	    if (hint) {
	      h = (hint - (hint % 26)) / 26;
	    } else {
	      h = 0;
	    }

	    var r = bits % 26;
	    var s = Math.min((bits - r) / 26, this.length);
	    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
	    var maskedWords = extended;

	    h -= s;
	    h = Math.max(0, h);

	    // Extended mode, copy masked part
	    if (maskedWords) {
	      for (var i = 0; i < s; i++) {
	        maskedWords.words[i] = this.words[i];
	      }
	      maskedWords.length = s;
	    }

	    if (s === 0) {
	      // No-op, we should not move anything at all
	    } else if (this.length > s) {
	      this.length -= s;
	      for (i = 0; i < this.length; i++) {
	        this.words[i] = this.words[i + s];
	      }
	    } else {
	      this.words[0] = 0;
	      this.length = 1;
	    }

	    var carry = 0;
	    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
	      var word = this.words[i] | 0;
	      this.words[i] = (carry << (26 - r)) | (word >>> r);
	      carry = word & mask;
	    }

	    // Push carried bits as a mask
	    if (maskedWords && carry !== 0) {
	      maskedWords.words[maskedWords.length++] = carry;
	    }

	    if (this.length === 0) {
	      this.words[0] = 0;
	      this.length = 1;
	    }

	    return this.strip();
	  };

	  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
	    // TODO(indutny): implement me
	    assert(this.negative === 0);
	    return this.iushrn(bits, hint, extended);
	  };

	  // Shift-left
	  BN.prototype.shln = function shln (bits) {
	    return this.clone().ishln(bits);
	  };

	  BN.prototype.ushln = function ushln (bits) {
	    return this.clone().iushln(bits);
	  };

	  // Shift-right
	  BN.prototype.shrn = function shrn (bits) {
	    return this.clone().ishrn(bits);
	  };

	  BN.prototype.ushrn = function ushrn (bits) {
	    return this.clone().iushrn(bits);
	  };

	  // Test if n bit is set
	  BN.prototype.testn = function testn (bit) {
	    assert(typeof bit === 'number' && bit >= 0);
	    var r = bit % 26;
	    var s = (bit - r) / 26;
	    var q = 1 << r;

	    // Fast case: bit is much higher than all existing words
	    if (this.length <= s) return false;

	    // Check bit and return
	    var w = this.words[s];

	    return !!(w & q);
	  };

	  // Return only lowers bits of number (in-place)
	  BN.prototype.imaskn = function imaskn (bits) {
	    assert(typeof bits === 'number' && bits >= 0);
	    var r = bits % 26;
	    var s = (bits - r) / 26;

	    assert(this.negative === 0, 'imaskn works only with positive numbers');

	    if (this.length <= s) {
	      return this;
	    }

	    if (r !== 0) {
	      s++;
	    }
	    this.length = Math.min(s, this.length);

	    if (r !== 0) {
	      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
	      this.words[this.length - 1] &= mask;
	    }

	    return this.strip();
	  };

	  // Return only lowers bits of number
	  BN.prototype.maskn = function maskn (bits) {
	    return this.clone().imaskn(bits);
	  };

	  // Add plain number `num` to `this`
	  BN.prototype.iaddn = function iaddn (num) {
	    assert(typeof num === 'number');
	    assert(num < 0x4000000);
	    if (num < 0) return this.isubn(-num);

	    // Possible sign change
	    if (this.negative !== 0) {
	      if (this.length === 1 && (this.words[0] | 0) < num) {
	        this.words[0] = num - (this.words[0] | 0);
	        this.negative = 0;
	        return this;
	      }

	      this.negative = 0;
	      this.isubn(num);
	      this.negative = 1;
	      return this;
	    }

	    // Add without checks
	    return this._iaddn(num);
	  };

	  BN.prototype._iaddn = function _iaddn (num) {
	    this.words[0] += num;

	    // Carry
	    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
	      this.words[i] -= 0x4000000;
	      if (i === this.length - 1) {
	        this.words[i + 1] = 1;
	      } else {
	        this.words[i + 1]++;
	      }
	    }
	    this.length = Math.max(this.length, i + 1);

	    return this;
	  };

	  // Subtract plain number `num` from `this`
	  BN.prototype.isubn = function isubn (num) {
	    assert(typeof num === 'number');
	    assert(num < 0x4000000);
	    if (num < 0) return this.iaddn(-num);

	    if (this.negative !== 0) {
	      this.negative = 0;
	      this.iaddn(num);
	      this.negative = 1;
	      return this;
	    }

	    this.words[0] -= num;

	    if (this.length === 1 && this.words[0] < 0) {
	      this.words[0] = -this.words[0];
	      this.negative = 1;
	    } else {
	      // Carry
	      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
	        this.words[i] += 0x4000000;
	        this.words[i + 1] -= 1;
	      }
	    }

	    return this.strip();
	  };

	  BN.prototype.addn = function addn (num) {
	    return this.clone().iaddn(num);
	  };

	  BN.prototype.subn = function subn (num) {
	    return this.clone().isubn(num);
	  };

	  BN.prototype.iabs = function iabs () {
	    this.negative = 0;

	    return this;
	  };

	  BN.prototype.abs = function abs () {
	    return this.clone().iabs();
	  };

	  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
	    var len = num.length + shift;
	    var i;

	    this._expand(len);

	    var w;
	    var carry = 0;
	    for (i = 0; i < num.length; i++) {
	      w = (this.words[i + shift] | 0) + carry;
	      var right = (num.words[i] | 0) * mul;
	      w -= right & 0x3ffffff;
	      carry = (w >> 26) - ((right / 0x4000000) | 0);
	      this.words[i + shift] = w & 0x3ffffff;
	    }
	    for (; i < this.length - shift; i++) {
	      w = (this.words[i + shift] | 0) + carry;
	      carry = w >> 26;
	      this.words[i + shift] = w & 0x3ffffff;
	    }

	    if (carry === 0) return this.strip();

	    // Subtraction overflow
	    assert(carry === -1);
	    carry = 0;
	    for (i = 0; i < this.length; i++) {
	      w = -(this.words[i] | 0) + carry;
	      carry = w >> 26;
	      this.words[i] = w & 0x3ffffff;
	    }
	    this.negative = 1;

	    return this.strip();
	  };

	  BN.prototype._wordDiv = function _wordDiv (num, mode) {
	    var shift = this.length - num.length;

	    var a = this.clone();
	    var b = num;

	    // Normalize
	    var bhi = b.words[b.length - 1] | 0;
	    var bhiBits = this._countBits(bhi);
	    shift = 26 - bhiBits;
	    if (shift !== 0) {
	      b = b.ushln(shift);
	      a.iushln(shift);
	      bhi = b.words[b.length - 1] | 0;
	    }

	    // Initialize quotient
	    var m = a.length - b.length;
	    var q;

	    if (mode !== 'mod') {
	      q = new BN(null);
	      q.length = m + 1;
	      q.words = new Array(q.length);
	      for (var i = 0; i < q.length; i++) {
	        q.words[i] = 0;
	      }
	    }

	    var diff = a.clone()._ishlnsubmul(b, 1, m);
	    if (diff.negative === 0) {
	      a = diff;
	      if (q) {
	        q.words[m] = 1;
	      }
	    }

	    for (var j = m - 1; j >= 0; j--) {
	      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
	        (a.words[b.length + j - 1] | 0);

	      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
	      // (0x7ffffff)
	      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

	      a._ishlnsubmul(b, qj, j);
	      while (a.negative !== 0) {
	        qj--;
	        a.negative = 0;
	        a._ishlnsubmul(b, 1, j);
	        if (!a.isZero()) {
	          a.negative ^= 1;
	        }
	      }
	      if (q) {
	        q.words[j] = qj;
	      }
	    }
	    if (q) {
	      q.strip();
	    }
	    a.strip();

	    // Denormalize
	    if (mode !== 'div' && shift !== 0) {
	      a.iushrn(shift);
	    }

	    return {
	      div: q || null,
	      mod: a
	    };
	  };

	  // NOTE: 1) `mode` can be set to `mod` to request mod only,
	  //       to `div` to request div only, or be absent to
	  //       request both div & mod
	  //       2) `positive` is true if unsigned mod is requested
	  BN.prototype.divmod = function divmod (num, mode, positive) {
	    assert(!num.isZero());

	    if (this.isZero()) {
	      return {
	        div: new BN(0),
	        mod: new BN(0)
	      };
	    }

	    var div, mod, res;
	    if (this.negative !== 0 && num.negative === 0) {
	      res = this.neg().divmod(num, mode);

	      if (mode !== 'mod') {
	        div = res.div.neg();
	      }

	      if (mode !== 'div') {
	        mod = res.mod.neg();
	        if (positive && mod.negative !== 0) {
	          mod.iadd(num);
	        }
	      }

	      return {
	        div: div,
	        mod: mod
	      };
	    }

	    if (this.negative === 0 && num.negative !== 0) {
	      res = this.divmod(num.neg(), mode);

	      if (mode !== 'mod') {
	        div = res.div.neg();
	      }

	      return {
	        div: div,
	        mod: res.mod
	      };
	    }

	    if ((this.negative & num.negative) !== 0) {
	      res = this.neg().divmod(num.neg(), mode);

	      if (mode !== 'div') {
	        mod = res.mod.neg();
	        if (positive && mod.negative !== 0) {
	          mod.isub(num);
	        }
	      }

	      return {
	        div: res.div,
	        mod: mod
	      };
	    }

	    // Both numbers are positive at this point

	    // Strip both numbers to approximate shift value
	    if (num.length > this.length || this.cmp(num) < 0) {
	      return {
	        div: new BN(0),
	        mod: this
	      };
	    }

	    // Very short reduction
	    if (num.length === 1) {
	      if (mode === 'div') {
	        return {
	          div: this.divn(num.words[0]),
	          mod: null
	        };
	      }

	      if (mode === 'mod') {
	        return {
	          div: null,
	          mod: new BN(this.modn(num.words[0]))
	        };
	      }

	      return {
	        div: this.divn(num.words[0]),
	        mod: new BN(this.modn(num.words[0]))
	      };
	    }

	    return this._wordDiv(num, mode);
	  };

	  // Find `this` / `num`
	  BN.prototype.div = function div (num) {
	    return this.divmod(num, 'div', false).div;
	  };

	  // Find `this` % `num`
	  BN.prototype.mod = function mod (num) {
	    return this.divmod(num, 'mod', false).mod;
	  };

	  BN.prototype.umod = function umod (num) {
	    return this.divmod(num, 'mod', true).mod;
	  };

	  // Find Round(`this` / `num`)
	  BN.prototype.divRound = function divRound (num) {
	    var dm = this.divmod(num);

	    // Fast case - exact division
	    if (dm.mod.isZero()) return dm.div;

	    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

	    var half = num.ushrn(1);
	    var r2 = num.andln(1);
	    var cmp = mod.cmp(half);

	    // Round down
	    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

	    // Round up
	    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
	  };

	  BN.prototype.modn = function modn (num) {
	    assert(num <= 0x3ffffff);
	    var p = (1 << 26) % num;

	    var acc = 0;
	    for (var i = this.length - 1; i >= 0; i--) {
	      acc = (p * acc + (this.words[i] | 0)) % num;
	    }

	    return acc;
	  };

	  // In-place division by number
	  BN.prototype.idivn = function idivn (num) {
	    assert(num <= 0x3ffffff);

	    var carry = 0;
	    for (var i = this.length - 1; i >= 0; i--) {
	      var w = (this.words[i] | 0) + carry * 0x4000000;
	      this.words[i] = (w / num) | 0;
	      carry = w % num;
	    }

	    return this.strip();
	  };

	  BN.prototype.divn = function divn (num) {
	    return this.clone().idivn(num);
	  };

	  BN.prototype.egcd = function egcd (p) {
	    assert(p.negative === 0);
	    assert(!p.isZero());

	    var x = this;
	    var y = p.clone();

	    if (x.negative !== 0) {
	      x = x.umod(p);
	    } else {
	      x = x.clone();
	    }

	    // A * x + B * y = x
	    var A = new BN(1);
	    var B = new BN(0);

	    // C * x + D * y = y
	    var C = new BN(0);
	    var D = new BN(1);

	    var g = 0;

	    while (x.isEven() && y.isEven()) {
	      x.iushrn(1);
	      y.iushrn(1);
	      ++g;
	    }

	    var yp = y.clone();
	    var xp = x.clone();

	    while (!x.isZero()) {
	      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
	      if (i > 0) {
	        x.iushrn(i);
	        while (i-- > 0) {
	          if (A.isOdd() || B.isOdd()) {
	            A.iadd(yp);
	            B.isub(xp);
	          }

	          A.iushrn(1);
	          B.iushrn(1);
	        }
	      }

	      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
	      if (j > 0) {
	        y.iushrn(j);
	        while (j-- > 0) {
	          if (C.isOdd() || D.isOdd()) {
	            C.iadd(yp);
	            D.isub(xp);
	          }

	          C.iushrn(1);
	          D.iushrn(1);
	        }
	      }

	      if (x.cmp(y) >= 0) {
	        x.isub(y);
	        A.isub(C);
	        B.isub(D);
	      } else {
	        y.isub(x);
	        C.isub(A);
	        D.isub(B);
	      }
	    }

	    return {
	      a: C,
	      b: D,
	      gcd: y.iushln(g)
	    };
	  };

	  // This is reduced incarnation of the binary EEA
	  // above, designated to invert members of the
	  // _prime_ fields F(p) at a maximal speed
	  BN.prototype._invmp = function _invmp (p) {
	    assert(p.negative === 0);
	    assert(!p.isZero());

	    var a = this;
	    var b = p.clone();

	    if (a.negative !== 0) {
	      a = a.umod(p);
	    } else {
	      a = a.clone();
	    }

	    var x1 = new BN(1);
	    var x2 = new BN(0);

	    var delta = b.clone();

	    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
	      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
	      if (i > 0) {
	        a.iushrn(i);
	        while (i-- > 0) {
	          if (x1.isOdd()) {
	            x1.iadd(delta);
	          }

	          x1.iushrn(1);
	        }
	      }

	      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
	      if (j > 0) {
	        b.iushrn(j);
	        while (j-- > 0) {
	          if (x2.isOdd()) {
	            x2.iadd(delta);
	          }

	          x2.iushrn(1);
	        }
	      }

	      if (a.cmp(b) >= 0) {
	        a.isub(b);
	        x1.isub(x2);
	      } else {
	        b.isub(a);
	        x2.isub(x1);
	      }
	    }

	    var res;
	    if (a.cmpn(1) === 0) {
	      res = x1;
	    } else {
	      res = x2;
	    }

	    if (res.cmpn(0) < 0) {
	      res.iadd(p);
	    }

	    return res;
	  };

	  BN.prototype.gcd = function gcd (num) {
	    if (this.isZero()) return num.abs();
	    if (num.isZero()) return this.abs();

	    var a = this.clone();
	    var b = num.clone();
	    a.negative = 0;
	    b.negative = 0;

	    // Remove common factor of two
	    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
	      a.iushrn(1);
	      b.iushrn(1);
	    }

	    do {
	      while (a.isEven()) {
	        a.iushrn(1);
	      }
	      while (b.isEven()) {
	        b.iushrn(1);
	      }

	      var r = a.cmp(b);
	      if (r < 0) {
	        // Swap `a` and `b` to make `a` always bigger than `b`
	        var t = a;
	        a = b;
	        b = t;
	      } else if (r === 0 || b.cmpn(1) === 0) {
	        break;
	      }

	      a.isub(b);
	    } while (true);

	    return b.iushln(shift);
	  };

	  // Invert number in the field F(num)
	  BN.prototype.invm = function invm (num) {
	    return this.egcd(num).a.umod(num);
	  };

	  BN.prototype.isEven = function isEven () {
	    return (this.words[0] & 1) === 0;
	  };

	  BN.prototype.isOdd = function isOdd () {
	    return (this.words[0] & 1) === 1;
	  };

	  // And first word and num
	  BN.prototype.andln = function andln (num) {
	    return this.words[0] & num;
	  };

	  // Increment at the bit position in-line
	  BN.prototype.bincn = function bincn (bit) {
	    assert(typeof bit === 'number');
	    var r = bit % 26;
	    var s = (bit - r) / 26;
	    var q = 1 << r;

	    // Fast case: bit is much higher than all existing words
	    if (this.length <= s) {
	      this._expand(s + 1);
	      this.words[s] |= q;
	      return this;
	    }

	    // Add bit and propagate, if needed
	    var carry = q;
	    for (var i = s; carry !== 0 && i < this.length; i++) {
	      var w = this.words[i] | 0;
	      w += carry;
	      carry = w >>> 26;
	      w &= 0x3ffffff;
	      this.words[i] = w;
	    }
	    if (carry !== 0) {
	      this.words[i] = carry;
	      this.length++;
	    }
	    return this;
	  };

	  BN.prototype.isZero = function isZero () {
	    return this.length === 1 && this.words[0] === 0;
	  };

	  BN.prototype.cmpn = function cmpn (num) {
	    var negative = num < 0;

	    if (this.negative !== 0 && !negative) return -1;
	    if (this.negative === 0 && negative) return 1;

	    this.strip();

	    var res;
	    if (this.length > 1) {
	      res = 1;
	    } else {
	      if (negative) {
	        num = -num;
	      }

	      assert(num <= 0x3ffffff, 'Number is too big');

	      var w = this.words[0] | 0;
	      res = w === num ? 0 : w < num ? -1 : 1;
	    }
	    if (this.negative !== 0) return -res | 0;
	    return res;
	  };

	  // Compare two numbers and return:
	  // 1 - if `this` > `num`
	  // 0 - if `this` == `num`
	  // -1 - if `this` < `num`
	  BN.prototype.cmp = function cmp (num) {
	    if (this.negative !== 0 && num.negative === 0) return -1;
	    if (this.negative === 0 && num.negative !== 0) return 1;

	    var res = this.ucmp(num);
	    if (this.negative !== 0) return -res | 0;
	    return res;
	  };

	  // Unsigned comparison
	  BN.prototype.ucmp = function ucmp (num) {
	    // At this point both numbers have the same sign
	    if (this.length > num.length) return 1;
	    if (this.length < num.length) return -1;

	    var res = 0;
	    for (var i = this.length - 1; i >= 0; i--) {
	      var a = this.words[i] | 0;
	      var b = num.words[i] | 0;

	      if (a === b) continue;
	      if (a < b) {
	        res = -1;
	      } else if (a > b) {
	        res = 1;
	      }
	      break;
	    }
	    return res;
	  };

	  BN.prototype.gtn = function gtn (num) {
	    return this.cmpn(num) === 1;
	  };

	  BN.prototype.gt = function gt (num) {
	    return this.cmp(num) === 1;
	  };

	  BN.prototype.gten = function gten (num) {
	    return this.cmpn(num) >= 0;
	  };

	  BN.prototype.gte = function gte (num) {
	    return this.cmp(num) >= 0;
	  };

	  BN.prototype.ltn = function ltn (num) {
	    return this.cmpn(num) === -1;
	  };

	  BN.prototype.lt = function lt (num) {
	    return this.cmp(num) === -1;
	  };

	  BN.prototype.lten = function lten (num) {
	    return this.cmpn(num) <= 0;
	  };

	  BN.prototype.lte = function lte (num) {
	    return this.cmp(num) <= 0;
	  };

	  BN.prototype.eqn = function eqn (num) {
	    return this.cmpn(num) === 0;
	  };

	  BN.prototype.eq = function eq (num) {
	    return this.cmp(num) === 0;
	  };

	  //
	  // A reduce context, could be using montgomery or something better, depending
	  // on the `m` itself.
	  //
	  BN.red = function red (num) {
	    return new Red(num);
	  };

	  BN.prototype.toRed = function toRed (ctx) {
	    assert(!this.red, 'Already a number in reduction context');
	    assert(this.negative === 0, 'red works only with positives');
	    return ctx.convertTo(this)._forceRed(ctx);
	  };

	  BN.prototype.fromRed = function fromRed () {
	    assert(this.red, 'fromRed works only with numbers in reduction context');
	    return this.red.convertFrom(this);
	  };

	  BN.prototype._forceRed = function _forceRed (ctx) {
	    this.red = ctx;
	    return this;
	  };

	  BN.prototype.forceRed = function forceRed (ctx) {
	    assert(!this.red, 'Already a number in reduction context');
	    return this._forceRed(ctx);
	  };

	  BN.prototype.redAdd = function redAdd (num) {
	    assert(this.red, 'redAdd works only with red numbers');
	    return this.red.add(this, num);
	  };

	  BN.prototype.redIAdd = function redIAdd (num) {
	    assert(this.red, 'redIAdd works only with red numbers');
	    return this.red.iadd(this, num);
	  };

	  BN.prototype.redSub = function redSub (num) {
	    assert(this.red, 'redSub works only with red numbers');
	    return this.red.sub(this, num);
	  };

	  BN.prototype.redISub = function redISub (num) {
	    assert(this.red, 'redISub works only with red numbers');
	    return this.red.isub(this, num);
	  };

	  BN.prototype.redShl = function redShl (num) {
	    assert(this.red, 'redShl works only with red numbers');
	    return this.red.shl(this, num);
	  };

	  BN.prototype.redMul = function redMul (num) {
	    assert(this.red, 'redMul works only with red numbers');
	    this.red._verify2(this, num);
	    return this.red.mul(this, num);
	  };

	  BN.prototype.redIMul = function redIMul (num) {
	    assert(this.red, 'redMul works only with red numbers');
	    this.red._verify2(this, num);
	    return this.red.imul(this, num);
	  };

	  BN.prototype.redSqr = function redSqr () {
	    assert(this.red, 'redSqr works only with red numbers');
	    this.red._verify1(this);
	    return this.red.sqr(this);
	  };

	  BN.prototype.redISqr = function redISqr () {
	    assert(this.red, 'redISqr works only with red numbers');
	    this.red._verify1(this);
	    return this.red.isqr(this);
	  };

	  // Square root over p
	  BN.prototype.redSqrt = function redSqrt () {
	    assert(this.red, 'redSqrt works only with red numbers');
	    this.red._verify1(this);
	    return this.red.sqrt(this);
	  };

	  BN.prototype.redInvm = function redInvm () {
	    assert(this.red, 'redInvm works only with red numbers');
	    this.red._verify1(this);
	    return this.red.invm(this);
	  };

	  // Return negative clone of `this` % `red modulo`
	  BN.prototype.redNeg = function redNeg () {
	    assert(this.red, 'redNeg works only with red numbers');
	    this.red._verify1(this);
	    return this.red.neg(this);
	  };

	  BN.prototype.redPow = function redPow (num) {
	    assert(this.red && !num.red, 'redPow(normalNum)');
	    this.red._verify1(this);
	    return this.red.pow(this, num);
	  };

	  // Prime numbers with efficient reduction
	  var primes = {
	    k256: null,
	    p224: null,
	    p192: null,
	    p25519: null
	  };

	  // Pseudo-Mersenne prime
	  function MPrime (name, p) {
	    // P = 2 ^ N - K
	    this.name = name;
	    this.p = new BN(p, 16);
	    this.n = this.p.bitLength();
	    this.k = new BN(1).iushln(this.n).isub(this.p);

	    this.tmp = this._tmp();
	  }

	  MPrime.prototype._tmp = function _tmp () {
	    var tmp = new BN(null);
	    tmp.words = new Array(Math.ceil(this.n / 13));
	    return tmp;
	  };

	  MPrime.prototype.ireduce = function ireduce (num) {
	    // Assumes that `num` is less than `P^2`
	    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
	    var r = num;
	    var rlen;

	    do {
	      this.split(r, this.tmp);
	      r = this.imulK(r);
	      r = r.iadd(this.tmp);
	      rlen = r.bitLength();
	    } while (rlen > this.n);

	    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
	    if (cmp === 0) {
	      r.words[0] = 0;
	      r.length = 1;
	    } else if (cmp > 0) {
	      r.isub(this.p);
	    } else {
	      if (r.strip !== undefined) {
	        // r is BN v4 instance
	        r.strip();
	      } else {
	        // r is BN v5 instance
	        r._strip();
	      }
	    }

	    return r;
	  };

	  MPrime.prototype.split = function split (input, out) {
	    input.iushrn(this.n, 0, out);
	  };

	  MPrime.prototype.imulK = function imulK (num) {
	    return num.imul(this.k);
	  };

	  function K256 () {
	    MPrime.call(
	      this,
	      'k256',
	      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
	  }
	  inherits(K256, MPrime);

	  K256.prototype.split = function split (input, output) {
	    // 256 = 9 * 26 + 22
	    var mask = 0x3fffff;

	    var outLen = Math.min(input.length, 9);
	    for (var i = 0; i < outLen; i++) {
	      output.words[i] = input.words[i];
	    }
	    output.length = outLen;

	    if (input.length <= 9) {
	      input.words[0] = 0;
	      input.length = 1;
	      return;
	    }

	    // Shift by 9 limbs
	    var prev = input.words[9];
	    output.words[output.length++] = prev & mask;

	    for (i = 10; i < input.length; i++) {
	      var next = input.words[i] | 0;
	      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
	      prev = next;
	    }
	    prev >>>= 22;
	    input.words[i - 10] = prev;
	    if (prev === 0 && input.length > 10) {
	      input.length -= 10;
	    } else {
	      input.length -= 9;
	    }
	  };

	  K256.prototype.imulK = function imulK (num) {
	    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
	    num.words[num.length] = 0;
	    num.words[num.length + 1] = 0;
	    num.length += 2;

	    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
	    var lo = 0;
	    for (var i = 0; i < num.length; i++) {
	      var w = num.words[i] | 0;
	      lo += w * 0x3d1;
	      num.words[i] = lo & 0x3ffffff;
	      lo = w * 0x40 + ((lo / 0x4000000) | 0);
	    }

	    // Fast length reduction
	    if (num.words[num.length - 1] === 0) {
	      num.length--;
	      if (num.words[num.length - 1] === 0) {
	        num.length--;
	      }
	    }
	    return num;
	  };

	  function P224 () {
	    MPrime.call(
	      this,
	      'p224',
	      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
	  }
	  inherits(P224, MPrime);

	  function P192 () {
	    MPrime.call(
	      this,
	      'p192',
	      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
	  }
	  inherits(P192, MPrime);

	  function P25519 () {
	    // 2 ^ 255 - 19
	    MPrime.call(
	      this,
	      '25519',
	      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
	  }
	  inherits(P25519, MPrime);

	  P25519.prototype.imulK = function imulK (num) {
	    // K = 0x13
	    var carry = 0;
	    for (var i = 0; i < num.length; i++) {
	      var hi = (num.words[i] | 0) * 0x13 + carry;
	      var lo = hi & 0x3ffffff;
	      hi >>>= 26;

	      num.words[i] = lo;
	      carry = hi;
	    }
	    if (carry !== 0) {
	      num.words[num.length++] = carry;
	    }
	    return num;
	  };

	  // Exported mostly for testing purposes, use plain name instead
	  BN._prime = function prime (name) {
	    // Cached version of prime
	    if (primes[name]) return primes[name];

	    var prime;
	    if (name === 'k256') {
	      prime = new K256();
	    } else if (name === 'p224') {
	      prime = new P224();
	    } else if (name === 'p192') {
	      prime = new P192();
	    } else if (name === 'p25519') {
	      prime = new P25519();
	    } else {
	      throw new Error('Unknown prime ' + name);
	    }
	    primes[name] = prime;

	    return prime;
	  };

	  //
	  // Base reduction engine
	  //
	  function Red (m) {
	    if (typeof m === 'string') {
	      var prime = BN._prime(m);
	      this.m = prime.p;
	      this.prime = prime;
	    } else {
	      assert(m.gtn(1), 'modulus must be greater than 1');
	      this.m = m;
	      this.prime = null;
	    }
	  }

	  Red.prototype._verify1 = function _verify1 (a) {
	    assert(a.negative === 0, 'red works only with positives');
	    assert(a.red, 'red works only with red numbers');
	  };

	  Red.prototype._verify2 = function _verify2 (a, b) {
	    assert((a.negative | b.negative) === 0, 'red works only with positives');
	    assert(a.red && a.red === b.red,
	      'red works only with red numbers');
	  };

	  Red.prototype.imod = function imod (a) {
	    if (this.prime) return this.prime.ireduce(a)._forceRed(this);
	    return a.umod(this.m)._forceRed(this);
	  };

	  Red.prototype.neg = function neg (a) {
	    if (a.isZero()) {
	      return a.clone();
	    }

	    return this.m.sub(a)._forceRed(this);
	  };

	  Red.prototype.add = function add (a, b) {
	    this._verify2(a, b);

	    var res = a.add(b);
	    if (res.cmp(this.m) >= 0) {
	      res.isub(this.m);
	    }
	    return res._forceRed(this);
	  };

	  Red.prototype.iadd = function iadd (a, b) {
	    this._verify2(a, b);

	    var res = a.iadd(b);
	    if (res.cmp(this.m) >= 0) {
	      res.isub(this.m);
	    }
	    return res;
	  };

	  Red.prototype.sub = function sub (a, b) {
	    this._verify2(a, b);

	    var res = a.sub(b);
	    if (res.cmpn(0) < 0) {
	      res.iadd(this.m);
	    }
	    return res._forceRed(this);
	  };

	  Red.prototype.isub = function isub (a, b) {
	    this._verify2(a, b);

	    var res = a.isub(b);
	    if (res.cmpn(0) < 0) {
	      res.iadd(this.m);
	    }
	    return res;
	  };

	  Red.prototype.shl = function shl (a, num) {
	    this._verify1(a);
	    return this.imod(a.ushln(num));
	  };

	  Red.prototype.imul = function imul (a, b) {
	    this._verify2(a, b);
	    return this.imod(a.imul(b));
	  };

	  Red.prototype.mul = function mul (a, b) {
	    this._verify2(a, b);
	    return this.imod(a.mul(b));
	  };

	  Red.prototype.isqr = function isqr (a) {
	    return this.imul(a, a.clone());
	  };

	  Red.prototype.sqr = function sqr (a) {
	    return this.mul(a, a);
	  };

	  Red.prototype.sqrt = function sqrt (a) {
	    if (a.isZero()) return a.clone();

	    var mod3 = this.m.andln(3);
	    assert(mod3 % 2 === 1);

	    // Fast case
	    if (mod3 === 3) {
	      var pow = this.m.add(new BN(1)).iushrn(2);
	      return this.pow(a, pow);
	    }

	    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
	    //
	    // Find Q and S, that Q * 2 ^ S = (P - 1)
	    var q = this.m.subn(1);
	    var s = 0;
	    while (!q.isZero() && q.andln(1) === 0) {
	      s++;
	      q.iushrn(1);
	    }
	    assert(!q.isZero());

	    var one = new BN(1).toRed(this);
	    var nOne = one.redNeg();

	    // Find quadratic non-residue
	    // NOTE: Max is such because of generalized Riemann hypothesis.
	    var lpow = this.m.subn(1).iushrn(1);
	    var z = this.m.bitLength();
	    z = new BN(2 * z * z).toRed(this);

	    while (this.pow(z, lpow).cmp(nOne) !== 0) {
	      z.redIAdd(nOne);
	    }

	    var c = this.pow(z, q);
	    var r = this.pow(a, q.addn(1).iushrn(1));
	    var t = this.pow(a, q);
	    var m = s;
	    while (t.cmp(one) !== 0) {
	      var tmp = t;
	      for (var i = 0; tmp.cmp(one) !== 0; i++) {
	        tmp = tmp.redSqr();
	      }
	      assert(i < m);
	      var b = this.pow(c, new BN(1).iushln(m - i - 1));

	      r = r.redMul(b);
	      c = b.redSqr();
	      t = t.redMul(c);
	      m = i;
	    }

	    return r;
	  };

	  Red.prototype.invm = function invm (a) {
	    var inv = a._invmp(this.m);
	    if (inv.negative !== 0) {
	      inv.negative = 0;
	      return this.imod(inv).redNeg();
	    } else {
	      return this.imod(inv);
	    }
	  };

	  Red.prototype.pow = function pow (a, num) {
	    if (num.isZero()) return new BN(1).toRed(this);
	    if (num.cmpn(1) === 0) return a.clone();

	    var windowSize = 4;
	    var wnd = new Array(1 << windowSize);
	    wnd[0] = new BN(1).toRed(this);
	    wnd[1] = a;
	    for (var i = 2; i < wnd.length; i++) {
	      wnd[i] = this.mul(wnd[i - 1], a);
	    }

	    var res = wnd[0];
	    var current = 0;
	    var currentLen = 0;
	    var start = num.bitLength() % 26;
	    if (start === 0) {
	      start = 26;
	    }

	    for (i = num.length - 1; i >= 0; i--) {
	      var word = num.words[i];
	      for (var j = start - 1; j >= 0; j--) {
	        var bit = (word >> j) & 1;
	        if (res !== wnd[0]) {
	          res = this.sqr(res);
	        }

	        if (bit === 0 && current === 0) {
	          currentLen = 0;
	          continue;
	        }

	        current <<= 1;
	        current |= bit;
	        currentLen++;
	        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

	        res = this.mul(res, wnd[current]);
	        currentLen = 0;
	        current = 0;
	      }
	      start = 26;
	    }

	    return res;
	  };

	  Red.prototype.convertTo = function convertTo (num) {
	    var r = num.umod(this.m);

	    return r === num ? r.clone() : r;
	  };

	  Red.prototype.convertFrom = function convertFrom (num) {
	    var res = num.clone();
	    res.red = null;
	    return res;
	  };

	  //
	  // Montgomery method engine
	  //

	  BN.mont = function mont (num) {
	    return new Mont(num);
	  };

	  function Mont (m) {
	    Red.call(this, m);

	    this.shift = this.m.bitLength();
	    if (this.shift % 26 !== 0) {
	      this.shift += 26 - (this.shift % 26);
	    }

	    this.r = new BN(1).iushln(this.shift);
	    this.r2 = this.imod(this.r.sqr());
	    this.rinv = this.r._invmp(this.m);

	    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
	    this.minv = this.minv.umod(this.r);
	    this.minv = this.r.sub(this.minv);
	  }
	  inherits(Mont, Red);

	  Mont.prototype.convertTo = function convertTo (num) {
	    return this.imod(num.ushln(this.shift));
	  };

	  Mont.prototype.convertFrom = function convertFrom (num) {
	    var r = this.imod(num.mul(this.rinv));
	    r.red = null;
	    return r;
	  };

	  Mont.prototype.imul = function imul (a, b) {
	    if (a.isZero() || b.isZero()) {
	      a.words[0] = 0;
	      a.length = 1;
	      return a;
	    }

	    var t = a.imul(b);
	    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
	    var u = t.isub(c).iushrn(this.shift);
	    var res = u;

	    if (u.cmp(this.m) >= 0) {
	      res = u.isub(this.m);
	    } else if (u.cmpn(0) < 0) {
	      res = u.iadd(this.m);
	    }

	    return res._forceRed(this);
	  };

	  Mont.prototype.mul = function mul (a, b) {
	    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

	    var t = a.mul(b);
	    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
	    var u = t.isub(c).iushrn(this.shift);
	    var res = u;
	    if (u.cmp(this.m) >= 0) {
	      res = u.isub(this.m);
	    } else if (u.cmpn(0) < 0) {
	      res = u.iadd(this.m);
	    }

	    return res._forceRed(this);
	  };

	  Mont.prototype.invm = function invm (a) {
	    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
	    var res = this.imod(a._invmp(this.m).mul(this.r2));
	    return res._forceRed(this);
	  };
	})('object' === 'undefined' || module, commonjsGlobal);
	});
	var bn_1 = bn.BN;

	var _version = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "logger/5.0.3";

	});

	var _version$1 = unwrapExports(_version);
	var _version_1 = _version.version;

	var lib = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var _permanentCensorErrors = false;
	var _censorErrors = false;
	var LogLevels = { debug: 1, "default": 2, info: 2, warning: 3, error: 4, off: 5 };
	var _logLevel = LogLevels["default"];

	var _globalLogger = null;
	function _checkNormalize() {
	    try {
	        var missing_1 = [];
	        // Make sure all forms of normalization are supported
	        ["NFD", "NFC", "NFKD", "NFKC"].forEach(function (form) {
	            try {
	                if ("test".normalize(form) !== "test") {
	                    throw new Error("bad normalize");
	                }
	                ;
	            }
	            catch (error) {
	                missing_1.push(form);
	            }
	        });
	        if (missing_1.length) {
	            throw new Error("missing " + missing_1.join(", "));
	        }
	        if (String.fromCharCode(0xe9).normalize("NFD") !== String.fromCharCode(0x65, 0x0301)) {
	            throw new Error("broken implementation");
	        }
	    }
	    catch (error) {
	        return error.message;
	    }
	    return null;
	}
	var _normalizeError = _checkNormalize();
	var LogLevel;
	(function (LogLevel) {
	    LogLevel["DEBUG"] = "DEBUG";
	    LogLevel["INFO"] = "INFO";
	    LogLevel["WARNING"] = "WARNING";
	    LogLevel["ERROR"] = "ERROR";
	    LogLevel["OFF"] = "OFF";
	})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
	var ErrorCode;
	(function (ErrorCode) {
	    ///////////////////
	    // Generic Errors
	    // Unknown Error
	    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
	    // Not Implemented
	    ErrorCode["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
	    // Unsupported Operation
	    //   - operation
	    ErrorCode["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
	    // Network Error (i.e. Ethereum Network, such as an invalid chain ID)
	    //   - event ("noNetwork" is not re-thrown in provider.ready; otherwise thrown)
	    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
	    // Some sort of bad response from the server
	    ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
	    // Timeout
	    ErrorCode["TIMEOUT"] = "TIMEOUT";
	    ///////////////////
	    // Operational  Errors
	    // Buffer Overrun
	    ErrorCode["BUFFER_OVERRUN"] = "BUFFER_OVERRUN";
	    // Numeric Fault
	    //   - operation: the operation being executed
	    //   - fault: the reason this faulted
	    ErrorCode["NUMERIC_FAULT"] = "NUMERIC_FAULT";
	    ///////////////////
	    // Argument Errors
	    // Missing new operator to an object
	    //  - name: The name of the class
	    ErrorCode["MISSING_NEW"] = "MISSING_NEW";
	    // Invalid argument (e.g. value is incompatible with type) to a function:
	    //   - argument: The argument name that was invalid
	    //   - value: The value of the argument
	    ErrorCode["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
	    // Missing argument to a function:
	    //   - count: The number of arguments received
	    //   - expectedCount: The number of arguments expected
	    ErrorCode["MISSING_ARGUMENT"] = "MISSING_ARGUMENT";
	    // Too many arguments
	    //   - count: The number of arguments received
	    //   - expectedCount: The number of arguments expected
	    ErrorCode["UNEXPECTED_ARGUMENT"] = "UNEXPECTED_ARGUMENT";
	    ///////////////////
	    // Blockchain Errors
	    // Call exception
	    //  - transaction: the transaction
	    //  - address?: the contract address
	    //  - args?: The arguments passed into the function
	    //  - method?: The Solidity method signature
	    //  - errorSignature?: The EIP848 error signature
	    //  - errorArgs?: The EIP848 error parameters
	    //  - reason: The reason (only for EIP848 "Error(string)")
	    ErrorCode["CALL_EXCEPTION"] = "CALL_EXCEPTION";
	    // Insufficien funds (< value + gasLimit * gasPrice)
	    //   - transaction: the transaction attempted
	    ErrorCode["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
	    // Nonce has already been used
	    //   - transaction: the transaction attempted
	    ErrorCode["NONCE_EXPIRED"] = "NONCE_EXPIRED";
	    // The replacement fee for the transaction is too low
	    //   - transaction: the transaction attempted
	    ErrorCode["REPLACEMENT_UNDERPRICED"] = "REPLACEMENT_UNDERPRICED";
	    // The gas limit could not be estimated
	    //   - transaction: the transaction passed to estimateGas
	    ErrorCode["UNPREDICTABLE_GAS_LIMIT"] = "UNPREDICTABLE_GAS_LIMIT";
	})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
	;
	var Logger = /** @class */ (function () {
	    function Logger(version) {
	        Object.defineProperty(this, "version", {
	            enumerable: true,
	            value: version,
	            writable: false
	        });
	    }
	    Logger.prototype._log = function (logLevel, args) {
	        var level = logLevel.toLowerCase();
	        if (LogLevels[level] == null) {
	            this.throwArgumentError("invalid log level name", "logLevel", logLevel);
	        }
	        if (_logLevel > LogLevels[level]) {
	            return;
	        }
	        console.log.apply(console, args);
	    };
	    Logger.prototype.debug = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        this._log(Logger.levels.DEBUG, args);
	    };
	    Logger.prototype.info = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        this._log(Logger.levels.INFO, args);
	    };
	    Logger.prototype.warn = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        this._log(Logger.levels.WARNING, args);
	    };
	    Logger.prototype.makeError = function (message, code, params) {
	        // Errors are being censored
	        if (_censorErrors) {
	            return this.makeError("censored error", code, {});
	        }
	        if (!code) {
	            code = Logger.errors.UNKNOWN_ERROR;
	        }
	        if (!params) {
	            params = {};
	        }
	        var messageDetails = [];
	        Object.keys(params).forEach(function (key) {
	            try {
	                messageDetails.push(key + "=" + JSON.stringify(params[key]));
	            }
	            catch (error) {
	                messageDetails.push(key + "=" + JSON.stringify(params[key].toString()));
	            }
	        });
	        messageDetails.push("code=" + code);
	        messageDetails.push("version=" + this.version);
	        var reason = message;
	        if (messageDetails.length) {
	            message += " (" + messageDetails.join(", ") + ")";
	        }
	        // @TODO: Any??
	        var error = new Error(message);
	        error.reason = reason;
	        error.code = code;
	        Object.keys(params).forEach(function (key) {
	            error[key] = params[key];
	        });
	        return error;
	    };
	    Logger.prototype.throwError = function (message, code, params) {
	        throw this.makeError(message, code, params);
	    };
	    Logger.prototype.throwArgumentError = function (message, name, value) {
	        return this.throwError(message, Logger.errors.INVALID_ARGUMENT, {
	            argument: name,
	            value: value
	        });
	    };
	    Logger.prototype.assert = function (condition, message, code, params) {
	        if (!!condition) {
	            return;
	        }
	        this.throwError(message, code, params);
	    };
	    Logger.prototype.assertArgument = function (condition, message, name, value) {
	        if (!!condition) {
	            return;
	        }
	        this.throwArgumentError(message, name, value);
	    };
	    Logger.prototype.checkNormalize = function (message) {
	        if (message == null) {
	            message = "platform missing String.prototype.normalize";
	        }
	        if (_normalizeError) {
	            this.throwError("platform missing String.prototype.normalize", Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "String.prototype.normalize", form: _normalizeError
	            });
	        }
	    };
	    Logger.prototype.checkSafeUint53 = function (value, message) {
	        if (typeof (value) !== "number") {
	            return;
	        }
	        if (message == null) {
	            message = "value not safe";
	        }
	        if (value < 0 || value >= 0x1fffffffffffff) {
	            this.throwError(message, Logger.errors.NUMERIC_FAULT, {
	                operation: "checkSafeInteger",
	                fault: "out-of-safe-range",
	                value: value
	            });
	        }
	        if (value % 1) {
	            this.throwError(message, Logger.errors.NUMERIC_FAULT, {
	                operation: "checkSafeInteger",
	                fault: "non-integer",
	                value: value
	            });
	        }
	    };
	    Logger.prototype.checkArgumentCount = function (count, expectedCount, message) {
	        if (message) {
	            message = ": " + message;
	        }
	        else {
	            message = "";
	        }
	        if (count < expectedCount) {
	            this.throwError("missing argument" + message, Logger.errors.MISSING_ARGUMENT, {
	                count: count,
	                expectedCount: expectedCount
	            });
	        }
	        if (count > expectedCount) {
	            this.throwError("too many arguments" + message, Logger.errors.UNEXPECTED_ARGUMENT, {
	                count: count,
	                expectedCount: expectedCount
	            });
	        }
	    };
	    Logger.prototype.checkNew = function (target, kind) {
	        if (target === Object || target == null) {
	            this.throwError("missing new", Logger.errors.MISSING_NEW, { name: kind.name });
	        }
	    };
	    Logger.prototype.checkAbstract = function (target, kind) {
	        if (target === kind) {
	            this.throwError("cannot instantiate abstract class " + JSON.stringify(kind.name) + " directly; use a sub-class", Logger.errors.UNSUPPORTED_OPERATION, { name: target.name, operation: "new" });
	        }
	        else if (target === Object || target == null) {
	            this.throwError("missing new", Logger.errors.MISSING_NEW, { name: kind.name });
	        }
	    };
	    Logger.globalLogger = function () {
	        if (!_globalLogger) {
	            _globalLogger = new Logger(_version.version);
	        }
	        return _globalLogger;
	    };
	    Logger.setCensorship = function (censorship, permanent) {
	        if (!censorship && permanent) {
	            this.globalLogger().throwError("cannot permanently disable censorship", Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "setCensorship"
	            });
	        }
	        if (_permanentCensorErrors) {
	            if (!censorship) {
	                return;
	            }
	            this.globalLogger().throwError("error censorship permanent", Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "setCensorship"
	            });
	        }
	        _censorErrors = !!censorship;
	        _permanentCensorErrors = !!permanent;
	    };
	    Logger.setLogLevel = function (logLevel) {
	        var level = LogLevels[logLevel];
	        if (level == null) {
	            Logger.globalLogger().warn("invalid log level - " + logLevel);
	            return;
	        }
	        _logLevel = level;
	    };
	    Logger.errors = ErrorCode;
	    Logger.levels = LogLevel;
	    return Logger;
	}());
	exports.Logger = Logger;

	});

	var index = unwrapExports(lib);
	var lib_1 = lib.LogLevel;
	var lib_2 = lib.ErrorCode;
	var lib_3 = lib.Logger;

	var _version$2 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "bytes/5.0.3";

	});

	var _version$3 = unwrapExports(_version$2);
	var _version_1$1 = _version$2.version;

	var lib$1 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });


	var logger = new lib.Logger(_version$2.version);
	///////////////////////////////
	function isHexable(value) {
	    return !!(value.toHexString);
	}
	function addSlice(array) {
	    if (array.slice) {
	        return array;
	    }
	    array.slice = function () {
	        var args = Array.prototype.slice.call(arguments);
	        return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
	    };
	    return array;
	}
	function isBytesLike(value) {
	    return ((isHexString(value) && !(value.length % 2)) || isBytes(value));
	}
	exports.isBytesLike = isBytesLike;
	function isBytes(value) {
	    if (value == null) {
	        return false;
	    }
	    if (value.constructor === Uint8Array) {
	        return true;
	    }
	    if (typeof (value) === "string") {
	        return false;
	    }
	    if (value.length == null) {
	        return false;
	    }
	    for (var i = 0; i < value.length; i++) {
	        var v = value[i];
	        if (v < 0 || v >= 256 || (v % 1)) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.isBytes = isBytes;
	function arrayify(value, options) {
	    if (!options) {
	        options = {};
	    }
	    if (typeof (value) === "number") {
	        logger.checkSafeUint53(value, "invalid arrayify value");
	        var result = [];
	        while (value) {
	            result.unshift(value & 0xff);
	            value = parseInt(String(value / 256));
	        }
	        if (result.length === 0) {
	            result.push(0);
	        }
	        return addSlice(new Uint8Array(result));
	    }
	    if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
	        value = "0x" + value;
	    }
	    if (isHexable(value)) {
	        value = value.toHexString();
	    }
	    if (isHexString(value)) {
	        var hex = value.substring(2);
	        if (hex.length % 2) {
	            if (options.hexPad === "left") {
	                hex = "0x0" + hex.substring(2);
	            }
	            else if (options.hexPad === "right") {
	                hex += "0";
	            }
	            else {
	                logger.throwArgumentError("hex data is odd-length", "value", value);
	            }
	        }
	        var result = [];
	        for (var i = 0; i < hex.length; i += 2) {
	            result.push(parseInt(hex.substring(i, i + 2), 16));
	        }
	        return addSlice(new Uint8Array(result));
	    }
	    if (isBytes(value)) {
	        return addSlice(new Uint8Array(value));
	    }
	    return logger.throwArgumentError("invalid arrayify value", "value", value);
	}
	exports.arrayify = arrayify;
	function concat(items) {
	    var objects = items.map(function (item) { return arrayify(item); });
	    var length = objects.reduce(function (accum, item) { return (accum + item.length); }, 0);
	    var result = new Uint8Array(length);
	    objects.reduce(function (offset, object) {
	        result.set(object, offset);
	        return offset + object.length;
	    }, 0);
	    return addSlice(result);
	}
	exports.concat = concat;
	function stripZeros(value) {
	    var result = arrayify(value);
	    if (result.length === 0) {
	        return result;
	    }
	    // Find the first non-zero entry
	    var start = 0;
	    while (start < result.length && result[start] === 0) {
	        start++;
	    }
	    // If we started with zeros, strip them
	    if (start) {
	        result = result.slice(start);
	    }
	    return result;
	}
	exports.stripZeros = stripZeros;
	function zeroPad(value, length) {
	    value = arrayify(value);
	    if (value.length > length) {
	        logger.throwArgumentError("value out of range", "value", arguments[0]);
	    }
	    var result = new Uint8Array(length);
	    result.set(value, length - value.length);
	    return addSlice(result);
	}
	exports.zeroPad = zeroPad;
	function isHexString(value, length) {
	    if (typeof (value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
	        return false;
	    }
	    if (length && value.length !== 2 + 2 * length) {
	        return false;
	    }
	    return true;
	}
	exports.isHexString = isHexString;
	var HexCharacters = "0123456789abcdef";
	function hexlify(value, options) {
	    if (!options) {
	        options = {};
	    }
	    if (typeof (value) === "number") {
	        logger.checkSafeUint53(value, "invalid hexlify value");
	        var hex = "";
	        while (value) {
	            hex = HexCharacters[value & 0x0f] + hex;
	            value = Math.floor(value / 16);
	        }
	        if (hex.length) {
	            if (hex.length % 2) {
	                hex = "0" + hex;
	            }
	            return "0x" + hex;
	        }
	        return "0x00";
	    }
	    if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
	        value = "0x" + value;
	    }
	    if (isHexable(value)) {
	        return value.toHexString();
	    }
	    if (isHexString(value)) {
	        if (value.length % 2) {
	            if (options.hexPad === "left") {
	                value = "0x0" + value.substring(2);
	            }
	            else if (options.hexPad === "right") {
	                value += "0";
	            }
	            else {
	                logger.throwArgumentError("hex data is odd-length", "value", value);
	            }
	        }
	        return value.toLowerCase();
	    }
	    if (isBytes(value)) {
	        var result = "0x";
	        for (var i = 0; i < value.length; i++) {
	            var v = value[i];
	            result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
	        }
	        return result;
	    }
	    return logger.throwArgumentError("invalid hexlify value", "value", value);
	}
	exports.hexlify = hexlify;
	/*
	function unoddify(value: BytesLike | Hexable | number): BytesLike | Hexable | number {
	    if (typeof(value) === "string" && value.length % 2 && value.substring(0, 2) === "0x") {
	        return "0x0" + value.substring(2);
	    }
	    return value;
	}
	*/
	function hexDataLength(data) {
	    if (typeof (data) !== "string") {
	        data = hexlify(data);
	    }
	    else if (!isHexString(data) || (data.length % 2)) {
	        return null;
	    }
	    return (data.length - 2) / 2;
	}
	exports.hexDataLength = hexDataLength;
	function hexDataSlice(data, offset, endOffset) {
	    if (typeof (data) !== "string") {
	        data = hexlify(data);
	    }
	    else if (!isHexString(data) || (data.length % 2)) {
	        logger.throwArgumentError("invalid hexData", "value", data);
	    }
	    offset = 2 + 2 * offset;
	    if (endOffset != null) {
	        return "0x" + data.substring(offset, 2 + 2 * endOffset);
	    }
	    return "0x" + data.substring(offset);
	}
	exports.hexDataSlice = hexDataSlice;
	function hexConcat(items) {
	    var result = "0x";
	    items.forEach(function (item) {
	        result += hexlify(item).substring(2);
	    });
	    return result;
	}
	exports.hexConcat = hexConcat;
	function hexValue(value) {
	    var trimmed = hexStripZeros(hexlify(value, { hexPad: "left" }));
	    if (trimmed === "0x") {
	        return "0x0";
	    }
	    return trimmed;
	}
	exports.hexValue = hexValue;
	function hexStripZeros(value) {
	    if (typeof (value) !== "string") {
	        value = hexlify(value);
	    }
	    if (!isHexString(value)) {
	        logger.throwArgumentError("invalid hex string", "value", value);
	    }
	    value = value.substring(2);
	    var offset = 0;
	    while (offset < value.length && value[offset] === "0") {
	        offset++;
	    }
	    return "0x" + value.substring(offset);
	}
	exports.hexStripZeros = hexStripZeros;
	function hexZeroPad(value, length) {
	    if (typeof (value) !== "string") {
	        value = hexlify(value);
	    }
	    else if (!isHexString(value)) {
	        logger.throwArgumentError("invalid hex string", "value", value);
	    }
	    if (value.length > 2 * length + 2) {
	        logger.throwArgumentError("value out of range", "value", arguments[1]);
	    }
	    while (value.length < 2 * length + 2) {
	        value = "0x0" + value.substring(2);
	    }
	    return value;
	}
	exports.hexZeroPad = hexZeroPad;
	function splitSignature(signature) {
	    var result = {
	        r: "0x",
	        s: "0x",
	        _vs: "0x",
	        recoveryParam: 0,
	        v: 0
	    };
	    if (isBytesLike(signature)) {
	        var bytes = arrayify(signature);
	        if (bytes.length !== 65) {
	            logger.throwArgumentError("invalid signature string; must be 65 bytes", "signature", signature);
	        }
	        // Get the r, s and v
	        result.r = hexlify(bytes.slice(0, 32));
	        result.s = hexlify(bytes.slice(32, 64));
	        result.v = bytes[64];
	        // Allow a recid to be used as the v
	        if (result.v < 27) {
	            if (result.v === 0 || result.v === 1) {
	                result.v += 27;
	            }
	            else {
	                logger.throwArgumentError("signature invalid v byte", "signature", signature);
	            }
	        }
	        // Compute recoveryParam from v
	        result.recoveryParam = 1 - (result.v % 2);
	        // Compute _vs from recoveryParam and s
	        if (result.recoveryParam) {
	            bytes[32] |= 0x80;
	        }
	        result._vs = hexlify(bytes.slice(32, 64));
	    }
	    else {
	        result.r = signature.r;
	        result.s = signature.s;
	        result.v = signature.v;
	        result.recoveryParam = signature.recoveryParam;
	        result._vs = signature._vs;
	        // If the _vs is available, use it to populate missing s, v and recoveryParam
	        // and verify non-missing s, v and recoveryParam
	        if (result._vs != null) {
	            var vs_1 = zeroPad(arrayify(result._vs), 32);
	            result._vs = hexlify(vs_1);
	            // Set or check the recid
	            var recoveryParam = ((vs_1[0] >= 128) ? 1 : 0);
	            if (result.recoveryParam == null) {
	                result.recoveryParam = recoveryParam;
	            }
	            else if (result.recoveryParam !== recoveryParam) {
	                logger.throwArgumentError("signature recoveryParam mismatch _vs", "signature", signature);
	            }
	            // Set or check the s
	            vs_1[0] &= 0x7f;
	            var s = hexlify(vs_1);
	            if (result.s == null) {
	                result.s = s;
	            }
	            else if (result.s !== s) {
	                logger.throwArgumentError("signature v mismatch _vs", "signature", signature);
	            }
	        }
	        // Use recid and v to populate each other
	        if (result.recoveryParam == null) {
	            if (result.v == null) {
	                logger.throwArgumentError("signature missing v and recoveryParam", "signature", signature);
	            }
	            else {
	                result.recoveryParam = 1 - (result.v % 2);
	            }
	        }
	        else {
	            if (result.v == null) {
	                result.v = 27 + result.recoveryParam;
	            }
	            else if (result.recoveryParam !== (1 - (result.v % 2))) {
	                logger.throwArgumentError("signature recoveryParam mismatch v", "signature", signature);
	            }
	        }
	        if (result.r == null || !isHexString(result.r)) {
	            logger.throwArgumentError("signature missing or invalid r", "signature", signature);
	        }
	        else {
	            result.r = hexZeroPad(result.r, 32);
	        }
	        if (result.s == null || !isHexString(result.s)) {
	            logger.throwArgumentError("signature missing or invalid s", "signature", signature);
	        }
	        else {
	            result.s = hexZeroPad(result.s, 32);
	        }
	        var vs = arrayify(result.s);
	        if (vs[0] >= 128) {
	            logger.throwArgumentError("signature s out of range", "signature", signature);
	        }
	        if (result.recoveryParam) {
	            vs[0] |= 0x80;
	        }
	        var _vs = hexlify(vs);
	        if (result._vs) {
	            if (!isHexString(result._vs)) {
	                logger.throwArgumentError("signature invalid _vs", "signature", signature);
	            }
	            result._vs = hexZeroPad(result._vs, 32);
	        }
	        // Set or check the _vs
	        if (result._vs == null) {
	            result._vs = _vs;
	        }
	        else if (result._vs !== _vs) {
	            logger.throwArgumentError("signature _vs mismatch v and s", "signature", signature);
	        }
	    }
	    return result;
	}
	exports.splitSignature = splitSignature;
	function joinSignature(signature) {
	    signature = splitSignature(signature);
	    return hexlify(concat([
	        signature.r,
	        signature.s,
	        (signature.recoveryParam ? "0x1c" : "0x1b")
	    ]));
	}
	exports.joinSignature = joinSignature;

	});

	var index$1 = unwrapExports(lib$1);
	var lib_1$1 = lib$1.isBytesLike;
	var lib_2$1 = lib$1.isBytes;
	var lib_3$1 = lib$1.arrayify;
	var lib_4 = lib$1.concat;
	var lib_5 = lib$1.stripZeros;
	var lib_6 = lib$1.zeroPad;
	var lib_7 = lib$1.isHexString;
	var lib_8 = lib$1.hexlify;
	var lib_9 = lib$1.hexDataLength;
	var lib_10 = lib$1.hexDataSlice;
	var lib_11 = lib$1.hexConcat;
	var lib_12 = lib$1.hexValue;
	var lib_13 = lib$1.hexStripZeros;
	var lib_14 = lib$1.hexZeroPad;
	var lib_15 = lib$1.splitSignature;
	var lib_16 = lib$1.joinSignature;

	var _version$4 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "bignumber/5.0.5";

	});

	var _version$5 = unwrapExports(_version$4);
	var _version_1$2 = _version$4.version;

	var bignumber = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 *  BigNumber
	 *
	 *  A wrapper around the BN.js object. We use the BN.js library
	 *  because it is used by elliptic, so it is required regardles.
	 *
	 */




	var logger = new lib.Logger(_version$4.version);
	var _constructorGuard = {};
	var MAX_SAFE = 0x1fffffffffffff;
	function isBigNumberish(value) {
	    return (value != null) && (BigNumber.isBigNumber(value) ||
	        (typeof (value) === "number" && (value % 1) === 0) ||
	        (typeof (value) === "string" && !!value.match(/^-?[0-9]+$/)) ||
	        lib$1.isHexString(value) ||
	        (typeof (value) === "bigint") ||
	        lib$1.isBytes(value));
	}
	exports.isBigNumberish = isBigNumberish;
	var BigNumber = /** @class */ (function () {
	    function BigNumber(constructorGuard, hex) {
	        var _newTarget = this.constructor;
	        logger.checkNew(_newTarget, BigNumber);
	        if (constructorGuard !== _constructorGuard) {
	            logger.throwError("cannot call constructor directly; use BigNumber.from", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "new (BigNumber)"
	            });
	        }
	        this._hex = hex;
	        this._isBigNumber = true;
	        Object.freeze(this);
	    }
	    BigNumber.prototype.fromTwos = function (value) {
	        return toBigNumber(toBN(this).fromTwos(value));
	    };
	    BigNumber.prototype.toTwos = function (value) {
	        return toBigNumber(toBN(this).toTwos(value));
	    };
	    BigNumber.prototype.abs = function () {
	        if (this._hex[0] === "-") {
	            return BigNumber.from(this._hex.substring(1));
	        }
	        return this;
	    };
	    BigNumber.prototype.add = function (other) {
	        return toBigNumber(toBN(this).add(toBN(other)));
	    };
	    BigNumber.prototype.sub = function (other) {
	        return toBigNumber(toBN(this).sub(toBN(other)));
	    };
	    BigNumber.prototype.div = function (other) {
	        var o = BigNumber.from(other);
	        if (o.isZero()) {
	            throwFault("division by zero", "div");
	        }
	        return toBigNumber(toBN(this).div(toBN(other)));
	    };
	    BigNumber.prototype.mul = function (other) {
	        return toBigNumber(toBN(this).mul(toBN(other)));
	    };
	    BigNumber.prototype.mod = function (other) {
	        var value = toBN(other);
	        if (value.isNeg()) {
	            throwFault("cannot modulo negative values", "mod");
	        }
	        return toBigNumber(toBN(this).umod(value));
	    };
	    BigNumber.prototype.pow = function (other) {
	        var value = toBN(other);
	        if (value.isNeg()) {
	            throwFault("cannot raise to negative values", "pow");
	        }
	        return toBigNumber(toBN(this).pow(value));
	    };
	    BigNumber.prototype.and = function (other) {
	        var value = toBN(other);
	        if (this.isNegative() || value.isNeg()) {
	            throwFault("cannot 'and' negative values", "and");
	        }
	        return toBigNumber(toBN(this).and(value));
	    };
	    BigNumber.prototype.or = function (other) {
	        var value = toBN(other);
	        if (this.isNegative() || value.isNeg()) {
	            throwFault("cannot 'or' negative values", "or");
	        }
	        return toBigNumber(toBN(this).or(value));
	    };
	    BigNumber.prototype.xor = function (other) {
	        var value = toBN(other);
	        if (this.isNegative() || value.isNeg()) {
	            throwFault("cannot 'xor' negative values", "xor");
	        }
	        return toBigNumber(toBN(this).xor(value));
	    };
	    BigNumber.prototype.mask = function (value) {
	        if (this.isNegative() || value < 0) {
	            throwFault("cannot mask negative values", "mask");
	        }
	        return toBigNumber(toBN(this).maskn(value));
	    };
	    BigNumber.prototype.shl = function (value) {
	        if (this.isNegative() || value < 0) {
	            throwFault("cannot shift negative values", "shl");
	        }
	        return toBigNumber(toBN(this).shln(value));
	    };
	    BigNumber.prototype.shr = function (value) {
	        if (this.isNegative() || value < 0) {
	            throwFault("cannot shift negative values", "shr");
	        }
	        return toBigNumber(toBN(this).shrn(value));
	    };
	    BigNumber.prototype.eq = function (other) {
	        return toBN(this).eq(toBN(other));
	    };
	    BigNumber.prototype.lt = function (other) {
	        return toBN(this).lt(toBN(other));
	    };
	    BigNumber.prototype.lte = function (other) {
	        return toBN(this).lte(toBN(other));
	    };
	    BigNumber.prototype.gt = function (other) {
	        return toBN(this).gt(toBN(other));
	    };
	    BigNumber.prototype.gte = function (other) {
	        return toBN(this).gte(toBN(other));
	    };
	    BigNumber.prototype.isNegative = function () {
	        return (this._hex[0] === "-");
	    };
	    BigNumber.prototype.isZero = function () {
	        return toBN(this).isZero();
	    };
	    BigNumber.prototype.toNumber = function () {
	        try {
	            return toBN(this).toNumber();
	        }
	        catch (error) {
	            throwFault("overflow", "toNumber", this.toString());
	        }
	        return null;
	    };
	    BigNumber.prototype.toString = function () {
	        // Lots of people expect this, which we do not support, so check
	        if (arguments.length !== 0) {
	            logger.throwError("bigNumber.toString does not accept parameters", lib.Logger.errors.UNEXPECTED_ARGUMENT, {});
	        }
	        return toBN(this).toString(10);
	    };
	    BigNumber.prototype.toHexString = function () {
	        return this._hex;
	    };
	    BigNumber.from = function (value) {
	        if (value instanceof BigNumber) {
	            return value;
	        }
	        if (typeof (value) === "string") {
	            if (value.match(/^-?0x[0-9a-f]+$/i)) {
	                return new BigNumber(_constructorGuard, toHex(value));
	            }
	            if (value.match(/^-?[0-9]+$/)) {
	                return new BigNumber(_constructorGuard, toHex(new bn.BN(value)));
	            }
	            return logger.throwArgumentError("invalid BigNumber string", "value", value);
	        }
	        if (typeof (value) === "number") {
	            if (value % 1) {
	                throwFault("underflow", "BigNumber.from", value);
	            }
	            if (value >= MAX_SAFE || value <= -MAX_SAFE) {
	                throwFault("overflow", "BigNumber.from", value);
	            }
	            return BigNumber.from(String(value));
	        }
	        if (typeof (value) === "bigint") {
	            return BigNumber.from(value.toString());
	        }
	        if (lib$1.isBytes(value)) {
	            return BigNumber.from(lib$1.hexlify(value));
	        }
	        if (value._hex && lib$1.isHexString(value._hex)) {
	            return BigNumber.from(value._hex);
	        }
	        if (value.toHexString) {
	            value = value.toHexString();
	            if (typeof (value) === "string") {
	                return BigNumber.from(value);
	            }
	        }
	        return logger.throwArgumentError("invalid BigNumber value", "value", value);
	    };
	    BigNumber.isBigNumber = function (value) {
	        return !!(value && value._isBigNumber);
	    };
	    return BigNumber;
	}());
	exports.BigNumber = BigNumber;
	// Normalize the hex string
	function toHex(value) {
	    // For BN, call on the hex string
	    if (typeof (value) !== "string") {
	        return toHex(value.toString(16));
	    }
	    // If negative, prepend the negative sign to the normalized positive value
	    if (value[0] === "-") {
	        // Strip off the negative sign
	        value = value.substring(1);
	        // Cannot have mulitple negative signs (e.g. "--0x04")
	        if (value[0] === "-") {
	            logger.throwArgumentError("invalid hex", "value", value);
	        }
	        // Call toHex on the positive component
	        value = toHex(value);
	        // Do not allow "-0x00"
	        if (value === "0x00") {
	            return value;
	        }
	        // Negate the value
	        return "-" + value;
	    }
	    // Add a "0x" prefix if missing
	    if (value.substring(0, 2) !== "0x") {
	        value = "0x" + value;
	    }
	    // Normalize zero
	    if (value === "0x") {
	        return "0x00";
	    }
	    // Make the string even length
	    if (value.length % 2) {
	        value = "0x0" + value.substring(2);
	    }
	    // Trim to smallest even-length string
	    while (value.length > 4 && value.substring(0, 4) === "0x00") {
	        value = "0x" + value.substring(4);
	    }
	    return value;
	}
	function toBigNumber(value) {
	    return BigNumber.from(toHex(value));
	}
	function toBN(value) {
	    var hex = BigNumber.from(value).toHexString();
	    if (hex[0] === "-") {
	        return (new bn.BN("-" + hex.substring(3), 16));
	    }
	    return new bn.BN(hex.substring(2), 16);
	}
	function throwFault(fault, operation, value) {
	    var params = { fault: fault, operation: operation };
	    if (value != null) {
	        params.value = value;
	    }
	    return logger.throwError(fault, lib.Logger.errors.NUMERIC_FAULT, params);
	}

	});

	var bignumber$1 = unwrapExports(bignumber);
	var bignumber_1 = bignumber.isBigNumberish;
	var bignumber_2 = bignumber.BigNumber;

	var fixednumber = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$4.version);

	var _constructorGuard = {};
	var Zero = bignumber.BigNumber.from(0);
	var NegativeOne = bignumber.BigNumber.from(-1);
	function throwFault(message, fault, operation, value) {
	    var params = { fault: fault, operation: operation };
	    if (value !== undefined) {
	        params.value = value;
	    }
	    return logger.throwError(message, lib.Logger.errors.NUMERIC_FAULT, params);
	}
	// Constant to pull zeros from for multipliers
	var zeros = "0";
	while (zeros.length < 256) {
	    zeros += zeros;
	}
	// Returns a string "1" followed by decimal "0"s
	function getMultiplier(decimals) {
	    if (typeof (decimals) !== "number") {
	        try {
	            decimals = bignumber.BigNumber.from(decimals).toNumber();
	        }
	        catch (e) { }
	    }
	    if (typeof (decimals) === "number" && decimals >= 0 && decimals <= 256 && !(decimals % 1)) {
	        return ("1" + zeros.substring(0, decimals));
	    }
	    return logger.throwArgumentError("invalid decimal size", "decimals", decimals);
	}
	function formatFixed(value, decimals) {
	    if (decimals == null) {
	        decimals = 0;
	    }
	    var multiplier = getMultiplier(decimals);
	    // Make sure wei is a big number (convert as necessary)
	    value = bignumber.BigNumber.from(value);
	    var negative = value.lt(Zero);
	    if (negative) {
	        value = value.mul(NegativeOne);
	    }
	    var fraction = value.mod(multiplier).toString();
	    while (fraction.length < multiplier.length - 1) {
	        fraction = "0" + fraction;
	    }
	    // Strip training 0
	    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
	    var whole = value.div(multiplier).toString();
	    value = whole + "." + fraction;
	    if (negative) {
	        value = "-" + value;
	    }
	    return value;
	}
	exports.formatFixed = formatFixed;
	function parseFixed(value, decimals) {
	    if (decimals == null) {
	        decimals = 0;
	    }
	    var multiplier = getMultiplier(decimals);
	    if (typeof (value) !== "string" || !value.match(/^-?[0-9.,]+$/)) {
	        logger.throwArgumentError("invalid decimal value", "value", value);
	    }
	    if (multiplier.length - 1 === 0) {
	        return bignumber.BigNumber.from(value);
	    }
	    // Is it negative?
	    var negative = (value.substring(0, 1) === "-");
	    if (negative) {
	        value = value.substring(1);
	    }
	    if (value === ".") {
	        logger.throwArgumentError("missing value", "value", value);
	    }
	    // Split it into a whole and fractional part
	    var comps = value.split(".");
	    if (comps.length > 2) {
	        logger.throwArgumentError("too many decimal points", "value", value);
	    }
	    var whole = comps[0], fraction = comps[1];
	    if (!whole) {
	        whole = "0";
	    }
	    if (!fraction) {
	        fraction = "0";
	    }
	    // Prevent underflow
	    if (fraction.length > multiplier.length - 1) {
	        throwFault("fractional component exceeds decimals", "underflow", "parseFixed");
	    }
	    // Fully pad the string with zeros to get to wei
	    while (fraction.length < multiplier.length - 1) {
	        fraction += "0";
	    }
	    var wholeValue = bignumber.BigNumber.from(whole);
	    var fractionValue = bignumber.BigNumber.from(fraction);
	    var wei = (wholeValue.mul(multiplier)).add(fractionValue);
	    if (negative) {
	        wei = wei.mul(NegativeOne);
	    }
	    return wei;
	}
	exports.parseFixed = parseFixed;
	var FixedFormat = /** @class */ (function () {
	    function FixedFormat(constructorGuard, signed, width, decimals) {
	        if (constructorGuard !== _constructorGuard) {
	            logger.throwError("cannot use FixedFormat constructor; use FixedFormat.from", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "new FixedFormat"
	            });
	        }
	        this.signed = signed;
	        this.width = width;
	        this.decimals = decimals;
	        this.name = (signed ? "" : "u") + "fixed" + String(width) + "x" + String(decimals);
	        this._multiplier = getMultiplier(decimals);
	        Object.freeze(this);
	    }
	    FixedFormat.from = function (value) {
	        if (value instanceof FixedFormat) {
	            return value;
	        }
	        var signed = true;
	        var width = 128;
	        var decimals = 18;
	        if (typeof (value) === "string") {
	            if (value === "fixed") {
	                // defaults...
	            }
	            else if (value === "ufixed") {
	                signed = false;
	            }
	            else if (value != null) {
	                var match = value.match(/^(u?)fixed([0-9]+)x([0-9]+)$/);
	                if (!match) {
	                    logger.throwArgumentError("invalid fixed format", "format", value);
	                }
	                signed = (match[1] !== "u");
	                width = parseInt(match[2]);
	                decimals = parseInt(match[3]);
	            }
	        }
	        else if (value) {
	            var check = function (key, type, defaultValue) {
	                if (value[key] == null) {
	                    return defaultValue;
	                }
	                if (typeof (value[key]) !== type) {
	                    logger.throwArgumentError("invalid fixed format (" + key + " not " + type + ")", "format." + key, value[key]);
	                }
	                return value[key];
	            };
	            signed = check("signed", "boolean", signed);
	            width = check("width", "number", width);
	            decimals = check("decimals", "number", decimals);
	        }
	        if (width % 8) {
	            logger.throwArgumentError("invalid fixed format width (not byte aligned)", "format.width", width);
	        }
	        if (decimals > 80) {
	            logger.throwArgumentError("invalid fixed format (decimals too large)", "format.decimals", decimals);
	        }
	        return new FixedFormat(_constructorGuard, signed, width, decimals);
	    };
	    return FixedFormat;
	}());
	exports.FixedFormat = FixedFormat;
	var FixedNumber = /** @class */ (function () {
	    function FixedNumber(constructorGuard, hex, value, format) {
	        var _newTarget = this.constructor;
	        logger.checkNew(_newTarget, FixedNumber);
	        if (constructorGuard !== _constructorGuard) {
	            logger.throwError("cannot use FixedNumber constructor; use FixedNumber.from", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "new FixedFormat"
	            });
	        }
	        this.format = format;
	        this._hex = hex;
	        this._value = value;
	        this._isFixedNumber = true;
	        Object.freeze(this);
	    }
	    FixedNumber.prototype._checkFormat = function (other) {
	        if (this.format.name !== other.format.name) {
	            logger.throwArgumentError("incompatible format; use fixedNumber.toFormat", "other", other);
	        }
	    };
	    FixedNumber.prototype.addUnsafe = function (other) {
	        this._checkFormat(other);
	        var a = parseFixed(this._value, this.format.decimals);
	        var b = parseFixed(other._value, other.format.decimals);
	        return FixedNumber.fromValue(a.add(b), this.format.decimals, this.format);
	    };
	    FixedNumber.prototype.subUnsafe = function (other) {
	        this._checkFormat(other);
	        var a = parseFixed(this._value, this.format.decimals);
	        var b = parseFixed(other._value, other.format.decimals);
	        return FixedNumber.fromValue(a.sub(b), this.format.decimals, this.format);
	    };
	    FixedNumber.prototype.mulUnsafe = function (other) {
	        this._checkFormat(other);
	        var a = parseFixed(this._value, this.format.decimals);
	        var b = parseFixed(other._value, other.format.decimals);
	        return FixedNumber.fromValue(a.mul(b).div(this.format._multiplier), this.format.decimals, this.format);
	    };
	    FixedNumber.prototype.divUnsafe = function (other) {
	        this._checkFormat(other);
	        var a = parseFixed(this._value, this.format.decimals);
	        var b = parseFixed(other._value, other.format.decimals);
	        return FixedNumber.fromValue(a.mul(this.format._multiplier).div(b), this.format.decimals, this.format);
	    };
	    // @TODO: Support other rounding algorithms
	    FixedNumber.prototype.round = function (decimals) {
	        if (decimals == null) {
	            decimals = 0;
	        }
	        if (decimals < 0 || decimals > 80 || (decimals % 1)) {
	            logger.throwArgumentError("invalid decimal count", "decimals", decimals);
	        }
	        // If we are already in range, we're done
	        var comps = this.toString().split(".");
	        if (comps[1].length <= decimals) {
	            return this;
	        }
	        // Bump the value up by the 0.00...0005
	        var bump = "0." + zeros.substring(0, decimals) + "5";
	        comps = this.addUnsafe(FixedNumber.fromString(bump, this.format))._value.split(".");
	        // Now it is safe to truncate
	        return FixedNumber.fromString(comps[0] + "." + comps[1].substring(0, decimals));
	    };
	    FixedNumber.prototype.isZero = function () {
	        return (this._value === "0.0");
	    };
	    FixedNumber.prototype.toString = function () { return this._value; };
	    FixedNumber.prototype.toHexString = function (width) {
	        if (width == null) {
	            return this._hex;
	        }
	        if (width % 8) {
	            logger.throwArgumentError("invalid byte width", "width", width);
	        }
	        var hex = bignumber.BigNumber.from(this._hex).fromTwos(this.format.width).toTwos(width).toHexString();
	        return lib$1.hexZeroPad(hex, width / 8);
	    };
	    FixedNumber.prototype.toUnsafeFloat = function () { return parseFloat(this.toString()); };
	    FixedNumber.prototype.toFormat = function (format) {
	        return FixedNumber.fromString(this._value, format);
	    };
	    FixedNumber.fromValue = function (value, decimals, format) {
	        // If decimals looks more like a format, and there is no format, shift the parameters
	        if (format == null && decimals != null && !bignumber.isBigNumberish(decimals)) {
	            format = decimals;
	            decimals = null;
	        }
	        if (decimals == null) {
	            decimals = 0;
	        }
	        if (format == null) {
	            format = "fixed";
	        }
	        return FixedNumber.fromString(formatFixed(value, decimals), FixedFormat.from(format));
	    };
	    FixedNumber.fromString = function (value, format) {
	        if (format == null) {
	            format = "fixed";
	        }
	        var fixedFormat = FixedFormat.from(format);
	        var numeric = parseFixed(value, fixedFormat.decimals);
	        if (!fixedFormat.signed && numeric.lt(Zero)) {
	            throwFault("unsigned value cannot be negative", "overflow", "value", value);
	        }
	        var hex = null;
	        if (fixedFormat.signed) {
	            hex = numeric.toTwos(fixedFormat.width).toHexString();
	        }
	        else {
	            hex = numeric.toHexString();
	            hex = lib$1.hexZeroPad(hex, fixedFormat.width / 8);
	        }
	        var decimal = formatFixed(numeric, fixedFormat.decimals);
	        return new FixedNumber(_constructorGuard, hex, decimal, fixedFormat);
	    };
	    FixedNumber.fromBytes = function (value, format) {
	        if (format == null) {
	            format = "fixed";
	        }
	        var fixedFormat = FixedFormat.from(format);
	        if (lib$1.arrayify(value).length > fixedFormat.width / 8) {
	            throw new Error("overflow");
	        }
	        var numeric = bignumber.BigNumber.from(value);
	        if (fixedFormat.signed) {
	            numeric = numeric.fromTwos(fixedFormat.width);
	        }
	        var hex = numeric.toTwos((fixedFormat.signed ? 0 : 1) + fixedFormat.width).toHexString();
	        var decimal = formatFixed(numeric, fixedFormat.decimals);
	        return new FixedNumber(_constructorGuard, hex, decimal, fixedFormat);
	    };
	    FixedNumber.from = function (value, format) {
	        if (typeof (value) === "string") {
	            return FixedNumber.fromString(value, format);
	        }
	        if (lib$1.isBytes(value)) {
	            return FixedNumber.fromBytes(value, format);
	        }
	        try {
	            return FixedNumber.fromValue(value, 0, format);
	        }
	        catch (error) {
	            // Allow NUMERIC_FAULT to bubble up
	            if (error.code !== lib.Logger.errors.INVALID_ARGUMENT) {
	                throw error;
	            }
	        }
	        return logger.throwArgumentError("invalid FixedNumber value", "value", value);
	    };
	    FixedNumber.isFixedNumber = function (value) {
	        return !!(value && value._isFixedNumber);
	    };
	    return FixedNumber;
	}());
	exports.FixedNumber = FixedNumber;

	});

	var fixednumber$1 = unwrapExports(fixednumber);
	var fixednumber_1 = fixednumber.formatFixed;
	var fixednumber_2 = fixednumber.parseFixed;
	var fixednumber_3 = fixednumber.FixedFormat;
	var fixednumber_4 = fixednumber.FixedNumber;

	var lib$2 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.BigNumber = bignumber.BigNumber;

	exports.formatFixed = fixednumber.formatFixed;
	exports.FixedFormat = fixednumber.FixedFormat;
	exports.FixedNumber = fixednumber.FixedNumber;
	exports.parseFixed = fixednumber.parseFixed;

	});

	var index$2 = unwrapExports(lib$2);
	var lib_1$2 = lib$2.BigNumber;
	var lib_2$2 = lib$2.formatFixed;
	var lib_3$2 = lib$2.FixedFormat;
	var lib_4$1 = lib$2.FixedNumber;
	var lib_5$1 = lib$2.parseFixed;

	var _version$6 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "properties/5.0.2";

	});

	var _version$7 = unwrapExports(_version$6);
	var _version_1$3 = _version$6.version;

	var lib$3 = createCommonjsModule(function (module, exports) {
	"use strict";
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });


	var logger = new lib.Logger(_version$6.version);
	function defineReadOnly(object, name, value) {
	    Object.defineProperty(object, name, {
	        enumerable: true,
	        value: value,
	        writable: false,
	    });
	}
	exports.defineReadOnly = defineReadOnly;
	// Crawl up the constructor chain to find a static method
	function getStatic(ctor, key) {
	    for (var i = 0; i < 32; i++) {
	        if (ctor[key]) {
	            return ctor[key];
	        }
	        if (!ctor.prototype || typeof (ctor.prototype) !== "object") {
	            break;
	        }
	        ctor = Object.getPrototypeOf(ctor.prototype).constructor;
	    }
	    return null;
	}
	exports.getStatic = getStatic;
	function resolveProperties(object) {
	    return __awaiter(this, void 0, void 0, function () {
	        var promises, results;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    promises = Object.keys(object).map(function (key) {
	                        var value = object[key];
	                        return Promise.resolve(value).then(function (v) { return ({ key: key, value: v }); });
	                    });
	                    return [4 /*yield*/, Promise.all(promises)];
	                case 1:
	                    results = _a.sent();
	                    return [2 /*return*/, results.reduce(function (accum, result) {
	                            accum[(result.key)] = result.value;
	                            return accum;
	                        }, {})];
	            }
	        });
	    });
	}
	exports.resolveProperties = resolveProperties;
	function checkProperties(object, properties) {
	    if (!object || typeof (object) !== "object") {
	        logger.throwArgumentError("invalid object", "object", object);
	    }
	    Object.keys(object).forEach(function (key) {
	        if (!properties[key]) {
	            logger.throwArgumentError("invalid object key - " + key, "transaction:" + key, object);
	        }
	    });
	}
	exports.checkProperties = checkProperties;
	function shallowCopy(object) {
	    var result = {};
	    for (var key in object) {
	        result[key] = object[key];
	    }
	    return result;
	}
	exports.shallowCopy = shallowCopy;
	var opaque = { bigint: true, boolean: true, "function": true, number: true, string: true };
	function _isFrozen(object) {
	    // Opaque objects are not mutable, so safe to copy by assignment
	    if (object === undefined || object === null || opaque[typeof (object)]) {
	        return true;
	    }
	    if (Array.isArray(object) || typeof (object) === "object") {
	        if (!Object.isFrozen(object)) {
	            return false;
	        }
	        var keys = Object.keys(object);
	        for (var i = 0; i < keys.length; i++) {
	            if (!_isFrozen(object[keys[i]])) {
	                return false;
	            }
	        }
	        return true;
	    }
	    return logger.throwArgumentError("Cannot deepCopy " + typeof (object), "object", object);
	}
	// Returns a new copy of object, such that no properties may be replaced.
	// New properties may be added only to objects.
	function _deepCopy(object) {
	    if (_isFrozen(object)) {
	        return object;
	    }
	    // Arrays are mutable, so we need to create a copy
	    if (Array.isArray(object)) {
	        return Object.freeze(object.map(function (item) { return deepCopy(item); }));
	    }
	    if (typeof (object) === "object") {
	        var result = {};
	        for (var key in object) {
	            var value = object[key];
	            if (value === undefined) {
	                continue;
	            }
	            defineReadOnly(result, key, deepCopy(value));
	        }
	        return result;
	    }
	    return logger.throwArgumentError("Cannot deepCopy " + typeof (object), "object", object);
	}
	function deepCopy(object) {
	    return _deepCopy(object);
	}
	exports.deepCopy = deepCopy;
	var Description = /** @class */ (function () {
	    function Description(info) {
	        for (var key in info) {
	            this[key] = deepCopy(info[key]);
	        }
	    }
	    return Description;
	}());
	exports.Description = Description;

	});

	var index$3 = unwrapExports(lib$3);
	var lib_1$3 = lib$3.defineReadOnly;
	var lib_2$3 = lib$3.getStatic;
	var lib_3$3 = lib$3.resolveProperties;
	var lib_4$2 = lib$3.checkProperties;
	var lib_5$2 = lib$3.shallowCopy;
	var lib_6$1 = lib$3.deepCopy;
	var lib_7$1 = lib$3.Description;

	var _version$8 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "abi/5.0.2";

	});

	var _version$9 = unwrapExports(_version$8);
	var _version_1$4 = _version$8.version;

	var fragments = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });




	var logger = new lib.Logger(_version$8.version);
	;
	var _constructorGuard = {};
	var ModifiersBytes = { calldata: true, memory: true, storage: true };
	var ModifiersNest = { calldata: true, memory: true };
	function checkModifier(type, name) {
	    if (type === "bytes" || type === "string") {
	        if (ModifiersBytes[name]) {
	            return true;
	        }
	    }
	    else if (type === "address") {
	        if (name === "payable") {
	            return true;
	        }
	    }
	    else if (type.indexOf("[") >= 0 || type === "tuple") {
	        if (ModifiersNest[name]) {
	            return true;
	        }
	    }
	    if (ModifiersBytes[name] || name === "payable") {
	        logger.throwArgumentError("invalid modifier", "name", name);
	    }
	    return false;
	}
	// @TODO: Make sure that children of an indexed tuple are marked with a null indexed
	function parseParamType(param, allowIndexed) {
	    var originalParam = param;
	    function throwError(i) {
	        logger.throwArgumentError("unexpected character at position " + i, "param", param);
	    }
	    param = param.replace(/\s/g, " ");
	    function newNode(parent) {
	        var node = { type: "", name: "", parent: parent, state: { allowType: true } };
	        if (allowIndexed) {
	            node.indexed = false;
	        }
	        return node;
	    }
	    var parent = { type: "", name: "", state: { allowType: true } };
	    var node = parent;
	    for (var i = 0; i < param.length; i++) {
	        var c = param[i];
	        switch (c) {
	            case "(":
	                if (node.state.allowType && node.type === "") {
	                    node.type = "tuple";
	                }
	                else if (!node.state.allowParams) {
	                    throwError(i);
	                }
	                node.state.allowType = false;
	                node.type = verifyType(node.type);
	                node.components = [newNode(node)];
	                node = node.components[0];
	                break;
	            case ")":
	                delete node.state;
	                if (node.name === "indexed") {
	                    if (!allowIndexed) {
	                        throwError(i);
	                    }
	                    node.indexed = true;
	                    node.name = "";
	                }
	                if (checkModifier(node.type, node.name)) {
	                    node.name = "";
	                }
	                node.type = verifyType(node.type);
	                var child = node;
	                node = node.parent;
	                if (!node) {
	                    throwError(i);
	                }
	                delete child.parent;
	                node.state.allowParams = false;
	                node.state.allowName = true;
	                node.state.allowArray = true;
	                break;
	            case ",":
	                delete node.state;
	                if (node.name === "indexed") {
	                    if (!allowIndexed) {
	                        throwError(i);
	                    }
	                    node.indexed = true;
	                    node.name = "";
	                }
	                if (checkModifier(node.type, node.name)) {
	                    node.name = "";
	                }
	                node.type = verifyType(node.type);
	                var sibling = newNode(node.parent);
	                //{ type: "", name: "", parent: node.parent, state: { allowType: true } };
	                node.parent.components.push(sibling);
	                delete node.parent;
	                node = sibling;
	                break;
	            // Hit a space...
	            case " ":
	                // If reading type, the type is done and may read a param or name
	                if (node.state.allowType) {
	                    if (node.type !== "") {
	                        node.type = verifyType(node.type);
	                        delete node.state.allowType;
	                        node.state.allowName = true;
	                        node.state.allowParams = true;
	                    }
	                }
	                // If reading name, the name is done
	                if (node.state.allowName) {
	                    if (node.name !== "") {
	                        if (node.name === "indexed") {
	                            if (!allowIndexed) {
	                                throwError(i);
	                            }
	                            if (node.indexed) {
	                                throwError(i);
	                            }
	                            node.indexed = true;
	                            node.name = "";
	                        }
	                        else if (checkModifier(node.type, node.name)) {
	                            node.name = "";
	                        }
	                        else {
	                            node.state.allowName = false;
	                        }
	                    }
	                }
	                break;
	            case "[":
	                if (!node.state.allowArray) {
	                    throwError(i);
	                }
	                node.type += c;
	                node.state.allowArray = false;
	                node.state.allowName = false;
	                node.state.readArray = true;
	                break;
	            case "]":
	                if (!node.state.readArray) {
	                    throwError(i);
	                }
	                node.type += c;
	                node.state.readArray = false;
	                node.state.allowArray = true;
	                node.state.allowName = true;
	                break;
	            default:
	                if (node.state.allowType) {
	                    node.type += c;
	                    node.state.allowParams = true;
	                    node.state.allowArray = true;
	                }
	                else if (node.state.allowName) {
	                    node.name += c;
	                    delete node.state.allowArray;
	                }
	                else if (node.state.readArray) {
	                    node.type += c;
	                }
	                else {
	                    throwError(i);
	                }
	        }
	    }
	    if (node.parent) {
	        logger.throwArgumentError("unexpected eof", "param", param);
	    }
	    delete parent.state;
	    if (node.name === "indexed") {
	        if (!allowIndexed) {
	            throwError(originalParam.length - 7);
	        }
	        if (node.indexed) {
	            throwError(originalParam.length - 7);
	        }
	        node.indexed = true;
	        node.name = "";
	    }
	    else if (checkModifier(node.type, node.name)) {
	        node.name = "";
	    }
	    parent.type = verifyType(parent.type);
	    return parent;
	}
	function populate(object, params) {
	    for (var key in params) {
	        lib$3.defineReadOnly(object, key, params[key]);
	    }
	}
	exports.FormatTypes = Object.freeze({
	    // Bare formatting, as is needed for computing a sighash of an event or function
	    sighash: "sighash",
	    // Human-Readable with Minimal spacing and without names (compact human-readable)
	    minimal: "minimal",
	    // Human-Readble with nice spacing, including all names
	    full: "full",
	    // JSON-format a la Solidity
	    json: "json"
	});
	var paramTypeArray = new RegExp(/^(.*)\[([0-9]*)\]$/);
	var ParamType = /** @class */ (function () {
	    function ParamType(constructorGuard, params) {
	        if (constructorGuard !== _constructorGuard) {
	            logger.throwError("use fromString", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "new ParamType()"
	            });
	        }
	        populate(this, params);
	        var match = this.type.match(paramTypeArray);
	        if (match) {
	            populate(this, {
	                arrayLength: parseInt(match[2] || "-1"),
	                arrayChildren: ParamType.fromObject({
	                    type: match[1],
	                    components: this.components
	                }),
	                baseType: "array"
	            });
	        }
	        else {
	            populate(this, {
	                arrayLength: null,
	                arrayChildren: null,
	                baseType: ((this.components != null) ? "tuple" : this.type)
	            });
	        }
	        this._isParamType = true;
	        Object.freeze(this);
	    }
	    // Format the parameter fragment
	    //   - sighash: "(uint256,address)"
	    //   - minimal: "tuple(uint256,address) indexed"
	    //   - full:    "tuple(uint256 foo, addres bar) indexed baz"
	    ParamType.prototype.format = function (format) {
	        if (!format) {
	            format = exports.FormatTypes.sighash;
	        }
	        if (!exports.FormatTypes[format]) {
	            logger.throwArgumentError("invalid format type", "format", format);
	        }
	        if (format === exports.FormatTypes.json) {
	            var result_1 = {
	                type: ((this.baseType === "tuple") ? "tuple" : this.type),
	                name: (this.name || undefined)
	            };
	            if (typeof (this.indexed) === "boolean") {
	                result_1.indexed = this.indexed;
	            }
	            if (this.components) {
	                result_1.components = this.components.map(function (comp) { return JSON.parse(comp.format(format)); });
	            }
	            return JSON.stringify(result_1);
	        }
	        var result = "";
	        // Array
	        if (this.baseType === "array") {
	            result += this.arrayChildren.format(format);
	            result += "[" + (this.arrayLength < 0 ? "" : String(this.arrayLength)) + "]";
	        }
	        else {
	            if (this.baseType === "tuple") {
	                if (format !== exports.FormatTypes.sighash) {
	                    result += this.type;
	                }
	                result += "(" + this.components.map(function (comp) { return comp.format(format); }).join((format === exports.FormatTypes.full) ? ", " : ",") + ")";
	            }
	            else {
	                result += this.type;
	            }
	        }
	        if (format !== exports.FormatTypes.sighash) {
	            if (this.indexed === true) {
	                result += " indexed";
	            }
	            if (format === exports.FormatTypes.full && this.name) {
	                result += " " + this.name;
	            }
	        }
	        return result;
	    };
	    ParamType.from = function (value, allowIndexed) {
	        if (typeof (value) === "string") {
	            return ParamType.fromString(value, allowIndexed);
	        }
	        return ParamType.fromObject(value);
	    };
	    ParamType.fromObject = function (value) {
	        if (ParamType.isParamType(value)) {
	            return value;
	        }
	        return new ParamType(_constructorGuard, {
	            name: (value.name || null),
	            type: verifyType(value.type),
	            indexed: ((value.indexed == null) ? null : !!value.indexed),
	            components: (value.components ? value.components.map(ParamType.fromObject) : null)
	        });
	    };
	    ParamType.fromString = function (value, allowIndexed) {
	        function ParamTypify(node) {
	            return ParamType.fromObject({
	                name: node.name,
	                type: node.type,
	                indexed: node.indexed,
	                components: node.components
	            });
	        }
	        return ParamTypify(parseParamType(value, !!allowIndexed));
	    };
	    ParamType.isParamType = function (value) {
	        return !!(value != null && value._isParamType);
	    };
	    return ParamType;
	}());
	exports.ParamType = ParamType;
	;
	function parseParams(value, allowIndex) {
	    return splitNesting(value).map(function (param) { return ParamType.fromString(param, allowIndex); });
	}
	var Fragment = /** @class */ (function () {
	    function Fragment(constructorGuard, params) {
	        if (constructorGuard !== _constructorGuard) {
	            logger.throwError("use a static from method", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "new Fragment()"
	            });
	        }
	        populate(this, params);
	        this._isFragment = true;
	        Object.freeze(this);
	    }
	    Fragment.from = function (value) {
	        if (Fragment.isFragment(value)) {
	            return value;
	        }
	        if (typeof (value) === "string") {
	            return Fragment.fromString(value);
	        }
	        return Fragment.fromObject(value);
	    };
	    Fragment.fromObject = function (value) {
	        if (Fragment.isFragment(value)) {
	            return value;
	        }
	        switch (value.type) {
	            case "function":
	                return FunctionFragment.fromObject(value);
	            case "event":
	                return EventFragment.fromObject(value);
	            case "constructor":
	                return ConstructorFragment.fromObject(value);
	            case "fallback":
	            case "receive":
	                // @TODO: Something? Maybe return a FunctionFragment? A custom DefaultFunctionFragment?
	                return null;
	        }
	        return logger.throwArgumentError("invalid fragment object", "value", value);
	    };
	    Fragment.fromString = function (value) {
	        // Make sure the "returns" is surrounded by a space and all whitespace is exactly one space
	        value = value.replace(/\s/g, " ");
	        value = value.replace(/\(/g, " (").replace(/\)/g, ") ").replace(/\s+/g, " ");
	        value = value.trim();
	        if (value.split(" ")[0] === "event") {
	            return EventFragment.fromString(value.substring(5).trim());
	        }
	        else if (value.split(" ")[0] === "function") {
	            return FunctionFragment.fromString(value.substring(8).trim());
	        }
	        else if (value.split("(")[0].trim() === "constructor") {
	            return ConstructorFragment.fromString(value.trim());
	        }
	        return logger.throwArgumentError("unsupported fragment", "value", value);
	    };
	    Fragment.isFragment = function (value) {
	        return !!(value && value._isFragment);
	    };
	    return Fragment;
	}());
	exports.Fragment = Fragment;
	var EventFragment = /** @class */ (function (_super) {
	    __extends(EventFragment, _super);
	    function EventFragment() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    EventFragment.prototype.format = function (format) {
	        if (!format) {
	            format = exports.FormatTypes.sighash;
	        }
	        if (!exports.FormatTypes[format]) {
	            logger.throwArgumentError("invalid format type", "format", format);
	        }
	        if (format === exports.FormatTypes.json) {
	            return JSON.stringify({
	                type: "event",
	                anonymous: this.anonymous,
	                name: this.name,
	                inputs: this.inputs.map(function (input) { return JSON.parse(input.format(format)); })
	            });
	        }
	        var result = "";
	        if (format !== exports.FormatTypes.sighash) {
	            result += "event ";
	        }
	        result += this.name + "(" + this.inputs.map(function (input) { return input.format(format); }).join((format === exports.FormatTypes.full) ? ", " : ",") + ") ";
	        if (format !== exports.FormatTypes.sighash) {
	            if (this.anonymous) {
	                result += "anonymous ";
	            }
	        }
	        return result.trim();
	    };
	    EventFragment.from = function (value) {
	        if (typeof (value) === "string") {
	            return EventFragment.fromString(value);
	        }
	        return EventFragment.fromObject(value);
	    };
	    EventFragment.fromObject = function (value) {
	        if (EventFragment.isEventFragment(value)) {
	            return value;
	        }
	        if (value.type !== "event") {
	            logger.throwArgumentError("invalid event object", "value", value);
	        }
	        var params = {
	            name: verifyIdentifier(value.name),
	            anonymous: value.anonymous,
	            inputs: (value.inputs ? value.inputs.map(ParamType.fromObject) : []),
	            type: "event"
	        };
	        return new EventFragment(_constructorGuard, params);
	    };
	    EventFragment.fromString = function (value) {
	        var match = value.match(regexParen);
	        if (!match) {
	            logger.throwArgumentError("invalid event string", "value", value);
	        }
	        var anonymous = false;
	        match[3].split(" ").forEach(function (modifier) {
	            switch (modifier.trim()) {
	                case "anonymous":
	                    anonymous = true;
	                    break;
	                case "":
	                    break;
	                default:
	                    logger.warn("unknown modifier: " + modifier);
	            }
	        });
	        return EventFragment.fromObject({
	            name: match[1].trim(),
	            anonymous: anonymous,
	            inputs: parseParams(match[2], true),
	            type: "event"
	        });
	    };
	    EventFragment.isEventFragment = function (value) {
	        return (value && value._isFragment && value.type === "event");
	    };
	    return EventFragment;
	}(Fragment));
	exports.EventFragment = EventFragment;
	function parseGas(value, params) {
	    params.gas = null;
	    var comps = value.split("@");
	    if (comps.length !== 1) {
	        if (comps.length > 2) {
	            logger.throwArgumentError("invalid human-readable ABI signature", "value", value);
	        }
	        if (!comps[1].match(/^[0-9]+$/)) {
	            logger.throwArgumentError("invalid human-readable ABI signature gas", "value", value);
	        }
	        params.gas = lib$2.BigNumber.from(comps[1]);
	        return comps[0];
	    }
	    return value;
	}
	function parseModifiers(value, params) {
	    params.constant = false;
	    params.payable = false;
	    params.stateMutability = "nonpayable";
	    value.split(" ").forEach(function (modifier) {
	        switch (modifier.trim()) {
	            case "constant":
	                params.constant = true;
	                break;
	            case "payable":
	                params.payable = true;
	                params.stateMutability = "payable";
	                break;
	            case "nonpayable":
	                params.payable = false;
	                params.stateMutability = "nonpayable";
	                break;
	            case "pure":
	                params.constant = true;
	                params.stateMutability = "pure";
	                break;
	            case "view":
	                params.constant = true;
	                params.stateMutability = "view";
	                break;
	            case "external":
	            case "public":
	            case "":
	                break;
	            default:
	                console.log("unknown modifier: " + modifier);
	        }
	    });
	}
	function verifyState(value) {
	    var result = {
	        constant: false,
	        payable: true,
	        stateMutability: "payable"
	    };
	    if (value.stateMutability != null) {
	        result.stateMutability = value.stateMutability;
	        // Set (and check things are consistent) the constant property
	        result.constant = (result.stateMutability === "view" || result.stateMutability === "pure");
	        if (value.constant != null) {
	            if ((!!value.constant) !== result.constant) {
	                logger.throwArgumentError("cannot have constant function with mutability " + result.stateMutability, "value", value);
	            }
	        }
	        // Set (and check things are consistent) the payable property
	        result.payable = (result.stateMutability === "payable");
	        if (value.payable != null) {
	            if ((!!value.payable) !== result.payable) {
	                logger.throwArgumentError("cannot have payable function with mutability " + result.stateMutability, "value", value);
	            }
	        }
	    }
	    else if (value.payable != null) {
	        result.payable = !!value.payable;
	        // If payable we can assume non-constant; otherwise we can't assume
	        if (value.constant == null && !result.payable && value.type !== "constructor") {
	            logger.throwArgumentError("unable to determine stateMutability", "value", value);
	        }
	        result.constant = !!value.constant;
	        if (result.constant) {
	            result.stateMutability = "view";
	        }
	        else {
	            result.stateMutability = (result.payable ? "payable" : "nonpayable");
	        }
	        if (result.payable && result.constant) {
	            logger.throwArgumentError("cannot have constant payable function", "value", value);
	        }
	    }
	    else if (value.constant != null) {
	        result.constant = !!value.constant;
	        result.payable = !result.constant;
	        result.stateMutability = (result.constant ? "view" : "payable");
	    }
	    else if (value.type !== "constructor") {
	        logger.throwArgumentError("unable to determine stateMutability", "value", value);
	    }
	    return result;
	}
	var ConstructorFragment = /** @class */ (function (_super) {
	    __extends(ConstructorFragment, _super);
	    function ConstructorFragment() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ConstructorFragment.prototype.format = function (format) {
	        if (!format) {
	            format = exports.FormatTypes.sighash;
	        }
	        if (!exports.FormatTypes[format]) {
	            logger.throwArgumentError("invalid format type", "format", format);
	        }
	        if (format === exports.FormatTypes.json) {
	            return JSON.stringify({
	                type: "constructor",
	                stateMutability: ((this.stateMutability !== "nonpayable") ? this.stateMutability : undefined),
	                payble: this.payable,
	                gas: (this.gas ? this.gas.toNumber() : undefined),
	                inputs: this.inputs.map(function (input) { return JSON.parse(input.format(format)); })
	            });
	        }
	        if (format === exports.FormatTypes.sighash) {
	            logger.throwError("cannot format a constructor for sighash", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "format(sighash)"
	            });
	        }
	        var result = "constructor(" + this.inputs.map(function (input) { return input.format(format); }).join((format === exports.FormatTypes.full) ? ", " : ",") + ") ";
	        if (this.stateMutability && this.stateMutability !== "nonpayable") {
	            result += this.stateMutability + " ";
	        }
	        return result.trim();
	    };
	    ConstructorFragment.from = function (value) {
	        if (typeof (value) === "string") {
	            return ConstructorFragment.fromString(value);
	        }
	        return ConstructorFragment.fromObject(value);
	    };
	    ConstructorFragment.fromObject = function (value) {
	        if (ConstructorFragment.isConstructorFragment(value)) {
	            return value;
	        }
	        if (value.type !== "constructor") {
	            logger.throwArgumentError("invalid constructor object", "value", value);
	        }
	        var state = verifyState(value);
	        if (state.constant) {
	            logger.throwArgumentError("constructor cannot be constant", "value", value);
	        }
	        var params = {
	            name: null,
	            type: value.type,
	            inputs: (value.inputs ? value.inputs.map(ParamType.fromObject) : []),
	            payable: state.payable,
	            stateMutability: state.stateMutability,
	            gas: (value.gas ? lib$2.BigNumber.from(value.gas) : null)
	        };
	        return new ConstructorFragment(_constructorGuard, params);
	    };
	    ConstructorFragment.fromString = function (value) {
	        var params = { type: "constructor" };
	        value = parseGas(value, params);
	        var parens = value.match(regexParen);
	        if (!parens || parens[1].trim() !== "constructor") {
	            logger.throwArgumentError("invalid constructor string", "value", value);
	        }
	        params.inputs = parseParams(parens[2].trim(), false);
	        parseModifiers(parens[3].trim(), params);
	        return ConstructorFragment.fromObject(params);
	    };
	    ConstructorFragment.isConstructorFragment = function (value) {
	        return (value && value._isFragment && value.type === "constructor");
	    };
	    return ConstructorFragment;
	}(Fragment));
	exports.ConstructorFragment = ConstructorFragment;
	var FunctionFragment = /** @class */ (function (_super) {
	    __extends(FunctionFragment, _super);
	    function FunctionFragment() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    FunctionFragment.prototype.format = function (format) {
	        if (!format) {
	            format = exports.FormatTypes.sighash;
	        }
	        if (!exports.FormatTypes[format]) {
	            logger.throwArgumentError("invalid format type", "format", format);
	        }
	        if (format === exports.FormatTypes.json) {
	            return JSON.stringify({
	                type: "function",
	                name: this.name,
	                constant: this.constant,
	                stateMutability: ((this.stateMutability !== "nonpayable") ? this.stateMutability : undefined),
	                payble: this.payable,
	                gas: (this.gas ? this.gas.toNumber() : undefined),
	                inputs: this.inputs.map(function (input) { return JSON.parse(input.format(format)); }),
	                ouputs: this.outputs.map(function (output) { return JSON.parse(output.format(format)); }),
	            });
	        }
	        var result = "";
	        if (format !== exports.FormatTypes.sighash) {
	            result += "function ";
	        }
	        result += this.name + "(" + this.inputs.map(function (input) { return input.format(format); }).join((format === exports.FormatTypes.full) ? ", " : ",") + ") ";
	        if (format !== exports.FormatTypes.sighash) {
	            if (this.stateMutability) {
	                if (this.stateMutability !== "nonpayable") {
	                    result += (this.stateMutability + " ");
	                }
	            }
	            else if (this.constant) {
	                result += "view ";
	            }
	            if (this.outputs && this.outputs.length) {
	                result += "returns (" + this.outputs.map(function (output) { return output.format(format); }).join(", ") + ") ";
	            }
	            if (this.gas != null) {
	                result += "@" + this.gas.toString() + " ";
	            }
	        }
	        return result.trim();
	    };
	    FunctionFragment.from = function (value) {
	        if (typeof (value) === "string") {
	            return FunctionFragment.fromString(value);
	        }
	        return FunctionFragment.fromObject(value);
	    };
	    FunctionFragment.fromObject = function (value) {
	        if (FunctionFragment.isFunctionFragment(value)) {
	            return value;
	        }
	        if (value.type !== "function") {
	            logger.throwArgumentError("invalid function object", "value", value);
	        }
	        var state = verifyState(value);
	        var params = {
	            type: value.type,
	            name: verifyIdentifier(value.name),
	            constant: state.constant,
	            inputs: (value.inputs ? value.inputs.map(ParamType.fromObject) : []),
	            outputs: (value.outputs ? value.outputs.map(ParamType.fromObject) : []),
	            payable: state.payable,
	            stateMutability: state.stateMutability,
	            gas: (value.gas ? lib$2.BigNumber.from(value.gas) : null)
	        };
	        return new FunctionFragment(_constructorGuard, params);
	    };
	    FunctionFragment.fromString = function (value) {
	        var params = { type: "function" };
	        value = parseGas(value, params);
	        var comps = value.split(" returns ");
	        if (comps.length > 2) {
	            logger.throwArgumentError("invalid function string", "value", value);
	        }
	        var parens = comps[0].match(regexParen);
	        if (!parens) {
	            logger.throwArgumentError("invalid function signature", "value", value);
	        }
	        params.name = parens[1].trim();
	        if (params.name) {
	            verifyIdentifier(params.name);
	        }
	        params.inputs = parseParams(parens[2], false);
	        parseModifiers(parens[3].trim(), params);
	        // We have outputs
	        if (comps.length > 1) {
	            var returns = comps[1].match(regexParen);
	            if (returns[1].trim() != "" || returns[3].trim() != "") {
	                logger.throwArgumentError("unexpected tokens", "value", value);
	            }
	            params.outputs = parseParams(returns[2], false);
	        }
	        else {
	            params.outputs = [];
	        }
	        return FunctionFragment.fromObject(params);
	    };
	    FunctionFragment.isFunctionFragment = function (value) {
	        return (value && value._isFragment && value.type === "function");
	    };
	    return FunctionFragment;
	}(ConstructorFragment));
	exports.FunctionFragment = FunctionFragment;
	//export class ErrorFragment extends Fragment {
	//}
	//export class StructFragment extends Fragment {
	//}
	function verifyType(type) {
	    // These need to be transformed to their full description
	    if (type.match(/^uint($|[^1-9])/)) {
	        type = "uint256" + type.substring(4);
	    }
	    else if (type.match(/^int($|[^1-9])/)) {
	        type = "int256" + type.substring(3);
	    }
	    // @TODO: more verification
	    return type;
	}
	var regexIdentifier = new RegExp("^[A-Za-z_][A-Za-z0-9_]*$");
	function verifyIdentifier(value) {
	    if (!value || !value.match(regexIdentifier)) {
	        logger.throwArgumentError("invalid identifier \"" + value + "\"", "value", value);
	    }
	    return value;
	}
	var regexParen = new RegExp("^([^)(]*)\\((.*)\\)([^)(]*)$");
	function splitNesting(value) {
	    value = value.trim();
	    var result = [];
	    var accum = "";
	    var depth = 0;
	    for (var offset = 0; offset < value.length; offset++) {
	        var c = value[offset];
	        if (c === "," && depth === 0) {
	            result.push(accum);
	            accum = "";
	        }
	        else {
	            accum += c;
	            if (c === "(") {
	                depth++;
	            }
	            else if (c === ")") {
	                depth--;
	                if (depth === -1) {
	                    logger.throwArgumentError("unbalanced parenthesis", "value", value);
	                }
	            }
	        }
	    }
	    if (accum) {
	        result.push(accum);
	    }
	    return result;
	}

	});

	var fragments$1 = unwrapExports(fragments);
	var fragments_1 = fragments.FormatTypes;
	var fragments_2 = fragments.ParamType;
	var fragments_3 = fragments.Fragment;
	var fragments_4 = fragments.EventFragment;
	var fragments_5 = fragments.ConstructorFragment;
	var fragments_6 = fragments.FunctionFragment;

	var abstractCoder = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });





	var logger = new lib.Logger(_version$8.version);
	function checkResultErrors(result) {
	    // Find the first error (if any)
	    var errors = [];
	    var checkErrors = function (path, object) {
	        if (!Array.isArray(object)) {
	            return;
	        }
	        for (var key in object) {
	            var childPath = path.slice();
	            childPath.push(key);
	            try {
	                checkErrors(childPath, object[key]);
	            }
	            catch (error) {
	                errors.push({ path: childPath, error: error });
	            }
	        }
	    };
	    checkErrors([], result);
	    return errors;
	}
	exports.checkResultErrors = checkResultErrors;
	var Coder = /** @class */ (function () {
	    function Coder(name, type, localName, dynamic) {
	        // @TODO: defineReadOnly these
	        this.name = name;
	        this.type = type;
	        this.localName = localName;
	        this.dynamic = dynamic;
	    }
	    Coder.prototype._throwError = function (message, value) {
	        logger.throwArgumentError(message, this.localName, value);
	    };
	    return Coder;
	}());
	exports.Coder = Coder;
	var Writer = /** @class */ (function () {
	    function Writer(wordSize) {
	        lib$3.defineReadOnly(this, "wordSize", wordSize || 32);
	        this._data = lib$1.arrayify([]);
	        this._padding = new Uint8Array(wordSize);
	    }
	    Object.defineProperty(Writer.prototype, "data", {
	        get: function () { return lib$1.hexlify(this._data); },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Writer.prototype, "length", {
	        get: function () { return this._data.length; },
	        enumerable: true,
	        configurable: true
	    });
	    Writer.prototype._writeData = function (data) {
	        this._data = lib$1.concat([this._data, data]);
	        return data.length;
	    };
	    // Arrayish items; padded on the right to wordSize
	    Writer.prototype.writeBytes = function (value) {
	        var bytes = lib$1.arrayify(value);
	        if (bytes.length % this.wordSize) {
	            bytes = lib$1.concat([bytes, this._padding.slice(bytes.length % this.wordSize)]);
	        }
	        return this._writeData(bytes);
	    };
	    Writer.prototype._getValue = function (value) {
	        var bytes = lib$1.arrayify(lib$2.BigNumber.from(value));
	        if (bytes.length > this.wordSize) {
	            logger.throwError("value out-of-bounds", lib.Logger.errors.BUFFER_OVERRUN, {
	                length: this.wordSize,
	                offset: bytes.length
	            });
	        }
	        if (bytes.length % this.wordSize) {
	            bytes = lib$1.concat([this._padding.slice(bytes.length % this.wordSize), bytes]);
	        }
	        return bytes;
	    };
	    // BigNumberish items; padded on the left to wordSize
	    Writer.prototype.writeValue = function (value) {
	        return this._writeData(this._getValue(value));
	    };
	    Writer.prototype.writeUpdatableValue = function () {
	        var _this = this;
	        var offset = this.length;
	        this.writeValue(0);
	        return function (value) {
	            _this._data.set(_this._getValue(value), offset);
	        };
	    };
	    return Writer;
	}());
	exports.Writer = Writer;
	var Reader = /** @class */ (function () {
	    function Reader(data, wordSize, coerceFunc) {
	        lib$3.defineReadOnly(this, "_data", lib$1.arrayify(data));
	        lib$3.defineReadOnly(this, "wordSize", wordSize || 32);
	        lib$3.defineReadOnly(this, "_coerceFunc", coerceFunc);
	        this._offset = 0;
	    }
	    Object.defineProperty(Reader.prototype, "data", {
	        get: function () { return lib$1.hexlify(this._data); },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Reader.prototype, "consumed", {
	        get: function () { return this._offset; },
	        enumerable: true,
	        configurable: true
	    });
	    // The default Coerce function
	    Reader.coerce = function (name, value) {
	        var match = name.match("^u?int([0-9]+)$");
	        if (match && parseInt(match[1]) <= 48) {
	            value = value.toNumber();
	        }
	        return value;
	    };
	    Reader.prototype.coerce = function (name, value) {
	        if (this._coerceFunc) {
	            return this._coerceFunc(name, value);
	        }
	        return Reader.coerce(name, value);
	    };
	    Reader.prototype._peekBytes = function (offset, length) {
	        var alignedLength = Math.ceil(length / this.wordSize) * this.wordSize;
	        if (this._offset + alignedLength > this._data.length) {
	            logger.throwError("data out-of-bounds", lib.Logger.errors.BUFFER_OVERRUN, {
	                length: this._data.length,
	                offset: this._offset + alignedLength
	            });
	        }
	        return this._data.slice(this._offset, this._offset + alignedLength);
	    };
	    Reader.prototype.subReader = function (offset) {
	        return new Reader(this._data.slice(this._offset + offset), this.wordSize, this._coerceFunc);
	    };
	    Reader.prototype.readBytes = function (length) {
	        var bytes = this._peekBytes(0, length);
	        this._offset += bytes.length;
	        // @TODO: Make sure the length..end bytes are all 0?
	        return bytes.slice(0, length);
	    };
	    Reader.prototype.readValue = function () {
	        return lib$2.BigNumber.from(this.readBytes(this.wordSize));
	    };
	    return Reader;
	}());
	exports.Reader = Reader;

	});

	var abstractCoder$1 = unwrapExports(abstractCoder);
	var abstractCoder_1 = abstractCoder.checkResultErrors;
	var abstractCoder_2 = abstractCoder.Coder;
	var abstractCoder_3 = abstractCoder.Writer;
	var abstractCoder_4 = abstractCoder.Reader;

	var sha3 = createCommonjsModule(function (module) {
	/**
	 * [js-sha3]{@link https://github.com/emn178/js-sha3}
	 *
	 * @version 0.5.7
	 * @author Chen, Yi-Cyuan [emn178@gmail.com]
	 * @copyright Chen, Yi-Cyuan 2015-2016
	 * @license MIT
	 */
	/*jslint bitwise: true */
	(function () {
	  'use strict';

	  var root = typeof window === 'object' ? window : {};
	  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
	  if (NODE_JS) {
	    root = commonjsGlobal;
	  }
	  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && 'object' === 'object' && module.exports;
	  var HEX_CHARS = '0123456789abcdef'.split('');
	  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
	  var KECCAK_PADDING = [1, 256, 65536, 16777216];
	  var PADDING = [6, 1536, 393216, 100663296];
	  var SHIFT = [0, 8, 16, 24];
	  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
	            0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
	            2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
	            2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
	            2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
	  var BITS = [224, 256, 384, 512];
	  var SHAKE_BITS = [128, 256];
	  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array'];

	  var createOutputMethod = function (bits, padding, outputType) {
	    return function (message) {
	      return new Keccak(bits, padding, bits).update(message)[outputType]();
	    };
	  };

	  var createShakeOutputMethod = function (bits, padding, outputType) {
	    return function (message, outputBits) {
	      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
	    };
	  };

	  var createMethod = function (bits, padding) {
	    var method = createOutputMethod(bits, padding, 'hex');
	    method.create = function () {
	      return new Keccak(bits, padding, bits);
	    };
	    method.update = function (message) {
	      return method.create().update(message);
	    };
	    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
	      var type = OUTPUT_TYPES[i];
	      method[type] = createOutputMethod(bits, padding, type);
	    }
	    return method;
	  };

	  var createShakeMethod = function (bits, padding) {
	    var method = createShakeOutputMethod(bits, padding, 'hex');
	    method.create = function (outputBits) {
	      return new Keccak(bits, padding, outputBits);
	    };
	    method.update = function (message, outputBits) {
	      return method.create(outputBits).update(message);
	    };
	    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
	      var type = OUTPUT_TYPES[i];
	      method[type] = createShakeOutputMethod(bits, padding, type);
	    }
	    return method;
	  };

	  var algorithms = [
	    {name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod},
	    {name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod},
	    {name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod}
	  ];

	  var methods = {}, methodNames = [];

	  for (var i = 0; i < algorithms.length; ++i) {
	    var algorithm = algorithms[i];
	    var bits  = algorithm.bits;
	    for (var j = 0; j < bits.length; ++j) {
	      var methodName = algorithm.name +'_' + bits[j];
	      methodNames.push(methodName);
	      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
	    }
	  }

	  function Keccak(bits, padding, outputBits) {
	    this.blocks = [];
	    this.s = [];
	    this.padding = padding;
	    this.outputBits = outputBits;
	    this.reset = true;
	    this.block = 0;
	    this.start = 0;
	    this.blockCount = (1600 - (bits << 1)) >> 5;
	    this.byteCount = this.blockCount << 2;
	    this.outputBlocks = outputBits >> 5;
	    this.extraBytes = (outputBits & 31) >> 3;

	    for (var i = 0; i < 50; ++i) {
	      this.s[i] = 0;
	    }
	  }

	  Keccak.prototype.update = function (message) {
	    var notString = typeof message !== 'string';
	    if (notString && message.constructor === ArrayBuffer) {
	      message = new Uint8Array(message);
	    }
	    var length = message.length, blocks = this.blocks, byteCount = this.byteCount,
	      blockCount = this.blockCount, index = 0, s = this.s, i, code;

	    while (index < length) {
	      if (this.reset) {
	        this.reset = false;
	        blocks[0] = this.block;
	        for (i = 1; i < blockCount + 1; ++i) {
	          blocks[i] = 0;
	        }
	      }
	      if (notString) {
	        for (i = this.start; index < length && i < byteCount; ++index) {
	          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
	        }
	      } else {
	        for (i = this.start; index < length && i < byteCount; ++index) {
	          code = message.charCodeAt(index);
	          if (code < 0x80) {
	            blocks[i >> 2] |= code << SHIFT[i++ & 3];
	          } else if (code < 0x800) {
	            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
	          } else if (code < 0xd800 || code >= 0xe000) {
	            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
	          } else {
	            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
	            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
	          }
	        }
	      }
	      this.lastByteIndex = i;
	      if (i >= byteCount) {
	        this.start = i - byteCount;
	        this.block = blocks[blockCount];
	        for (i = 0; i < blockCount; ++i) {
	          s[i] ^= blocks[i];
	        }
	        f(s);
	        this.reset = true;
	      } else {
	        this.start = i;
	      }
	    }
	    return this;
	  };

	  Keccak.prototype.finalize = function () {
	    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
	    blocks[i >> 2] |= this.padding[i & 3];
	    if (this.lastByteIndex === this.byteCount) {
	      blocks[0] = blocks[blockCount];
	      for (i = 1; i < blockCount + 1; ++i) {
	        blocks[i] = 0;
	      }
	    }
	    blocks[blockCount - 1] |= 0x80000000;
	    for (i = 0; i < blockCount; ++i) {
	      s[i] ^= blocks[i];
	    }
	    f(s);
	  };

	  Keccak.prototype.toString = Keccak.prototype.hex = function () {
	    this.finalize();

	    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
	        extraBytes = this.extraBytes, i = 0, j = 0;
	    var hex = '', block;
	    while (j < outputBlocks) {
	      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
	        block = s[i];
	        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
	               HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
	               HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
	               HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
	      }
	      if (j % blockCount === 0) {
	        f(s);
	        i = 0;
	      }
	    }
	    if (extraBytes) {
	      block = s[i];
	      if (extraBytes > 0) {
	        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
	      }
	      if (extraBytes > 1) {
	        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
	      }
	      if (extraBytes > 2) {
	        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
	      }
	    }
	    return hex;
	  };

	  Keccak.prototype.arrayBuffer = function () {
	    this.finalize();

	    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
	        extraBytes = this.extraBytes, i = 0, j = 0;
	    var bytes = this.outputBits >> 3;
	    var buffer;
	    if (extraBytes) {
	      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
	    } else {
	      buffer = new ArrayBuffer(bytes);
	    }
	    var array = new Uint32Array(buffer);
	    while (j < outputBlocks) {
	      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
	        array[j] = s[i];
	      }
	      if (j % blockCount === 0) {
	        f(s);
	      }
	    }
	    if (extraBytes) {
	      array[i] = s[i];
	      buffer = buffer.slice(0, bytes);
	    }
	    return buffer;
	  };

	  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

	  Keccak.prototype.digest = Keccak.prototype.array = function () {
	    this.finalize();

	    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
	        extraBytes = this.extraBytes, i = 0, j = 0;
	    var array = [], offset, block;
	    while (j < outputBlocks) {
	      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
	        offset = j << 2;
	        block = s[i];
	        array[offset] = block & 0xFF;
	        array[offset + 1] = (block >> 8) & 0xFF;
	        array[offset + 2] = (block >> 16) & 0xFF;
	        array[offset + 3] = (block >> 24) & 0xFF;
	      }
	      if (j % blockCount === 0) {
	        f(s);
	      }
	    }
	    if (extraBytes) {
	      offset = j << 2;
	      block = s[i];
	      if (extraBytes > 0) {
	        array[offset] = block & 0xFF;
	      }
	      if (extraBytes > 1) {
	        array[offset + 1] = (block >> 8) & 0xFF;
	      }
	      if (extraBytes > 2) {
	        array[offset + 2] = (block >> 16) & 0xFF;
	      }
	    }
	    return array;
	  };

	  var f = function (s) {
	    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
	        b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
	        b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
	        b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
	    for (n = 0; n < 48; n += 2) {
	      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
	      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
	      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
	      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
	      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
	      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
	      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
	      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
	      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
	      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

	      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
	      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
	      s[0] ^= h;
	      s[1] ^= l;
	      s[10] ^= h;
	      s[11] ^= l;
	      s[20] ^= h;
	      s[21] ^= l;
	      s[30] ^= h;
	      s[31] ^= l;
	      s[40] ^= h;
	      s[41] ^= l;
	      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
	      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
	      s[2] ^= h;
	      s[3] ^= l;
	      s[12] ^= h;
	      s[13] ^= l;
	      s[22] ^= h;
	      s[23] ^= l;
	      s[32] ^= h;
	      s[33] ^= l;
	      s[42] ^= h;
	      s[43] ^= l;
	      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
	      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
	      s[4] ^= h;
	      s[5] ^= l;
	      s[14] ^= h;
	      s[15] ^= l;
	      s[24] ^= h;
	      s[25] ^= l;
	      s[34] ^= h;
	      s[35] ^= l;
	      s[44] ^= h;
	      s[45] ^= l;
	      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
	      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
	      s[6] ^= h;
	      s[7] ^= l;
	      s[16] ^= h;
	      s[17] ^= l;
	      s[26] ^= h;
	      s[27] ^= l;
	      s[36] ^= h;
	      s[37] ^= l;
	      s[46] ^= h;
	      s[47] ^= l;
	      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
	      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
	      s[8] ^= h;
	      s[9] ^= l;
	      s[18] ^= h;
	      s[19] ^= l;
	      s[28] ^= h;
	      s[29] ^= l;
	      s[38] ^= h;
	      s[39] ^= l;
	      s[48] ^= h;
	      s[49] ^= l;

	      b0 = s[0];
	      b1 = s[1];
	      b32 = (s[11] << 4) | (s[10] >>> 28);
	      b33 = (s[10] << 4) | (s[11] >>> 28);
	      b14 = (s[20] << 3) | (s[21] >>> 29);
	      b15 = (s[21] << 3) | (s[20] >>> 29);
	      b46 = (s[31] << 9) | (s[30] >>> 23);
	      b47 = (s[30] << 9) | (s[31] >>> 23);
	      b28 = (s[40] << 18) | (s[41] >>> 14);
	      b29 = (s[41] << 18) | (s[40] >>> 14);
	      b20 = (s[2] << 1) | (s[3] >>> 31);
	      b21 = (s[3] << 1) | (s[2] >>> 31);
	      b2 = (s[13] << 12) | (s[12] >>> 20);
	      b3 = (s[12] << 12) | (s[13] >>> 20);
	      b34 = (s[22] << 10) | (s[23] >>> 22);
	      b35 = (s[23] << 10) | (s[22] >>> 22);
	      b16 = (s[33] << 13) | (s[32] >>> 19);
	      b17 = (s[32] << 13) | (s[33] >>> 19);
	      b48 = (s[42] << 2) | (s[43] >>> 30);
	      b49 = (s[43] << 2) | (s[42] >>> 30);
	      b40 = (s[5] << 30) | (s[4] >>> 2);
	      b41 = (s[4] << 30) | (s[5] >>> 2);
	      b22 = (s[14] << 6) | (s[15] >>> 26);
	      b23 = (s[15] << 6) | (s[14] >>> 26);
	      b4 = (s[25] << 11) | (s[24] >>> 21);
	      b5 = (s[24] << 11) | (s[25] >>> 21);
	      b36 = (s[34] << 15) | (s[35] >>> 17);
	      b37 = (s[35] << 15) | (s[34] >>> 17);
	      b18 = (s[45] << 29) | (s[44] >>> 3);
	      b19 = (s[44] << 29) | (s[45] >>> 3);
	      b10 = (s[6] << 28) | (s[7] >>> 4);
	      b11 = (s[7] << 28) | (s[6] >>> 4);
	      b42 = (s[17] << 23) | (s[16] >>> 9);
	      b43 = (s[16] << 23) | (s[17] >>> 9);
	      b24 = (s[26] << 25) | (s[27] >>> 7);
	      b25 = (s[27] << 25) | (s[26] >>> 7);
	      b6 = (s[36] << 21) | (s[37] >>> 11);
	      b7 = (s[37] << 21) | (s[36] >>> 11);
	      b38 = (s[47] << 24) | (s[46] >>> 8);
	      b39 = (s[46] << 24) | (s[47] >>> 8);
	      b30 = (s[8] << 27) | (s[9] >>> 5);
	      b31 = (s[9] << 27) | (s[8] >>> 5);
	      b12 = (s[18] << 20) | (s[19] >>> 12);
	      b13 = (s[19] << 20) | (s[18] >>> 12);
	      b44 = (s[29] << 7) | (s[28] >>> 25);
	      b45 = (s[28] << 7) | (s[29] >>> 25);
	      b26 = (s[38] << 8) | (s[39] >>> 24);
	      b27 = (s[39] << 8) | (s[38] >>> 24);
	      b8 = (s[48] << 14) | (s[49] >>> 18);
	      b9 = (s[49] << 14) | (s[48] >>> 18);

	      s[0] = b0 ^ (~b2 & b4);
	      s[1] = b1 ^ (~b3 & b5);
	      s[10] = b10 ^ (~b12 & b14);
	      s[11] = b11 ^ (~b13 & b15);
	      s[20] = b20 ^ (~b22 & b24);
	      s[21] = b21 ^ (~b23 & b25);
	      s[30] = b30 ^ (~b32 & b34);
	      s[31] = b31 ^ (~b33 & b35);
	      s[40] = b40 ^ (~b42 & b44);
	      s[41] = b41 ^ (~b43 & b45);
	      s[2] = b2 ^ (~b4 & b6);
	      s[3] = b3 ^ (~b5 & b7);
	      s[12] = b12 ^ (~b14 & b16);
	      s[13] = b13 ^ (~b15 & b17);
	      s[22] = b22 ^ (~b24 & b26);
	      s[23] = b23 ^ (~b25 & b27);
	      s[32] = b32 ^ (~b34 & b36);
	      s[33] = b33 ^ (~b35 & b37);
	      s[42] = b42 ^ (~b44 & b46);
	      s[43] = b43 ^ (~b45 & b47);
	      s[4] = b4 ^ (~b6 & b8);
	      s[5] = b5 ^ (~b7 & b9);
	      s[14] = b14 ^ (~b16 & b18);
	      s[15] = b15 ^ (~b17 & b19);
	      s[24] = b24 ^ (~b26 & b28);
	      s[25] = b25 ^ (~b27 & b29);
	      s[34] = b34 ^ (~b36 & b38);
	      s[35] = b35 ^ (~b37 & b39);
	      s[44] = b44 ^ (~b46 & b48);
	      s[45] = b45 ^ (~b47 & b49);
	      s[6] = b6 ^ (~b8 & b0);
	      s[7] = b7 ^ (~b9 & b1);
	      s[16] = b16 ^ (~b18 & b10);
	      s[17] = b17 ^ (~b19 & b11);
	      s[26] = b26 ^ (~b28 & b20);
	      s[27] = b27 ^ (~b29 & b21);
	      s[36] = b36 ^ (~b38 & b30);
	      s[37] = b37 ^ (~b39 & b31);
	      s[46] = b46 ^ (~b48 & b40);
	      s[47] = b47 ^ (~b49 & b41);
	      s[8] = b8 ^ (~b0 & b2);
	      s[9] = b9 ^ (~b1 & b3);
	      s[18] = b18 ^ (~b10 & b12);
	      s[19] = b19 ^ (~b11 & b13);
	      s[28] = b28 ^ (~b20 & b22);
	      s[29] = b29 ^ (~b21 & b23);
	      s[38] = b38 ^ (~b30 & b32);
	      s[39] = b39 ^ (~b31 & b33);
	      s[48] = b48 ^ (~b40 & b42);
	      s[49] = b49 ^ (~b41 & b43);

	      s[0] ^= RC[n];
	      s[1] ^= RC[n + 1];
	    }
	  };

	  if (COMMON_JS) {
	    module.exports = methods;
	  } else {
	    for (var i = 0; i < methodNames.length; ++i) {
	      root[methodNames[i]] = methods[methodNames[i]];
	    }
	  }
	})();
	});

	var lib$4 = createCommonjsModule(function (module, exports) {
	"use strict";
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var js_sha3_1 = __importDefault(sha3);

	function keccak256(data) {
	    return '0x' + js_sha3_1.default.keccak_256(lib$1.arrayify(data));
	}
	exports.keccak256 = keccak256;

	});

	var index$4 = unwrapExports(lib$4);
	var lib_1$4 = lib$4.keccak256;

	var _version$a = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "rlp/5.0.2";

	});

	var _version$b = unwrapExports(_version$a);
	var _version_1$5 = _version$a.version;

	var lib$5 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	//See: https://github.com/ethereum/wiki/wiki/RLP



	var logger = new lib.Logger(_version$a.version);
	function arrayifyInteger(value) {
	    var result = [];
	    while (value) {
	        result.unshift(value & 0xff);
	        value >>= 8;
	    }
	    return result;
	}
	function unarrayifyInteger(data, offset, length) {
	    var result = 0;
	    for (var i = 0; i < length; i++) {
	        result = (result * 256) + data[offset + i];
	    }
	    return result;
	}
	function _encode(object) {
	    if (Array.isArray(object)) {
	        var payload_1 = [];
	        object.forEach(function (child) {
	            payload_1 = payload_1.concat(_encode(child));
	        });
	        if (payload_1.length <= 55) {
	            payload_1.unshift(0xc0 + payload_1.length);
	            return payload_1;
	        }
	        var length_1 = arrayifyInteger(payload_1.length);
	        length_1.unshift(0xf7 + length_1.length);
	        return length_1.concat(payload_1);
	    }
	    if (!lib$1.isBytesLike(object)) {
	        logger.throwArgumentError("RLP object must be BytesLike", "object", object);
	    }
	    var data = Array.prototype.slice.call(lib$1.arrayify(object));
	    if (data.length === 1 && data[0] <= 0x7f) {
	        return data;
	    }
	    else if (data.length <= 55) {
	        data.unshift(0x80 + data.length);
	        return data;
	    }
	    var length = arrayifyInteger(data.length);
	    length.unshift(0xb7 + length.length);
	    return length.concat(data);
	}
	function encode(object) {
	    return lib$1.hexlify(_encode(object));
	}
	exports.encode = encode;
	function _decodeChildren(data, offset, childOffset, length) {
	    var result = [];
	    while (childOffset < offset + 1 + length) {
	        var decoded = _decode(data, childOffset);
	        result.push(decoded.result);
	        childOffset += decoded.consumed;
	        if (childOffset > offset + 1 + length) {
	            logger.throwError("child data too short", lib.Logger.errors.BUFFER_OVERRUN, {});
	        }
	    }
	    return { consumed: (1 + length), result: result };
	}
	// returns { consumed: number, result: Object }
	function _decode(data, offset) {
	    if (data.length === 0) {
	        logger.throwError("data too short", lib.Logger.errors.BUFFER_OVERRUN, {});
	    }
	    // Array with extra length prefix
	    if (data[offset] >= 0xf8) {
	        var lengthLength = data[offset] - 0xf7;
	        if (offset + 1 + lengthLength > data.length) {
	            logger.throwError("data short segment too short", lib.Logger.errors.BUFFER_OVERRUN, {});
	        }
	        var length_2 = unarrayifyInteger(data, offset + 1, lengthLength);
	        if (offset + 1 + lengthLength + length_2 > data.length) {
	            logger.throwError("data long segment too short", lib.Logger.errors.BUFFER_OVERRUN, {});
	        }
	        return _decodeChildren(data, offset, offset + 1 + lengthLength, lengthLength + length_2);
	    }
	    else if (data[offset] >= 0xc0) {
	        var length_3 = data[offset] - 0xc0;
	        if (offset + 1 + length_3 > data.length) {
	            logger.throwError("data array too short", lib.Logger.errors.BUFFER_OVERRUN, {});
	        }
	        return _decodeChildren(data, offset, offset + 1, length_3);
	    }
	    else if (data[offset] >= 0xb8) {
	        var lengthLength = data[offset] - 0xb7;
	        if (offset + 1 + lengthLength > data.length) {
	            logger.throwError("data array too short", lib.Logger.errors.BUFFER_OVERRUN, {});
	        }
	        var length_4 = unarrayifyInteger(data, offset + 1, lengthLength);
	        if (offset + 1 + lengthLength + length_4 > data.length) {
	            logger.throwError("data array too short", lib.Logger.errors.BUFFER_OVERRUN, {});
	        }
	        var result = lib$1.hexlify(data.slice(offset + 1 + lengthLength, offset + 1 + lengthLength + length_4));
	        return { consumed: (1 + lengthLength + length_4), result: result };
	    }
	    else if (data[offset] >= 0x80) {
	        var length_5 = data[offset] - 0x80;
	        if (offset + 1 + length_5 > data.length) {
	            logger.throwError("data too short", lib.Logger.errors.BUFFER_OVERRUN, {});
	        }
	        var result = lib$1.hexlify(data.slice(offset + 1, offset + 1 + length_5));
	        return { consumed: (1 + length_5), result: result };
	    }
	    return { consumed: 1, result: lib$1.hexlify(data[offset]) };
	}
	function decode(data) {
	    var bytes = lib$1.arrayify(data);
	    var decoded = _decode(bytes, 0);
	    if (decoded.consumed !== bytes.length) {
	        logger.throwArgumentError("invalid rlp data", "data", data);
	    }
	    return decoded.result;
	}
	exports.decode = decode;

	});

	var index$5 = unwrapExports(lib$5);
	var lib_1$5 = lib$5.encode;
	var lib_2$4 = lib$5.decode;

	var _version$c = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "address/5.0.2";

	});

	var _version$d = unwrapExports(_version$c);
	var _version_1$6 = _version$c.version;

	var lib$6 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// We use this for base 36 maths







	var logger = new lib.Logger(_version$c.version);
	function getChecksumAddress(address) {
	    if (!lib$1.isHexString(address, 20)) {
	        logger.throwArgumentError("invalid address", "address", address);
	    }
	    address = address.toLowerCase();
	    var chars = address.substring(2).split("");
	    var expanded = new Uint8Array(40);
	    for (var i = 0; i < 40; i++) {
	        expanded[i] = chars[i].charCodeAt(0);
	    }
	    var hashed = lib$1.arrayify(lib$4.keccak256(expanded));
	    for (var i = 0; i < 40; i += 2) {
	        if ((hashed[i >> 1] >> 4) >= 8) {
	            chars[i] = chars[i].toUpperCase();
	        }
	        if ((hashed[i >> 1] & 0x0f) >= 8) {
	            chars[i + 1] = chars[i + 1].toUpperCase();
	        }
	    }
	    return "0x" + chars.join("");
	}
	// Shims for environments that are missing some required constants and functions
	var MAX_SAFE_INTEGER = 0x1fffffffffffff;
	function log10(x) {
	    if (Math.log10) {
	        return Math.log10(x);
	    }
	    return Math.log(x) / Math.LN10;
	}
	// See: https://en.wikipedia.org/wiki/International_Bank_Account_Number
	// Create lookup table
	var ibanLookup = {};
	for (var i = 0; i < 10; i++) {
	    ibanLookup[String(i)] = String(i);
	}
	for (var i = 0; i < 26; i++) {
	    ibanLookup[String.fromCharCode(65 + i)] = String(10 + i);
	}
	// How many decimal digits can we process? (for 64-bit float, this is 15)
	var safeDigits = Math.floor(log10(MAX_SAFE_INTEGER));
	function ibanChecksum(address) {
	    address = address.toUpperCase();
	    address = address.substring(4) + address.substring(0, 2) + "00";
	    var expanded = address.split("").map(function (c) { return ibanLookup[c]; }).join("");
	    // Javascript can handle integers safely up to 15 (decimal) digits
	    while (expanded.length >= safeDigits) {
	        var block = expanded.substring(0, safeDigits);
	        expanded = parseInt(block, 10) % 97 + expanded.substring(block.length);
	    }
	    var checksum = String(98 - (parseInt(expanded, 10) % 97));
	    while (checksum.length < 2) {
	        checksum = "0" + checksum;
	    }
	    return checksum;
	}
	;
	function getAddress(address) {
	    var result = null;
	    if (typeof (address) !== "string") {
	        logger.throwArgumentError("invalid address", "address", address);
	    }
	    if (address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
	        // Missing the 0x prefix
	        if (address.substring(0, 2) !== "0x") {
	            address = "0x" + address;
	        }
	        result = getChecksumAddress(address);
	        // It is a checksummed address with a bad checksum
	        if (address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && result !== address) {
	            logger.throwArgumentError("bad address checksum", "address", address);
	        }
	        // Maybe ICAP? (we only support direct mode)
	    }
	    else if (address.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
	        // It is an ICAP address with a bad checksum
	        if (address.substring(2, 4) !== ibanChecksum(address)) {
	            logger.throwArgumentError("bad icap checksum", "address", address);
	        }
	        result = (new bn.BN(address.substring(4), 36)).toString(16);
	        while (result.length < 40) {
	            result = "0" + result;
	        }
	        result = getChecksumAddress("0x" + result);
	    }
	    else {
	        logger.throwArgumentError("invalid address", "address", address);
	    }
	    return result;
	}
	exports.getAddress = getAddress;
	function isAddress(address) {
	    try {
	        getAddress(address);
	        return true;
	    }
	    catch (error) { }
	    return false;
	}
	exports.isAddress = isAddress;
	function getIcapAddress(address) {
	    var base36 = (new bn.BN(getAddress(address).substring(2), 16)).toString(36).toUpperCase();
	    while (base36.length < 30) {
	        base36 = "0" + base36;
	    }
	    return "XE" + ibanChecksum("XE00" + base36) + base36;
	}
	exports.getIcapAddress = getIcapAddress;
	// http://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed
	function getContractAddress(transaction) {
	    var from = null;
	    try {
	        from = getAddress(transaction.from);
	    }
	    catch (error) {
	        logger.throwArgumentError("missing from address", "transaction", transaction);
	    }
	    var nonce = lib$1.stripZeros(lib$1.arrayify(lib$2.BigNumber.from(transaction.nonce).toHexString()));
	    return getAddress(lib$1.hexDataSlice(lib$4.keccak256(lib$5.encode([from, nonce])), 12));
	}
	exports.getContractAddress = getContractAddress;
	function getCreate2Address(from, salt, initCodeHash) {
	    if (lib$1.hexDataLength(salt) !== 32) {
	        logger.throwArgumentError("salt must be 32 bytes", "salt", salt);
	    }
	    if (lib$1.hexDataLength(initCodeHash) !== 32) {
	        logger.throwArgumentError("initCodeHash must be 32 bytes", "initCodeHash", initCodeHash);
	    }
	    return getAddress(lib$1.hexDataSlice(lib$4.keccak256(lib$1.concat(["0xff", getAddress(from), salt, initCodeHash])), 12));
	}
	exports.getCreate2Address = getCreate2Address;

	});

	var index$6 = unwrapExports(lib$6);
	var lib_1$6 = lib$6.getAddress;
	var lib_2$5 = lib$6.isAddress;
	var lib_3$4 = lib$6.getIcapAddress;
	var lib_4$3 = lib$6.getContractAddress;
	var lib_5$3 = lib$6.getCreate2Address;

	var address = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });



	var AddressCoder = /** @class */ (function (_super) {
	    __extends(AddressCoder, _super);
	    function AddressCoder(localName) {
	        return _super.call(this, "address", "address", localName, false) || this;
	    }
	    AddressCoder.prototype.encode = function (writer, value) {
	        try {
	            lib$6.getAddress(value);
	        }
	        catch (error) {
	            this._throwError(error.message, value);
	        }
	        return writer.writeValue(value);
	    };
	    AddressCoder.prototype.decode = function (reader) {
	        return lib$6.getAddress(lib$1.hexZeroPad(reader.readValue().toHexString(), 20));
	    };
	    return AddressCoder;
	}(abstractCoder.Coder));
	exports.AddressCoder = AddressCoder;

	});

	var address$1 = unwrapExports(address);
	var address_2 = address.AddressCoder;

	var anonymous = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });

	// Clones the functionality of an existing Coder, but without a localName
	var AnonymousCoder = /** @class */ (function (_super) {
	    __extends(AnonymousCoder, _super);
	    function AnonymousCoder(coder) {
	        var _this = _super.call(this, coder.name, coder.type, undefined, coder.dynamic) || this;
	        _this.coder = coder;
	        return _this;
	    }
	    AnonymousCoder.prototype.encode = function (writer, value) {
	        return this.coder.encode(writer, value);
	    };
	    AnonymousCoder.prototype.decode = function (reader) {
	        return this.coder.decode(reader);
	    };
	    return AnonymousCoder;
	}(abstractCoder.Coder));
	exports.AnonymousCoder = AnonymousCoder;

	});

	var anonymous$1 = unwrapExports(anonymous);
	var anonymous_1 = anonymous.AnonymousCoder;

	var array = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });


	var logger = new lib.Logger(_version$8.version);


	function pack(writer, coders, values) {
	    var arrayValues = null;
	    if (Array.isArray(values)) {
	        arrayValues = values;
	    }
	    else if (values && typeof (values) === "object") {
	        var unique_1 = {};
	        arrayValues = coders.map(function (coder) {
	            var name = coder.localName;
	            if (!name) {
	                logger.throwError("cannot encode object for signature with missing names", lib.Logger.errors.INVALID_ARGUMENT, {
	                    argument: "values",
	                    coder: coder,
	                    value: values
	                });
	            }
	            if (unique_1[name]) {
	                logger.throwError("cannot encode object for signature with duplicate names", lib.Logger.errors.INVALID_ARGUMENT, {
	                    argument: "values",
	                    coder: coder,
	                    value: values
	                });
	            }
	            unique_1[name] = true;
	            return values[name];
	        });
	    }
	    else {
	        logger.throwArgumentError("invalid tuple value", "tuple", values);
	    }
	    if (coders.length !== arrayValues.length) {
	        logger.throwArgumentError("types/value length mismatch", "tuple", values);
	    }
	    var staticWriter = new abstractCoder.Writer(writer.wordSize);
	    var dynamicWriter = new abstractCoder.Writer(writer.wordSize);
	    var updateFuncs = [];
	    coders.forEach(function (coder, index) {
	        var value = arrayValues[index];
	        if (coder.dynamic) {
	            // Get current dynamic offset (for the future pointer)
	            var dynamicOffset_1 = dynamicWriter.length;
	            // Encode the dynamic value into the dynamicWriter
	            coder.encode(dynamicWriter, value);
	            // Prepare to populate the correct offset once we are done
	            var updateFunc_1 = staticWriter.writeUpdatableValue();
	            updateFuncs.push(function (baseOffset) {
	                updateFunc_1(baseOffset + dynamicOffset_1);
	            });
	        }
	        else {
	            coder.encode(staticWriter, value);
	        }
	    });
	    // Backfill all the dynamic offsets, now that we know the static length
	    updateFuncs.forEach(function (func) { func(staticWriter.length); });
	    var length = writer.writeBytes(staticWriter.data);
	    length += writer.writeBytes(dynamicWriter.data);
	    return length;
	}
	exports.pack = pack;
	function unpack(reader, coders) {
	    var values = [];
	    // A reader anchored to this base
	    var baseReader = reader.subReader(0);
	    // The amount of dynamic data read; to consume later to synchronize
	    var dynamicLength = 0;
	    coders.forEach(function (coder) {
	        var value = null;
	        if (coder.dynamic) {
	            var offset = reader.readValue();
	            var offsetReader = baseReader.subReader(offset.toNumber());
	            try {
	                value = coder.decode(offsetReader);
	            }
	            catch (error) {
	                // Cannot recover from this
	                if (error.code === lib.Logger.errors.BUFFER_OVERRUN) {
	                    throw error;
	                }
	                value = error;
	                value.baseType = coder.name;
	                value.name = coder.localName;
	                value.type = coder.type;
	            }
	            dynamicLength += offsetReader.consumed;
	        }
	        else {
	            try {
	                value = coder.decode(reader);
	            }
	            catch (error) {
	                // Cannot recover from this
	                if (error.code === lib.Logger.errors.BUFFER_OVERRUN) {
	                    throw error;
	                }
	                value = error;
	                value.baseType = coder.name;
	                value.name = coder.localName;
	                value.type = coder.type;
	            }
	        }
	        if (value != undefined) {
	            values.push(value);
	        }
	    });
	    // @TODO: get rid of this an see if it still works?
	    // Consume the dynamic components in the main reader
	    reader.readBytes(dynamicLength);
	    // We only output named properties for uniquely named coders
	    var uniqueNames = coders.reduce(function (accum, coder) {
	        var name = coder.localName;
	        if (name) {
	            if (!accum[name]) {
	                accum[name] = 0;
	            }
	            accum[name]++;
	        }
	        return accum;
	    }, {});
	    // Add any named parameters (i.e. tuples)
	    coders.forEach(function (coder, index) {
	        var name = coder.localName;
	        if (!name || uniqueNames[name] !== 1) {
	            return;
	        }
	        if (name === "length") {
	            name = "_length";
	        }
	        if (values[name] != null) {
	            return;
	        }
	        var value = values[index];
	        if (value instanceof Error) {
	            Object.defineProperty(values, name, {
	                get: function () { throw value; }
	            });
	        }
	        else {
	            values[name] = value;
	        }
	    });
	    var _loop_1 = function (i) {
	        var value = values[i];
	        if (value instanceof Error) {
	            Object.defineProperty(values, i, {
	                get: function () { throw value; }
	            });
	        }
	    };
	    for (var i = 0; i < values.length; i++) {
	        _loop_1(i);
	    }
	    return Object.freeze(values);
	}
	exports.unpack = unpack;
	var ArrayCoder = /** @class */ (function (_super) {
	    __extends(ArrayCoder, _super);
	    function ArrayCoder(coder, length, localName) {
	        var _this = this;
	        var type = (coder.type + "[" + (length >= 0 ? length : "") + "]");
	        var dynamic = (length === -1 || coder.dynamic);
	        _this = _super.call(this, "array", type, localName, dynamic) || this;
	        _this.coder = coder;
	        _this.length = length;
	        return _this;
	    }
	    ArrayCoder.prototype.encode = function (writer, value) {
	        if (!Array.isArray(value)) {
	            this._throwError("expected array value", value);
	        }
	        var count = this.length;
	        if (count === -1) {
	            count = value.length;
	            writer.writeValue(value.length);
	        }
	        logger.checkArgumentCount(count, value.length, "coder array" + (this.localName ? (" " + this.localName) : ""));
	        var coders = [];
	        for (var i = 0; i < value.length; i++) {
	            coders.push(this.coder);
	        }
	        return pack(writer, coders, value);
	    };
	    ArrayCoder.prototype.decode = function (reader) {
	        var count = this.length;
	        if (count === -1) {
	            count = reader.readValue().toNumber();
	        }
	        var coders = [];
	        for (var i = 0; i < count; i++) {
	            coders.push(new anonymous.AnonymousCoder(this.coder));
	        }
	        return reader.coerce(this.name, unpack(reader, coders));
	    };
	    return ArrayCoder;
	}(abstractCoder.Coder));
	exports.ArrayCoder = ArrayCoder;

	});

	var array$1 = unwrapExports(array);
	var array_1 = array.pack;
	var array_2 = array.unpack;
	var array_3 = array.ArrayCoder;

	var boolean_1 = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });

	var BooleanCoder = /** @class */ (function (_super) {
	    __extends(BooleanCoder, _super);
	    function BooleanCoder(localName) {
	        return _super.call(this, "bool", "bool", localName, false) || this;
	    }
	    BooleanCoder.prototype.encode = function (writer, value) {
	        return writer.writeValue(value ? 1 : 0);
	    };
	    BooleanCoder.prototype.decode = function (reader) {
	        return reader.coerce(this.type, !reader.readValue().isZero());
	    };
	    return BooleanCoder;
	}(abstractCoder.Coder));
	exports.BooleanCoder = BooleanCoder;

	});

	var boolean = unwrapExports(boolean_1);
	var boolean_2 = boolean_1.BooleanCoder;

	var bytes = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });


	var DynamicBytesCoder = /** @class */ (function (_super) {
	    __extends(DynamicBytesCoder, _super);
	    function DynamicBytesCoder(type, localName) {
	        return _super.call(this, type, type, localName, true) || this;
	    }
	    DynamicBytesCoder.prototype.encode = function (writer, value) {
	        value = lib$1.arrayify(value);
	        var length = writer.writeValue(value.length);
	        length += writer.writeBytes(value);
	        return length;
	    };
	    DynamicBytesCoder.prototype.decode = function (reader) {
	        return reader.readBytes(reader.readValue().toNumber());
	    };
	    return DynamicBytesCoder;
	}(abstractCoder.Coder));
	exports.DynamicBytesCoder = DynamicBytesCoder;
	var BytesCoder = /** @class */ (function (_super) {
	    __extends(BytesCoder, _super);
	    function BytesCoder(localName) {
	        return _super.call(this, "bytes", localName) || this;
	    }
	    BytesCoder.prototype.decode = function (reader) {
	        return reader.coerce(this.name, lib$1.hexlify(_super.prototype.decode.call(this, reader)));
	    };
	    return BytesCoder;
	}(DynamicBytesCoder));
	exports.BytesCoder = BytesCoder;

	});

	var bytes$1 = unwrapExports(bytes);
	var bytes_2 = bytes.DynamicBytesCoder;
	var bytes_3 = bytes.BytesCoder;

	var fixedBytes = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });


	// @TODO: Merge this with bytes
	var FixedBytesCoder = /** @class */ (function (_super) {
	    __extends(FixedBytesCoder, _super);
	    function FixedBytesCoder(size, localName) {
	        var _this = this;
	        var name = "bytes" + String(size);
	        _this = _super.call(this, name, name, localName, false) || this;
	        _this.size = size;
	        return _this;
	    }
	    FixedBytesCoder.prototype.encode = function (writer, value) {
	        var data = lib$1.arrayify(value);
	        if (data.length !== this.size) {
	            this._throwError("incorrect data length", value);
	        }
	        return writer.writeBytes(data);
	    };
	    FixedBytesCoder.prototype.decode = function (reader) {
	        return reader.coerce(this.name, lib$1.hexlify(reader.readBytes(this.size)));
	    };
	    return FixedBytesCoder;
	}(abstractCoder.Coder));
	exports.FixedBytesCoder = FixedBytesCoder;

	});

	var fixedBytes$1 = unwrapExports(fixedBytes);
	var fixedBytes_1 = fixedBytes.FixedBytesCoder;

	var _null = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });

	var NullCoder = /** @class */ (function (_super) {
	    __extends(NullCoder, _super);
	    function NullCoder(localName) {
	        return _super.call(this, "null", "", localName, false) || this;
	    }
	    NullCoder.prototype.encode = function (writer, value) {
	        if (value != null) {
	            this._throwError("not null", value);
	        }
	        return writer.writeBytes([]);
	    };
	    NullCoder.prototype.decode = function (reader) {
	        reader.readBytes(0);
	        return reader.coerce(this.name, null);
	    };
	    return NullCoder;
	}(abstractCoder.Coder));
	exports.NullCoder = NullCoder;

	});

	var _null$1 = unwrapExports(_null);
	var _null_1 = _null.NullCoder;

	var lib$7 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });

	var AddressZero = "0x0000000000000000000000000000000000000000";
	exports.AddressZero = AddressZero;
	var HashZero = "0x0000000000000000000000000000000000000000000000000000000000000000";
	exports.HashZero = HashZero;
	// NFKC (composed)             // (decomposed)
	var EtherSymbol = "\u039e"; // "\uD835\uDF63";
	exports.EtherSymbol = EtherSymbol;
	var NegativeOne = lib$2.BigNumber.from(-1);
	exports.NegativeOne = NegativeOne;
	var Zero = lib$2.BigNumber.from(0);
	exports.Zero = Zero;
	var One = lib$2.BigNumber.from(1);
	exports.One = One;
	var Two = lib$2.BigNumber.from(2);
	exports.Two = Two;
	var WeiPerEther = lib$2.BigNumber.from("1000000000000000000");
	exports.WeiPerEther = WeiPerEther;
	var MaxUint256 = lib$2.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
	exports.MaxUint256 = MaxUint256;

	});

	var index$7 = unwrapExports(lib$7);
	var lib_1$7 = lib$7.AddressZero;
	var lib_2$6 = lib$7.HashZero;
	var lib_3$5 = lib$7.EtherSymbol;
	var lib_4$4 = lib$7.NegativeOne;
	var lib_5$4 = lib$7.Zero;
	var lib_6$2 = lib$7.One;
	var lib_7$2 = lib$7.Two;
	var lib_8$1 = lib$7.WeiPerEther;
	var lib_9$1 = lib$7.MaxUint256;

	var number = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });



	var NumberCoder = /** @class */ (function (_super) {
	    __extends(NumberCoder, _super);
	    function NumberCoder(size, signed, localName) {
	        var _this = this;
	        var name = ((signed ? "int" : "uint") + (size * 8));
	        _this = _super.call(this, name, name, localName, false) || this;
	        _this.size = size;
	        _this.signed = signed;
	        return _this;
	    }
	    NumberCoder.prototype.encode = function (writer, value) {
	        var v = lib$2.BigNumber.from(value);
	        // Check bounds are safe for encoding
	        var maxUintValue = lib$7.MaxUint256.mask(writer.wordSize * 8);
	        if (this.signed) {
	            var bounds = maxUintValue.mask(this.size * 8 - 1);
	            if (v.gt(bounds) || v.lt(bounds.add(lib$7.One).mul(lib$7.NegativeOne))) {
	                this._throwError("value out-of-bounds", value);
	            }
	        }
	        else if (v.lt(lib$7.Zero) || v.gt(maxUintValue.mask(this.size * 8))) {
	            this._throwError("value out-of-bounds", value);
	        }
	        v = v.toTwos(this.size * 8).mask(this.size * 8);
	        if (this.signed) {
	            v = v.fromTwos(this.size * 8).toTwos(8 * writer.wordSize);
	        }
	        return writer.writeValue(v);
	    };
	    NumberCoder.prototype.decode = function (reader) {
	        var value = reader.readValue().mask(this.size * 8);
	        if (this.signed) {
	            value = value.fromTwos(this.size * 8);
	        }
	        return reader.coerce(this.name, value);
	    };
	    return NumberCoder;
	}(abstractCoder.Coder));
	exports.NumberCoder = NumberCoder;

	});

	var number$1 = unwrapExports(number);
	var number_1 = number.NumberCoder;

	var _version$e = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "strings/5.0.2";

	});

	var _version$f = unwrapExports(_version$e);
	var _version_1$7 = _version$e.version;

	var utf8 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$e.version);
	///////////////////////////////
	var UnicodeNormalizationForm;
	(function (UnicodeNormalizationForm) {
	    UnicodeNormalizationForm["current"] = "";
	    UnicodeNormalizationForm["NFC"] = "NFC";
	    UnicodeNormalizationForm["NFD"] = "NFD";
	    UnicodeNormalizationForm["NFKC"] = "NFKC";
	    UnicodeNormalizationForm["NFKD"] = "NFKD";
	})(UnicodeNormalizationForm = exports.UnicodeNormalizationForm || (exports.UnicodeNormalizationForm = {}));
	;
	var Utf8ErrorReason;
	(function (Utf8ErrorReason) {
	    // A continuation byte was present where there was nothing to continue
	    // - offset = the index the codepoint began in
	    Utf8ErrorReason["UNEXPECTED_CONTINUE"] = "unexpected continuation byte";
	    // An invalid (non-continuation) byte to start a UTF-8 codepoint was found
	    // - offset = the index the codepoint began in
	    Utf8ErrorReason["BAD_PREFIX"] = "bad codepoint prefix";
	    // The string is too short to process the expected codepoint
	    // - offset = the index the codepoint began in
	    Utf8ErrorReason["OVERRUN"] = "string overrun";
	    // A missing continuation byte was expected but not found
	    // - offset = the index the continuation byte was expected at
	    Utf8ErrorReason["MISSING_CONTINUE"] = "missing continuation byte";
	    // The computed code point is outside the range for UTF-8
	    // - offset       = start of this codepoint
	    // - badCodepoint = the computed codepoint; outside the UTF-8 range
	    Utf8ErrorReason["OUT_OF_RANGE"] = "out of UTF-8 range";
	    // UTF-8 strings may not contain UTF-16 surrogate pairs
	    // - offset       = start of this codepoint
	    // - badCodepoint = the computed codepoint; inside the UTF-16 surrogate range
	    Utf8ErrorReason["UTF16_SURROGATE"] = "UTF-16 surrogate";
	    // The string is an overlong reperesentation
	    // - offset       = start of this codepoint
	    // - badCodepoint = the computed codepoint; already bounds checked
	    Utf8ErrorReason["OVERLONG"] = "overlong representation";
	})(Utf8ErrorReason = exports.Utf8ErrorReason || (exports.Utf8ErrorReason = {}));
	;
	function errorFunc(reason, offset, bytes, output, badCodepoint) {
	    return logger.throwArgumentError("invalid codepoint at offset " + offset + "; " + reason, "bytes", bytes);
	}
	function ignoreFunc(reason, offset, bytes, output, badCodepoint) {
	    // If there is an invalid prefix (including stray continuation), skip any additional continuation bytes
	    if (reason === Utf8ErrorReason.BAD_PREFIX || reason === Utf8ErrorReason.UNEXPECTED_CONTINUE) {
	        var i = 0;
	        for (var o = offset + 1; o < bytes.length; o++) {
	            if (bytes[o] >> 6 !== 0x02) {
	                break;
	            }
	            i++;
	        }
	        return i;
	    }
	    // This byte runs us past the end of the string, so just jump to the end
	    // (but the first byte was read already read and therefore skipped)
	    if (reason === Utf8ErrorReason.OVERRUN) {
	        return bytes.length - offset - 1;
	    }
	    // Nothing to skip
	    return 0;
	}
	function replaceFunc(reason, offset, bytes, output, badCodepoint) {
	    // Overlong representations are otherwise "valid" code points; just non-deistingtished
	    if (reason === Utf8ErrorReason.OVERLONG) {
	        output.push(badCodepoint);
	        return 0;
	    }
	    // Put the replacement character into the output
	    output.push(0xfffd);
	    // Otherwise, process as if ignoring errors
	    return ignoreFunc(reason, offset, bytes, output, badCodepoint);
	}
	// Common error handing strategies
	exports.Utf8ErrorFuncs = Object.freeze({
	    error: errorFunc,
	    ignore: ignoreFunc,
	    replace: replaceFunc
	});
	// http://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript#13691499
	function getUtf8CodePoints(bytes, onError) {
	    if (onError == null) {
	        onError = exports.Utf8ErrorFuncs.error;
	    }
	    bytes = lib$1.arrayify(bytes);
	    var result = [];
	    var i = 0;
	    // Invalid bytes are ignored
	    while (i < bytes.length) {
	        var c = bytes[i++];
	        // 0xxx xxxx
	        if (c >> 7 === 0) {
	            result.push(c);
	            continue;
	        }
	        // Multibyte; how many bytes left for this character?
	        var extraLength = null;
	        var overlongMask = null;
	        // 110x xxxx 10xx xxxx
	        if ((c & 0xe0) === 0xc0) {
	            extraLength = 1;
	            overlongMask = 0x7f;
	            // 1110 xxxx 10xx xxxx 10xx xxxx
	        }
	        else if ((c & 0xf0) === 0xe0) {
	            extraLength = 2;
	            overlongMask = 0x7ff;
	            // 1111 0xxx 10xx xxxx 10xx xxxx 10xx xxxx
	        }
	        else if ((c & 0xf8) === 0xf0) {
	            extraLength = 3;
	            overlongMask = 0xffff;
	        }
	        else {
	            if ((c & 0xc0) === 0x80) {
	                i += onError(Utf8ErrorReason.UNEXPECTED_CONTINUE, i - 1, bytes, result);
	            }
	            else {
	                i += onError(Utf8ErrorReason.BAD_PREFIX, i - 1, bytes, result);
	            }
	            continue;
	        }
	        // Do we have enough bytes in our data?
	        if (i - 1 + extraLength >= bytes.length) {
	            i += onError(Utf8ErrorReason.OVERRUN, i - 1, bytes, result);
	            continue;
	        }
	        // Remove the length prefix from the char
	        var res = c & ((1 << (8 - extraLength - 1)) - 1);
	        for (var j = 0; j < extraLength; j++) {
	            var nextChar = bytes[i];
	            // Invalid continuation byte
	            if ((nextChar & 0xc0) != 0x80) {
	                i += onError(Utf8ErrorReason.MISSING_CONTINUE, i, bytes, result);
	                res = null;
	                break;
	            }
	            ;
	            res = (res << 6) | (nextChar & 0x3f);
	            i++;
	        }
	        // See above loop for invalid contimuation byte
	        if (res === null) {
	            continue;
	        }
	        // Maximum code point
	        if (res > 0x10ffff) {
	            i += onError(Utf8ErrorReason.OUT_OF_RANGE, i - 1 - extraLength, bytes, result, res);
	            continue;
	        }
	        // Reserved for UTF-16 surrogate halves
	        if (res >= 0xd800 && res <= 0xdfff) {
	            i += onError(Utf8ErrorReason.UTF16_SURROGATE, i - 1 - extraLength, bytes, result, res);
	            continue;
	        }
	        // Check for overlong sequences (more bytes than needed)
	        if (res <= overlongMask) {
	            i += onError(Utf8ErrorReason.OVERLONG, i - 1 - extraLength, bytes, result, res);
	            continue;
	        }
	        result.push(res);
	    }
	    return result;
	}
	// http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
	function toUtf8Bytes(str, form) {
	    if (form === void 0) { form = UnicodeNormalizationForm.current; }
	    if (form != UnicodeNormalizationForm.current) {
	        logger.checkNormalize();
	        str = str.normalize(form);
	    }
	    var result = [];
	    for (var i = 0; i < str.length; i++) {
	        var c = str.charCodeAt(i);
	        if (c < 0x80) {
	            result.push(c);
	        }
	        else if (c < 0x800) {
	            result.push((c >> 6) | 0xc0);
	            result.push((c & 0x3f) | 0x80);
	        }
	        else if ((c & 0xfc00) == 0xd800) {
	            i++;
	            var c2 = str.charCodeAt(i);
	            if (i >= str.length || (c2 & 0xfc00) !== 0xdc00) {
	                throw new Error("invalid utf-8 string");
	            }
	            // Surrogate Pair
	            var pair = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
	            result.push((pair >> 18) | 0xf0);
	            result.push(((pair >> 12) & 0x3f) | 0x80);
	            result.push(((pair >> 6) & 0x3f) | 0x80);
	            result.push((pair & 0x3f) | 0x80);
	        }
	        else {
	            result.push((c >> 12) | 0xe0);
	            result.push(((c >> 6) & 0x3f) | 0x80);
	            result.push((c & 0x3f) | 0x80);
	        }
	    }
	    return lib$1.arrayify(result);
	}
	exports.toUtf8Bytes = toUtf8Bytes;
	;
	function escapeChar(value) {
	    var hex = ("0000" + value.toString(16));
	    return "\\u" + hex.substring(hex.length - 4);
	}
	function _toEscapedUtf8String(bytes, onError) {
	    return '"' + getUtf8CodePoints(bytes, onError).map(function (codePoint) {
	        if (codePoint < 256) {
	            switch (codePoint) {
	                case 8: return "\\b";
	                case 9: return "\\t";
	                case 10: return "\\n";
	                case 13: return "\\r";
	                case 34: return "\\\"";
	                case 92: return "\\\\";
	            }
	            if (codePoint >= 32 && codePoint < 127) {
	                return String.fromCharCode(codePoint);
	            }
	        }
	        if (codePoint <= 0xffff) {
	            return escapeChar(codePoint);
	        }
	        codePoint -= 0x10000;
	        return escapeChar(((codePoint >> 10) & 0x3ff) + 0xd800) + escapeChar((codePoint & 0x3ff) + 0xdc00);
	    }).join("") + '"';
	}
	exports._toEscapedUtf8String = _toEscapedUtf8String;
	function _toUtf8String(codePoints) {
	    return codePoints.map(function (codePoint) {
	        if (codePoint <= 0xffff) {
	            return String.fromCharCode(codePoint);
	        }
	        codePoint -= 0x10000;
	        return String.fromCharCode((((codePoint >> 10) & 0x3ff) + 0xd800), ((codePoint & 0x3ff) + 0xdc00));
	    }).join("");
	}
	exports._toUtf8String = _toUtf8String;
	function toUtf8String(bytes, onError) {
	    return _toUtf8String(getUtf8CodePoints(bytes, onError));
	}
	exports.toUtf8String = toUtf8String;
	function toUtf8CodePoints(str, form) {
	    if (form === void 0) { form = UnicodeNormalizationForm.current; }
	    return getUtf8CodePoints(toUtf8Bytes(str, form));
	}
	exports.toUtf8CodePoints = toUtf8CodePoints;

	});

	var utf8$1 = unwrapExports(utf8);
	var utf8_1 = utf8.UnicodeNormalizationForm;
	var utf8_2 = utf8.Utf8ErrorReason;
	var utf8_3 = utf8.Utf8ErrorFuncs;
	var utf8_4 = utf8.toUtf8Bytes;
	var utf8_5 = utf8._toEscapedUtf8String;
	var utf8_6 = utf8._toUtf8String;
	var utf8_7 = utf8.toUtf8String;
	var utf8_8 = utf8.toUtf8CodePoints;

	var bytes32 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });



	function formatBytes32String(text) {
	    // Get the bytes
	    var bytes = utf8.toUtf8Bytes(text);
	    // Check we have room for null-termination
	    if (bytes.length > 31) {
	        throw new Error("bytes32 string must be less than 32 bytes");
	    }
	    // Zero-pad (implicitly null-terminates)
	    return lib$1.hexlify(lib$1.concat([bytes, lib$7.HashZero]).slice(0, 32));
	}
	exports.formatBytes32String = formatBytes32String;
	function parseBytes32String(bytes) {
	    var data = lib$1.arrayify(bytes);
	    // Must be 32 bytes with a null-termination
	    if (data.length !== 32) {
	        throw new Error("invalid bytes32 - not 32 bytes long");
	    }
	    if (data[31] !== 0) {
	        throw new Error("invalid bytes32 string - no null terminator");
	    }
	    // Find the null termination
	    var length = 31;
	    while (data[length - 1] === 0) {
	        length--;
	    }
	    // Determine the string value
	    return utf8.toUtf8String(data.slice(0, length));
	}
	exports.parseBytes32String = parseBytes32String;

	});

	var bytes32$1 = unwrapExports(bytes32);
	var bytes32_1 = bytes32.formatBytes32String;
	var bytes32_2 = bytes32.parseBytes32String;

	var idna = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });

	function bytes2(data) {
	    if ((data.length % 4) !== 0) {
	        throw new Error("bad data");
	    }
	    var result = [];
	    for (var i = 0; i < data.length; i += 4) {
	        result.push(parseInt(data.substring(i, i + 4), 16));
	    }
	    return result;
	}
	function createTable(data, func) {
	    if (!func) {
	        func = function (value) { return [parseInt(value, 16)]; };
	    }
	    var lo = 0;
	    var result = {};
	    data.split(",").forEach(function (pair) {
	        var comps = pair.split(":");
	        lo += parseInt(comps[0], 16);
	        result[lo] = func(comps[1]);
	    });
	    return result;
	}
	function createRangeTable(data) {
	    var hi = 0;
	    return data.split(",").map(function (v) {
	        var comps = v.split("-");
	        if (comps.length === 1) {
	            comps[1] = "0";
	        }
	        else if (comps[1] === "") {
	            comps[1] = "1";
	        }
	        var lo = hi + parseInt(comps[0], 16);
	        hi = parseInt(comps[1], 16);
	        return { l: lo, h: hi };
	    });
	}
	function matchMap(value, ranges) {
	    var lo = 0;
	    for (var i = 0; i < ranges.length; i++) {
	        var range = ranges[i];
	        lo += range.l;
	        if (value >= lo && value <= lo + range.h && ((value - lo) % (range.d || 1)) === 0) {
	            if (range.e && range.e.indexOf(value - lo) !== -1) {
	                continue;
	            }
	            return range;
	        }
	    }
	    return null;
	}
	var Table_A_1_ranges = createRangeTable("221,13-1b,5f-,40-10,51-f,11-3,3-3,2-2,2-4,8,2,15,2d,28-8,88,48,27-,3-5,11-20,27-,8,28,3-5,12,18,b-a,1c-4,6-16,2-d,2-2,2,1b-4,17-9,8f-,10,f,1f-2,1c-34,33-14e,4,36-,13-,6-2,1a-f,4,9-,3-,17,8,2-2,5-,2,8-,3-,4-8,2-3,3,6-,16-6,2-,7-3,3-,17,8,3,3,3-,2,6-3,3-,4-a,5,2-6,10-b,4,8,2,4,17,8,3,6-,b,4,4-,2-e,2-4,b-10,4,9-,3-,17,8,3-,5-,9-2,3-,4-7,3-3,3,4-3,c-10,3,7-2,4,5-2,3,2,3-2,3-2,4-2,9,4-3,6-2,4,5-8,2-e,d-d,4,9,4,18,b,6-3,8,4,5-6,3-8,3-3,b-11,3,9,4,18,b,6-3,8,4,5-6,3-6,2,3-3,b-11,3,9,4,18,11-3,7-,4,5-8,2-7,3-3,b-11,3,13-2,19,a,2-,8-2,2-3,7,2,9-11,4-b,3b-3,1e-24,3,2-,3,2-,2-5,5,8,4,2,2-,3,e,4-,6,2,7-,b-,3-21,49,23-5,1c-3,9,25,10-,2-2f,23,6,3,8-2,5-5,1b-45,27-9,2a-,2-3,5b-4,45-4,53-5,8,40,2,5-,8,2,5-,28,2,5-,20,2,5-,8,2,5-,8,8,18,20,2,5-,8,28,14-5,1d-22,56-b,277-8,1e-2,52-e,e,8-a,18-8,15-b,e,4,3-b,5e-2,b-15,10,b-5,59-7,2b-555,9d-3,5b-5,17-,7-,27-,7-,9,2,2,2,20-,36,10,f-,7,14-,4,a,54-3,2-6,6-5,9-,1c-10,13-1d,1c-14,3c-,10-6,32-b,240-30,28-18,c-14,a0,115-,3,66-,b-76,5,5-,1d,24,2,5-2,2,8-,35-2,19,f-10,1d-3,311-37f,1b,5a-b,d7-19,d-3,41,57-,68-4,29-3,5f,29-37,2e-2,25-c,2c-2,4e-3,30,78-3,64-,20,19b7-49,51a7-59,48e-2,38-738,2ba5-5b,222f-,3c-94,8-b,6-4,1b,6,2,3,3,6d-20,16e-f,41-,37-7,2e-2,11-f,5-b,18-,b,14,5-3,6,88-,2,bf-2,7-,7-,7-,4-2,8,8-9,8-2ff,20,5-b,1c-b4,27-,27-cbb1,f7-9,28-2,b5-221,56,48,3-,2-,3-,5,d,2,5,3,42,5-,9,8,1d,5,6,2-2,8,153-3,123-3,33-27fd,a6da-5128,21f-5df,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3,2-1d,61-ff7d");
	// @TODO: Make this relative...
	var Table_B_1_flags = "ad,34f,1806,180b,180c,180d,200b,200c,200d,2060,feff".split(",").map(function (v) { return parseInt(v, 16); });
	var Table_B_2_ranges = [
	    { h: 25, s: 32, l: 65 },
	    { h: 30, s: 32, e: [23], l: 127 },
	    { h: 54, s: 1, e: [48], l: 64, d: 2 },
	    { h: 14, s: 1, l: 57, d: 2 },
	    { h: 44, s: 1, l: 17, d: 2 },
	    { h: 10, s: 1, e: [2, 6, 8], l: 61, d: 2 },
	    { h: 16, s: 1, l: 68, d: 2 },
	    { h: 84, s: 1, e: [18, 24, 66], l: 19, d: 2 },
	    { h: 26, s: 32, e: [17], l: 435 },
	    { h: 22, s: 1, l: 71, d: 2 },
	    { h: 15, s: 80, l: 40 },
	    { h: 31, s: 32, l: 16 },
	    { h: 32, s: 1, l: 80, d: 2 },
	    { h: 52, s: 1, l: 42, d: 2 },
	    { h: 12, s: 1, l: 55, d: 2 },
	    { h: 40, s: 1, e: [38], l: 15, d: 2 },
	    { h: 14, s: 1, l: 48, d: 2 },
	    { h: 37, s: 48, l: 49 },
	    { h: 148, s: 1, l: 6351, d: 2 },
	    { h: 88, s: 1, l: 160, d: 2 },
	    { h: 15, s: 16, l: 704 },
	    { h: 25, s: 26, l: 854 },
	    { h: 25, s: 32, l: 55915 },
	    { h: 37, s: 40, l: 1247 },
	    { h: 25, s: -119711, l: 53248 },
	    { h: 25, s: -119763, l: 52 },
	    { h: 25, s: -119815, l: 52 },
	    { h: 25, s: -119867, e: [1, 4, 5, 7, 8, 11, 12, 17], l: 52 },
	    { h: 25, s: -119919, l: 52 },
	    { h: 24, s: -119971, e: [2, 7, 8, 17], l: 52 },
	    { h: 24, s: -120023, e: [2, 7, 13, 15, 16, 17], l: 52 },
	    { h: 25, s: -120075, l: 52 },
	    { h: 25, s: -120127, l: 52 },
	    { h: 25, s: -120179, l: 52 },
	    { h: 25, s: -120231, l: 52 },
	    { h: 25, s: -120283, l: 52 },
	    { h: 25, s: -120335, l: 52 },
	    { h: 24, s: -119543, e: [17], l: 56 },
	    { h: 24, s: -119601, e: [17], l: 58 },
	    { h: 24, s: -119659, e: [17], l: 58 },
	    { h: 24, s: -119717, e: [17], l: 58 },
	    { h: 24, s: -119775, e: [17], l: 58 }
	];
	var Table_B_2_lut_abs = createTable("b5:3bc,c3:ff,7:73,2:253,5:254,3:256,1:257,5:259,1:25b,3:260,1:263,2:269,1:268,5:26f,1:272,2:275,7:280,3:283,5:288,3:28a,1:28b,5:292,3f:195,1:1bf,29:19e,125:3b9,8b:3b2,1:3b8,1:3c5,3:3c6,1:3c0,1a:3ba,1:3c1,1:3c3,2:3b8,1:3b5,1bc9:3b9,1c:1f76,1:1f77,f:1f7a,1:1f7b,d:1f78,1:1f79,1:1f7c,1:1f7d,107:63,5:25b,4:68,1:68,1:68,3:69,1:69,1:6c,3:6e,4:70,1:71,1:72,1:72,1:72,7:7a,2:3c9,2:7a,2:6b,1:e5,1:62,1:63,3:65,1:66,2:6d,b:3b3,1:3c0,6:64,1b574:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3");
	var Table_B_2_lut_rel = createTable("179:1,2:1,2:1,5:1,2:1,a:4f,a:1,8:1,2:1,2:1,3:1,5:1,3:1,4:1,2:1,3:1,4:1,8:2,1:1,2:2,1:1,2:2,27:2,195:26,2:25,1:25,1:25,2:40,2:3f,1:3f,33:1,11:-6,1:-9,1ac7:-3a,6d:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,b:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,c:-8,2:-8,2:-8,2:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,49:-8,1:-8,1:-4a,1:-4a,d:-56,1:-56,1:-56,1:-56,d:-8,1:-8,f:-8,1:-8,3:-7");
	var Table_B_2_complex = createTable("df:00730073,51:00690307,19:02BC006E,a7:006A030C,18a:002003B9,16:03B903080301,20:03C503080301,1d7:05650582,190f:00680331,1:00740308,1:0077030A,1:0079030A,1:006102BE,b6:03C50313,2:03C503130300,2:03C503130301,2:03C503130342,2a:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,3:1F7003B9,1:03B103B9,1:03AC03B9,2:03B10342,1:03B1034203B9,5:03B103B9,6:1F7403B9,1:03B703B9,1:03AE03B9,2:03B70342,1:03B7034203B9,5:03B703B9,6:03B903080300,1:03B903080301,3:03B90342,1:03B903080342,b:03C503080300,1:03C503080301,1:03C10313,2:03C50342,1:03C503080342,b:1F7C03B9,1:03C903B9,1:03CE03B9,2:03C90342,1:03C9034203B9,5:03C903B9,ac:00720073,5b:00B00063,6:00B00066,d:006E006F,a:0073006D,1:00740065006C,1:0074006D,124f:006800700061,2:00610075,2:006F0076,b:00700061,1:006E0061,1:03BC0061,1:006D0061,1:006B0061,1:006B0062,1:006D0062,1:00670062,3:00700066,1:006E0066,1:03BC0066,4:0068007A,1:006B0068007A,1:006D0068007A,1:00670068007A,1:00740068007A,15:00700061,1:006B00700061,1:006D00700061,1:006700700061,8:00700076,1:006E0076,1:03BC0076,1:006D0076,1:006B0076,1:006D0076,1:00700077,1:006E0077,1:03BC0077,1:006D0077,1:006B0077,1:006D0077,1:006B03C9,1:006D03C9,2:00620071,3:00632215006B0067,1:0063006F002E,1:00640062,1:00670079,2:00680070,2:006B006B,1:006B006D,9:00700068,2:00700070006D,1:00700072,2:00730076,1:00770062,c723:00660066,1:00660069,1:0066006C,1:006600660069,1:00660066006C,1:00730074,1:00730074,d:05740576,1:05740565,1:0574056B,1:057E0576,1:0574056D", bytes2);
	var Table_C_ranges = createRangeTable("80-20,2a0-,39c,32,f71,18e,7f2-f,19-7,30-4,7-5,f81-b,5,a800-20ff,4d1-1f,110,fa-6,d174-7,2e84-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,2,1f-5f,ff7f-20001");
	function flatten(values) {
	    return values.reduce(function (accum, value) {
	        value.forEach(function (value) { accum.push(value); });
	        return accum;
	    }, []);
	}
	function _nameprepTableA1(codepoint) {
	    return !!matchMap(codepoint, Table_A_1_ranges);
	}
	exports._nameprepTableA1 = _nameprepTableA1;
	function _nameprepTableB2(codepoint) {
	    var range = matchMap(codepoint, Table_B_2_ranges);
	    if (range) {
	        return [codepoint + range.s];
	    }
	    var codes = Table_B_2_lut_abs[codepoint];
	    if (codes) {
	        return codes;
	    }
	    var shift = Table_B_2_lut_rel[codepoint];
	    if (shift) {
	        return [codepoint + shift[0]];
	    }
	    var complex = Table_B_2_complex[codepoint];
	    if (complex) {
	        return complex;
	    }
	    return null;
	}
	exports._nameprepTableB2 = _nameprepTableB2;
	function _nameprepTableC(codepoint) {
	    return !!matchMap(codepoint, Table_C_ranges);
	}
	exports._nameprepTableC = _nameprepTableC;
	function nameprep(value) {
	    // This allows platforms with incomplete normalize to bypass
	    // it for very basic names which the built-in toLowerCase
	    // will certainly handle correctly
	    if (value.match(/^[a-z0-9-]*$/i) && value.length <= 59) {
	        return value.toLowerCase();
	    }
	    // Get the code points (keeping the current normalization)
	    var codes = utf8.toUtf8CodePoints(value);
	    codes = flatten(codes.map(function (code) {
	        // Substitute Table B.1 (Maps to Nothing)
	        if (Table_B_1_flags.indexOf(code) >= 0) {
	            return [];
	        }
	        if (code >= 0xfe00 && code <= 0xfe0f) {
	            return [];
	        }
	        // Substitute Table B.2 (Case Folding)
	        var codesTableB2 = _nameprepTableB2(code);
	        if (codesTableB2) {
	            return codesTableB2;
	        }
	        // No Substitution
	        return [code];
	    }));
	    // Normalize using form KC
	    codes = utf8.toUtf8CodePoints(utf8._toUtf8String(codes), utf8.UnicodeNormalizationForm.NFKC);
	    // Prohibit Tables C.1.2, C.2.2, C.3, C.4, C.5, C.6, C.7, C.8, C.9
	    codes.forEach(function (code) {
	        if (_nameprepTableC(code)) {
	            throw new Error("STRINGPREP_CONTAINS_PROHIBITED");
	        }
	    });
	    // Prohibit Unassigned Code Points (Table A.1)
	    codes.forEach(function (code) {
	        if (_nameprepTableA1(code)) {
	            throw new Error("STRINGPREP_CONTAINS_UNASSIGNED");
	        }
	    });
	    // IDNA extras
	    var name = utf8._toUtf8String(codes);
	    // IDNA: 4.2.3.1
	    if (name.substring(0, 1) === "-" || name.substring(2, 4) === "--" || name.substring(name.length - 1) === "-") {
	        throw new Error("invalid hyphen");
	    }
	    // IDNA: 4.2.4
	    if (name.length > 63) {
	        throw new Error("too long");
	    }
	    return name;
	}
	exports.nameprep = nameprep;

	});

	var idna$1 = unwrapExports(idna);
	var idna_1 = idna._nameprepTableA1;
	var idna_2 = idna._nameprepTableB2;
	var idna_3 = idna._nameprepTableC;
	var idna_4 = idna.nameprep;

	var lib$8 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.formatBytes32String = bytes32.formatBytes32String;
	exports.parseBytes32String = bytes32.parseBytes32String;

	exports.nameprep = idna.nameprep;

	exports._toEscapedUtf8String = utf8._toEscapedUtf8String;
	exports.toUtf8Bytes = utf8.toUtf8Bytes;
	exports.toUtf8CodePoints = utf8.toUtf8CodePoints;
	exports.toUtf8String = utf8.toUtf8String;
	exports.UnicodeNormalizationForm = utf8.UnicodeNormalizationForm;
	exports.Utf8ErrorFuncs = utf8.Utf8ErrorFuncs;
	exports.Utf8ErrorReason = utf8.Utf8ErrorReason;

	});

	var index$8 = unwrapExports(lib$8);
	var lib_1$8 = lib$8.formatBytes32String;
	var lib_2$7 = lib$8.parseBytes32String;
	var lib_3$6 = lib$8.nameprep;
	var lib_4$5 = lib$8._toEscapedUtf8String;
	var lib_5$5 = lib$8.toUtf8Bytes;
	var lib_6$3 = lib$8.toUtf8CodePoints;
	var lib_7$3 = lib$8.toUtf8String;
	var lib_8$2 = lib$8.UnicodeNormalizationForm;
	var lib_9$2 = lib$8.Utf8ErrorFuncs;
	var lib_10$1 = lib$8.Utf8ErrorReason;

	var string = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });


	var StringCoder = /** @class */ (function (_super) {
	    __extends(StringCoder, _super);
	    function StringCoder(localName) {
	        return _super.call(this, "string", localName) || this;
	    }
	    StringCoder.prototype.encode = function (writer, value) {
	        return _super.prototype.encode.call(this, writer, lib$8.toUtf8Bytes(value));
	    };
	    StringCoder.prototype.decode = function (reader) {
	        return lib$8.toUtf8String(_super.prototype.decode.call(this, reader));
	    };
	    return StringCoder;
	}(bytes.DynamicBytesCoder));
	exports.StringCoder = StringCoder;

	});

	var string$1 = unwrapExports(string);
	var string_1 = string.StringCoder;

	var tuple = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });


	var TupleCoder = /** @class */ (function (_super) {
	    __extends(TupleCoder, _super);
	    function TupleCoder(coders, localName) {
	        var _this = this;
	        var dynamic = false;
	        var types = [];
	        coders.forEach(function (coder) {
	            if (coder.dynamic) {
	                dynamic = true;
	            }
	            types.push(coder.type);
	        });
	        var type = ("tuple(" + types.join(",") + ")");
	        _this = _super.call(this, "tuple", type, localName, dynamic) || this;
	        _this.coders = coders;
	        return _this;
	    }
	    TupleCoder.prototype.encode = function (writer, value) {
	        return array.pack(writer, this.coders, value);
	    };
	    TupleCoder.prototype.decode = function (reader) {
	        return reader.coerce(this.name, array.unpack(reader, this.coders));
	    };
	    return TupleCoder;
	}(abstractCoder.Coder));
	exports.TupleCoder = TupleCoder;

	});

	var tuple$1 = unwrapExports(tuple);
	var tuple_1 = tuple.TupleCoder;

	var abiCoder = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// See: https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI




	var logger = new lib.Logger(_version$8.version);











	var paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
	var paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);
	var AbiCoder = /** @class */ (function () {
	    function AbiCoder(coerceFunc) {
	        var _newTarget = this.constructor;
	        logger.checkNew(_newTarget, AbiCoder);
	        lib$3.defineReadOnly(this, "coerceFunc", coerceFunc || null);
	    }
	    AbiCoder.prototype._getCoder = function (param) {
	        var _this = this;
	        switch (param.baseType) {
	            case "address":
	                return new address.AddressCoder(param.name);
	            case "bool":
	                return new boolean_1.BooleanCoder(param.name);
	            case "string":
	                return new string.StringCoder(param.name);
	            case "bytes":
	                return new bytes.BytesCoder(param.name);
	            case "array":
	                return new array.ArrayCoder(this._getCoder(param.arrayChildren), param.arrayLength, param.name);
	            case "tuple":
	                return new tuple.TupleCoder((param.components || []).map(function (component) {
	                    return _this._getCoder(component);
	                }), param.name);
	            case "":
	                return new _null.NullCoder(param.name);
	        }
	        // u?int[0-9]*
	        var match = param.type.match(paramTypeNumber);
	        if (match) {
	            var size = parseInt(match[2] || "256");
	            if (size === 0 || size > 256 || (size % 8) !== 0) {
	                logger.throwArgumentError("invalid " + match[1] + " bit length", "param", param);
	            }
	            return new number.NumberCoder(size / 8, (match[1] === "int"), param.name);
	        }
	        // bytes[0-9]+
	        match = param.type.match(paramTypeBytes);
	        if (match) {
	            var size = parseInt(match[1]);
	            if (size === 0 || size > 32) {
	                logger.throwArgumentError("invalid bytes length", "param", param);
	            }
	            return new fixedBytes.FixedBytesCoder(size, param.name);
	        }
	        return logger.throwArgumentError("invalid type", "type", param.type);
	    };
	    AbiCoder.prototype._getWordSize = function () { return 32; };
	    AbiCoder.prototype._getReader = function (data) {
	        return new abstractCoder.Reader(data, this._getWordSize(), this.coerceFunc);
	    };
	    AbiCoder.prototype._getWriter = function () {
	        return new abstractCoder.Writer(this._getWordSize());
	    };
	    AbiCoder.prototype.encode = function (types, values) {
	        var _this = this;
	        if (types.length !== values.length) {
	            logger.throwError("types/values length mismatch", lib.Logger.errors.INVALID_ARGUMENT, {
	                count: { types: types.length, values: values.length },
	                value: { types: types, values: values }
	            });
	        }
	        var coders = types.map(function (type) { return _this._getCoder(fragments.ParamType.from(type)); });
	        var coder = (new tuple.TupleCoder(coders, "_"));
	        var writer = this._getWriter();
	        coder.encode(writer, values);
	        return writer.data;
	    };
	    AbiCoder.prototype.decode = function (types, data) {
	        var _this = this;
	        var coders = types.map(function (type) { return _this._getCoder(fragments.ParamType.from(type)); });
	        var coder = new tuple.TupleCoder(coders, "_");
	        return coder.decode(this._getReader(lib$1.arrayify(data)));
	    };
	    return AbiCoder;
	}());
	exports.AbiCoder = AbiCoder;
	exports.defaultAbiCoder = new AbiCoder();

	});

	var abiCoder$1 = unwrapExports(abiCoder);
	var abiCoder_1 = abiCoder.AbiCoder;
	var abiCoder_2 = abiCoder.defaultAbiCoder;

	var _version$g = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "hash/5.0.2";

	});

	var _version$h = unwrapExports(_version$g);
	var _version_1$8 = _version$g.version;

	var lib$9 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });





	var logger = new lib.Logger(_version$g.version);
	///////////////////////////////
	var Zeros = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	var Partition = new RegExp("^((.*)\\.)?([^.]+)$");
	function isValidName(name) {
	    try {
	        var comps = name.split(".");
	        for (var i = 0; i < comps.length; i++) {
	            if (lib$8.nameprep(comps[i]).length === 0) {
	                throw new Error("empty");
	            }
	        }
	        return true;
	    }
	    catch (error) { }
	    return false;
	}
	exports.isValidName = isValidName;
	function namehash(name) {
	    /* istanbul ignore if */
	    if (typeof (name) !== "string") {
	        logger.throwArgumentError("invalid address - " + String(name), "name", name);
	    }
	    var result = Zeros;
	    while (name.length) {
	        var partition = name.match(Partition);
	        var label = lib$8.toUtf8Bytes(lib$8.nameprep(partition[3]));
	        result = lib$4.keccak256(lib$1.concat([result, lib$4.keccak256(label)]));
	        name = partition[2] || "";
	    }
	    return lib$1.hexlify(result);
	}
	exports.namehash = namehash;
	function id(text) {
	    return lib$4.keccak256(lib$8.toUtf8Bytes(text));
	}
	exports.id = id;
	exports.messagePrefix = "\x19Ethereum Signed Message:\n";
	function hashMessage(message) {
	    if (typeof (message) === "string") {
	        message = lib$8.toUtf8Bytes(message);
	    }
	    return lib$4.keccak256(lib$1.concat([
	        lib$8.toUtf8Bytes(exports.messagePrefix),
	        lib$8.toUtf8Bytes(String(message.length)),
	        message
	    ]));
	}
	exports.hashMessage = hashMessage;

	});

	var index$9 = unwrapExports(lib$9);
	var lib_1$9 = lib$9.isValidName;
	var lib_2$8 = lib$9.namehash;
	var lib_3$7 = lib$9.id;
	var lib_4$6 = lib$9.messagePrefix;
	var lib_5$6 = lib$9.hashMessage;

	var _interface = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });








	exports.checkResultErrors = abstractCoder.checkResultErrors;



	var logger = new lib.Logger(_version$8.version);
	var LogDescription = /** @class */ (function (_super) {
	    __extends(LogDescription, _super);
	    function LogDescription() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    return LogDescription;
	}(lib$3.Description));
	exports.LogDescription = LogDescription;
	var TransactionDescription = /** @class */ (function (_super) {
	    __extends(TransactionDescription, _super);
	    function TransactionDescription() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    return TransactionDescription;
	}(lib$3.Description));
	exports.TransactionDescription = TransactionDescription;
	var Indexed = /** @class */ (function (_super) {
	    __extends(Indexed, _super);
	    function Indexed() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    Indexed.isIndexed = function (value) {
	        return !!(value && value._isIndexed);
	    };
	    return Indexed;
	}(lib$3.Description));
	exports.Indexed = Indexed;
	function wrapAccessError(property, error) {
	    var wrap = new Error("deferred error during ABI decoding triggered accessing " + property);
	    wrap.error = error;
	    return wrap;
	}
	/*
	function checkNames(fragment: Fragment, type: "input" | "output", params: Array<ParamType>): void {
	    params.reduce((accum, param) => {
	        if (param.name) {
	            if (accum[param.name]) {
	                logger.throwArgumentError(`duplicate ${ type } parameter ${ JSON.stringify(param.name) } in ${ fragment.format("full") }`, "fragment", fragment);
	            }
	            accum[param.name] = true;
	        }
	        return accum;
	    }, <{ [ name: string ]: boolean }>{ });
	}
	*/
	var Interface = /** @class */ (function () {
	    function Interface(fragments$1) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, Interface);
	        var abi = [];
	        if (typeof (fragments$1) === "string") {
	            abi = JSON.parse(fragments$1);
	        }
	        else {
	            abi = fragments$1;
	        }
	        lib$3.defineReadOnly(this, "fragments", abi.map(function (fragment) {
	            return fragments.Fragment.from(fragment);
	        }).filter(function (fragment) { return (fragment != null); }));
	        lib$3.defineReadOnly(this, "_abiCoder", lib$3.getStatic((_newTarget), "getAbiCoder")());
	        lib$3.defineReadOnly(this, "functions", {});
	        lib$3.defineReadOnly(this, "errors", {});
	        lib$3.defineReadOnly(this, "events", {});
	        lib$3.defineReadOnly(this, "structs", {});
	        // Add all fragments by their signature
	        this.fragments.forEach(function (fragment) {
	            var bucket = null;
	            switch (fragment.type) {
	                case "constructor":
	                    if (_this.deploy) {
	                        logger.warn("duplicate definition - constructor");
	                        return;
	                    }
	                    //checkNames(fragment, "input", fragment.inputs);
	                    lib$3.defineReadOnly(_this, "deploy", fragment);
	                    return;
	                case "function":
	                    //checkNames(fragment, "input", fragment.inputs);
	                    //checkNames(fragment, "output", (<FunctionFragment>fragment).outputs);
	                    bucket = _this.functions;
	                    break;
	                case "event":
	                    //checkNames(fragment, "input", fragment.inputs);
	                    bucket = _this.events;
	                    break;
	                default:
	                    return;
	            }
	            var signature = fragment.format();
	            if (bucket[signature]) {
	                logger.warn("duplicate definition - " + signature);
	                return;
	            }
	            bucket[signature] = fragment;
	        });
	        // If we do not have a constructor add a default
	        if (!this.deploy) {
	            lib$3.defineReadOnly(this, "deploy", fragments.ConstructorFragment.from({
	                payable: false,
	                type: "constructor"
	            }));
	        }
	        lib$3.defineReadOnly(this, "_isInterface", true);
	    }
	    Interface.prototype.format = function (format) {
	        if (!format) {
	            format = fragments.FormatTypes.full;
	        }
	        if (format === fragments.FormatTypes.sighash) {
	            logger.throwArgumentError("interface does not support formatting sighash", "format", format);
	        }
	        var abi = this.fragments.map(function (fragment) { return fragment.format(format); });
	        // We need to re-bundle the JSON fragments a bit
	        if (format === fragments.FormatTypes.json) {
	            return JSON.stringify(abi.map(function (j) { return JSON.parse(j); }));
	        }
	        return abi;
	    };
	    // Sub-classes can override these to handle other blockchains
	    Interface.getAbiCoder = function () {
	        return abiCoder.defaultAbiCoder;
	    };
	    Interface.getAddress = function (address) {
	        return lib$6.getAddress(address);
	    };
	    Interface.getSighash = function (functionFragment) {
	        return lib$1.hexDataSlice(lib$9.id(functionFragment.format()), 0, 4);
	    };
	    Interface.getEventTopic = function (eventFragment) {
	        return lib$9.id(eventFragment.format());
	    };
	    // Find a function definition by any means necessary (unless it is ambiguous)
	    Interface.prototype.getFunction = function (nameOrSignatureOrSighash) {
	        if (lib$1.isHexString(nameOrSignatureOrSighash)) {
	            for (var name_1 in this.functions) {
	                if (nameOrSignatureOrSighash === this.getSighash(name_1)) {
	                    return this.functions[name_1];
	                }
	            }
	            logger.throwArgumentError("no matching function", "sighash", nameOrSignatureOrSighash);
	        }
	        // It is a bare name, look up the function (will return null if ambiguous)
	        if (nameOrSignatureOrSighash.indexOf("(") === -1) {
	            var name_2 = nameOrSignatureOrSighash.trim();
	            var matching = Object.keys(this.functions).filter(function (f) { return (f.split("(" /* fix:) */)[0] === name_2); });
	            if (matching.length === 0) {
	                logger.throwArgumentError("no matching function", "name", name_2);
	            }
	            else if (matching.length > 1) {
	                logger.throwArgumentError("multiple matching functions", "name", name_2);
	            }
	            return this.functions[matching[0]];
	        }
	        // Normlize the signature and lookup the function
	        var result = this.functions[fragments.FunctionFragment.fromString(nameOrSignatureOrSighash).format()];
	        if (!result) {
	            logger.throwArgumentError("no matching function", "signature", nameOrSignatureOrSighash);
	        }
	        return result;
	    };
	    // Find an event definition by any means necessary (unless it is ambiguous)
	    Interface.prototype.getEvent = function (nameOrSignatureOrTopic) {
	        if (lib$1.isHexString(nameOrSignatureOrTopic)) {
	            var topichash = nameOrSignatureOrTopic.toLowerCase();
	            for (var name_3 in this.events) {
	                if (topichash === this.getEventTopic(name_3)) {
	                    return this.events[name_3];
	                }
	            }
	            logger.throwArgumentError("no matching event", "topichash", topichash);
	        }
	        // It is a bare name, look up the function (will return null if ambiguous)
	        if (nameOrSignatureOrTopic.indexOf("(") === -1) {
	            var name_4 = nameOrSignatureOrTopic.trim();
	            var matching = Object.keys(this.events).filter(function (f) { return (f.split("(" /* fix:) */)[0] === name_4); });
	            if (matching.length === 0) {
	                logger.throwArgumentError("no matching event", "name", name_4);
	            }
	            else if (matching.length > 1) {
	                logger.throwArgumentError("multiple matching events", "name", name_4);
	            }
	            return this.events[matching[0]];
	        }
	        // Normlize the signature and lookup the function
	        var result = this.events[fragments.EventFragment.fromString(nameOrSignatureOrTopic).format()];
	        if (!result) {
	            logger.throwArgumentError("no matching event", "signature", nameOrSignatureOrTopic);
	        }
	        return result;
	    };
	    // Get the sighash (the bytes4 selector) used by Solidity to identify a function
	    Interface.prototype.getSighash = function (functionFragment) {
	        if (typeof (functionFragment) === "string") {
	            functionFragment = this.getFunction(functionFragment);
	        }
	        return lib$3.getStatic(this.constructor, "getSighash")(functionFragment);
	    };
	    // Get the topic (the bytes32 hash) used by Solidity to identify an event
	    Interface.prototype.getEventTopic = function (eventFragment) {
	        if (typeof (eventFragment) === "string") {
	            eventFragment = this.getEvent(eventFragment);
	        }
	        return lib$3.getStatic(this.constructor, "getEventTopic")(eventFragment);
	    };
	    Interface.prototype._decodeParams = function (params, data) {
	        return this._abiCoder.decode(params, data);
	    };
	    Interface.prototype._encodeParams = function (params, values) {
	        return this._abiCoder.encode(params, values);
	    };
	    Interface.prototype.encodeDeploy = function (values) {
	        return this._encodeParams(this.deploy.inputs, values || []);
	    };
	    // Decode the data for a function call (e.g. tx.data)
	    Interface.prototype.decodeFunctionData = function (functionFragment, data) {
	        if (typeof (functionFragment) === "string") {
	            functionFragment = this.getFunction(functionFragment);
	        }
	        var bytes = lib$1.arrayify(data);
	        if (lib$1.hexlify(bytes.slice(0, 4)) !== this.getSighash(functionFragment)) {
	            logger.throwArgumentError("data signature does not match function " + functionFragment.name + ".", "data", lib$1.hexlify(bytes));
	        }
	        return this._decodeParams(functionFragment.inputs, bytes.slice(4));
	    };
	    // Encode the data for a function call (e.g. tx.data)
	    Interface.prototype.encodeFunctionData = function (functionFragment, values) {
	        if (typeof (functionFragment) === "string") {
	            functionFragment = this.getFunction(functionFragment);
	        }
	        return lib$1.hexlify(lib$1.concat([
	            this.getSighash(functionFragment),
	            this._encodeParams(functionFragment.inputs, values || [])
	        ]));
	    };
	    // Decode the result from a function call (e.g. from eth_call)
	    Interface.prototype.decodeFunctionResult = function (functionFragment, data) {
	        if (typeof (functionFragment) === "string") {
	            functionFragment = this.getFunction(functionFragment);
	        }
	        var bytes = lib$1.arrayify(data);
	        var reason = null;
	        var errorSignature = null;
	        switch (bytes.length % this._abiCoder._getWordSize()) {
	            case 0:
	                try {
	                    return this._abiCoder.decode(functionFragment.outputs, bytes);
	                }
	                catch (error) { }
	                break;
	            case 4:
	                if (lib$1.hexlify(bytes.slice(0, 4)) === "0x08c379a0") {
	                    errorSignature = "Error(string)";
	                    reason = this._abiCoder.decode(["string"], bytes.slice(4))[0];
	                }
	                break;
	        }
	        return logger.throwError("call revert exception", lib.Logger.errors.CALL_EXCEPTION, {
	            method: functionFragment.format(),
	            errorSignature: errorSignature,
	            errorArgs: [reason],
	            reason: reason
	        });
	    };
	    // Encode the result for a function call (e.g. for eth_call)
	    Interface.prototype.encodeFunctionResult = function (functionFragment, values) {
	        if (typeof (functionFragment) === "string") {
	            functionFragment = this.getFunction(functionFragment);
	        }
	        return lib$1.hexlify(this._abiCoder.encode(functionFragment.outputs, values || []));
	    };
	    // Create the filter for the event with search criteria (e.g. for eth_filterLog)
	    Interface.prototype.encodeFilterTopics = function (eventFragment, values) {
	        var _this = this;
	        if (typeof (eventFragment) === "string") {
	            eventFragment = this.getEvent(eventFragment);
	        }
	        if (values.length > eventFragment.inputs.length) {
	            logger.throwError("too many arguments for " + eventFragment.format(), lib.Logger.errors.UNEXPECTED_ARGUMENT, {
	                argument: "values",
	                value: values
	            });
	        }
	        var topics = [];
	        if (!eventFragment.anonymous) {
	            topics.push(this.getEventTopic(eventFragment));
	        }
	        var encodeTopic = function (param, value) {
	            if (param.type === "string") {
	                return lib$9.id(value);
	            }
	            else if (param.type === "bytes") {
	                return lib$4.keccak256(lib$1.hexlify(value));
	            }
	            // Check addresses are valid
	            if (param.type === "address") {
	                _this._abiCoder.encode(["address"], [value]);
	            }
	            return lib$1.hexZeroPad(lib$1.hexlify(value), 32);
	        };
	        values.forEach(function (value, index) {
	            var param = eventFragment.inputs[index];
	            if (!param.indexed) {
	                if (value != null) {
	                    logger.throwArgumentError("cannot filter non-indexed parameters; must be null", ("contract." + param.name), value);
	                }
	                return;
	            }
	            if (value == null) {
	                topics.push(null);
	            }
	            else if (param.baseType === "array" || param.baseType === "tuple") {
	                logger.throwArgumentError("filtering with tuples or arrays not supported", ("contract." + param.name), value);
	            }
	            else if (Array.isArray(value)) {
	                topics.push(value.map(function (value) { return encodeTopic(param, value); }));
	            }
	            else {
	                topics.push(encodeTopic(param, value));
	            }
	        });
	        // Trim off trailing nulls
	        while (topics.length && topics[topics.length - 1] === null) {
	            topics.pop();
	        }
	        return topics;
	    };
	    Interface.prototype.encodeEventLog = function (eventFragment, values) {
	        var _this = this;
	        if (typeof (eventFragment) === "string") {
	            eventFragment = this.getEvent(eventFragment);
	        }
	        var topics = [];
	        var dataTypes = [];
	        var dataValues = [];
	        if (!eventFragment.anonymous) {
	            topics.push(this.getEventTopic(eventFragment));
	        }
	        if (values.length !== eventFragment.inputs.length) {
	            logger.throwArgumentError("event arguments/values mismatch", "values", values);
	        }
	        eventFragment.inputs.forEach(function (param, index) {
	            var value = values[index];
	            if (param.indexed) {
	                if (param.type === "string") {
	                    topics.push(lib$9.id(value));
	                }
	                else if (param.type === "bytes") {
	                    topics.push(lib$4.keccak256(value));
	                }
	                else if (param.baseType === "tuple" || param.baseType === "array") {
	                    // @TOOD
	                    throw new Error("not implemented");
	                }
	                else {
	                    topics.push(_this._abiCoder.encode([param.type], [value]));
	                }
	            }
	            else {
	                dataTypes.push(param);
	                dataValues.push(value);
	            }
	        });
	        return {
	            data: this._abiCoder.encode(dataTypes, dataValues),
	            topics: topics
	        };
	    };
	    // Decode a filter for the event and the search criteria
	    Interface.prototype.decodeEventLog = function (eventFragment, data, topics) {
	        if (typeof (eventFragment) === "string") {
	            eventFragment = this.getEvent(eventFragment);
	        }
	        if (topics != null && !eventFragment.anonymous) {
	            var topicHash = this.getEventTopic(eventFragment);
	            if (!lib$1.isHexString(topics[0], 32) || topics[0].toLowerCase() !== topicHash) {
	                logger.throwError("fragment/topic mismatch", lib.Logger.errors.INVALID_ARGUMENT, { argument: "topics[0]", expected: topicHash, value: topics[0] });
	            }
	            topics = topics.slice(1);
	        }
	        var indexed = [];
	        var nonIndexed = [];
	        var dynamic = [];
	        eventFragment.inputs.forEach(function (param, index) {
	            if (param.indexed) {
	                if (param.type === "string" || param.type === "bytes" || param.baseType === "tuple" || param.baseType === "array") {
	                    indexed.push(fragments.ParamType.fromObject({ type: "bytes32", name: param.name }));
	                    dynamic.push(true);
	                }
	                else {
	                    indexed.push(param);
	                    dynamic.push(false);
	                }
	            }
	            else {
	                nonIndexed.push(param);
	                dynamic.push(false);
	            }
	        });
	        var resultIndexed = (topics != null) ? this._abiCoder.decode(indexed, lib$1.concat(topics)) : null;
	        var resultNonIndexed = this._abiCoder.decode(nonIndexed, data);
	        var result = [];
	        var nonIndexedIndex = 0, indexedIndex = 0;
	        eventFragment.inputs.forEach(function (param, index) {
	            if (param.indexed) {
	                if (resultIndexed == null) {
	                    result[index] = new Indexed({ _isIndexed: true, hash: null });
	                }
	                else if (dynamic[index]) {
	                    result[index] = new Indexed({ _isIndexed: true, hash: resultIndexed[indexedIndex++] });
	                }
	                else {
	                    try {
	                        result[index] = resultIndexed[indexedIndex++];
	                    }
	                    catch (error) {
	                        result[index] = error;
	                    }
	                }
	            }
	            else {
	                try {
	                    result[index] = resultNonIndexed[nonIndexedIndex++];
	                }
	                catch (error) {
	                    result[index] = error;
	                }
	            }
	            // Add the keyword argument if named and safe
	            if (param.name && result[param.name] == null) {
	                var value_1 = result[index];
	                // Make error named values throw on access
	                if (value_1 instanceof Error) {
	                    Object.defineProperty(result, param.name, {
	                        get: function () { throw wrapAccessError("property " + JSON.stringify(param.name), value_1); }
	                    });
	                }
	                else {
	                    result[param.name] = value_1;
	                }
	            }
	        });
	        var _loop_1 = function (i) {
	            var value = result[i];
	            if (value instanceof Error) {
	                Object.defineProperty(result, i, {
	                    get: function () { throw wrapAccessError("index " + i, value); }
	                });
	            }
	        };
	        // Make all error indexed values throw on access
	        for (var i = 0; i < result.length; i++) {
	            _loop_1(i);
	        }
	        return Object.freeze(result);
	    };
	    // Given a transaction, find the matching function fragment (if any) and
	    // determine all its properties and call parameters
	    Interface.prototype.parseTransaction = function (tx) {
	        var fragment = this.getFunction(tx.data.substring(0, 10).toLowerCase());
	        if (!fragment) {
	            return null;
	        }
	        return new TransactionDescription({
	            args: this._abiCoder.decode(fragment.inputs, "0x" + tx.data.substring(10)),
	            functionFragment: fragment,
	            name: fragment.name,
	            signature: fragment.format(),
	            sighash: this.getSighash(fragment),
	            value: lib$2.BigNumber.from(tx.value || "0"),
	        });
	    };
	    // Given an event log, find the matching event fragment (if any) and
	    // determine all its properties and values
	    Interface.prototype.parseLog = function (log) {
	        var fragment = this.getEvent(log.topics[0]);
	        if (!fragment || fragment.anonymous) {
	            return null;
	        }
	        // @TODO: If anonymous, and the only method, and the input count matches, should we parse?
	        //        Probably not, because just because it is the only event in the ABI does
	        //        not mean we have the full ABI; maybe jsut a fragment?
	        return new LogDescription({
	            eventFragment: fragment,
	            name: fragment.name,
	            signature: fragment.format(),
	            topic: this.getEventTopic(fragment),
	            args: this.decodeEventLog(fragment, log.data, log.topics)
	        });
	    };
	    /*
	    static from(value: Array<Fragment | string | JsonAbi> | string | Interface) {
	        if (Interface.isInterface(value)) {
	            return value;
	        }
	        if (typeof(value) === "string") {
	            return new Interface(JSON.parse(value));
	        }
	        return new Interface(value);
	    }
	    */
	    Interface.isInterface = function (value) {
	        return !!(value && value._isInterface);
	    };
	    return Interface;
	}());
	exports.Interface = Interface;

	});

	var _interface$1 = unwrapExports(_interface);
	var _interface_1 = _interface.checkResultErrors;
	var _interface_2 = _interface.LogDescription;
	var _interface_3 = _interface.TransactionDescription;
	var _interface_4 = _interface.Indexed;
	var _interface_5 = _interface.Interface;

	var lib$a = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.ConstructorFragment = fragments.ConstructorFragment;
	exports.EventFragment = fragments.EventFragment;
	exports.FormatTypes = fragments.FormatTypes;
	exports.Fragment = fragments.Fragment;
	exports.FunctionFragment = fragments.FunctionFragment;
	exports.ParamType = fragments.ParamType;

	exports.AbiCoder = abiCoder.AbiCoder;
	exports.defaultAbiCoder = abiCoder.defaultAbiCoder;

	exports.checkResultErrors = _interface.checkResultErrors;
	exports.Indexed = _interface.Indexed;
	exports.Interface = _interface.Interface;
	exports.LogDescription = _interface.LogDescription;
	exports.TransactionDescription = _interface.TransactionDescription;

	});

	var index$a = unwrapExports(lib$a);
	var lib_1$a = lib$a.ConstructorFragment;
	var lib_2$9 = lib$a.EventFragment;
	var lib_3$8 = lib$a.FormatTypes;
	var lib_4$7 = lib$a.Fragment;
	var lib_5$7 = lib$a.FunctionFragment;
	var lib_6$4 = lib$a.ParamType;
	var lib_7$4 = lib$a.AbiCoder;
	var lib_8$3 = lib$a.defaultAbiCoder;
	var lib_9$3 = lib$a.checkResultErrors;
	var lib_10$2 = lib$a.Indexed;
	var lib_11$1 = lib$a.Interface;
	var lib_12$1 = lib$a.LogDescription;
	var lib_13$1 = lib$a.TransactionDescription;

	var _version$i = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "abstract-provider/5.0.2";

	});

	var _version$j = unwrapExports(_version$i);
	var _version_1$9 = _version$i.version;

	var lib$b = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });




	var logger = new lib.Logger(_version$i.version);
	;
	;
	//export type CallTransactionable = {
	//    call(transaction: TransactionRequest): Promise<TransactionResponse>;
	//};
	var ForkEvent = /** @class */ (function (_super) {
	    __extends(ForkEvent, _super);
	    function ForkEvent() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ForkEvent.isForkEvent = function (value) {
	        return !!(value && value._isForkEvent);
	    };
	    return ForkEvent;
	}(lib$3.Description));
	exports.ForkEvent = ForkEvent;
	var BlockForkEvent = /** @class */ (function (_super) {
	    __extends(BlockForkEvent, _super);
	    function BlockForkEvent(blockHash, expiry) {
	        var _this = this;
	        if (!lib$1.isHexString(blockHash, 32)) {
	            logger.throwArgumentError("invalid blockHash", "blockHash", blockHash);
	        }
	        _this = _super.call(this, {
	            _isForkEvent: true,
	            _isBlockForkEvent: true,
	            expiry: (expiry || 0),
	            blockHash: blockHash
	        }) || this;
	        return _this;
	    }
	    return BlockForkEvent;
	}(ForkEvent));
	exports.BlockForkEvent = BlockForkEvent;
	var TransactionForkEvent = /** @class */ (function (_super) {
	    __extends(TransactionForkEvent, _super);
	    function TransactionForkEvent(hash, expiry) {
	        var _this = this;
	        if (!lib$1.isHexString(hash, 32)) {
	            logger.throwArgumentError("invalid transaction hash", "hash", hash);
	        }
	        _this = _super.call(this, {
	            _isForkEvent: true,
	            _isTransactionForkEvent: true,
	            expiry: (expiry || 0),
	            hash: hash
	        }) || this;
	        return _this;
	    }
	    return TransactionForkEvent;
	}(ForkEvent));
	exports.TransactionForkEvent = TransactionForkEvent;
	var TransactionOrderForkEvent = /** @class */ (function (_super) {
	    __extends(TransactionOrderForkEvent, _super);
	    function TransactionOrderForkEvent(beforeHash, afterHash, expiry) {
	        var _this = this;
	        if (!lib$1.isHexString(beforeHash, 32)) {
	            logger.throwArgumentError("invalid transaction hash", "beforeHash", beforeHash);
	        }
	        if (!lib$1.isHexString(afterHash, 32)) {
	            logger.throwArgumentError("invalid transaction hash", "afterHash", afterHash);
	        }
	        _this = _super.call(this, {
	            _isForkEvent: true,
	            _isTransactionOrderForkEvent: true,
	            expiry: (expiry || 0),
	            beforeHash: beforeHash,
	            afterHash: afterHash
	        }) || this;
	        return _this;
	    }
	    return TransactionOrderForkEvent;
	}(ForkEvent));
	exports.TransactionOrderForkEvent = TransactionOrderForkEvent;
	///////////////////////////////
	// Exported Abstracts
	var Provider = /** @class */ (function () {
	    function Provider() {
	        var _newTarget = this.constructor;
	        logger.checkAbstract(_newTarget, Provider);
	        lib$3.defineReadOnly(this, "_isProvider", true);
	    }
	    // Alias for "on"
	    Provider.prototype.addListener = function (eventName, listener) {
	        return this.on(eventName, listener);
	    };
	    // Alias for "off"
	    Provider.prototype.removeListener = function (eventName, listener) {
	        return this.off(eventName, listener);
	    };
	    Provider.isProvider = function (value) {
	        return !!(value && value._isProvider);
	    };
	    return Provider;
	}());
	exports.Provider = Provider;

	});

	var index$b = unwrapExports(lib$b);
	var lib_1$b = lib$b.ForkEvent;
	var lib_2$a = lib$b.BlockForkEvent;
	var lib_3$9 = lib$b.TransactionForkEvent;
	var lib_4$8 = lib$b.TransactionOrderForkEvent;
	var lib_5$8 = lib$b.Provider;

	var _version$k = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "abstract-signer/5.0.2";

	});

	var _version$l = unwrapExports(_version$k);
	var _version_1$a = _version$k.version;

	var lib$c = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$k.version);
	var allowedTransactionKeys = [
	    "chainId", "data", "from", "gasLimit", "gasPrice", "nonce", "to", "value"
	];
	// Sub-Class Notes:
	//  - A Signer MUST always make sure, that if present, the "from" field
	//    matches the Signer, before sending or signing a transaction
	//  - A Signer SHOULD always wrap private information (such as a private
	//    key or mnemonic) in a function, so that console.log does not leak
	//    the data
	var Signer = /** @class */ (function () {
	    ///////////////////
	    // Sub-classes MUST call super
	    function Signer() {
	        var _newTarget = this.constructor;
	        logger.checkAbstract(_newTarget, Signer);
	        lib$3.defineReadOnly(this, "_isSigner", true);
	    }
	    ///////////////////
	    // Sub-classes MAY override these
	    Signer.prototype.getBalance = function (blockTag) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this._checkProvider("getBalance");
	                        return [4 /*yield*/, this.provider.getBalance(this.getAddress(), blockTag)];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	    Signer.prototype.getTransactionCount = function (blockTag) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this._checkProvider("getTransactionCount");
	                        return [4 /*yield*/, this.provider.getTransactionCount(this.getAddress(), blockTag)];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	    // Populates "from" if unspecified, and estimates the gas for the transation
	    Signer.prototype.estimateGas = function (transaction) {
	        return __awaiter(this, void 0, void 0, function () {
	            var tx;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this._checkProvider("estimateGas");
	                        return [4 /*yield*/, lib$3.resolveProperties(this.checkTransaction(transaction))];
	                    case 1:
	                        tx = _a.sent();
	                        return [4 /*yield*/, this.provider.estimateGas(tx)];
	                    case 2: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	    // Populates "from" if unspecified, and calls with the transation
	    Signer.prototype.call = function (transaction, blockTag) {
	        return __awaiter(this, void 0, void 0, function () {
	            var tx;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this._checkProvider("call");
	                        return [4 /*yield*/, lib$3.resolveProperties(this.checkTransaction(transaction))];
	                    case 1:
	                        tx = _a.sent();
	                        return [4 /*yield*/, this.provider.call(tx, blockTag)];
	                    case 2: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	    // Populates all fields in a transaction, signs it and sends it to the network
	    Signer.prototype.sendTransaction = function (transaction) {
	        var _this = this;
	        this._checkProvider("sendTransaction");
	        return this.populateTransaction(transaction).then(function (tx) {
	            return _this.signTransaction(tx).then(function (signedTx) {
	                return _this.provider.sendTransaction(signedTx);
	            });
	        });
	    };
	    Signer.prototype.getChainId = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var network;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this._checkProvider("getChainId");
	                        return [4 /*yield*/, this.provider.getNetwork()];
	                    case 1:
	                        network = _a.sent();
	                        return [2 /*return*/, network.chainId];
	                }
	            });
	        });
	    };
	    Signer.prototype.getGasPrice = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this._checkProvider("getGasPrice");
	                        return [4 /*yield*/, this.provider.getGasPrice()];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	    Signer.prototype.resolveName = function (name) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this._checkProvider("resolveName");
	                        return [4 /*yield*/, this.provider.resolveName(name)];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	    // Checks a transaction does not contain invalid keys and if
	    // no "from" is provided, populates it.
	    // - does NOT require a provider
	    // - adds "from" is not present
	    // - returns a COPY (safe to mutate the result)
	    // By default called from: (overriding these prevents it)
	    //   - call
	    //   - estimateGas
	    //   - populateTransaction (and therefor sendTransaction)
	    Signer.prototype.checkTransaction = function (transaction) {
	        for (var key in transaction) {
	            if (allowedTransactionKeys.indexOf(key) === -1) {
	                logger.throwArgumentError("invalid transaction key: " + key, "transaction", transaction);
	            }
	        }
	        var tx = lib$3.shallowCopy(transaction);
	        if (tx.from == null) {
	            tx.from = this.getAddress();
	        }
	        else {
	            // Make sure any provided address matches this signer
	            tx.from = Promise.all([
	                Promise.resolve(tx.from),
	                this.getAddress()
	            ]).then(function (result) {
	                if (result[0] !== result[1]) {
	                    logger.throwArgumentError("from address mismatch", "transaction", transaction);
	                }
	                return result[0];
	            });
	        }
	        return tx;
	    };
	    // Populates ALL keys for a transaction and checks that "from" matches
	    // this Signer. Should be used by sendTransaction but NOT by signTransaction.
	    // By default called from: (overriding these prevents it)
	    //   - sendTransaction
	    Signer.prototype.populateTransaction = function (transaction) {
	        return __awaiter(this, void 0, void 0, function () {
	            var tx;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, lib$3.resolveProperties(this.checkTransaction(transaction))];
	                    case 1:
	                        tx = _a.sent();
	                        if (tx.to != null) {
	                            tx.to = Promise.resolve(tx.to).then(function (to) { return _this.resolveName(to); });
	                        }
	                        if (tx.gasPrice == null) {
	                            tx.gasPrice = this.getGasPrice();
	                        }
	                        if (tx.nonce == null) {
	                            tx.nonce = this.getTransactionCount("pending");
	                        }
	                        if (tx.gasLimit == null) {
	                            tx.gasLimit = this.estimateGas(tx).catch(function (error) {
	                                return logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", lib.Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
	                                    error: error,
	                                    tx: tx
	                                });
	                            });
	                        }
	                        if (tx.chainId == null) {
	                            tx.chainId = this.getChainId();
	                        }
	                        else {
	                            tx.chainId = Promise.all([
	                                Promise.resolve(tx.chainId),
	                                this.getChainId()
	                            ]).then(function (results) {
	                                if (results[1] !== 0 && results[0] !== results[1]) {
	                                    logger.throwArgumentError("chainId address mismatch", "transaction", transaction);
	                                }
	                                return results[0];
	                            });
	                        }
	                        return [4 /*yield*/, lib$3.resolveProperties(tx)];
	                    case 2: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	    ///////////////////
	    // Sub-classes SHOULD leave these alone
	    Signer.prototype._checkProvider = function (operation) {
	        if (!this.provider) {
	            logger.throwError("missing provider", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: (operation || "_checkProvider")
	            });
	        }
	    };
	    Signer.isSigner = function (value) {
	        return !!(value && value._isSigner);
	    };
	    return Signer;
	}());
	exports.Signer = Signer;
	var VoidSigner = /** @class */ (function (_super) {
	    __extends(VoidSigner, _super);
	    function VoidSigner(address, provider) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, VoidSigner);
	        _this = _super.call(this) || this;
	        lib$3.defineReadOnly(_this, "address", address);
	        lib$3.defineReadOnly(_this, "provider", provider || null);
	        return _this;
	    }
	    VoidSigner.prototype.getAddress = function () {
	        return Promise.resolve(this.address);
	    };
	    VoidSigner.prototype._fail = function (message, operation) {
	        return Promise.resolve().then(function () {
	            logger.throwError(message, lib.Logger.errors.UNSUPPORTED_OPERATION, { operation: operation });
	        });
	    };
	    VoidSigner.prototype.signMessage = function (message) {
	        return this._fail("VoidSigner cannot sign messages", "signMessage");
	    };
	    VoidSigner.prototype.signTransaction = function (transaction) {
	        return this._fail("VoidSigner cannot sign transactions", "signTransaction");
	    };
	    VoidSigner.prototype.connect = function (provider) {
	        return new VoidSigner(this.address, provider);
	    };
	    return VoidSigner;
	}(Signer));
	exports.VoidSigner = VoidSigner;

	});

	var index$c = unwrapExports(lib$c);
	var lib_1$c = lib$c.Signer;
	var lib_2$b = lib$c.VoidSigner;

	var _version$m = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "contracts/5.0.2";

	});

	var _version$n = unwrapExports(_version$m);
	var _version_1$b = _version$m.version;

	var lib$d = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
	    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	    for (var r = Array(s), k = 0, i = 0; i < il; i++)
	        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
	            r[k] = a[j];
	    return r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });






	//import { AddressZero } from "@ethersproject/constants";

	// @TOOD remove dependences transactions


	var logger = new lib.Logger(_version$m.version);
	;
	;
	///////////////////////////////
	var allowedTransactionKeys = {
	    chainId: true, data: true, from: true, gasLimit: true, gasPrice: true, nonce: true, to: true, value: true
	};
	function resolveName(resolver, nameOrPromise) {
	    return __awaiter(this, void 0, void 0, function () {
	        var name;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, nameOrPromise];
	                case 1:
	                    name = _a.sent();
	                    // If it is already an address, just use it (after adding checksum)
	                    try {
	                        return [2 /*return*/, lib$6.getAddress(name)];
	                    }
	                    catch (error) { }
	                    if (!resolver) {
	                        logger.throwError("a provider or signer is needed to resolve ENS names", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                            operation: "resolveName"
	                        });
	                    }
	                    return [4 /*yield*/, resolver.resolveName(name)];
	                case 2: return [2 /*return*/, _a.sent()];
	            }
	        });
	    });
	}
	// Recursively replaces ENS names with promises to resolve the name and resolves all properties
	function resolveAddresses(resolver, value, paramType) {
	    if (Array.isArray(paramType)) {
	        return Promise.all(paramType.map(function (paramType, index) {
	            return resolveAddresses(resolver, ((Array.isArray(value)) ? value[index] : value[paramType.name]), paramType);
	        }));
	    }
	    if (paramType.type === "address") {
	        return resolveName(resolver, value);
	    }
	    if (paramType.type === "tuple") {
	        return resolveAddresses(resolver, value, paramType.components);
	    }
	    if (paramType.baseType === "array") {
	        if (!Array.isArray(value)) {
	            throw new Error("invalid value for array");
	        }
	        return Promise.all(value.map(function (v) { return resolveAddresses(resolver, v, paramType.arrayChildren); }));
	    }
	    return Promise.resolve(value);
	}
	function populateTransaction(contract, fragment, args) {
	    return __awaiter(this, void 0, void 0, function () {
	        var overrides, resolved, tx, ro, roValue, leftovers;
	        var _this = this;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    overrides = {};
	                    if (args.length === fragment.inputs.length + 1 && typeof (args[args.length - 1]) === "object") {
	                        overrides = lib$3.shallowCopy(args.pop());
	                    }
	                    // Make sure the parameter count matches
	                    logger.checkArgumentCount(args.length, fragment.inputs.length, "passed to contract");
	                    // Populate "from" override (allow promises)
	                    if (contract.signer) {
	                        if (overrides.from) {
	                            // Contracts with a Signer are from the Signer's frame-of-reference;
	                            // but we allow overriding "from" if it matches the signer
	                            overrides.from = lib$3.resolveProperties({
	                                override: resolveName(contract.signer, overrides.from),
	                                signer: contract.signer.getAddress()
	                            }).then(function (check) { return __awaiter(_this, void 0, void 0, function () {
	                                return __generator(this, function (_a) {
	                                    if (lib$6.getAddress(check.signer) !== check.override) {
	                                        logger.throwError("Contract with a Signer cannot override from", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                                            operation: "overrides.from"
	                                        });
	                                    }
	                                    return [2 /*return*/, check.override];
	                                });
	                            }); });
	                        }
	                        else {
	                            overrides.from = contract.signer.getAddress();
	                        }
	                    }
	                    else if (overrides.from) {
	                        overrides.from = resolveName(contract.provider, overrides.from);
	                        //} else {
	                        // Contracts without a signer can override "from", and if
	                        // unspecified the zero address is used
	                        //overrides.from = AddressZero;
	                    }
	                    return [4 /*yield*/, lib$3.resolveProperties({
	                            args: resolveAddresses(contract.signer || contract.provider, args, fragment.inputs),
	                            address: contract.resolvedAddress,
	                            overrides: (lib$3.resolveProperties(overrides) || {})
	                        })];
	                case 1:
	                    resolved = _a.sent();
	                    tx = {
	                        data: contract.interface.encodeFunctionData(fragment, resolved.args),
	                        to: resolved.address
	                    };
	                    ro = resolved.overrides;
	                    // Populate simple overrides
	                    if (ro.nonce != null) {
	                        tx.nonce = lib$2.BigNumber.from(ro.nonce).toNumber();
	                    }
	                    if (ro.gasLimit != null) {
	                        tx.gasLimit = lib$2.BigNumber.from(ro.gasLimit);
	                    }
	                    if (ro.gasPrice != null) {
	                        tx.gasPrice = lib$2.BigNumber.from(ro.gasPrice);
	                    }
	                    if (ro.from != null) {
	                        tx.from = ro.from;
	                    }
	                    // If there was no "gasLimit" override, but the ABI specifies a default, use it
	                    if (tx.gasLimit == null && fragment.gas != null) {
	                        tx.gasLimit = lib$2.BigNumber.from(fragment.gas).add(21000);
	                    }
	                    // Populate "value" override
	                    if (ro.value) {
	                        roValue = lib$2.BigNumber.from(ro.value);
	                        if (!roValue.isZero() && !fragment.payable) {
	                            logger.throwError("non-payable method cannot override value", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                                operation: "overrides.value",
	                                value: overrides.value
	                            });
	                        }
	                        tx.value = roValue;
	                    }
	                    // Remvoe the overrides
	                    delete overrides.nonce;
	                    delete overrides.gasLimit;
	                    delete overrides.gasPrice;
	                    delete overrides.from;
	                    delete overrides.value;
	                    leftovers = Object.keys(overrides).filter(function (key) { return (overrides[key] != null); });
	                    if (leftovers.length) {
	                        logger.throwError("cannot override " + leftovers.map(function (l) { return JSON.stringify(l); }).join(","), lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                            operation: "overrides",
	                            overrides: leftovers
	                        });
	                    }
	                    return [2 /*return*/, tx];
	            }
	        });
	    });
	}
	function buildPopulate(contract, fragment) {
	    return function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                return [2 /*return*/, populateTransaction(contract, fragment, args)];
	            });
	        });
	    };
	}
	function buildEstimate(contract, fragment) {
	    var signerOrProvider = (contract.signer || contract.provider);
	    return function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return __awaiter(this, void 0, void 0, function () {
	            var tx;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!signerOrProvider) {
	                            logger.throwError("estimate require a provider or signer", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                                operation: "estimateGas"
	                            });
	                        }
	                        return [4 /*yield*/, populateTransaction(contract, fragment, args)];
	                    case 1:
	                        tx = _a.sent();
	                        return [4 /*yield*/, signerOrProvider.estimateGas(tx)];
	                    case 2: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	}
	function buildCall(contract, fragment, collapseSimple) {
	    var signerOrProvider = (contract.signer || contract.provider);
	    return function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return __awaiter(this, void 0, void 0, function () {
	            var blockTag, overrides, tx, result, value;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        blockTag = undefined;
	                        if (!(args.length === fragment.inputs.length + 1 && typeof (args[args.length - 1]) === "object")) return [3 /*break*/, 3];
	                        overrides = lib$3.shallowCopy(args.pop());
	                        if (!(overrides.blockTag != null)) return [3 /*break*/, 2];
	                        return [4 /*yield*/, overrides.blockTag];
	                    case 1:
	                        blockTag = _a.sent();
	                        _a.label = 2;
	                    case 2:
	                        delete overrides.blockTag;
	                        args.push(overrides);
	                        _a.label = 3;
	                    case 3:
	                        if (!(contract.deployTransaction != null)) return [3 /*break*/, 5];
	                        return [4 /*yield*/, contract._deployed(blockTag)];
	                    case 4:
	                        _a.sent();
	                        _a.label = 5;
	                    case 5: return [4 /*yield*/, populateTransaction(contract, fragment, args)];
	                    case 6:
	                        tx = _a.sent();
	                        return [4 /*yield*/, signerOrProvider.call(tx, blockTag)];
	                    case 7:
	                        result = _a.sent();
	                        try {
	                            value = contract.interface.decodeFunctionResult(fragment, result);
	                            if (collapseSimple && fragment.outputs.length === 1) {
	                                value = value[0];
	                            }
	                            return [2 /*return*/, value];
	                        }
	                        catch (error) {
	                            if (error.code === lib.Logger.errors.CALL_EXCEPTION) {
	                                error.address = contract.address;
	                                error.args = args;
	                                error.transaction = tx;
	                            }
	                            throw error;
	                        }
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	}
	function buildSend(contract, fragment) {
	    return function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return __awaiter(this, void 0, void 0, function () {
	            var txRequest, tx, wait;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!contract.signer) {
	                            logger.throwError("sending a transaction requires a signer", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                                operation: "sendTransaction"
	                            });
	                        }
	                        if (!(contract.deployTransaction != null)) return [3 /*break*/, 2];
	                        return [4 /*yield*/, contract._deployed()];
	                    case 1:
	                        _a.sent();
	                        _a.label = 2;
	                    case 2: return [4 /*yield*/, populateTransaction(contract, fragment, args)];
	                    case 3:
	                        txRequest = _a.sent();
	                        return [4 /*yield*/, contract.signer.sendTransaction(txRequest)];
	                    case 4:
	                        tx = _a.sent();
	                        wait = tx.wait.bind(tx);
	                        tx.wait = function (confirmations) {
	                            return wait(confirmations).then(function (receipt) {
	                                receipt.events = receipt.logs.map(function (log) {
	                                    var event = lib$3.deepCopy(log);
	                                    var parsed = null;
	                                    try {
	                                        parsed = contract.interface.parseLog(log);
	                                    }
	                                    catch (e) { }
	                                    // Successfully parsed the event log; include it
	                                    if (parsed) {
	                                        event.args = parsed.args;
	                                        event.decode = function (data, topics) {
	                                            return contract.interface.decodeEventLog(parsed.eventFragment, data, topics);
	                                        };
	                                        event.event = parsed.name;
	                                        event.eventSignature = parsed.signature;
	                                    }
	                                    // Useful operations
	                                    event.removeListener = function () { return contract.provider; };
	                                    event.getBlock = function () {
	                                        return contract.provider.getBlock(receipt.blockHash);
	                                    };
	                                    event.getTransaction = function () {
	                                        return contract.provider.getTransaction(receipt.transactionHash);
	                                    };
	                                    event.getTransactionReceipt = function () {
	                                        return Promise.resolve(receipt);
	                                    };
	                                    return event;
	                                });
	                                return receipt;
	                            });
	                        };
	                        return [2 /*return*/, tx];
	                }
	            });
	        });
	    };
	}
	function buildDefault(contract, fragment, collapseSimple) {
	    if (fragment.constant) {
	        return buildCall(contract, fragment, collapseSimple);
	    }
	    return buildSend(contract, fragment);
	}
	function getEventTag(filter) {
	    if (filter.address && (filter.topics == null || filter.topics.length === 0)) {
	        return "*";
	    }
	    return (filter.address || "*") + "@" + (filter.topics ? filter.topics.map(function (topic) {
	        if (Array.isArray(topic)) {
	            return topic.join("|");
	        }
	        return topic;
	    }).join(":") : "");
	}
	var RunningEvent = /** @class */ (function () {
	    function RunningEvent(tag, filter) {
	        lib$3.defineReadOnly(this, "tag", tag);
	        lib$3.defineReadOnly(this, "filter", filter);
	        this._listeners = [];
	    }
	    RunningEvent.prototype.addListener = function (listener, once) {
	        this._listeners.push({ listener: listener, once: once });
	    };
	    RunningEvent.prototype.removeListener = function (listener) {
	        var done = false;
	        this._listeners = this._listeners.filter(function (item) {
	            if (done || item.listener !== listener) {
	                return true;
	            }
	            done = true;
	            return false;
	        });
	    };
	    RunningEvent.prototype.removeAllListeners = function () {
	        this._listeners = [];
	    };
	    RunningEvent.prototype.listeners = function () {
	        return this._listeners.map(function (i) { return i.listener; });
	    };
	    RunningEvent.prototype.listenerCount = function () {
	        return this._listeners.length;
	    };
	    RunningEvent.prototype.run = function (args) {
	        var _this = this;
	        var listenerCount = this.listenerCount();
	        this._listeners = this._listeners.filter(function (item) {
	            var argsCopy = args.slice();
	            // Call the callback in the next event loop
	            setTimeout(function () {
	                item.listener.apply(_this, argsCopy);
	            }, 0);
	            // Reschedule it if it not "once"
	            return !(item.once);
	        });
	        return listenerCount;
	    };
	    RunningEvent.prototype.prepareEvent = function (event) {
	    };
	    // Returns the array that will be applied to an emit
	    RunningEvent.prototype.getEmit = function (event) {
	        return [event];
	    };
	    return RunningEvent;
	}());
	var ErrorRunningEvent = /** @class */ (function (_super) {
	    __extends(ErrorRunningEvent, _super);
	    function ErrorRunningEvent() {
	        return _super.call(this, "error", null) || this;
	    }
	    return ErrorRunningEvent;
	}(RunningEvent));
	// @TODO Fragment should inherit Wildcard? and just override getEmit?
	//       or have a common abstract super class, with enough constructor
	//       options to configure both.
	// A Fragment Event will populate all the properties that Wildcard
	// will, and additioanlly dereference the arguments when emitting
	var FragmentRunningEvent = /** @class */ (function (_super) {
	    __extends(FragmentRunningEvent, _super);
	    function FragmentRunningEvent(address, contractInterface, fragment, topics) {
	        var _this = this;
	        var filter = {
	            address: address
	        };
	        var topic = contractInterface.getEventTopic(fragment);
	        if (topics) {
	            if (topic !== topics[0]) {
	                logger.throwArgumentError("topic mismatch", "topics", topics);
	            }
	            filter.topics = topics.slice();
	        }
	        else {
	            filter.topics = [topic];
	        }
	        _this = _super.call(this, getEventTag(filter), filter) || this;
	        lib$3.defineReadOnly(_this, "address", address);
	        lib$3.defineReadOnly(_this, "interface", contractInterface);
	        lib$3.defineReadOnly(_this, "fragment", fragment);
	        return _this;
	    }
	    FragmentRunningEvent.prototype.prepareEvent = function (event) {
	        var _this = this;
	        _super.prototype.prepareEvent.call(this, event);
	        event.event = this.fragment.name;
	        event.eventSignature = this.fragment.format();
	        event.decode = function (data, topics) {
	            return _this.interface.decodeEventLog(_this.fragment, data, topics);
	        };
	        try {
	            event.args = this.interface.decodeEventLog(this.fragment, event.data, event.topics);
	        }
	        catch (error) {
	            event.args = null;
	            event.decodeError = error;
	        }
	    };
	    FragmentRunningEvent.prototype.getEmit = function (event) {
	        var errors = lib$a.checkResultErrors(event.args);
	        if (errors.length) {
	            throw errors[0].error;
	        }
	        var args = (event.args || []).slice();
	        args.push(event);
	        return args;
	    };
	    return FragmentRunningEvent;
	}(RunningEvent));
	// A Wildard Event will attempt to populate:
	//  - event            The name of the event name
	//  - eventSignature   The full signature of the event
	//  - decode           A function to decode data and topics
	//  - args             The decoded data and topics
	var WildcardRunningEvent = /** @class */ (function (_super) {
	    __extends(WildcardRunningEvent, _super);
	    function WildcardRunningEvent(address, contractInterface) {
	        var _this = _super.call(this, "*", { address: address }) || this;
	        lib$3.defineReadOnly(_this, "address", address);
	        lib$3.defineReadOnly(_this, "interface", contractInterface);
	        return _this;
	    }
	    WildcardRunningEvent.prototype.prepareEvent = function (event) {
	        var _this = this;
	        _super.prototype.prepareEvent.call(this, event);
	        try {
	            var parsed_1 = this.interface.parseLog(event);
	            event.event = parsed_1.name;
	            event.eventSignature = parsed_1.signature;
	            event.decode = function (data, topics) {
	                return _this.interface.decodeEventLog(parsed_1.eventFragment, data, topics);
	            };
	            event.args = parsed_1.args;
	        }
	        catch (error) {
	            // No matching event
	        }
	    };
	    return WildcardRunningEvent;
	}(RunningEvent));
	var Contract = /** @class */ (function () {
	    function Contract(addressOrName, contractInterface, signerOrProvider) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, Contract);
	        // @TODO: Maybe still check the addressOrName looks like a valid address or name?
	        //address = getAddress(address);
	        lib$3.defineReadOnly(this, "interface", lib$3.getStatic((_newTarget), "getInterface")(contractInterface));
	        if (signerOrProvider == null) {
	            lib$3.defineReadOnly(this, "provider", null);
	            lib$3.defineReadOnly(this, "signer", null);
	        }
	        else if (lib$c.Signer.isSigner(signerOrProvider)) {
	            lib$3.defineReadOnly(this, "provider", signerOrProvider.provider || null);
	            lib$3.defineReadOnly(this, "signer", signerOrProvider);
	        }
	        else if (lib$b.Provider.isProvider(signerOrProvider)) {
	            lib$3.defineReadOnly(this, "provider", signerOrProvider);
	            lib$3.defineReadOnly(this, "signer", null);
	        }
	        else {
	            logger.throwArgumentError("invalid signer or provider", "signerOrProvider", signerOrProvider);
	        }
	        lib$3.defineReadOnly(this, "callStatic", {});
	        lib$3.defineReadOnly(this, "estimateGas", {});
	        lib$3.defineReadOnly(this, "functions", {});
	        lib$3.defineReadOnly(this, "populateTransaction", {});
	        lib$3.defineReadOnly(this, "filters", {});
	        {
	            var uniqueFilters_1 = {};
	            Object.keys(this.interface.events).forEach(function (eventSignature) {
	                var event = _this.interface.events[eventSignature];
	                lib$3.defineReadOnly(_this.filters, eventSignature, function () {
	                    var args = [];
	                    for (var _i = 0; _i < arguments.length; _i++) {
	                        args[_i] = arguments[_i];
	                    }
	                    return {
	                        address: _this.address,
	                        topics: _this.interface.encodeFilterTopics(event, args)
	                    };
	                });
	                if (!uniqueFilters_1[event.name]) {
	                    uniqueFilters_1[event.name] = [];
	                }
	                uniqueFilters_1[event.name].push(eventSignature);
	            });
	            Object.keys(uniqueFilters_1).forEach(function (name) {
	                var filters = uniqueFilters_1[name];
	                if (filters.length === 1) {
	                    lib$3.defineReadOnly(_this.filters, name, _this.filters[filters[0]]);
	                }
	                else {
	                    logger.warn("Duplicate definition of " + name + " (" + filters.join(", ") + ")");
	                }
	            });
	        }
	        lib$3.defineReadOnly(this, "_runningEvents", {});
	        lib$3.defineReadOnly(this, "_wrappedEmits", {});
	        lib$3.defineReadOnly(this, "address", addressOrName);
	        if (this.provider) {
	            lib$3.defineReadOnly(this, "resolvedAddress", this.provider.resolveName(addressOrName).then(function (address) {
	                if (address == null) {
	                    throw new Error("name not found");
	                }
	                return address;
	            }).catch(function (error) {
	                console.log("ERROR: Cannot find Contract - " + addressOrName);
	                throw error;
	            }));
	        }
	        else {
	            try {
	                lib$3.defineReadOnly(this, "resolvedAddress", Promise.resolve(lib$6.getAddress(addressOrName)));
	            }
	            catch (error) {
	                // Without a provider, we cannot use ENS names
	                logger.throwError("provider is required to use ENS name as contract address", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                    operation: "new Contract"
	                });
	            }
	        }
	        var uniqueNames = {};
	        var uniqueSignatures = {};
	        Object.keys(this.interface.functions).forEach(function (signature) {
	            var fragment = _this.interface.functions[signature];
	            // Check that the signature is unique; if not the ABI generation has
	            // not been cleaned or may be incorrectly generated
	            if (uniqueSignatures[signature]) {
	                logger.warn("Duplicate ABI entry for " + JSON.stringify(name));
	                return;
	            }
	            uniqueSignatures[signature] = true;
	            // Track unique names; we only expose bare named functions if they
	            // are ambiguous
	            {
	                var name_1 = fragment.name;
	                if (!uniqueNames[name_1]) {
	                    uniqueNames[name_1] = [];
	                }
	                uniqueNames[name_1].push(signature);
	            }
	            if (_this[signature] == null) {
	                lib$3.defineReadOnly(_this, signature, buildDefault(_this, fragment, true));
	            }
	            // We do not collapse simple calls on this bucket, which allows
	            // frameworks to safely use this without introspection as well as
	            // allows decoding error recovery.
	            if (_this.functions[signature] == null) {
	                lib$3.defineReadOnly(_this.functions, signature, buildDefault(_this, fragment, false));
	            }
	            if (_this.callStatic[signature] == null) {
	                lib$3.defineReadOnly(_this.callStatic, signature, buildCall(_this, fragment, true));
	            }
	            if (_this.populateTransaction[signature] == null) {
	                lib$3.defineReadOnly(_this.populateTransaction, signature, buildPopulate(_this, fragment));
	            }
	            if (_this.estimateGas[signature] == null) {
	                lib$3.defineReadOnly(_this.estimateGas, signature, buildEstimate(_this, fragment));
	            }
	        });
	        Object.keys(uniqueNames).forEach(function (name) {
	            // Ambiguous names to not get attached as bare names
	            var signatures = uniqueNames[name];
	            if (signatures.length > 1) {
	                return;
	            }
	            var signature = signatures[0];
	            if (_this[name] == null) {
	                lib$3.defineReadOnly(_this, name, _this[signature]);
	            }
	            if (_this.functions[name] == null) {
	                lib$3.defineReadOnly(_this.functions, name, _this.functions[signature]);
	            }
	            if (_this.callStatic[name] == null) {
	                lib$3.defineReadOnly(_this.callStatic, name, _this.callStatic[signature]);
	            }
	            if (_this.populateTransaction[name] == null) {
	                lib$3.defineReadOnly(_this.populateTransaction, name, _this.populateTransaction[signature]);
	            }
	            if (_this.estimateGas[name] == null) {
	                lib$3.defineReadOnly(_this.estimateGas, name, _this.estimateGas[signature]);
	            }
	        });
	    }
	    Contract.getContractAddress = function (transaction) {
	        return lib$6.getContractAddress(transaction);
	    };
	    Contract.getInterface = function (contractInterface) {
	        if (lib$a.Interface.isInterface(contractInterface)) {
	            return contractInterface;
	        }
	        return new lib$a.Interface(contractInterface);
	    };
	    // @TODO: Allow timeout?
	    Contract.prototype.deployed = function () {
	        return this._deployed();
	    };
	    Contract.prototype._deployed = function (blockTag) {
	        var _this = this;
	        if (!this._deployedPromise) {
	            // If we were just deployed, we know the transaction we should occur in
	            if (this.deployTransaction) {
	                this._deployedPromise = this.deployTransaction.wait().then(function () {
	                    return _this;
	                });
	            }
	            else {
	                // @TODO: Once we allow a timeout to be passed in, we will wait
	                // up to that many blocks for getCode
	                // Otherwise, poll for our code to be deployed
	                this._deployedPromise = this.provider.getCode(this.address, blockTag).then(function (code) {
	                    if (code === "0x") {
	                        logger.throwError("contract not deployed", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                            contractAddress: _this.address,
	                            operation: "getDeployed"
	                        });
	                    }
	                    return _this;
	                });
	            }
	        }
	        return this._deployedPromise;
	    };
	    // @TODO:
	    // estimateFallback(overrides?: TransactionRequest): Promise<BigNumber>
	    // @TODO:
	    // estimateDeploy(bytecode: string, ...args): Promise<BigNumber>
	    Contract.prototype.fallback = function (overrides) {
	        var _this = this;
	        if (!this.signer) {
	            logger.throwError("sending a transactions require a signer", lib.Logger.errors.UNSUPPORTED_OPERATION, { operation: "sendTransaction(fallback)" });
	        }
	        var tx = lib$3.shallowCopy(overrides || {});
	        ["from", "to"].forEach(function (key) {
	            if (tx[key] == null) {
	                return;
	            }
	            logger.throwError("cannot override " + key, lib.Logger.errors.UNSUPPORTED_OPERATION, { operation: key });
	        });
	        tx.to = this.resolvedAddress;
	        return this.deployed().then(function () {
	            return _this.signer.sendTransaction(tx);
	        });
	    };
	    // Reconnect to a different signer or provider
	    Contract.prototype.connect = function (signerOrProvider) {
	        if (typeof (signerOrProvider) === "string") {
	            signerOrProvider = new lib$c.VoidSigner(signerOrProvider, this.provider);
	        }
	        var contract = new (this.constructor)(this.address, this.interface, signerOrProvider);
	        if (this.deployTransaction) {
	            lib$3.defineReadOnly(contract, "deployTransaction", this.deployTransaction);
	        }
	        return contract;
	    };
	    // Re-attach to a different on-chain instance of this contract
	    Contract.prototype.attach = function (addressOrName) {
	        return new (this.constructor)(addressOrName, this.interface, this.signer || this.provider);
	    };
	    Contract.isIndexed = function (value) {
	        return lib$a.Indexed.isIndexed(value);
	    };
	    Contract.prototype._normalizeRunningEvent = function (runningEvent) {
	        // Already have an instance of this event running; we can re-use it
	        if (this._runningEvents[runningEvent.tag]) {
	            return this._runningEvents[runningEvent.tag];
	        }
	        return runningEvent;
	    };
	    Contract.prototype._getRunningEvent = function (eventName) {
	        if (typeof (eventName) === "string") {
	            // Listen for "error" events (if your contract has an error event, include
	            // the full signature to bypass this special event keyword)
	            if (eventName === "error") {
	                return this._normalizeRunningEvent(new ErrorRunningEvent());
	            }
	            // Listen for any event that is registered
	            if (eventName === "event") {
	                return this._normalizeRunningEvent(new RunningEvent("event", null));
	            }
	            // Listen for any event
	            if (eventName === "*") {
	                return this._normalizeRunningEvent(new WildcardRunningEvent(this.address, this.interface));
	            }
	            // Get the event Fragment (throws if ambiguous/unknown event)
	            var fragment = this.interface.getEvent(eventName);
	            return this._normalizeRunningEvent(new FragmentRunningEvent(this.address, this.interface, fragment));
	        }
	        // We have topics to filter by...
	        if (eventName.topics && eventName.topics.length > 0) {
	            // Is it a known topichash? (throws if no matching topichash)
	            try {
	                var topic = eventName.topics[0];
	                if (typeof (topic) !== "string") {
	                    throw new Error("invalid topic"); // @TODO: May happen for anonymous events
	                }
	                var fragment = this.interface.getEvent(topic);
	                return this._normalizeRunningEvent(new FragmentRunningEvent(this.address, this.interface, fragment, eventName.topics));
	            }
	            catch (error) { }
	            // Filter by the unknown topichash
	            var filter = {
	                address: this.address,
	                topics: eventName.topics
	            };
	            return this._normalizeRunningEvent(new RunningEvent(getEventTag(filter), filter));
	        }
	        return this._normalizeRunningEvent(new WildcardRunningEvent(this.address, this.interface));
	    };
	    Contract.prototype._checkRunningEvents = function (runningEvent) {
	        if (runningEvent.listenerCount() === 0) {
	            delete this._runningEvents[runningEvent.tag];
	            // If we have a poller for this, remove it
	            var emit = this._wrappedEmits[runningEvent.tag];
	            if (emit) {
	                this.provider.off(runningEvent.filter, emit);
	                delete this._wrappedEmits[runningEvent.tag];
	            }
	        }
	    };
	    // Subclasses can override this to gracefully recover
	    // from parse errors if they wish
	    Contract.prototype._wrapEvent = function (runningEvent, log, listener) {
	        var _this = this;
	        var event = lib$3.deepCopy(log);
	        event.removeListener = function () {
	            if (!listener) {
	                return;
	            }
	            runningEvent.removeListener(listener);
	            _this._checkRunningEvents(runningEvent);
	        };
	        event.getBlock = function () { return _this.provider.getBlock(log.blockHash); };
	        event.getTransaction = function () { return _this.provider.getTransaction(log.transactionHash); };
	        event.getTransactionReceipt = function () { return _this.provider.getTransactionReceipt(log.transactionHash); };
	        // This may throw if the topics and data mismatch the signature
	        runningEvent.prepareEvent(event);
	        return event;
	    };
	    Contract.prototype._addEventListener = function (runningEvent, listener, once) {
	        var _this = this;
	        if (!this.provider) {
	            logger.throwError("events require a provider or a signer with a provider", lib.Logger.errors.UNSUPPORTED_OPERATION, { operation: "once" });
	        }
	        runningEvent.addListener(listener, once);
	        // Track this running event and its listeners (may already be there; but no hard in updating)
	        this._runningEvents[runningEvent.tag] = runningEvent;
	        // If we are not polling the provider, start polling
	        if (!this._wrappedEmits[runningEvent.tag]) {
	            var wrappedEmit = function (log) {
	                var event = _this._wrapEvent(runningEvent, log, listener);
	                // Try to emit the result for the parameterized event...
	                if (event.decodeError == null) {
	                    try {
	                        var args = runningEvent.getEmit(event);
	                        _this.emit.apply(_this, __spreadArrays([runningEvent.filter], args));
	                    }
	                    catch (error) {
	                        event.decodeError = error.error;
	                    }
	                }
	                // Always emit "event" for fragment-base events
	                if (runningEvent.filter != null) {
	                    _this.emit("event", event);
	                }
	                // Emit "error" if there was an error
	                if (event.decodeError != null) {
	                    _this.emit("error", event.decodeError, event);
	                }
	            };
	            this._wrappedEmits[runningEvent.tag] = wrappedEmit;
	            // Special events, like "error" do not have a filter
	            if (runningEvent.filter != null) {
	                this.provider.on(runningEvent.filter, wrappedEmit);
	            }
	        }
	    };
	    Contract.prototype.queryFilter = function (event, fromBlockOrBlockhash, toBlock) {
	        var _this = this;
	        var runningEvent = this._getRunningEvent(event);
	        var filter = lib$3.shallowCopy(runningEvent.filter);
	        if (typeof (fromBlockOrBlockhash) === "string" && lib$1.isHexString(fromBlockOrBlockhash, 32)) {
	            if (toBlock != null) {
	                logger.throwArgumentError("cannot specify toBlock with blockhash", "toBlock", toBlock);
	            }
	            filter.blockHash = fromBlockOrBlockhash;
	        }
	        else {
	            filter.fromBlock = ((fromBlockOrBlockhash != null) ? fromBlockOrBlockhash : 0);
	            filter.toBlock = ((toBlock != null) ? toBlock : "latest");
	        }
	        return this.provider.getLogs(filter).then(function (logs) {
	            return logs.map(function (log) { return _this._wrapEvent(runningEvent, log, null); });
	        });
	    };
	    Contract.prototype.on = function (event, listener) {
	        this._addEventListener(this._getRunningEvent(event), listener, false);
	        return this;
	    };
	    Contract.prototype.once = function (event, listener) {
	        this._addEventListener(this._getRunningEvent(event), listener, true);
	        return this;
	    };
	    Contract.prototype.emit = function (eventName) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        if (!this.provider) {
	            return false;
	        }
	        var runningEvent = this._getRunningEvent(eventName);
	        var result = (runningEvent.run(args) > 0);
	        // May have drained all the "once" events; check for living events
	        this._checkRunningEvents(runningEvent);
	        return result;
	    };
	    Contract.prototype.listenerCount = function (eventName) {
	        if (!this.provider) {
	            return 0;
	        }
	        return this._getRunningEvent(eventName).listenerCount();
	    };
	    Contract.prototype.listeners = function (eventName) {
	        if (!this.provider) {
	            return [];
	        }
	        if (eventName == null) {
	            var result_1 = [];
	            for (var tag in this._runningEvents) {
	                this._runningEvents[tag].listeners().forEach(function (listener) {
	                    result_1.push(listener);
	                });
	            }
	            return result_1;
	        }
	        return this._getRunningEvent(eventName).listeners();
	    };
	    Contract.prototype.removeAllListeners = function (eventName) {
	        if (!this.provider) {
	            return this;
	        }
	        if (eventName == null) {
	            for (var tag in this._runningEvents) {
	                var runningEvent_1 = this._runningEvents[tag];
	                runningEvent_1.removeAllListeners();
	                this._checkRunningEvents(runningEvent_1);
	            }
	            return this;
	        }
	        // Delete any listeners
	        var runningEvent = this._getRunningEvent(eventName);
	        runningEvent.removeAllListeners();
	        this._checkRunningEvents(runningEvent);
	        return this;
	    };
	    Contract.prototype.off = function (eventName, listener) {
	        if (!this.provider) {
	            return this;
	        }
	        var runningEvent = this._getRunningEvent(eventName);
	        runningEvent.removeListener(listener);
	        this._checkRunningEvents(runningEvent);
	        return this;
	    };
	    Contract.prototype.removeListener = function (eventName, listener) {
	        return this.off(eventName, listener);
	    };
	    return Contract;
	}());
	exports.Contract = Contract;
	var ContractFactory = /** @class */ (function () {
	    function ContractFactory(contractInterface, bytecode, signer) {
	        var _newTarget = this.constructor;
	        var bytecodeHex = null;
	        if (typeof (bytecode) === "string") {
	            bytecodeHex = bytecode;
	        }
	        else if (lib$1.isBytes(bytecode)) {
	            bytecodeHex = lib$1.hexlify(bytecode);
	        }
	        else if (bytecode && typeof (bytecode.object) === "string") {
	            // Allow the bytecode object from the Solidity compiler
	            bytecodeHex = bytecode.object;
	        }
	        else {
	            // Crash in the next verification step
	            bytecodeHex = "!";
	        }
	        // Make sure it is 0x prefixed
	        if (bytecodeHex.substring(0, 2) !== "0x") {
	            bytecodeHex = "0x" + bytecodeHex;
	        }
	        // Make sure the final result is valid bytecode
	        if (!lib$1.isHexString(bytecodeHex) || (bytecodeHex.length % 2)) {
	            logger.throwArgumentError("invalid bytecode", "bytecode", bytecode);
	        }
	        // If we have a signer, make sure it is valid
	        if (signer && !lib$c.Signer.isSigner(signer)) {
	            logger.throwArgumentError("invalid signer", "signer", signer);
	        }
	        lib$3.defineReadOnly(this, "bytecode", bytecodeHex);
	        lib$3.defineReadOnly(this, "interface", lib$3.getStatic((_newTarget), "getInterface")(contractInterface));
	        lib$3.defineReadOnly(this, "signer", signer || null);
	    }
	    // @TODO: Future; rename to populteTransaction?
	    ContractFactory.prototype.getDeployTransaction = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var tx = {};
	        // If we have 1 additional argument, we allow transaction overrides
	        if (args.length === this.interface.deploy.inputs.length + 1 && typeof (args[args.length - 1]) === "object") {
	            tx = lib$3.shallowCopy(args.pop());
	            for (var key in tx) {
	                if (!allowedTransactionKeys[key]) {
	                    throw new Error("unknown transaction override " + key);
	                }
	            }
	        }
	        // Do not allow these to be overridden in a deployment transaction
	        ["data", "from", "to"].forEach(function (key) {
	            if (tx[key] == null) {
	                return;
	            }
	            logger.throwError("cannot override " + key, lib.Logger.errors.UNSUPPORTED_OPERATION, { operation: key });
	        });
	        // Make sure the call matches the constructor signature
	        logger.checkArgumentCount(args.length, this.interface.deploy.inputs.length, " in Contract constructor");
	        // Set the data to the bytecode + the encoded constructor arguments
	        tx.data = lib$1.hexlify(lib$1.concat([
	            this.bytecode,
	            this.interface.encodeDeploy(args)
	        ]));
	        return tx;
	    };
	    ContractFactory.prototype.deploy = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return __awaiter(this, void 0, void 0, function () {
	            var overrides, params, unsignedTx, tx, address, contract;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        overrides = {};
	                        // If 1 extra parameter was passed in, it contains overrides
	                        if (args.length === this.interface.deploy.inputs.length + 1) {
	                            overrides = args.pop();
	                        }
	                        // Make sure the call matches the constructor signature
	                        logger.checkArgumentCount(args.length, this.interface.deploy.inputs.length, " in Contract constructor");
	                        return [4 /*yield*/, resolveAddresses(this.signer, args, this.interface.deploy.inputs)];
	                    case 1:
	                        params = _a.sent();
	                        params.push(overrides);
	                        unsignedTx = this.getDeployTransaction.apply(this, params);
	                        return [4 /*yield*/, this.signer.sendTransaction(unsignedTx)];
	                    case 2:
	                        tx = _a.sent();
	                        address = lib$3.getStatic(this.constructor, "getContractAddress")(tx);
	                        contract = lib$3.getStatic(this.constructor, "getContract")(address, this.interface, this.signer);
	                        lib$3.defineReadOnly(contract, "deployTransaction", tx);
	                        return [2 /*return*/, contract];
	                }
	            });
	        });
	    };
	    ContractFactory.prototype.attach = function (address) {
	        return (this.constructor).getContract(address, this.interface, this.signer);
	    };
	    ContractFactory.prototype.connect = function (signer) {
	        return new (this.constructor)(this.interface, this.bytecode, signer);
	    };
	    ContractFactory.fromSolidity = function (compilerOutput, signer) {
	        if (compilerOutput == null) {
	            logger.throwError("missing compiler output", lib.Logger.errors.MISSING_ARGUMENT, { argument: "compilerOutput" });
	        }
	        if (typeof (compilerOutput) === "string") {
	            compilerOutput = JSON.parse(compilerOutput);
	        }
	        var abi = compilerOutput.abi;
	        var bytecode = null;
	        if (compilerOutput.bytecode) {
	            bytecode = compilerOutput.bytecode;
	        }
	        else if (compilerOutput.evm && compilerOutput.evm.bytecode) {
	            bytecode = compilerOutput.evm.bytecode;
	        }
	        return new this(abi, bytecode, signer);
	    };
	    ContractFactory.getInterface = function (contractInterface) {
	        return Contract.getInterface(contractInterface);
	    };
	    ContractFactory.getContractAddress = function (tx) {
	        return lib$6.getContractAddress(tx);
	    };
	    ContractFactory.getContract = function (address, contractInterface, signer) {
	        return new Contract(address, contractInterface, signer);
	    };
	    return ContractFactory;
	}());
	exports.ContractFactory = ContractFactory;

	});

	var index$d = unwrapExports(lib$d);
	var lib_1$d = lib$d.Contract;
	var lib_2$c = lib$d.ContractFactory;

	var lib$e = createCommonjsModule(function (module, exports) {
	"use strict";
	/**
	 * var basex = require("base-x");
	 *
	 * This implementation is heavily based on base-x. The main reason to
	 * deviate was to prevent the dependency of Buffer.
	 *
	 * Contributors:
	 *
	 * base-x encoding
	 * Forked from https://github.com/cryptocoinjs/bs58
	 * Originally written by Mike Hearn for BitcoinJ
	 * Copyright (c) 2011 Google Inc
	 * Ported to JavaScript by Stefan Thomas
	 * Merged Buffer refactorings from base58-native by Stephen Pair
	 * Copyright (c) 2013 BitPay Inc
	 *
	 * The MIT License (MIT)
	 *
	 * Copyright base-x contributors (c) 2016
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a
	 * copy of this software and associated documentation files (the "Software"),
	 * to deal in the Software without restriction, including without limitation
	 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
	 * and/or sell copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.

	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
	 * IN THE SOFTWARE.
	 *
	 */
	Object.defineProperty(exports, "__esModule", { value: true });


	var BaseX = /** @class */ (function () {
	    function BaseX(alphabet) {
	        lib$3.defineReadOnly(this, "alphabet", alphabet);
	        lib$3.defineReadOnly(this, "base", alphabet.length);
	        lib$3.defineReadOnly(this, "_alphabetMap", {});
	        lib$3.defineReadOnly(this, "_leader", alphabet.charAt(0));
	        // pre-compute lookup table
	        for (var i = 0; i < alphabet.length; i++) {
	            this._alphabetMap[alphabet.charAt(i)] = i;
	        }
	    }
	    BaseX.prototype.encode = function (value) {
	        var source = lib$1.arrayify(value);
	        if (source.length === 0) {
	            return "";
	        }
	        var digits = [0];
	        for (var i = 0; i < source.length; ++i) {
	            var carry = source[i];
	            for (var j = 0; j < digits.length; ++j) {
	                carry += digits[j] << 8;
	                digits[j] = carry % this.base;
	                carry = (carry / this.base) | 0;
	            }
	            while (carry > 0) {
	                digits.push(carry % this.base);
	                carry = (carry / this.base) | 0;
	            }
	        }
	        var string = "";
	        // deal with leading zeros
	        for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) {
	            string += this._leader;
	        }
	        // convert digits to a string
	        for (var q = digits.length - 1; q >= 0; --q) {
	            string += this.alphabet[digits[q]];
	        }
	        return string;
	    };
	    BaseX.prototype.decode = function (value) {
	        if (typeof (value) !== "string") {
	            throw new TypeError("Expected String");
	        }
	        var bytes = [];
	        if (value.length === 0) {
	            return new Uint8Array(bytes);
	        }
	        bytes.push(0);
	        for (var i = 0; i < value.length; i++) {
	            var byte = this._alphabetMap[value[i]];
	            if (byte === undefined) {
	                throw new Error("Non-base" + this.base + " character");
	            }
	            var carry = byte;
	            for (var j = 0; j < bytes.length; ++j) {
	                carry += bytes[j] * this.base;
	                bytes[j] = carry & 0xff;
	                carry >>= 8;
	            }
	            while (carry > 0) {
	                bytes.push(carry & 0xff);
	                carry >>= 8;
	            }
	        }
	        // deal with leading zeros
	        for (var k = 0; value[k] === this._leader && k < value.length - 1; ++k) {
	            bytes.push(0);
	        }
	        return lib$1.arrayify(new Uint8Array(bytes.reverse()));
	    };
	    return BaseX;
	}());
	exports.BaseX = BaseX;
	var Base32 = new BaseX("abcdefghijklmnopqrstuvwxyz234567");
	exports.Base32 = Base32;
	var Base58 = new BaseX("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
	exports.Base58 = Base58;
	//console.log(Base58.decode("Qmd2V777o5XvJbYMeMb8k2nU5f8d3ciUQ5YpYuWhzv8iDj"))
	//console.log(Base58.encode(Base58.decode("Qmd2V777o5XvJbYMeMb8k2nU5f8d3ciUQ5YpYuWhzv8iDj")))

	});

	var index$e = unwrapExports(lib$e);
	var lib_1$e = lib$e.BaseX;
	var lib_2$d = lib$e.Base32;
	var lib_3$a = lib$e.Base58;

	var minimalisticAssert = assert;

	function assert(val, msg) {
	  if (!val)
	    throw new Error(msg || 'Assertion failed');
	}

	assert.equal = function assertEqual(l, r, msg) {
	  if (l != r)
	    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
	};

	var inherits_browser = createCommonjsModule(function (module) {
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    if (superCtor) {
	      ctor.super_ = superCtor;
	      ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	          value: ctor,
	          enumerable: false,
	          writable: true,
	          configurable: true
	        }
	      });
	    }
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    if (superCtor) {
	      ctor.super_ = superCtor;
	      var TempCtor = function () {};
	      TempCtor.prototype = superCtor.prototype;
	      ctor.prototype = new TempCtor();
	      ctor.prototype.constructor = ctor;
	    }
	  };
	}
	});

	'use strict';




	var inherits_1 = inherits_browser;

	function toArray(msg, enc) {
	  if (Array.isArray(msg))
	    return msg.slice();
	  if (!msg)
	    return [];
	  var res = [];
	  if (typeof msg === 'string') {
	    if (!enc) {
	      for (var i = 0; i < msg.length; i++) {
	        var c = msg.charCodeAt(i);
	        var hi = c >> 8;
	        var lo = c & 0xff;
	        if (hi)
	          res.push(hi, lo);
	        else
	          res.push(lo);
	      }
	    } else if (enc === 'hex') {
	      msg = msg.replace(/[^a-z0-9]+/ig, '');
	      if (msg.length % 2 !== 0)
	        msg = '0' + msg;
	      for (i = 0; i < msg.length; i += 2)
	        res.push(parseInt(msg[i] + msg[i + 1], 16));
	    }
	  } else {
	    for (i = 0; i < msg.length; i++)
	      res[i] = msg[i] | 0;
	  }
	  return res;
	}
	var toArray_1 = toArray;

	function toHex(msg) {
	  var res = '';
	  for (var i = 0; i < msg.length; i++)
	    res += zero2(msg[i].toString(16));
	  return res;
	}
	var toHex_1 = toHex;

	function htonl(w) {
	  var res = (w >>> 24) |
	            ((w >>> 8) & 0xff00) |
	            ((w << 8) & 0xff0000) |
	            ((w & 0xff) << 24);
	  return res >>> 0;
	}
	var htonl_1 = htonl;

	function toHex32(msg, endian) {
	  var res = '';
	  for (var i = 0; i < msg.length; i++) {
	    var w = msg[i];
	    if (endian === 'little')
	      w = htonl(w);
	    res += zero8(w.toString(16));
	  }
	  return res;
	}
	var toHex32_1 = toHex32;

	function zero2(word) {
	  if (word.length === 1)
	    return '0' + word;
	  else
	    return word;
	}
	var zero2_1 = zero2;

	function zero8(word) {
	  if (word.length === 7)
	    return '0' + word;
	  else if (word.length === 6)
	    return '00' + word;
	  else if (word.length === 5)
	    return '000' + word;
	  else if (word.length === 4)
	    return '0000' + word;
	  else if (word.length === 3)
	    return '00000' + word;
	  else if (word.length === 2)
	    return '000000' + word;
	  else if (word.length === 1)
	    return '0000000' + word;
	  else
	    return word;
	}
	var zero8_1 = zero8;

	function join32(msg, start, end, endian) {
	  var len = end - start;
	  minimalisticAssert(len % 4 === 0);
	  var res = new Array(len / 4);
	  for (var i = 0, k = start; i < res.length; i++, k += 4) {
	    var w;
	    if (endian === 'big')
	      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
	    else
	      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
	    res[i] = w >>> 0;
	  }
	  return res;
	}
	var join32_1 = join32;

	function split32(msg, endian) {
	  var res = new Array(msg.length * 4);
	  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
	    var m = msg[i];
	    if (endian === 'big') {
	      res[k] = m >>> 24;
	      res[k + 1] = (m >>> 16) & 0xff;
	      res[k + 2] = (m >>> 8) & 0xff;
	      res[k + 3] = m & 0xff;
	    } else {
	      res[k + 3] = m >>> 24;
	      res[k + 2] = (m >>> 16) & 0xff;
	      res[k + 1] = (m >>> 8) & 0xff;
	      res[k] = m & 0xff;
	    }
	  }
	  return res;
	}
	var split32_1 = split32;

	function rotr32(w, b) {
	  return (w >>> b) | (w << (32 - b));
	}
	var rotr32_1 = rotr32;

	function rotl32(w, b) {
	  return (w << b) | (w >>> (32 - b));
	}
	var rotl32_1 = rotl32;

	function sum32(a, b) {
	  return (a + b) >>> 0;
	}
	var sum32_1 = sum32;

	function sum32_3(a, b, c) {
	  return (a + b + c) >>> 0;
	}
	var sum32_3_1 = sum32_3;

	function sum32_4(a, b, c, d) {
	  return (a + b + c + d) >>> 0;
	}
	var sum32_4_1 = sum32_4;

	function sum32_5(a, b, c, d, e) {
	  return (a + b + c + d + e) >>> 0;
	}
	var sum32_5_1 = sum32_5;

	function sum64(buf, pos, ah, al) {
	  var bh = buf[pos];
	  var bl = buf[pos + 1];

	  var lo = (al + bl) >>> 0;
	  var hi = (lo < al ? 1 : 0) + ah + bh;
	  buf[pos] = hi >>> 0;
	  buf[pos + 1] = lo;
	}
	var sum64_1 = sum64;

	function sum64_hi(ah, al, bh, bl) {
	  var lo = (al + bl) >>> 0;
	  var hi = (lo < al ? 1 : 0) + ah + bh;
	  return hi >>> 0;
	}
	var sum64_hi_1 = sum64_hi;

	function sum64_lo(ah, al, bh, bl) {
	  var lo = al + bl;
	  return lo >>> 0;
	}
	var sum64_lo_1 = sum64_lo;

	function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
	  var carry = 0;
	  var lo = al;
	  lo = (lo + bl) >>> 0;
	  carry += lo < al ? 1 : 0;
	  lo = (lo + cl) >>> 0;
	  carry += lo < cl ? 1 : 0;
	  lo = (lo + dl) >>> 0;
	  carry += lo < dl ? 1 : 0;

	  var hi = ah + bh + ch + dh + carry;
	  return hi >>> 0;
	}
	var sum64_4_hi_1 = sum64_4_hi;

	function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
	  var lo = al + bl + cl + dl;
	  return lo >>> 0;
	}
	var sum64_4_lo_1 = sum64_4_lo;

	function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
	  var carry = 0;
	  var lo = al;
	  lo = (lo + bl) >>> 0;
	  carry += lo < al ? 1 : 0;
	  lo = (lo + cl) >>> 0;
	  carry += lo < cl ? 1 : 0;
	  lo = (lo + dl) >>> 0;
	  carry += lo < dl ? 1 : 0;
	  lo = (lo + el) >>> 0;
	  carry += lo < el ? 1 : 0;

	  var hi = ah + bh + ch + dh + eh + carry;
	  return hi >>> 0;
	}
	var sum64_5_hi_1 = sum64_5_hi;

	function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
	  var lo = al + bl + cl + dl + el;

	  return lo >>> 0;
	}
	var sum64_5_lo_1 = sum64_5_lo;

	function rotr64_hi(ah, al, num) {
	  var r = (al << (32 - num)) | (ah >>> num);
	  return r >>> 0;
	}
	var rotr64_hi_1 = rotr64_hi;

	function rotr64_lo(ah, al, num) {
	  var r = (ah << (32 - num)) | (al >>> num);
	  return r >>> 0;
	}
	var rotr64_lo_1 = rotr64_lo;

	function shr64_hi(ah, al, num) {
	  return ah >>> num;
	}
	var shr64_hi_1 = shr64_hi;

	function shr64_lo(ah, al, num) {
	  var r = (ah << (32 - num)) | (al >>> num);
	  return r >>> 0;
	}
	var shr64_lo_1 = shr64_lo;

	var utils = {
		inherits: inherits_1,
		toArray: toArray_1,
		toHex: toHex_1,
		htonl: htonl_1,
		toHex32: toHex32_1,
		zero2: zero2_1,
		zero8: zero8_1,
		join32: join32_1,
		split32: split32_1,
		rotr32: rotr32_1,
		rotl32: rotl32_1,
		sum32: sum32_1,
		sum32_3: sum32_3_1,
		sum32_4: sum32_4_1,
		sum32_5: sum32_5_1,
		sum64: sum64_1,
		sum64_hi: sum64_hi_1,
		sum64_lo: sum64_lo_1,
		sum64_4_hi: sum64_4_hi_1,
		sum64_4_lo: sum64_4_lo_1,
		sum64_5_hi: sum64_5_hi_1,
		sum64_5_lo: sum64_5_lo_1,
		rotr64_hi: rotr64_hi_1,
		rotr64_lo: rotr64_lo_1,
		shr64_hi: shr64_hi_1,
		shr64_lo: shr64_lo_1
	};

	'use strict';




	function BlockHash() {
	  this.pending = null;
	  this.pendingTotal = 0;
	  this.blockSize = this.constructor.blockSize;
	  this.outSize = this.constructor.outSize;
	  this.hmacStrength = this.constructor.hmacStrength;
	  this.padLength = this.constructor.padLength / 8;
	  this.endian = 'big';

	  this._delta8 = this.blockSize / 8;
	  this._delta32 = this.blockSize / 32;
	}
	var BlockHash_1 = BlockHash;

	BlockHash.prototype.update = function update(msg, enc) {
	  // Convert message to array, pad it, and join into 32bit blocks
	  msg = utils.toArray(msg, enc);
	  if (!this.pending)
	    this.pending = msg;
	  else
	    this.pending = this.pending.concat(msg);
	  this.pendingTotal += msg.length;

	  // Enough data, try updating
	  if (this.pending.length >= this._delta8) {
	    msg = this.pending;

	    // Process pending data in blocks
	    var r = msg.length % this._delta8;
	    this.pending = msg.slice(msg.length - r, msg.length);
	    if (this.pending.length === 0)
	      this.pending = null;

	    msg = utils.join32(msg, 0, msg.length - r, this.endian);
	    for (var i = 0; i < msg.length; i += this._delta32)
	      this._update(msg, i, i + this._delta32);
	  }

	  return this;
	};

	BlockHash.prototype.digest = function digest(enc) {
	  this.update(this._pad());
	  minimalisticAssert(this.pending === null);

	  return this._digest(enc);
	};

	BlockHash.prototype._pad = function pad() {
	  var len = this.pendingTotal;
	  var bytes = this._delta8;
	  var k = bytes - ((len + this.padLength) % bytes);
	  var res = new Array(k + this.padLength);
	  res[0] = 0x80;
	  for (var i = 1; i < k; i++)
	    res[i] = 0;

	  // Append length
	  len <<= 3;
	  if (this.endian === 'big') {
	    for (var t = 8; t < this.padLength; t++)
	      res[i++] = 0;

	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = (len >>> 24) & 0xff;
	    res[i++] = (len >>> 16) & 0xff;
	    res[i++] = (len >>> 8) & 0xff;
	    res[i++] = len & 0xff;
	  } else {
	    res[i++] = len & 0xff;
	    res[i++] = (len >>> 8) & 0xff;
	    res[i++] = (len >>> 16) & 0xff;
	    res[i++] = (len >>> 24) & 0xff;
	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = 0;

	    for (t = 8; t < this.padLength; t++)
	      res[i++] = 0;
	  }

	  return res;
	};

	var common = {
		BlockHash: BlockHash_1
	};

	var _1 = {};

	var _224 = {};

	'use strict';


	var rotr32$1 = utils.rotr32;

	function ft_1(s, x, y, z) {
	  if (s === 0)
	    return ch32(x, y, z);
	  if (s === 1 || s === 3)
	    return p32(x, y, z);
	  if (s === 2)
	    return maj32(x, y, z);
	}
	var ft_1_1 = ft_1;

	function ch32(x, y, z) {
	  return (x & y) ^ ((~x) & z);
	}
	var ch32_1 = ch32;

	function maj32(x, y, z) {
	  return (x & y) ^ (x & z) ^ (y & z);
	}
	var maj32_1 = maj32;

	function p32(x, y, z) {
	  return x ^ y ^ z;
	}
	var p32_1 = p32;

	function s0_256(x) {
	  return rotr32$1(x, 2) ^ rotr32$1(x, 13) ^ rotr32$1(x, 22);
	}
	var s0_256_1 = s0_256;

	function s1_256(x) {
	  return rotr32$1(x, 6) ^ rotr32$1(x, 11) ^ rotr32$1(x, 25);
	}
	var s1_256_1 = s1_256;

	function g0_256(x) {
	  return rotr32$1(x, 7) ^ rotr32$1(x, 18) ^ (x >>> 3);
	}
	var g0_256_1 = g0_256;

	function g1_256(x) {
	  return rotr32$1(x, 17) ^ rotr32$1(x, 19) ^ (x >>> 10);
	}
	var g1_256_1 = g1_256;

	var common$1 = {
		ft_1: ft_1_1,
		ch32: ch32_1,
		maj32: maj32_1,
		p32: p32_1,
		s0_256: s0_256_1,
		s1_256: s1_256_1,
		g0_256: g0_256_1,
		g1_256: g1_256_1
	};

	'use strict';






	var sum32$1 = utils.sum32;
	var sum32_4$1 = utils.sum32_4;
	var sum32_5$1 = utils.sum32_5;
	var ch32$1 = common$1.ch32;
	var maj32$1 = common$1.maj32;
	var s0_256$1 = common$1.s0_256;
	var s1_256$1 = common$1.s1_256;
	var g0_256$1 = common$1.g0_256;
	var g1_256$1 = common$1.g1_256;

	var BlockHash$1 = common.BlockHash;

	var sha256_K = [
	  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
	  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
	  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
	  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
	  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
	  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
	  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
	  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
	  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	];

	function SHA256() {
	  if (!(this instanceof SHA256))
	    return new SHA256();

	  BlockHash$1.call(this);
	  this.h = [
	    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
	    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
	  ];
	  this.k = sha256_K;
	  this.W = new Array(64);
	}
	utils.inherits(SHA256, BlockHash$1);
	var _256 = SHA256;

	SHA256.blockSize = 512;
	SHA256.outSize = 256;
	SHA256.hmacStrength = 192;
	SHA256.padLength = 64;

	SHA256.prototype._update = function _update(msg, start) {
	  var W = this.W;

	  for (var i = 0; i < 16; i++)
	    W[i] = msg[start + i];
	  for (; i < W.length; i++)
	    W[i] = sum32_4$1(g1_256$1(W[i - 2]), W[i - 7], g0_256$1(W[i - 15]), W[i - 16]);

	  var a = this.h[0];
	  var b = this.h[1];
	  var c = this.h[2];
	  var d = this.h[3];
	  var e = this.h[4];
	  var f = this.h[5];
	  var g = this.h[6];
	  var h = this.h[7];

	  minimalisticAssert(this.k.length === W.length);
	  for (i = 0; i < W.length; i++) {
	    var T1 = sum32_5$1(h, s1_256$1(e), ch32$1(e, f, g), this.k[i], W[i]);
	    var T2 = sum32$1(s0_256$1(a), maj32$1(a, b, c));
	    h = g;
	    g = f;
	    f = e;
	    e = sum32$1(d, T1);
	    d = c;
	    c = b;
	    b = a;
	    a = sum32$1(T1, T2);
	  }

	  this.h[0] = sum32$1(this.h[0], a);
	  this.h[1] = sum32$1(this.h[1], b);
	  this.h[2] = sum32$1(this.h[2], c);
	  this.h[3] = sum32$1(this.h[3], d);
	  this.h[4] = sum32$1(this.h[4], e);
	  this.h[5] = sum32$1(this.h[5], f);
	  this.h[6] = sum32$1(this.h[6], g);
	  this.h[7] = sum32$1(this.h[7], h);
	};

	SHA256.prototype._digest = function digest(enc) {
	  if (enc === 'hex')
	    return utils.toHex32(this.h, 'big');
	  else
	    return utils.split32(this.h, 'big');
	};

	var _384 = {};

	'use strict';





	var rotr64_hi$1 = utils.rotr64_hi;
	var rotr64_lo$1 = utils.rotr64_lo;
	var shr64_hi$1 = utils.shr64_hi;
	var shr64_lo$1 = utils.shr64_lo;
	var sum64$1 = utils.sum64;
	var sum64_hi$1 = utils.sum64_hi;
	var sum64_lo$1 = utils.sum64_lo;
	var sum64_4_hi$1 = utils.sum64_4_hi;
	var sum64_4_lo$1 = utils.sum64_4_lo;
	var sum64_5_hi$1 = utils.sum64_5_hi;
	var sum64_5_lo$1 = utils.sum64_5_lo;

	var BlockHash$2 = common.BlockHash;

	var sha512_K = [
	  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	];

	function SHA512() {
	  if (!(this instanceof SHA512))
	    return new SHA512();

	  BlockHash$2.call(this);
	  this.h = [
	    0x6a09e667, 0xf3bcc908,
	    0xbb67ae85, 0x84caa73b,
	    0x3c6ef372, 0xfe94f82b,
	    0xa54ff53a, 0x5f1d36f1,
	    0x510e527f, 0xade682d1,
	    0x9b05688c, 0x2b3e6c1f,
	    0x1f83d9ab, 0xfb41bd6b,
	    0x5be0cd19, 0x137e2179 ];
	  this.k = sha512_K;
	  this.W = new Array(160);
	}
	utils.inherits(SHA512, BlockHash$2);
	var _512 = SHA512;

	SHA512.blockSize = 1024;
	SHA512.outSize = 512;
	SHA512.hmacStrength = 192;
	SHA512.padLength = 128;

	SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
	  var W = this.W;

	  // 32 x 32bit words
	  for (var i = 0; i < 32; i++)
	    W[i] = msg[start + i];
	  for (; i < W.length; i += 2) {
	    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
	    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
	    var c1_hi = W[i - 14];  // i - 7
	    var c1_lo = W[i - 13];
	    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
	    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
	    var c3_hi = W[i - 32];  // i - 16
	    var c3_lo = W[i - 31];

	    W[i] = sum64_4_hi$1(
	      c0_hi, c0_lo,
	      c1_hi, c1_lo,
	      c2_hi, c2_lo,
	      c3_hi, c3_lo);
	    W[i + 1] = sum64_4_lo$1(
	      c0_hi, c0_lo,
	      c1_hi, c1_lo,
	      c2_hi, c2_lo,
	      c3_hi, c3_lo);
	  }
	};

	SHA512.prototype._update = function _update(msg, start) {
	  this._prepareBlock(msg, start);

	  var W = this.W;

	  var ah = this.h[0];
	  var al = this.h[1];
	  var bh = this.h[2];
	  var bl = this.h[3];
	  var ch = this.h[4];
	  var cl = this.h[5];
	  var dh = this.h[6];
	  var dl = this.h[7];
	  var eh = this.h[8];
	  var el = this.h[9];
	  var fh = this.h[10];
	  var fl = this.h[11];
	  var gh = this.h[12];
	  var gl = this.h[13];
	  var hh = this.h[14];
	  var hl = this.h[15];

	  minimalisticAssert(this.k.length === W.length);
	  for (var i = 0; i < W.length; i += 2) {
	    var c0_hi = hh;
	    var c0_lo = hl;
	    var c1_hi = s1_512_hi(eh, el);
	    var c1_lo = s1_512_lo(eh, el);
	    var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
	    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
	    var c3_hi = this.k[i];
	    var c3_lo = this.k[i + 1];
	    var c4_hi = W[i];
	    var c4_lo = W[i + 1];

	    var T1_hi = sum64_5_hi$1(
	      c0_hi, c0_lo,
	      c1_hi, c1_lo,
	      c2_hi, c2_lo,
	      c3_hi, c3_lo,
	      c4_hi, c4_lo);
	    var T1_lo = sum64_5_lo$1(
	      c0_hi, c0_lo,
	      c1_hi, c1_lo,
	      c2_hi, c2_lo,
	      c3_hi, c3_lo,
	      c4_hi, c4_lo);

	    c0_hi = s0_512_hi(ah, al);
	    c0_lo = s0_512_lo(ah, al);
	    c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
	    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

	    var T2_hi = sum64_hi$1(c0_hi, c0_lo, c1_hi, c1_lo);
	    var T2_lo = sum64_lo$1(c0_hi, c0_lo, c1_hi, c1_lo);

	    hh = gh;
	    hl = gl;

	    gh = fh;
	    gl = fl;

	    fh = eh;
	    fl = el;

	    eh = sum64_hi$1(dh, dl, T1_hi, T1_lo);
	    el = sum64_lo$1(dl, dl, T1_hi, T1_lo);

	    dh = ch;
	    dl = cl;

	    ch = bh;
	    cl = bl;

	    bh = ah;
	    bl = al;

	    ah = sum64_hi$1(T1_hi, T1_lo, T2_hi, T2_lo);
	    al = sum64_lo$1(T1_hi, T1_lo, T2_hi, T2_lo);
	  }

	  sum64$1(this.h, 0, ah, al);
	  sum64$1(this.h, 2, bh, bl);
	  sum64$1(this.h, 4, ch, cl);
	  sum64$1(this.h, 6, dh, dl);
	  sum64$1(this.h, 8, eh, el);
	  sum64$1(this.h, 10, fh, fl);
	  sum64$1(this.h, 12, gh, gl);
	  sum64$1(this.h, 14, hh, hl);
	};

	SHA512.prototype._digest = function digest(enc) {
	  if (enc === 'hex')
	    return utils.toHex32(this.h, 'big');
	  else
	    return utils.split32(this.h, 'big');
	};

	function ch64_hi(xh, xl, yh, yl, zh) {
	  var r = (xh & yh) ^ ((~xh) & zh);
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function ch64_lo(xh, xl, yh, yl, zh, zl) {
	  var r = (xl & yl) ^ ((~xl) & zl);
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function maj64_hi(xh, xl, yh, yl, zh) {
	  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function maj64_lo(xh, xl, yh, yl, zh, zl) {
	  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function s0_512_hi(xh, xl) {
	  var c0_hi = rotr64_hi$1(xh, xl, 28);
	  var c1_hi = rotr64_hi$1(xl, xh, 2);  // 34
	  var c2_hi = rotr64_hi$1(xl, xh, 7);  // 39

	  var r = c0_hi ^ c1_hi ^ c2_hi;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function s0_512_lo(xh, xl) {
	  var c0_lo = rotr64_lo$1(xh, xl, 28);
	  var c1_lo = rotr64_lo$1(xl, xh, 2);  // 34
	  var c2_lo = rotr64_lo$1(xl, xh, 7);  // 39

	  var r = c0_lo ^ c1_lo ^ c2_lo;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function s1_512_hi(xh, xl) {
	  var c0_hi = rotr64_hi$1(xh, xl, 14);
	  var c1_hi = rotr64_hi$1(xh, xl, 18);
	  var c2_hi = rotr64_hi$1(xl, xh, 9);  // 41

	  var r = c0_hi ^ c1_hi ^ c2_hi;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function s1_512_lo(xh, xl) {
	  var c0_lo = rotr64_lo$1(xh, xl, 14);
	  var c1_lo = rotr64_lo$1(xh, xl, 18);
	  var c2_lo = rotr64_lo$1(xl, xh, 9);  // 41

	  var r = c0_lo ^ c1_lo ^ c2_lo;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function g0_512_hi(xh, xl) {
	  var c0_hi = rotr64_hi$1(xh, xl, 1);
	  var c1_hi = rotr64_hi$1(xh, xl, 8);
	  var c2_hi = shr64_hi$1(xh, xl, 7);

	  var r = c0_hi ^ c1_hi ^ c2_hi;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function g0_512_lo(xh, xl) {
	  var c0_lo = rotr64_lo$1(xh, xl, 1);
	  var c1_lo = rotr64_lo$1(xh, xl, 8);
	  var c2_lo = shr64_lo$1(xh, xl, 7);

	  var r = c0_lo ^ c1_lo ^ c2_lo;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function g1_512_hi(xh, xl) {
	  var c0_hi = rotr64_hi$1(xh, xl, 19);
	  var c1_hi = rotr64_hi$1(xl, xh, 29);  // 61
	  var c2_hi = shr64_hi$1(xh, xl, 6);

	  var r = c0_hi ^ c1_hi ^ c2_hi;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function g1_512_lo(xh, xl) {
	  var c0_lo = rotr64_lo$1(xh, xl, 19);
	  var c1_lo = rotr64_lo$1(xl, xh, 29);  // 61
	  var c2_lo = shr64_lo$1(xh, xl, 6);

	  var r = c0_lo ^ c1_lo ^ c2_lo;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	'use strict';

	var sha1 = _1;
	var sha224 = _224;
	var sha256 = _256;
	var sha384 = _384;
	var sha512 = _512;

	var sha = {
		sha1: sha1,
		sha224: sha224,
		sha256: sha256,
		sha384: sha384,
		sha512: sha512
	};

	'use strict';




	var rotl32$1 = utils.rotl32;
	var sum32$2 = utils.sum32;
	var sum32_3$1 = utils.sum32_3;
	var sum32_4$2 = utils.sum32_4;
	var BlockHash$3 = common.BlockHash;

	function RIPEMD160() {
	  if (!(this instanceof RIPEMD160))
	    return new RIPEMD160();

	  BlockHash$3.call(this);

	  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
	  this.endian = 'little';
	}
	utils.inherits(RIPEMD160, BlockHash$3);
	var ripemd160 = RIPEMD160;

	RIPEMD160.blockSize = 512;
	RIPEMD160.outSize = 160;
	RIPEMD160.hmacStrength = 192;
	RIPEMD160.padLength = 64;

	RIPEMD160.prototype._update = function update(msg, start) {
	  var A = this.h[0];
	  var B = this.h[1];
	  var C = this.h[2];
	  var D = this.h[3];
	  var E = this.h[4];
	  var Ah = A;
	  var Bh = B;
	  var Ch = C;
	  var Dh = D;
	  var Eh = E;
	  for (var j = 0; j < 80; j++) {
	    var T = sum32$2(
	      rotl32$1(
	        sum32_4$2(A, f(j, B, C, D), msg[r[j] + start], K(j)),
	        s[j]),
	      E);
	    A = E;
	    E = D;
	    D = rotl32$1(C, 10);
	    C = B;
	    B = T;
	    T = sum32$2(
	      rotl32$1(
	        sum32_4$2(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
	        sh[j]),
	      Eh);
	    Ah = Eh;
	    Eh = Dh;
	    Dh = rotl32$1(Ch, 10);
	    Ch = Bh;
	    Bh = T;
	  }
	  T = sum32_3$1(this.h[1], C, Dh);
	  this.h[1] = sum32_3$1(this.h[2], D, Eh);
	  this.h[2] = sum32_3$1(this.h[3], E, Ah);
	  this.h[3] = sum32_3$1(this.h[4], A, Bh);
	  this.h[4] = sum32_3$1(this.h[0], B, Ch);
	  this.h[0] = T;
	};

	RIPEMD160.prototype._digest = function digest(enc) {
	  if (enc === 'hex')
	    return utils.toHex32(this.h, 'little');
	  else
	    return utils.split32(this.h, 'little');
	};

	function f(j, x, y, z) {
	  if (j <= 15)
	    return x ^ y ^ z;
	  else if (j <= 31)
	    return (x & y) | ((~x) & z);
	  else if (j <= 47)
	    return (x | (~y)) ^ z;
	  else if (j <= 63)
	    return (x & z) | (y & (~z));
	  else
	    return x ^ (y | (~z));
	}

	function K(j) {
	  if (j <= 15)
	    return 0x00000000;
	  else if (j <= 31)
	    return 0x5a827999;
	  else if (j <= 47)
	    return 0x6ed9eba1;
	  else if (j <= 63)
	    return 0x8f1bbcdc;
	  else
	    return 0xa953fd4e;
	}

	function Kh(j) {
	  if (j <= 15)
	    return 0x50a28be6;
	  else if (j <= 31)
	    return 0x5c4dd124;
	  else if (j <= 47)
	    return 0x6d703ef3;
	  else if (j <= 63)
	    return 0x7a6d76e9;
	  else
	    return 0x00000000;
	}

	var r = [
	  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
	  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
	  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
	  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
	  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
	];

	var rh = [
	  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
	  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
	  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
	  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
	  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
	];

	var s = [
	  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
	  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
	  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
	  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
	  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
	];

	var sh = [
	  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
	  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
	  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
	  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
	  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
	];

	var ripemd = {
		ripemd160: ripemd160
	};

	'use strict';




	function Hmac(hash, key, enc) {
	  if (!(this instanceof Hmac))
	    return new Hmac(hash, key, enc);
	  this.Hash = hash;
	  this.blockSize = hash.blockSize / 8;
	  this.outSize = hash.outSize / 8;
	  this.inner = null;
	  this.outer = null;

	  this._init(utils.toArray(key, enc));
	}
	var hmac = Hmac;

	Hmac.prototype._init = function init(key) {
	  // Shorten key, if needed
	  if (key.length > this.blockSize)
	    key = new this.Hash().update(key).digest();
	  minimalisticAssert(key.length <= this.blockSize);

	  // Add padding to key
	  for (var i = key.length; i < this.blockSize; i++)
	    key.push(0);

	  for (i = 0; i < key.length; i++)
	    key[i] ^= 0x36;
	  this.inner = new this.Hash().update(key);

	  // 0x36 ^ 0x5c = 0x6a
	  for (i = 0; i < key.length; i++)
	    key[i] ^= 0x6a;
	  this.outer = new this.Hash().update(key);
	};

	Hmac.prototype.update = function update(msg, enc) {
	  this.inner.update(msg, enc);
	  return this;
	};

	Hmac.prototype.digest = function digest(enc) {
	  this.outer.update(this.inner.digest());
	  return this.outer.digest(enc);
	};

	var hash_1 = createCommonjsModule(function (module, exports) {
	var hash = exports;

	hash.utils = utils;
	hash.common = common;
	hash.sha = sha;
	hash.ripemd = ripemd;
	hash.hmac = hmac;

	// Proxy hash functions to the main object
	hash.sha1 = hash.sha.sha1;
	hash.sha256 = hash.sha.sha256;
	hash.sha224 = hash.sha.sha224;
	hash.sha384 = hash.sha.sha384;
	hash.sha512 = hash.sha.sha512;
	hash.ripemd160 = hash.ripemd.ripemd160;
	});
	var hash_2 = hash_1.hmac;
	var hash_3 = hash_1.ripemd160;
	var hash_4 = hash_1.sha256;
	var hash_5 = hash_1.sha512;

	var _version$o = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "sha2/5.0.2";

	});

	var _version$p = unwrapExports(_version$o);
	var _version_1$c = _version$o.version;

	var browser = createCommonjsModule(function (module, exports) {
	"use strict";
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result["default"] = mod;
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var hash = __importStar(hash_1);



	var logger = new lib.Logger(_version$o.version);
	var SupportedAlgorithm;
	(function (SupportedAlgorithm) {
	    SupportedAlgorithm["sha256"] = "sha256";
	    SupportedAlgorithm["sha512"] = "sha512";
	})(SupportedAlgorithm = exports.SupportedAlgorithm || (exports.SupportedAlgorithm = {}));
	;
	function ripemd160(data) {
	    return "0x" + (hash.ripemd160().update(lib$1.arrayify(data)).digest("hex"));
	}
	exports.ripemd160 = ripemd160;
	function sha256(data) {
	    return "0x" + (hash.sha256().update(lib$1.arrayify(data)).digest("hex"));
	}
	exports.sha256 = sha256;
	function sha512(data) {
	    return "0x" + (hash.sha512().update(lib$1.arrayify(data)).digest("hex"));
	}
	exports.sha512 = sha512;
	function computeHmac(algorithm, key, data) {
	    if (!SupportedAlgorithm[algorithm]) {
	        logger.throwError("unsupported algorithm " + algorithm, lib.Logger.errors.UNSUPPORTED_OPERATION, {
	            operation: "hmac",
	            algorithm: algorithm
	        });
	    }
	    return "0x" + hash.hmac(hash[algorithm], lib$1.arrayify(key)).update(lib$1.arrayify(data)).digest("hex");
	}
	exports.computeHmac = computeHmac;

	});

	var browser$1 = unwrapExports(browser);
	var browser_1 = browser.SupportedAlgorithm;
	var browser_2 = browser.ripemd160;
	var browser_3 = browser.sha256;
	var browser_4 = browser.sha512;
	var browser_5 = browser.computeHmac;

	var browser$2 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });


	function pbkdf2(password, salt, iterations, keylen, hashAlgorithm) {
	    password = lib$1.arrayify(password);
	    salt = lib$1.arrayify(salt);
	    var hLen;
	    var l = 1;
	    var DK = new Uint8Array(keylen);
	    var block1 = new Uint8Array(salt.length + 4);
	    block1.set(salt);
	    //salt.copy(block1, 0, 0, salt.length)
	    var r;
	    var T;
	    for (var i = 1; i <= l; i++) {
	        //block1.writeUInt32BE(i, salt.length)
	        block1[salt.length] = (i >> 24) & 0xff;
	        block1[salt.length + 1] = (i >> 16) & 0xff;
	        block1[salt.length + 2] = (i >> 8) & 0xff;
	        block1[salt.length + 3] = i & 0xff;
	        //let U = createHmac(password).update(block1).digest();
	        var U = lib$1.arrayify(browser.computeHmac(hashAlgorithm, password, block1));
	        if (!hLen) {
	            hLen = U.length;
	            T = new Uint8Array(hLen);
	            l = Math.ceil(keylen / hLen);
	            r = keylen - (l - 1) * hLen;
	        }
	        //U.copy(T, 0, 0, hLen)
	        T.set(U);
	        for (var j = 1; j < iterations; j++) {
	            //U = createHmac(password).update(U).digest();
	            U = lib$1.arrayify(browser.computeHmac(hashAlgorithm, password, U));
	            for (var k = 0; k < hLen; k++)
	                T[k] ^= U[k];
	        }
	        var destPos = (i - 1) * hLen;
	        var len = (i === l ? r : hLen);
	        //T.copy(DK, destPos, 0, len)
	        DK.set(lib$1.arrayify(T).slice(0, len), destPos);
	    }
	    return lib$1.hexlify(DK);
	}
	exports.pbkdf2 = pbkdf2;

	});

	var browser$3 = unwrapExports(browser$2);
	var browser_1$1 = browser$2.pbkdf2;

	var version = "6.5.3";
	var _package = {
		version: version
	};

	var _package$1 = /*#__PURE__*/Object.freeze({
		version: version,
		'default': _package
	});

	var bn$1 = createCommonjsModule(function (module) {
	(function (module, exports) {
	  'use strict';

	  // Utils
	  function assert (val, msg) {
	    if (!val) throw new Error(msg || 'Assertion failed');
	  }

	  // Could use `inherits` module, but don't want to move from single file
	  // architecture yet.
	  function inherits (ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  }

	  // BN

	  function BN (number, base, endian) {
	    if (BN.isBN(number)) {
	      return number;
	    }

	    this.negative = 0;
	    this.words = null;
	    this.length = 0;

	    // Reduction context
	    this.red = null;

	    if (number !== null) {
	      if (base === 'le' || base === 'be') {
	        endian = base;
	        base = 10;
	      }

	      this._init(number || 0, base || 10, endian || 'be');
	    }
	  }
	  if (typeof module === 'object') {
	    module.exports = BN;
	  } else {
	    exports.BN = BN;
	  }

	  BN.BN = BN;
	  BN.wordSize = 26;

	  var Buffer;
	  try {
	    Buffer = require$$0.Buffer;
	  } catch (e) {
	  }

	  BN.isBN = function isBN (num) {
	    if (num instanceof BN) {
	      return true;
	    }

	    return num !== null && typeof num === 'object' &&
	      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
	  };

	  BN.max = function max (left, right) {
	    if (left.cmp(right) > 0) return left;
	    return right;
	  };

	  BN.min = function min (left, right) {
	    if (left.cmp(right) < 0) return left;
	    return right;
	  };

	  BN.prototype._init = function init (number, base, endian) {
	    if (typeof number === 'number') {
	      return this._initNumber(number, base, endian);
	    }

	    if (typeof number === 'object') {
	      return this._initArray(number, base, endian);
	    }

	    if (base === 'hex') {
	      base = 16;
	    }
	    assert(base === (base | 0) && base >= 2 && base <= 36);

	    number = number.toString().replace(/\s+/g, '');
	    var start = 0;
	    if (number[0] === '-') {
	      start++;
	    }

	    if (base === 16) {
	      this._parseHex(number, start);
	    } else {
	      this._parseBase(number, base, start);
	    }

	    if (number[0] === '-') {
	      this.negative = 1;
	    }

	    this.strip();

	    if (endian !== 'le') return;

	    this._initArray(this.toArray(), base, endian);
	  };

	  BN.prototype._initNumber = function _initNumber (number, base, endian) {
	    if (number < 0) {
	      this.negative = 1;
	      number = -number;
	    }
	    if (number < 0x4000000) {
	      this.words = [ number & 0x3ffffff ];
	      this.length = 1;
	    } else if (number < 0x10000000000000) {
	      this.words = [
	        number & 0x3ffffff,
	        (number / 0x4000000) & 0x3ffffff
	      ];
	      this.length = 2;
	    } else {
	      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
	      this.words = [
	        number & 0x3ffffff,
	        (number / 0x4000000) & 0x3ffffff,
	        1
	      ];
	      this.length = 3;
	    }

	    if (endian !== 'le') return;

	    // Reverse the bytes
	    this._initArray(this.toArray(), base, endian);
	  };

	  BN.prototype._initArray = function _initArray (number, base, endian) {
	    // Perhaps a Uint8Array
	    assert(typeof number.length === 'number');
	    if (number.length <= 0) {
	      this.words = [ 0 ];
	      this.length = 1;
	      return this;
	    }

	    this.length = Math.ceil(number.length / 3);
	    this.words = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	      this.words[i] = 0;
	    }

	    var j, w;
	    var off = 0;
	    if (endian === 'be') {
	      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
	        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
	        this.words[j] |= (w << off) & 0x3ffffff;
	        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
	        off += 24;
	        if (off >= 26) {
	          off -= 26;
	          j++;
	        }
	      }
	    } else if (endian === 'le') {
	      for (i = 0, j = 0; i < number.length; i += 3) {
	        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
	        this.words[j] |= (w << off) & 0x3ffffff;
	        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
	        off += 24;
	        if (off >= 26) {
	          off -= 26;
	          j++;
	        }
	      }
	    }
	    return this.strip();
	  };

	  function parseHex (str, start, end) {
	    var r = 0;
	    var len = Math.min(str.length, end);
	    for (var i = start; i < len; i++) {
	      var c = str.charCodeAt(i) - 48;

	      r <<= 4;

	      // 'a' - 'f'
	      if (c >= 49 && c <= 54) {
	        r |= c - 49 + 0xa;

	      // 'A' - 'F'
	      } else if (c >= 17 && c <= 22) {
	        r |= c - 17 + 0xa;

	      // '0' - '9'
	      } else {
	        r |= c & 0xf;
	      }
	    }
	    return r;
	  }

	  BN.prototype._parseHex = function _parseHex (number, start) {
	    // Create possibly bigger array to ensure that it fits the number
	    this.length = Math.ceil((number.length - start) / 6);
	    this.words = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	      this.words[i] = 0;
	    }

	    var j, w;
	    // Scan 24-bit chunks and add them to the number
	    var off = 0;
	    for (i = number.length - 6, j = 0; i >= start; i -= 6) {
	      w = parseHex(number, i, i + 6);
	      this.words[j] |= (w << off) & 0x3ffffff;
	      // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
	      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
	      off += 24;
	      if (off >= 26) {
	        off -= 26;
	        j++;
	      }
	    }
	    if (i + 6 !== start) {
	      w = parseHex(number, start, i + 6);
	      this.words[j] |= (w << off) & 0x3ffffff;
	      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
	    }
	    this.strip();
	  };

	  function parseBase (str, start, end, mul) {
	    var r = 0;
	    var len = Math.min(str.length, end);
	    for (var i = start; i < len; i++) {
	      var c = str.charCodeAt(i) - 48;

	      r *= mul;

	      // 'a'
	      if (c >= 49) {
	        r += c - 49 + 0xa;

	      // 'A'
	      } else if (c >= 17) {
	        r += c - 17 + 0xa;

	      // '0' - '9'
	      } else {
	        r += c;
	      }
	    }
	    return r;
	  }

	  BN.prototype._parseBase = function _parseBase (number, base, start) {
	    // Initialize as zero
	    this.words = [ 0 ];
	    this.length = 1;

	    // Find length of limb in base
	    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
	      limbLen++;
	    }
	    limbLen--;
	    limbPow = (limbPow / base) | 0;

	    var total = number.length - start;
	    var mod = total % limbLen;
	    var end = Math.min(total, total - mod) + start;

	    var word = 0;
	    for (var i = start; i < end; i += limbLen) {
	      word = parseBase(number, i, i + limbLen, base);

	      this.imuln(limbPow);
	      if (this.words[0] + word < 0x4000000) {
	        this.words[0] += word;
	      } else {
	        this._iaddn(word);
	      }
	    }

	    if (mod !== 0) {
	      var pow = 1;
	      word = parseBase(number, i, number.length, base);

	      for (i = 0; i < mod; i++) {
	        pow *= base;
	      }

	      this.imuln(pow);
	      if (this.words[0] + word < 0x4000000) {
	        this.words[0] += word;
	      } else {
	        this._iaddn(word);
	      }
	    }
	  };

	  BN.prototype.copy = function copy (dest) {
	    dest.words = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	      dest.words[i] = this.words[i];
	    }
	    dest.length = this.length;
	    dest.negative = this.negative;
	    dest.red = this.red;
	  };

	  BN.prototype.clone = function clone () {
	    var r = new BN(null);
	    this.copy(r);
	    return r;
	  };

	  BN.prototype._expand = function _expand (size) {
	    while (this.length < size) {
	      this.words[this.length++] = 0;
	    }
	    return this;
	  };

	  // Remove leading `0` from `this`
	  BN.prototype.strip = function strip () {
	    while (this.length > 1 && this.words[this.length - 1] === 0) {
	      this.length--;
	    }
	    return this._normSign();
	  };

	  BN.prototype._normSign = function _normSign () {
	    // -0 = 0
	    if (this.length === 1 && this.words[0] === 0) {
	      this.negative = 0;
	    }
	    return this;
	  };

	  BN.prototype.inspect = function inspect () {
	    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
	  };

	  /*

	  var zeros = [];
	  var groupSizes = [];
	  var groupBases = [];

	  var s = '';
	  var i = -1;
	  while (++i < BN.wordSize) {
	    zeros[i] = s;
	    s += '0';
	  }
	  groupSizes[0] = 0;
	  groupSizes[1] = 0;
	  groupBases[0] = 0;
	  groupBases[1] = 0;
	  var base = 2 - 1;
	  while (++base < 36 + 1) {
	    var groupSize = 0;
	    var groupBase = 1;
	    while (groupBase < (1 << BN.wordSize) / base) {
	      groupBase *= base;
	      groupSize += 1;
	    }
	    groupSizes[base] = groupSize;
	    groupBases[base] = groupBase;
	  }

	  */

	  var zeros = [
	    '',
	    '0',
	    '00',
	    '000',
	    '0000',
	    '00000',
	    '000000',
	    '0000000',
	    '00000000',
	    '000000000',
	    '0000000000',
	    '00000000000',
	    '000000000000',
	    '0000000000000',
	    '00000000000000',
	    '000000000000000',
	    '0000000000000000',
	    '00000000000000000',
	    '000000000000000000',
	    '0000000000000000000',
	    '00000000000000000000',
	    '000000000000000000000',
	    '0000000000000000000000',
	    '00000000000000000000000',
	    '000000000000000000000000',
	    '0000000000000000000000000'
	  ];

	  var groupSizes = [
	    0, 0,
	    25, 16, 12, 11, 10, 9, 8,
	    8, 7, 7, 7, 7, 6, 6,
	    6, 6, 6, 6, 6, 5, 5,
	    5, 5, 5, 5, 5, 5, 5,
	    5, 5, 5, 5, 5, 5, 5
	  ];

	  var groupBases = [
	    0, 0,
	    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
	    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
	    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
	    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
	    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
	  ];

	  BN.prototype.toString = function toString (base, padding) {
	    base = base || 10;
	    padding = padding | 0 || 1;

	    var out;
	    if (base === 16 || base === 'hex') {
	      out = '';
	      var off = 0;
	      var carry = 0;
	      for (var i = 0; i < this.length; i++) {
	        var w = this.words[i];
	        var word = (((w << off) | carry) & 0xffffff).toString(16);
	        carry = (w >>> (24 - off)) & 0xffffff;
	        if (carry !== 0 || i !== this.length - 1) {
	          out = zeros[6 - word.length] + word + out;
	        } else {
	          out = word + out;
	        }
	        off += 2;
	        if (off >= 26) {
	          off -= 26;
	          i--;
	        }
	      }
	      if (carry !== 0) {
	        out = carry.toString(16) + out;
	      }
	      while (out.length % padding !== 0) {
	        out = '0' + out;
	      }
	      if (this.negative !== 0) {
	        out = '-' + out;
	      }
	      return out;
	    }

	    if (base === (base | 0) && base >= 2 && base <= 36) {
	      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
	      var groupSize = groupSizes[base];
	      // var groupBase = Math.pow(base, groupSize);
	      var groupBase = groupBases[base];
	      out = '';
	      var c = this.clone();
	      c.negative = 0;
	      while (!c.isZero()) {
	        var r = c.modn(groupBase).toString(base);
	        c = c.idivn(groupBase);

	        if (!c.isZero()) {
	          out = zeros[groupSize - r.length] + r + out;
	        } else {
	          out = r + out;
	        }
	      }
	      if (this.isZero()) {
	        out = '0' + out;
	      }
	      while (out.length % padding !== 0) {
	        out = '0' + out;
	      }
	      if (this.negative !== 0) {
	        out = '-' + out;
	      }
	      return out;
	    }

	    assert(false, 'Base should be between 2 and 36');
	  };

	  BN.prototype.toNumber = function toNumber () {
	    var ret = this.words[0];
	    if (this.length === 2) {
	      ret += this.words[1] * 0x4000000;
	    } else if (this.length === 3 && this.words[2] === 0x01) {
	      // NOTE: at this stage it is known that the top bit is set
	      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
	    } else if (this.length > 2) {
	      assert(false, 'Number can only safely store up to 53 bits');
	    }
	    return (this.negative !== 0) ? -ret : ret;
	  };

	  BN.prototype.toJSON = function toJSON () {
	    return this.toString(16);
	  };

	  BN.prototype.toBuffer = function toBuffer (endian, length) {
	    assert(typeof Buffer !== 'undefined');
	    return this.toArrayLike(Buffer, endian, length);
	  };

	  BN.prototype.toArray = function toArray (endian, length) {
	    return this.toArrayLike(Array, endian, length);
	  };

	  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
	    var byteLength = this.byteLength();
	    var reqLength = length || Math.max(1, byteLength);
	    assert(byteLength <= reqLength, 'byte array longer than desired length');
	    assert(reqLength > 0, 'Requested array length <= 0');

	    this.strip();
	    var littleEndian = endian === 'le';
	    var res = new ArrayType(reqLength);

	    var b, i;
	    var q = this.clone();
	    if (!littleEndian) {
	      // Assume big-endian
	      for (i = 0; i < reqLength - byteLength; i++) {
	        res[i] = 0;
	      }

	      for (i = 0; !q.isZero(); i++) {
	        b = q.andln(0xff);
	        q.iushrn(8);

	        res[reqLength - i - 1] = b;
	      }
	    } else {
	      for (i = 0; !q.isZero(); i++) {
	        b = q.andln(0xff);
	        q.iushrn(8);

	        res[i] = b;
	      }

	      for (; i < reqLength; i++) {
	        res[i] = 0;
	      }
	    }

	    return res;
	  };

	  if (Math.clz32) {
	    BN.prototype._countBits = function _countBits (w) {
	      return 32 - Math.clz32(w);
	    };
	  } else {
	    BN.prototype._countBits = function _countBits (w) {
	      var t = w;
	      var r = 0;
	      if (t >= 0x1000) {
	        r += 13;
	        t >>>= 13;
	      }
	      if (t >= 0x40) {
	        r += 7;
	        t >>>= 7;
	      }
	      if (t >= 0x8) {
	        r += 4;
	        t >>>= 4;
	      }
	      if (t >= 0x02) {
	        r += 2;
	        t >>>= 2;
	      }
	      return r + t;
	    };
	  }

	  BN.prototype._zeroBits = function _zeroBits (w) {
	    // Short-cut
	    if (w === 0) return 26;

	    var t = w;
	    var r = 0;
	    if ((t & 0x1fff) === 0) {
	      r += 13;
	      t >>>= 13;
	    }
	    if ((t & 0x7f) === 0) {
	      r += 7;
	      t >>>= 7;
	    }
	    if ((t & 0xf) === 0) {
	      r += 4;
	      t >>>= 4;
	    }
	    if ((t & 0x3) === 0) {
	      r += 2;
	      t >>>= 2;
	    }
	    if ((t & 0x1) === 0) {
	      r++;
	    }
	    return r;
	  };

	  // Return number of used bits in a BN
	  BN.prototype.bitLength = function bitLength () {
	    var w = this.words[this.length - 1];
	    var hi = this._countBits(w);
	    return (this.length - 1) * 26 + hi;
	  };

	  function toBitArray (num) {
	    var w = new Array(num.bitLength());

	    for (var bit = 0; bit < w.length; bit++) {
	      var off = (bit / 26) | 0;
	      var wbit = bit % 26;

	      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
	    }

	    return w;
	  }

	  // Number of trailing zero bits
	  BN.prototype.zeroBits = function zeroBits () {
	    if (this.isZero()) return 0;

	    var r = 0;
	    for (var i = 0; i < this.length; i++) {
	      var b = this._zeroBits(this.words[i]);
	      r += b;
	      if (b !== 26) break;
	    }
	    return r;
	  };

	  BN.prototype.byteLength = function byteLength () {
	    return Math.ceil(this.bitLength() / 8);
	  };

	  BN.prototype.toTwos = function toTwos (width) {
	    if (this.negative !== 0) {
	      return this.abs().inotn(width).iaddn(1);
	    }
	    return this.clone();
	  };

	  BN.prototype.fromTwos = function fromTwos (width) {
	    if (this.testn(width - 1)) {
	      return this.notn(width).iaddn(1).ineg();
	    }
	    return this.clone();
	  };

	  BN.prototype.isNeg = function isNeg () {
	    return this.negative !== 0;
	  };

	  // Return negative clone of `this`
	  BN.prototype.neg = function neg () {
	    return this.clone().ineg();
	  };

	  BN.prototype.ineg = function ineg () {
	    if (!this.isZero()) {
	      this.negative ^= 1;
	    }

	    return this;
	  };

	  // Or `num` with `this` in-place
	  BN.prototype.iuor = function iuor (num) {
	    while (this.length < num.length) {
	      this.words[this.length++] = 0;
	    }

	    for (var i = 0; i < num.length; i++) {
	      this.words[i] = this.words[i] | num.words[i];
	    }

	    return this.strip();
	  };

	  BN.prototype.ior = function ior (num) {
	    assert((this.negative | num.negative) === 0);
	    return this.iuor(num);
	  };

	  // Or `num` with `this`
	  BN.prototype.or = function or (num) {
	    if (this.length > num.length) return this.clone().ior(num);
	    return num.clone().ior(this);
	  };

	  BN.prototype.uor = function uor (num) {
	    if (this.length > num.length) return this.clone().iuor(num);
	    return num.clone().iuor(this);
	  };

	  // And `num` with `this` in-place
	  BN.prototype.iuand = function iuand (num) {
	    // b = min-length(num, this)
	    var b;
	    if (this.length > num.length) {
	      b = num;
	    } else {
	      b = this;
	    }

	    for (var i = 0; i < b.length; i++) {
	      this.words[i] = this.words[i] & num.words[i];
	    }

	    this.length = b.length;

	    return this.strip();
	  };

	  BN.prototype.iand = function iand (num) {
	    assert((this.negative | num.negative) === 0);
	    return this.iuand(num);
	  };

	  // And `num` with `this`
	  BN.prototype.and = function and (num) {
	    if (this.length > num.length) return this.clone().iand(num);
	    return num.clone().iand(this);
	  };

	  BN.prototype.uand = function uand (num) {
	    if (this.length > num.length) return this.clone().iuand(num);
	    return num.clone().iuand(this);
	  };

	  // Xor `num` with `this` in-place
	  BN.prototype.iuxor = function iuxor (num) {
	    // a.length > b.length
	    var a;
	    var b;
	    if (this.length > num.length) {
	      a = this;
	      b = num;
	    } else {
	      a = num;
	      b = this;
	    }

	    for (var i = 0; i < b.length; i++) {
	      this.words[i] = a.words[i] ^ b.words[i];
	    }

	    if (this !== a) {
	      for (; i < a.length; i++) {
	        this.words[i] = a.words[i];
	      }
	    }

	    this.length = a.length;

	    return this.strip();
	  };

	  BN.prototype.ixor = function ixor (num) {
	    assert((this.negative | num.negative) === 0);
	    return this.iuxor(num);
	  };

	  // Xor `num` with `this`
	  BN.prototype.xor = function xor (num) {
	    if (this.length > num.length) return this.clone().ixor(num);
	    return num.clone().ixor(this);
	  };

	  BN.prototype.uxor = function uxor (num) {
	    if (this.length > num.length) return this.clone().iuxor(num);
	    return num.clone().iuxor(this);
	  };

	  // Not ``this`` with ``width`` bitwidth
	  BN.prototype.inotn = function inotn (width) {
	    assert(typeof width === 'number' && width >= 0);

	    var bytesNeeded = Math.ceil(width / 26) | 0;
	    var bitsLeft = width % 26;

	    // Extend the buffer with leading zeroes
	    this._expand(bytesNeeded);

	    if (bitsLeft > 0) {
	      bytesNeeded--;
	    }

	    // Handle complete words
	    for (var i = 0; i < bytesNeeded; i++) {
	      this.words[i] = ~this.words[i] & 0x3ffffff;
	    }

	    // Handle the residue
	    if (bitsLeft > 0) {
	      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
	    }

	    // And remove leading zeroes
	    return this.strip();
	  };

	  BN.prototype.notn = function notn (width) {
	    return this.clone().inotn(width);
	  };

	  // Set `bit` of `this`
	  BN.prototype.setn = function setn (bit, val) {
	    assert(typeof bit === 'number' && bit >= 0);

	    var off = (bit / 26) | 0;
	    var wbit = bit % 26;

	    this._expand(off + 1);

	    if (val) {
	      this.words[off] = this.words[off] | (1 << wbit);
	    } else {
	      this.words[off] = this.words[off] & ~(1 << wbit);
	    }

	    return this.strip();
	  };

	  // Add `num` to `this` in-place
	  BN.prototype.iadd = function iadd (num) {
	    var r;

	    // negative + positive
	    if (this.negative !== 0 && num.negative === 0) {
	      this.negative = 0;
	      r = this.isub(num);
	      this.negative ^= 1;
	      return this._normSign();

	    // positive + negative
	    } else if (this.negative === 0 && num.negative !== 0) {
	      num.negative = 0;
	      r = this.isub(num);
	      num.negative = 1;
	      return r._normSign();
	    }

	    // a.length > b.length
	    var a, b;
	    if (this.length > num.length) {
	      a = this;
	      b = num;
	    } else {
	      a = num;
	      b = this;
	    }

	    var carry = 0;
	    for (var i = 0; i < b.length; i++) {
	      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
	      this.words[i] = r & 0x3ffffff;
	      carry = r >>> 26;
	    }
	    for (; carry !== 0 && i < a.length; i++) {
	      r = (a.words[i] | 0) + carry;
	      this.words[i] = r & 0x3ffffff;
	      carry = r >>> 26;
	    }

	    this.length = a.length;
	    if (carry !== 0) {
	      this.words[this.length] = carry;
	      this.length++;
	    // Copy the rest of the words
	    } else if (a !== this) {
	      for (; i < a.length; i++) {
	        this.words[i] = a.words[i];
	      }
	    }

	    return this;
	  };

	  // Add `num` to `this`
	  BN.prototype.add = function add (num) {
	    var res;
	    if (num.negative !== 0 && this.negative === 0) {
	      num.negative = 0;
	      res = this.sub(num);
	      num.negative ^= 1;
	      return res;
	    } else if (num.negative === 0 && this.negative !== 0) {
	      this.negative = 0;
	      res = num.sub(this);
	      this.negative = 1;
	      return res;
	    }

	    if (this.length > num.length) return this.clone().iadd(num);

	    return num.clone().iadd(this);
	  };

	  // Subtract `num` from `this` in-place
	  BN.prototype.isub = function isub (num) {
	    // this - (-num) = this + num
	    if (num.negative !== 0) {
	      num.negative = 0;
	      var r = this.iadd(num);
	      num.negative = 1;
	      return r._normSign();

	    // -this - num = -(this + num)
	    } else if (this.negative !== 0) {
	      this.negative = 0;
	      this.iadd(num);
	      this.negative = 1;
	      return this._normSign();
	    }

	    // At this point both numbers are positive
	    var cmp = this.cmp(num);

	    // Optimization - zeroify
	    if (cmp === 0) {
	      this.negative = 0;
	      this.length = 1;
	      this.words[0] = 0;
	      return this;
	    }

	    // a > b
	    var a, b;
	    if (cmp > 0) {
	      a = this;
	      b = num;
	    } else {
	      a = num;
	      b = this;
	    }

	    var carry = 0;
	    for (var i = 0; i < b.length; i++) {
	      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
	      carry = r >> 26;
	      this.words[i] = r & 0x3ffffff;
	    }
	    for (; carry !== 0 && i < a.length; i++) {
	      r = (a.words[i] | 0) + carry;
	      carry = r >> 26;
	      this.words[i] = r & 0x3ffffff;
	    }

	    // Copy rest of the words
	    if (carry === 0 && i < a.length && a !== this) {
	      for (; i < a.length; i++) {
	        this.words[i] = a.words[i];
	      }
	    }

	    this.length = Math.max(this.length, i);

	    if (a !== this) {
	      this.negative = 1;
	    }

	    return this.strip();
	  };

	  // Subtract `num` from `this`
	  BN.prototype.sub = function sub (num) {
	    return this.clone().isub(num);
	  };

	  function smallMulTo (self, num, out) {
	    out.negative = num.negative ^ self.negative;
	    var len = (self.length + num.length) | 0;
	    out.length = len;
	    len = (len - 1) | 0;

	    // Peel one iteration (compiler can't do it, because of code complexity)
	    var a = self.words[0] | 0;
	    var b = num.words[0] | 0;
	    var r = a * b;

	    var lo = r & 0x3ffffff;
	    var carry = (r / 0x4000000) | 0;
	    out.words[0] = lo;

	    for (var k = 1; k < len; k++) {
	      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
	      // note that ncarry could be >= 0x3ffffff
	      var ncarry = carry >>> 26;
	      var rword = carry & 0x3ffffff;
	      var maxJ = Math.min(k, num.length - 1);
	      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
	        var i = (k - j) | 0;
	        a = self.words[i] | 0;
	        b = num.words[j] | 0;
	        r = a * b + rword;
	        ncarry += (r / 0x4000000) | 0;
	        rword = r & 0x3ffffff;
	      }
	      out.words[k] = rword | 0;
	      carry = ncarry | 0;
	    }
	    if (carry !== 0) {
	      out.words[k] = carry | 0;
	    } else {
	      out.length--;
	    }

	    return out.strip();
	  }

	  // TODO(indutny): it may be reasonable to omit it for users who don't need
	  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
	  // multiplication (like elliptic secp256k1).
	  var comb10MulTo = function comb10MulTo (self, num, out) {
	    var a = self.words;
	    var b = num.words;
	    var o = out.words;
	    var c = 0;
	    var lo;
	    var mid;
	    var hi;
	    var a0 = a[0] | 0;
	    var al0 = a0 & 0x1fff;
	    var ah0 = a0 >>> 13;
	    var a1 = a[1] | 0;
	    var al1 = a1 & 0x1fff;
	    var ah1 = a1 >>> 13;
	    var a2 = a[2] | 0;
	    var al2 = a2 & 0x1fff;
	    var ah2 = a2 >>> 13;
	    var a3 = a[3] | 0;
	    var al3 = a3 & 0x1fff;
	    var ah3 = a3 >>> 13;
	    var a4 = a[4] | 0;
	    var al4 = a4 & 0x1fff;
	    var ah4 = a4 >>> 13;
	    var a5 = a[5] | 0;
	    var al5 = a5 & 0x1fff;
	    var ah5 = a5 >>> 13;
	    var a6 = a[6] | 0;
	    var al6 = a6 & 0x1fff;
	    var ah6 = a6 >>> 13;
	    var a7 = a[7] | 0;
	    var al7 = a7 & 0x1fff;
	    var ah7 = a7 >>> 13;
	    var a8 = a[8] | 0;
	    var al8 = a8 & 0x1fff;
	    var ah8 = a8 >>> 13;
	    var a9 = a[9] | 0;
	    var al9 = a9 & 0x1fff;
	    var ah9 = a9 >>> 13;
	    var b0 = b[0] | 0;
	    var bl0 = b0 & 0x1fff;
	    var bh0 = b0 >>> 13;
	    var b1 = b[1] | 0;
	    var bl1 = b1 & 0x1fff;
	    var bh1 = b1 >>> 13;
	    var b2 = b[2] | 0;
	    var bl2 = b2 & 0x1fff;
	    var bh2 = b2 >>> 13;
	    var b3 = b[3] | 0;
	    var bl3 = b3 & 0x1fff;
	    var bh3 = b3 >>> 13;
	    var b4 = b[4] | 0;
	    var bl4 = b4 & 0x1fff;
	    var bh4 = b4 >>> 13;
	    var b5 = b[5] | 0;
	    var bl5 = b5 & 0x1fff;
	    var bh5 = b5 >>> 13;
	    var b6 = b[6] | 0;
	    var bl6 = b6 & 0x1fff;
	    var bh6 = b6 >>> 13;
	    var b7 = b[7] | 0;
	    var bl7 = b7 & 0x1fff;
	    var bh7 = b7 >>> 13;
	    var b8 = b[8] | 0;
	    var bl8 = b8 & 0x1fff;
	    var bh8 = b8 >>> 13;
	    var b9 = b[9] | 0;
	    var bl9 = b9 & 0x1fff;
	    var bh9 = b9 >>> 13;

	    out.negative = self.negative ^ num.negative;
	    out.length = 19;
	    /* k = 0 */
	    lo = Math.imul(al0, bl0);
	    mid = Math.imul(al0, bh0);
	    mid = (mid + Math.imul(ah0, bl0)) | 0;
	    hi = Math.imul(ah0, bh0);
	    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
	    w0 &= 0x3ffffff;
	    /* k = 1 */
	    lo = Math.imul(al1, bl0);
	    mid = Math.imul(al1, bh0);
	    mid = (mid + Math.imul(ah1, bl0)) | 0;
	    hi = Math.imul(ah1, bh0);
	    lo = (lo + Math.imul(al0, bl1)) | 0;
	    mid = (mid + Math.imul(al0, bh1)) | 0;
	    mid = (mid + Math.imul(ah0, bl1)) | 0;
	    hi = (hi + Math.imul(ah0, bh1)) | 0;
	    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
	    w1 &= 0x3ffffff;
	    /* k = 2 */
	    lo = Math.imul(al2, bl0);
	    mid = Math.imul(al2, bh0);
	    mid = (mid + Math.imul(ah2, bl0)) | 0;
	    hi = Math.imul(ah2, bh0);
	    lo = (lo + Math.imul(al1, bl1)) | 0;
	    mid = (mid + Math.imul(al1, bh1)) | 0;
	    mid = (mid + Math.imul(ah1, bl1)) | 0;
	    hi = (hi + Math.imul(ah1, bh1)) | 0;
	    lo = (lo + Math.imul(al0, bl2)) | 0;
	    mid = (mid + Math.imul(al0, bh2)) | 0;
	    mid = (mid + Math.imul(ah0, bl2)) | 0;
	    hi = (hi + Math.imul(ah0, bh2)) | 0;
	    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
	    w2 &= 0x3ffffff;
	    /* k = 3 */
	    lo = Math.imul(al3, bl0);
	    mid = Math.imul(al3, bh0);
	    mid = (mid + Math.imul(ah3, bl0)) | 0;
	    hi = Math.imul(ah3, bh0);
	    lo = (lo + Math.imul(al2, bl1)) | 0;
	    mid = (mid + Math.imul(al2, bh1)) | 0;
	    mid = (mid + Math.imul(ah2, bl1)) | 0;
	    hi = (hi + Math.imul(ah2, bh1)) | 0;
	    lo = (lo + Math.imul(al1, bl2)) | 0;
	    mid = (mid + Math.imul(al1, bh2)) | 0;
	    mid = (mid + Math.imul(ah1, bl2)) | 0;
	    hi = (hi + Math.imul(ah1, bh2)) | 0;
	    lo = (lo + Math.imul(al0, bl3)) | 0;
	    mid = (mid + Math.imul(al0, bh3)) | 0;
	    mid = (mid + Math.imul(ah0, bl3)) | 0;
	    hi = (hi + Math.imul(ah0, bh3)) | 0;
	    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
	    w3 &= 0x3ffffff;
	    /* k = 4 */
	    lo = Math.imul(al4, bl0);
	    mid = Math.imul(al4, bh0);
	    mid = (mid + Math.imul(ah4, bl0)) | 0;
	    hi = Math.imul(ah4, bh0);
	    lo = (lo + Math.imul(al3, bl1)) | 0;
	    mid = (mid + Math.imul(al3, bh1)) | 0;
	    mid = (mid + Math.imul(ah3, bl1)) | 0;
	    hi = (hi + Math.imul(ah3, bh1)) | 0;
	    lo = (lo + Math.imul(al2, bl2)) | 0;
	    mid = (mid + Math.imul(al2, bh2)) | 0;
	    mid = (mid + Math.imul(ah2, bl2)) | 0;
	    hi = (hi + Math.imul(ah2, bh2)) | 0;
	    lo = (lo + Math.imul(al1, bl3)) | 0;
	    mid = (mid + Math.imul(al1, bh3)) | 0;
	    mid = (mid + Math.imul(ah1, bl3)) | 0;
	    hi = (hi + Math.imul(ah1, bh3)) | 0;
	    lo = (lo + Math.imul(al0, bl4)) | 0;
	    mid = (mid + Math.imul(al0, bh4)) | 0;
	    mid = (mid + Math.imul(ah0, bl4)) | 0;
	    hi = (hi + Math.imul(ah0, bh4)) | 0;
	    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
	    w4 &= 0x3ffffff;
	    /* k = 5 */
	    lo = Math.imul(al5, bl0);
	    mid = Math.imul(al5, bh0);
	    mid = (mid + Math.imul(ah5, bl0)) | 0;
	    hi = Math.imul(ah5, bh0);
	    lo = (lo + Math.imul(al4, bl1)) | 0;
	    mid = (mid + Math.imul(al4, bh1)) | 0;
	    mid = (mid + Math.imul(ah4, bl1)) | 0;
	    hi = (hi + Math.imul(ah4, bh1)) | 0;
	    lo = (lo + Math.imul(al3, bl2)) | 0;
	    mid = (mid + Math.imul(al3, bh2)) | 0;
	    mid = (mid + Math.imul(ah3, bl2)) | 0;
	    hi = (hi + Math.imul(ah3, bh2)) | 0;
	    lo = (lo + Math.imul(al2, bl3)) | 0;
	    mid = (mid + Math.imul(al2, bh3)) | 0;
	    mid = (mid + Math.imul(ah2, bl3)) | 0;
	    hi = (hi + Math.imul(ah2, bh3)) | 0;
	    lo = (lo + Math.imul(al1, bl4)) | 0;
	    mid = (mid + Math.imul(al1, bh4)) | 0;
	    mid = (mid + Math.imul(ah1, bl4)) | 0;
	    hi = (hi + Math.imul(ah1, bh4)) | 0;
	    lo = (lo + Math.imul(al0, bl5)) | 0;
	    mid = (mid + Math.imul(al0, bh5)) | 0;
	    mid = (mid + Math.imul(ah0, bl5)) | 0;
	    hi = (hi + Math.imul(ah0, bh5)) | 0;
	    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
	    w5 &= 0x3ffffff;
	    /* k = 6 */
	    lo = Math.imul(al6, bl0);
	    mid = Math.imul(al6, bh0);
	    mid = (mid + Math.imul(ah6, bl0)) | 0;
	    hi = Math.imul(ah6, bh0);
	    lo = (lo + Math.imul(al5, bl1)) | 0;
	    mid = (mid + Math.imul(al5, bh1)) | 0;
	    mid = (mid + Math.imul(ah5, bl1)) | 0;
	    hi = (hi + Math.imul(ah5, bh1)) | 0;
	    lo = (lo + Math.imul(al4, bl2)) | 0;
	    mid = (mid + Math.imul(al4, bh2)) | 0;
	    mid = (mid + Math.imul(ah4, bl2)) | 0;
	    hi = (hi + Math.imul(ah4, bh2)) | 0;
	    lo = (lo + Math.imul(al3, bl3)) | 0;
	    mid = (mid + Math.imul(al3, bh3)) | 0;
	    mid = (mid + Math.imul(ah3, bl3)) | 0;
	    hi = (hi + Math.imul(ah3, bh3)) | 0;
	    lo = (lo + Math.imul(al2, bl4)) | 0;
	    mid = (mid + Math.imul(al2, bh4)) | 0;
	    mid = (mid + Math.imul(ah2, bl4)) | 0;
	    hi = (hi + Math.imul(ah2, bh4)) | 0;
	    lo = (lo + Math.imul(al1, bl5)) | 0;
	    mid = (mid + Math.imul(al1, bh5)) | 0;
	    mid = (mid + Math.imul(ah1, bl5)) | 0;
	    hi = (hi + Math.imul(ah1, bh5)) | 0;
	    lo = (lo + Math.imul(al0, bl6)) | 0;
	    mid = (mid + Math.imul(al0, bh6)) | 0;
	    mid = (mid + Math.imul(ah0, bl6)) | 0;
	    hi = (hi + Math.imul(ah0, bh6)) | 0;
	    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
	    w6 &= 0x3ffffff;
	    /* k = 7 */
	    lo = Math.imul(al7, bl0);
	    mid = Math.imul(al7, bh0);
	    mid = (mid + Math.imul(ah7, bl0)) | 0;
	    hi = Math.imul(ah7, bh0);
	    lo = (lo + Math.imul(al6, bl1)) | 0;
	    mid = (mid + Math.imul(al6, bh1)) | 0;
	    mid = (mid + Math.imul(ah6, bl1)) | 0;
	    hi = (hi + Math.imul(ah6, bh1)) | 0;
	    lo = (lo + Math.imul(al5, bl2)) | 0;
	    mid = (mid + Math.imul(al5, bh2)) | 0;
	    mid = (mid + Math.imul(ah5, bl2)) | 0;
	    hi = (hi + Math.imul(ah5, bh2)) | 0;
	    lo = (lo + Math.imul(al4, bl3)) | 0;
	    mid = (mid + Math.imul(al4, bh3)) | 0;
	    mid = (mid + Math.imul(ah4, bl3)) | 0;
	    hi = (hi + Math.imul(ah4, bh3)) | 0;
	    lo = (lo + Math.imul(al3, bl4)) | 0;
	    mid = (mid + Math.imul(al3, bh4)) | 0;
	    mid = (mid + Math.imul(ah3, bl4)) | 0;
	    hi = (hi + Math.imul(ah3, bh4)) | 0;
	    lo = (lo + Math.imul(al2, bl5)) | 0;
	    mid = (mid + Math.imul(al2, bh5)) | 0;
	    mid = (mid + Math.imul(ah2, bl5)) | 0;
	    hi = (hi + Math.imul(ah2, bh5)) | 0;
	    lo = (lo + Math.imul(al1, bl6)) | 0;
	    mid = (mid + Math.imul(al1, bh6)) | 0;
	    mid = (mid + Math.imul(ah1, bl6)) | 0;
	    hi = (hi + Math.imul(ah1, bh6)) | 0;
	    lo = (lo + Math.imul(al0, bl7)) | 0;
	    mid = (mid + Math.imul(al0, bh7)) | 0;
	    mid = (mid + Math.imul(ah0, bl7)) | 0;
	    hi = (hi + Math.imul(ah0, bh7)) | 0;
	    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
	    w7 &= 0x3ffffff;
	    /* k = 8 */
	    lo = Math.imul(al8, bl0);
	    mid = Math.imul(al8, bh0);
	    mid = (mid + Math.imul(ah8, bl0)) | 0;
	    hi = Math.imul(ah8, bh0);
	    lo = (lo + Math.imul(al7, bl1)) | 0;
	    mid = (mid + Math.imul(al7, bh1)) | 0;
	    mid = (mid + Math.imul(ah7, bl1)) | 0;
	    hi = (hi + Math.imul(ah7, bh1)) | 0;
	    lo = (lo + Math.imul(al6, bl2)) | 0;
	    mid = (mid + Math.imul(al6, bh2)) | 0;
	    mid = (mid + Math.imul(ah6, bl2)) | 0;
	    hi = (hi + Math.imul(ah6, bh2)) | 0;
	    lo = (lo + Math.imul(al5, bl3)) | 0;
	    mid = (mid + Math.imul(al5, bh3)) | 0;
	    mid = (mid + Math.imul(ah5, bl3)) | 0;
	    hi = (hi + Math.imul(ah5, bh3)) | 0;
	    lo = (lo + Math.imul(al4, bl4)) | 0;
	    mid = (mid + Math.imul(al4, bh4)) | 0;
	    mid = (mid + Math.imul(ah4, bl4)) | 0;
	    hi = (hi + Math.imul(ah4, bh4)) | 0;
	    lo = (lo + Math.imul(al3, bl5)) | 0;
	    mid = (mid + Math.imul(al3, bh5)) | 0;
	    mid = (mid + Math.imul(ah3, bl5)) | 0;
	    hi = (hi + Math.imul(ah3, bh5)) | 0;
	    lo = (lo + Math.imul(al2, bl6)) | 0;
	    mid = (mid + Math.imul(al2, bh6)) | 0;
	    mid = (mid + Math.imul(ah2, bl6)) | 0;
	    hi = (hi + Math.imul(ah2, bh6)) | 0;
	    lo = (lo + Math.imul(al1, bl7)) | 0;
	    mid = (mid + Math.imul(al1, bh7)) | 0;
	    mid = (mid + Math.imul(ah1, bl7)) | 0;
	    hi = (hi + Math.imul(ah1, bh7)) | 0;
	    lo = (lo + Math.imul(al0, bl8)) | 0;
	    mid = (mid + Math.imul(al0, bh8)) | 0;
	    mid = (mid + Math.imul(ah0, bl8)) | 0;
	    hi = (hi + Math.imul(ah0, bh8)) | 0;
	    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
	    w8 &= 0x3ffffff;
	    /* k = 9 */
	    lo = Math.imul(al9, bl0);
	    mid = Math.imul(al9, bh0);
	    mid = (mid + Math.imul(ah9, bl0)) | 0;
	    hi = Math.imul(ah9, bh0);
	    lo = (lo + Math.imul(al8, bl1)) | 0;
	    mid = (mid + Math.imul(al8, bh1)) | 0;
	    mid = (mid + Math.imul(ah8, bl1)) | 0;
	    hi = (hi + Math.imul(ah8, bh1)) | 0;
	    lo = (lo + Math.imul(al7, bl2)) | 0;
	    mid = (mid + Math.imul(al7, bh2)) | 0;
	    mid = (mid + Math.imul(ah7, bl2)) | 0;
	    hi = (hi + Math.imul(ah7, bh2)) | 0;
	    lo = (lo + Math.imul(al6, bl3)) | 0;
	    mid = (mid + Math.imul(al6, bh3)) | 0;
	    mid = (mid + Math.imul(ah6, bl3)) | 0;
	    hi = (hi + Math.imul(ah6, bh3)) | 0;
	    lo = (lo + Math.imul(al5, bl4)) | 0;
	    mid = (mid + Math.imul(al5, bh4)) | 0;
	    mid = (mid + Math.imul(ah5, bl4)) | 0;
	    hi = (hi + Math.imul(ah5, bh4)) | 0;
	    lo = (lo + Math.imul(al4, bl5)) | 0;
	    mid = (mid + Math.imul(al4, bh5)) | 0;
	    mid = (mid + Math.imul(ah4, bl5)) | 0;
	    hi = (hi + Math.imul(ah4, bh5)) | 0;
	    lo = (lo + Math.imul(al3, bl6)) | 0;
	    mid = (mid + Math.imul(al3, bh6)) | 0;
	    mid = (mid + Math.imul(ah3, bl6)) | 0;
	    hi = (hi + Math.imul(ah3, bh6)) | 0;
	    lo = (lo + Math.imul(al2, bl7)) | 0;
	    mid = (mid + Math.imul(al2, bh7)) | 0;
	    mid = (mid + Math.imul(ah2, bl7)) | 0;
	    hi = (hi + Math.imul(ah2, bh7)) | 0;
	    lo = (lo + Math.imul(al1, bl8)) | 0;
	    mid = (mid + Math.imul(al1, bh8)) | 0;
	    mid = (mid + Math.imul(ah1, bl8)) | 0;
	    hi = (hi + Math.imul(ah1, bh8)) | 0;
	    lo = (lo + Math.imul(al0, bl9)) | 0;
	    mid = (mid + Math.imul(al0, bh9)) | 0;
	    mid = (mid + Math.imul(ah0, bl9)) | 0;
	    hi = (hi + Math.imul(ah0, bh9)) | 0;
	    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
	    w9 &= 0x3ffffff;
	    /* k = 10 */
	    lo = Math.imul(al9, bl1);
	    mid = Math.imul(al9, bh1);
	    mid = (mid + Math.imul(ah9, bl1)) | 0;
	    hi = Math.imul(ah9, bh1);
	    lo = (lo + Math.imul(al8, bl2)) | 0;
	    mid = (mid + Math.imul(al8, bh2)) | 0;
	    mid = (mid + Math.imul(ah8, bl2)) | 0;
	    hi = (hi + Math.imul(ah8, bh2)) | 0;
	    lo = (lo + Math.imul(al7, bl3)) | 0;
	    mid = (mid + Math.imul(al7, bh3)) | 0;
	    mid = (mid + Math.imul(ah7, bl3)) | 0;
	    hi = (hi + Math.imul(ah7, bh3)) | 0;
	    lo = (lo + Math.imul(al6, bl4)) | 0;
	    mid = (mid + Math.imul(al6, bh4)) | 0;
	    mid = (mid + Math.imul(ah6, bl4)) | 0;
	    hi = (hi + Math.imul(ah6, bh4)) | 0;
	    lo = (lo + Math.imul(al5, bl5)) | 0;
	    mid = (mid + Math.imul(al5, bh5)) | 0;
	    mid = (mid + Math.imul(ah5, bl5)) | 0;
	    hi = (hi + Math.imul(ah5, bh5)) | 0;
	    lo = (lo + Math.imul(al4, bl6)) | 0;
	    mid = (mid + Math.imul(al4, bh6)) | 0;
	    mid = (mid + Math.imul(ah4, bl6)) | 0;
	    hi = (hi + Math.imul(ah4, bh6)) | 0;
	    lo = (lo + Math.imul(al3, bl7)) | 0;
	    mid = (mid + Math.imul(al3, bh7)) | 0;
	    mid = (mid + Math.imul(ah3, bl7)) | 0;
	    hi = (hi + Math.imul(ah3, bh7)) | 0;
	    lo = (lo + Math.imul(al2, bl8)) | 0;
	    mid = (mid + Math.imul(al2, bh8)) | 0;
	    mid = (mid + Math.imul(ah2, bl8)) | 0;
	    hi = (hi + Math.imul(ah2, bh8)) | 0;
	    lo = (lo + Math.imul(al1, bl9)) | 0;
	    mid = (mid + Math.imul(al1, bh9)) | 0;
	    mid = (mid + Math.imul(ah1, bl9)) | 0;
	    hi = (hi + Math.imul(ah1, bh9)) | 0;
	    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
	    w10 &= 0x3ffffff;
	    /* k = 11 */
	    lo = Math.imul(al9, bl2);
	    mid = Math.imul(al9, bh2);
	    mid = (mid + Math.imul(ah9, bl2)) | 0;
	    hi = Math.imul(ah9, bh2);
	    lo = (lo + Math.imul(al8, bl3)) | 0;
	    mid = (mid + Math.imul(al8, bh3)) | 0;
	    mid = (mid + Math.imul(ah8, bl3)) | 0;
	    hi = (hi + Math.imul(ah8, bh3)) | 0;
	    lo = (lo + Math.imul(al7, bl4)) | 0;
	    mid = (mid + Math.imul(al7, bh4)) | 0;
	    mid = (mid + Math.imul(ah7, bl4)) | 0;
	    hi = (hi + Math.imul(ah7, bh4)) | 0;
	    lo = (lo + Math.imul(al6, bl5)) | 0;
	    mid = (mid + Math.imul(al6, bh5)) | 0;
	    mid = (mid + Math.imul(ah6, bl5)) | 0;
	    hi = (hi + Math.imul(ah6, bh5)) | 0;
	    lo = (lo + Math.imul(al5, bl6)) | 0;
	    mid = (mid + Math.imul(al5, bh6)) | 0;
	    mid = (mid + Math.imul(ah5, bl6)) | 0;
	    hi = (hi + Math.imul(ah5, bh6)) | 0;
	    lo = (lo + Math.imul(al4, bl7)) | 0;
	    mid = (mid + Math.imul(al4, bh7)) | 0;
	    mid = (mid + Math.imul(ah4, bl7)) | 0;
	    hi = (hi + Math.imul(ah4, bh7)) | 0;
	    lo = (lo + Math.imul(al3, bl8)) | 0;
	    mid = (mid + Math.imul(al3, bh8)) | 0;
	    mid = (mid + Math.imul(ah3, bl8)) | 0;
	    hi = (hi + Math.imul(ah3, bh8)) | 0;
	    lo = (lo + Math.imul(al2, bl9)) | 0;
	    mid = (mid + Math.imul(al2, bh9)) | 0;
	    mid = (mid + Math.imul(ah2, bl9)) | 0;
	    hi = (hi + Math.imul(ah2, bh9)) | 0;
	    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
	    w11 &= 0x3ffffff;
	    /* k = 12 */
	    lo = Math.imul(al9, bl3);
	    mid = Math.imul(al9, bh3);
	    mid = (mid + Math.imul(ah9, bl3)) | 0;
	    hi = Math.imul(ah9, bh3);
	    lo = (lo + Math.imul(al8, bl4)) | 0;
	    mid = (mid + Math.imul(al8, bh4)) | 0;
	    mid = (mid + Math.imul(ah8, bl4)) | 0;
	    hi = (hi + Math.imul(ah8, bh4)) | 0;
	    lo = (lo + Math.imul(al7, bl5)) | 0;
	    mid = (mid + Math.imul(al7, bh5)) | 0;
	    mid = (mid + Math.imul(ah7, bl5)) | 0;
	    hi = (hi + Math.imul(ah7, bh5)) | 0;
	    lo = (lo + Math.imul(al6, bl6)) | 0;
	    mid = (mid + Math.imul(al6, bh6)) | 0;
	    mid = (mid + Math.imul(ah6, bl6)) | 0;
	    hi = (hi + Math.imul(ah6, bh6)) | 0;
	    lo = (lo + Math.imul(al5, bl7)) | 0;
	    mid = (mid + Math.imul(al5, bh7)) | 0;
	    mid = (mid + Math.imul(ah5, bl7)) | 0;
	    hi = (hi + Math.imul(ah5, bh7)) | 0;
	    lo = (lo + Math.imul(al4, bl8)) | 0;
	    mid = (mid + Math.imul(al4, bh8)) | 0;
	    mid = (mid + Math.imul(ah4, bl8)) | 0;
	    hi = (hi + Math.imul(ah4, bh8)) | 0;
	    lo = (lo + Math.imul(al3, bl9)) | 0;
	    mid = (mid + Math.imul(al3, bh9)) | 0;
	    mid = (mid + Math.imul(ah3, bl9)) | 0;
	    hi = (hi + Math.imul(ah3, bh9)) | 0;
	    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
	    w12 &= 0x3ffffff;
	    /* k = 13 */
	    lo = Math.imul(al9, bl4);
	    mid = Math.imul(al9, bh4);
	    mid = (mid + Math.imul(ah9, bl4)) | 0;
	    hi = Math.imul(ah9, bh4);
	    lo = (lo + Math.imul(al8, bl5)) | 0;
	    mid = (mid + Math.imul(al8, bh5)) | 0;
	    mid = (mid + Math.imul(ah8, bl5)) | 0;
	    hi = (hi + Math.imul(ah8, bh5)) | 0;
	    lo = (lo + Math.imul(al7, bl6)) | 0;
	    mid = (mid + Math.imul(al7, bh6)) | 0;
	    mid = (mid + Math.imul(ah7, bl6)) | 0;
	    hi = (hi + Math.imul(ah7, bh6)) | 0;
	    lo = (lo + Math.imul(al6, bl7)) | 0;
	    mid = (mid + Math.imul(al6, bh7)) | 0;
	    mid = (mid + Math.imul(ah6, bl7)) | 0;
	    hi = (hi + Math.imul(ah6, bh7)) | 0;
	    lo = (lo + Math.imul(al5, bl8)) | 0;
	    mid = (mid + Math.imul(al5, bh8)) | 0;
	    mid = (mid + Math.imul(ah5, bl8)) | 0;
	    hi = (hi + Math.imul(ah5, bh8)) | 0;
	    lo = (lo + Math.imul(al4, bl9)) | 0;
	    mid = (mid + Math.imul(al4, bh9)) | 0;
	    mid = (mid + Math.imul(ah4, bl9)) | 0;
	    hi = (hi + Math.imul(ah4, bh9)) | 0;
	    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
	    w13 &= 0x3ffffff;
	    /* k = 14 */
	    lo = Math.imul(al9, bl5);
	    mid = Math.imul(al9, bh5);
	    mid = (mid + Math.imul(ah9, bl5)) | 0;
	    hi = Math.imul(ah9, bh5);
	    lo = (lo + Math.imul(al8, bl6)) | 0;
	    mid = (mid + Math.imul(al8, bh6)) | 0;
	    mid = (mid + Math.imul(ah8, bl6)) | 0;
	    hi = (hi + Math.imul(ah8, bh6)) | 0;
	    lo = (lo + Math.imul(al7, bl7)) | 0;
	    mid = (mid + Math.imul(al7, bh7)) | 0;
	    mid = (mid + Math.imul(ah7, bl7)) | 0;
	    hi = (hi + Math.imul(ah7, bh7)) | 0;
	    lo = (lo + Math.imul(al6, bl8)) | 0;
	    mid = (mid + Math.imul(al6, bh8)) | 0;
	    mid = (mid + Math.imul(ah6, bl8)) | 0;
	    hi = (hi + Math.imul(ah6, bh8)) | 0;
	    lo = (lo + Math.imul(al5, bl9)) | 0;
	    mid = (mid + Math.imul(al5, bh9)) | 0;
	    mid = (mid + Math.imul(ah5, bl9)) | 0;
	    hi = (hi + Math.imul(ah5, bh9)) | 0;
	    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
	    w14 &= 0x3ffffff;
	    /* k = 15 */
	    lo = Math.imul(al9, bl6);
	    mid = Math.imul(al9, bh6);
	    mid = (mid + Math.imul(ah9, bl6)) | 0;
	    hi = Math.imul(ah9, bh6);
	    lo = (lo + Math.imul(al8, bl7)) | 0;
	    mid = (mid + Math.imul(al8, bh7)) | 0;
	    mid = (mid + Math.imul(ah8, bl7)) | 0;
	    hi = (hi + Math.imul(ah8, bh7)) | 0;
	    lo = (lo + Math.imul(al7, bl8)) | 0;
	    mid = (mid + Math.imul(al7, bh8)) | 0;
	    mid = (mid + Math.imul(ah7, bl8)) | 0;
	    hi = (hi + Math.imul(ah7, bh8)) | 0;
	    lo = (lo + Math.imul(al6, bl9)) | 0;
	    mid = (mid + Math.imul(al6, bh9)) | 0;
	    mid = (mid + Math.imul(ah6, bl9)) | 0;
	    hi = (hi + Math.imul(ah6, bh9)) | 0;
	    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
	    w15 &= 0x3ffffff;
	    /* k = 16 */
	    lo = Math.imul(al9, bl7);
	    mid = Math.imul(al9, bh7);
	    mid = (mid + Math.imul(ah9, bl7)) | 0;
	    hi = Math.imul(ah9, bh7);
	    lo = (lo + Math.imul(al8, bl8)) | 0;
	    mid = (mid + Math.imul(al8, bh8)) | 0;
	    mid = (mid + Math.imul(ah8, bl8)) | 0;
	    hi = (hi + Math.imul(ah8, bh8)) | 0;
	    lo = (lo + Math.imul(al7, bl9)) | 0;
	    mid = (mid + Math.imul(al7, bh9)) | 0;
	    mid = (mid + Math.imul(ah7, bl9)) | 0;
	    hi = (hi + Math.imul(ah7, bh9)) | 0;
	    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
	    w16 &= 0x3ffffff;
	    /* k = 17 */
	    lo = Math.imul(al9, bl8);
	    mid = Math.imul(al9, bh8);
	    mid = (mid + Math.imul(ah9, bl8)) | 0;
	    hi = Math.imul(ah9, bh8);
	    lo = (lo + Math.imul(al8, bl9)) | 0;
	    mid = (mid + Math.imul(al8, bh9)) | 0;
	    mid = (mid + Math.imul(ah8, bl9)) | 0;
	    hi = (hi + Math.imul(ah8, bh9)) | 0;
	    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
	    w17 &= 0x3ffffff;
	    /* k = 18 */
	    lo = Math.imul(al9, bl9);
	    mid = Math.imul(al9, bh9);
	    mid = (mid + Math.imul(ah9, bl9)) | 0;
	    hi = Math.imul(ah9, bh9);
	    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
	    w18 &= 0x3ffffff;
	    o[0] = w0;
	    o[1] = w1;
	    o[2] = w2;
	    o[3] = w3;
	    o[4] = w4;
	    o[5] = w5;
	    o[6] = w6;
	    o[7] = w7;
	    o[8] = w8;
	    o[9] = w9;
	    o[10] = w10;
	    o[11] = w11;
	    o[12] = w12;
	    o[13] = w13;
	    o[14] = w14;
	    o[15] = w15;
	    o[16] = w16;
	    o[17] = w17;
	    o[18] = w18;
	    if (c !== 0) {
	      o[19] = c;
	      out.length++;
	    }
	    return out;
	  };

	  // Polyfill comb
	  if (!Math.imul) {
	    comb10MulTo = smallMulTo;
	  }

	  function bigMulTo (self, num, out) {
	    out.negative = num.negative ^ self.negative;
	    out.length = self.length + num.length;

	    var carry = 0;
	    var hncarry = 0;
	    for (var k = 0; k < out.length - 1; k++) {
	      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
	      // note that ncarry could be >= 0x3ffffff
	      var ncarry = hncarry;
	      hncarry = 0;
	      var rword = carry & 0x3ffffff;
	      var maxJ = Math.min(k, num.length - 1);
	      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
	        var i = k - j;
	        var a = self.words[i] | 0;
	        var b = num.words[j] | 0;
	        var r = a * b;

	        var lo = r & 0x3ffffff;
	        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
	        lo = (lo + rword) | 0;
	        rword = lo & 0x3ffffff;
	        ncarry = (ncarry + (lo >>> 26)) | 0;

	        hncarry += ncarry >>> 26;
	        ncarry &= 0x3ffffff;
	      }
	      out.words[k] = rword;
	      carry = ncarry;
	      ncarry = hncarry;
	    }
	    if (carry !== 0) {
	      out.words[k] = carry;
	    } else {
	      out.length--;
	    }

	    return out.strip();
	  }

	  function jumboMulTo (self, num, out) {
	    var fftm = new FFTM();
	    return fftm.mulp(self, num, out);
	  }

	  BN.prototype.mulTo = function mulTo (num, out) {
	    var res;
	    var len = this.length + num.length;
	    if (this.length === 10 && num.length === 10) {
	      res = comb10MulTo(this, num, out);
	    } else if (len < 63) {
	      res = smallMulTo(this, num, out);
	    } else if (len < 1024) {
	      res = bigMulTo(this, num, out);
	    } else {
	      res = jumboMulTo(this, num, out);
	    }

	    return res;
	  };

	  // Cooley-Tukey algorithm for FFT
	  // slightly revisited to rely on looping instead of recursion

	  function FFTM (x, y) {
	    this.x = x;
	    this.y = y;
	  }

	  FFTM.prototype.makeRBT = function makeRBT (N) {
	    var t = new Array(N);
	    var l = BN.prototype._countBits(N) - 1;
	    for (var i = 0; i < N; i++) {
	      t[i] = this.revBin(i, l, N);
	    }

	    return t;
	  };

	  // Returns binary-reversed representation of `x`
	  FFTM.prototype.revBin = function revBin (x, l, N) {
	    if (x === 0 || x === N - 1) return x;

	    var rb = 0;
	    for (var i = 0; i < l; i++) {
	      rb |= (x & 1) << (l - i - 1);
	      x >>= 1;
	    }

	    return rb;
	  };

	  // Performs "tweedling" phase, therefore 'emulating'
	  // behaviour of the recursive algorithm
	  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
	    for (var i = 0; i < N; i++) {
	      rtws[i] = rws[rbt[i]];
	      itws[i] = iws[rbt[i]];
	    }
	  };

	  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
	    this.permute(rbt, rws, iws, rtws, itws, N);

	    for (var s = 1; s < N; s <<= 1) {
	      var l = s << 1;

	      var rtwdf = Math.cos(2 * Math.PI / l);
	      var itwdf = Math.sin(2 * Math.PI / l);

	      for (var p = 0; p < N; p += l) {
	        var rtwdf_ = rtwdf;
	        var itwdf_ = itwdf;

	        for (var j = 0; j < s; j++) {
	          var re = rtws[p + j];
	          var ie = itws[p + j];

	          var ro = rtws[p + j + s];
	          var io = itws[p + j + s];

	          var rx = rtwdf_ * ro - itwdf_ * io;

	          io = rtwdf_ * io + itwdf_ * ro;
	          ro = rx;

	          rtws[p + j] = re + ro;
	          itws[p + j] = ie + io;

	          rtws[p + j + s] = re - ro;
	          itws[p + j + s] = ie - io;

	          /* jshint maxdepth : false */
	          if (j !== l) {
	            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

	            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
	            rtwdf_ = rx;
	          }
	        }
	      }
	    }
	  };

	  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
	    var N = Math.max(m, n) | 1;
	    var odd = N & 1;
	    var i = 0;
	    for (N = N / 2 | 0; N; N = N >>> 1) {
	      i++;
	    }

	    return 1 << i + 1 + odd;
	  };

	  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
	    if (N <= 1) return;

	    for (var i = 0; i < N / 2; i++) {
	      var t = rws[i];

	      rws[i] = rws[N - i - 1];
	      rws[N - i - 1] = t;

	      t = iws[i];

	      iws[i] = -iws[N - i - 1];
	      iws[N - i - 1] = -t;
	    }
	  };

	  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
	    var carry = 0;
	    for (var i = 0; i < N / 2; i++) {
	      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
	        Math.round(ws[2 * i] / N) +
	        carry;

	      ws[i] = w & 0x3ffffff;

	      if (w < 0x4000000) {
	        carry = 0;
	      } else {
	        carry = w / 0x4000000 | 0;
	      }
	    }

	    return ws;
	  };

	  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
	    var carry = 0;
	    for (var i = 0; i < len; i++) {
	      carry = carry + (ws[i] | 0);

	      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
	      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
	    }

	    // Pad with zeroes
	    for (i = 2 * len; i < N; ++i) {
	      rws[i] = 0;
	    }

	    assert(carry === 0);
	    assert((carry & ~0x1fff) === 0);
	  };

	  FFTM.prototype.stub = function stub (N) {
	    var ph = new Array(N);
	    for (var i = 0; i < N; i++) {
	      ph[i] = 0;
	    }

	    return ph;
	  };

	  FFTM.prototype.mulp = function mulp (x, y, out) {
	    var N = 2 * this.guessLen13b(x.length, y.length);

	    var rbt = this.makeRBT(N);

	    var _ = this.stub(N);

	    var rws = new Array(N);
	    var rwst = new Array(N);
	    var iwst = new Array(N);

	    var nrws = new Array(N);
	    var nrwst = new Array(N);
	    var niwst = new Array(N);

	    var rmws = out.words;
	    rmws.length = N;

	    this.convert13b(x.words, x.length, rws, N);
	    this.convert13b(y.words, y.length, nrws, N);

	    this.transform(rws, _, rwst, iwst, N, rbt);
	    this.transform(nrws, _, nrwst, niwst, N, rbt);

	    for (var i = 0; i < N; i++) {
	      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
	      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
	      rwst[i] = rx;
	    }

	    this.conjugate(rwst, iwst, N);
	    this.transform(rwst, iwst, rmws, _, N, rbt);
	    this.conjugate(rmws, _, N);
	    this.normalize13b(rmws, N);

	    out.negative = x.negative ^ y.negative;
	    out.length = x.length + y.length;
	    return out.strip();
	  };

	  // Multiply `this` by `num`
	  BN.prototype.mul = function mul (num) {
	    var out = new BN(null);
	    out.words = new Array(this.length + num.length);
	    return this.mulTo(num, out);
	  };

	  // Multiply employing FFT
	  BN.prototype.mulf = function mulf (num) {
	    var out = new BN(null);
	    out.words = new Array(this.length + num.length);
	    return jumboMulTo(this, num, out);
	  };

	  // In-place Multiplication
	  BN.prototype.imul = function imul (num) {
	    return this.clone().mulTo(num, this);
	  };

	  BN.prototype.imuln = function imuln (num) {
	    assert(typeof num === 'number');
	    assert(num < 0x4000000);

	    // Carry
	    var carry = 0;
	    for (var i = 0; i < this.length; i++) {
	      var w = (this.words[i] | 0) * num;
	      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
	      carry >>= 26;
	      carry += (w / 0x4000000) | 0;
	      // NOTE: lo is 27bit maximum
	      carry += lo >>> 26;
	      this.words[i] = lo & 0x3ffffff;
	    }

	    if (carry !== 0) {
	      this.words[i] = carry;
	      this.length++;
	    }

	    return this;
	  };

	  BN.prototype.muln = function muln (num) {
	    return this.clone().imuln(num);
	  };

	  // `this` * `this`
	  BN.prototype.sqr = function sqr () {
	    return this.mul(this);
	  };

	  // `this` * `this` in-place
	  BN.prototype.isqr = function isqr () {
	    return this.imul(this.clone());
	  };

	  // Math.pow(`this`, `num`)
	  BN.prototype.pow = function pow (num) {
	    var w = toBitArray(num);
	    if (w.length === 0) return new BN(1);

	    // Skip leading zeroes
	    var res = this;
	    for (var i = 0; i < w.length; i++, res = res.sqr()) {
	      if (w[i] !== 0) break;
	    }

	    if (++i < w.length) {
	      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
	        if (w[i] === 0) continue;

	        res = res.mul(q);
	      }
	    }

	    return res;
	  };

	  // Shift-left in-place
	  BN.prototype.iushln = function iushln (bits) {
	    assert(typeof bits === 'number' && bits >= 0);
	    var r = bits % 26;
	    var s = (bits - r) / 26;
	    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
	    var i;

	    if (r !== 0) {
	      var carry = 0;

	      for (i = 0; i < this.length; i++) {
	        var newCarry = this.words[i] & carryMask;
	        var c = ((this.words[i] | 0) - newCarry) << r;
	        this.words[i] = c | carry;
	        carry = newCarry >>> (26 - r);
	      }

	      if (carry) {
	        this.words[i] = carry;
	        this.length++;
	      }
	    }

	    if (s !== 0) {
	      for (i = this.length - 1; i >= 0; i--) {
	        this.words[i + s] = this.words[i];
	      }

	      for (i = 0; i < s; i++) {
	        this.words[i] = 0;
	      }

	      this.length += s;
	    }

	    return this.strip();
	  };

	  BN.prototype.ishln = function ishln (bits) {
	    // TODO(indutny): implement me
	    assert(this.negative === 0);
	    return this.iushln(bits);
	  };

	  // Shift-right in-place
	  // NOTE: `hint` is a lowest bit before trailing zeroes
	  // NOTE: if `extended` is present - it will be filled with destroyed bits
	  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
	    assert(typeof bits === 'number' && bits >= 0);
	    var h;
	    if (hint) {
	      h = (hint - (hint % 26)) / 26;
	    } else {
	      h = 0;
	    }

	    var r = bits % 26;
	    var s = Math.min((bits - r) / 26, this.length);
	    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
	    var maskedWords = extended;

	    h -= s;
	    h = Math.max(0, h);

	    // Extended mode, copy masked part
	    if (maskedWords) {
	      for (var i = 0; i < s; i++) {
	        maskedWords.words[i] = this.words[i];
	      }
	      maskedWords.length = s;
	    }

	    if (s === 0) {
	      // No-op, we should not move anything at all
	    } else if (this.length > s) {
	      this.length -= s;
	      for (i = 0; i < this.length; i++) {
	        this.words[i] = this.words[i + s];
	      }
	    } else {
	      this.words[0] = 0;
	      this.length = 1;
	    }

	    var carry = 0;
	    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
	      var word = this.words[i] | 0;
	      this.words[i] = (carry << (26 - r)) | (word >>> r);
	      carry = word & mask;
	    }

	    // Push carried bits as a mask
	    if (maskedWords && carry !== 0) {
	      maskedWords.words[maskedWords.length++] = carry;
	    }

	    if (this.length === 0) {
	      this.words[0] = 0;
	      this.length = 1;
	    }

	    return this.strip();
	  };

	  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
	    // TODO(indutny): implement me
	    assert(this.negative === 0);
	    return this.iushrn(bits, hint, extended);
	  };

	  // Shift-left
	  BN.prototype.shln = function shln (bits) {
	    return this.clone().ishln(bits);
	  };

	  BN.prototype.ushln = function ushln (bits) {
	    return this.clone().iushln(bits);
	  };

	  // Shift-right
	  BN.prototype.shrn = function shrn (bits) {
	    return this.clone().ishrn(bits);
	  };

	  BN.prototype.ushrn = function ushrn (bits) {
	    return this.clone().iushrn(bits);
	  };

	  // Test if n bit is set
	  BN.prototype.testn = function testn (bit) {
	    assert(typeof bit === 'number' && bit >= 0);
	    var r = bit % 26;
	    var s = (bit - r) / 26;
	    var q = 1 << r;

	    // Fast case: bit is much higher than all existing words
	    if (this.length <= s) return false;

	    // Check bit and return
	    var w = this.words[s];

	    return !!(w & q);
	  };

	  // Return only lowers bits of number (in-place)
	  BN.prototype.imaskn = function imaskn (bits) {
	    assert(typeof bits === 'number' && bits >= 0);
	    var r = bits % 26;
	    var s = (bits - r) / 26;

	    assert(this.negative === 0, 'imaskn works only with positive numbers');

	    if (this.length <= s) {
	      return this;
	    }

	    if (r !== 0) {
	      s++;
	    }
	    this.length = Math.min(s, this.length);

	    if (r !== 0) {
	      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
	      this.words[this.length - 1] &= mask;
	    }

	    return this.strip();
	  };

	  // Return only lowers bits of number
	  BN.prototype.maskn = function maskn (bits) {
	    return this.clone().imaskn(bits);
	  };

	  // Add plain number `num` to `this`
	  BN.prototype.iaddn = function iaddn (num) {
	    assert(typeof num === 'number');
	    assert(num < 0x4000000);
	    if (num < 0) return this.isubn(-num);

	    // Possible sign change
	    if (this.negative !== 0) {
	      if (this.length === 1 && (this.words[0] | 0) < num) {
	        this.words[0] = num - (this.words[0] | 0);
	        this.negative = 0;
	        return this;
	      }

	      this.negative = 0;
	      this.isubn(num);
	      this.negative = 1;
	      return this;
	    }

	    // Add without checks
	    return this._iaddn(num);
	  };

	  BN.prototype._iaddn = function _iaddn (num) {
	    this.words[0] += num;

	    // Carry
	    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
	      this.words[i] -= 0x4000000;
	      if (i === this.length - 1) {
	        this.words[i + 1] = 1;
	      } else {
	        this.words[i + 1]++;
	      }
	    }
	    this.length = Math.max(this.length, i + 1);

	    return this;
	  };

	  // Subtract plain number `num` from `this`
	  BN.prototype.isubn = function isubn (num) {
	    assert(typeof num === 'number');
	    assert(num < 0x4000000);
	    if (num < 0) return this.iaddn(-num);

	    if (this.negative !== 0) {
	      this.negative = 0;
	      this.iaddn(num);
	      this.negative = 1;
	      return this;
	    }

	    this.words[0] -= num;

	    if (this.length === 1 && this.words[0] < 0) {
	      this.words[0] = -this.words[0];
	      this.negative = 1;
	    } else {
	      // Carry
	      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
	        this.words[i] += 0x4000000;
	        this.words[i + 1] -= 1;
	      }
	    }

	    return this.strip();
	  };

	  BN.prototype.addn = function addn (num) {
	    return this.clone().iaddn(num);
	  };

	  BN.prototype.subn = function subn (num) {
	    return this.clone().isubn(num);
	  };

	  BN.prototype.iabs = function iabs () {
	    this.negative = 0;

	    return this;
	  };

	  BN.prototype.abs = function abs () {
	    return this.clone().iabs();
	  };

	  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
	    var len = num.length + shift;
	    var i;

	    this._expand(len);

	    var w;
	    var carry = 0;
	    for (i = 0; i < num.length; i++) {
	      w = (this.words[i + shift] | 0) + carry;
	      var right = (num.words[i] | 0) * mul;
	      w -= right & 0x3ffffff;
	      carry = (w >> 26) - ((right / 0x4000000) | 0);
	      this.words[i + shift] = w & 0x3ffffff;
	    }
	    for (; i < this.length - shift; i++) {
	      w = (this.words[i + shift] | 0) + carry;
	      carry = w >> 26;
	      this.words[i + shift] = w & 0x3ffffff;
	    }

	    if (carry === 0) return this.strip();

	    // Subtraction overflow
	    assert(carry === -1);
	    carry = 0;
	    for (i = 0; i < this.length; i++) {
	      w = -(this.words[i] | 0) + carry;
	      carry = w >> 26;
	      this.words[i] = w & 0x3ffffff;
	    }
	    this.negative = 1;

	    return this.strip();
	  };

	  BN.prototype._wordDiv = function _wordDiv (num, mode) {
	    var shift = this.length - num.length;

	    var a = this.clone();
	    var b = num;

	    // Normalize
	    var bhi = b.words[b.length - 1] | 0;
	    var bhiBits = this._countBits(bhi);
	    shift = 26 - bhiBits;
	    if (shift !== 0) {
	      b = b.ushln(shift);
	      a.iushln(shift);
	      bhi = b.words[b.length - 1] | 0;
	    }

	    // Initialize quotient
	    var m = a.length - b.length;
	    var q;

	    if (mode !== 'mod') {
	      q = new BN(null);
	      q.length = m + 1;
	      q.words = new Array(q.length);
	      for (var i = 0; i < q.length; i++) {
	        q.words[i] = 0;
	      }
	    }

	    var diff = a.clone()._ishlnsubmul(b, 1, m);
	    if (diff.negative === 0) {
	      a = diff;
	      if (q) {
	        q.words[m] = 1;
	      }
	    }

	    for (var j = m - 1; j >= 0; j--) {
	      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
	        (a.words[b.length + j - 1] | 0);

	      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
	      // (0x7ffffff)
	      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

	      a._ishlnsubmul(b, qj, j);
	      while (a.negative !== 0) {
	        qj--;
	        a.negative = 0;
	        a._ishlnsubmul(b, 1, j);
	        if (!a.isZero()) {
	          a.negative ^= 1;
	        }
	      }
	      if (q) {
	        q.words[j] = qj;
	      }
	    }
	    if (q) {
	      q.strip();
	    }
	    a.strip();

	    // Denormalize
	    if (mode !== 'div' && shift !== 0) {
	      a.iushrn(shift);
	    }

	    return {
	      div: q || null,
	      mod: a
	    };
	  };

	  // NOTE: 1) `mode` can be set to `mod` to request mod only,
	  //       to `div` to request div only, or be absent to
	  //       request both div & mod
	  //       2) `positive` is true if unsigned mod is requested
	  BN.prototype.divmod = function divmod (num, mode, positive) {
	    assert(!num.isZero());

	    if (this.isZero()) {
	      return {
	        div: new BN(0),
	        mod: new BN(0)
	      };
	    }

	    var div, mod, res;
	    if (this.negative !== 0 && num.negative === 0) {
	      res = this.neg().divmod(num, mode);

	      if (mode !== 'mod') {
	        div = res.div.neg();
	      }

	      if (mode !== 'div') {
	        mod = res.mod.neg();
	        if (positive && mod.negative !== 0) {
	          mod.iadd(num);
	        }
	      }

	      return {
	        div: div,
	        mod: mod
	      };
	    }

	    if (this.negative === 0 && num.negative !== 0) {
	      res = this.divmod(num.neg(), mode);

	      if (mode !== 'mod') {
	        div = res.div.neg();
	      }

	      return {
	        div: div,
	        mod: res.mod
	      };
	    }

	    if ((this.negative & num.negative) !== 0) {
	      res = this.neg().divmod(num.neg(), mode);

	      if (mode !== 'div') {
	        mod = res.mod.neg();
	        if (positive && mod.negative !== 0) {
	          mod.isub(num);
	        }
	      }

	      return {
	        div: res.div,
	        mod: mod
	      };
	    }

	    // Both numbers are positive at this point

	    // Strip both numbers to approximate shift value
	    if (num.length > this.length || this.cmp(num) < 0) {
	      return {
	        div: new BN(0),
	        mod: this
	      };
	    }

	    // Very short reduction
	    if (num.length === 1) {
	      if (mode === 'div') {
	        return {
	          div: this.divn(num.words[0]),
	          mod: null
	        };
	      }

	      if (mode === 'mod') {
	        return {
	          div: null,
	          mod: new BN(this.modn(num.words[0]))
	        };
	      }

	      return {
	        div: this.divn(num.words[0]),
	        mod: new BN(this.modn(num.words[0]))
	      };
	    }

	    return this._wordDiv(num, mode);
	  };

	  // Find `this` / `num`
	  BN.prototype.div = function div (num) {
	    return this.divmod(num, 'div', false).div;
	  };

	  // Find `this` % `num`
	  BN.prototype.mod = function mod (num) {
	    return this.divmod(num, 'mod', false).mod;
	  };

	  BN.prototype.umod = function umod (num) {
	    return this.divmod(num, 'mod', true).mod;
	  };

	  // Find Round(`this` / `num`)
	  BN.prototype.divRound = function divRound (num) {
	    var dm = this.divmod(num);

	    // Fast case - exact division
	    if (dm.mod.isZero()) return dm.div;

	    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

	    var half = num.ushrn(1);
	    var r2 = num.andln(1);
	    var cmp = mod.cmp(half);

	    // Round down
	    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

	    // Round up
	    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
	  };

	  BN.prototype.modn = function modn (num) {
	    assert(num <= 0x3ffffff);
	    var p = (1 << 26) % num;

	    var acc = 0;
	    for (var i = this.length - 1; i >= 0; i--) {
	      acc = (p * acc + (this.words[i] | 0)) % num;
	    }

	    return acc;
	  };

	  // In-place division by number
	  BN.prototype.idivn = function idivn (num) {
	    assert(num <= 0x3ffffff);

	    var carry = 0;
	    for (var i = this.length - 1; i >= 0; i--) {
	      var w = (this.words[i] | 0) + carry * 0x4000000;
	      this.words[i] = (w / num) | 0;
	      carry = w % num;
	    }

	    return this.strip();
	  };

	  BN.prototype.divn = function divn (num) {
	    return this.clone().idivn(num);
	  };

	  BN.prototype.egcd = function egcd (p) {
	    assert(p.negative === 0);
	    assert(!p.isZero());

	    var x = this;
	    var y = p.clone();

	    if (x.negative !== 0) {
	      x = x.umod(p);
	    } else {
	      x = x.clone();
	    }

	    // A * x + B * y = x
	    var A = new BN(1);
	    var B = new BN(0);

	    // C * x + D * y = y
	    var C = new BN(0);
	    var D = new BN(1);

	    var g = 0;

	    while (x.isEven() && y.isEven()) {
	      x.iushrn(1);
	      y.iushrn(1);
	      ++g;
	    }

	    var yp = y.clone();
	    var xp = x.clone();

	    while (!x.isZero()) {
	      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
	      if (i > 0) {
	        x.iushrn(i);
	        while (i-- > 0) {
	          if (A.isOdd() || B.isOdd()) {
	            A.iadd(yp);
	            B.isub(xp);
	          }

	          A.iushrn(1);
	          B.iushrn(1);
	        }
	      }

	      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
	      if (j > 0) {
	        y.iushrn(j);
	        while (j-- > 0) {
	          if (C.isOdd() || D.isOdd()) {
	            C.iadd(yp);
	            D.isub(xp);
	          }

	          C.iushrn(1);
	          D.iushrn(1);
	        }
	      }

	      if (x.cmp(y) >= 0) {
	        x.isub(y);
	        A.isub(C);
	        B.isub(D);
	      } else {
	        y.isub(x);
	        C.isub(A);
	        D.isub(B);
	      }
	    }

	    return {
	      a: C,
	      b: D,
	      gcd: y.iushln(g)
	    };
	  };

	  // This is reduced incarnation of the binary EEA
	  // above, designated to invert members of the
	  // _prime_ fields F(p) at a maximal speed
	  BN.prototype._invmp = function _invmp (p) {
	    assert(p.negative === 0);
	    assert(!p.isZero());

	    var a = this;
	    var b = p.clone();

	    if (a.negative !== 0) {
	      a = a.umod(p);
	    } else {
	      a = a.clone();
	    }

	    var x1 = new BN(1);
	    var x2 = new BN(0);

	    var delta = b.clone();

	    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
	      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
	      if (i > 0) {
	        a.iushrn(i);
	        while (i-- > 0) {
	          if (x1.isOdd()) {
	            x1.iadd(delta);
	          }

	          x1.iushrn(1);
	        }
	      }

	      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
	      if (j > 0) {
	        b.iushrn(j);
	        while (j-- > 0) {
	          if (x2.isOdd()) {
	            x2.iadd(delta);
	          }

	          x2.iushrn(1);
	        }
	      }

	      if (a.cmp(b) >= 0) {
	        a.isub(b);
	        x1.isub(x2);
	      } else {
	        b.isub(a);
	        x2.isub(x1);
	      }
	    }

	    var res;
	    if (a.cmpn(1) === 0) {
	      res = x1;
	    } else {
	      res = x2;
	    }

	    if (res.cmpn(0) < 0) {
	      res.iadd(p);
	    }

	    return res;
	  };

	  BN.prototype.gcd = function gcd (num) {
	    if (this.isZero()) return num.abs();
	    if (num.isZero()) return this.abs();

	    var a = this.clone();
	    var b = num.clone();
	    a.negative = 0;
	    b.negative = 0;

	    // Remove common factor of two
	    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
	      a.iushrn(1);
	      b.iushrn(1);
	    }

	    do {
	      while (a.isEven()) {
	        a.iushrn(1);
	      }
	      while (b.isEven()) {
	        b.iushrn(1);
	      }

	      var r = a.cmp(b);
	      if (r < 0) {
	        // Swap `a` and `b` to make `a` always bigger than `b`
	        var t = a;
	        a = b;
	        b = t;
	      } else if (r === 0 || b.cmpn(1) === 0) {
	        break;
	      }

	      a.isub(b);
	    } while (true);

	    return b.iushln(shift);
	  };

	  // Invert number in the field F(num)
	  BN.prototype.invm = function invm (num) {
	    return this.egcd(num).a.umod(num);
	  };

	  BN.prototype.isEven = function isEven () {
	    return (this.words[0] & 1) === 0;
	  };

	  BN.prototype.isOdd = function isOdd () {
	    return (this.words[0] & 1) === 1;
	  };

	  // And first word and num
	  BN.prototype.andln = function andln (num) {
	    return this.words[0] & num;
	  };

	  // Increment at the bit position in-line
	  BN.prototype.bincn = function bincn (bit) {
	    assert(typeof bit === 'number');
	    var r = bit % 26;
	    var s = (bit - r) / 26;
	    var q = 1 << r;

	    // Fast case: bit is much higher than all existing words
	    if (this.length <= s) {
	      this._expand(s + 1);
	      this.words[s] |= q;
	      return this;
	    }

	    // Add bit and propagate, if needed
	    var carry = q;
	    for (var i = s; carry !== 0 && i < this.length; i++) {
	      var w = this.words[i] | 0;
	      w += carry;
	      carry = w >>> 26;
	      w &= 0x3ffffff;
	      this.words[i] = w;
	    }
	    if (carry !== 0) {
	      this.words[i] = carry;
	      this.length++;
	    }
	    return this;
	  };

	  BN.prototype.isZero = function isZero () {
	    return this.length === 1 && this.words[0] === 0;
	  };

	  BN.prototype.cmpn = function cmpn (num) {
	    var negative = num < 0;

	    if (this.negative !== 0 && !negative) return -1;
	    if (this.negative === 0 && negative) return 1;

	    this.strip();

	    var res;
	    if (this.length > 1) {
	      res = 1;
	    } else {
	      if (negative) {
	        num = -num;
	      }

	      assert(num <= 0x3ffffff, 'Number is too big');

	      var w = this.words[0] | 0;
	      res = w === num ? 0 : w < num ? -1 : 1;
	    }
	    if (this.negative !== 0) return -res | 0;
	    return res;
	  };

	  // Compare two numbers and return:
	  // 1 - if `this` > `num`
	  // 0 - if `this` == `num`
	  // -1 - if `this` < `num`
	  BN.prototype.cmp = function cmp (num) {
	    if (this.negative !== 0 && num.negative === 0) return -1;
	    if (this.negative === 0 && num.negative !== 0) return 1;

	    var res = this.ucmp(num);
	    if (this.negative !== 0) return -res | 0;
	    return res;
	  };

	  // Unsigned comparison
	  BN.prototype.ucmp = function ucmp (num) {
	    // At this point both numbers have the same sign
	    if (this.length > num.length) return 1;
	    if (this.length < num.length) return -1;

	    var res = 0;
	    for (var i = this.length - 1; i >= 0; i--) {
	      var a = this.words[i] | 0;
	      var b = num.words[i] | 0;

	      if (a === b) continue;
	      if (a < b) {
	        res = -1;
	      } else if (a > b) {
	        res = 1;
	      }
	      break;
	    }
	    return res;
	  };

	  BN.prototype.gtn = function gtn (num) {
	    return this.cmpn(num) === 1;
	  };

	  BN.prototype.gt = function gt (num) {
	    return this.cmp(num) === 1;
	  };

	  BN.prototype.gten = function gten (num) {
	    return this.cmpn(num) >= 0;
	  };

	  BN.prototype.gte = function gte (num) {
	    return this.cmp(num) >= 0;
	  };

	  BN.prototype.ltn = function ltn (num) {
	    return this.cmpn(num) === -1;
	  };

	  BN.prototype.lt = function lt (num) {
	    return this.cmp(num) === -1;
	  };

	  BN.prototype.lten = function lten (num) {
	    return this.cmpn(num) <= 0;
	  };

	  BN.prototype.lte = function lte (num) {
	    return this.cmp(num) <= 0;
	  };

	  BN.prototype.eqn = function eqn (num) {
	    return this.cmpn(num) === 0;
	  };

	  BN.prototype.eq = function eq (num) {
	    return this.cmp(num) === 0;
	  };

	  //
	  // A reduce context, could be using montgomery or something better, depending
	  // on the `m` itself.
	  //
	  BN.red = function red (num) {
	    return new Red(num);
	  };

	  BN.prototype.toRed = function toRed (ctx) {
	    assert(!this.red, 'Already a number in reduction context');
	    assert(this.negative === 0, 'red works only with positives');
	    return ctx.convertTo(this)._forceRed(ctx);
	  };

	  BN.prototype.fromRed = function fromRed () {
	    assert(this.red, 'fromRed works only with numbers in reduction context');
	    return this.red.convertFrom(this);
	  };

	  BN.prototype._forceRed = function _forceRed (ctx) {
	    this.red = ctx;
	    return this;
	  };

	  BN.prototype.forceRed = function forceRed (ctx) {
	    assert(!this.red, 'Already a number in reduction context');
	    return this._forceRed(ctx);
	  };

	  BN.prototype.redAdd = function redAdd (num) {
	    assert(this.red, 'redAdd works only with red numbers');
	    return this.red.add(this, num);
	  };

	  BN.prototype.redIAdd = function redIAdd (num) {
	    assert(this.red, 'redIAdd works only with red numbers');
	    return this.red.iadd(this, num);
	  };

	  BN.prototype.redSub = function redSub (num) {
	    assert(this.red, 'redSub works only with red numbers');
	    return this.red.sub(this, num);
	  };

	  BN.prototype.redISub = function redISub (num) {
	    assert(this.red, 'redISub works only with red numbers');
	    return this.red.isub(this, num);
	  };

	  BN.prototype.redShl = function redShl (num) {
	    assert(this.red, 'redShl works only with red numbers');
	    return this.red.shl(this, num);
	  };

	  BN.prototype.redMul = function redMul (num) {
	    assert(this.red, 'redMul works only with red numbers');
	    this.red._verify2(this, num);
	    return this.red.mul(this, num);
	  };

	  BN.prototype.redIMul = function redIMul (num) {
	    assert(this.red, 'redMul works only with red numbers');
	    this.red._verify2(this, num);
	    return this.red.imul(this, num);
	  };

	  BN.prototype.redSqr = function redSqr () {
	    assert(this.red, 'redSqr works only with red numbers');
	    this.red._verify1(this);
	    return this.red.sqr(this);
	  };

	  BN.prototype.redISqr = function redISqr () {
	    assert(this.red, 'redISqr works only with red numbers');
	    this.red._verify1(this);
	    return this.red.isqr(this);
	  };

	  // Square root over p
	  BN.prototype.redSqrt = function redSqrt () {
	    assert(this.red, 'redSqrt works only with red numbers');
	    this.red._verify1(this);
	    return this.red.sqrt(this);
	  };

	  BN.prototype.redInvm = function redInvm () {
	    assert(this.red, 'redInvm works only with red numbers');
	    this.red._verify1(this);
	    return this.red.invm(this);
	  };

	  // Return negative clone of `this` % `red modulo`
	  BN.prototype.redNeg = function redNeg () {
	    assert(this.red, 'redNeg works only with red numbers');
	    this.red._verify1(this);
	    return this.red.neg(this);
	  };

	  BN.prototype.redPow = function redPow (num) {
	    assert(this.red && !num.red, 'redPow(normalNum)');
	    this.red._verify1(this);
	    return this.red.pow(this, num);
	  };

	  // Prime numbers with efficient reduction
	  var primes = {
	    k256: null,
	    p224: null,
	    p192: null,
	    p25519: null
	  };

	  // Pseudo-Mersenne prime
	  function MPrime (name, p) {
	    // P = 2 ^ N - K
	    this.name = name;
	    this.p = new BN(p, 16);
	    this.n = this.p.bitLength();
	    this.k = new BN(1).iushln(this.n).isub(this.p);

	    this.tmp = this._tmp();
	  }

	  MPrime.prototype._tmp = function _tmp () {
	    var tmp = new BN(null);
	    tmp.words = new Array(Math.ceil(this.n / 13));
	    return tmp;
	  };

	  MPrime.prototype.ireduce = function ireduce (num) {
	    // Assumes that `num` is less than `P^2`
	    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
	    var r = num;
	    var rlen;

	    do {
	      this.split(r, this.tmp);
	      r = this.imulK(r);
	      r = r.iadd(this.tmp);
	      rlen = r.bitLength();
	    } while (rlen > this.n);

	    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
	    if (cmp === 0) {
	      r.words[0] = 0;
	      r.length = 1;
	    } else if (cmp > 0) {
	      r.isub(this.p);
	    } else {
	      if (r.strip !== undefined) {
	        // r is BN v4 instance
	        r.strip();
	      } else {
	        // r is BN v5 instance
	        r._strip();
	      }
	    }

	    return r;
	  };

	  MPrime.prototype.split = function split (input, out) {
	    input.iushrn(this.n, 0, out);
	  };

	  MPrime.prototype.imulK = function imulK (num) {
	    return num.imul(this.k);
	  };

	  function K256 () {
	    MPrime.call(
	      this,
	      'k256',
	      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
	  }
	  inherits(K256, MPrime);

	  K256.prototype.split = function split (input, output) {
	    // 256 = 9 * 26 + 22
	    var mask = 0x3fffff;

	    var outLen = Math.min(input.length, 9);
	    for (var i = 0; i < outLen; i++) {
	      output.words[i] = input.words[i];
	    }
	    output.length = outLen;

	    if (input.length <= 9) {
	      input.words[0] = 0;
	      input.length = 1;
	      return;
	    }

	    // Shift by 9 limbs
	    var prev = input.words[9];
	    output.words[output.length++] = prev & mask;

	    for (i = 10; i < input.length; i++) {
	      var next = input.words[i] | 0;
	      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
	      prev = next;
	    }
	    prev >>>= 22;
	    input.words[i - 10] = prev;
	    if (prev === 0 && input.length > 10) {
	      input.length -= 10;
	    } else {
	      input.length -= 9;
	    }
	  };

	  K256.prototype.imulK = function imulK (num) {
	    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
	    num.words[num.length] = 0;
	    num.words[num.length + 1] = 0;
	    num.length += 2;

	    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
	    var lo = 0;
	    for (var i = 0; i < num.length; i++) {
	      var w = num.words[i] | 0;
	      lo += w * 0x3d1;
	      num.words[i] = lo & 0x3ffffff;
	      lo = w * 0x40 + ((lo / 0x4000000) | 0);
	    }

	    // Fast length reduction
	    if (num.words[num.length - 1] === 0) {
	      num.length--;
	      if (num.words[num.length - 1] === 0) {
	        num.length--;
	      }
	    }
	    return num;
	  };

	  function P224 () {
	    MPrime.call(
	      this,
	      'p224',
	      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
	  }
	  inherits(P224, MPrime);

	  function P192 () {
	    MPrime.call(
	      this,
	      'p192',
	      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
	  }
	  inherits(P192, MPrime);

	  function P25519 () {
	    // 2 ^ 255 - 19
	    MPrime.call(
	      this,
	      '25519',
	      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
	  }
	  inherits(P25519, MPrime);

	  P25519.prototype.imulK = function imulK (num) {
	    // K = 0x13
	    var carry = 0;
	    for (var i = 0; i < num.length; i++) {
	      var hi = (num.words[i] | 0) * 0x13 + carry;
	      var lo = hi & 0x3ffffff;
	      hi >>>= 26;

	      num.words[i] = lo;
	      carry = hi;
	    }
	    if (carry !== 0) {
	      num.words[num.length++] = carry;
	    }
	    return num;
	  };

	  // Exported mostly for testing purposes, use plain name instead
	  BN._prime = function prime (name) {
	    // Cached version of prime
	    if (primes[name]) return primes[name];

	    var prime;
	    if (name === 'k256') {
	      prime = new K256();
	    } else if (name === 'p224') {
	      prime = new P224();
	    } else if (name === 'p192') {
	      prime = new P192();
	    } else if (name === 'p25519') {
	      prime = new P25519();
	    } else {
	      throw new Error('Unknown prime ' + name);
	    }
	    primes[name] = prime;

	    return prime;
	  };

	  //
	  // Base reduction engine
	  //
	  function Red (m) {
	    if (typeof m === 'string') {
	      var prime = BN._prime(m);
	      this.m = prime.p;
	      this.prime = prime;
	    } else {
	      assert(m.gtn(1), 'modulus must be greater than 1');
	      this.m = m;
	      this.prime = null;
	    }
	  }

	  Red.prototype._verify1 = function _verify1 (a) {
	    assert(a.negative === 0, 'red works only with positives');
	    assert(a.red, 'red works only with red numbers');
	  };

	  Red.prototype._verify2 = function _verify2 (a, b) {
	    assert((a.negative | b.negative) === 0, 'red works only with positives');
	    assert(a.red && a.red === b.red,
	      'red works only with red numbers');
	  };

	  Red.prototype.imod = function imod (a) {
	    if (this.prime) return this.prime.ireduce(a)._forceRed(this);
	    return a.umod(this.m)._forceRed(this);
	  };

	  Red.prototype.neg = function neg (a) {
	    if (a.isZero()) {
	      return a.clone();
	    }

	    return this.m.sub(a)._forceRed(this);
	  };

	  Red.prototype.add = function add (a, b) {
	    this._verify2(a, b);

	    var res = a.add(b);
	    if (res.cmp(this.m) >= 0) {
	      res.isub(this.m);
	    }
	    return res._forceRed(this);
	  };

	  Red.prototype.iadd = function iadd (a, b) {
	    this._verify2(a, b);

	    var res = a.iadd(b);
	    if (res.cmp(this.m) >= 0) {
	      res.isub(this.m);
	    }
	    return res;
	  };

	  Red.prototype.sub = function sub (a, b) {
	    this._verify2(a, b);

	    var res = a.sub(b);
	    if (res.cmpn(0) < 0) {
	      res.iadd(this.m);
	    }
	    return res._forceRed(this);
	  };

	  Red.prototype.isub = function isub (a, b) {
	    this._verify2(a, b);

	    var res = a.isub(b);
	    if (res.cmpn(0) < 0) {
	      res.iadd(this.m);
	    }
	    return res;
	  };

	  Red.prototype.shl = function shl (a, num) {
	    this._verify1(a);
	    return this.imod(a.ushln(num));
	  };

	  Red.prototype.imul = function imul (a, b) {
	    this._verify2(a, b);
	    return this.imod(a.imul(b));
	  };

	  Red.prototype.mul = function mul (a, b) {
	    this._verify2(a, b);
	    return this.imod(a.mul(b));
	  };

	  Red.prototype.isqr = function isqr (a) {
	    return this.imul(a, a.clone());
	  };

	  Red.prototype.sqr = function sqr (a) {
	    return this.mul(a, a);
	  };

	  Red.prototype.sqrt = function sqrt (a) {
	    if (a.isZero()) return a.clone();

	    var mod3 = this.m.andln(3);
	    assert(mod3 % 2 === 1);

	    // Fast case
	    if (mod3 === 3) {
	      var pow = this.m.add(new BN(1)).iushrn(2);
	      return this.pow(a, pow);
	    }

	    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
	    //
	    // Find Q and S, that Q * 2 ^ S = (P - 1)
	    var q = this.m.subn(1);
	    var s = 0;
	    while (!q.isZero() && q.andln(1) === 0) {
	      s++;
	      q.iushrn(1);
	    }
	    assert(!q.isZero());

	    var one = new BN(1).toRed(this);
	    var nOne = one.redNeg();

	    // Find quadratic non-residue
	    // NOTE: Max is such because of generalized Riemann hypothesis.
	    var lpow = this.m.subn(1).iushrn(1);
	    var z = this.m.bitLength();
	    z = new BN(2 * z * z).toRed(this);

	    while (this.pow(z, lpow).cmp(nOne) !== 0) {
	      z.redIAdd(nOne);
	    }

	    var c = this.pow(z, q);
	    var r = this.pow(a, q.addn(1).iushrn(1));
	    var t = this.pow(a, q);
	    var m = s;
	    while (t.cmp(one) !== 0) {
	      var tmp = t;
	      for (var i = 0; tmp.cmp(one) !== 0; i++) {
	        tmp = tmp.redSqr();
	      }
	      assert(i < m);
	      var b = this.pow(c, new BN(1).iushln(m - i - 1));

	      r = r.redMul(b);
	      c = b.redSqr();
	      t = t.redMul(c);
	      m = i;
	    }

	    return r;
	  };

	  Red.prototype.invm = function invm (a) {
	    var inv = a._invmp(this.m);
	    if (inv.negative !== 0) {
	      inv.negative = 0;
	      return this.imod(inv).redNeg();
	    } else {
	      return this.imod(inv);
	    }
	  };

	  Red.prototype.pow = function pow (a, num) {
	    if (num.isZero()) return new BN(1).toRed(this);
	    if (num.cmpn(1) === 0) return a.clone();

	    var windowSize = 4;
	    var wnd = new Array(1 << windowSize);
	    wnd[0] = new BN(1).toRed(this);
	    wnd[1] = a;
	    for (var i = 2; i < wnd.length; i++) {
	      wnd[i] = this.mul(wnd[i - 1], a);
	    }

	    var res = wnd[0];
	    var current = 0;
	    var currentLen = 0;
	    var start = num.bitLength() % 26;
	    if (start === 0) {
	      start = 26;
	    }

	    for (i = num.length - 1; i >= 0; i--) {
	      var word = num.words[i];
	      for (var j = start - 1; j >= 0; j--) {
	        var bit = (word >> j) & 1;
	        if (res !== wnd[0]) {
	          res = this.sqr(res);
	        }

	        if (bit === 0 && current === 0) {
	          currentLen = 0;
	          continue;
	        }

	        current <<= 1;
	        current |= bit;
	        currentLen++;
	        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

	        res = this.mul(res, wnd[current]);
	        currentLen = 0;
	        current = 0;
	      }
	      start = 26;
	    }

	    return res;
	  };

	  Red.prototype.convertTo = function convertTo (num) {
	    var r = num.umod(this.m);

	    return r === num ? r.clone() : r;
	  };

	  Red.prototype.convertFrom = function convertFrom (num) {
	    var res = num.clone();
	    res.red = null;
	    return res;
	  };

	  //
	  // Montgomery method engine
	  //

	  BN.mont = function mont (num) {
	    return new Mont(num);
	  };

	  function Mont (m) {
	    Red.call(this, m);

	    this.shift = this.m.bitLength();
	    if (this.shift % 26 !== 0) {
	      this.shift += 26 - (this.shift % 26);
	    }

	    this.r = new BN(1).iushln(this.shift);
	    this.r2 = this.imod(this.r.sqr());
	    this.rinv = this.r._invmp(this.m);

	    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
	    this.minv = this.minv.umod(this.r);
	    this.minv = this.r.sub(this.minv);
	  }
	  inherits(Mont, Red);

	  Mont.prototype.convertTo = function convertTo (num) {
	    return this.imod(num.ushln(this.shift));
	  };

	  Mont.prototype.convertFrom = function convertFrom (num) {
	    var r = this.imod(num.mul(this.rinv));
	    r.red = null;
	    return r;
	  };

	  Mont.prototype.imul = function imul (a, b) {
	    if (a.isZero() || b.isZero()) {
	      a.words[0] = 0;
	      a.length = 1;
	      return a;
	    }

	    var t = a.imul(b);
	    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
	    var u = t.isub(c).iushrn(this.shift);
	    var res = u;

	    if (u.cmp(this.m) >= 0) {
	      res = u.isub(this.m);
	    } else if (u.cmpn(0) < 0) {
	      res = u.iadd(this.m);
	    }

	    return res._forceRed(this);
	  };

	  Mont.prototype.mul = function mul (a, b) {
	    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

	    var t = a.mul(b);
	    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
	    var u = t.isub(c).iushrn(this.shift);
	    var res = u;
	    if (u.cmp(this.m) >= 0) {
	      res = u.isub(this.m);
	    } else if (u.cmpn(0) < 0) {
	      res = u.iadd(this.m);
	    }

	    return res._forceRed(this);
	  };

	  Mont.prototype.invm = function invm (a) {
	    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
	    var res = this.imod(a._invmp(this.m).mul(this.r2));
	    return res._forceRed(this);
	  };
	})('object' === 'undefined' || module, commonjsGlobal);
	});

	var utils_1 = createCommonjsModule(function (module, exports) {
	'use strict';

	var utils = exports;

	function toArray(msg, enc) {
	  if (Array.isArray(msg))
	    return msg.slice();
	  if (!msg)
	    return [];
	  var res = [];
	  if (typeof msg !== 'string') {
	    for (var i = 0; i < msg.length; i++)
	      res[i] = msg[i] | 0;
	    return res;
	  }
	  if (enc === 'hex') {
	    msg = msg.replace(/[^a-z0-9]+/ig, '');
	    if (msg.length % 2 !== 0)
	      msg = '0' + msg;
	    for (var i = 0; i < msg.length; i += 2)
	      res.push(parseInt(msg[i] + msg[i + 1], 16));
	  } else {
	    for (var i = 0; i < msg.length; i++) {
	      var c = msg.charCodeAt(i);
	      var hi = c >> 8;
	      var lo = c & 0xff;
	      if (hi)
	        res.push(hi, lo);
	      else
	        res.push(lo);
	    }
	  }
	  return res;
	}
	utils.toArray = toArray;

	function zero2(word) {
	  if (word.length === 1)
	    return '0' + word;
	  else
	    return word;
	}
	utils.zero2 = zero2;

	function toHex(msg) {
	  var res = '';
	  for (var i = 0; i < msg.length; i++)
	    res += zero2(msg[i].toString(16));
	  return res;
	}
	utils.toHex = toHex;

	utils.encode = function encode(arr, enc) {
	  if (enc === 'hex')
	    return toHex(arr);
	  else
	    return arr;
	};
	});

	var utils_1$1 = createCommonjsModule(function (module, exports) {
	'use strict';

	var utils = exports;




	utils.assert = minimalisticAssert;
	utils.toArray = utils_1.toArray;
	utils.zero2 = utils_1.zero2;
	utils.toHex = utils_1.toHex;
	utils.encode = utils_1.encode;

	// Represent num in a w-NAF form
	function getNAF(num, w, bits) {
	  var naf = new Array(Math.max(num.bitLength(), bits) + 1);
	  naf.fill(0);

	  var ws = 1 << (w + 1);
	  var k = num.clone();

	  for (var i = 0; i < naf.length; i++) {
	    var z;
	    var mod = k.andln(ws - 1);
	    if (k.isOdd()) {
	      if (mod > (ws >> 1) - 1)
	        z = (ws >> 1) - mod;
	      else
	        z = mod;
	      k.isubn(z);
	    } else {
	      z = 0;
	    }

	    naf[i] = z;
	    k.iushrn(1);
	  }

	  return naf;
	}
	utils.getNAF = getNAF;

	// Represent k1, k2 in a Joint Sparse Form
	function getJSF(k1, k2) {
	  var jsf = [
	    [],
	    []
	  ];

	  k1 = k1.clone();
	  k2 = k2.clone();
	  var d1 = 0;
	  var d2 = 0;
	  while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {

	    // First phase
	    var m14 = (k1.andln(3) + d1) & 3;
	    var m24 = (k2.andln(3) + d2) & 3;
	    if (m14 === 3)
	      m14 = -1;
	    if (m24 === 3)
	      m24 = -1;
	    var u1;
	    if ((m14 & 1) === 0) {
	      u1 = 0;
	    } else {
	      var m8 = (k1.andln(7) + d1) & 7;
	      if ((m8 === 3 || m8 === 5) && m24 === 2)
	        u1 = -m14;
	      else
	        u1 = m14;
	    }
	    jsf[0].push(u1);

	    var u2;
	    if ((m24 & 1) === 0) {
	      u2 = 0;
	    } else {
	      var m8 = (k2.andln(7) + d2) & 7;
	      if ((m8 === 3 || m8 === 5) && m14 === 2)
	        u2 = -m24;
	      else
	        u2 = m24;
	    }
	    jsf[1].push(u2);

	    // Second phase
	    if (2 * d1 === u1 + 1)
	      d1 = 1 - d1;
	    if (2 * d2 === u2 + 1)
	      d2 = 1 - d2;
	    k1.iushrn(1);
	    k2.iushrn(1);
	  }

	  return jsf;
	}
	utils.getJSF = getJSF;

	function cachedProperty(obj, name, computer) {
	  var key = '_' + name;
	  obj.prototype[name] = function cachedProperty() {
	    return this[key] !== undefined ? this[key] :
	           this[key] = computer.call(this);
	  };
	}
	utils.cachedProperty = cachedProperty;

	function parseBytes(bytes) {
	  return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
	                                     bytes;
	}
	utils.parseBytes = parseBytes;

	function intFromLE(bytes) {
	  return new bn$1(bytes, 'hex', 'le');
	}
	utils.intFromLE = intFromLE;
	});

	var brorand = function(length) { var result = new Uint8Array(length); (commonjsGlobal.crypto || commonjsGlobal.msCrypto).getRandomValues(result); return result; };

	'use strict';



	var getNAF = utils_1$1.getNAF;
	var getJSF = utils_1$1.getJSF;
	var assert$1 = utils_1$1.assert;

	function BaseCurve(type, conf) {
	  this.type = type;
	  this.p = new bn$1(conf.p, 16);

	  // Use Montgomery, when there is no fast reduction for the prime
	  this.red = conf.prime ? bn$1.red(conf.prime) : bn$1.mont(this.p);

	  // Useful for many curves
	  this.zero = new bn$1(0).toRed(this.red);
	  this.one = new bn$1(1).toRed(this.red);
	  this.two = new bn$1(2).toRed(this.red);

	  // Curve configuration, optional
	  this.n = conf.n && new bn$1(conf.n, 16);
	  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

	  // Temporary arrays
	  this._wnafT1 = new Array(4);
	  this._wnafT2 = new Array(4);
	  this._wnafT3 = new Array(4);
	  this._wnafT4 = new Array(4);

	  this._bitLength = this.n ? this.n.bitLength() : 0;

	  // Generalized Greg Maxwell's trick
	  var adjustCount = this.n && this.p.div(this.n);
	  if (!adjustCount || adjustCount.cmpn(100) > 0) {
	    this.redN = null;
	  } else {
	    this._maxwellTrick = true;
	    this.redN = this.n.toRed(this.red);
	  }
	}
	var base = BaseCurve;

	BaseCurve.prototype.point = function point() {
	  throw new Error('Not implemented');
	};

	BaseCurve.prototype.validate = function validate() {
	  throw new Error('Not implemented');
	};

	BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
	  assert$1(p.precomputed);
	  var doubles = p._getDoubles();

	  var naf = getNAF(k, 1, this._bitLength);
	  var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
	  I /= 3;

	  // Translate into more windowed form
	  var repr = [];
	  for (var j = 0; j < naf.length; j += doubles.step) {
	    var nafW = 0;
	    for (var k = j + doubles.step - 1; k >= j; k--)
	      nafW = (nafW << 1) + naf[k];
	    repr.push(nafW);
	  }

	  var a = this.jpoint(null, null, null);
	  var b = this.jpoint(null, null, null);
	  for (var i = I; i > 0; i--) {
	    for (var j = 0; j < repr.length; j++) {
	      var nafW = repr[j];
	      if (nafW === i)
	        b = b.mixedAdd(doubles.points[j]);
	      else if (nafW === -i)
	        b = b.mixedAdd(doubles.points[j].neg());
	    }
	    a = a.add(b);
	  }
	  return a.toP();
	};

	BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
	  var w = 4;

	  // Precompute window
	  var nafPoints = p._getNAFPoints(w);
	  w = nafPoints.wnd;
	  var wnd = nafPoints.points;

	  // Get NAF form
	  var naf = getNAF(k, w, this._bitLength);

	  // Add `this`*(N+1) for every w-NAF index
	  var acc = this.jpoint(null, null, null);
	  for (var i = naf.length - 1; i >= 0; i--) {
	    // Count zeroes
	    for (var k = 0; i >= 0 && naf[i] === 0; i--)
	      k++;
	    if (i >= 0)
	      k++;
	    acc = acc.dblp(k);

	    if (i < 0)
	      break;
	    var z = naf[i];
	    assert$1(z !== 0);
	    if (p.type === 'affine') {
	      // J +- P
	      if (z > 0)
	        acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
	      else
	        acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
	    } else {
	      // J +- J
	      if (z > 0)
	        acc = acc.add(wnd[(z - 1) >> 1]);
	      else
	        acc = acc.add(wnd[(-z - 1) >> 1].neg());
	    }
	  }
	  return p.type === 'affine' ? acc.toP() : acc;
	};

	BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
	                                                       points,
	                                                       coeffs,
	                                                       len,
	                                                       jacobianResult) {
	  var wndWidth = this._wnafT1;
	  var wnd = this._wnafT2;
	  var naf = this._wnafT3;

	  // Fill all arrays
	  var max = 0;
	  for (var i = 0; i < len; i++) {
	    var p = points[i];
	    var nafPoints = p._getNAFPoints(defW);
	    wndWidth[i] = nafPoints.wnd;
	    wnd[i] = nafPoints.points;
	  }

	  // Comb small window NAFs
	  for (var i = len - 1; i >= 1; i -= 2) {
	    var a = i - 1;
	    var b = i;
	    if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
	      naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
	      naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
	      max = Math.max(naf[a].length, max);
	      max = Math.max(naf[b].length, max);
	      continue;
	    }

	    var comb = [
	      points[a], /* 1 */
	      null, /* 3 */
	      null, /* 5 */
	      points[b] /* 7 */
	    ];

	    // Try to avoid Projective points, if possible
	    if (points[a].y.cmp(points[b].y) === 0) {
	      comb[1] = points[a].add(points[b]);
	      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
	    } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
	      comb[1] = points[a].toJ().mixedAdd(points[b]);
	      comb[2] = points[a].add(points[b].neg());
	    } else {
	      comb[1] = points[a].toJ().mixedAdd(points[b]);
	      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
	    }

	    var index = [
	      -3, /* -1 -1 */
	      -1, /* -1 0 */
	      -5, /* -1 1 */
	      -7, /* 0 -1 */
	      0, /* 0 0 */
	      7, /* 0 1 */
	      5, /* 1 -1 */
	      1, /* 1 0 */
	      3  /* 1 1 */
	    ];

	    var jsf = getJSF(coeffs[a], coeffs[b]);
	    max = Math.max(jsf[0].length, max);
	    naf[a] = new Array(max);
	    naf[b] = new Array(max);
	    for (var j = 0; j < max; j++) {
	      var ja = jsf[0][j] | 0;
	      var jb = jsf[1][j] | 0;

	      naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
	      naf[b][j] = 0;
	      wnd[a] = comb;
	    }
	  }

	  var acc = this.jpoint(null, null, null);
	  var tmp = this._wnafT4;
	  for (var i = max; i >= 0; i--) {
	    var k = 0;

	    while (i >= 0) {
	      var zero = true;
	      for (var j = 0; j < len; j++) {
	        tmp[j] = naf[j][i] | 0;
	        if (tmp[j] !== 0)
	          zero = false;
	      }
	      if (!zero)
	        break;
	      k++;
	      i--;
	    }
	    if (i >= 0)
	      k++;
	    acc = acc.dblp(k);
	    if (i < 0)
	      break;

	    for (var j = 0; j < len; j++) {
	      var z = tmp[j];
	      var p;
	      if (z === 0)
	        continue;
	      else if (z > 0)
	        p = wnd[j][(z - 1) >> 1];
	      else if (z < 0)
	        p = wnd[j][(-z - 1) >> 1].neg();

	      if (p.type === 'affine')
	        acc = acc.mixedAdd(p);
	      else
	        acc = acc.add(p);
	    }
	  }
	  // Zeroify references
	  for (var i = 0; i < len; i++)
	    wnd[i] = null;

	  if (jacobianResult)
	    return acc;
	  else
	    return acc.toP();
	};

	function BasePoint(curve, type) {
	  this.curve = curve;
	  this.type = type;
	  this.precomputed = null;
	}
	BaseCurve.BasePoint = BasePoint;

	BasePoint.prototype.eq = function eq(/*other*/) {
	  throw new Error('Not implemented');
	};

	BasePoint.prototype.validate = function validate() {
	  return this.curve.validate(this);
	};

	BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
	  bytes = utils_1$1.toArray(bytes, enc);

	  var len = this.p.byteLength();

	  // uncompressed, hybrid-odd, hybrid-even
	  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
	      bytes.length - 1 === 2 * len) {
	    if (bytes[0] === 0x06)
	      assert$1(bytes[bytes.length - 1] % 2 === 0);
	    else if (bytes[0] === 0x07)
	      assert$1(bytes[bytes.length - 1] % 2 === 1);

	    var res =  this.point(bytes.slice(1, 1 + len),
	                          bytes.slice(1 + len, 1 + 2 * len));

	    return res;
	  } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
	              bytes.length - 1 === len) {
	    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
	  }
	  throw new Error('Unknown point format');
	};

	BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
	  return this.encode(enc, true);
	};

	BasePoint.prototype._encode = function _encode(compact) {
	  var len = this.curve.p.byteLength();
	  var x = this.getX().toArray('be', len);

	  if (compact)
	    return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

	  return [ 0x04 ].concat(x, this.getY().toArray('be', len)) ;
	};

	BasePoint.prototype.encode = function encode(enc, compact) {
	  return utils_1$1.encode(this._encode(compact), enc);
	};

	BasePoint.prototype.precompute = function precompute(power) {
	  if (this.precomputed)
	    return this;

	  var precomputed = {
	    doubles: null,
	    naf: null,
	    beta: null
	  };
	  precomputed.naf = this._getNAFPoints(8);
	  precomputed.doubles = this._getDoubles(4, power);
	  precomputed.beta = this._getBeta();
	  this.precomputed = precomputed;

	  return this;
	};

	BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
	  if (!this.precomputed)
	    return false;

	  var doubles = this.precomputed.doubles;
	  if (!doubles)
	    return false;

	  return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
	};

	BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
	  if (this.precomputed && this.precomputed.doubles)
	    return this.precomputed.doubles;

	  var doubles = [ this ];
	  var acc = this;
	  for (var i = 0; i < power; i += step) {
	    for (var j = 0; j < step; j++)
	      acc = acc.dbl();
	    doubles.push(acc);
	  }
	  return {
	    step: step,
	    points: doubles
	  };
	};

	BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
	  if (this.precomputed && this.precomputed.naf)
	    return this.precomputed.naf;

	  var res = [ this ];
	  var max = (1 << wnd) - 1;
	  var dbl = max === 1 ? null : this.dbl();
	  for (var i = 1; i < max; i++)
	    res[i] = res[i - 1].add(dbl);
	  return {
	    wnd: wnd,
	    points: res
	  };
	};

	BasePoint.prototype._getBeta = function _getBeta() {
	  return null;
	};

	BasePoint.prototype.dblp = function dblp(k) {
	  var r = this;
	  for (var i = 0; i < k; i++)
	    r = r.dbl();
	  return r;
	};

	'use strict';






	var assert$2 = utils_1$1.assert;

	function ShortCurve(conf) {
	  base.call(this, 'short', conf);

	  this.a = new bn$1(conf.a, 16).toRed(this.red);
	  this.b = new bn$1(conf.b, 16).toRed(this.red);
	  this.tinv = this.two.redInvm();

	  this.zeroA = this.a.fromRed().cmpn(0) === 0;
	  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

	  // If the curve is endomorphic, precalculate beta and lambda
	  this.endo = this._getEndomorphism(conf);
	  this._endoWnafT1 = new Array(4);
	  this._endoWnafT2 = new Array(4);
	}
	inherits_browser(ShortCurve, base);
	var short_1 = ShortCurve;

	ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
	  // No efficient endomorphism
	  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
	    return;

	  // Compute beta and lambda, that lambda * P = (beta * Px; Py)
	  var beta;
	  var lambda;
	  if (conf.beta) {
	    beta = new bn$1(conf.beta, 16).toRed(this.red);
	  } else {
	    var betas = this._getEndoRoots(this.p);
	    // Choose the smallest beta
	    beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
	    beta = beta.toRed(this.red);
	  }
	  if (conf.lambda) {
	    lambda = new bn$1(conf.lambda, 16);
	  } else {
	    // Choose the lambda that is matching selected beta
	    var lambdas = this._getEndoRoots(this.n);
	    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
	      lambda = lambdas[0];
	    } else {
	      lambda = lambdas[1];
	      assert$2(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
	    }
	  }

	  // Get basis vectors, used for balanced length-two representation
	  var basis;
	  if (conf.basis) {
	    basis = conf.basis.map(function(vec) {
	      return {
	        a: new bn$1(vec.a, 16),
	        b: new bn$1(vec.b, 16)
	      };
	    });
	  } else {
	    basis = this._getEndoBasis(lambda);
	  }

	  return {
	    beta: beta,
	    lambda: lambda,
	    basis: basis
	  };
	};

	ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
	  // Find roots of for x^2 + x + 1 in F
	  // Root = (-1 +- Sqrt(-3)) / 2
	  //
	  var red = num === this.p ? this.red : bn$1.mont(num);
	  var tinv = new bn$1(2).toRed(red).redInvm();
	  var ntinv = tinv.redNeg();

	  var s = new bn$1(3).toRed(red).redNeg().redSqrt().redMul(tinv);

	  var l1 = ntinv.redAdd(s).fromRed();
	  var l2 = ntinv.redSub(s).fromRed();
	  return [ l1, l2 ];
	};

	ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
	  // aprxSqrt >= sqrt(this.n)
	  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

	  // 3.74
	  // Run EGCD, until r(L + 1) < aprxSqrt
	  var u = lambda;
	  var v = this.n.clone();
	  var x1 = new bn$1(1);
	  var y1 = new bn$1(0);
	  var x2 = new bn$1(0);
	  var y2 = new bn$1(1);

	  // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
	  var a0;
	  var b0;
	  // First vector
	  var a1;
	  var b1;
	  // Second vector
	  var a2;
	  var b2;

	  var prevR;
	  var i = 0;
	  var r;
	  var x;
	  while (u.cmpn(0) !== 0) {
	    var q = v.div(u);
	    r = v.sub(q.mul(u));
	    x = x2.sub(q.mul(x1));
	    var y = y2.sub(q.mul(y1));

	    if (!a1 && r.cmp(aprxSqrt) < 0) {
	      a0 = prevR.neg();
	      b0 = x1;
	      a1 = r.neg();
	      b1 = x;
	    } else if (a1 && ++i === 2) {
	      break;
	    }
	    prevR = r;

	    v = u;
	    u = r;
	    x2 = x1;
	    x1 = x;
	    y2 = y1;
	    y1 = y;
	  }
	  a2 = r.neg();
	  b2 = x;

	  var len1 = a1.sqr().add(b1.sqr());
	  var len2 = a2.sqr().add(b2.sqr());
	  if (len2.cmp(len1) >= 0) {
	    a2 = a0;
	    b2 = b0;
	  }

	  // Normalize signs
	  if (a1.negative) {
	    a1 = a1.neg();
	    b1 = b1.neg();
	  }
	  if (a2.negative) {
	    a2 = a2.neg();
	    b2 = b2.neg();
	  }

	  return [
	    { a: a1, b: b1 },
	    { a: a2, b: b2 }
	  ];
	};

	ShortCurve.prototype._endoSplit = function _endoSplit(k) {
	  var basis = this.endo.basis;
	  var v1 = basis[0];
	  var v2 = basis[1];

	  var c1 = v2.b.mul(k).divRound(this.n);
	  var c2 = v1.b.neg().mul(k).divRound(this.n);

	  var p1 = c1.mul(v1.a);
	  var p2 = c2.mul(v2.a);
	  var q1 = c1.mul(v1.b);
	  var q2 = c2.mul(v2.b);

	  // Calculate answer
	  var k1 = k.sub(p1).sub(p2);
	  var k2 = q1.add(q2).neg();
	  return { k1: k1, k2: k2 };
	};

	ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
	  x = new bn$1(x, 16);
	  if (!x.red)
	    x = x.toRed(this.red);

	  var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
	  var y = y2.redSqrt();
	  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
	    throw new Error('invalid point');

	  // XXX Is there any way to tell if the number is odd without converting it
	  // to non-red form?
	  var isOdd = y.fromRed().isOdd();
	  if (odd && !isOdd || !odd && isOdd)
	    y = y.redNeg();

	  return this.point(x, y);
	};

	ShortCurve.prototype.validate = function validate(point) {
	  if (point.inf)
	    return true;

	  var x = point.x;
	  var y = point.y;

	  var ax = this.a.redMul(x);
	  var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
	  return y.redSqr().redISub(rhs).cmpn(0) === 0;
	};

	ShortCurve.prototype._endoWnafMulAdd =
	    function _endoWnafMulAdd(points, coeffs, jacobianResult) {
	  var npoints = this._endoWnafT1;
	  var ncoeffs = this._endoWnafT2;
	  for (var i = 0; i < points.length; i++) {
	    var split = this._endoSplit(coeffs[i]);
	    var p = points[i];
	    var beta = p._getBeta();

	    if (split.k1.negative) {
	      split.k1.ineg();
	      p = p.neg(true);
	    }
	    if (split.k2.negative) {
	      split.k2.ineg();
	      beta = beta.neg(true);
	    }

	    npoints[i * 2] = p;
	    npoints[i * 2 + 1] = beta;
	    ncoeffs[i * 2] = split.k1;
	    ncoeffs[i * 2 + 1] = split.k2;
	  }
	  var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

	  // Clean-up references to points and coefficients
	  for (var j = 0; j < i * 2; j++) {
	    npoints[j] = null;
	    ncoeffs[j] = null;
	  }
	  return res;
	};

	function Point(curve, x, y, isRed) {
	  base.BasePoint.call(this, curve, 'affine');
	  if (x === null && y === null) {
	    this.x = null;
	    this.y = null;
	    this.inf = true;
	  } else {
	    this.x = new bn$1(x, 16);
	    this.y = new bn$1(y, 16);
	    // Force redgomery representation when loading from JSON
	    if (isRed) {
	      this.x.forceRed(this.curve.red);
	      this.y.forceRed(this.curve.red);
	    }
	    if (!this.x.red)
	      this.x = this.x.toRed(this.curve.red);
	    if (!this.y.red)
	      this.y = this.y.toRed(this.curve.red);
	    this.inf = false;
	  }
	}
	inherits_browser(Point, base.BasePoint);

	ShortCurve.prototype.point = function point(x, y, isRed) {
	  return new Point(this, x, y, isRed);
	};

	ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
	  return Point.fromJSON(this, obj, red);
	};

	Point.prototype._getBeta = function _getBeta() {
	  if (!this.curve.endo)
	    return;

	  var pre = this.precomputed;
	  if (pre && pre.beta)
	    return pre.beta;

	  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
	  if (pre) {
	    var curve = this.curve;
	    var endoMul = function(p) {
	      return curve.point(p.x.redMul(curve.endo.beta), p.y);
	    };
	    pre.beta = beta;
	    beta.precomputed = {
	      beta: null,
	      naf: pre.naf && {
	        wnd: pre.naf.wnd,
	        points: pre.naf.points.map(endoMul)
	      },
	      doubles: pre.doubles && {
	        step: pre.doubles.step,
	        points: pre.doubles.points.map(endoMul)
	      }
	    };
	  }
	  return beta;
	};

	Point.prototype.toJSON = function toJSON() {
	  if (!this.precomputed)
	    return [ this.x, this.y ];

	  return [ this.x, this.y, this.precomputed && {
	    doubles: this.precomputed.doubles && {
	      step: this.precomputed.doubles.step,
	      points: this.precomputed.doubles.points.slice(1)
	    },
	    naf: this.precomputed.naf && {
	      wnd: this.precomputed.naf.wnd,
	      points: this.precomputed.naf.points.slice(1)
	    }
	  } ];
	};

	Point.fromJSON = function fromJSON(curve, obj, red) {
	  if (typeof obj === 'string')
	    obj = JSON.parse(obj);
	  var res = curve.point(obj[0], obj[1], red);
	  if (!obj[2])
	    return res;

	  function obj2point(obj) {
	    return curve.point(obj[0], obj[1], red);
	  }

	  var pre = obj[2];
	  res.precomputed = {
	    beta: null,
	    doubles: pre.doubles && {
	      step: pre.doubles.step,
	      points: [ res ].concat(pre.doubles.points.map(obj2point))
	    },
	    naf: pre.naf && {
	      wnd: pre.naf.wnd,
	      points: [ res ].concat(pre.naf.points.map(obj2point))
	    }
	  };
	  return res;
	};

	Point.prototype.inspect = function inspect() {
	  if (this.isInfinity())
	    return '<EC Point Infinity>';
	  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
	      ' y: ' + this.y.fromRed().toString(16, 2) + '>';
	};

	Point.prototype.isInfinity = function isInfinity() {
	  return this.inf;
	};

	Point.prototype.add = function add(p) {
	  // O + P = P
	  if (this.inf)
	    return p;

	  // P + O = P
	  if (p.inf)
	    return this;

	  // P + P = 2P
	  if (this.eq(p))
	    return this.dbl();

	  // P + (-P) = O
	  if (this.neg().eq(p))
	    return this.curve.point(null, null);

	  // P + Q = O
	  if (this.x.cmp(p.x) === 0)
	    return this.curve.point(null, null);

	  var c = this.y.redSub(p.y);
	  if (c.cmpn(0) !== 0)
	    c = c.redMul(this.x.redSub(p.x).redInvm());
	  var nx = c.redSqr().redISub(this.x).redISub(p.x);
	  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
	  return this.curve.point(nx, ny);
	};

	Point.prototype.dbl = function dbl() {
	  if (this.inf)
	    return this;

	  // 2P = O
	  var ys1 = this.y.redAdd(this.y);
	  if (ys1.cmpn(0) === 0)
	    return this.curve.point(null, null);

	  var a = this.curve.a;

	  var x2 = this.x.redSqr();
	  var dyinv = ys1.redInvm();
	  var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

	  var nx = c.redSqr().redISub(this.x.redAdd(this.x));
	  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
	  return this.curve.point(nx, ny);
	};

	Point.prototype.getX = function getX() {
	  return this.x.fromRed();
	};

	Point.prototype.getY = function getY() {
	  return this.y.fromRed();
	};

	Point.prototype.mul = function mul(k) {
	  k = new bn$1(k, 16);
	  if (this.isInfinity())
	    return this;
	  else if (this._hasDoubles(k))
	    return this.curve._fixedNafMul(this, k);
	  else if (this.curve.endo)
	    return this.curve._endoWnafMulAdd([ this ], [ k ]);
	  else
	    return this.curve._wnafMul(this, k);
	};

	Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
	  var points = [ this, p2 ];
	  var coeffs = [ k1, k2 ];
	  if (this.curve.endo)
	    return this.curve._endoWnafMulAdd(points, coeffs);
	  else
	    return this.curve._wnafMulAdd(1, points, coeffs, 2);
	};

	Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
	  var points = [ this, p2 ];
	  var coeffs = [ k1, k2 ];
	  if (this.curve.endo)
	    return this.curve._endoWnafMulAdd(points, coeffs, true);
	  else
	    return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
	};

	Point.prototype.eq = function eq(p) {
	  return this === p ||
	         this.inf === p.inf &&
	             (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
	};

	Point.prototype.neg = function neg(_precompute) {
	  if (this.inf)
	    return this;

	  var res = this.curve.point(this.x, this.y.redNeg());
	  if (_precompute && this.precomputed) {
	    var pre = this.precomputed;
	    var negate = function(p) {
	      return p.neg();
	    };
	    res.precomputed = {
	      naf: pre.naf && {
	        wnd: pre.naf.wnd,
	        points: pre.naf.points.map(negate)
	      },
	      doubles: pre.doubles && {
	        step: pre.doubles.step,
	        points: pre.doubles.points.map(negate)
	      }
	    };
	  }
	  return res;
	};

	Point.prototype.toJ = function toJ() {
	  if (this.inf)
	    return this.curve.jpoint(null, null, null);

	  var res = this.curve.jpoint(this.x, this.y, this.curve.one);
	  return res;
	};

	function JPoint(curve, x, y, z) {
	  base.BasePoint.call(this, curve, 'jacobian');
	  if (x === null && y === null && z === null) {
	    this.x = this.curve.one;
	    this.y = this.curve.one;
	    this.z = new bn$1(0);
	  } else {
	    this.x = new bn$1(x, 16);
	    this.y = new bn$1(y, 16);
	    this.z = new bn$1(z, 16);
	  }
	  if (!this.x.red)
	    this.x = this.x.toRed(this.curve.red);
	  if (!this.y.red)
	    this.y = this.y.toRed(this.curve.red);
	  if (!this.z.red)
	    this.z = this.z.toRed(this.curve.red);

	  this.zOne = this.z === this.curve.one;
	}
	inherits_browser(JPoint, base.BasePoint);

	ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
	  return new JPoint(this, x, y, z);
	};

	JPoint.prototype.toP = function toP() {
	  if (this.isInfinity())
	    return this.curve.point(null, null);

	  var zinv = this.z.redInvm();
	  var zinv2 = zinv.redSqr();
	  var ax = this.x.redMul(zinv2);
	  var ay = this.y.redMul(zinv2).redMul(zinv);

	  return this.curve.point(ax, ay);
	};

	JPoint.prototype.neg = function neg() {
	  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
	};

	JPoint.prototype.add = function add(p) {
	  // O + P = P
	  if (this.isInfinity())
	    return p;

	  // P + O = P
	  if (p.isInfinity())
	    return this;

	  // 12M + 4S + 7A
	  var pz2 = p.z.redSqr();
	  var z2 = this.z.redSqr();
	  var u1 = this.x.redMul(pz2);
	  var u2 = p.x.redMul(z2);
	  var s1 = this.y.redMul(pz2.redMul(p.z));
	  var s2 = p.y.redMul(z2.redMul(this.z));

	  var h = u1.redSub(u2);
	  var r = s1.redSub(s2);
	  if (h.cmpn(0) === 0) {
	    if (r.cmpn(0) !== 0)
	      return this.curve.jpoint(null, null, null);
	    else
	      return this.dbl();
	  }

	  var h2 = h.redSqr();
	  var h3 = h2.redMul(h);
	  var v = u1.redMul(h2);

	  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
	  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
	  var nz = this.z.redMul(p.z).redMul(h);

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype.mixedAdd = function mixedAdd(p) {
	  // O + P = P
	  if (this.isInfinity())
	    return p.toJ();

	  // P + O = P
	  if (p.isInfinity())
	    return this;

	  // 8M + 3S + 7A
	  var z2 = this.z.redSqr();
	  var u1 = this.x;
	  var u2 = p.x.redMul(z2);
	  var s1 = this.y;
	  var s2 = p.y.redMul(z2).redMul(this.z);

	  var h = u1.redSub(u2);
	  var r = s1.redSub(s2);
	  if (h.cmpn(0) === 0) {
	    if (r.cmpn(0) !== 0)
	      return this.curve.jpoint(null, null, null);
	    else
	      return this.dbl();
	  }

	  var h2 = h.redSqr();
	  var h3 = h2.redMul(h);
	  var v = u1.redMul(h2);

	  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
	  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
	  var nz = this.z.redMul(h);

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype.dblp = function dblp(pow) {
	  if (pow === 0)
	    return this;
	  if (this.isInfinity())
	    return this;
	  if (!pow)
	    return this.dbl();

	  if (this.curve.zeroA || this.curve.threeA) {
	    var r = this;
	    for (var i = 0; i < pow; i++)
	      r = r.dbl();
	    return r;
	  }

	  // 1M + 2S + 1A + N * (4S + 5M + 8A)
	  // N = 1 => 6M + 6S + 9A
	  var a = this.curve.a;
	  var tinv = this.curve.tinv;

	  var jx = this.x;
	  var jy = this.y;
	  var jz = this.z;
	  var jz4 = jz.redSqr().redSqr();

	  // Reuse results
	  var jyd = jy.redAdd(jy);
	  for (var i = 0; i < pow; i++) {
	    var jx2 = jx.redSqr();
	    var jyd2 = jyd.redSqr();
	    var jyd4 = jyd2.redSqr();
	    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

	    var t1 = jx.redMul(jyd2);
	    var nx = c.redSqr().redISub(t1.redAdd(t1));
	    var t2 = t1.redISub(nx);
	    var dny = c.redMul(t2);
	    dny = dny.redIAdd(dny).redISub(jyd4);
	    var nz = jyd.redMul(jz);
	    if (i + 1 < pow)
	      jz4 = jz4.redMul(jyd4);

	    jx = nx;
	    jz = nz;
	    jyd = dny;
	  }

	  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
	};

	JPoint.prototype.dbl = function dbl() {
	  if (this.isInfinity())
	    return this;

	  if (this.curve.zeroA)
	    return this._zeroDbl();
	  else if (this.curve.threeA)
	    return this._threeDbl();
	  else
	    return this._dbl();
	};

	JPoint.prototype._zeroDbl = function _zeroDbl() {
	  var nx;
	  var ny;
	  var nz;
	  // Z = 1
	  if (this.zOne) {
	    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
	    //     #doubling-mdbl-2007-bl
	    // 1M + 5S + 14A

	    // XX = X1^2
	    var xx = this.x.redSqr();
	    // YY = Y1^2
	    var yy = this.y.redSqr();
	    // YYYY = YY^2
	    var yyyy = yy.redSqr();
	    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
	    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
	    s = s.redIAdd(s);
	    // M = 3 * XX + a; a = 0
	    var m = xx.redAdd(xx).redIAdd(xx);
	    // T = M ^ 2 - 2*S
	    var t = m.redSqr().redISub(s).redISub(s);

	    // 8 * YYYY
	    var yyyy8 = yyyy.redIAdd(yyyy);
	    yyyy8 = yyyy8.redIAdd(yyyy8);
	    yyyy8 = yyyy8.redIAdd(yyyy8);

	    // X3 = T
	    nx = t;
	    // Y3 = M * (S - T) - 8 * YYYY
	    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
	    // Z3 = 2*Y1
	    nz = this.y.redAdd(this.y);
	  } else {
	    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
	    //     #doubling-dbl-2009-l
	    // 2M + 5S + 13A

	    // A = X1^2
	    var a = this.x.redSqr();
	    // B = Y1^2
	    var b = this.y.redSqr();
	    // C = B^2
	    var c = b.redSqr();
	    // D = 2 * ((X1 + B)^2 - A - C)
	    var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
	    d = d.redIAdd(d);
	    // E = 3 * A
	    var e = a.redAdd(a).redIAdd(a);
	    // F = E^2
	    var f = e.redSqr();

	    // 8 * C
	    var c8 = c.redIAdd(c);
	    c8 = c8.redIAdd(c8);
	    c8 = c8.redIAdd(c8);

	    // X3 = F - 2 * D
	    nx = f.redISub(d).redISub(d);
	    // Y3 = E * (D - X3) - 8 * C
	    ny = e.redMul(d.redISub(nx)).redISub(c8);
	    // Z3 = 2 * Y1 * Z1
	    nz = this.y.redMul(this.z);
	    nz = nz.redIAdd(nz);
	  }

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype._threeDbl = function _threeDbl() {
	  var nx;
	  var ny;
	  var nz;
	  // Z = 1
	  if (this.zOne) {
	    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
	    //     #doubling-mdbl-2007-bl
	    // 1M + 5S + 15A

	    // XX = X1^2
	    var xx = this.x.redSqr();
	    // YY = Y1^2
	    var yy = this.y.redSqr();
	    // YYYY = YY^2
	    var yyyy = yy.redSqr();
	    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
	    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
	    s = s.redIAdd(s);
	    // M = 3 * XX + a
	    var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
	    // T = M^2 - 2 * S
	    var t = m.redSqr().redISub(s).redISub(s);
	    // X3 = T
	    nx = t;
	    // Y3 = M * (S - T) - 8 * YYYY
	    var yyyy8 = yyyy.redIAdd(yyyy);
	    yyyy8 = yyyy8.redIAdd(yyyy8);
	    yyyy8 = yyyy8.redIAdd(yyyy8);
	    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
	    // Z3 = 2 * Y1
	    nz = this.y.redAdd(this.y);
	  } else {
	    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
	    // 3M + 5S

	    // delta = Z1^2
	    var delta = this.z.redSqr();
	    // gamma = Y1^2
	    var gamma = this.y.redSqr();
	    // beta = X1 * gamma
	    var beta = this.x.redMul(gamma);
	    // alpha = 3 * (X1 - delta) * (X1 + delta)
	    var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
	    alpha = alpha.redAdd(alpha).redIAdd(alpha);
	    // X3 = alpha^2 - 8 * beta
	    var beta4 = beta.redIAdd(beta);
	    beta4 = beta4.redIAdd(beta4);
	    var beta8 = beta4.redAdd(beta4);
	    nx = alpha.redSqr().redISub(beta8);
	    // Z3 = (Y1 + Z1)^2 - gamma - delta
	    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
	    // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
	    var ggamma8 = gamma.redSqr();
	    ggamma8 = ggamma8.redIAdd(ggamma8);
	    ggamma8 = ggamma8.redIAdd(ggamma8);
	    ggamma8 = ggamma8.redIAdd(ggamma8);
	    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
	  }

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype._dbl = function _dbl() {
	  var a = this.curve.a;

	  // 4M + 6S + 10A
	  var jx = this.x;
	  var jy = this.y;
	  var jz = this.z;
	  var jz4 = jz.redSqr().redSqr();

	  var jx2 = jx.redSqr();
	  var jy2 = jy.redSqr();

	  var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

	  var jxd4 = jx.redAdd(jx);
	  jxd4 = jxd4.redIAdd(jxd4);
	  var t1 = jxd4.redMul(jy2);
	  var nx = c.redSqr().redISub(t1.redAdd(t1));
	  var t2 = t1.redISub(nx);

	  var jyd8 = jy2.redSqr();
	  jyd8 = jyd8.redIAdd(jyd8);
	  jyd8 = jyd8.redIAdd(jyd8);
	  jyd8 = jyd8.redIAdd(jyd8);
	  var ny = c.redMul(t2).redISub(jyd8);
	  var nz = jy.redAdd(jy).redMul(jz);

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype.trpl = function trpl() {
	  if (!this.curve.zeroA)
	    return this.dbl().add(this);

	  // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
	  // 5M + 10S + ...

	  // XX = X1^2
	  var xx = this.x.redSqr();
	  // YY = Y1^2
	  var yy = this.y.redSqr();
	  // ZZ = Z1^2
	  var zz = this.z.redSqr();
	  // YYYY = YY^2
	  var yyyy = yy.redSqr();
	  // M = 3 * XX + a * ZZ2; a = 0
	  var m = xx.redAdd(xx).redIAdd(xx);
	  // MM = M^2
	  var mm = m.redSqr();
	  // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
	  var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
	  e = e.redIAdd(e);
	  e = e.redAdd(e).redIAdd(e);
	  e = e.redISub(mm);
	  // EE = E^2
	  var ee = e.redSqr();
	  // T = 16*YYYY
	  var t = yyyy.redIAdd(yyyy);
	  t = t.redIAdd(t);
	  t = t.redIAdd(t);
	  t = t.redIAdd(t);
	  // U = (M + E)^2 - MM - EE - T
	  var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
	  // X3 = 4 * (X1 * EE - 4 * YY * U)
	  var yyu4 = yy.redMul(u);
	  yyu4 = yyu4.redIAdd(yyu4);
	  yyu4 = yyu4.redIAdd(yyu4);
	  var nx = this.x.redMul(ee).redISub(yyu4);
	  nx = nx.redIAdd(nx);
	  nx = nx.redIAdd(nx);
	  // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
	  var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
	  ny = ny.redIAdd(ny);
	  ny = ny.redIAdd(ny);
	  ny = ny.redIAdd(ny);
	  // Z3 = (Z1 + E)^2 - ZZ - EE
	  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype.mul = function mul(k, kbase) {
	  k = new bn$1(k, kbase);

	  return this.curve._wnafMul(this, k);
	};

	JPoint.prototype.eq = function eq(p) {
	  if (p.type === 'affine')
	    return this.eq(p.toJ());

	  if (this === p)
	    return true;

	  // x1 * z2^2 == x2 * z1^2
	  var z2 = this.z.redSqr();
	  var pz2 = p.z.redSqr();
	  if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
	    return false;

	  // y1 * z2^3 == y2 * z1^3
	  var z3 = z2.redMul(this.z);
	  var pz3 = pz2.redMul(p.z);
	  return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
	};

	JPoint.prototype.eqXToP = function eqXToP(x) {
	  var zs = this.z.redSqr();
	  var rx = x.toRed(this.curve.red).redMul(zs);
	  if (this.x.cmp(rx) === 0)
	    return true;

	  var xc = x.clone();
	  var t = this.curve.redN.redMul(zs);
	  for (;;) {
	    xc.iadd(this.curve.n);
	    if (xc.cmp(this.curve.p) >= 0)
	      return false;

	    rx.redIAdd(t);
	    if (this.x.cmp(rx) === 0)
	      return true;
	  }
	};

	JPoint.prototype.inspect = function inspect() {
	  if (this.isInfinity())
	    return '<EC JPoint Infinity>';
	  return '<EC JPoint x: ' + this.x.toString(16, 2) +
	      ' y: ' + this.y.toString(16, 2) +
	      ' z: ' + this.z.toString(16, 2) + '>';
	};

	JPoint.prototype.isInfinity = function isInfinity() {
	  // XXX This code assumes that zero is always zero in red
	  return this.z.cmpn(0) === 0;
	};

	var mont = {};

	var edwards = {};

	var curve_1 = createCommonjsModule(function (module, exports) {
	'use strict';

	var curve = exports;

	curve.base = base;
	curve.short = short_1;
	curve.mont = mont;
	curve.edwards = edwards;
	});

	var secp256k1 = undefined;

	var curves_1 = createCommonjsModule(function (module, exports) {
	'use strict';

	var curves = exports;





	var assert = utils_1$1.assert;

	function PresetCurve(options) {
	  if (options.type === 'short')
	    this.curve = new curve_1.short(options);
	  else if (options.type === 'edwards')
	    this.curve = new curve_1.edwards(options);
	  else
	    this.curve = new curve_1.mont(options);
	  this.g = this.curve.g;
	  this.n = this.curve.n;
	  this.hash = options.hash;

	  assert(this.g.validate(), 'Invalid curve');
	  assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
	}
	curves.PresetCurve = PresetCurve;

	function defineCurve(name, options) {
	  Object.defineProperty(curves, name, {
	    configurable: true,
	    enumerable: true,
	    get: function() {
	      var curve = new PresetCurve(options);
	      Object.defineProperty(curves, name, {
	        configurable: true,
	        enumerable: true,
	        value: curve
	      });
	      return curve;
	    }
	  });
	}

	defineCurve('p192', {
	  type: 'short',
	  prime: 'p192',
	  p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
	  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
	  b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
	  n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
	    '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811'
	  ]
	});

	defineCurve('p224', {
	  type: 'short',
	  prime: 'p224',
	  p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
	  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
	  b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
	  n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
	    'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34'
	  ]
	});

	defineCurve('p256', {
	  type: 'short',
	  prime: null,
	  p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
	  a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
	  b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
	  n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
	    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5'
	  ]
	});

	defineCurve('p384', {
	  type: 'short',
	  prime: null,
	  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'fffffffe ffffffff 00000000 00000000 ffffffff',
	  a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'fffffffe ffffffff 00000000 00000000 fffffffc',
	  b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' +
	     '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
	  n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' +
	     'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
	  hash: hash_1.sha384,
	  gRed: false,
	  g: [
	    'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' +
	    '5502f25d bf55296c 3a545e38 72760ab7',
	    '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' +
	    '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f'
	  ]
	});

	defineCurve('p521', {
	  type: 'short',
	  prime: null,
	  p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff ffffffff ffffffff ffffffff',
	  a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff ffffffff ffffffff fffffffc',
	  b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' +
	     '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' +
	     '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
	  n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' +
	     'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
	  hash: hash_1.sha512,
	  gRed: false,
	  g: [
	    '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' +
	    '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' +
	    'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
	    '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' +
	    '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' +
	    '3fad0761 353c7086 a272c240 88be9476 9fd16650'
	  ]
	});

	defineCurve('curve25519', {
	  type: 'mont',
	  prime: 'p25519',
	  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
	  a: '76d06',
	  b: '1',
	  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    '9'
	  ]
	});

	defineCurve('ed25519', {
	  type: 'edwards',
	  prime: 'p25519',
	  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
	  a: '-1',
	  c: '1',
	  // -121665 * (121666^(-1)) (mod P)
	  d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
	  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

	    // 4/5
	    '6666666666666666666666666666666666666666666666666666666666666658'
	  ]
	});

	var pre;
	try {
	  pre = secp256k1;
	} catch (e) {
	  pre = undefined;
	}

	defineCurve('secp256k1', {
	  type: 'short',
	  prime: 'k256',
	  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
	  a: '0',
	  b: '7',
	  n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
	  h: '1',
	  hash: hash_1.sha256,

	  // Precomputed endomorphism
	  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
	  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
	  basis: [
	    {
	      a: '3086d221a7d46bcde86c90e49284eb15',
	      b: '-e4437ed6010e88286f547fa90abfe4c3'
	    },
	    {
	      a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
	      b: '3086d221a7d46bcde86c90e49284eb15'
	    }
	  ],

	  gRed: false,
	  g: [
	    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
	    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
	    pre
	  ]
	});
	});

	'use strict';





	function HmacDRBG(options) {
	  if (!(this instanceof HmacDRBG))
	    return new HmacDRBG(options);
	  this.hash = options.hash;
	  this.predResist = !!options.predResist;

	  this.outLen = this.hash.outSize;
	  this.minEntropy = options.minEntropy || this.hash.hmacStrength;

	  this._reseed = null;
	  this.reseedInterval = null;
	  this.K = null;
	  this.V = null;

	  var entropy = utils_1.toArray(options.entropy, options.entropyEnc || 'hex');
	  var nonce = utils_1.toArray(options.nonce, options.nonceEnc || 'hex');
	  var pers = utils_1.toArray(options.pers, options.persEnc || 'hex');
	  minimalisticAssert(entropy.length >= (this.minEntropy / 8),
	         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
	  this._init(entropy, nonce, pers);
	}
	var hmacDrbg = HmacDRBG;

	HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
	  var seed = entropy.concat(nonce).concat(pers);

	  this.K = new Array(this.outLen / 8);
	  this.V = new Array(this.outLen / 8);
	  for (var i = 0; i < this.V.length; i++) {
	    this.K[i] = 0x00;
	    this.V[i] = 0x01;
	  }

	  this._update(seed);
	  this._reseed = 1;
	  this.reseedInterval = 0x1000000000000;  // 2^48
	};

	HmacDRBG.prototype._hmac = function hmac() {
	  return new hash_1.hmac(this.hash, this.K);
	};

	HmacDRBG.prototype._update = function update(seed) {
	  var kmac = this._hmac()
	                 .update(this.V)
	                 .update([ 0x00 ]);
	  if (seed)
	    kmac = kmac.update(seed);
	  this.K = kmac.digest();
	  this.V = this._hmac().update(this.V).digest();
	  if (!seed)
	    return;

	  this.K = this._hmac()
	               .update(this.V)
	               .update([ 0x01 ])
	               .update(seed)
	               .digest();
	  this.V = this._hmac().update(this.V).digest();
	};

	HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
	  // Optional entropy enc
	  if (typeof entropyEnc !== 'string') {
	    addEnc = add;
	    add = entropyEnc;
	    entropyEnc = null;
	  }

	  entropy = utils_1.toArray(entropy, entropyEnc);
	  add = utils_1.toArray(add, addEnc);

	  minimalisticAssert(entropy.length >= (this.minEntropy / 8),
	         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

	  this._update(entropy.concat(add || []));
	  this._reseed = 1;
	};

	HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
	  if (this._reseed > this.reseedInterval)
	    throw new Error('Reseed is required');

	  // Optional encoding
	  if (typeof enc !== 'string') {
	    addEnc = add;
	    add = enc;
	    enc = null;
	  }

	  // Optional additional data
	  if (add) {
	    add = utils_1.toArray(add, addEnc || 'hex');
	    this._update(add);
	  }

	  var temp = [];
	  while (temp.length < len) {
	    this.V = this._hmac().update(this.V).digest();
	    temp = temp.concat(this.V);
	  }

	  var res = temp.slice(0, len);
	  this._update(add);
	  this._reseed++;
	  return utils_1.encode(res, enc);
	};

	'use strict';



	var assert$3 = utils_1$1.assert;

	function KeyPair(ec, options) {
	  this.ec = ec;
	  this.priv = null;
	  this.pub = null;

	  // KeyPair(ec, { priv: ..., pub: ... })
	  if (options.priv)
	    this._importPrivate(options.priv, options.privEnc);
	  if (options.pub)
	    this._importPublic(options.pub, options.pubEnc);
	}
	var key = KeyPair;

	KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
	  if (pub instanceof KeyPair)
	    return pub;

	  return new KeyPair(ec, {
	    pub: pub,
	    pubEnc: enc
	  });
	};

	KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
	  if (priv instanceof KeyPair)
	    return priv;

	  return new KeyPair(ec, {
	    priv: priv,
	    privEnc: enc
	  });
	};

	KeyPair.prototype.validate = function validate() {
	  var pub = this.getPublic();

	  if (pub.isInfinity())
	    return { result: false, reason: 'Invalid public key' };
	  if (!pub.validate())
	    return { result: false, reason: 'Public key is not a point' };
	  if (!pub.mul(this.ec.curve.n).isInfinity())
	    return { result: false, reason: 'Public key * N != O' };

	  return { result: true, reason: null };
	};

	KeyPair.prototype.getPublic = function getPublic(compact, enc) {
	  // compact is optional argument
	  if (typeof compact === 'string') {
	    enc = compact;
	    compact = null;
	  }

	  if (!this.pub)
	    this.pub = this.ec.g.mul(this.priv);

	  if (!enc)
	    return this.pub;

	  return this.pub.encode(enc, compact);
	};

	KeyPair.prototype.getPrivate = function getPrivate(enc) {
	  if (enc === 'hex')
	    return this.priv.toString(16, 2);
	  else
	    return this.priv;
	};

	KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
	  this.priv = new bn$1(key, enc || 16);

	  // Ensure that the priv won't be bigger than n, otherwise we may fail
	  // in fixed multiplication method
	  this.priv = this.priv.umod(this.ec.curve.n);
	};

	KeyPair.prototype._importPublic = function _importPublic(key, enc) {
	  if (key.x || key.y) {
	    // Montgomery points only have an `x` coordinate.
	    // Weierstrass/Edwards points on the other hand have both `x` and
	    // `y` coordinates.
	    if (this.ec.curve.type === 'mont') {
	      assert$3(key.x, 'Need x coordinate');
	    } else if (this.ec.curve.type === 'short' ||
	               this.ec.curve.type === 'edwards') {
	      assert$3(key.x && key.y, 'Need both x and y coordinate');
	    }
	    this.pub = this.ec.curve.point(key.x, key.y);
	    return;
	  }
	  this.pub = this.ec.curve.decodePoint(key, enc);
	};

	// ECDH
	KeyPair.prototype.derive = function derive(pub) {
	  return pub.mul(this.priv).getX();
	};

	// ECDSA
	KeyPair.prototype.sign = function sign(msg, enc, options) {
	  return this.ec.sign(msg, this, enc, options);
	};

	KeyPair.prototype.verify = function verify(msg, signature) {
	  return this.ec.verify(msg, signature, this);
	};

	KeyPair.prototype.inspect = function inspect() {
	  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
	         ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
	};

	'use strict';




	var assert$4 = utils_1$1.assert;

	function Signature(options, enc) {
	  if (options instanceof Signature)
	    return options;

	  if (this._importDER(options, enc))
	    return;

	  assert$4(options.r && options.s, 'Signature without r or s');
	  this.r = new bn$1(options.r, 16);
	  this.s = new bn$1(options.s, 16);
	  if (options.recoveryParam === undefined)
	    this.recoveryParam = null;
	  else
	    this.recoveryParam = options.recoveryParam;
	}
	var signature = Signature;

	function Position() {
	  this.place = 0;
	}

	function getLength(buf, p) {
	  var initial = buf[p.place++];
	  if (!(initial & 0x80)) {
	    return initial;
	  }
	  var octetLen = initial & 0xf;

	  // Indefinite length or overflow
	  if (octetLen === 0 || octetLen > 4) {
	    return false;
	  }

	  var val = 0;
	  for (var i = 0, off = p.place; i < octetLen; i++, off++) {
	    val <<= 8;
	    val |= buf[off];
	    val >>>= 0;
	  }

	  // Leading zeroes
	  if (val <= 0x7f) {
	    return false;
	  }

	  p.place = off;
	  return val;
	}

	function rmPadding(buf) {
	  var i = 0;
	  var len = buf.length - 1;
	  while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
	    i++;
	  }
	  if (i === 0) {
	    return buf;
	  }
	  return buf.slice(i);
	}

	Signature.prototype._importDER = function _importDER(data, enc) {
	  data = utils_1$1.toArray(data, enc);
	  var p = new Position();
	  if (data[p.place++] !== 0x30) {
	    return false;
	  }
	  var len = getLength(data, p);
	  if (len === false) {
	    return false;
	  }
	  if ((len + p.place) !== data.length) {
	    return false;
	  }
	  if (data[p.place++] !== 0x02) {
	    return false;
	  }
	  var rlen = getLength(data, p);
	  if (rlen === false) {
	    return false;
	  }
	  var r = data.slice(p.place, rlen + p.place);
	  p.place += rlen;
	  if (data[p.place++] !== 0x02) {
	    return false;
	  }
	  var slen = getLength(data, p);
	  if (slen === false) {
	    return false;
	  }
	  if (data.length !== slen + p.place) {
	    return false;
	  }
	  var s = data.slice(p.place, slen + p.place);
	  if (r[0] === 0) {
	    if (r[1] & 0x80) {
	      r = r.slice(1);
	    } else {
	      // Leading zeroes
	      return false;
	    }
	  }
	  if (s[0] === 0) {
	    if (s[1] & 0x80) {
	      s = s.slice(1);
	    } else {
	      // Leading zeroes
	      return false;
	    }
	  }

	  this.r = new bn$1(r);
	  this.s = new bn$1(s);
	  this.recoveryParam = null;

	  return true;
	};

	function constructLength(arr, len) {
	  if (len < 0x80) {
	    arr.push(len);
	    return;
	  }
	  var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
	  arr.push(octets | 0x80);
	  while (--octets) {
	    arr.push((len >>> (octets << 3)) & 0xff);
	  }
	  arr.push(len);
	}

	Signature.prototype.toDER = function toDER(enc) {
	  var r = this.r.toArray();
	  var s = this.s.toArray();

	  // Pad values
	  if (r[0] & 0x80)
	    r = [ 0 ].concat(r);
	  // Pad values
	  if (s[0] & 0x80)
	    s = [ 0 ].concat(s);

	  r = rmPadding(r);
	  s = rmPadding(s);

	  while (!s[0] && !(s[1] & 0x80)) {
	    s = s.slice(1);
	  }
	  var arr = [ 0x02 ];
	  constructLength(arr, r.length);
	  arr = arr.concat(r);
	  arr.push(0x02);
	  constructLength(arr, s.length);
	  var backHalf = arr.concat(s);
	  var res = [ 0x30 ];
	  constructLength(res, backHalf.length);
	  res = res.concat(backHalf);
	  return utils_1$1.encode(res, enc);
	};

	'use strict';






	var assert$5 = utils_1$1.assert;




	function EC(options) {
	  if (!(this instanceof EC))
	    return new EC(options);

	  // Shortcut `elliptic.ec(curve-name)`
	  if (typeof options === 'string') {
	    assert$5(curves_1.hasOwnProperty(options), 'Unknown curve ' + options);

	    options = curves_1[options];
	  }

	  // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
	  if (options instanceof curves_1.PresetCurve)
	    options = { curve: options };

	  this.curve = options.curve.curve;
	  this.n = this.curve.n;
	  this.nh = this.n.ushrn(1);
	  this.g = this.curve.g;

	  // Point on curve
	  this.g = options.curve.g;
	  this.g.precompute(options.curve.n.bitLength() + 1);

	  // Hash for function for DRBG
	  this.hash = options.hash || options.curve.hash;
	}
	var ec = EC;

	EC.prototype.keyPair = function keyPair(options) {
	  return new key(this, options);
	};

	EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
	  return key.fromPrivate(this, priv, enc);
	};

	EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
	  return key.fromPublic(this, pub, enc);
	};

	EC.prototype.genKeyPair = function genKeyPair(options) {
	  if (!options)
	    options = {};

	  // Instantiate Hmac_DRBG
	  var drbg = new hmacDrbg({
	    hash: this.hash,
	    pers: options.pers,
	    persEnc: options.persEnc || 'utf8',
	    entropy: options.entropy || brorand(this.hash.hmacStrength),
	    entropyEnc: options.entropy && options.entropyEnc || 'utf8',
	    nonce: this.n.toArray()
	  });

	  var bytes = this.n.byteLength();
	  var ns2 = this.n.sub(new bn$1(2));
	  do {
	    var priv = new bn$1(drbg.generate(bytes));
	    if (priv.cmp(ns2) > 0)
	      continue;

	    priv.iaddn(1);
	    return this.keyFromPrivate(priv);
	  } while (true);
	};

	EC.prototype._truncateToN = function truncateToN(msg, truncOnly) {
	  var delta = msg.byteLength() * 8 - this.n.bitLength();
	  if (delta > 0)
	    msg = msg.ushrn(delta);
	  if (!truncOnly && msg.cmp(this.n) >= 0)
	    return msg.sub(this.n);
	  else
	    return msg;
	};

	EC.prototype.sign = function sign(msg, key, enc, options) {
	  if (typeof enc === 'object') {
	    options = enc;
	    enc = null;
	  }
	  if (!options)
	    options = {};

	  key = this.keyFromPrivate(key, enc);
	  msg = this._truncateToN(new bn$1(msg, 16));

	  // Zero-extend key to provide enough entropy
	  var bytes = this.n.byteLength();
	  var bkey = key.getPrivate().toArray('be', bytes);

	  // Zero-extend nonce to have the same byte size as N
	  var nonce = msg.toArray('be', bytes);

	  // Instantiate Hmac_DRBG
	  var drbg = new hmacDrbg({
	    hash: this.hash,
	    entropy: bkey,
	    nonce: nonce,
	    pers: options.pers,
	    persEnc: options.persEnc || 'utf8'
	  });

	  // Number of bytes to generate
	  var ns1 = this.n.sub(new bn$1(1));

	  for (var iter = 0; true; iter++) {
	    var k = options.k ?
	        options.k(iter) :
	        new bn$1(drbg.generate(this.n.byteLength()));
	    k = this._truncateToN(k, true);
	    if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
	      continue;

	    var kp = this.g.mul(k);
	    if (kp.isInfinity())
	      continue;

	    var kpX = kp.getX();
	    var r = kpX.umod(this.n);
	    if (r.cmpn(0) === 0)
	      continue;

	    var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
	    s = s.umod(this.n);
	    if (s.cmpn(0) === 0)
	      continue;

	    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
	                        (kpX.cmp(r) !== 0 ? 2 : 0);

	    // Use complement of `s`, if it is > `n / 2`
	    if (options.canonical && s.cmp(this.nh) > 0) {
	      s = this.n.sub(s);
	      recoveryParam ^= 1;
	    }

	    return new signature({ r: r, s: s, recoveryParam: recoveryParam });
	  }
	};

	EC.prototype.verify = function verify(msg, signature$1, key, enc) {
	  msg = this._truncateToN(new bn$1(msg, 16));
	  key = this.keyFromPublic(key, enc);
	  signature$1 = new signature(signature$1, 'hex');

	  // Perform primitive values validation
	  var r = signature$1.r;
	  var s = signature$1.s;
	  if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
	    return false;
	  if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
	    return false;

	  // Validate signature
	  var sinv = s.invm(this.n);
	  var u1 = sinv.mul(msg).umod(this.n);
	  var u2 = sinv.mul(r).umod(this.n);

	  if (!this.curve._maxwellTrick) {
	    var p = this.g.mulAdd(u1, key.getPublic(), u2);
	    if (p.isInfinity())
	      return false;

	    return p.getX().umod(this.n).cmp(r) === 0;
	  }

	  // NOTE: Greg Maxwell's trick, inspired by:
	  // https://git.io/vad3K

	  var p = this.g.jmulAdd(u1, key.getPublic(), u2);
	  if (p.isInfinity())
	    return false;

	  // Compare `p.x` of Jacobian point with `r`,
	  // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
	  // inverse of `p.z^2`
	  return p.eqXToP(r);
	};

	EC.prototype.recoverPubKey = function(msg, signature$1, j, enc) {
	  assert$5((3 & j) === j, 'The recovery param is more than two bits');
	  signature$1 = new signature(signature$1, enc);

	  var n = this.n;
	  var e = new bn$1(msg);
	  var r = signature$1.r;
	  var s = signature$1.s;

	  // A set LSB signifies that the y-coordinate is odd
	  var isYOdd = j & 1;
	  var isSecondKey = j >> 1;
	  if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
	    throw new Error('Unable to find sencond key candinate');

	  // 1.1. Let x = r + jn.
	  if (isSecondKey)
	    r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
	  else
	    r = this.curve.pointFromX(r, isYOdd);

	  var rInv = signature$1.r.invm(n);
	  var s1 = n.sub(e).mul(rInv).umod(n);
	  var s2 = s.mul(rInv).umod(n);

	  // 1.6.1 Compute Q = r^-1 (sR -  eG)
	  //               Q = r^-1 (sR + -eG)
	  return this.g.mulAdd(s1, r, s2);
	};

	EC.prototype.getKeyRecoveryParam = function(e, signature$1, Q, enc) {
	  signature$1 = new signature(signature$1, enc);
	  if (signature$1.recoveryParam !== null)
	    return signature$1.recoveryParam;

	  for (var i = 0; i < 4; i++) {
	    var Qprime;
	    try {
	      Qprime = this.recoverPubKey(e, signature$1, i);
	    } catch (e) {
	      continue;
	    }

	    if (Qprime.eq(Q))
	      return i;
	  }
	  throw new Error('Unable to find valid recovery factor');
	};

	var eddsa = {};

	var require$$0$1 = getCjsExportFromNamespace(_package$1);

	var elliptic_1 = createCommonjsModule(function (module, exports) {
	'use strict';

	var elliptic = exports;

	elliptic.version = require$$0$1.version;
	elliptic.utils = utils_1$1;
	elliptic.rand = brorand;
	elliptic.curve = curve_1;
	elliptic.curves = curves_1;

	// Protocols
	elliptic.ec = ec;
	elliptic.eddsa = eddsa;
	});
	var elliptic_2 = elliptic_1.ec;

	var _version$q = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "signing-key/5.0.3";

	});

	var _version$r = unwrapExports(_version$q);
	var _version_1$d = _version$q.version;

	var lib$f = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });





	var logger = new lib.Logger(_version$q.version);
	var _curve = null;
	function getCurve() {
	    if (!_curve) {
	        _curve = new elliptic_1.ec("secp256k1");
	    }
	    return _curve;
	}
	var SigningKey = /** @class */ (function () {
	    function SigningKey(privateKey) {
	        lib$3.defineReadOnly(this, "curve", "secp256k1");
	        lib$3.defineReadOnly(this, "privateKey", lib$1.hexlify(privateKey));
	        var keyPair = getCurve().keyFromPrivate(lib$1.arrayify(this.privateKey));
	        lib$3.defineReadOnly(this, "publicKey", "0x" + keyPair.getPublic(false, "hex"));
	        lib$3.defineReadOnly(this, "compressedPublicKey", "0x" + keyPair.getPublic(true, "hex"));
	        lib$3.defineReadOnly(this, "_isSigningKey", true);
	    }
	    SigningKey.prototype._addPoint = function (other) {
	        var p0 = getCurve().keyFromPublic(lib$1.arrayify(this.publicKey));
	        var p1 = getCurve().keyFromPublic(lib$1.arrayify(other));
	        return "0x" + p0.pub.add(p1.pub).encodeCompressed("hex");
	    };
	    SigningKey.prototype.signDigest = function (digest) {
	        var keyPair = getCurve().keyFromPrivate(lib$1.arrayify(this.privateKey));
	        var signature = keyPair.sign(lib$1.arrayify(digest), { canonical: true });
	        return lib$1.splitSignature({
	            recoveryParam: signature.recoveryParam,
	            r: lib$1.hexZeroPad("0x" + signature.r.toString(16), 32),
	            s: lib$1.hexZeroPad("0x" + signature.s.toString(16), 32),
	        });
	    };
	    SigningKey.prototype.computeSharedSecret = function (otherKey) {
	        var keyPair = getCurve().keyFromPrivate(lib$1.arrayify(this.privateKey));
	        var otherKeyPair = getCurve().keyFromPublic(lib$1.arrayify(computePublicKey(otherKey)));
	        return lib$1.hexZeroPad("0x" + keyPair.derive(otherKeyPair.getPublic()).toString(16), 32);
	    };
	    SigningKey.isSigningKey = function (value) {
	        return !!(value && value._isSigningKey);
	    };
	    return SigningKey;
	}());
	exports.SigningKey = SigningKey;
	function recoverPublicKey(digest, signature) {
	    var sig = lib$1.splitSignature(signature);
	    var rs = { r: lib$1.arrayify(sig.r), s: lib$1.arrayify(sig.s) };
	    return "0x" + getCurve().recoverPubKey(lib$1.arrayify(digest), rs, sig.recoveryParam).encode("hex", false);
	}
	exports.recoverPublicKey = recoverPublicKey;
	function computePublicKey(key, compressed) {
	    var bytes = lib$1.arrayify(key);
	    if (bytes.length === 32) {
	        var signingKey = new SigningKey(bytes);
	        if (compressed) {
	            return "0x" + getCurve().keyFromPrivate(bytes).getPublic(true, "hex");
	        }
	        return signingKey.publicKey;
	    }
	    else if (bytes.length === 33) {
	        if (compressed) {
	            return lib$1.hexlify(bytes);
	        }
	        return "0x" + getCurve().keyFromPublic(bytes).getPublic(false, "hex");
	    }
	    else if (bytes.length === 65) {
	        if (!compressed) {
	            return lib$1.hexlify(bytes);
	        }
	        return "0x" + getCurve().keyFromPublic(bytes).getPublic(true, "hex");
	    }
	    return logger.throwArgumentError("invalid public or private key", "key", "[REDACTED]");
	}
	exports.computePublicKey = computePublicKey;

	});

	var index$f = unwrapExports(lib$f);
	var lib_1$f = lib$f.SigningKey;
	var lib_2$e = lib$f.recoverPublicKey;
	var lib_3$b = lib$f.computePublicKey;

	var _version$s = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "transactions/5.0.2";

	});

	var _version$t = unwrapExports(_version$s);
	var _version_1$e = _version$s.version;

	var lib$g = createCommonjsModule(function (module, exports) {
	"use strict";
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result["default"] = mod;
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });






	var RLP = __importStar(lib$5);



	var logger = new lib.Logger(_version$s.version);
	///////////////////////////////
	function handleAddress(value) {
	    if (value === "0x") {
	        return null;
	    }
	    return lib$6.getAddress(value);
	}
	function handleNumber(value) {
	    if (value === "0x") {
	        return lib$7.Zero;
	    }
	    return lib$2.BigNumber.from(value);
	}
	var transactionFields = [
	    { name: "nonce", maxLength: 32, numeric: true },
	    { name: "gasPrice", maxLength: 32, numeric: true },
	    { name: "gasLimit", maxLength: 32, numeric: true },
	    { name: "to", length: 20 },
	    { name: "value", maxLength: 32, numeric: true },
	    { name: "data" },
	];
	var allowedTransactionKeys = {
	    chainId: true, data: true, gasLimit: true, gasPrice: true, nonce: true, to: true, value: true
	};
	function computeAddress(key) {
	    var publicKey = lib$f.computePublicKey(key);
	    return lib$6.getAddress(lib$1.hexDataSlice(lib$4.keccak256(lib$1.hexDataSlice(publicKey, 1)), 12));
	}
	exports.computeAddress = computeAddress;
	function recoverAddress(digest, signature) {
	    return computeAddress(lib$f.recoverPublicKey(lib$1.arrayify(digest), signature));
	}
	exports.recoverAddress = recoverAddress;
	function serialize(transaction, signature) {
	    lib$3.checkProperties(transaction, allowedTransactionKeys);
	    var raw = [];
	    transactionFields.forEach(function (fieldInfo) {
	        var value = transaction[fieldInfo.name] || ([]);
	        var options = {};
	        if (fieldInfo.numeric) {
	            options.hexPad = "left";
	        }
	        value = lib$1.arrayify(lib$1.hexlify(value, options));
	        // Fixed-width field
	        if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
	            logger.throwArgumentError("invalid length for " + fieldInfo.name, ("transaction:" + fieldInfo.name), value);
	        }
	        // Variable-width (with a maximum)
	        if (fieldInfo.maxLength) {
	            value = lib$1.stripZeros(value);
	            if (value.length > fieldInfo.maxLength) {
	                logger.throwArgumentError("invalid length for " + fieldInfo.name, ("transaction:" + fieldInfo.name), value);
	            }
	        }
	        raw.push(lib$1.hexlify(value));
	    });
	    var chainId = 0;
	    if (transaction.chainId != null) {
	        // A chainId was provided; if non-zero we'll use EIP-155
	        chainId = transaction.chainId;
	        if (typeof (chainId) !== "number") {
	            logger.throwArgumentError("invalid transaction.chainId", "transaction", transaction);
	        }
	    }
	    else if (signature && !lib$1.isBytesLike(signature) && signature.v > 28) {
	        // No chainId provided, but the signature is signing with EIP-155; derive chainId
	        chainId = Math.floor((signature.v - 35) / 2);
	    }
	    // We have an EIP-155 transaction (chainId was specified and non-zero)
	    if (chainId !== 0) {
	        raw.push(lib$1.hexlify(chainId));
	        raw.push("0x");
	        raw.push("0x");
	    }
	    // Requesting an unsigned transation
	    if (!signature) {
	        return RLP.encode(raw);
	    }
	    // The splitSignature will ensure the transaction has a recoveryParam in the
	    // case that the signTransaction function only adds a v.
	    var sig = lib$1.splitSignature(signature);
	    // We pushed a chainId and null r, s on for hashing only; remove those
	    var v = 27 + sig.recoveryParam;
	    if (chainId !== 0) {
	        raw.pop();
	        raw.pop();
	        raw.pop();
	        v += chainId * 2 + 8;
	        // If an EIP-155 v (directly or indirectly; maybe _vs) was provided, check it!
	        if (sig.v > 28 && sig.v !== v) {
	            logger.throwArgumentError("transaction.chainId/signature.v mismatch", "signature", signature);
	        }
	    }
	    else if (sig.v !== v) {
	        logger.throwArgumentError("transaction.chainId/signature.v mismatch", "signature", signature);
	    }
	    raw.push(lib$1.hexlify(v));
	    raw.push(lib$1.stripZeros(lib$1.arrayify(sig.r)));
	    raw.push(lib$1.stripZeros(lib$1.arrayify(sig.s)));
	    return RLP.encode(raw);
	}
	exports.serialize = serialize;
	function parse(rawTransaction) {
	    var transaction = RLP.decode(rawTransaction);
	    if (transaction.length !== 9 && transaction.length !== 6) {
	        logger.throwArgumentError("invalid raw transaction", "rawTransaction", rawTransaction);
	    }
	    var tx = {
	        nonce: handleNumber(transaction[0]).toNumber(),
	        gasPrice: handleNumber(transaction[1]),
	        gasLimit: handleNumber(transaction[2]),
	        to: handleAddress(transaction[3]),
	        value: handleNumber(transaction[4]),
	        data: transaction[5],
	        chainId: 0
	    };
	    // Legacy unsigned transaction
	    if (transaction.length === 6) {
	        return tx;
	    }
	    try {
	        tx.v = lib$2.BigNumber.from(transaction[6]).toNumber();
	    }
	    catch (error) {
	        console.log(error);
	        return tx;
	    }
	    tx.r = lib$1.hexZeroPad(transaction[7], 32);
	    tx.s = lib$1.hexZeroPad(transaction[8], 32);
	    if (lib$2.BigNumber.from(tx.r).isZero() && lib$2.BigNumber.from(tx.s).isZero()) {
	        // EIP-155 unsigned transaction
	        tx.chainId = tx.v;
	        tx.v = 0;
	    }
	    else {
	        // Signed Tranasaction
	        tx.chainId = Math.floor((tx.v - 35) / 2);
	        if (tx.chainId < 0) {
	            tx.chainId = 0;
	        }
	        var recoveryParam = tx.v - 27;
	        var raw = transaction.slice(0, 6);
	        if (tx.chainId !== 0) {
	            raw.push(lib$1.hexlify(tx.chainId));
	            raw.push("0x");
	            raw.push("0x");
	            recoveryParam -= tx.chainId * 2 + 8;
	        }
	        var digest = lib$4.keccak256(RLP.encode(raw));
	        try {
	            tx.from = recoverAddress(digest, { r: lib$1.hexlify(tx.r), s: lib$1.hexlify(tx.s), recoveryParam: recoveryParam });
	        }
	        catch (error) {
	            console.log(error);
	        }
	        tx.hash = lib$4.keccak256(rawTransaction);
	    }
	    return tx;
	}
	exports.parse = parse;

	});

	var index$g = unwrapExports(lib$g);
	var lib_1$g = lib$g.computeAddress;
	var lib_2$f = lib$g.recoverAddress;
	var lib_3$c = lib$g.serialize;
	var lib_4$9 = lib$g.parse;

	var _version$u = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "wordlists/5.0.2";

	});

	var _version$v = unwrapExports(_version$u);
	var _version_1$f = _version$u.version;

	var wordlist = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// This gets overridden by rollup
	var exportWordlist = false;




	exports.logger = new lib.Logger(_version$u.version);
	var Wordlist = /** @class */ (function () {
	    function Wordlist(locale) {
	        var _newTarget = this.constructor;
	        exports.logger.checkAbstract(_newTarget, Wordlist);
	        lib$3.defineReadOnly(this, "locale", locale);
	    }
	    // Subclasses may override this
	    Wordlist.prototype.split = function (mnemonic) {
	        return mnemonic.toLowerCase().split(/ +/g);
	    };
	    // Subclasses may override this
	    Wordlist.prototype.join = function (words) {
	        return words.join(" ");
	    };
	    Wordlist.check = function (wordlist) {
	        var words = [];
	        for (var i = 0; i < 2048; i++) {
	            var word = wordlist.getWord(i);
	            /* istanbul ignore if */
	            if (i !== wordlist.getWordIndex(word)) {
	                return "0x";
	            }
	            words.push(word);
	        }
	        return lib$9.id(words.join("\n") + "\n");
	    };
	    Wordlist.register = function (lang, name) {
	        if (!name) {
	            name = lang.locale;
	        }
	        /* istanbul ignore if */
	        if (exportWordlist) {
	            try {
	                var anyGlobal = window;
	                if (anyGlobal._ethers && anyGlobal._ethers.wordlists) {
	                    if (!anyGlobal._ethers.wordlists[name]) {
	                        lib$3.defineReadOnly(anyGlobal._ethers.wordlists, name, lang);
	                    }
	                }
	            }
	            catch (error) { }
	        }
	    };
	    return Wordlist;
	}());
	exports.Wordlist = Wordlist;

	});

	var wordlist$1 = unwrapExports(wordlist);
	var wordlist_1 = wordlist.logger;
	var wordlist_2 = wordlist.Wordlist;

	var langEn_1 = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });

	var words = "AbandonAbilityAbleAboutAboveAbsentAbsorbAbstractAbsurdAbuseAccessAccidentAccountAccuseAchieveAcidAcousticAcquireAcrossActActionActorActressActualAdaptAddAddictAddressAdjustAdmitAdultAdvanceAdviceAerobicAffairAffordAfraidAgainAgeAgentAgreeAheadAimAirAirportAisleAlarmAlbumAlcoholAlertAlienAllAlleyAllowAlmostAloneAlphaAlreadyAlsoAlterAlwaysAmateurAmazingAmongAmountAmusedAnalystAnchorAncientAngerAngleAngryAnimalAnkleAnnounceAnnualAnotherAnswerAntennaAntiqueAnxietyAnyApartApologyAppearAppleApproveAprilArchArcticAreaArenaArgueArmArmedArmorArmyAroundArrangeArrestArriveArrowArtArtefactArtistArtworkAskAspectAssaultAssetAssistAssumeAsthmaAthleteAtomAttackAttendAttitudeAttractAuctionAuditAugustAuntAuthorAutoAutumnAverageAvocadoAvoidAwakeAwareAwayAwesomeAwfulAwkwardAxisBabyBachelorBaconBadgeBagBalanceBalconyBallBambooBananaBannerBarBarelyBargainBarrelBaseBasicBasketBattleBeachBeanBeautyBecauseBecomeBeefBeforeBeginBehaveBehindBelieveBelowBeltBenchBenefitBestBetrayBetterBetweenBeyondBicycleBidBikeBindBiologyBirdBirthBitterBlackBladeBlameBlanketBlastBleakBlessBlindBloodBlossomBlouseBlueBlurBlushBoardBoatBodyBoilBombBoneBonusBookBoostBorderBoringBorrowBossBottomBounceBoxBoyBracketBrainBrandBrassBraveBreadBreezeBrickBridgeBriefBrightBringBriskBroccoliBrokenBronzeBroomBrotherBrownBrushBubbleBuddyBudgetBuffaloBuildBulbBulkBulletBundleBunkerBurdenBurgerBurstBusBusinessBusyButterBuyerBuzzCabbageCabinCableCactusCageCakeCallCalmCameraCampCanCanalCancelCandyCannonCanoeCanvasCanyonCapableCapitalCaptainCarCarbonCardCargoCarpetCarryCartCaseCashCasinoCastleCasualCatCatalogCatchCategoryCattleCaughtCauseCautionCaveCeilingCeleryCementCensusCenturyCerealCertainChairChalkChampionChangeChaosChapterChargeChaseChatCheapCheckCheeseChefCherryChestChickenChiefChildChimneyChoiceChooseChronicChuckleChunkChurnCigarCinnamonCircleCitizenCityCivilClaimClapClarifyClawClayCleanClerkCleverClickClientCliffClimbClinicClipClockClogCloseClothCloudClownClubClumpClusterClutchCoachCoastCoconutCodeCoffeeCoilCoinCollectColorColumnCombineComeComfortComicCommonCompanyConcertConductConfirmCongressConnectConsiderControlConvinceCookCoolCopperCopyCoralCoreCornCorrectCostCottonCouchCountryCoupleCourseCousinCoverCoyoteCrackCradleCraftCramCraneCrashCraterCrawlCrazyCreamCreditCreekCrewCricketCrimeCrispCriticCropCrossCrouchCrowdCrucialCruelCruiseCrumbleCrunchCrushCryCrystalCubeCultureCupCupboardCuriousCurrentCurtainCurveCushionCustomCuteCycleDadDamageDampDanceDangerDaringDashDaughterDawnDayDealDebateDebrisDecadeDecemberDecideDeclineDecorateDecreaseDeerDefenseDefineDefyDegreeDelayDeliverDemandDemiseDenialDentistDenyDepartDependDepositDepthDeputyDeriveDescribeDesertDesignDeskDespairDestroyDetailDetectDevelopDeviceDevoteDiagramDialDiamondDiaryDiceDieselDietDifferDigitalDignityDilemmaDinnerDinosaurDirectDirtDisagreeDiscoverDiseaseDishDismissDisorderDisplayDistanceDivertDivideDivorceDizzyDoctorDocumentDogDollDolphinDomainDonateDonkeyDonorDoorDoseDoubleDoveDraftDragonDramaDrasticDrawDreamDressDriftDrillDrinkDripDriveDropDrumDryDuckDumbDuneDuringDustDutchDutyDwarfDynamicEagerEagleEarlyEarnEarthEasilyEastEasyEchoEcologyEconomyEdgeEditEducateEffortEggEightEitherElbowElderElectricElegantElementElephantElevatorEliteElseEmbarkEmbodyEmbraceEmergeEmotionEmployEmpowerEmptyEnableEnactEndEndlessEndorseEnemyEnergyEnforceEngageEngineEnhanceEnjoyEnlistEnoughEnrichEnrollEnsureEnterEntireEntryEnvelopeEpisodeEqualEquipEraEraseErodeErosionErrorEruptEscapeEssayEssenceEstateEternalEthicsEvidenceEvilEvokeEvolveExactExampleExcessExchangeExciteExcludeExcuseExecuteExerciseExhaustExhibitExileExistExitExoticExpandExpectExpireExplainExposeExpressExtendExtraEyeEyebrowFabricFaceFacultyFadeFaintFaithFallFalseFameFamilyFamousFanFancyFantasyFarmFashionFatFatalFatherFatigueFaultFavoriteFeatureFebruaryFederalFeeFeedFeelFemaleFenceFestivalFetchFeverFewFiberFictionFieldFigureFileFilmFilterFinalFindFineFingerFinishFireFirmFirstFiscalFishFitFitnessFixFlagFlameFlashFlatFlavorFleeFlightFlipFloatFlockFloorFlowerFluidFlushFlyFoamFocusFogFoilFoldFollowFoodFootForceForestForgetForkFortuneForumForwardFossilFosterFoundFoxFragileFrameFrequentFreshFriendFringeFrogFrontFrostFrownFrozenFruitFuelFunFunnyFurnaceFuryFutureGadgetGainGalaxyGalleryGameGapGarageGarbageGardenGarlicGarmentGasGaspGateGatherGaugeGazeGeneralGeniusGenreGentleGenuineGestureGhostGiantGiftGiggleGingerGiraffeGirlGiveGladGlanceGlareGlassGlideGlimpseGlobeGloomGloryGloveGlowGlueGoatGoddessGoldGoodGooseGorillaGospelGossipGovernGownGrabGraceGrainGrantGrapeGrassGravityGreatGreenGridGriefGritGroceryGroupGrowGruntGuardGuessGuideGuiltGuitarGunGymHabitHairHalfHammerHamsterHandHappyHarborHardHarshHarvestHatHaveHawkHazardHeadHealthHeartHeavyHedgehogHeightHelloHelmetHelpHenHeroHiddenHighHillHintHipHireHistoryHobbyHockeyHoldHoleHolidayHollowHomeHoneyHoodHopeHornHorrorHorseHospitalHostHotelHourHoverHubHugeHumanHumbleHumorHundredHungryHuntHurdleHurryHurtHusbandHybridIceIconIdeaIdentifyIdleIgnoreIllIllegalIllnessImageImitateImmenseImmuneImpactImposeImproveImpulseInchIncludeIncomeIncreaseIndexIndicateIndoorIndustryInfantInflictInformInhaleInheritInitialInjectInjuryInmateInnerInnocentInputInquiryInsaneInsectInsideInspireInstallIntactInterestIntoInvestInviteInvolveIronIslandIsolateIssueItemIvoryJacketJaguarJarJazzJealousJeansJellyJewelJobJoinJokeJourneyJoyJudgeJuiceJumpJungleJuniorJunkJustKangarooKeenKeepKetchupKeyKickKidKidneyKindKingdomKissKitKitchenKiteKittenKiwiKneeKnifeKnockKnowLabLabelLaborLadderLadyLakeLampLanguageLaptopLargeLaterLatinLaughLaundryLavaLawLawnLawsuitLayerLazyLeaderLeafLearnLeaveLectureLeftLegLegalLegendLeisureLemonLendLengthLensLeopardLessonLetterLevelLiarLibertyLibraryLicenseLifeLiftLightLikeLimbLimitLinkLionLiquidListLittleLiveLizardLoadLoanLobsterLocalLockLogicLonelyLongLoopLotteryLoudLoungeLoveLoyalLuckyLuggageLumberLunarLunchLuxuryLyricsMachineMadMagicMagnetMaidMailMainMajorMakeMammalManManageMandateMangoMansionManualMapleMarbleMarchMarginMarineMarketMarriageMaskMassMasterMatchMaterialMathMatrixMatterMaximumMazeMeadowMeanMeasureMeatMechanicMedalMediaMelodyMeltMemberMemoryMentionMenuMercyMergeMeritMerryMeshMessageMetalMethodMiddleMidnightMilkMillionMimicMindMinimumMinorMinuteMiracleMirrorMiseryMissMistakeMixMixedMixtureMobileModelModifyMomMomentMonitorMonkeyMonsterMonthMoonMoralMoreMorningMosquitoMotherMotionMotorMountainMouseMoveMovieMuchMuffinMuleMultiplyMuscleMuseumMushroomMusicMustMutualMyselfMysteryMythNaiveNameNapkinNarrowNastyNationNatureNearNeckNeedNegativeNeglectNeitherNephewNerveNestNetNetworkNeutralNeverNewsNextNiceNightNobleNoiseNomineeNoodleNormalNorthNoseNotableNoteNothingNoticeNovelNowNuclearNumberNurseNutOakObeyObjectObligeObscureObserveObtainObviousOccurOceanOctoberOdorOffOfferOfficeOftenOilOkayOldOliveOlympicOmitOnceOneOnionOnlineOnlyOpenOperaOpinionOpposeOptionOrangeOrbitOrchardOrderOrdinaryOrganOrientOriginalOrphanOstrichOtherOutdoorOuterOutputOutsideOvalOvenOverOwnOwnerOxygenOysterOzonePactPaddlePagePairPalacePalmPandaPanelPanicPantherPaperParadeParentParkParrotPartyPassPatchPathPatientPatrolPatternPausePavePaymentPeacePeanutPearPeasantPelicanPenPenaltyPencilPeoplePepperPerfectPermitPersonPetPhonePhotoPhrasePhysicalPianoPicnicPicturePiecePigPigeonPillPilotPinkPioneerPipePistolPitchPizzaPlacePlanetPlasticPlatePlayPleasePledgePluckPlugPlungePoemPoetPointPolarPolePolicePondPonyPoolPopularPortionPositionPossiblePostPotatoPotteryPovertyPowderPowerPracticePraisePredictPreferPreparePresentPrettyPreventPricePridePrimaryPrintPriorityPrisonPrivatePrizeProblemProcessProduceProfitProgramProjectPromoteProofPropertyProsperProtectProudProvidePublicPuddingPullPulpPulsePumpkinPunchPupilPuppyPurchasePurityPurposePursePushPutPuzzlePyramidQualityQuantumQuarterQuestionQuickQuitQuizQuoteRabbitRaccoonRaceRackRadarRadioRailRainRaiseRallyRampRanchRandomRangeRapidRareRateRatherRavenRawRazorReadyRealReasonRebelRebuildRecallReceiveRecipeRecordRecycleReduceReflectReformRefuseRegionRegretRegularRejectRelaxReleaseReliefRelyRemainRememberRemindRemoveRenderRenewRentReopenRepairRepeatReplaceReportRequireRescueResembleResistResourceResponseResultRetireRetreatReturnReunionRevealReviewRewardRhythmRibRibbonRiceRichRideRidgeRifleRightRigidRingRiotRippleRiskRitualRivalRiverRoadRoastRobotRobustRocketRomanceRoofRookieRoomRoseRotateRoughRoundRouteRoyalRubberRudeRugRuleRunRunwayRuralSadSaddleSadnessSafeSailSaladSalmonSalonSaltSaluteSameSampleSandSatisfySatoshiSauceSausageSaveSayScaleScanScareScatterSceneSchemeSchoolScienceScissorsScorpionScoutScrapScreenScriptScrubSeaSearchSeasonSeatSecondSecretSectionSecuritySeedSeekSegmentSelectSellSeminarSeniorSenseSentenceSeriesServiceSessionSettleSetupSevenShadowShaftShallowShareShedShellSheriffShieldShiftShineShipShiverShockShoeShootShopShortShoulderShoveShrimpShrugShuffleShySiblingSickSideSiegeSightSignSilentSilkSillySilverSimilarSimpleSinceSingSirenSisterSituateSixSizeSkateSketchSkiSkillSkinSkirtSkullSlabSlamSleepSlenderSliceSlideSlightSlimSloganSlotSlowSlushSmallSmartSmileSmokeSmoothSnackSnakeSnapSniffSnowSoapSoccerSocialSockSodaSoftSolarSoldierSolidSolutionSolveSomeoneSongSoonSorrySortSoulSoundSoupSourceSouthSpaceSpareSpatialSpawnSpeakSpecialSpeedSpellSpendSphereSpiceSpiderSpikeSpinSpiritSplitSpoilSponsorSpoonSportSpotSpraySpreadSpringSpySquareSqueezeSquirrelStableStadiumStaffStageStairsStampStandStartStateStaySteakSteelStemStepStereoStickStillStingStockStomachStoneStoolStoryStoveStrategyStreetStrikeStrongStruggleStudentStuffStumbleStyleSubjectSubmitSubwaySuccessSuchSuddenSufferSugarSuggestSuitSummerSunSunnySunsetSuperSupplySupremeSureSurfaceSurgeSurpriseSurroundSurveySuspectSustainSwallowSwampSwapSwarmSwearSweetSwiftSwimSwingSwitchSwordSymbolSymptomSyrupSystemTableTackleTagTailTalentTalkTankTapeTargetTaskTasteTattooTaxiTeachTeamTellTenTenantTennisTentTermTestTextThankThatThemeThenTheoryThereTheyThingThisThoughtThreeThriveThrowThumbThunderTicketTideTigerTiltTimberTimeTinyTipTiredTissueTitleToastTobaccoTodayToddlerToeTogetherToiletTokenTomatoTomorrowToneTongueTonightToolToothTopTopicToppleTorchTornadoTortoiseTossTotalTouristTowardTowerTownToyTrackTradeTrafficTragicTrainTransferTrapTrashTravelTrayTreatTreeTrendTrialTribeTrickTriggerTrimTripTrophyTroubleTruckTrueTrulyTrumpetTrustTruthTryTubeTuitionTumbleTunaTunnelTurkeyTurnTurtleTwelveTwentyTwiceTwinTwistTwoTypeTypicalUglyUmbrellaUnableUnawareUncleUncoverUnderUndoUnfairUnfoldUnhappyUniformUniqueUnitUniverseUnknownUnlockUntilUnusualUnveilUpdateUpgradeUpholdUponUpperUpsetUrbanUrgeUsageUseUsedUsefulUselessUsualUtilityVacantVacuumVagueValidValleyValveVanVanishVaporVariousVastVaultVehicleVelvetVendorVentureVenueVerbVerifyVersionVeryVesselVeteranViableVibrantViciousVictoryVideoViewVillageVintageViolinVirtualVirusVisaVisitVisualVitalVividVocalVoiceVoidVolcanoVolumeVoteVoyageWageWagonWaitWalkWallWalnutWantWarfareWarmWarriorWashWaspWasteWaterWaveWayWealthWeaponWearWeaselWeatherWebWeddingWeekendWeirdWelcomeWestWetWhaleWhatWheatWheelWhenWhereWhipWhisperWideWidthWifeWildWillWinWindowWineWingWinkWinnerWinterWireWisdomWiseWishWitnessWolfWomanWonderWoodWoolWordWorkWorldWorryWorthWrapWreckWrestleWristWriteWrongYardYearYellowYouYoungYouthZebraZeroZoneZoo";
	var wordlist$1 = null;
	function loadWords(lang) {
	    if (wordlist$1 != null) {
	        return;
	    }
	    wordlist$1 = words.replace(/([A-Z])/g, " $1").toLowerCase().substring(1).split(" ");
	    // Verify the computed list matches the official list
	    /* istanbul ignore if */
	    if (wordlist.Wordlist.check(lang) !== "0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60") {
	        wordlist$1 = null;
	        throw new Error("BIP39 Wordlist for en (English) FAILED");
	    }
	}
	var LangEn = /** @class */ (function (_super) {
	    __extends(LangEn, _super);
	    function LangEn() {
	        return _super.call(this, "en") || this;
	    }
	    LangEn.prototype.getWord = function (index) {
	        loadWords(this);
	        return wordlist$1[index];
	    };
	    LangEn.prototype.getWordIndex = function (word) {
	        loadWords(this);
	        return wordlist$1.indexOf(word);
	    };
	    return LangEn;
	}(wordlist.Wordlist));
	var langEn = new LangEn();
	exports.langEn = langEn;
	wordlist.Wordlist.register(langEn);

	});

	var langEn = unwrapExports(langEn_1);
	var langEn_2 = langEn_1.langEn;

	var browser$4 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// Wordlists
	// See: https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md

	exports.Wordlist = wordlist.Wordlist;

	var wordlists = { en: langEn_1.langEn };
	exports.wordlists = wordlists;

	});

	var browser$5 = unwrapExports(browser$4);
	var browser_1$2 = browser$4.Wordlist;
	var browser_2$1 = browser$4.wordlists;

	var _version$w = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "hdnode/5.0.2";

	});

	var _version$x = unwrapExports(_version$w);
	var _version_1$g = _version$w.version;

	var lib$h = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });












	var logger = new lib.Logger(_version$w.version);
	var N = lib$2.BigNumber.from("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
	// "Bitcoin seed"
	var MasterSecret = lib$8.toUtf8Bytes("Bitcoin seed");
	var HardenedBit = 0x80000000;
	// Returns a byte with the MSB bits set
	function getUpperMask(bits) {
	    return ((1 << bits) - 1) << (8 - bits);
	}
	// Returns a byte with the LSB bits set
	function getLowerMask(bits) {
	    return (1 << bits) - 1;
	}
	function bytes32(value) {
	    return lib$1.hexZeroPad(lib$1.hexlify(value), 32);
	}
	function base58check(data) {
	    return lib$e.Base58.encode(lib$1.concat([data, lib$1.hexDataSlice(browser.sha256(browser.sha256(data)), 0, 4)]));
	}
	function getWordlist(wordlist) {
	    if (wordlist == null) {
	        return browser$4.wordlists["en"];
	    }
	    if (typeof (wordlist) === "string") {
	        var words = browser$4.wordlists[wordlist];
	        if (words == null) {
	            logger.throwArgumentError("unknown locale", "wordlist", wordlist);
	        }
	        return words;
	    }
	    return wordlist;
	}
	var _constructorGuard = {};
	exports.defaultPath = "m/44'/60'/0'/0/0";
	;
	var HDNode = /** @class */ (function () {
	    /**
	     *  This constructor should not be called directly.
	     *
	     *  Please use:
	     *   - fromMnemonic
	     *   - fromSeed
	     */
	    function HDNode(constructorGuard, privateKey, publicKey, parentFingerprint, chainCode, index, depth, mnemonicOrPath) {
	        var _newTarget = this.constructor;
	        logger.checkNew(_newTarget, HDNode);
	        /* istanbul ignore if */
	        if (constructorGuard !== _constructorGuard) {
	            throw new Error("HDNode constructor cannot be called directly");
	        }
	        if (privateKey) {
	            var signingKey = new lib$f.SigningKey(privateKey);
	            lib$3.defineReadOnly(this, "privateKey", signingKey.privateKey);
	            lib$3.defineReadOnly(this, "publicKey", signingKey.compressedPublicKey);
	        }
	        else {
	            lib$3.defineReadOnly(this, "privateKey", null);
	            lib$3.defineReadOnly(this, "publicKey", lib$1.hexlify(publicKey));
	        }
	        lib$3.defineReadOnly(this, "parentFingerprint", parentFingerprint);
	        lib$3.defineReadOnly(this, "fingerprint", lib$1.hexDataSlice(browser.ripemd160(browser.sha256(this.publicKey)), 0, 4));
	        lib$3.defineReadOnly(this, "address", lib$g.computeAddress(this.publicKey));
	        lib$3.defineReadOnly(this, "chainCode", chainCode);
	        lib$3.defineReadOnly(this, "index", index);
	        lib$3.defineReadOnly(this, "depth", depth);
	        if (mnemonicOrPath == null) {
	            // From a source that does not preserve the path (e.g. extended keys)
	            lib$3.defineReadOnly(this, "mnemonic", null);
	            lib$3.defineReadOnly(this, "path", null);
	        }
	        else if (typeof (mnemonicOrPath) === "string") {
	            // From a source that does not preserve the mnemonic (e.g. neutered)
	            lib$3.defineReadOnly(this, "mnemonic", null);
	            lib$3.defineReadOnly(this, "path", mnemonicOrPath);
	        }
	        else {
	            // From a fully qualified source
	            lib$3.defineReadOnly(this, "mnemonic", mnemonicOrPath);
	            lib$3.defineReadOnly(this, "path", mnemonicOrPath.path);
	        }
	    }
	    Object.defineProperty(HDNode.prototype, "extendedKey", {
	        get: function () {
	            // We only support the mainnet values for now, but if anyone needs
	            // testnet values, let me know. I believe current senitment is that
	            // we should always use mainnet, and use BIP-44 to derive the network
	            //   - Mainnet: public=0x0488B21E, private=0x0488ADE4
	            //   - Testnet: public=0x043587CF, private=0x04358394
	            if (this.depth >= 256) {
	                throw new Error("Depth too large!");
	            }
	            return base58check(lib$1.concat([
	                ((this.privateKey != null) ? "0x0488ADE4" : "0x0488B21E"),
	                lib$1.hexlify(this.depth),
	                this.parentFingerprint,
	                lib$1.hexZeroPad(lib$1.hexlify(this.index), 4),
	                this.chainCode,
	                ((this.privateKey != null) ? lib$1.concat(["0x00", this.privateKey]) : this.publicKey),
	            ]));
	        },
	        enumerable: true,
	        configurable: true
	    });
	    HDNode.prototype.neuter = function () {
	        return new HDNode(_constructorGuard, null, this.publicKey, this.parentFingerprint, this.chainCode, this.index, this.depth, this.path);
	    };
	    HDNode.prototype._derive = function (index) {
	        if (index > 0xffffffff) {
	            throw new Error("invalid index - " + String(index));
	        }
	        // Base path
	        var path = this.path;
	        if (path) {
	            path += "/" + (index & ~HardenedBit);
	        }
	        var data = new Uint8Array(37);
	        if (index & HardenedBit) {
	            if (!this.privateKey) {
	                throw new Error("cannot derive child of neutered node");
	            }
	            // Data = 0x00 || ser_256(k_par)
	            data.set(lib$1.arrayify(this.privateKey), 1);
	            // Hardened path
	            if (path) {
	                path += "'";
	            }
	        }
	        else {
	            // Data = ser_p(point(k_par))
	            data.set(lib$1.arrayify(this.publicKey));
	        }
	        // Data += ser_32(i)
	        for (var i = 24; i >= 0; i -= 8) {
	            data[33 + (i >> 3)] = ((index >> (24 - i)) & 0xff);
	        }
	        var I = lib$1.arrayify(browser.computeHmac(browser.SupportedAlgorithm.sha512, this.chainCode, data));
	        var IL = I.slice(0, 32);
	        var IR = I.slice(32);
	        // The private key
	        var ki = null;
	        // The public key
	        var Ki = null;
	        if (this.privateKey) {
	            ki = bytes32(lib$2.BigNumber.from(IL).add(this.privateKey).mod(N));
	        }
	        else {
	            var ek = new lib$f.SigningKey(lib$1.hexlify(IL));
	            Ki = ek._addPoint(this.publicKey);
	        }
	        var mnemonicOrPath = path;
	        var srcMnemonic = this.mnemonic;
	        if (srcMnemonic) {
	            mnemonicOrPath = Object.freeze({
	                phrase: srcMnemonic.phrase,
	                path: path,
	                locale: (srcMnemonic.locale || "en")
	            });
	        }
	        return new HDNode(_constructorGuard, ki, Ki, this.fingerprint, bytes32(IR), index, this.depth + 1, mnemonicOrPath);
	    };
	    HDNode.prototype.derivePath = function (path) {
	        var components = path.split("/");
	        if (components.length === 0 || (components[0] === "m" && this.depth !== 0)) {
	            throw new Error("invalid path - " + path);
	        }
	        if (components[0] === "m") {
	            components.shift();
	        }
	        var result = this;
	        for (var i = 0; i < components.length; i++) {
	            var component = components[i];
	            if (component.match(/^[0-9]+'$/)) {
	                var index = parseInt(component.substring(0, component.length - 1));
	                if (index >= HardenedBit) {
	                    throw new Error("invalid path index - " + component);
	                }
	                result = result._derive(HardenedBit + index);
	            }
	            else if (component.match(/^[0-9]+$/)) {
	                var index = parseInt(component);
	                if (index >= HardenedBit) {
	                    throw new Error("invalid path index - " + component);
	                }
	                result = result._derive(index);
	            }
	            else {
	                throw new Error("invalid path component - " + component);
	            }
	        }
	        return result;
	    };
	    HDNode._fromSeed = function (seed, mnemonic) {
	        var seedArray = lib$1.arrayify(seed);
	        if (seedArray.length < 16 || seedArray.length > 64) {
	            throw new Error("invalid seed");
	        }
	        var I = lib$1.arrayify(browser.computeHmac(browser.SupportedAlgorithm.sha512, MasterSecret, seedArray));
	        return new HDNode(_constructorGuard, bytes32(I.slice(0, 32)), null, "0x00000000", bytes32(I.slice(32)), 0, 0, mnemonic);
	    };
	    HDNode.fromMnemonic = function (mnemonic, password, wordlist) {
	        // If a locale name was passed in, find the associated wordlist
	        wordlist = getWordlist(wordlist);
	        // Normalize the case and spacing in the mnemonic (throws if the mnemonic is invalid)
	        mnemonic = entropyToMnemonic(mnemonicToEntropy(mnemonic, wordlist), wordlist);
	        return HDNode._fromSeed(mnemonicToSeed(mnemonic, password), {
	            phrase: mnemonic,
	            path: "m",
	            locale: wordlist.locale
	        });
	    };
	    HDNode.fromSeed = function (seed) {
	        return HDNode._fromSeed(seed, null);
	    };
	    HDNode.fromExtendedKey = function (extendedKey) {
	        var bytes = lib$e.Base58.decode(extendedKey);
	        if (bytes.length !== 82 || base58check(bytes.slice(0, 78)) !== extendedKey) {
	            logger.throwArgumentError("invalid extended key", "extendedKey", "[REDACTED]");
	        }
	        var depth = bytes[4];
	        var parentFingerprint = lib$1.hexlify(bytes.slice(5, 9));
	        var index = parseInt(lib$1.hexlify(bytes.slice(9, 13)).substring(2), 16);
	        var chainCode = lib$1.hexlify(bytes.slice(13, 45));
	        var key = bytes.slice(45, 78);
	        switch (lib$1.hexlify(bytes.slice(0, 4))) {
	            // Public Key
	            case "0x0488b21e":
	            case "0x043587cf":
	                return new HDNode(_constructorGuard, null, lib$1.hexlify(key), parentFingerprint, chainCode, index, depth, null);
	            // Private Key
	            case "0x0488ade4":
	            case "0x04358394 ":
	                if (key[0] !== 0) {
	                    break;
	                }
	                return new HDNode(_constructorGuard, lib$1.hexlify(key.slice(1)), null, parentFingerprint, chainCode, index, depth, null);
	        }
	        return logger.throwArgumentError("invalid extended key", "extendedKey", "[REDACTED]");
	    };
	    return HDNode;
	}());
	exports.HDNode = HDNode;
	function mnemonicToSeed(mnemonic, password) {
	    if (!password) {
	        password = "";
	    }
	    var salt = lib$8.toUtf8Bytes("mnemonic" + password, lib$8.UnicodeNormalizationForm.NFKD);
	    return browser$2.pbkdf2(lib$8.toUtf8Bytes(mnemonic, lib$8.UnicodeNormalizationForm.NFKD), salt, 2048, 64, "sha512");
	}
	exports.mnemonicToSeed = mnemonicToSeed;
	function mnemonicToEntropy(mnemonic, wordlist) {
	    wordlist = getWordlist(wordlist);
	    logger.checkNormalize();
	    var words = wordlist.split(mnemonic);
	    if ((words.length % 3) !== 0) {
	        throw new Error("invalid mnemonic");
	    }
	    var entropy = lib$1.arrayify(new Uint8Array(Math.ceil(11 * words.length / 8)));
	    var offset = 0;
	    for (var i = 0; i < words.length; i++) {
	        var index = wordlist.getWordIndex(words[i].normalize("NFKD"));
	        if (index === -1) {
	            throw new Error("invalid mnemonic");
	        }
	        for (var bit = 0; bit < 11; bit++) {
	            if (index & (1 << (10 - bit))) {
	                entropy[offset >> 3] |= (1 << (7 - (offset % 8)));
	            }
	            offset++;
	        }
	    }
	    var entropyBits = 32 * words.length / 3;
	    var checksumBits = words.length / 3;
	    var checksumMask = getUpperMask(checksumBits);
	    var checksum = lib$1.arrayify(browser.sha256(entropy.slice(0, entropyBits / 8)))[0] & checksumMask;
	    if (checksum !== (entropy[entropy.length - 1] & checksumMask)) {
	        throw new Error("invalid checksum");
	    }
	    return lib$1.hexlify(entropy.slice(0, entropyBits / 8));
	}
	exports.mnemonicToEntropy = mnemonicToEntropy;
	function entropyToMnemonic(entropy, wordlist) {
	    wordlist = getWordlist(wordlist);
	    entropy = lib$1.arrayify(entropy);
	    if ((entropy.length % 4) !== 0 || entropy.length < 16 || entropy.length > 32) {
	        throw new Error("invalid entropy");
	    }
	    var indices = [0];
	    var remainingBits = 11;
	    for (var i = 0; i < entropy.length; i++) {
	        // Consume the whole byte (with still more to go)
	        if (remainingBits > 8) {
	            indices[indices.length - 1] <<= 8;
	            indices[indices.length - 1] |= entropy[i];
	            remainingBits -= 8;
	            // This byte will complete an 11-bit index
	        }
	        else {
	            indices[indices.length - 1] <<= remainingBits;
	            indices[indices.length - 1] |= entropy[i] >> (8 - remainingBits);
	            // Start the next word
	            indices.push(entropy[i] & getLowerMask(8 - remainingBits));
	            remainingBits += 3;
	        }
	    }
	    // Compute the checksum bits
	    var checksumBits = entropy.length / 4;
	    var checksum = lib$1.arrayify(browser.sha256(entropy))[0] & getUpperMask(checksumBits);
	    // Shift the checksum into the word indices
	    indices[indices.length - 1] <<= checksumBits;
	    indices[indices.length - 1] |= (checksum >> (8 - checksumBits));
	    return wordlist.join(indices.map(function (index) { return wordlist.getWord(index); }));
	}
	exports.entropyToMnemonic = entropyToMnemonic;
	function isValidMnemonic(mnemonic, wordlist) {
	    try {
	        mnemonicToEntropy(mnemonic, wordlist);
	        return true;
	    }
	    catch (error) { }
	    return false;
	}
	exports.isValidMnemonic = isValidMnemonic;

	});

	var index$h = unwrapExports(lib$h);
	var lib_1$h = lib$h.defaultPath;
	var lib_2$g = lib$h.HDNode;
	var lib_3$d = lib$h.mnemonicToSeed;
	var lib_4$a = lib$h.mnemonicToEntropy;
	var lib_5$9 = lib$h.entropyToMnemonic;
	var lib_6$5 = lib$h.isValidMnemonic;

	var _version$y = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "random/5.0.2";

	});

	var _version$z = unwrapExports(_version$y);
	var _version_1$h = _version$y.version;

	var shuffle = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function shuffled(array) {
	    array = array.slice();
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var tmp = array[i];
	        array[i] = array[j];
	        array[j] = tmp;
	    }
	    return array;
	}
	exports.shuffled = shuffled;

	});

	var shuffle$1 = unwrapExports(shuffle);
	var shuffle_1 = shuffle.shuffled;

	var browser$6 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$y.version);

	exports.shuffled = shuffle.shuffled;
	var anyGlobal = null;
	try {
	    anyGlobal = window;
	    if (anyGlobal == null) {
	        throw new Error("try next");
	    }
	}
	catch (error) {
	    try {
	        anyGlobal = commonjsGlobal;
	        if (anyGlobal == null) {
	            throw new Error("try next");
	        }
	    }
	    catch (error) {
	        anyGlobal = {};
	    }
	}
	var crypto = anyGlobal.crypto || anyGlobal.msCrypto;
	if (!crypto || !crypto.getRandomValues) {
	    logger.warn("WARNING: Missing strong random number source");
	    crypto = {
	        getRandomValues: function (buffer) {
	            return logger.throwError("no secure random source avaialble", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "crypto.getRandomValues"
	            });
	        }
	    };
	}
	function randomBytes(length) {
	    if (length <= 0 || length > 1024 || (length % 1)) {
	        logger.throwArgumentError("invalid length", "length", length);
	    }
	    var result = new Uint8Array(length);
	    crypto.getRandomValues(result);
	    return lib$1.arrayify(result);
	}
	exports.randomBytes = randomBytes;
	;

	});

	var browser$7 = unwrapExports(browser$6);
	var browser_1$3 = browser$6.shuffled;
	var browser_2$2 = browser$6.randomBytes;

	var aesJs = createCommonjsModule(function (module, exports) {
	"use strict";

	(function(root) {

	    function checkInt(value) {
	        return (parseInt(value) === value);
	    }

	    function checkInts(arrayish) {
	        if (!checkInt(arrayish.length)) { return false; }

	        for (var i = 0; i < arrayish.length; i++) {
	            if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
	                return false;
	            }
	        }

	        return true;
	    }

	    function coerceArray(arg, copy) {

	        // ArrayBuffer view
	        if (arg.buffer && ArrayBuffer.isView(arg) && arg.name === 'Uint8Array') {

	            if (copy) {
	                if (arg.slice) {
	                    arg = arg.slice();
	                } else {
	                    arg = Array.prototype.slice.call(arg);
	                }
	            }

	            return arg;
	        }

	        // It's an array; check it is a valid representation of a byte
	        if (Array.isArray(arg)) {
	            if (!checkInts(arg)) {
	                throw new Error('Array contains invalid value: ' + arg);
	            }

	            return new Uint8Array(arg);
	        }

	        // Something else, but behaves like an array (maybe a Buffer? Arguments?)
	        if (checkInt(arg.length) && checkInts(arg)) {
	            return new Uint8Array(arg);
	        }

	        throw new Error('unsupported array-like object');
	    }

	    function createArray(length) {
	        return new Uint8Array(length);
	    }

	    function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
	        if (sourceStart != null || sourceEnd != null) {
	            if (sourceArray.slice) {
	                sourceArray = sourceArray.slice(sourceStart, sourceEnd);
	            } else {
	                sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
	            }
	        }
	        targetArray.set(sourceArray, targetStart);
	    }



	    var convertUtf8 = (function() {
	        function toBytes(text) {
	            var result = [], i = 0;
	            text = encodeURI(text);
	            while (i < text.length) {
	                var c = text.charCodeAt(i++);

	                // if it is a % sign, encode the following 2 bytes as a hex value
	                if (c === 37) {
	                    result.push(parseInt(text.substr(i, 2), 16));
	                    i += 2;

	                // otherwise, just the actual byte
	                } else {
	                    result.push(c);
	                }
	            }

	            return coerceArray(result);
	        }

	        function fromBytes(bytes) {
	            var result = [], i = 0;

	            while (i < bytes.length) {
	                var c = bytes[i];

	                if (c < 128) {
	                    result.push(String.fromCharCode(c));
	                    i++;
	                } else if (c > 191 && c < 224) {
	                    result.push(String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)));
	                    i += 2;
	                } else {
	                    result.push(String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)));
	                    i += 3;
	                }
	            }

	            return result.join('');
	        }

	        return {
	            toBytes: toBytes,
	            fromBytes: fromBytes,
	        }
	    })();

	    var convertHex = (function() {
	        function toBytes(text) {
	            var result = [];
	            for (var i = 0; i < text.length; i += 2) {
	                result.push(parseInt(text.substr(i, 2), 16));
	            }

	            return result;
	        }

	        // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
	        var Hex = '0123456789abcdef';

	        function fromBytes(bytes) {
	                var result = [];
	                for (var i = 0; i < bytes.length; i++) {
	                    var v = bytes[i];
	                    result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
	                }
	                return result.join('');
	        }

	        return {
	            toBytes: toBytes,
	            fromBytes: fromBytes,
	        }
	    })();


	    // Number of rounds by keysize
	    var numberOfRounds = {16: 10, 24: 12, 32: 14};

	    // Round constant words
	    var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];

	    // S-box and Inverse S-box (S is for Substitution)
	    var S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
	    var Si =[0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];

	    // Transformations for encryption
	    var T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
	    var T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
	    var T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
	    var T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];

	    // Transformations for decryption
	    var T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
	    var T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
	    var T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
	    var T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];

	    // Transformations for decryption key expansion
	    var U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
	    var U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
	    var U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
	    var U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];

	    function convertToInt32(bytes) {
	        var result = [];
	        for (var i = 0; i < bytes.length; i += 4) {
	            result.push(
	                (bytes[i    ] << 24) |
	                (bytes[i + 1] << 16) |
	                (bytes[i + 2] <<  8) |
	                 bytes[i + 3]
	            );
	        }
	        return result;
	    }

	    var AES = function(key) {
	        if (!(this instanceof AES)) {
	            throw Error('AES must be instanitated with `new`');
	        }

	        Object.defineProperty(this, 'key', {
	            value: coerceArray(key, true)
	        });

	        this._prepare();
	    };


	    AES.prototype._prepare = function() {

	        var rounds = numberOfRounds[this.key.length];
	        if (rounds == null) {
	            throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
	        }

	        // encryption round keys
	        this._Ke = [];

	        // decryption round keys
	        this._Kd = [];

	        for (var i = 0; i <= rounds; i++) {
	            this._Ke.push([0, 0, 0, 0]);
	            this._Kd.push([0, 0, 0, 0]);
	        }

	        var roundKeyCount = (rounds + 1) * 4;
	        var KC = this.key.length / 4;

	        // convert the key into ints
	        var tk = convertToInt32(this.key);

	        // copy values into round key arrays
	        var index;
	        for (var i = 0; i < KC; i++) {
	            index = i >> 2;
	            this._Ke[index][i % 4] = tk[i];
	            this._Kd[rounds - index][i % 4] = tk[i];
	        }

	        // key expansion (fips-197 section 5.2)
	        var rconpointer = 0;
	        var t = KC, tt;
	        while (t < roundKeyCount) {
	            tt = tk[KC - 1];
	            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
	                      (S[(tt >>  8) & 0xFF] << 16) ^
	                      (S[ tt        & 0xFF] <<  8) ^
	                       S[(tt >> 24) & 0xFF]        ^
	                      (rcon[rconpointer] << 24));
	            rconpointer += 1;

	            // key expansion (for non-256 bit)
	            if (KC != 8) {
	                for (var i = 1; i < KC; i++) {
	                    tk[i] ^= tk[i - 1];
	                }

	            // key expansion for 256-bit keys is "slightly different" (fips-197)
	            } else {
	                for (var i = 1; i < (KC / 2); i++) {
	                    tk[i] ^= tk[i - 1];
	                }
	                tt = tk[(KC / 2) - 1];

	                tk[KC / 2] ^= (S[ tt        & 0xFF]        ^
	                              (S[(tt >>  8) & 0xFF] <<  8) ^
	                              (S[(tt >> 16) & 0xFF] << 16) ^
	                              (S[(tt >> 24) & 0xFF] << 24));

	                for (var i = (KC / 2) + 1; i < KC; i++) {
	                    tk[i] ^= tk[i - 1];
	                }
	            }

	            // copy values into round key arrays
	            var i = 0, r, c;
	            while (i < KC && t < roundKeyCount) {
	                r = t >> 2;
	                c = t % 4;
	                this._Ke[r][c] = tk[i];
	                this._Kd[rounds - r][c] = tk[i++];
	                t++;
	            }
	        }

	        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
	        for (var r = 1; r < rounds; r++) {
	            for (var c = 0; c < 4; c++) {
	                tt = this._Kd[r][c];
	                this._Kd[r][c] = (U1[(tt >> 24) & 0xFF] ^
	                                  U2[(tt >> 16) & 0xFF] ^
	                                  U3[(tt >>  8) & 0xFF] ^
	                                  U4[ tt        & 0xFF]);
	            }
	        }
	    };

	    AES.prototype.encrypt = function(plaintext) {
	        if (plaintext.length != 16) {
	            throw new Error('invalid plaintext size (must be 16 bytes)');
	        }

	        var rounds = this._Ke.length - 1;
	        var a = [0, 0, 0, 0];

	        // convert plaintext to (ints ^ key)
	        var t = convertToInt32(plaintext);
	        for (var i = 0; i < 4; i++) {
	            t[i] ^= this._Ke[0][i];
	        }

	        // apply round transforms
	        for (var r = 1; r < rounds; r++) {
	            for (var i = 0; i < 4; i++) {
	                a[i] = (T1[(t[ i         ] >> 24) & 0xff] ^
	                        T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
	                        T3[(t[(i + 2) % 4] >>  8) & 0xff] ^
	                        T4[ t[(i + 3) % 4]        & 0xff] ^
	                        this._Ke[r][i]);
	            }
	            t = a.slice();
	        }

	        // the last round is special
	        var result = createArray(16), tt;
	        for (var i = 0; i < 4; i++) {
	            tt = this._Ke[rounds][i];
	            result[4 * i    ] = (S[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
	            result[4 * i + 1] = (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
	            result[4 * i + 2] = (S[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
	            result[4 * i + 3] = (S[ t[(i + 3) % 4]        & 0xff] ^  tt       ) & 0xff;
	        }

	        return result;
	    };

	    AES.prototype.decrypt = function(ciphertext) {
	        if (ciphertext.length != 16) {
	            throw new Error('invalid ciphertext size (must be 16 bytes)');
	        }

	        var rounds = this._Kd.length - 1;
	        var a = [0, 0, 0, 0];

	        // convert plaintext to (ints ^ key)
	        var t = convertToInt32(ciphertext);
	        for (var i = 0; i < 4; i++) {
	            t[i] ^= this._Kd[0][i];
	        }

	        // apply round transforms
	        for (var r = 1; r < rounds; r++) {
	            for (var i = 0; i < 4; i++) {
	                a[i] = (T5[(t[ i          ] >> 24) & 0xff] ^
	                        T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
	                        T7[(t[(i + 2) % 4] >>  8) & 0xff] ^
	                        T8[ t[(i + 1) % 4]        & 0xff] ^
	                        this._Kd[r][i]);
	            }
	            t = a.slice();
	        }

	        // the last round is special
	        var result = createArray(16), tt;
	        for (var i = 0; i < 4; i++) {
	            tt = this._Kd[rounds][i];
	            result[4 * i    ] = (Si[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
	            result[4 * i + 1] = (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
	            result[4 * i + 2] = (Si[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
	            result[4 * i + 3] = (Si[ t[(i + 1) % 4]        & 0xff] ^  tt       ) & 0xff;
	        }

	        return result;
	    };


	    /**
	     *  Mode Of Operation - Electonic Codebook (ECB)
	     */
	    var ModeOfOperationECB = function(key) {
	        if (!(this instanceof ModeOfOperationECB)) {
	            throw Error('AES must be instanitated with `new`');
	        }

	        this.description = "Electronic Code Block";
	        this.name = "ecb";

	        this._aes = new AES(key);
	    };

	    ModeOfOperationECB.prototype.encrypt = function(plaintext) {
	        plaintext = coerceArray(plaintext);

	        if ((plaintext.length % 16) !== 0) {
	            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
	        }

	        var ciphertext = createArray(plaintext.length);
	        var block = createArray(16);

	        for (var i = 0; i < plaintext.length; i += 16) {
	            copyArray(plaintext, block, 0, i, i + 16);
	            block = this._aes.encrypt(block);
	            copyArray(block, ciphertext, i);
	        }

	        return ciphertext;
	    };

	    ModeOfOperationECB.prototype.decrypt = function(ciphertext) {
	        ciphertext = coerceArray(ciphertext);

	        if ((ciphertext.length % 16) !== 0) {
	            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
	        }

	        var plaintext = createArray(ciphertext.length);
	        var block = createArray(16);

	        for (var i = 0; i < ciphertext.length; i += 16) {
	            copyArray(ciphertext, block, 0, i, i + 16);
	            block = this._aes.decrypt(block);
	            copyArray(block, plaintext, i);
	        }

	        return plaintext;
	    };


	    /**
	     *  Mode Of Operation - Cipher Block Chaining (CBC)
	     */
	    var ModeOfOperationCBC = function(key, iv) {
	        if (!(this instanceof ModeOfOperationCBC)) {
	            throw Error('AES must be instanitated with `new`');
	        }

	        this.description = "Cipher Block Chaining";
	        this.name = "cbc";

	        if (!iv) {
	            iv = createArray(16);

	        } else if (iv.length != 16) {
	            throw new Error('invalid initialation vector size (must be 16 bytes)');
	        }

	        this._lastCipherblock = coerceArray(iv, true);

	        this._aes = new AES(key);
	    };

	    ModeOfOperationCBC.prototype.encrypt = function(plaintext) {
	        plaintext = coerceArray(plaintext);

	        if ((plaintext.length % 16) !== 0) {
	            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
	        }

	        var ciphertext = createArray(plaintext.length);
	        var block = createArray(16);

	        for (var i = 0; i < plaintext.length; i += 16) {
	            copyArray(plaintext, block, 0, i, i + 16);

	            for (var j = 0; j < 16; j++) {
	                block[j] ^= this._lastCipherblock[j];
	            }

	            this._lastCipherblock = this._aes.encrypt(block);
	            copyArray(this._lastCipherblock, ciphertext, i);
	        }

	        return ciphertext;
	    };

	    ModeOfOperationCBC.prototype.decrypt = function(ciphertext) {
	        ciphertext = coerceArray(ciphertext);

	        if ((ciphertext.length % 16) !== 0) {
	            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
	        }

	        var plaintext = createArray(ciphertext.length);
	        var block = createArray(16);

	        for (var i = 0; i < ciphertext.length; i += 16) {
	            copyArray(ciphertext, block, 0, i, i + 16);
	            block = this._aes.decrypt(block);

	            for (var j = 0; j < 16; j++) {
	                plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
	            }

	            copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
	        }

	        return plaintext;
	    };


	    /**
	     *  Mode Of Operation - Cipher Feedback (CFB)
	     */
	    var ModeOfOperationCFB = function(key, iv, segmentSize) {
	        if (!(this instanceof ModeOfOperationCFB)) {
	            throw Error('AES must be instanitated with `new`');
	        }

	        this.description = "Cipher Feedback";
	        this.name = "cfb";

	        if (!iv) {
	            iv = createArray(16);

	        } else if (iv.length != 16) {
	            throw new Error('invalid initialation vector size (must be 16 size)');
	        }

	        if (!segmentSize) { segmentSize = 1; }

	        this.segmentSize = segmentSize;

	        this._shiftRegister = coerceArray(iv, true);

	        this._aes = new AES(key);
	    };

	    ModeOfOperationCFB.prototype.encrypt = function(plaintext) {
	        if ((plaintext.length % this.segmentSize) != 0) {
	            throw new Error('invalid plaintext size (must be segmentSize bytes)');
	        }

	        var encrypted = coerceArray(plaintext, true);

	        var xorSegment;
	        for (var i = 0; i < encrypted.length; i += this.segmentSize) {
	            xorSegment = this._aes.encrypt(this._shiftRegister);
	            for (var j = 0; j < this.segmentSize; j++) {
	                encrypted[i + j] ^= xorSegment[j];
	            }

	            // Shift the register
	            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
	            copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
	        }

	        return encrypted;
	    };

	    ModeOfOperationCFB.prototype.decrypt = function(ciphertext) {
	        if ((ciphertext.length % this.segmentSize) != 0) {
	            throw new Error('invalid ciphertext size (must be segmentSize bytes)');
	        }

	        var plaintext = coerceArray(ciphertext, true);

	        var xorSegment;
	        for (var i = 0; i < plaintext.length; i += this.segmentSize) {
	            xorSegment = this._aes.encrypt(this._shiftRegister);

	            for (var j = 0; j < this.segmentSize; j++) {
	                plaintext[i + j] ^= xorSegment[j];
	            }

	            // Shift the register
	            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
	            copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
	        }

	        return plaintext;
	    };

	    /**
	     *  Mode Of Operation - Output Feedback (OFB)
	     */
	    var ModeOfOperationOFB = function(key, iv) {
	        if (!(this instanceof ModeOfOperationOFB)) {
	            throw Error('AES must be instanitated with `new`');
	        }

	        this.description = "Output Feedback";
	        this.name = "ofb";

	        if (!iv) {
	            iv = createArray(16);

	        } else if (iv.length != 16) {
	            throw new Error('invalid initialation vector size (must be 16 bytes)');
	        }

	        this._lastPrecipher = coerceArray(iv, true);
	        this._lastPrecipherIndex = 16;

	        this._aes = new AES(key);
	    };

	    ModeOfOperationOFB.prototype.encrypt = function(plaintext) {
	        var encrypted = coerceArray(plaintext, true);

	        for (var i = 0; i < encrypted.length; i++) {
	            if (this._lastPrecipherIndex === 16) {
	                this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
	                this._lastPrecipherIndex = 0;
	            }
	            encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
	        }

	        return encrypted;
	    };

	    // Decryption is symetric
	    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


	    /**
	     *  Counter object for CTR common mode of operation
	     */
	    var Counter = function(initialValue) {
	        if (!(this instanceof Counter)) {
	            throw Error('Counter must be instanitated with `new`');
	        }

	        // We allow 0, but anything false-ish uses the default 1
	        if (initialValue !== 0 && !initialValue) { initialValue = 1; }

	        if (typeof(initialValue) === 'number') {
	            this._counter = createArray(16);
	            this.setValue(initialValue);

	        } else {
	            this.setBytes(initialValue);
	        }
	    };

	    Counter.prototype.setValue = function(value) {
	        if (typeof(value) !== 'number' || parseInt(value) != value) {
	            throw new Error('invalid counter value (must be an integer)');
	        }

	        for (var index = 15; index >= 0; --index) {
	            this._counter[index] = value % 256;
	            value = value >> 8;
	        }
	    };

	    Counter.prototype.setBytes = function(bytes) {
	        bytes = coerceArray(bytes, true);

	        if (bytes.length != 16) {
	            throw new Error('invalid counter bytes size (must be 16 bytes)');
	        }

	        this._counter = bytes;
	    };

	    Counter.prototype.increment = function() {
	        for (var i = 15; i >= 0; i--) {
	            if (this._counter[i] === 255) {
	                this._counter[i] = 0;
	            } else {
	                this._counter[i]++;
	                break;
	            }
	        }
	    };


	    /**
	     *  Mode Of Operation - Counter (CTR)
	     */
	    var ModeOfOperationCTR = function(key, counter) {
	        if (!(this instanceof ModeOfOperationCTR)) {
	            throw Error('AES must be instanitated with `new`');
	        }

	        this.description = "Counter";
	        this.name = "ctr";

	        if (!(counter instanceof Counter)) {
	            counter = new Counter(counter);
	        }

	        this._counter = counter;

	        this._remainingCounter = null;
	        this._remainingCounterIndex = 16;

	        this._aes = new AES(key);
	    };

	    ModeOfOperationCTR.prototype.encrypt = function(plaintext) {
	        var encrypted = coerceArray(plaintext, true);

	        for (var i = 0; i < encrypted.length; i++) {
	            if (this._remainingCounterIndex === 16) {
	                this._remainingCounter = this._aes.encrypt(this._counter._counter);
	                this._remainingCounterIndex = 0;
	                this._counter.increment();
	            }
	            encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
	        }

	        return encrypted;
	    };

	    // Decryption is symetric
	    ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;


	    ///////////////////////
	    // Padding

	    // See:https://tools.ietf.org/html/rfc2315
	    function pkcs7pad(data) {
	        data = coerceArray(data, true);
	        var padder = 16 - (data.length % 16);
	        var result = createArray(data.length + padder);
	        copyArray(data, result);
	        for (var i = data.length; i < result.length; i++) {
	            result[i] = padder;
	        }
	        return result;
	    }

	    function pkcs7strip(data) {
	        data = coerceArray(data, true);
	        if (data.length < 16) { throw new Error('PKCS#7 invalid length'); }

	        var padder = data[data.length - 1];
	        if (padder > 16) { throw new Error('PKCS#7 padding byte out of range'); }

	        var length = data.length - padder;
	        for (var i = 0; i < padder; i++) {
	            if (data[length + i] !== padder) {
	                throw new Error('PKCS#7 invalid padding byte');
	            }
	        }

	        var result = createArray(length);
	        copyArray(data, result, 0, 0, length);
	        return result;
	    }

	    ///////////////////////
	    // Exporting


	    // The block cipher
	    var aesjs = {
	        AES: AES,
	        Counter: Counter,

	        ModeOfOperation: {
	            ecb: ModeOfOperationECB,
	            cbc: ModeOfOperationCBC,
	            cfb: ModeOfOperationCFB,
	            ofb: ModeOfOperationOFB,
	            ctr: ModeOfOperationCTR
	        },

	        utils: {
	            hex: convertHex,
	            utf8: convertUtf8
	        },

	        padding: {
	            pkcs7: {
	                pad: pkcs7pad,
	                strip: pkcs7strip
	            }
	        },

	        _arrayTest: {
	            coerceArray: coerceArray,
	            createArray: createArray,
	            copyArray: copyArray,
	        }
	    };


	    // node.js
	    if ('object' !== 'undefined') {
	        module.exports = aesjs;

	    // RequireJS/AMD
	    // http://www.requirejs.org/docs/api.html
	    // https://github.com/amdjs/amdjs-api/wiki/AMD
	    } else if (typeof(undefined) === 'function' && undefined.amd) {
	        undefined(aesjs);

	    // Web Browsers
	    } else {

	        // If there was an existing library at "aesjs" make sure it's still available
	        if (root.aesjs) {
	            aesjs._aesjs = root.aesjs;
	        }

	        root.aesjs = aesjs;
	    }


	})(commonjsGlobal);
	});

	var _version$A = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "json-wallets/5.0.2";

	});

	var _version$B = unwrapExports(_version$A);
	var _version_1$i = _version$A.version;

	var utils$1 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });


	function looseArrayify(hexString) {
	    if (typeof (hexString) === 'string' && hexString.substring(0, 2) !== '0x') {
	        hexString = '0x' + hexString;
	    }
	    return lib$1.arrayify(hexString);
	}
	exports.looseArrayify = looseArrayify;
	function zpad(value, length) {
	    value = String(value);
	    while (value.length < length) {
	        value = '0' + value;
	    }
	    return value;
	}
	exports.zpad = zpad;
	function getPassword(password) {
	    if (typeof (password) === 'string') {
	        return lib$8.toUtf8Bytes(password, lib$8.UnicodeNormalizationForm.NFKC);
	    }
	    return lib$1.arrayify(password);
	}
	exports.getPassword = getPassword;
	function searchPath(object, path) {
	    var currentChild = object;
	    var comps = path.toLowerCase().split('/');
	    for (var i = 0; i < comps.length; i++) {
	        // Search for a child object with a case-insensitive matching key
	        var matchingChild = null;
	        for (var key in currentChild) {
	            if (key.toLowerCase() === comps[i]) {
	                matchingChild = currentChild[key];
	                break;
	            }
	        }
	        // Didn't find one. :'(
	        if (matchingChild === null) {
	            return null;
	        }
	        // Now check this child...
	        currentChild = matchingChild;
	    }
	    return currentChild;
	}
	exports.searchPath = searchPath;

	});

	var utils$2 = unwrapExports(utils$1);
	var utils_1$2 = utils$1.looseArrayify;
	var utils_2 = utils$1.zpad;
	var utils_3 = utils$1.getPassword;
	var utils_4 = utils$1.searchPath;

	var crowdsale = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var aes_js_1 = __importDefault(aesJs);








	var logger = new lib.Logger(_version$A.version);

	var CrowdsaleAccount = /** @class */ (function (_super) {
	    __extends(CrowdsaleAccount, _super);
	    function CrowdsaleAccount() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    CrowdsaleAccount.prototype.isCrowdsaleAccount = function (value) {
	        return !!(value && value._isCrowdsaleAccount);
	    };
	    return CrowdsaleAccount;
	}(lib$3.Description));
	exports.CrowdsaleAccount = CrowdsaleAccount;
	// See: https://github.com/ethereum/pyethsaletool
	function decrypt(json, password) {
	    var data = JSON.parse(json);
	    password = utils$1.getPassword(password);
	    // Ethereum Address
	    var ethaddr = lib$6.getAddress(utils$1.searchPath(data, "ethaddr"));
	    // Encrypted Seed
	    var encseed = utils$1.looseArrayify(utils$1.searchPath(data, "encseed"));
	    if (!encseed || (encseed.length % 16) !== 0) {
	        logger.throwArgumentError("invalid encseed", "json", json);
	    }
	    var key = lib$1.arrayify(browser$2.pbkdf2(password, password, 2000, 32, "sha256")).slice(0, 16);
	    var iv = encseed.slice(0, 16);
	    var encryptedSeed = encseed.slice(16);
	    // Decrypt the seed
	    var aesCbc = new aes_js_1.default.ModeOfOperation.cbc(key, iv);
	    var seed = aes_js_1.default.padding.pkcs7.strip(lib$1.arrayify(aesCbc.decrypt(encryptedSeed)));
	    // This wallet format is weird... Convert the binary encoded hex to a string.
	    var seedHex = "";
	    for (var i = 0; i < seed.length; i++) {
	        seedHex += String.fromCharCode(seed[i]);
	    }
	    var seedHexBytes = lib$8.toUtf8Bytes(seedHex);
	    var privateKey = lib$4.keccak256(seedHexBytes);
	    return new CrowdsaleAccount({
	        _isCrowdsaleAccount: true,
	        address: ethaddr,
	        privateKey: privateKey
	    });
	}
	exports.decrypt = decrypt;

	});

	var crowdsale$1 = unwrapExports(crowdsale);
	var crowdsale_1 = crowdsale.CrowdsaleAccount;
	var crowdsale_2 = crowdsale.decrypt;

	var inspect = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });

	function isCrowdsaleWallet(json) {
	    var data = null;
	    try {
	        data = JSON.parse(json);
	    }
	    catch (error) {
	        return false;
	    }
	    return (data.encseed && data.ethaddr);
	}
	exports.isCrowdsaleWallet = isCrowdsaleWallet;
	function isKeystoreWallet(json) {
	    var data = null;
	    try {
	        data = JSON.parse(json);
	    }
	    catch (error) {
	        return false;
	    }
	    if (!data.version || parseInt(data.version) !== data.version || parseInt(data.version) !== 3) {
	        return false;
	    }
	    // @TODO: Put more checks to make sure it has kdf, iv and all that good stuff
	    return true;
	}
	exports.isKeystoreWallet = isKeystoreWallet;
	//export function isJsonWallet(json: string): boolean {
	//    return (isSecretStorageWallet(json) || isCrowdsaleWallet(json));
	//}
	function getJsonWalletAddress(json) {
	    if (isCrowdsaleWallet(json)) {
	        try {
	            return lib$6.getAddress(JSON.parse(json).ethaddr);
	        }
	        catch (error) {
	            return null;
	        }
	    }
	    if (isKeystoreWallet(json)) {
	        try {
	            return lib$6.getAddress(JSON.parse(json).address);
	        }
	        catch (error) {
	            return null;
	        }
	    }
	    return null;
	}
	exports.getJsonWalletAddress = getJsonWalletAddress;

	});

	var inspect$1 = unwrapExports(inspect);
	var inspect_1 = inspect.isCrowdsaleWallet;
	var inspect_2 = inspect.isKeystoreWallet;
	var inspect_3 = inspect.getJsonWalletAddress;

	var scrypt = createCommonjsModule(function (module, exports) {
	"use strict";

	(function(root) {
	    const MAX_VALUE = 0x7fffffff;

	    // The SHA256 and PBKDF2 implementation are from scrypt-async-js:
	    // See: https://github.com/dchest/scrypt-async-js
	    function SHA256(m) {
	        const K = new Uint32Array([
	           0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
	           0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
	           0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
	           0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
	           0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
	           0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
	           0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
	           0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	           0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
	           0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
	           0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
	           0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
	           0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	       ]);

	        let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
	        let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
	        const w = new Uint32Array(64);

	        function blocks(p) {
	            let off = 0, len = p.length;
	            while (len >= 64) {
	                let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7, u, i, j, t1, t2;

	                for (i = 0; i < 16; i++) {
	                    j = off + i*4;
	                    w[i] = ((p[j] & 0xff)<<24) | ((p[j+1] & 0xff)<<16) |
	                    ((p[j+2] & 0xff)<<8) | (p[j+3] & 0xff);
	                }

	                for (i = 16; i < 64; i++) {
	                    u = w[i-2];
	                    t1 = ((u>>>17) | (u<<(32-17))) ^ ((u>>>19) | (u<<(32-19))) ^ (u>>>10);

	                    u = w[i-15];
	                    t2 = ((u>>>7) | (u<<(32-7))) ^ ((u>>>18) | (u<<(32-18))) ^ (u>>>3);

	                    w[i] = (((t1 + w[i-7]) | 0) + ((t2 + w[i-16]) | 0)) | 0;
	                }

	                for (i = 0; i < 64; i++) {
	                    t1 = ((((((e>>>6) | (e<<(32-6))) ^ ((e>>>11) | (e<<(32-11))) ^
	                             ((e>>>25) | (e<<(32-25)))) + ((e & f) ^ (~e & g))) | 0) +
	                          ((h + ((K[i] + w[i]) | 0)) | 0)) | 0;

	                    t2 = ((((a>>>2) | (a<<(32-2))) ^ ((a>>>13) | (a<<(32-13))) ^
	                           ((a>>>22) | (a<<(32-22)))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;

	                    h = g;
	                    g = f;
	                    f = e;
	                    e = (d + t1) | 0;
	                    d = c;
	                    c = b;
	                    b = a;
	                    a = (t1 + t2) | 0;
	                }

	                h0 = (h0 + a) | 0;
	                h1 = (h1 + b) | 0;
	                h2 = (h2 + c) | 0;
	                h3 = (h3 + d) | 0;
	                h4 = (h4 + e) | 0;
	                h5 = (h5 + f) | 0;
	                h6 = (h6 + g) | 0;
	                h7 = (h7 + h) | 0;

	                off += 64;
	                len -= 64;
	            }
	        }

	        blocks(m);

	        let i, bytesLeft = m.length % 64,
	        bitLenHi = (m.length / 0x20000000) | 0,
	        bitLenLo = m.length << 3,
	        numZeros = (bytesLeft < 56) ? 56 : 120,
	        p = m.slice(m.length - bytesLeft, m.length);

	        p.push(0x80);
	        for (i = bytesLeft + 1; i < numZeros; i++) { p.push(0); }
	        p.push((bitLenHi >>> 24) & 0xff);
	        p.push((bitLenHi >>> 16) & 0xff);
	        p.push((bitLenHi >>> 8)  & 0xff);
	        p.push((bitLenHi >>> 0)  & 0xff);
	        p.push((bitLenLo >>> 24) & 0xff);
	        p.push((bitLenLo >>> 16) & 0xff);
	        p.push((bitLenLo >>> 8)  & 0xff);
	        p.push((bitLenLo >>> 0)  & 0xff);

	        blocks(p);

	        return [
	            (h0 >>> 24) & 0xff, (h0 >>> 16) & 0xff, (h0 >>> 8) & 0xff, (h0 >>> 0) & 0xff,
	            (h1 >>> 24) & 0xff, (h1 >>> 16) & 0xff, (h1 >>> 8) & 0xff, (h1 >>> 0) & 0xff,
	            (h2 >>> 24) & 0xff, (h2 >>> 16) & 0xff, (h2 >>> 8) & 0xff, (h2 >>> 0) & 0xff,
	            (h3 >>> 24) & 0xff, (h3 >>> 16) & 0xff, (h3 >>> 8) & 0xff, (h3 >>> 0) & 0xff,
	            (h4 >>> 24) & 0xff, (h4 >>> 16) & 0xff, (h4 >>> 8) & 0xff, (h4 >>> 0) & 0xff,
	            (h5 >>> 24) & 0xff, (h5 >>> 16) & 0xff, (h5 >>> 8) & 0xff, (h5 >>> 0) & 0xff,
	            (h6 >>> 24) & 0xff, (h6 >>> 16) & 0xff, (h6 >>> 8) & 0xff, (h6 >>> 0) & 0xff,
	            (h7 >>> 24) & 0xff, (h7 >>> 16) & 0xff, (h7 >>> 8) & 0xff, (h7 >>> 0) & 0xff
	        ];
	    }

	    function PBKDF2_HMAC_SHA256_OneIter(password, salt, dkLen) {
	        // compress password if it's longer than hash block length
	        password = (password.length <= 64) ? password : SHA256(password);

	        const innerLen = 64 + salt.length + 4;
	        const inner = new Array(innerLen);
	        const outerKey = new Array(64);

	        let i;
	        let dk = [];

	        // inner = (password ^ ipad) || salt || counter
	        for (i = 0; i < 64; i++) { inner[i] = 0x36; }
	        for (i = 0; i < password.length; i++) { inner[i] ^= password[i]; }
	        for (i = 0; i < salt.length; i++) { inner[64 + i] = salt[i]; }
	        for (i = innerLen - 4; i < innerLen; i++) { inner[i] = 0; }

	        // outerKey = password ^ opad
	        for (i = 0; i < 64; i++) outerKey[i] = 0x5c;
	        for (i = 0; i < password.length; i++) outerKey[i] ^= password[i];

	        // increments counter inside inner
	        function incrementCounter() {
	            for (let i = innerLen - 1; i >= innerLen - 4; i--) {
	                inner[i]++;
	                if (inner[i] <= 0xff) return;
	                inner[i] = 0;
	            }
	        }

	        // output blocks = SHA256(outerKey || SHA256(inner)) ...
	        while (dkLen >= 32) {
	            incrementCounter();
	            dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))));
	            dkLen -= 32;
	        }
	        if (dkLen > 0) {
	            incrementCounter();
	            dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))).slice(0, dkLen));
	        }

	        return dk;
	    }

	    // The following is an adaptation of scryptsy
	    // See: https://www.npmjs.com/package/scryptsy
	    function blockmix_salsa8(BY, Yi, r, x, _X) {
	        let i;

	        arraycopy(BY, (2 * r - 1) * 16, _X, 0, 16);
	        for (i = 0; i < 2 * r; i++) {
	            blockxor(BY, i * 16, _X, 16);
	            salsa20_8(_X, x);
	            arraycopy(_X, 0, BY, Yi + (i * 16), 16);
	        }

	        for (i = 0; i < r; i++) {
	            arraycopy(BY, Yi + (i * 2) * 16, BY, (i * 16), 16);
	        }

	        for (i = 0; i < r; i++) {
	            arraycopy(BY, Yi + (i * 2 + 1) * 16, BY, (i + r) * 16, 16);
	        }
	    }

	    function R(a, b) {
	        return (a << b) | (a >>> (32 - b));
	    }

	    function salsa20_8(B, x) {
	        arraycopy(B, 0, x, 0, 16);

	        for (let i = 8; i > 0; i -= 2) {
	            x[ 4] ^= R(x[ 0] + x[12], 7);
	            x[ 8] ^= R(x[ 4] + x[ 0], 9);
	            x[12] ^= R(x[ 8] + x[ 4], 13);
	            x[ 0] ^= R(x[12] + x[ 8], 18);
	            x[ 9] ^= R(x[ 5] + x[ 1], 7);
	            x[13] ^= R(x[ 9] + x[ 5], 9);
	            x[ 1] ^= R(x[13] + x[ 9], 13);
	            x[ 5] ^= R(x[ 1] + x[13], 18);
	            x[14] ^= R(x[10] + x[ 6], 7);
	            x[ 2] ^= R(x[14] + x[10], 9);
	            x[ 6] ^= R(x[ 2] + x[14], 13);
	            x[10] ^= R(x[ 6] + x[ 2], 18);
	            x[ 3] ^= R(x[15] + x[11], 7);
	            x[ 7] ^= R(x[ 3] + x[15], 9);
	            x[11] ^= R(x[ 7] + x[ 3], 13);
	            x[15] ^= R(x[11] + x[ 7], 18);
	            x[ 1] ^= R(x[ 0] + x[ 3], 7);
	            x[ 2] ^= R(x[ 1] + x[ 0], 9);
	            x[ 3] ^= R(x[ 2] + x[ 1], 13);
	            x[ 0] ^= R(x[ 3] + x[ 2], 18);
	            x[ 6] ^= R(x[ 5] + x[ 4], 7);
	            x[ 7] ^= R(x[ 6] + x[ 5], 9);
	            x[ 4] ^= R(x[ 7] + x[ 6], 13);
	            x[ 5] ^= R(x[ 4] + x[ 7], 18);
	            x[11] ^= R(x[10] + x[ 9], 7);
	            x[ 8] ^= R(x[11] + x[10], 9);
	            x[ 9] ^= R(x[ 8] + x[11], 13);
	            x[10] ^= R(x[ 9] + x[ 8], 18);
	            x[12] ^= R(x[15] + x[14], 7);
	            x[13] ^= R(x[12] + x[15], 9);
	            x[14] ^= R(x[13] + x[12], 13);
	            x[15] ^= R(x[14] + x[13], 18);
	        }

	        for (let i = 0; i < 16; ++i) {
	            B[i] += x[i];
	        }
	    }

	    // naive approach... going back to loop unrolling may yield additional performance
	    function blockxor(S, Si, D, len) {
	        for (let i = 0; i < len; i++) {
	            D[i] ^= S[Si + i];
	        }
	    }

	    function arraycopy(src, srcPos, dest, destPos, length) {
	        while (length--) {
	            dest[destPos++] = src[srcPos++];
	        }
	    }

	    function checkBufferish(o) {
	        if (!o || typeof(o.length) !== 'number') { return false; }

	        for (let i = 0; i < o.length; i++) {
	            const v = o[i];
	            if (typeof(v) !== 'number' || v % 1 || v < 0 || v >= 256) {
	                return false;
	            }
	        }

	        return true;
	    }

	    function ensureInteger(value, name) {
	        if (typeof(value) !== "number" || (value % 1)) { throw new Error('invalid ' + name); }
	        return value;
	    }

	    // N = Cpu cost, r = Memory cost, p = parallelization cost
	    // callback(error, progress, key)
	    function _scrypt(password, salt, N, r, p, dkLen, callback) {

	        N = ensureInteger(N, 'N');
	        r = ensureInteger(r, 'r');
	        p = ensureInteger(p, 'p');

	        dkLen = ensureInteger(dkLen, 'dkLen');

	        if (N === 0 || (N & (N - 1)) !== 0) { throw new Error('N must be power of 2'); }

	        if (N > MAX_VALUE / 128 / r) { throw new Error('N too large'); }
	        if (r > MAX_VALUE / 128 / p) { throw new Error('r too large'); }

	        if (!checkBufferish(password)) {
	            throw new Error('password must be an array or buffer');
	        }
	        password = Array.prototype.slice.call(password);

	        if (!checkBufferish(salt)) {
	            throw new Error('salt must be an array or buffer');
	        }
	        salt = Array.prototype.slice.call(salt);

	        let b = PBKDF2_HMAC_SHA256_OneIter(password, salt, p * 128 * r);
	        const B = new Uint32Array(p * 32 * r);
	        for (let i = 0; i < B.length; i++) {
	            const j = i * 4;
	            B[i] = ((b[j + 3] & 0xff) << 24) |
	                   ((b[j + 2] & 0xff) << 16) |
	                   ((b[j + 1] & 0xff) << 8) |
	                   ((b[j + 0] & 0xff) << 0);
	        }

	        const XY = new Uint32Array(64 * r);
	        const V = new Uint32Array(32 * r * N);

	        const Yi = 32 * r;

	        // scratch space
	        const x = new Uint32Array(16);       // salsa20_8
	        const _X = new Uint32Array(16);      // blockmix_salsa8

	        const totalOps = p * N * 2;
	        let currentOp = 0;
	        let lastPercent10 = null;

	        // Set this to true to abandon the scrypt on the next step
	        let stop = false;

	        // State information
	        let state = 0;
	        let i0 = 0, i1;
	        let Bi;

	        // How many blockmix_salsa8 can we do per step?
	        const limit = callback ? parseInt(1000 / r): 0xffffffff;

	        // Trick from scrypt-async; if there is a setImmediate shim in place, use it
	        const nextTick = (typeof(setImmediate) !== 'undefined') ? setImmediate : setTimeout;

	        // This is really all I changed; making scryptsy a state machine so we occasionally
	        // stop and give other evnts on the evnt loop a chance to run. ~RicMoo
	        const incrementalSMix = function() {
	            if (stop) {
	                return callback(new Error('cancelled'), currentOp / totalOps);
	            }

	            let steps;

	            switch (state) {
	                case 0:
	                    // for (var i = 0; i < p; i++)...
	                    Bi = i0 * 32 * r;

	                    arraycopy(B, Bi, XY, 0, Yi);                       // ROMix - 1

	                    state = 1;                                         // Move to ROMix 2
	                    i1 = 0;

	                    // Fall through

	                case 1:

	                    // Run up to 1000 steps of the first inner smix loop
	                    steps = N - i1;
	                    if (steps > limit) { steps = limit; }
	                    for (let i = 0; i < steps; i++) {                  // ROMix - 2
	                        arraycopy(XY, 0, V, (i1 + i) * Yi, Yi);         // ROMix - 3
	                        blockmix_salsa8(XY, Yi, r, x, _X);             // ROMix - 4
	                    }

	                    // for (var i = 0; i < N; i++)
	                    i1 += steps;
	                    currentOp += steps;

	                    if (callback) {
	                        // Call the callback with the progress (optionally stopping us)
	                        const percent10 = parseInt(1000 * currentOp / totalOps);
	                        if (percent10 !== lastPercent10) {
	                            stop = callback(null, currentOp / totalOps);
	                            if (stop) { break; }
	                            lastPercent10 = percent10;
	                        }
	                    }

	                    if (i1 < N) { break; }

	                    i1 = 0;                                          // Move to ROMix 6
	                    state = 2;

	                    // Fall through

	                case 2:

	                    // Run up to 1000 steps of the second inner smix loop
	                    steps = N - i1;
	                    if (steps > limit) { steps = limit; }
	                    for (let i = 0; i < steps; i++) {                // ROMix - 6
	                        const offset = (2 * r - 1) * 16;             // ROMix - 7
	                        const j = XY[offset] & (N - 1);
	                        blockxor(V, j * Yi, XY, Yi);                 // ROMix - 8 (inner)
	                        blockmix_salsa8(XY, Yi, r, x, _X);           // ROMix - 9 (outer)
	                    }

	                    // for (var i = 0; i < N; i++)...
	                    i1 += steps;
	                    currentOp += steps;

	                    // Call the callback with the progress (optionally stopping us)
	                    if (callback) {
	                        const percent10 = parseInt(1000 * currentOp / totalOps);
	                        if (percent10 !== lastPercent10) {
	                            stop = callback(null, currentOp / totalOps);
	                            if (stop) { break; }
	                            lastPercent10 = percent10;
	                        }
	                    }

	                    if (i1 < N) { break; }

	                    arraycopy(XY, 0, B, Bi, Yi);                     // ROMix - 10

	                    // for (var i = 0; i < p; i++)...
	                    i0++;
	                    if (i0 < p) {
	                        state = 0;
	                        break;
	                    }

	                    b = [];
	                    for (let i = 0; i < B.length; i++) {
	                        b.push((B[i] >>  0) & 0xff);
	                        b.push((B[i] >>  8) & 0xff);
	                        b.push((B[i] >> 16) & 0xff);
	                        b.push((B[i] >> 24) & 0xff);
	                    }

	                    const derivedKey = PBKDF2_HMAC_SHA256_OneIter(password, b, dkLen);

	                    // Send the result to the callback
	                    if (callback) { callback(null, 1.0, derivedKey); }

	                    // Done; don't break (which would reschedule)
	                    return derivedKey;
	            }

	            // Schedule the next steps
	            if (callback) { nextTick(incrementalSMix); }
	        };

	        // Run the smix state machine until completion
	        if (!callback) {
	            while (true) {
	                const derivedKey = incrementalSMix();
	                if (derivedKey != undefined) { return derivedKey; }
	            }
	        }

	        // Bootstrap the async incremental smix
	        incrementalSMix();
	    }

	    const lib = {
	        scrypt: function(password, salt, N, r, p, dkLen, progressCallback) {
	            return new Promise(function(resolve, reject) {
	                let lastProgress = 0;
	                if (progressCallback) { progressCallback(0); }
	                _scrypt(password, salt, N, r, p, dkLen, function(error, progress, key) {
	                    if (error) {
	                        reject(error);
	                    } else if (key) {
	                        if (progressCallback && lastProgress !== 1) {
	                            progressCallback(1);
	                        }
	                        resolve(new Uint8Array(key));
	                    } else if (progressCallback && progress !== lastProgress) {
	                        lastProgress = progress;
	                        return progressCallback(progress);
	                    }
	                });
	            });
	        },
	        syncScrypt: function(password, salt, N, r, p, dkLen) {
	            return new Uint8Array(_scrypt(password, salt, N, r, p, dkLen));
	        }
	    };

	    // node.js
	    if ('object' !== 'undefined') {
	       module.exports = lib;

	    // RequireJS/AMD
	    // http://www.requirejs.org/docs/api.html
	    // https://github.com/amdjs/amdjs-api/wiki/AMD
	    } else if (typeof(undefined) === 'function' && undefined.amd) {
	        undefined(lib);

	    // Web Browsers
	    } else if (root) {

	        // If there was an existing library "scrypt", make sure it is still available
	        if (root.scrypt) {
	            root._scrypt = root.scrypt;
	        }

	        root.scrypt = lib;
	    }

	})(commonjsGlobal);
	});
	var scrypt_1 = scrypt.scrypt;
	var scrypt_2 = scrypt.syncScrypt;

	var rng;

	if (commonjsGlobal.crypto && crypto.getRandomValues) {
	  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	  // Moderately fast, high quality
	  var _rnds8 = new Uint8Array(16);
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(_rnds8);
	    return _rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var  _rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return _rnds;
	  };
	}

	var rngBrowser = rng;

	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php

	// Unique ID creation requires a high quality random # generator.  We feature
	// detect to determine the best RNG source, normalizing to a function that
	// returns 128-bits of randomness, since that's what's usually required


	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}

	// **`parse()` - Parse a UUID into it's component bytes**
	function parse(s, buf, offset) {
	  var i = (buf && offset) || 0, ii = 0;

	  buf = buf || [];
	  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	    if (ii < 16) { // Don't overflow!
	      buf[i + ii++] = _hexToByte[oct];
	    }
	  });

	  // Zero out remaining bytes if string was short
	  while (ii < 16) {
	    buf[i + ii++] = 0;
	  }

	  return buf;
	}

	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf, offset) {
	  var i = offset || 0, bth = _byteToHex;
	  return  bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	// random #'s we need to init node and clockseq
	var _seedBytes = rngBrowser();

	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];

	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};

	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; n++) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : unparse(b);
	}

	// **`v4()` - Generate random UUID**

	// See https://github.com/broofa/node-uuid for API details
	function v4(options, buf, offset) {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || rngBrowser)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ii++) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || unparse(rnds);
	}

	// Export public API
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	uuid.parse = parse;
	uuid.unparse = unparse;

	var uuid_1 = uuid;

	var keystore = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result["default"] = mod;
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var aes_js_1 = __importDefault(aesJs);
	var scrypt$1 = __importStar(scrypt);
	var uuid_1$1 = __importDefault(uuid_1);











	var logger = new lib.Logger(_version$A.version);
	// Exported Types
	function hasMnemonic(value) {
	    return (value != null && value.mnemonic && value.mnemonic.phrase);
	}
	var KeystoreAccount = /** @class */ (function (_super) {
	    __extends(KeystoreAccount, _super);
	    function KeystoreAccount() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    KeystoreAccount.prototype.isKeystoreAccount = function (value) {
	        return !!(value && value._isKeystoreAccount);
	    };
	    return KeystoreAccount;
	}(lib$3.Description));
	exports.KeystoreAccount = KeystoreAccount;
	function _decrypt(data, key, ciphertext) {
	    var cipher = utils$1.searchPath(data, "crypto/cipher");
	    if (cipher === "aes-128-ctr") {
	        var iv = utils$1.looseArrayify(utils$1.searchPath(data, "crypto/cipherparams/iv"));
	        var counter = new aes_js_1.default.Counter(iv);
	        var aesCtr = new aes_js_1.default.ModeOfOperation.ctr(key, counter);
	        return lib$1.arrayify(aesCtr.decrypt(ciphertext));
	    }
	    return null;
	}
	function _getAccount(data, key) {
	    var ciphertext = utils$1.looseArrayify(utils$1.searchPath(data, "crypto/ciphertext"));
	    var computedMAC = lib$1.hexlify(lib$4.keccak256(lib$1.concat([key.slice(16, 32), ciphertext]))).substring(2);
	    if (computedMAC !== utils$1.searchPath(data, "crypto/mac").toLowerCase()) {
	        throw new Error("invalid password");
	    }
	    var privateKey = _decrypt(data, key.slice(0, 16), ciphertext);
	    if (!privateKey) {
	        logger.throwError("unsupported cipher", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	            operation: "decrypt"
	        });
	    }
	    var mnemonicKey = key.slice(32, 64);
	    var address = lib$g.computeAddress(privateKey);
	    if (data.address) {
	        var check = data.address.toLowerCase();
	        if (check.substring(0, 2) !== "0x") {
	            check = "0x" + check;
	        }
	        if (lib$6.getAddress(check) !== address) {
	            throw new Error("address mismatch");
	        }
	    }
	    var account = {
	        _isKeystoreAccount: true,
	        address: address,
	        privateKey: lib$1.hexlify(privateKey)
	    };
	    // Version 0.1 x-ethers metadata must contain an encrypted mnemonic phrase
	    if (utils$1.searchPath(data, "x-ethers/version") === "0.1") {
	        var mnemonicCiphertext = utils$1.looseArrayify(utils$1.searchPath(data, "x-ethers/mnemonicCiphertext"));
	        var mnemonicIv = utils$1.looseArrayify(utils$1.searchPath(data, "x-ethers/mnemonicCounter"));
	        var mnemonicCounter = new aes_js_1.default.Counter(mnemonicIv);
	        var mnemonicAesCtr = new aes_js_1.default.ModeOfOperation.ctr(mnemonicKey, mnemonicCounter);
	        var path = utils$1.searchPath(data, "x-ethers/path") || lib$h.defaultPath;
	        var locale = utils$1.searchPath(data, "x-ethers/locale") || "en";
	        var entropy = lib$1.arrayify(mnemonicAesCtr.decrypt(mnemonicCiphertext));
	        try {
	            var mnemonic = lib$h.entropyToMnemonic(entropy, locale);
	            var node = lib$h.HDNode.fromMnemonic(mnemonic, null, locale).derivePath(path);
	            if (node.privateKey != account.privateKey) {
	                throw new Error("mnemonic mismatch");
	            }
	            account.mnemonic = node.mnemonic;
	        }
	        catch (error) {
	            // If we don't have the locale wordlist installed to
	            // read this mnemonic, just bail and don't set the
	            // mnemonic
	            if (error.code !== lib.Logger.errors.INVALID_ARGUMENT || error.argument !== "wordlist") {
	                throw error;
	            }
	        }
	    }
	    return new KeystoreAccount(account);
	}
	function pbkdf2Sync(passwordBytes, salt, count, dkLen, prfFunc) {
	    return lib$1.arrayify(browser$2.pbkdf2(passwordBytes, salt, count, dkLen, prfFunc));
	}
	function pbkdf2(passwordBytes, salt, count, dkLen, prfFunc) {
	    return Promise.resolve(pbkdf2Sync(passwordBytes, salt, count, dkLen, prfFunc));
	}
	function _computeKdfKey(data, password, pbkdf2Func, scryptFunc, progressCallback) {
	    var passwordBytes = utils$1.getPassword(password);
	    var kdf = utils$1.searchPath(data, "crypto/kdf");
	    if (kdf && typeof (kdf) === "string") {
	        var throwError = function (name, value) {
	            return logger.throwArgumentError("invalid key-derivation function parameters", name, value);
	        };
	        if (kdf.toLowerCase() === "scrypt") {
	            var salt = utils$1.looseArrayify(utils$1.searchPath(data, "crypto/kdfparams/salt"));
	            var N = parseInt(utils$1.searchPath(data, "crypto/kdfparams/n"));
	            var r = parseInt(utils$1.searchPath(data, "crypto/kdfparams/r"));
	            var p = parseInt(utils$1.searchPath(data, "crypto/kdfparams/p"));
	            // Check for all required parameters
	            if (!N || !r || !p) {
	                throwError("kdf", kdf);
	            }
	            // Make sure N is a power of 2
	            if ((N & (N - 1)) !== 0) {
	                throwError("N", N);
	            }
	            var dkLen = parseInt(utils$1.searchPath(data, "crypto/kdfparams/dklen"));
	            if (dkLen !== 32) {
	                throwError("dklen", dkLen);
	            }
	            return scryptFunc(passwordBytes, salt, N, r, p, 64, progressCallback);
	        }
	        else if (kdf.toLowerCase() === "pbkdf2") {
	            var salt = utils$1.looseArrayify(utils$1.searchPath(data, "crypto/kdfparams/salt"));
	            var prfFunc = null;
	            var prf = utils$1.searchPath(data, "crypto/kdfparams/prf");
	            if (prf === "hmac-sha256") {
	                prfFunc = "sha256";
	            }
	            else if (prf === "hmac-sha512") {
	                prfFunc = "sha512";
	            }
	            else {
	                throwError("prf", prf);
	            }
	            var count = parseInt(utils$1.searchPath(data, "crypto/kdfparams/c"));
	            var dkLen = parseInt(utils$1.searchPath(data, "crypto/kdfparams/dklen"));
	            if (dkLen !== 32) {
	                throwError("dklen", dkLen);
	            }
	            return pbkdf2Func(passwordBytes, salt, count, dkLen, prfFunc);
	        }
	    }
	    return logger.throwArgumentError("unsupported key-derivation function", "kdf", kdf);
	}
	function decryptSync(json, password) {
	    var data = JSON.parse(json);
	    var key = _computeKdfKey(data, password, pbkdf2Sync, scrypt$1.syncScrypt);
	    return _getAccount(data, key);
	}
	exports.decryptSync = decryptSync;
	function decrypt(json, password, progressCallback) {
	    return __awaiter(this, void 0, void 0, function () {
	        var data, key;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    data = JSON.parse(json);
	                    return [4 /*yield*/, _computeKdfKey(data, password, pbkdf2, scrypt$1.scrypt, progressCallback)];
	                case 1:
	                    key = _a.sent();
	                    return [2 /*return*/, _getAccount(data, key)];
	            }
	        });
	    });
	}
	exports.decrypt = decrypt;
	function encrypt(account, password, options, progressCallback) {
	    try {
	        // Check the address matches the private key
	        if (lib$6.getAddress(account.address) !== lib$g.computeAddress(account.privateKey)) {
	            throw new Error("address/privateKey mismatch");
	        }
	        // Check the mnemonic (if any) matches the private key
	        if (hasMnemonic(account)) {
	            var mnemonic = account.mnemonic;
	            var node = lib$h.HDNode.fromMnemonic(mnemonic.phrase, null, mnemonic.locale).derivePath(mnemonic.path || lib$h.defaultPath);
	            if (node.privateKey != account.privateKey) {
	                throw new Error("mnemonic mismatch");
	            }
	        }
	    }
	    catch (e) {
	        return Promise.reject(e);
	    }
	    // The options are optional, so adjust the call as needed
	    if (typeof (options) === "function" && !progressCallback) {
	        progressCallback = options;
	        options = {};
	    }
	    if (!options) {
	        options = {};
	    }
	    var privateKey = lib$1.arrayify(account.privateKey);
	    var passwordBytes = utils$1.getPassword(password);
	    var entropy = null;
	    var path = null;
	    var locale = null;
	    if (hasMnemonic(account)) {
	        var srcMnemonic = account.mnemonic;
	        entropy = lib$1.arrayify(lib$h.mnemonicToEntropy(srcMnemonic.phrase, srcMnemonic.locale || "en"));
	        path = srcMnemonic.path || lib$h.defaultPath;
	        locale = srcMnemonic.locale || "en";
	    }
	    var client = options.client;
	    if (!client) {
	        client = "ethers.js";
	    }
	    // Check/generate the salt
	    var salt = null;
	    if (options.salt) {
	        salt = lib$1.arrayify(options.salt);
	    }
	    else {
	        salt = browser$6.randomBytes(32);
	        ;
	    }
	    // Override initialization vector
	    var iv = null;
	    if (options.iv) {
	        iv = lib$1.arrayify(options.iv);
	        if (iv.length !== 16) {
	            throw new Error("invalid iv");
	        }
	    }
	    else {
	        iv = browser$6.randomBytes(16);
	    }
	    // Override the uuid
	    var uuidRandom = null;
	    if (options.uuid) {
	        uuidRandom = lib$1.arrayify(options.uuid);
	        if (uuidRandom.length !== 16) {
	            throw new Error("invalid uuid");
	        }
	    }
	    else {
	        uuidRandom = browser$6.randomBytes(16);
	    }
	    // Override the scrypt password-based key derivation function parameters
	    var N = (1 << 17), r = 8, p = 1;
	    if (options.scrypt) {
	        if (options.scrypt.N) {
	            N = options.scrypt.N;
	        }
	        if (options.scrypt.r) {
	            r = options.scrypt.r;
	        }
	        if (options.scrypt.p) {
	            p = options.scrypt.p;
	        }
	    }
	    // We take 64 bytes:
	    //   - 32 bytes   As normal for the Web3 secret storage (derivedKey, macPrefix)
	    //   - 32 bytes   AES key to encrypt mnemonic with (required here to be Ethers Wallet)
	    return scrypt$1.scrypt(passwordBytes, salt, N, r, p, 64, progressCallback).then(function (key) {
	        key = lib$1.arrayify(key);
	        // This will be used to encrypt the wallet (as per Web3 secret storage)
	        var derivedKey = key.slice(0, 16);
	        var macPrefix = key.slice(16, 32);
	        // This will be used to encrypt the mnemonic phrase (if any)
	        var mnemonicKey = key.slice(32, 64);
	        // Encrypt the private key
	        var counter = new aes_js_1.default.Counter(iv);
	        var aesCtr = new aes_js_1.default.ModeOfOperation.ctr(derivedKey, counter);
	        var ciphertext = lib$1.arrayify(aesCtr.encrypt(privateKey));
	        // Compute the message authentication code, used to check the password
	        var mac = lib$4.keccak256(lib$1.concat([macPrefix, ciphertext]));
	        // See: https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
	        var data = {
	            address: account.address.substring(2).toLowerCase(),
	            id: uuid_1$1.default.v4({ random: uuidRandom }),
	            version: 3,
	            Crypto: {
	                cipher: "aes-128-ctr",
	                cipherparams: {
	                    iv: lib$1.hexlify(iv).substring(2),
	                },
	                ciphertext: lib$1.hexlify(ciphertext).substring(2),
	                kdf: "scrypt",
	                kdfparams: {
	                    salt: lib$1.hexlify(salt).substring(2),
	                    n: N,
	                    dklen: 32,
	                    p: p,
	                    r: r
	                },
	                mac: mac.substring(2)
	            }
	        };
	        // If we have a mnemonic, encrypt it into the JSON wallet
	        if (entropy) {
	            var mnemonicIv = browser$6.randomBytes(16);
	            var mnemonicCounter = new aes_js_1.default.Counter(mnemonicIv);
	            var mnemonicAesCtr = new aes_js_1.default.ModeOfOperation.ctr(mnemonicKey, mnemonicCounter);
	            var mnemonicCiphertext = lib$1.arrayify(mnemonicAesCtr.encrypt(entropy));
	            var now = new Date();
	            var timestamp = (now.getUTCFullYear() + "-" +
	                utils$1.zpad(now.getUTCMonth() + 1, 2) + "-" +
	                utils$1.zpad(now.getUTCDate(), 2) + "T" +
	                utils$1.zpad(now.getUTCHours(), 2) + "-" +
	                utils$1.zpad(now.getUTCMinutes(), 2) + "-" +
	                utils$1.zpad(now.getUTCSeconds(), 2) + ".0Z");
	            data["x-ethers"] = {
	                client: client,
	                gethFilename: ("UTC--" + timestamp + "--" + data.address),
	                mnemonicCounter: lib$1.hexlify(mnemonicIv).substring(2),
	                mnemonicCiphertext: lib$1.hexlify(mnemonicCiphertext).substring(2),
	                path: path,
	                locale: locale,
	                version: "0.1"
	            };
	        }
	        return JSON.stringify(data);
	    });
	}
	exports.encrypt = encrypt;

	});

	var keystore$1 = unwrapExports(keystore);
	var keystore_1 = keystore.KeystoreAccount;
	var keystore_2 = keystore.decryptSync;
	var keystore_3 = keystore.decrypt;
	var keystore_4 = keystore.encrypt;

	var lib$i = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.decryptCrowdsale = crowdsale.decrypt;

	exports.getJsonWalletAddress = inspect.getJsonWalletAddress;
	exports.isCrowdsaleWallet = inspect.isCrowdsaleWallet;
	exports.isKeystoreWallet = inspect.isKeystoreWallet;

	exports.decryptKeystore = keystore.decrypt;
	exports.decryptKeystoreSync = keystore.decryptSync;
	exports.encryptKeystore = keystore.encrypt;
	function decryptJsonWallet(json, password, progressCallback) {
	    if (inspect.isCrowdsaleWallet(json)) {
	        if (progressCallback) {
	            progressCallback(0);
	        }
	        var account = crowdsale.decrypt(json, password);
	        if (progressCallback) {
	            progressCallback(1);
	        }
	        return Promise.resolve(account);
	    }
	    if (inspect.isKeystoreWallet(json)) {
	        return keystore.decrypt(json, password, progressCallback);
	    }
	    return Promise.reject(new Error("invalid JSON wallet"));
	}
	exports.decryptJsonWallet = decryptJsonWallet;
	function decryptJsonWalletSync(json, password) {
	    if (inspect.isCrowdsaleWallet(json)) {
	        return crowdsale.decrypt(json, password);
	    }
	    if (inspect.isKeystoreWallet(json)) {
	        return keystore.decryptSync(json, password);
	    }
	    throw new Error("invalid JSON wallet");
	}
	exports.decryptJsonWalletSync = decryptJsonWalletSync;

	});

	var index$i = unwrapExports(lib$i);
	var lib_1$i = lib$i.decryptCrowdsale;
	var lib_2$h = lib$i.getJsonWalletAddress;
	var lib_3$e = lib$i.isCrowdsaleWallet;
	var lib_4$b = lib$i.isKeystoreWallet;
	var lib_5$a = lib$i.decryptKeystore;
	var lib_6$6 = lib$i.decryptKeystoreSync;
	var lib_7$5 = lib$i.encryptKeystore;
	var lib_8$4 = lib$i.decryptJsonWallet;
	var lib_9$4 = lib$i.decryptJsonWalletSync;

	var _version$C = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "wallet/5.0.2";

	});

	var _version$D = unwrapExports(_version$C);
	var _version_1$j = _version$C.version;

	var lib$j = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });














	var logger = new lib.Logger(_version$C.version);
	function isAccount(value) {
	    return (value != null && lib$1.isHexString(value.privateKey, 32) && value.address != null);
	}
	function hasMnemonic(value) {
	    var mnemonic = value.mnemonic;
	    return (mnemonic && mnemonic.phrase);
	}
	var Wallet = /** @class */ (function (_super) {
	    __extends(Wallet, _super);
	    function Wallet(privateKey, provider) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, Wallet);
	        _this = _super.call(this) || this;
	        if (isAccount(privateKey)) {
	            var signingKey_1 = new lib$f.SigningKey(privateKey.privateKey);
	            lib$3.defineReadOnly(_this, "_signingKey", function () { return signingKey_1; });
	            lib$3.defineReadOnly(_this, "address", lib$g.computeAddress(_this.publicKey));
	            if (_this.address !== lib$6.getAddress(privateKey.address)) {
	                logger.throwArgumentError("privateKey/address mismatch", "privateKey", "[REDACTED]");
	            }
	            if (hasMnemonic(privateKey)) {
	                var srcMnemonic_1 = privateKey.mnemonic;
	                lib$3.defineReadOnly(_this, "_mnemonic", function () { return ({
	                    phrase: srcMnemonic_1.phrase,
	                    path: srcMnemonic_1.path || lib$h.defaultPath,
	                    locale: srcMnemonic_1.locale || "en"
	                }); });
	                var mnemonic = _this.mnemonic;
	                var node = lib$h.HDNode.fromMnemonic(mnemonic.phrase, null, mnemonic.locale).derivePath(mnemonic.path);
	                if (lib$g.computeAddress(node.privateKey) !== _this.address) {
	                    logger.throwArgumentError("mnemonic/address mismatch", "privateKey", "[REDACTED]");
	                }
	            }
	            else {
	                lib$3.defineReadOnly(_this, "_mnemonic", function () { return null; });
	            }
	        }
	        else {
	            if (lib$f.SigningKey.isSigningKey(privateKey)) {
	                /* istanbul ignore if */
	                if (privateKey.curve !== "secp256k1") {
	                    logger.throwArgumentError("unsupported curve; must be secp256k1", "privateKey", "[REDACTED]");
	                }
	                lib$3.defineReadOnly(_this, "_signingKey", function () { return privateKey; });
	            }
	            else {
	                var signingKey_2 = new lib$f.SigningKey(privateKey);
	                lib$3.defineReadOnly(_this, "_signingKey", function () { return signingKey_2; });
	            }
	            lib$3.defineReadOnly(_this, "_mnemonic", function () { return null; });
	            lib$3.defineReadOnly(_this, "address", lib$g.computeAddress(_this.publicKey));
	        }
	        /* istanbul ignore if */
	        if (provider && !lib$b.Provider.isProvider(provider)) {
	            logger.throwArgumentError("invalid provider", "provider", provider);
	        }
	        lib$3.defineReadOnly(_this, "provider", provider || null);
	        return _this;
	    }
	    Object.defineProperty(Wallet.prototype, "mnemonic", {
	        get: function () { return this._mnemonic(); },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Wallet.prototype, "privateKey", {
	        get: function () { return this._signingKey().privateKey; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Wallet.prototype, "publicKey", {
	        get: function () { return this._signingKey().publicKey; },
	        enumerable: true,
	        configurable: true
	    });
	    Wallet.prototype.getAddress = function () {
	        return Promise.resolve(this.address);
	    };
	    Wallet.prototype.connect = function (provider) {
	        return new Wallet(this, provider);
	    };
	    Wallet.prototype.signTransaction = function (transaction) {
	        var _this = this;
	        return lib$3.resolveProperties(transaction).then(function (tx) {
	            if (tx.from != null) {
	                if (lib$6.getAddress(tx.from) !== _this.address) {
	                    logger.throwArgumentError("transaction from address mismatch", "transaction.from", transaction.from);
	                }
	                delete tx.from;
	            }
	            var signature = _this._signingKey().signDigest(lib$4.keccak256(lib$g.serialize(tx)));
	            return lib$g.serialize(tx, signature);
	        });
	    };
	    Wallet.prototype.signMessage = function (message) {
	        return Promise.resolve(lib$1.joinSignature(this._signingKey().signDigest(lib$9.hashMessage(message))));
	    };
	    Wallet.prototype.encrypt = function (password, options, progressCallback) {
	        if (typeof (options) === "function" && !progressCallback) {
	            progressCallback = options;
	            options = {};
	        }
	        if (progressCallback && typeof (progressCallback) !== "function") {
	            throw new Error("invalid callback");
	        }
	        if (!options) {
	            options = {};
	        }
	        return lib$i.encryptKeystore(this, password, options, progressCallback);
	    };
	    /**
	     *  Static methods to create Wallet instances.
	     */
	    Wallet.createRandom = function (options) {
	        var entropy = browser$6.randomBytes(16);
	        if (!options) {
	            options = {};
	        }
	        if (options.extraEntropy) {
	            entropy = lib$1.arrayify(lib$1.hexDataSlice(lib$4.keccak256(lib$1.concat([entropy, options.extraEntropy])), 0, 16));
	        }
	        var mnemonic = lib$h.entropyToMnemonic(entropy, options.locale);
	        return Wallet.fromMnemonic(mnemonic, options.path, options.locale);
	    };
	    Wallet.fromEncryptedJson = function (json, password, progressCallback) {
	        return lib$i.decryptJsonWallet(json, password, progressCallback).then(function (account) {
	            return new Wallet(account);
	        });
	    };
	    Wallet.fromEncryptedJsonSync = function (json, password) {
	        return new Wallet(lib$i.decryptJsonWalletSync(json, password));
	    };
	    Wallet.fromMnemonic = function (mnemonic, path, wordlist) {
	        if (!path) {
	            path = lib$h.defaultPath;
	        }
	        return new Wallet(lib$h.HDNode.fromMnemonic(mnemonic, null, wordlist).derivePath(path));
	    };
	    return Wallet;
	}(lib$c.Signer));
	exports.Wallet = Wallet;
	function verifyMessage(message, signature) {
	    return lib$g.recoverAddress(lib$9.hashMessage(message), signature);
	}
	exports.verifyMessage = verifyMessage;

	});

	var index$j = unwrapExports(lib$j);
	var lib_1$j = lib$j.Wallet;
	var lib_2$i = lib$j.verifyMessage;

	var _version$E = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "networks/5.0.2";

	});

	var _version$F = unwrapExports(_version$E);
	var _version_1$k = _version$E.version;

	var lib$k = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });


	var logger = new lib.Logger(_version$E.version);
	function ethDefaultProvider(network) {
	    return function (providers, options) {
	        if (options == null) {
	            options = {};
	        }
	        var providerList = [];
	        if (providers.InfuraProvider) {
	            try {
	                providerList.push(new providers.InfuraProvider(network, options.infura));
	            }
	            catch (error) { }
	        }
	        if (providers.EtherscanProvider) {
	            try {
	                providerList.push(new providers.EtherscanProvider(network, options.etherscan));
	            }
	            catch (error) { }
	        }
	        if (providers.AlchemyProvider) {
	            try {
	                providerList.push(new providers.AlchemyProvider(network, options.alchemy));
	            }
	            catch (error) { }
	        }
	        if (providers.CloudflareProvider) {
	            try {
	                providerList.push(new providers.CloudflareProvider(network));
	            }
	            catch (error) { }
	        }
	        if (providerList.length === 0) {
	            return null;
	        }
	        if (providers.FallbackProvider) {
	            var quorum = 1;
	            if (options.quorum != null) {
	                quorum = options.quorum;
	            }
	            else if (network === "homestead") {
	                quorum = 2;
	            }
	            return new providers.FallbackProvider(providerList, quorum);
	        }
	        return providerList[0];
	    };
	}
	function etcDefaultProvider(url, network) {
	    return function (providers, options) {
	        if (providers.JsonRpcProvider) {
	            return new providers.JsonRpcProvider(url, network);
	        }
	        return null;
	    };
	}
	var homestead = {
	    chainId: 1,
	    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
	    name: "homestead",
	    _defaultProvider: ethDefaultProvider("homestead")
	};
	var ropsten = {
	    chainId: 3,
	    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
	    name: "ropsten",
	    _defaultProvider: ethDefaultProvider("ropsten")
	};
	var classicMordor = {
	    chainId: 63,
	    name: "classicMordor",
	    _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/mordor", "classicMordor")
	};
	var networks = {
	    unspecified: {
	        chainId: 0,
	        name: "unspecified"
	    },
	    homestead: homestead,
	    mainnet: homestead,
	    morden: {
	        chainId: 2,
	        name: "morden"
	    },
	    ropsten: ropsten,
	    testnet: ropsten,
	    rinkeby: {
	        chainId: 4,
	        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
	        name: "rinkeby",
	        _defaultProvider: ethDefaultProvider("rinkeby")
	    },
	    kovan: {
	        chainId: 42,
	        name: "kovan",
	        _defaultProvider: ethDefaultProvider("kovan")
	    },
	    goerli: {
	        chainId: 5,
	        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
	        name: "goerli",
	        _defaultProvider: ethDefaultProvider("goerli")
	    },
	    // ETC (See: #351)
	    classic: {
	        chainId: 61,
	        name: "classic",
	        _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/etc", "classic")
	    },
	    classicMorden: {
	        chainId: 62,
	        name: "classicMorden",
	    },
	    classicMordor: classicMordor,
	    classicTestnet: classicMordor,
	    classicKotti: {
	        chainId: 6,
	        name: "classicKotti",
	        _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/kotti", "classicKotti")
	    },
	};
	/**
	 *  getNetwork
	 *
	 *  Converts a named common networks or chain ID (network ID) to a Network
	 *  and verifies a network is a valid Network..
	 */
	function getNetwork(network) {
	    // No network (null)
	    if (network == null) {
	        return null;
	    }
	    if (typeof (network) === "number") {
	        for (var name_1 in networks) {
	            var standard_1 = networks[name_1];
	            if (standard_1.chainId === network) {
	                return {
	                    name: standard_1.name,
	                    chainId: standard_1.chainId,
	                    ensAddress: (standard_1.ensAddress || null),
	                    _defaultProvider: (standard_1._defaultProvider || null)
	                };
	            }
	        }
	        return {
	            chainId: network,
	            name: "unknown"
	        };
	    }
	    if (typeof (network) === "string") {
	        var standard_2 = networks[network];
	        if (standard_2 == null) {
	            return null;
	        }
	        return {
	            name: standard_2.name,
	            chainId: standard_2.chainId,
	            ensAddress: standard_2.ensAddress,
	            _defaultProvider: (standard_2._defaultProvider || null)
	        };
	    }
	    var standard = networks[network.name];
	    // Not a standard network; check that it is a valid network in general
	    if (!standard) {
	        if (typeof (network.chainId) !== "number") {
	            logger.throwArgumentError("invalid network chainId", "network", network);
	        }
	        return network;
	    }
	    // Make sure the chainId matches the expected network chainId (or is 0; disable EIP-155)
	    if (network.chainId !== 0 && network.chainId !== standard.chainId) {
	        logger.throwArgumentError("network chainId mismatch", "network", network);
	    }
	    // Standard Network (allow overriding the ENS address)
	    return {
	        name: network.name,
	        chainId: standard.chainId,
	        ensAddress: (network.ensAddress || standard.ensAddress || null),
	        _defaultProvider: (network._defaultProvider || standard._defaultProvider || null)
	    };
	}
	exports.getNetwork = getNetwork;

	});

	var index$k = unwrapExports(lib$k);
	var lib_1$k = lib$k.getNetwork;

	var browser$8 = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });

	function decode(textData) {
	    textData = atob(textData);
	    var data = [];
	    for (var i = 0; i < textData.length; i++) {
	        data.push(textData.charCodeAt(i));
	    }
	    return lib$1.arrayify(data);
	}
	exports.decode = decode;
	function encode(data) {
	    data = lib$1.arrayify(data);
	    var textData = "";
	    for (var i = 0; i < data.length; i++) {
	        textData += String.fromCharCode(data[i]);
	    }
	    return btoa(textData);
	}
	exports.encode = encode;

	});

	var browser$9 = unwrapExports(browser$8);
	var browser_1$4 = browser$8.decode;
	var browser_2$3 = browser$8.encode;

	var _version$G = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "web/5.0.2";

	});

	var _version$H = unwrapExports(_version$G);
	var _version_1$l = _version$G.version;

	var browserGeturl = createCommonjsModule(function (module, exports) {
	"use strict";
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	function getUrl(href, options) {
	    return __awaiter(this, void 0, void 0, function () {
	        var request, response, body, headers;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    if (options == null) {
	                        options = {};
	                    }
	                    request = {
	                        method: (options.method || "GET"),
	                        headers: (options.headers || {}),
	                        body: (options.body || undefined),
	                        mode: "cors",
	                        cache: "no-cache",
	                        credentials: "same-origin",
	                        redirect: "follow",
	                        referrer: "client",
	                    };
	                    return [4 /*yield*/, fetch(href, request)];
	                case 1:
	                    response = _a.sent();
	                    return [4 /*yield*/, response.text()];
	                case 2:
	                    body = _a.sent();
	                    headers = {};
	                    if (response.headers.forEach) {
	                        response.headers.forEach(function (value, key) {
	                            headers[key.toLowerCase()] = value;
	                        });
	                    }
	                    else {
	                        ((response.headers).keys)().forEach(function (key) {
	                            headers[key.toLowerCase()] = response.headers.get(key);
	                        });
	                    }
	                    return [2 /*return*/, {
	                            headers: headers,
	                            statusCode: response.status,
	                            statusMessage: response.statusText,
	                            body: body,
	                        }];
	            }
	        });
	    });
	}
	exports.getUrl = getUrl;

	});

	var browserGeturl$1 = unwrapExports(browserGeturl);
	var browserGeturl_1 = browserGeturl.getUrl;

	var lib$l = createCommonjsModule(function (module, exports) {
	"use strict";
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });





	var logger = new lib.Logger(_version$G.version);

	function fetchJson(connection, json, processFunc) {
	    var headers = {};
	    var url = null;
	    // @TODO: Allow ConnectionInfo to override some of these values
	    var options = {
	        method: "GET",
	    };
	    var allow304 = false;
	    var timeout = 2 * 60 * 1000;
	    if (typeof (connection) === "string") {
	        url = connection;
	    }
	    else if (typeof (connection) === "object") {
	        if (connection == null || connection.url == null) {
	            logger.throwArgumentError("missing URL", "connection.url", connection);
	        }
	        url = connection.url;
	        if (typeof (connection.timeout) === "number" && connection.timeout > 0) {
	            timeout = connection.timeout;
	        }
	        if (connection.headers) {
	            for (var key in connection.headers) {
	                headers[key.toLowerCase()] = { key: key, value: String(connection.headers[key]) };
	                if (["if-none-match", "if-modified-since"].indexOf(key.toLowerCase()) >= 0) {
	                    allow304 = true;
	                }
	            }
	        }
	        if (connection.user != null && connection.password != null) {
	            if (url.substring(0, 6) !== "https:" && connection.allowInsecureAuthentication !== true) {
	                logger.throwError("basic authentication requires a secure https url", lib.Logger.errors.INVALID_ARGUMENT, { argument: "url", url: url, user: connection.user, password: "[REDACTED]" });
	            }
	            var authorization = connection.user + ":" + connection.password;
	            headers["authorization"] = {
	                key: "Authorization",
	                value: "Basic " + browser$8.encode(lib$8.toUtf8Bytes(authorization))
	            };
	        }
	    }
	    if (json) {
	        options.method = "POST";
	        options.body = json;
	        headers["content-type"] = { key: "Content-Type", value: "application/json" };
	    }
	    var flatHeaders = {};
	    Object.keys(headers).forEach(function (key) {
	        var header = headers[key];
	        flatHeaders[header.key] = header.value;
	    });
	    options.headers = flatHeaders;
	    var runningTimeout = (function () {
	        var timer = null;
	        var promise = new Promise(function (resolve, reject) {
	            if (timeout) {
	                timer = setTimeout(function () {
	                    if (timer == null) {
	                        return;
	                    }
	                    timer = null;
	                    reject(logger.makeError("timeout", lib.Logger.errors.TIMEOUT, {
	                        requestBody: (options.body || null),
	                        requestMethod: options.method,
	                        timeout: timeout,
	                        url: url
	                    }));
	                }, timeout);
	            }
	        });
	        var cancel = function () {
	            if (timer == null) {
	                return;
	            }
	            clearTimeout(timer);
	            timer = null;
	        };
	        return { promise: promise, cancel: cancel };
	    })();
	    var runningFetch = (function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var response, error_1, body, json, error_2;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        response = null;
	                        _a.label = 1;
	                    case 1:
	                        _a.trys.push([1, 3, , 4]);
	                        return [4 /*yield*/, browserGeturl.getUrl(url, options)];
	                    case 2:
	                        response = _a.sent();
	                        return [3 /*break*/, 4];
	                    case 3:
	                        error_1 = _a.sent();
	                        response = error_1.response;
	                        if (response == null) {
	                            runningTimeout.cancel();
	                            logger.throwError("missing response", lib.Logger.errors.SERVER_ERROR, {
	                                requestBody: (options.body || null),
	                                requestMethod: options.method,
	                                serverError: error_1,
	                                url: url
	                            });
	                        }
	                        return [3 /*break*/, 4];
	                    case 4:
	                        body = response.body;
	                        if (allow304 && response.statusCode === 304) {
	                            body = null;
	                        }
	                        else if (response.statusCode < 200 || response.statusCode >= 300) {
	                            runningTimeout.cancel();
	                            logger.throwError("bad response", lib.Logger.errors.SERVER_ERROR, {
	                                status: response.statusCode,
	                                headers: response.headers,
	                                body: body,
	                                requestBody: (options.body || null),
	                                requestMethod: options.method,
	                                url: url
	                            });
	                        }
	                        runningTimeout.cancel();
	                        json = null;
	                        if (body != null) {
	                            try {
	                                json = JSON.parse(body);
	                            }
	                            catch (error) {
	                                logger.throwError("invalid JSON", lib.Logger.errors.SERVER_ERROR, {
	                                    body: body,
	                                    error: error,
	                                    requestBody: (options.body || null),
	                                    requestMethod: options.method,
	                                    url: url
	                                });
	                            }
	                        }
	                        if (!processFunc) return [3 /*break*/, 8];
	                        _a.label = 5;
	                    case 5:
	                        _a.trys.push([5, 7, , 8]);
	                        return [4 /*yield*/, processFunc(json, response)];
	                    case 6:
	                        json = _a.sent();
	                        return [3 /*break*/, 8];
	                    case 7:
	                        error_2 = _a.sent();
	                        logger.throwError("processing response error", lib.Logger.errors.SERVER_ERROR, {
	                            body: json,
	                            error: error_2,
	                            requestBody: (options.body || null),
	                            requestMethod: options.method,
	                            url: url
	                        });
	                        return [3 /*break*/, 8];
	                    case 8: return [2 /*return*/, json];
	                }
	            });
	        });
	    })();
	    return Promise.race([runningTimeout.promise, runningFetch]);
	}
	exports.fetchJson = fetchJson;
	function poll(func, options) {
	    if (!options) {
	        options = {};
	    }
	    options = lib$3.shallowCopy(options);
	    if (options.floor == null) {
	        options.floor = 0;
	    }
	    if (options.ceiling == null) {
	        options.ceiling = 10000;
	    }
	    if (options.interval == null) {
	        options.interval = 250;
	    }
	    return new Promise(function (resolve, reject) {
	        var timer = null;
	        var done = false;
	        // Returns true if cancel was successful. Unsuccessful cancel means we're already done.
	        var cancel = function () {
	            if (done) {
	                return false;
	            }
	            done = true;
	            if (timer) {
	                clearTimeout(timer);
	            }
	            return true;
	        };
	        if (options.timeout) {
	            timer = setTimeout(function () {
	                if (cancel()) {
	                    reject(new Error("timeout"));
	                }
	            }, options.timeout);
	        }
	        var retryLimit = options.retryLimit;
	        var attempt = 0;
	        function check() {
	            return func().then(function (result) {
	                // If we have a result, or are allowed null then we're done
	                if (result !== undefined) {
	                    if (cancel()) {
	                        resolve(result);
	                    }
	                }
	                else if (options.oncePoll) {
	                    options.oncePoll.once("poll", check);
	                }
	                else if (options.onceBlock) {
	                    options.onceBlock.once("block", check);
	                    // Otherwise, exponential back-off (up to 10s) our next request
	                }
	                else if (!done) {
	                    attempt++;
	                    if (attempt > retryLimit) {
	                        if (cancel()) {
	                            reject(new Error("retry limit reached"));
	                        }
	                        return;
	                    }
	                    var timeout = options.interval * parseInt(String(Math.random() * Math.pow(2, attempt)));
	                    if (timeout < options.floor) {
	                        timeout = options.floor;
	                    }
	                    if (timeout > options.ceiling) {
	                        timeout = options.ceiling;
	                    }
	                    setTimeout(check, timeout);
	                }
	                return null;
	            }, function (error) {
	                if (cancel()) {
	                    reject(error);
	                }
	            });
	        }
	        check();
	    });
	}
	exports.poll = poll;

	});

	var index$l = unwrapExports(lib$l);
	var lib_1$l = lib$l.fetchJson;
	var lib_2$j = lib$l.poll;

	var _version$I = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "providers/5.0.5";

	});

	var _version$J = unwrapExports(_version$I);
	var _version_1$m = _version$I.version;

	var formatter = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });








	var logger = new lib.Logger(_version$I.version);
	var Formatter = /** @class */ (function () {
	    function Formatter() {
	        var _newTarget = this.constructor;
	        logger.checkNew(_newTarget, Formatter);
	        this.formats = this.getDefaultFormats();
	    }
	    Formatter.prototype.getDefaultFormats = function () {
	        var _this = this;
	        var formats = ({});
	        var address = this.address.bind(this);
	        var bigNumber = this.bigNumber.bind(this);
	        var blockTag = this.blockTag.bind(this);
	        var data = this.data.bind(this);
	        var hash = this.hash.bind(this);
	        var hex = this.hex.bind(this);
	        var number = this.number.bind(this);
	        var strictData = function (v) { return _this.data(v, true); };
	        formats.transaction = {
	            hash: hash,
	            blockHash: Formatter.allowNull(hash, null),
	            blockNumber: Formatter.allowNull(number, null),
	            transactionIndex: Formatter.allowNull(number, null),
	            confirmations: Formatter.allowNull(number, null),
	            from: address,
	            gasPrice: bigNumber,
	            gasLimit: bigNumber,
	            to: Formatter.allowNull(address, null),
	            value: bigNumber,
	            nonce: number,
	            data: data,
	            r: Formatter.allowNull(this.uint256),
	            s: Formatter.allowNull(this.uint256),
	            v: Formatter.allowNull(number),
	            creates: Formatter.allowNull(address, null),
	            raw: Formatter.allowNull(data),
	        };
	        formats.transactionRequest = {
	            from: Formatter.allowNull(address),
	            nonce: Formatter.allowNull(number),
	            gasLimit: Formatter.allowNull(bigNumber),
	            gasPrice: Formatter.allowNull(bigNumber),
	            to: Formatter.allowNull(address),
	            value: Formatter.allowNull(bigNumber),
	            data: Formatter.allowNull(strictData),
	        };
	        formats.receiptLog = {
	            transactionIndex: number,
	            blockNumber: number,
	            transactionHash: hash,
	            address: address,
	            topics: Formatter.arrayOf(hash),
	            data: data,
	            logIndex: number,
	            blockHash: hash,
	        };
	        formats.receipt = {
	            to: Formatter.allowNull(this.address, null),
	            from: Formatter.allowNull(this.address, null),
	            contractAddress: Formatter.allowNull(address, null),
	            transactionIndex: number,
	            root: Formatter.allowNull(hash),
	            gasUsed: bigNumber,
	            logsBloom: Formatter.allowNull(data),
	            blockHash: hash,
	            transactionHash: hash,
	            logs: Formatter.arrayOf(this.receiptLog.bind(this)),
	            blockNumber: number,
	            confirmations: Formatter.allowNull(number, null),
	            cumulativeGasUsed: bigNumber,
	            status: Formatter.allowNull(number)
	        };
	        formats.block = {
	            hash: hash,
	            parentHash: hash,
	            number: number,
	            timestamp: number,
	            nonce: Formatter.allowNull(hex),
	            difficulty: this.difficulty.bind(this),
	            gasLimit: bigNumber,
	            gasUsed: bigNumber,
	            miner: address,
	            extraData: data,
	            transactions: Formatter.allowNull(Formatter.arrayOf(hash)),
	        };
	        formats.blockWithTransactions = lib$3.shallowCopy(formats.block);
	        formats.blockWithTransactions.transactions = Formatter.allowNull(Formatter.arrayOf(this.transactionResponse.bind(this)));
	        formats.filter = {
	            fromBlock: Formatter.allowNull(blockTag, undefined),
	            toBlock: Formatter.allowNull(blockTag, undefined),
	            blockHash: Formatter.allowNull(hash, undefined),
	            address: Formatter.allowNull(address, undefined),
	            topics: Formatter.allowNull(this.topics.bind(this), undefined),
	        };
	        formats.filterLog = {
	            blockNumber: Formatter.allowNull(number),
	            blockHash: Formatter.allowNull(hash),
	            transactionIndex: number,
	            removed: Formatter.allowNull(this.boolean.bind(this)),
	            address: address,
	            data: Formatter.allowFalsish(data, "0x"),
	            topics: Formatter.arrayOf(hash),
	            transactionHash: hash,
	            logIndex: number,
	        };
	        return formats;
	    };
	    // Requires a BigNumberish that is within the IEEE754 safe integer range; returns a number
	    // Strict! Used on input.
	    Formatter.prototype.number = function (number) {
	        return lib$2.BigNumber.from(number).toNumber();
	    };
	    // Strict! Used on input.
	    Formatter.prototype.bigNumber = function (value) {
	        return lib$2.BigNumber.from(value);
	    };
	    // Requires a boolean, "true" or  "false"; returns a boolean
	    Formatter.prototype.boolean = function (value) {
	        if (typeof (value) === "boolean") {
	            return value;
	        }
	        if (typeof (value) === "string") {
	            value = value.toLowerCase();
	            if (value === "true") {
	                return true;
	            }
	            if (value === "false") {
	                return false;
	            }
	        }
	        throw new Error("invalid boolean - " + value);
	    };
	    Formatter.prototype.hex = function (value, strict) {
	        if (typeof (value) === "string") {
	            if (!strict && value.substring(0, 2) !== "0x") {
	                value = "0x" + value;
	            }
	            if (lib$1.isHexString(value)) {
	                return value.toLowerCase();
	            }
	        }
	        return logger.throwArgumentError("invalid hash", "value", value);
	    };
	    Formatter.prototype.data = function (value, strict) {
	        var result = this.hex(value, strict);
	        if ((result.length % 2) !== 0) {
	            throw new Error("invalid data; odd-length - " + value);
	        }
	        return result;
	    };
	    // Requires an address
	    // Strict! Used on input.
	    Formatter.prototype.address = function (value) {
	        return lib$6.getAddress(value);
	    };
	    Formatter.prototype.callAddress = function (value) {
	        if (!lib$1.isHexString(value, 32)) {
	            return null;
	        }
	        var address = lib$6.getAddress(lib$1.hexDataSlice(value, 12));
	        return (address === lib$7.AddressZero) ? null : address;
	    };
	    Formatter.prototype.contractAddress = function (value) {
	        return lib$6.getContractAddress(value);
	    };
	    // Strict! Used on input.
	    Formatter.prototype.blockTag = function (blockTag) {
	        if (blockTag == null) {
	            return "latest";
	        }
	        if (blockTag === "earliest") {
	            return "0x0";
	        }
	        if (blockTag === "latest" || blockTag === "pending") {
	            return blockTag;
	        }
	        if (typeof (blockTag) === "number" || lib$1.isHexString(blockTag)) {
	            return lib$1.hexValue(blockTag);
	        }
	        throw new Error("invalid blockTag");
	    };
	    // Requires a hash, optionally requires 0x prefix; returns prefixed lowercase hash.
	    Formatter.prototype.hash = function (value, strict) {
	        var result = this.hex(value, strict);
	        if (lib$1.hexDataLength(result) !== 32) {
	            return logger.throwArgumentError("invalid hash", "value", value);
	        }
	        return result;
	    };
	    // Returns the difficulty as a number, or if too large (i.e. PoA network) null
	    Formatter.prototype.difficulty = function (value) {
	        if (value == null) {
	            return null;
	        }
	        var v = lib$2.BigNumber.from(value);
	        try {
	            return v.toNumber();
	        }
	        catch (error) { }
	        return null;
	    };
	    Formatter.prototype.uint256 = function (value) {
	        if (!lib$1.isHexString(value)) {
	            throw new Error("invalid uint256");
	        }
	        return lib$1.hexZeroPad(value, 32);
	    };
	    Formatter.prototype._block = function (value, format) {
	        if (value.author != null && value.miner == null) {
	            value.miner = value.author;
	        }
	        return Formatter.check(format, value);
	    };
	    Formatter.prototype.block = function (value) {
	        return this._block(value, this.formats.block);
	    };
	    Formatter.prototype.blockWithTransactions = function (value) {
	        return this._block(value, this.formats.blockWithTransactions);
	    };
	    // Strict! Used on input.
	    Formatter.prototype.transactionRequest = function (value) {
	        return Formatter.check(this.formats.transactionRequest, value);
	    };
	    Formatter.prototype.transactionResponse = function (transaction) {
	        // Rename gas to gasLimit
	        if (transaction.gas != null && transaction.gasLimit == null) {
	            transaction.gasLimit = transaction.gas;
	        }
	        // Some clients (TestRPC) do strange things like return 0x0 for the
	        // 0 address; correct this to be a real address
	        if (transaction.to && lib$2.BigNumber.from(transaction.to).isZero()) {
	            transaction.to = "0x0000000000000000000000000000000000000000";
	        }
	        // Rename input to data
	        if (transaction.input != null && transaction.data == null) {
	            transaction.data = transaction.input;
	        }
	        // If to and creates are empty, populate the creates from the transaction
	        if (transaction.to == null && transaction.creates == null) {
	            transaction.creates = this.contractAddress(transaction);
	        }
	        // @TODO: use transaction.serialize? Have to add support for including v, r, and s...
	        /*
	        if (!transaction.raw) {
	 
	             // Very loose providers (e.g. TestRPC) do not provide a signature or raw
	             if (transaction.v && transaction.r && transaction.s) {
	                 let raw = [
	                     stripZeros(hexlify(transaction.nonce)),
	                     stripZeros(hexlify(transaction.gasPrice)),
	                     stripZeros(hexlify(transaction.gasLimit)),
	                     (transaction.to || "0x"),
	                     stripZeros(hexlify(transaction.value || "0x")),
	                     hexlify(transaction.data || "0x"),
	                     stripZeros(hexlify(transaction.v || "0x")),
	                     stripZeros(hexlify(transaction.r)),
	                     stripZeros(hexlify(transaction.s)),
	                 ];
	 
	                 transaction.raw = rlpEncode(raw);
	             }
	         }
	         */
	        var result = Formatter.check(this.formats.transaction, transaction);
	        if (transaction.chainId != null) {
	            var chainId = transaction.chainId;
	            if (lib$1.isHexString(chainId)) {
	                chainId = lib$2.BigNumber.from(chainId).toNumber();
	            }
	            result.chainId = chainId;
	        }
	        else {
	            var chainId = transaction.networkId;
	            // geth-etc returns chainId
	            if (chainId == null && result.v == null) {
	                chainId = transaction.chainId;
	            }
	            if (lib$1.isHexString(chainId)) {
	                chainId = lib$2.BigNumber.from(chainId).toNumber();
	            }
	            if (typeof (chainId) !== "number" && result.v != null) {
	                chainId = (result.v - 35) / 2;
	                if (chainId < 0) {
	                    chainId = 0;
	                }
	                chainId = parseInt(chainId);
	            }
	            if (typeof (chainId) !== "number") {
	                chainId = 0;
	            }
	            result.chainId = chainId;
	        }
	        // 0x0000... should actually be null
	        if (result.blockHash && result.blockHash.replace(/0/g, "") === "x") {
	            result.blockHash = null;
	        }
	        return result;
	    };
	    Formatter.prototype.transaction = function (value) {
	        return lib$g.parse(value);
	    };
	    Formatter.prototype.receiptLog = function (value) {
	        return Formatter.check(this.formats.receiptLog, value);
	    };
	    Formatter.prototype.receipt = function (value) {
	        var result = Formatter.check(this.formats.receipt, value);
	        if (value.status != null) {
	            result.byzantium = true;
	        }
	        return result;
	    };
	    Formatter.prototype.topics = function (value) {
	        var _this = this;
	        if (Array.isArray(value)) {
	            return value.map(function (v) { return _this.topics(v); });
	        }
	        else if (value != null) {
	            return this.hash(value, true);
	        }
	        return null;
	    };
	    Formatter.prototype.filter = function (value) {
	        return Formatter.check(this.formats.filter, value);
	    };
	    Formatter.prototype.filterLog = function (value) {
	        return Formatter.check(this.formats.filterLog, value);
	    };
	    Formatter.check = function (format, object) {
	        var result = {};
	        for (var key in format) {
	            try {
	                var value = format[key](object[key]);
	                if (value !== undefined) {
	                    result[key] = value;
	                }
	            }
	            catch (error) {
	                error.checkKey = key;
	                error.checkValue = object[key];
	                throw error;
	            }
	        }
	        return result;
	    };
	    // if value is null-ish, nullValue is returned
	    Formatter.allowNull = function (format, nullValue) {
	        return (function (value) {
	            if (value == null) {
	                return nullValue;
	            }
	            return format(value);
	        });
	    };
	    // If value is false-ish, replaceValue is returned
	    Formatter.allowFalsish = function (format, replaceValue) {
	        return (function (value) {
	            if (!value) {
	                return replaceValue;
	            }
	            return format(value);
	        });
	    };
	    // Requires an Array satisfying check
	    Formatter.arrayOf = function (format) {
	        return (function (array) {
	            if (!Array.isArray(array)) {
	                throw new Error("not an array");
	            }
	            var result = [];
	            array.forEach(function (value) {
	                result.push(format(value));
	            });
	            return result;
	        });
	    };
	    return Formatter;
	}());
	exports.Formatter = Formatter;

	});

	var formatter$1 = unwrapExports(formatter);
	var formatter_1 = formatter.Formatter;

	var baseProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });










	var logger = new lib.Logger(_version$I.version);

	//////////////////////////////
	// Event Serializeing
	function checkTopic(topic) {
	    if (topic == null) {
	        return "null";
	    }
	    if (lib$1.hexDataLength(topic) !== 32) {
	        logger.throwArgumentError("invalid topic", "topic", topic);
	    }
	    return topic.toLowerCase();
	}
	function serializeTopics(topics) {
	    // Remove trailing null AND-topics; they are redundant
	    topics = topics.slice();
	    while (topics.length > 0 && topics[topics.length - 1] == null) {
	        topics.pop();
	    }
	    return topics.map(function (topic) {
	        if (Array.isArray(topic)) {
	            // Only track unique OR-topics
	            var unique_1 = {};
	            topic.forEach(function (topic) {
	                unique_1[checkTopic(topic)] = true;
	            });
	            // The order of OR-topics does not matter
	            var sorted = Object.keys(unique_1);
	            sorted.sort();
	            return sorted.join("|");
	        }
	        else {
	            return checkTopic(topic);
	        }
	    }).join("&");
	}
	function deserializeTopics(data) {
	    if (data === "") {
	        return [];
	    }
	    return data.split(/&/g).map(function (topic) {
	        if (topic === "") {
	            return [];
	        }
	        var comps = topic.split("|").map(function (topic) {
	            return ((topic === "null") ? null : topic);
	        });
	        return ((comps.length === 1) ? comps[0] : comps);
	    });
	}
	function getEventTag(eventName) {
	    if (typeof (eventName) === "string") {
	        eventName = eventName.toLowerCase();
	        if (lib$1.hexDataLength(eventName) === 32) {
	            return "tx:" + eventName;
	        }
	        if (eventName.indexOf(":") === -1) {
	            return eventName;
	        }
	    }
	    else if (Array.isArray(eventName)) {
	        return "filter:*:" + serializeTopics(eventName);
	    }
	    else if (lib$b.ForkEvent.isForkEvent(eventName)) {
	        logger.warn("not implemented");
	        throw new Error("not implemented");
	    }
	    else if (eventName && typeof (eventName) === "object") {
	        return "filter:" + (eventName.address || "*") + ":" + serializeTopics(eventName.topics || []);
	    }
	    throw new Error("invalid event - " + eventName);
	}
	//////////////////////////////
	// Helper Object
	function getTime() {
	    return (new Date()).getTime();
	}
	function stall(duration) {
	    return new Promise(function (resolve) {
	        setTimeout(resolve, duration);
	    });
	}
	//////////////////////////////
	// Provider Object
	/**
	 *  EventType
	 *   - "block"
	 *   - "poll"
	 *   - "didPoll"
	 *   - "pending"
	 *   - "error"
	 *   - "network"
	 *   - filter
	 *   - topics array
	 *   - transaction hash
	 */
	var PollableEvents = ["block", "network", "pending", "poll"];
	var Event = /** @class */ (function () {
	    function Event(tag, listener, once) {
	        lib$3.defineReadOnly(this, "tag", tag);
	        lib$3.defineReadOnly(this, "listener", listener);
	        lib$3.defineReadOnly(this, "once", once);
	    }
	    Object.defineProperty(Event.prototype, "event", {
	        get: function () {
	            switch (this.type) {
	                case "tx":
	                    return this.hash;
	                case "filter":
	                    return this.filter;
	            }
	            return this.tag;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Event.prototype, "type", {
	        get: function () {
	            return this.tag.split(":")[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Event.prototype, "hash", {
	        get: function () {
	            var comps = this.tag.split(":");
	            if (comps[0] !== "tx") {
	                return null;
	            }
	            return comps[1];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Event.prototype, "filter", {
	        get: function () {
	            var comps = this.tag.split(":");
	            if (comps[0] !== "filter") {
	                return null;
	            }
	            var address = comps[1];
	            var topics = deserializeTopics(comps[2]);
	            var filter = {};
	            if (topics.length > 0) {
	                filter.topics = topics;
	            }
	            if (address && address !== "*") {
	                filter.address = address;
	            }
	            return filter;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Event.prototype.pollable = function () {
	        return (this.tag.indexOf(":") >= 0 || PollableEvents.indexOf(this.tag) >= 0);
	    };
	    return Event;
	}());
	exports.Event = Event;
	var defaultFormatter = null;
	var nextPollId = 1;
	var BaseProvider = /** @class */ (function (_super) {
	    __extends(BaseProvider, _super);
	    /**
	     *  ready
	     *
	     *  A Promise<Network> that resolves only once the provider is ready.
	     *
	     *  Sub-classes that call the super with a network without a chainId
	     *  MUST set this. Standard named networks have a known chainId.
	     *
	     */
	    function BaseProvider(network) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, lib$b.Provider);
	        _this = _super.call(this) || this;
	        // Events being listened to
	        _this._events = [];
	        _this._emitted = { block: -2 };
	        _this.formatter = _newTarget.getFormatter();
	        // If network is any, this Provider allows the underlying
	        // network to change dynamically, and we auto-detect the
	        // current network
	        lib$3.defineReadOnly(_this, "anyNetwork", (network === "any"));
	        if (_this.anyNetwork) {
	            network = _this.detectNetwork();
	        }
	        if (network instanceof Promise) {
	            _this._networkPromise = network;
	            // Squash any "unhandled promise" errors; that do not need to be handled
	            network.catch(function (error) { });
	            // Trigger initial network setting (async)
	            _this._ready().catch(function (error) { });
	        }
	        else {
	            var knownNetwork = lib$3.getStatic((_newTarget), "getNetwork")(network);
	            if (knownNetwork) {
	                lib$3.defineReadOnly(_this, "_network", knownNetwork);
	                _this.emit("network", knownNetwork, null);
	            }
	            else {
	                logger.throwArgumentError("invalid network", "network", network);
	            }
	        }
	        _this._maxInternalBlockNumber = -1024;
	        _this._lastBlockNumber = -2;
	        _this._pollingInterval = 4000;
	        _this._fastQueryDate = 0;
	        return _this;
	    }
	    BaseProvider.prototype._ready = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var network, error_1;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!(this._network == null)) return [3 /*break*/, 7];
	                        network = null;
	                        if (!this._networkPromise) return [3 /*break*/, 4];
	                        _a.label = 1;
	                    case 1:
	                        _a.trys.push([1, 3, , 4]);
	                        return [4 /*yield*/, this._networkPromise];
	                    case 2:
	                        network = _a.sent();
	                        return [3 /*break*/, 4];
	                    case 3:
	                        error_1 = _a.sent();
	                        return [3 /*break*/, 4];
	                    case 4:
	                        if (!(network == null)) return [3 /*break*/, 6];
	                        return [4 /*yield*/, this.detectNetwork()];
	                    case 5:
	                        network = _a.sent();
	                        _a.label = 6;
	                    case 6:
	                        // This should never happen; every Provider sub-class should have
	                        // suggested a network by here (or have thrown).
	                        if (!network) {
	                            logger.throwError("no network detected", lib.Logger.errors.UNKNOWN_ERROR, {});
	                        }
	                        // Possible this call stacked so do not call defineReadOnly again
	                        if (this._network == null) {
	                            if (this.anyNetwork) {
	                                this._network = network;
	                            }
	                            else {
	                                lib$3.defineReadOnly(this, "_network", network);
	                            }
	                            this.emit("network", network, null);
	                        }
	                        _a.label = 7;
	                    case 7: return [2 /*return*/, this._network];
	                }
	            });
	        });
	    };
	    Object.defineProperty(BaseProvider.prototype, "ready", {
	        // This will always return the most recently established network.
	        // For "any", this can change (a "network" event is emitted before
	        // any change is refelcted); otherwise this cannot change
	        get: function () {
	            var _this = this;
	            return lib$l.poll(function () {
	                return _this._ready().then(function (network) {
	                    return network;
	                }, function (error) {
	                    // If the network isn't running yet, we will wait
	                    if (error.code === lib.Logger.errors.NETWORK_ERROR && error.event === "noNetwork") {
	                        return undefined;
	                    }
	                    throw error;
	                });
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    // @TODO: Remove this and just create a singleton formatter
	    BaseProvider.getFormatter = function () {
	        if (defaultFormatter == null) {
	            defaultFormatter = new formatter.Formatter();
	        }
	        return defaultFormatter;
	    };
	    // @TODO: Remove this and just use getNetwork
	    BaseProvider.getNetwork = function (network) {
	        return lib$k.getNetwork((network == null) ? "homestead" : network);
	    };
	    // Fetches the blockNumber, but will reuse any result that is less
	    // than maxAge old or has been requested since the last request
	    BaseProvider.prototype._getInternalBlockNumber = function (maxAge) {
	        return __awaiter(this, void 0, void 0, function () {
	            var internalBlockNumber, result, reqTime, checkInternalBlockNumber;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this._ready()];
	                    case 1:
	                        _a.sent();
	                        internalBlockNumber = this._internalBlockNumber;
	                        if (!(maxAge > 0 && this._internalBlockNumber)) return [3 /*break*/, 3];
	                        return [4 /*yield*/, internalBlockNumber];
	                    case 2:
	                        result = _a.sent();
	                        if ((getTime() - result.respTime) <= maxAge) {
	                            return [2 /*return*/, result.blockNumber];
	                        }
	                        _a.label = 3;
	                    case 3:
	                        reqTime = getTime();
	                        checkInternalBlockNumber = lib$3.resolveProperties({
	                            blockNumber: this.perform("getBlockNumber", {}),
	                            networkError: this.getNetwork().then(function (network) { return (null); }, function (error) { return (error); })
	                        }).then(function (_a) {
	                            var blockNumber = _a.blockNumber, networkError = _a.networkError;
	                            if (networkError) {
	                                // Unremember this bad internal block number
	                                if (_this._internalBlockNumber === checkInternalBlockNumber) {
	                                    _this._internalBlockNumber = null;
	                                }
	                                throw networkError;
	                            }
	                            var respTime = getTime();
	                            blockNumber = lib$2.BigNumber.from(blockNumber).toNumber();
	                            if (blockNumber < _this._maxInternalBlockNumber) {
	                                blockNumber = _this._maxInternalBlockNumber;
	                            }
	                            _this._maxInternalBlockNumber = blockNumber;
	                            _this._setFastBlockNumber(blockNumber); // @TODO: Still need this?
	                            return { blockNumber: blockNumber, reqTime: reqTime, respTime: respTime };
	                        });
	                        this._internalBlockNumber = checkInternalBlockNumber;
	                        return [4 /*yield*/, checkInternalBlockNumber];
	                    case 4: return [2 /*return*/, (_a.sent()).blockNumber];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.poll = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var pollId, runners, blockNumber, i;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        pollId = nextPollId++;
	                        runners = [];
	                        return [4 /*yield*/, this._getInternalBlockNumber(100 + this.pollingInterval / 2)];
	                    case 1:
	                        blockNumber = _a.sent();
	                        this._setFastBlockNumber(blockNumber);
	                        // Emit a poll event after we have the latest (fast) block number
	                        this.emit("poll", pollId, blockNumber);
	                        // If the block has not changed, meh.
	                        if (blockNumber === this._lastBlockNumber) {
	                            this.emit("didPoll", pollId);
	                            return [2 /*return*/];
	                        }
	                        // First polling cycle, trigger a "block" events
	                        if (this._emitted.block === -2) {
	                            this._emitted.block = blockNumber - 1;
	                        }
	                        if (Math.abs((this._emitted.block) - blockNumber) > 1000) {
	                            logger.warn("network block skew detected; skipping block events");
	                            this.emit("error", logger.makeError("network block skew detected", lib.Logger.errors.NETWORK_ERROR, {
	                                blockNumber: blockNumber,
	                                event: "blockSkew",
	                                previousBlockNumber: this._emitted.block
	                            }));
	                            this.emit("block", blockNumber);
	                        }
	                        else {
	                            // Notify all listener for each block that has passed
	                            for (i = this._emitted.block + 1; i <= blockNumber; i++) {
	                                this.emit("block", i);
	                            }
	                        }
	                        // The emitted block was updated, check for obsolete events
	                        if (this._emitted.block !== blockNumber) {
	                            this._emitted.block = blockNumber;
	                            Object.keys(this._emitted).forEach(function (key) {
	                                // The block event does not expire
	                                if (key === "block") {
	                                    return;
	                                }
	                                // The block we were at when we emitted this event
	                                var eventBlockNumber = _this._emitted[key];
	                                // We cannot garbage collect pending transactions or blocks here
	                                // They should be garbage collected by the Provider when setting
	                                // "pending" events
	                                if (eventBlockNumber === "pending") {
	                                    return;
	                                }
	                                // Evict any transaction hashes or block hashes over 12 blocks
	                                // old, since they should not return null anyways
	                                if (blockNumber - eventBlockNumber > 12) {
	                                    delete _this._emitted[key];
	                                }
	                            });
	                        }
	                        // First polling cycle
	                        if (this._lastBlockNumber === -2) {
	                            this._lastBlockNumber = blockNumber - 1;
	                        }
	                        // Find all transaction hashes we are waiting on
	                        this._events.forEach(function (event) {
	                            switch (event.type) {
	                                case "tx": {
	                                    var hash_2 = event.hash;
	                                    var runner = _this.getTransactionReceipt(hash_2).then(function (receipt) {
	                                        if (!receipt || receipt.blockNumber == null) {
	                                            return null;
	                                        }
	                                        _this._emitted["t:" + hash_2] = receipt.blockNumber;
	                                        _this.emit(hash_2, receipt);
	                                        return null;
	                                    }).catch(function (error) { _this.emit("error", error); });
	                                    runners.push(runner);
	                                    break;
	                                }
	                                case "filter": {
	                                    var filter_1 = event.filter;
	                                    filter_1.fromBlock = _this._lastBlockNumber + 1;
	                                    filter_1.toBlock = blockNumber;
	                                    var runner = _this.getLogs(filter_1).then(function (logs) {
	                                        if (logs.length === 0) {
	                                            return;
	                                        }
	                                        logs.forEach(function (log) {
	                                            _this._emitted["b:" + log.blockHash] = log.blockNumber;
	                                            _this._emitted["t:" + log.transactionHash] = log.blockNumber;
	                                            _this.emit(filter_1, log);
	                                        });
	                                    }).catch(function (error) { _this.emit("error", error); });
	                                    runners.push(runner);
	                                    break;
	                                }
	                            }
	                        });
	                        this._lastBlockNumber = blockNumber;
	                        // Once all events for this loop have been processed, emit "didPoll"
	                        Promise.all(runners).then(function () {
	                            _this.emit("didPoll", pollId);
	                        });
	                        return [2 /*return*/, null];
	                }
	            });
	        });
	    };
	    // Deprecated; do not use this
	    BaseProvider.prototype.resetEventsBlock = function (blockNumber) {
	        this._lastBlockNumber = blockNumber - 1;
	        if (this.polling) {
	            this.poll();
	        }
	    };
	    Object.defineProperty(BaseProvider.prototype, "network", {
	        get: function () {
	            return this._network;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    // This method should query the network if the underlying network
	    // can change, such as when connected to a JSON-RPC backend
	    BaseProvider.prototype.detectNetwork = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                return [2 /*return*/, logger.throwError("provider does not support network detection", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                        operation: "provider.detectNetwork"
	                    })];
	            });
	        });
	    };
	    BaseProvider.prototype.getNetwork = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var network, currentNetwork, error;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this._ready()];
	                    case 1:
	                        network = _a.sent();
	                        return [4 /*yield*/, this.detectNetwork()];
	                    case 2:
	                        currentNetwork = _a.sent();
	                        if (!(network.chainId !== currentNetwork.chainId)) return [3 /*break*/, 5];
	                        if (!this.anyNetwork) return [3 /*break*/, 4];
	                        this._network = currentNetwork;
	                        // Reset all internal block number guards and caches
	                        this._lastBlockNumber = -2;
	                        this._fastBlockNumber = null;
	                        this._fastBlockNumberPromise = null;
	                        this._fastQueryDate = 0;
	                        this._emitted.block = -2;
	                        this._maxInternalBlockNumber = -1024;
	                        this._internalBlockNumber = null;
	                        // The "network" event MUST happen before this method resolves
	                        // so any events have a chance to unregister, so we stall an
	                        // additional event loop before returning from /this/ call
	                        this.emit("network", currentNetwork, network);
	                        return [4 /*yield*/, stall(0)];
	                    case 3:
	                        _a.sent();
	                        return [2 /*return*/, this._network];
	                    case 4:
	                        error = logger.makeError("underlying network changed", lib.Logger.errors.NETWORK_ERROR, {
	                            event: "changed",
	                            network: network,
	                            detectedNetwork: currentNetwork
	                        });
	                        this.emit("error", error);
	                        throw error;
	                    case 5: return [2 /*return*/, network];
	                }
	            });
	        });
	    };
	    Object.defineProperty(BaseProvider.prototype, "blockNumber", {
	        get: function () {
	            var _this = this;
	            this._getInternalBlockNumber(100 + this.pollingInterval / 2).then(function (blockNumber) {
	                _this._setFastBlockNumber(blockNumber);
	            });
	            return (this._fastBlockNumber != null) ? this._fastBlockNumber : -1;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BaseProvider.prototype, "polling", {
	        get: function () {
	            return (this._poller != null);
	        },
	        set: function (value) {
	            var _this = this;
	            if (value && !this._poller) {
	                this._poller = setInterval(this.poll.bind(this), this.pollingInterval);
	                if (!this._bootstrapPoll) {
	                    this._bootstrapPoll = setTimeout(function () {
	                        _this.poll();
	                        // We block additional polls until the polling interval
	                        // is done, to prevent overwhelming the poll function
	                        _this._bootstrapPoll = setTimeout(function () {
	                            // If polling was disabled, something may require a poke
	                            // since starting the bootstrap poll and it was disabled
	                            if (!_this._poller) {
	                                _this.poll();
	                            }
	                            // Clear out the bootstrap so we can do another
	                            _this._bootstrapPoll = null;
	                        }, _this.pollingInterval);
	                    }, 0);
	                }
	            }
	            else if (!value && this._poller) {
	                clearInterval(this._poller);
	                this._poller = null;
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BaseProvider.prototype, "pollingInterval", {
	        get: function () {
	            return this._pollingInterval;
	        },
	        set: function (value) {
	            var _this = this;
	            if (typeof (value) !== "number" || value <= 0 || parseInt(String(value)) != value) {
	                throw new Error("invalid polling interval");
	            }
	            this._pollingInterval = value;
	            if (this._poller) {
	                clearInterval(this._poller);
	                this._poller = setInterval(function () { _this.poll(); }, this._pollingInterval);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BaseProvider.prototype._getFastBlockNumber = function () {
	        var _this = this;
	        var now = getTime();
	        // Stale block number, request a newer value
	        if ((now - this._fastQueryDate) > 2 * this._pollingInterval) {
	            this._fastQueryDate = now;
	            this._fastBlockNumberPromise = this.getBlockNumber().then(function (blockNumber) {
	                if (_this._fastBlockNumber == null || blockNumber > _this._fastBlockNumber) {
	                    _this._fastBlockNumber = blockNumber;
	                }
	                return _this._fastBlockNumber;
	            });
	        }
	        return this._fastBlockNumberPromise;
	    };
	    BaseProvider.prototype._setFastBlockNumber = function (blockNumber) {
	        // Older block, maybe a stale request
	        if (this._fastBlockNumber != null && blockNumber < this._fastBlockNumber) {
	            return;
	        }
	        // Update the time we updated the blocknumber
	        this._fastQueryDate = getTime();
	        // Newer block number, use  it
	        if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
	            this._fastBlockNumber = blockNumber;
	            this._fastBlockNumberPromise = Promise.resolve(blockNumber);
	        }
	    };
	    BaseProvider.prototype.waitForTransaction = function (transactionHash, confirmations, timeout) {
	        return __awaiter(this, void 0, void 0, function () {
	            var receipt;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (confirmations == null) {
	                            confirmations = 1;
	                        }
	                        return [4 /*yield*/, this.getTransactionReceipt(transactionHash)];
	                    case 1:
	                        receipt = _a.sent();
	                        // Receipt is already good
	                        if ((receipt ? receipt.confirmations : 0) >= confirmations) {
	                            return [2 /*return*/, receipt];
	                        }
	                        // Poll until the receipt is good...
	                        return [2 /*return*/, new Promise(function (resolve, reject) {
	                                var timer = null;
	                                var done = false;
	                                var handler = function (receipt) {
	                                    if (receipt.confirmations < confirmations) {
	                                        return;
	                                    }
	                                    if (timer) {
	                                        clearTimeout(timer);
	                                    }
	                                    if (done) {
	                                        return;
	                                    }
	                                    done = true;
	                                    _this.removeListener(transactionHash, handler);
	                                    resolve(receipt);
	                                };
	                                _this.on(transactionHash, handler);
	                                if (typeof (timeout) === "number" && timeout > 0) {
	                                    timer = setTimeout(function () {
	                                        if (done) {
	                                            return;
	                                        }
	                                        timer = null;
	                                        done = true;
	                                        _this.removeListener(transactionHash, handler);
	                                        reject(logger.makeError("timeout exceeded", lib.Logger.errors.TIMEOUT, { timeout: timeout }));
	                                    }, timeout);
	                                    if (timer.unref) {
	                                        timer.unref();
	                                    }
	                                }
	                            })];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.getBlockNumber = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                return [2 /*return*/, this._getInternalBlockNumber(0)];
	            });
	        });
	    };
	    BaseProvider.prototype.getGasPrice = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var _a, _b;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _c.sent();
	                        _b = (_a = lib$2.BigNumber).from;
	                        return [4 /*yield*/, this.perform("getGasPrice", {})];
	                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.getBalance = function (addressOrName, blockTag) {
	        return __awaiter(this, void 0, void 0, function () {
	            var params, _a, _b;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _c.sent();
	                        return [4 /*yield*/, lib$3.resolveProperties({
	                                address: this._getAddress(addressOrName),
	                                blockTag: this._getBlockTag(blockTag)
	                            })];
	                    case 2:
	                        params = _c.sent();
	                        _b = (_a = lib$2.BigNumber).from;
	                        return [4 /*yield*/, this.perform("getBalance", params)];
	                    case 3: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.getTransactionCount = function (addressOrName, blockTag) {
	        return __awaiter(this, void 0, void 0, function () {
	            var params, _a, _b;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _c.sent();
	                        return [4 /*yield*/, lib$3.resolveProperties({
	                                address: this._getAddress(addressOrName),
	                                blockTag: this._getBlockTag(blockTag)
	                            })];
	                    case 2:
	                        params = _c.sent();
	                        _b = (_a = lib$2.BigNumber).from;
	                        return [4 /*yield*/, this.perform("getTransactionCount", params)];
	                    case 3: return [2 /*return*/, _b.apply(_a, [_c.sent()]).toNumber()];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.getCode = function (addressOrName, blockTag) {
	        return __awaiter(this, void 0, void 0, function () {
	            var params, _a;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _b.sent();
	                        return [4 /*yield*/, lib$3.resolveProperties({
	                                address: this._getAddress(addressOrName),
	                                blockTag: this._getBlockTag(blockTag)
	                            })];
	                    case 2:
	                        params = _b.sent();
	                        _a = lib$1.hexlify;
	                        return [4 /*yield*/, this.perform("getCode", params)];
	                    case 3: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.getStorageAt = function (addressOrName, position, blockTag) {
	        return __awaiter(this, void 0, void 0, function () {
	            var params, _a;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _b.sent();
	                        return [4 /*yield*/, lib$3.resolveProperties({
	                                address: this._getAddress(addressOrName),
	                                blockTag: this._getBlockTag(blockTag),
	                                position: Promise.resolve(position).then(function (p) { return lib$1.hexValue(p); })
	                            })];
	                    case 2:
	                        params = _b.sent();
	                        _a = lib$1.hexlify;
	                        return [4 /*yield*/, this.perform("getStorageAt", params)];
	                    case 3: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
	                }
	            });
	        });
	    };
	    // This should be called by any subclass wrapping a TransactionResponse
	    BaseProvider.prototype._wrapTransaction = function (tx, hash) {
	        var _this = this;
	        if (hash != null && lib$1.hexDataLength(hash) !== 32) {
	            throw new Error("invalid response - sendTransaction");
	        }
	        var result = tx;
	        // Check the hash we expect is the same as the hash the server reported
	        if (hash != null && tx.hash !== hash) {
	            logger.throwError("Transaction hash mismatch from Provider.sendTransaction.", lib.Logger.errors.UNKNOWN_ERROR, { expectedHash: tx.hash, returnedHash: hash });
	        }
	        // @TODO: (confirmations? number, timeout? number)
	        result.wait = function (confirmations) { return __awaiter(_this, void 0, void 0, function () {
	            var receipt;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        // We know this transaction *must* exist (whether it gets mined is
	                        // another story), so setting an emitted value forces us to
	                        // wait even if the node returns null for the receipt
	                        if (confirmations !== 0) {
	                            this._emitted["t:" + tx.hash] = "pending";
	                        }
	                        return [4 /*yield*/, this.waitForTransaction(tx.hash, confirmations)];
	                    case 1:
	                        receipt = _a.sent();
	                        if (receipt == null && confirmations === 0) {
	                            return [2 /*return*/, null];
	                        }
	                        // No longer pending, allow the polling loop to garbage collect this
	                        this._emitted["t:" + tx.hash] = receipt.blockNumber;
	                        if (receipt.status === 0) {
	                            logger.throwError("transaction failed", lib.Logger.errors.CALL_EXCEPTION, {
	                                transactionHash: tx.hash,
	                                transaction: tx,
	                                receipt: receipt
	                            });
	                        }
	                        return [2 /*return*/, receipt];
	                }
	            });
	        }); };
	        return result;
	    };
	    BaseProvider.prototype.sendTransaction = function (signedTransaction) {
	        return __awaiter(this, void 0, void 0, function () {
	            var hexTx, tx, hash, error_2;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _a.sent();
	                        return [4 /*yield*/, Promise.resolve(signedTransaction).then(function (t) { return lib$1.hexlify(t); })];
	                    case 2:
	                        hexTx = _a.sent();
	                        tx = this.formatter.transaction(signedTransaction);
	                        _a.label = 3;
	                    case 3:
	                        _a.trys.push([3, 5, , 6]);
	                        return [4 /*yield*/, this.perform("sendTransaction", { signedTransaction: hexTx })];
	                    case 4:
	                        hash = _a.sent();
	                        return [2 /*return*/, this._wrapTransaction(tx, hash)];
	                    case 5:
	                        error_2 = _a.sent();
	                        error_2.transaction = tx;
	                        error_2.transactionHash = tx.hash;
	                        throw error_2;
	                    case 6: return [2 /*return*/];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype._getTransactionRequest = function (transaction) {
	        return __awaiter(this, void 0, void 0, function () {
	            var values, tx, _a, _b;
	            var _this = this;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, transaction];
	                    case 1:
	                        values = _c.sent();
	                        tx = {};
	                        ["from", "to"].forEach(function (key) {
	                            if (values[key] == null) {
	                                return;
	                            }
	                            tx[key] = Promise.resolve(values[key]).then(function (v) { return (v ? _this._getAddress(v) : null); });
	                        });
	                        ["gasLimit", "gasPrice", "value"].forEach(function (key) {
	                            if (values[key] == null) {
	                                return;
	                            }
	                            tx[key] = Promise.resolve(values[key]).then(function (v) { return (v ? lib$2.BigNumber.from(v) : null); });
	                        });
	                        ["data"].forEach(function (key) {
	                            if (values[key] == null) {
	                                return;
	                            }
	                            tx[key] = Promise.resolve(values[key]).then(function (v) { return (v ? lib$1.hexlify(v) : null); });
	                        });
	                        _b = (_a = this.formatter).transactionRequest;
	                        return [4 /*yield*/, lib$3.resolveProperties(tx)];
	                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype._getFilter = function (filter) {
	        return __awaiter(this, void 0, void 0, function () {
	            var result, _a, _b;
	            var _this = this;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, filter];
	                    case 1:
	                        filter = _c.sent();
	                        result = {};
	                        if (filter.address != null) {
	                            result.address = this._getAddress(filter.address);
	                        }
	                        ["blockHash", "topics"].forEach(function (key) {
	                            if (filter[key] == null) {
	                                return;
	                            }
	                            result[key] = filter[key];
	                        });
	                        ["fromBlock", "toBlock"].forEach(function (key) {
	                            if (filter[key] == null) {
	                                return;
	                            }
	                            result[key] = _this._getBlockTag(filter[key]);
	                        });
	                        _b = (_a = this.formatter).filter;
	                        return [4 /*yield*/, lib$3.resolveProperties(result)];
	                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.call = function (transaction, blockTag) {
	        return __awaiter(this, void 0, void 0, function () {
	            var params, _a;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _b.sent();
	                        return [4 /*yield*/, lib$3.resolveProperties({
	                                transaction: this._getTransactionRequest(transaction),
	                                blockTag: this._getBlockTag(blockTag)
	                            })];
	                    case 2:
	                        params = _b.sent();
	                        _a = lib$1.hexlify;
	                        return [4 /*yield*/, this.perform("call", params)];
	                    case 3: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.estimateGas = function (transaction) {
	        return __awaiter(this, void 0, void 0, function () {
	            var params, _a, _b;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _c.sent();
	                        return [4 /*yield*/, lib$3.resolveProperties({
	                                transaction: this._getTransactionRequest(transaction)
	                            })];
	                    case 2:
	                        params = _c.sent();
	                        _b = (_a = lib$2.BigNumber).from;
	                        return [4 /*yield*/, this.perform("estimateGas", params)];
	                    case 3: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype._getAddress = function (addressOrName) {
	        return __awaiter(this, void 0, void 0, function () {
	            var address;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.resolveName(addressOrName)];
	                    case 1:
	                        address = _a.sent();
	                        if (address == null) {
	                            logger.throwError("ENS name not configured", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                                operation: "resolveName(" + JSON.stringify(addressOrName) + ")"
	                            });
	                        }
	                        return [2 /*return*/, address];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype._getBlock = function (blockHashOrBlockTag, includeTransactions) {
	        return __awaiter(this, void 0, void 0, function () {
	            var blockNumber, params, _a, _b, _c, error_3;
	            var _this = this;
	            return __generator(this, function (_d) {
	                switch (_d.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _d.sent();
	                        return [4 /*yield*/, blockHashOrBlockTag];
	                    case 2:
	                        blockHashOrBlockTag = _d.sent();
	                        blockNumber = -128;
	                        params = {
	                            includeTransactions: !!includeTransactions
	                        };
	                        if (!lib$1.isHexString(blockHashOrBlockTag, 32)) return [3 /*break*/, 3];
	                        params.blockHash = blockHashOrBlockTag;
	                        return [3 /*break*/, 6];
	                    case 3:
	                        _d.trys.push([3, 5, , 6]);
	                        _a = params;
	                        _c = (_b = this.formatter).blockTag;
	                        return [4 /*yield*/, this._getBlockTag(blockHashOrBlockTag)];
	                    case 4:
	                        _a.blockTag = _c.apply(_b, [_d.sent()]);
	                        if (lib$1.isHexString(params.blockTag)) {
	                            blockNumber = parseInt(params.blockTag.substring(2), 16);
	                        }
	                        return [3 /*break*/, 6];
	                    case 5:
	                        error_3 = _d.sent();
	                        logger.throwArgumentError("invalid block hash or block tag", "blockHashOrBlockTag", blockHashOrBlockTag);
	                        return [3 /*break*/, 6];
	                    case 6: return [2 /*return*/, lib$l.poll(function () { return __awaiter(_this, void 0, void 0, function () {
	                            var block, blockNumber_1, i, tx, confirmations;
	                            return __generator(this, function (_a) {
	                                switch (_a.label) {
	                                    case 0: return [4 /*yield*/, this.perform("getBlock", params)];
	                                    case 1:
	                                        block = _a.sent();
	                                        // Block was not found
	                                        if (block == null) {
	                                            // For blockhashes, if we didn't say it existed, that blockhash may
	                                            // not exist. If we did see it though, perhaps from a log, we know
	                                            // it exists, and this node is just not caught up yet.
	                                            if (params.blockHash != null) {
	                                                if (this._emitted["b:" + params.blockHash] == null) {
	                                                    return [2 /*return*/, null];
	                                                }
	                                            }
	                                            // For block tags, if we are asking for a future block, we return null
	                                            if (params.blockTag != null) {
	                                                if (blockNumber > this._emitted.block) {
	                                                    return [2 /*return*/, null];
	                                                }
	                                            }
	                                            // Retry on the next block
	                                            return [2 /*return*/, undefined];
	                                        }
	                                        if (!includeTransactions) return [3 /*break*/, 8];
	                                        blockNumber_1 = null;
	                                        i = 0;
	                                        _a.label = 2;
	                                    case 2:
	                                        if (!(i < block.transactions.length)) return [3 /*break*/, 7];
	                                        tx = block.transactions[i];
	                                        if (!(tx.blockNumber == null)) return [3 /*break*/, 3];
	                                        tx.confirmations = 0;
	                                        return [3 /*break*/, 6];
	                                    case 3:
	                                        if (!(tx.confirmations == null)) return [3 /*break*/, 6];
	                                        if (!(blockNumber_1 == null)) return [3 /*break*/, 5];
	                                        return [4 /*yield*/, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
	                                    case 4:
	                                        blockNumber_1 = _a.sent();
	                                        _a.label = 5;
	                                    case 5:
	                                        confirmations = (blockNumber_1 - tx.blockNumber) + 1;
	                                        if (confirmations <= 0) {
	                                            confirmations = 1;
	                                        }
	                                        tx.confirmations = confirmations;
	                                        _a.label = 6;
	                                    case 6:
	                                        i++;
	                                        return [3 /*break*/, 2];
	                                    case 7: return [2 /*return*/, this.formatter.blockWithTransactions(block)];
	                                    case 8: return [2 /*return*/, this.formatter.block(block)];
	                                }
	                            });
	                        }); }, { oncePoll: this })];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.getBlock = function (blockHashOrBlockTag) {
	        return (this._getBlock(blockHashOrBlockTag, false));
	    };
	    BaseProvider.prototype.getBlockWithTransactions = function (blockHashOrBlockTag) {
	        return (this._getBlock(blockHashOrBlockTag, true));
	    };
	    BaseProvider.prototype.getTransaction = function (transactionHash) {
	        return __awaiter(this, void 0, void 0, function () {
	            var params;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _a.sent();
	                        return [4 /*yield*/, transactionHash];
	                    case 2:
	                        transactionHash = _a.sent();
	                        params = { transactionHash: this.formatter.hash(transactionHash, true) };
	                        return [2 /*return*/, lib$l.poll(function () { return __awaiter(_this, void 0, void 0, function () {
	                                var result, tx, blockNumber, confirmations;
	                                return __generator(this, function (_a) {
	                                    switch (_a.label) {
	                                        case 0: return [4 /*yield*/, this.perform("getTransaction", params)];
	                                        case 1:
	                                            result = _a.sent();
	                                            if (result == null) {
	                                                if (this._emitted["t:" + transactionHash] == null) {
	                                                    return [2 /*return*/, null];
	                                                }
	                                                return [2 /*return*/, undefined];
	                                            }
	                                            tx = this.formatter.transactionResponse(result);
	                                            if (!(tx.blockNumber == null)) return [3 /*break*/, 2];
	                                            tx.confirmations = 0;
	                                            return [3 /*break*/, 4];
	                                        case 2:
	                                            if (!(tx.confirmations == null)) return [3 /*break*/, 4];
	                                            return [4 /*yield*/, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
	                                        case 3:
	                                            blockNumber = _a.sent();
	                                            confirmations = (blockNumber - tx.blockNumber) + 1;
	                                            if (confirmations <= 0) {
	                                                confirmations = 1;
	                                            }
	                                            tx.confirmations = confirmations;
	                                            _a.label = 4;
	                                        case 4: return [2 /*return*/, this._wrapTransaction(tx)];
	                                    }
	                                });
	                            }); }, { oncePoll: this })];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.getTransactionReceipt = function (transactionHash) {
	        return __awaiter(this, void 0, void 0, function () {
	            var params;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _a.sent();
	                        return [4 /*yield*/, transactionHash];
	                    case 2:
	                        transactionHash = _a.sent();
	                        params = { transactionHash: this.formatter.hash(transactionHash, true) };
	                        return [2 /*return*/, lib$l.poll(function () { return __awaiter(_this, void 0, void 0, function () {
	                                var result, receipt, blockNumber, confirmations;
	                                return __generator(this, function (_a) {
	                                    switch (_a.label) {
	                                        case 0: return [4 /*yield*/, this.perform("getTransactionReceipt", params)];
	                                        case 1:
	                                            result = _a.sent();
	                                            if (result == null) {
	                                                if (this._emitted["t:" + transactionHash] == null) {
	                                                    return [2 /*return*/, null];
	                                                }
	                                                return [2 /*return*/, undefined];
	                                            }
	                                            // "geth-etc" returns receipts before they are ready
	                                            if (result.blockHash == null) {
	                                                return [2 /*return*/, undefined];
	                                            }
	                                            receipt = this.formatter.receipt(result);
	                                            if (!(receipt.blockNumber == null)) return [3 /*break*/, 2];
	                                            receipt.confirmations = 0;
	                                            return [3 /*break*/, 4];
	                                        case 2:
	                                            if (!(receipt.confirmations == null)) return [3 /*break*/, 4];
	                                            return [4 /*yield*/, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
	                                        case 3:
	                                            blockNumber = _a.sent();
	                                            confirmations = (blockNumber - receipt.blockNumber) + 1;
	                                            if (confirmations <= 0) {
	                                                confirmations = 1;
	                                            }
	                                            receipt.confirmations = confirmations;
	                                            _a.label = 4;
	                                        case 4: return [2 /*return*/, receipt];
	                                    }
	                                });
	                            }); }, { oncePoll: this })];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.getLogs = function (filter) {
	        return __awaiter(this, void 0, void 0, function () {
	            var params, logs;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _a.sent();
	                        return [4 /*yield*/, lib$3.resolveProperties({ filter: this._getFilter(filter) })];
	                    case 2:
	                        params = _a.sent();
	                        return [4 /*yield*/, this.perform("getLogs", params)];
	                    case 3:
	                        logs = _a.sent();
	                        logs.forEach(function (log) {
	                            if (log.removed == null) {
	                                log.removed = false;
	                            }
	                        });
	                        return [2 /*return*/, formatter.Formatter.arrayOf(this.formatter.filterLog.bind(this.formatter))(logs)];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.getEtherPrice = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        _a.sent();
	                        return [2 /*return*/, this.perform("getEtherPrice", {})];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype._getBlockTag = function (blockTag) {
	        return __awaiter(this, void 0, void 0, function () {
	            var blockNumber;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, blockTag];
	                    case 1:
	                        blockTag = _a.sent();
	                        if (!(typeof (blockTag) === "number" && blockTag < 0)) return [3 /*break*/, 3];
	                        if (blockTag % 1) {
	                            logger.throwArgumentError("invalid BlockTag", "blockTag", blockTag);
	                        }
	                        return [4 /*yield*/, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
	                    case 2:
	                        blockNumber = _a.sent();
	                        blockNumber += blockTag;
	                        if (blockNumber < 0) {
	                            blockNumber = 0;
	                        }
	                        return [2 /*return*/, this.formatter.blockTag(blockNumber)];
	                    case 3: return [2 /*return*/, this.formatter.blockTag(blockTag)];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype._getResolver = function (name) {
	        return __awaiter(this, void 0, void 0, function () {
	            var network, transaction, _a, _b;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, this.getNetwork()];
	                    case 1:
	                        network = _c.sent();
	                        // No ENS...
	                        if (!network.ensAddress) {
	                            logger.throwError("network does not support ENS", lib.Logger.errors.UNSUPPORTED_OPERATION, { operation: "ENS", network: network.name });
	                        }
	                        transaction = {
	                            to: network.ensAddress,
	                            data: ("0x0178b8bf" + lib$9.namehash(name).substring(2))
	                        };
	                        _b = (_a = this.formatter).callAddress;
	                        return [4 /*yield*/, this.call(transaction)];
	                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.resolveName = function (name) {
	        return __awaiter(this, void 0, void 0, function () {
	            var resolverAddress, transaction, _a, _b;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, name];
	                    case 1:
	                        name = _c.sent();
	                        // If it is already an address, nothing to resolve
	                        try {
	                            return [2 /*return*/, Promise.resolve(this.formatter.address(name))];
	                        }
	                        catch (error) {
	                            // If is is a hexstring, the address is bad (See #694)
	                            if (lib$1.isHexString(name)) {
	                                throw error;
	                            }
	                        }
	                        if (typeof (name) !== "string") {
	                            logger.throwArgumentError("invalid ENS name", "name", name);
	                        }
	                        return [4 /*yield*/, this._getResolver(name)];
	                    case 2:
	                        resolverAddress = _c.sent();
	                        if (!resolverAddress) {
	                            return [2 /*return*/, null];
	                        }
	                        transaction = {
	                            to: resolverAddress,
	                            data: ("0x3b3b57de" + lib$9.namehash(name).substring(2))
	                        };
	                        _b = (_a = this.formatter).callAddress;
	                        return [4 /*yield*/, this.call(transaction)];
	                    case 3: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.lookupAddress = function (address) {
	        return __awaiter(this, void 0, void 0, function () {
	            var reverseName, resolverAddress, bytes, _a, length, name, addr;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, address];
	                    case 1:
	                        address = _b.sent();
	                        address = this.formatter.address(address);
	                        reverseName = address.substring(2).toLowerCase() + ".addr.reverse";
	                        return [4 /*yield*/, this._getResolver(reverseName)];
	                    case 2:
	                        resolverAddress = _b.sent();
	                        if (!resolverAddress) {
	                            return [2 /*return*/, null];
	                        }
	                        _a = lib$1.arrayify;
	                        return [4 /*yield*/, this.call({
	                                to: resolverAddress,
	                                data: ("0x691f3431" + lib$9.namehash(reverseName).substring(2))
	                            })];
	                    case 3:
	                        bytes = _a.apply(void 0, [_b.sent()]);
	                        // Strip off the dynamic string pointer (0x20)
	                        if (bytes.length < 32 || !lib$2.BigNumber.from(bytes.slice(0, 32)).eq(32)) {
	                            return [2 /*return*/, null];
	                        }
	                        bytes = bytes.slice(32);
	                        // Not a length-prefixed string
	                        if (bytes.length < 32) {
	                            return [2 /*return*/, null];
	                        }
	                        length = lib$2.BigNumber.from(bytes.slice(0, 32)).toNumber();
	                        bytes = bytes.slice(32);
	                        // Length longer than available data
	                        if (length > bytes.length) {
	                            return [2 /*return*/, null];
	                        }
	                        name = lib$8.toUtf8String(bytes.slice(0, length));
	                        return [4 /*yield*/, this.resolveName(name)];
	                    case 4:
	                        addr = _b.sent();
	                        if (addr != address) {
	                            return [2 /*return*/, null];
	                        }
	                        return [2 /*return*/, name];
	                }
	            });
	        });
	    };
	    BaseProvider.prototype.perform = function (method, params) {
	        return logger.throwError(method + " not implemented", lib.Logger.errors.NOT_IMPLEMENTED, { operation: method });
	    };
	    BaseProvider.prototype._startEvent = function (event) {
	        this.polling = (this._events.filter(function (e) { return e.pollable(); }).length > 0);
	    };
	    BaseProvider.prototype._stopEvent = function (event) {
	        this.polling = (this._events.filter(function (e) { return e.pollable(); }).length > 0);
	    };
	    BaseProvider.prototype._addEventListener = function (eventName, listener, once) {
	        var event = new Event(getEventTag(eventName), listener, once);
	        this._events.push(event);
	        this._startEvent(event);
	        return this;
	    };
	    BaseProvider.prototype.on = function (eventName, listener) {
	        return this._addEventListener(eventName, listener, false);
	    };
	    BaseProvider.prototype.once = function (eventName, listener) {
	        return this._addEventListener(eventName, listener, true);
	    };
	    BaseProvider.prototype.emit = function (eventName) {
	        var _this = this;
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var result = false;
	        var stopped = [];
	        var eventTag = getEventTag(eventName);
	        this._events = this._events.filter(function (event) {
	            if (event.tag !== eventTag) {
	                return true;
	            }
	            setTimeout(function () {
	                event.listener.apply(_this, args);
	            }, 0);
	            result = true;
	            if (event.once) {
	                stopped.push(event);
	                return false;
	            }
	            return true;
	        });
	        stopped.forEach(function (event) { _this._stopEvent(event); });
	        return result;
	    };
	    BaseProvider.prototype.listenerCount = function (eventName) {
	        if (!eventName) {
	            return this._events.length;
	        }
	        var eventTag = getEventTag(eventName);
	        return this._events.filter(function (event) {
	            return (event.tag === eventTag);
	        }).length;
	    };
	    BaseProvider.prototype.listeners = function (eventName) {
	        if (eventName == null) {
	            return this._events.map(function (event) { return event.listener; });
	        }
	        var eventTag = getEventTag(eventName);
	        return this._events
	            .filter(function (event) { return (event.tag === eventTag); })
	            .map(function (event) { return event.listener; });
	    };
	    BaseProvider.prototype.off = function (eventName, listener) {
	        var _this = this;
	        if (listener == null) {
	            return this.removeAllListeners(eventName);
	        }
	        var stopped = [];
	        var found = false;
	        var eventTag = getEventTag(eventName);
	        this._events = this._events.filter(function (event) {
	            if (event.tag !== eventTag || event.listener != listener) {
	                return true;
	            }
	            if (found) {
	                return true;
	            }
	            found = true;
	            stopped.push(event);
	            return false;
	        });
	        stopped.forEach(function (event) { _this._stopEvent(event); });
	        return this;
	    };
	    BaseProvider.prototype.removeAllListeners = function (eventName) {
	        var _this = this;
	        var stopped = [];
	        if (eventName == null) {
	            stopped = this._events;
	            this._events = [];
	        }
	        else {
	            var eventTag_1 = getEventTag(eventName);
	            this._events = this._events.filter(function (event) {
	                if (event.tag !== eventTag_1) {
	                    return true;
	                }
	                stopped.push(event);
	                return false;
	            });
	        }
	        stopped.forEach(function (event) { _this._stopEvent(event); });
	        return this;
	    };
	    return BaseProvider;
	}(lib$b.Provider));
	exports.BaseProvider = BaseProvider;

	});

	var baseProvider$1 = unwrapExports(baseProvider);
	var baseProvider_1 = baseProvider.Event;
	var baseProvider_2 = baseProvider.BaseProvider;

	var browserWs = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });


	var WS = null;
	try {
	    WS = WebSocket;
	    if (WS == null) {
	        throw new Error("inject please");
	    }
	}
	catch (error) {
	    var logger_2 = new lib.Logger(_version$I.version);
	    WS = function () {
	        logger_2.throwError("WebSockets not supported in this environment", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	            operation: "new WebSocket()"
	        });
	    };
	}
	module.exports = WS;

	});

	var browserWs$1 = unwrapExports(browserWs);

	var jsonRpcProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });








	var logger = new lib.Logger(_version$I.version);

	function timer(timeout) {
	    return new Promise(function (resolve) {
	        setTimeout(resolve, timeout);
	    });
	}
	function getResult(payload) {
	    if (payload.error) {
	        // @TODO: not any
	        var error = new Error(payload.error.message);
	        error.code = payload.error.code;
	        error.data = payload.error.data;
	        throw error;
	    }
	    return payload.result;
	}
	function getLowerCase(value) {
	    if (value) {
	        return value.toLowerCase();
	    }
	    return value;
	}
	var _constructorGuard = {};
	var JsonRpcSigner = /** @class */ (function (_super) {
	    __extends(JsonRpcSigner, _super);
	    function JsonRpcSigner(constructorGuard, provider, addressOrIndex) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, JsonRpcSigner);
	        _this = _super.call(this) || this;
	        if (constructorGuard !== _constructorGuard) {
	            throw new Error("do not call the JsonRpcSigner constructor directly; use provider.getSigner");
	        }
	        lib$3.defineReadOnly(_this, "provider", provider);
	        if (addressOrIndex == null) {
	            addressOrIndex = 0;
	        }
	        if (typeof (addressOrIndex) === "string") {
	            lib$3.defineReadOnly(_this, "_address", _this.provider.formatter.address(addressOrIndex));
	            lib$3.defineReadOnly(_this, "_index", null);
	        }
	        else if (typeof (addressOrIndex) === "number") {
	            lib$3.defineReadOnly(_this, "_index", addressOrIndex);
	            lib$3.defineReadOnly(_this, "_address", null);
	        }
	        else {
	            logger.throwArgumentError("invalid address or index", "addressOrIndex", addressOrIndex);
	        }
	        return _this;
	    }
	    JsonRpcSigner.prototype.connect = function (provider) {
	        return logger.throwError("cannot alter JSON-RPC Signer connection", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	            operation: "connect"
	        });
	    };
	    JsonRpcSigner.prototype.connectUnchecked = function () {
	        return new UncheckedJsonRpcSigner(_constructorGuard, this.provider, this._address || this._index);
	    };
	    JsonRpcSigner.prototype.getAddress = function () {
	        var _this = this;
	        if (this._address) {
	            return Promise.resolve(this._address);
	        }
	        return this.provider.send("eth_accounts", []).then(function (accounts) {
	            if (accounts.length <= _this._index) {
	                logger.throwError("unknown account #" + _this._index, lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                    operation: "getAddress"
	                });
	            }
	            return _this.provider.formatter.address(accounts[_this._index]);
	        });
	    };
	    JsonRpcSigner.prototype.sendUncheckedTransaction = function (transaction) {
	        var _this = this;
	        transaction = lib$3.shallowCopy(transaction);
	        var fromAddress = this.getAddress().then(function (address) {
	            if (address) {
	                address = address.toLowerCase();
	            }
	            return address;
	        });
	        // The JSON-RPC for eth_sendTransaction uses 90000 gas; if the user
	        // wishes to use this, it is easy to specify explicitly, otherwise
	        // we look it up for them.
	        if (transaction.gasLimit == null) {
	            var estimate = lib$3.shallowCopy(transaction);
	            estimate.from = fromAddress;
	            transaction.gasLimit = this.provider.estimateGas(estimate);
	        }
	        return lib$3.resolveProperties({
	            tx: lib$3.resolveProperties(transaction),
	            sender: fromAddress
	        }).then(function (_a) {
	            var tx = _a.tx, sender = _a.sender;
	            if (tx.from != null) {
	                if (tx.from.toLowerCase() !== sender) {
	                    logger.throwArgumentError("from address mismatch", "transaction", transaction);
	                }
	            }
	            else {
	                tx.from = sender;
	            }
	            var hexTx = _this.provider.constructor.hexlifyTransaction(tx, { from: true });
	            return _this.provider.send("eth_sendTransaction", [hexTx]).then(function (hash) {
	                return hash;
	            }, function (error) {
	                if (error.responseText) {
	                    // See: JsonRpcProvider.sendTransaction (@TODO: Expose a ._throwError??)
	                    if (error.responseText.indexOf("insufficient funds") >= 0) {
	                        logger.throwError("insufficient funds", lib.Logger.errors.INSUFFICIENT_FUNDS, {
	                            transaction: tx
	                        });
	                    }
	                    if (error.responseText.indexOf("nonce too low") >= 0) {
	                        logger.throwError("nonce has already been used", lib.Logger.errors.NONCE_EXPIRED, {
	                            transaction: tx
	                        });
	                    }
	                    if (error.responseText.indexOf("replacement transaction underpriced") >= 0) {
	                        logger.throwError("replacement fee too low", lib.Logger.errors.REPLACEMENT_UNDERPRICED, {
	                            transaction: tx
	                        });
	                    }
	                }
	                throw error;
	            });
	        });
	    };
	    JsonRpcSigner.prototype.signTransaction = function (transaction) {
	        return logger.throwError("signing transactions is unsupported", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	            operation: "signTransaction"
	        });
	    };
	    JsonRpcSigner.prototype.sendTransaction = function (transaction) {
	        var _this = this;
	        return this.sendUncheckedTransaction(transaction).then(function (hash) {
	            return lib$l.poll(function () {
	                return _this.provider.getTransaction(hash).then(function (tx) {
	                    if (tx === null) {
	                        return undefined;
	                    }
	                    return _this.provider._wrapTransaction(tx, hash);
	                });
	            }, { onceBlock: _this.provider }).catch(function (error) {
	                error.transactionHash = hash;
	                throw error;
	            });
	        });
	    };
	    JsonRpcSigner.prototype.signMessage = function (message) {
	        var _this = this;
	        var data = ((typeof (message) === "string") ? lib$8.toUtf8Bytes(message) : message);
	        return this.getAddress().then(function (address) {
	            // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
	            return _this.provider.send("eth_sign", [address.toLowerCase(), lib$1.hexlify(data)]);
	        });
	    };
	    JsonRpcSigner.prototype.unlock = function (password) {
	        var provider = this.provider;
	        return this.getAddress().then(function (address) {
	            return provider.send("personal_unlockAccount", [address.toLowerCase(), password, null]);
	        });
	    };
	    return JsonRpcSigner;
	}(lib$c.Signer));
	exports.JsonRpcSigner = JsonRpcSigner;
	var UncheckedJsonRpcSigner = /** @class */ (function (_super) {
	    __extends(UncheckedJsonRpcSigner, _super);
	    function UncheckedJsonRpcSigner() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    UncheckedJsonRpcSigner.prototype.sendTransaction = function (transaction) {
	        var _this = this;
	        return this.sendUncheckedTransaction(transaction).then(function (hash) {
	            return {
	                hash: hash,
	                nonce: null,
	                gasLimit: null,
	                gasPrice: null,
	                data: null,
	                value: null,
	                chainId: null,
	                confirmations: 0,
	                from: null,
	                wait: function (confirmations) { return _this.provider.waitForTransaction(hash, confirmations); }
	            };
	        });
	    };
	    return UncheckedJsonRpcSigner;
	}(JsonRpcSigner));
	var allowedTransactionKeys = {
	    chainId: true, data: true, gasLimit: true, gasPrice: true, nonce: true, to: true, value: true
	};
	var JsonRpcProvider = /** @class */ (function (_super) {
	    __extends(JsonRpcProvider, _super);
	    function JsonRpcProvider(url, network) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, JsonRpcProvider);
	        var networkOrReady = network;
	        // The network is unknown, query the JSON-RPC for it
	        if (networkOrReady == null) {
	            networkOrReady = new Promise(function (resolve, reject) {
	                setTimeout(function () {
	                    _this.detectNetwork().then(function (network) {
	                        resolve(network);
	                    }, function (error) {
	                        reject(error);
	                    });
	                }, 0);
	            });
	        }
	        _this = _super.call(this, networkOrReady) || this;
	        // Default URL
	        if (!url) {
	            url = lib$3.getStatic(_this.constructor, "defaultUrl")();
	        }
	        if (typeof (url) === "string") {
	            lib$3.defineReadOnly(_this, "connection", Object.freeze({
	                url: url
	            }));
	        }
	        else {
	            lib$3.defineReadOnly(_this, "connection", Object.freeze(lib$3.shallowCopy(url)));
	        }
	        _this._nextId = 42;
	        return _this;
	    }
	    JsonRpcProvider.defaultUrl = function () {
	        return "http:/\/localhost:8545";
	    };
	    JsonRpcProvider.prototype.detectNetwork = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var chainId, error_1, error_2, getNetwork;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, timer(0)];
	                    case 1:
	                        _a.sent();
	                        chainId = null;
	                        _a.label = 2;
	                    case 2:
	                        _a.trys.push([2, 4, , 9]);
	                        return [4 /*yield*/, this.send("eth_chainId", [])];
	                    case 3:
	                        chainId = _a.sent();
	                        return [3 /*break*/, 9];
	                    case 4:
	                        error_1 = _a.sent();
	                        _a.label = 5;
	                    case 5:
	                        _a.trys.push([5, 7, , 8]);
	                        return [4 /*yield*/, this.send("net_version", [])];
	                    case 6:
	                        chainId = _a.sent();
	                        return [3 /*break*/, 8];
	                    case 7:
	                        error_2 = _a.sent();
	                        return [3 /*break*/, 8];
	                    case 8: return [3 /*break*/, 9];
	                    case 9:
	                        if (chainId != null) {
	                            getNetwork = lib$3.getStatic(this.constructor, "getNetwork");
	                            try {
	                                return [2 /*return*/, getNetwork(lib$2.BigNumber.from(chainId).toNumber())];
	                            }
	                            catch (error) {
	                                return [2 /*return*/, logger.throwError("could not detect network", lib.Logger.errors.NETWORK_ERROR, {
	                                        chainId: chainId,
	                                        event: "invalidNetwork",
	                                        serverError: error
	                                    })];
	                            }
	                        }
	                        return [2 /*return*/, logger.throwError("could not detect network", lib.Logger.errors.NETWORK_ERROR, {
	                                event: "noNetwork"
	                            })];
	                }
	            });
	        });
	    };
	    JsonRpcProvider.prototype.getSigner = function (addressOrIndex) {
	        return new JsonRpcSigner(_constructorGuard, this, addressOrIndex);
	    };
	    JsonRpcProvider.prototype.getUncheckedSigner = function (addressOrIndex) {
	        return this.getSigner(addressOrIndex).connectUnchecked();
	    };
	    JsonRpcProvider.prototype.listAccounts = function () {
	        var _this = this;
	        return this.send("eth_accounts", []).then(function (accounts) {
	            return accounts.map(function (a) { return _this.formatter.address(a); });
	        });
	    };
	    JsonRpcProvider.prototype.send = function (method, params) {
	        var _this = this;
	        var request = {
	            method: method,
	            params: params,
	            id: (this._nextId++),
	            jsonrpc: "2.0"
	        };
	        this.emit("debug", {
	            action: "request",
	            request: lib$3.deepCopy(request),
	            provider: this
	        });
	        return lib$l.fetchJson(this.connection, JSON.stringify(request), getResult).then(function (result) {
	            _this.emit("debug", {
	                action: "response",
	                request: request,
	                response: result,
	                provider: _this
	            });
	            return result;
	        }, function (error) {
	            _this.emit("debug", {
	                action: "response",
	                error: error,
	                request: request,
	                provider: _this
	            });
	            throw error;
	        });
	    };
	    JsonRpcProvider.prototype.prepareRequest = function (method, params) {
	        switch (method) {
	            case "getBlockNumber":
	                return ["eth_blockNumber", []];
	            case "getGasPrice":
	                return ["eth_gasPrice", []];
	            case "getBalance":
	                return ["eth_getBalance", [getLowerCase(params.address), params.blockTag]];
	            case "getTransactionCount":
	                return ["eth_getTransactionCount", [getLowerCase(params.address), params.blockTag]];
	            case "getCode":
	                return ["eth_getCode", [getLowerCase(params.address), params.blockTag]];
	            case "getStorageAt":
	                return ["eth_getStorageAt", [getLowerCase(params.address), params.position, params.blockTag]];
	            case "sendTransaction":
	                return ["eth_sendRawTransaction", [params.signedTransaction]];
	            case "getBlock":
	                if (params.blockTag) {
	                    return ["eth_getBlockByNumber", [params.blockTag, !!params.includeTransactions]];
	                }
	                else if (params.blockHash) {
	                    return ["eth_getBlockByHash", [params.blockHash, !!params.includeTransactions]];
	                }
	                return null;
	            case "getTransaction":
	                return ["eth_getTransactionByHash", [params.transactionHash]];
	            case "getTransactionReceipt":
	                return ["eth_getTransactionReceipt", [params.transactionHash]];
	            case "call": {
	                var hexlifyTransaction = lib$3.getStatic(this.constructor, "hexlifyTransaction");
	                return ["eth_call", [hexlifyTransaction(params.transaction, { from: true }), params.blockTag]];
	            }
	            case "estimateGas": {
	                var hexlifyTransaction = lib$3.getStatic(this.constructor, "hexlifyTransaction");
	                return ["eth_estimateGas", [hexlifyTransaction(params.transaction, { from: true })]];
	            }
	            case "getLogs":
	                if (params.filter && params.filter.address != null) {
	                    params.filter.address = getLowerCase(params.filter.address);
	                }
	                return ["eth_getLogs", [params.filter]];
	            default:
	                break;
	        }
	        return null;
	    };
	    JsonRpcProvider.prototype.perform = function (method, params) {
	        var args = this.prepareRequest(method, params);
	        if (args == null) {
	            logger.throwError(method + " not implemented", lib.Logger.errors.NOT_IMPLEMENTED, { operation: method });
	        }
	        // We need a little extra logic to process errors from sendTransaction
	        if (method === "sendTransaction") {
	            return this.send(args[0], args[1]).catch(function (error) {
	                if (error.responseText) {
	                    // "insufficient funds for gas * price + value"
	                    if (error.responseText.indexOf("insufficient funds") > 0) {
	                        logger.throwError("insufficient funds", lib.Logger.errors.INSUFFICIENT_FUNDS, {});
	                    }
	                    // "nonce too low"
	                    if (error.responseText.indexOf("nonce too low") > 0) {
	                        logger.throwError("nonce has already been used", lib.Logger.errors.NONCE_EXPIRED, {});
	                    }
	                    // "replacement transaction underpriced"
	                    if (error.responseText.indexOf("replacement transaction underpriced") > 0) {
	                        logger.throwError("replacement fee too low", lib.Logger.errors.REPLACEMENT_UNDERPRICED, {});
	                    }
	                }
	                throw error;
	            });
	        }
	        return this.send(args[0], args[1]);
	    };
	    JsonRpcProvider.prototype._startEvent = function (event) {
	        if (event.tag === "pending") {
	            this._startPending();
	        }
	        _super.prototype._startEvent.call(this, event);
	    };
	    JsonRpcProvider.prototype._startPending = function () {
	        if (this._pendingFilter != null) {
	            return;
	        }
	        var self = this;
	        var pendingFilter = this.send("eth_newPendingTransactionFilter", []);
	        this._pendingFilter = pendingFilter;
	        pendingFilter.then(function (filterId) {
	            function poll() {
	                self.send("eth_getFilterChanges", [filterId]).then(function (hashes) {
	                    if (self._pendingFilter != pendingFilter) {
	                        return null;
	                    }
	                    var seq = Promise.resolve();
	                    hashes.forEach(function (hash) {
	                        // @TODO: This should be garbage collected at some point... How? When?
	                        self._emitted["t:" + hash.toLowerCase()] = "pending";
	                        seq = seq.then(function () {
	                            return self.getTransaction(hash).then(function (tx) {
	                                self.emit("pending", tx);
	                                return null;
	                            });
	                        });
	                    });
	                    return seq.then(function () {
	                        return timer(1000);
	                    });
	                }).then(function () {
	                    if (self._pendingFilter != pendingFilter) {
	                        self.send("eth_uninstallFilter", [filterId]);
	                        return;
	                    }
	                    setTimeout(function () { poll(); }, 0);
	                    return null;
	                }).catch(function (error) { });
	            }
	            poll();
	            return filterId;
	        }).catch(function (error) { });
	    };
	    JsonRpcProvider.prototype._stopEvent = function (event) {
	        if (event.tag === "pending" && this.listenerCount("pending") === 0) {
	            this._pendingFilter = null;
	        }
	        _super.prototype._stopEvent.call(this, event);
	    };
	    // Convert an ethers.js transaction into a JSON-RPC transaction
	    //  - gasLimit => gas
	    //  - All values hexlified
	    //  - All numeric values zero-striped
	    //  - All addresses are lowercased
	    // NOTE: This allows a TransactionRequest, but all values should be resolved
	    //       before this is called
	    // @TODO: This will likely be removed in future versions and prepareRequest
	    //        will be the preferred method for this.
	    JsonRpcProvider.hexlifyTransaction = function (transaction, allowExtra) {
	        // Check only allowed properties are given
	        var allowed = lib$3.shallowCopy(allowedTransactionKeys);
	        if (allowExtra) {
	            for (var key in allowExtra) {
	                if (allowExtra[key]) {
	                    allowed[key] = true;
	                }
	            }
	        }
	        lib$3.checkProperties(transaction, allowed);
	        var result = {};
	        // Some nodes (INFURA ropsten; INFURA mainnet is fine) do not like leading zeros.
	        ["gasLimit", "gasPrice", "nonce", "value"].forEach(function (key) {
	            if (transaction[key] == null) {
	                return;
	            }
	            var value = lib$1.hexValue(transaction[key]);
	            if (key === "gasLimit") {
	                key = "gas";
	            }
	            result[key] = value;
	        });
	        ["from", "to", "data"].forEach(function (key) {
	            if (transaction[key] == null) {
	                return;
	            }
	            result[key] = lib$1.hexlify(transaction[key]);
	        });
	        return result;
	    };
	    return JsonRpcProvider;
	}(baseProvider.BaseProvider));
	exports.JsonRpcProvider = JsonRpcProvider;

	});

	var jsonRpcProvider$1 = unwrapExports(jsonRpcProvider);
	var jsonRpcProvider_1 = jsonRpcProvider.JsonRpcSigner;
	var jsonRpcProvider_2 = jsonRpcProvider.JsonRpcProvider;

	var websocketProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ws_1 = __importDefault(browserWs);





	var logger = new lib.Logger(_version$I.version);
	/**
	 *  Notes:
	 *
	 *  This provider differs a bit from the polling providers. One main
	 *  difference is how it handles consistency. The polling providers
	 *  will stall responses to ensure a consistent state, while this
	 *  WebSocket provider assumes the connected backend will manage this.
	 *
	 *  For example, if a polling provider emits an event which indicats
	 *  the event occurred in blockhash XXX, a call to fetch that block by
	 *  its hash XXX, if not present will retry until it is present. This
	 *  can occur when querying a pool of nodes that are mildly out of sync
	 *  with each other.
	 */
	var NextId = 1;
	// For more info about the Real-time Event API see:
	//   https://geth.ethereum.org/docs/rpc/pubsub
	var WebSocketProvider = /** @class */ (function (_super) {
	    __extends(WebSocketProvider, _super);
	    function WebSocketProvider(url, network) {
	        var _this = this;
	        // This will be added in the future; please open an issue to expedite
	        if (network === "any") {
	            logger.throwError("WebSocketProvider does not support 'any' network yet", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "network:any"
	            });
	        }
	        _this = _super.call(this, url, network) || this;
	        _this._pollingInterval = -1;
	        lib$3.defineReadOnly(_this, "_websocket", new ws_1.default(_this.connection.url));
	        lib$3.defineReadOnly(_this, "_requests", {});
	        lib$3.defineReadOnly(_this, "_subs", {});
	        lib$3.defineReadOnly(_this, "_subIds", {});
	        // Stall sending requests until the socket is open...
	        _this._wsReady = false;
	        _this._websocket.onopen = function () {
	            _this._wsReady = true;
	            Object.keys(_this._requests).forEach(function (id) {
	                _this._websocket.send(_this._requests[id].payload);
	            });
	        };
	        _this._websocket.onmessage = function (messageEvent) {
	            var data = messageEvent.data;
	            var result = JSON.parse(data);
	            if (result.id != null) {
	                var id = String(result.id);
	                var request = _this._requests[id];
	                delete _this._requests[id];
	                if (result.result !== undefined) {
	                    request.callback(null, result.result);
	                }
	                else {
	                    if (result.error) {
	                        var error = new Error(result.error.message || "unknown error");
	                        lib$3.defineReadOnly(error, "code", result.error.code || null);
	                        lib$3.defineReadOnly(error, "response", data);
	                        request.callback(error, undefined);
	                    }
	                    else {
	                        request.callback(new Error("unknown error"), undefined);
	                    }
	                }
	            }
	            else if (result.method === "eth_subscription") {
	                // Subscription...
	                var sub = _this._subs[result.params.subscription];
	                if (sub) {
	                    //this.emit.apply(this,                  );
	                    sub.processFunc(result.params.result);
	                }
	            }
	            else {
	                console.warn("this should not happen");
	            }
	        };
	        // This Provider does not actually poll, but we want to trigger
	        // poll events for things that depend on them (like stalling for
	        // block and transaction lookups)
	        var fauxPoll = setInterval(function () {
	            _this.emit("poll");
	        }, 1000);
	        if (fauxPoll.unref) {
	            fauxPoll.unref();
	        }
	        return _this;
	    }
	    Object.defineProperty(WebSocketProvider.prototype, "pollingInterval", {
	        get: function () {
	            return 0;
	        },
	        set: function (value) {
	            logger.throwError("cannot set polling interval on WebSocketProvider", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "setPollingInterval"
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    WebSocketProvider.prototype.resetEventsBlock = function (blockNumber) {
	        logger.throwError("cannot reset events block on WebSocketProvider", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	            operation: "resetEventBlock"
	        });
	    };
	    WebSocketProvider.prototype.poll = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                return [2 /*return*/, null];
	            });
	        });
	    };
	    Object.defineProperty(WebSocketProvider.prototype, "polling", {
	        set: function (value) {
	            if (!value) {
	                return;
	            }
	            logger.throwError("cannot set polling on WebSocketProvider", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "setPolling"
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    WebSocketProvider.prototype.send = function (method, params) {
	        var _this = this;
	        var rid = NextId++;
	        return new Promise(function (resolve, reject) {
	            function callback(error, result) {
	                if (error) {
	                    return reject(error);
	                }
	                return resolve(result);
	            }
	            var payload = JSON.stringify({
	                method: method,
	                params: params,
	                id: rid,
	                jsonrpc: "2.0"
	            });
	            _this._requests[String(rid)] = { callback: callback, payload: payload };
	            if (_this._wsReady) {
	                _this._websocket.send(payload);
	            }
	        });
	    };
	    WebSocketProvider.defaultUrl = function () {
	        return "ws:/\/localhost:8546";
	    };
	    WebSocketProvider.prototype._subscribe = function (tag, param, processFunc) {
	        return __awaiter(this, void 0, void 0, function () {
	            var subIdPromise, subId;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        subIdPromise = this._subIds[tag];
	                        if (subIdPromise == null) {
	                            subIdPromise = Promise.all(param).then(function (param) {
	                                return _this.send("eth_subscribe", param);
	                            });
	                            this._subIds[tag] = subIdPromise;
	                        }
	                        return [4 /*yield*/, subIdPromise];
	                    case 1:
	                        subId = _a.sent();
	                        this._subs[subId] = { tag: tag, processFunc: processFunc };
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    WebSocketProvider.prototype._startEvent = function (event) {
	        var _this = this;
	        switch (event.type) {
	            case "block":
	                this._subscribe("block", ["newHeads"], function (result) {
	                    var blockNumber = lib$2.BigNumber.from(result.number).toNumber();
	                    _this._emitted.block = blockNumber;
	                    _this.emit("block", blockNumber);
	                });
	                break;
	            case "pending":
	                this._subscribe("pending", ["newPendingTransactions"], function (result) {
	                    _this.emit("pending", result);
	                });
	                break;
	            case "filter":
	                this._subscribe(event.tag, ["logs", this._getFilter(event.filter)], function (result) {
	                    if (result.removed == null) {
	                        result.removed = false;
	                    }
	                    _this.emit(event.filter, _this.formatter.filterLog(result));
	                });
	                break;
	            case "tx": {
	                var emitReceipt_1 = function (event) {
	                    var hash = event.hash;
	                    _this.getTransactionReceipt(hash).then(function (receipt) {
	                        if (!receipt) {
	                            return;
	                        }
	                        _this.emit(hash, receipt);
	                    });
	                };
	                // In case it is already mined
	                emitReceipt_1(event);
	                // To keep things simple, we start up a single newHeads subscription
	                // to keep an eye out for transactions we are watching for.
	                // Starting a subscription for an event (i.e. "tx") that is already
	                // running is (basically) a nop.
	                this._subscribe("tx", ["newHeads"], function (result) {
	                    _this._events.filter(function (e) { return (e.type === "tx"); }).forEach(emitReceipt_1);
	                });
	                break;
	            }
	            // Nothing is needed
	            case "debug":
	            case "poll":
	            case "willPoll":
	            case "didPoll":
	            case "error":
	                break;
	            default:
	                console.log("unhandled:", event);
	                break;
	        }
	    };
	    WebSocketProvider.prototype._stopEvent = function (event) {
	        var _this = this;
	        var tag = event.tag;
	        if (event.type === "tx") {
	            // There are remaining transaction event listeners
	            if (this._events.filter(function (e) { return (e.type === "tx"); }).length) {
	                return;
	            }
	            tag = "tx";
	        }
	        else if (this.listenerCount(event.event)) {
	            // There are remaining event listeners
	            return;
	        }
	        var subId = this._subIds[tag];
	        if (!subId) {
	            return;
	        }
	        delete this._subIds[tag];
	        subId.then(function (subId) {
	            if (!_this._subs[subId]) {
	                return;
	            }
	            delete _this._subs[subId];
	            _this.send("eth_unsubscribe", [subId]);
	        });
	    };
	    WebSocketProvider.prototype.destroy = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!(this._websocket.readyState === ws_1.default.CONNECTING)) return [3 /*break*/, 2];
	                        return [4 /*yield*/, new Promise(function (resolve) {
	                                _this._websocket.on("open", function () {
	                                    resolve(true);
	                                });
	                                _this._websocket.on("error", function () {
	                                    resolve(false);
	                                });
	                            })];
	                    case 1:
	                        _a.sent();
	                        _a.label = 2;
	                    case 2:
	                        // Hangup (navigating away from the page that opened the connection)
	                        this._websocket.close(1001);
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    return WebSocketProvider;
	}(jsonRpcProvider.JsonRpcProvider));
	exports.WebSocketProvider = WebSocketProvider;

	});

	var websocketProvider$1 = unwrapExports(websocketProvider);
	var websocketProvider_1 = websocketProvider.WebSocketProvider;

	var urlJsonRpcProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$I.version);

	// A StaticJsonRpcProvider is useful when you *know* for certain that
	// the backend will never change, as it never calls eth_chainId to
	// verify its backend. However, if the backend does change, the effects
	// are undefined and may include:
	// - inconsistent results
	// - locking up the UI
	// - block skew warnings
	// - wrong results
	// If the network is not explicit (i.e. auto-detection is expected), the
	// node MUST be running and available to respond to requests BEFORE this
	// is instantiated.
	var StaticJsonRpcProvider = /** @class */ (function (_super) {
	    __extends(StaticJsonRpcProvider, _super);
	    function StaticJsonRpcProvider() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    StaticJsonRpcProvider.prototype.detectNetwork = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var network;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        network = this.network;
	                        if (!(network == null)) return [3 /*break*/, 2];
	                        return [4 /*yield*/, _super.prototype.detectNetwork.call(this)];
	                    case 1:
	                        network = _a.sent();
	                        if (!network) {
	                            logger.throwError("no network detected", lib.Logger.errors.UNKNOWN_ERROR, {});
	                        }
	                        // If still not set, set it
	                        if (this._network == null) {
	                            // A static network does not support "any"
	                            lib$3.defineReadOnly(this, "_network", network);
	                            this.emit("network", network, null);
	                        }
	                        _a.label = 2;
	                    case 2: return [2 /*return*/, network];
	                }
	            });
	        });
	    };
	    return StaticJsonRpcProvider;
	}(jsonRpcProvider.JsonRpcProvider));
	exports.StaticJsonRpcProvider = StaticJsonRpcProvider;
	var UrlJsonRpcProvider = /** @class */ (function (_super) {
	    __extends(UrlJsonRpcProvider, _super);
	    function UrlJsonRpcProvider(network, apiKey) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkAbstract(_newTarget, UrlJsonRpcProvider);
	        // Normalize the Network and API Key
	        network = lib$3.getStatic((_newTarget), "getNetwork")(network);
	        apiKey = lib$3.getStatic((_newTarget), "getApiKey")(apiKey);
	        var connection = lib$3.getStatic((_newTarget), "getUrl")(network, apiKey);
	        _this = _super.call(this, connection, network) || this;
	        if (typeof (apiKey) === "string") {
	            lib$3.defineReadOnly(_this, "apiKey", apiKey);
	        }
	        else if (apiKey != null) {
	            Object.keys(apiKey).forEach(function (key) {
	                lib$3.defineReadOnly(_this, key, apiKey[key]);
	            });
	        }
	        return _this;
	    }
	    UrlJsonRpcProvider.prototype._startPending = function () {
	        logger.warn("WARNING: API provider does not support pending filters");
	    };
	    UrlJsonRpcProvider.prototype.getSigner = function (address) {
	        return logger.throwError("API provider does not support signing", lib.Logger.errors.UNSUPPORTED_OPERATION, { operation: "getSigner" });
	    };
	    UrlJsonRpcProvider.prototype.listAccounts = function () {
	        return Promise.resolve([]);
	    };
	    // Return a defaultApiKey if null, otherwise validate the API key
	    UrlJsonRpcProvider.getApiKey = function (apiKey) {
	        return apiKey;
	    };
	    // Returns the url or connection for the given network and API key. The
	    // API key will have been sanitized by the getApiKey first, so any validation
	    // or transformations can be done there.
	    UrlJsonRpcProvider.getUrl = function (network, apiKey) {
	        return logger.throwError("not implemented; sub-classes must override getUrl", lib.Logger.errors.NOT_IMPLEMENTED, {
	            operation: "getUrl"
	        });
	    };
	    return UrlJsonRpcProvider;
	}(StaticJsonRpcProvider));
	exports.UrlJsonRpcProvider = UrlJsonRpcProvider;

	});

	var urlJsonRpcProvider$1 = unwrapExports(urlJsonRpcProvider);
	var urlJsonRpcProvider_1 = urlJsonRpcProvider.StaticJsonRpcProvider;
	var urlJsonRpcProvider_2 = urlJsonRpcProvider.UrlJsonRpcProvider;

	var alchemyProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$I.version);

	// This key was provided to ethers.js by Alchemy to be used by the
	// default provider, but it is recommended that for your own
	// production environments, that you acquire your own API key at:
	//   https://dashboard.alchemyapi.io
	var defaultApiKey = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";
	var AlchemyProvider = /** @class */ (function (_super) {
	    __extends(AlchemyProvider, _super);
	    function AlchemyProvider() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    AlchemyProvider.getWebSocketProvider = function (network, apiKey) {
	        var provider = new AlchemyProvider(network, apiKey);
	        var url = provider.connection.url.replace(/^http/i, "ws")
	            .replace(".alchemyapi.", ".ws.alchemyapi.");
	        return new websocketProvider.WebSocketProvider(url, provider.network);
	    };
	    AlchemyProvider.getApiKey = function (apiKey) {
	        if (apiKey == null) {
	            return defaultApiKey;
	        }
	        if (apiKey && typeof (apiKey) !== "string") {
	            logger.throwArgumentError("invalid apiKey", "apiKey", apiKey);
	        }
	        return apiKey;
	    };
	    AlchemyProvider.getUrl = function (network, apiKey) {
	        var host = null;
	        switch (network.name) {
	            case "homestead":
	                host = "eth-mainnet.alchemyapi.io/v2/";
	                break;
	            case "ropsten":
	                host = "eth-ropsten.alchemyapi.io/v2/";
	                break;
	            case "rinkeby":
	                host = "eth-rinkeby.alchemyapi.io/v2/";
	                break;
	            case "goerli":
	                host = "eth-goerli.alchemyapi.io/v2/";
	                break;
	            case "kovan":
	                host = "eth-kovan.alchemyapi.io/v2/";
	                break;
	            default:
	                logger.throwArgumentError("unsupported network", "network", arguments[0]);
	        }
	        return ("https:/" + "/" + host + apiKey);
	    };
	    return AlchemyProvider;
	}(urlJsonRpcProvider.UrlJsonRpcProvider));
	exports.AlchemyProvider = AlchemyProvider;

	});

	var alchemyProvider$1 = unwrapExports(alchemyProvider);
	var alchemyProvider_1 = alchemyProvider.AlchemyProvider;

	var cloudflareProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$I.version);
	var CloudflareProvider = /** @class */ (function (_super) {
	    __extends(CloudflareProvider, _super);
	    function CloudflareProvider() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    CloudflareProvider.getApiKey = function (apiKey) {
	        if (apiKey != null) {
	            logger.throwArgumentError("apiKey not supported for cloudflare", "apiKey", apiKey);
	        }
	        return null;
	    };
	    CloudflareProvider.getUrl = function (network, apiKey) {
	        var host = null;
	        switch (network.name) {
	            case "homestead":
	                host = "https://cloudflare-eth.com/";
	                break;
	            default:
	                logger.throwArgumentError("unsupported network", "network", arguments[0]);
	        }
	        return host;
	    };
	    CloudflareProvider.prototype.perform = function (method, params) {
	        return __awaiter(this, void 0, void 0, function () {
	            var block;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!(method === "getBlockNumber")) return [3 /*break*/, 2];
	                        return [4 /*yield*/, _super.prototype.perform.call(this, "getBlock", { blockTag: "latest" })];
	                    case 1:
	                        block = _a.sent();
	                        return [2 /*return*/, block.number];
	                    case 2: return [2 /*return*/, _super.prototype.perform.call(this, method, params)];
	                }
	            });
	        });
	    };
	    return CloudflareProvider;
	}(urlJsonRpcProvider.UrlJsonRpcProvider));
	exports.CloudflareProvider = CloudflareProvider;

	});

	var cloudflareProvider$1 = unwrapExports(cloudflareProvider);
	var cloudflareProvider_1 = cloudflareProvider.CloudflareProvider;

	var etherscanProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });





	var logger = new lib.Logger(_version$I.version);

	// The transaction has already been sanitized by the calls in Provider
	function getTransactionString(transaction) {
	    var result = [];
	    for (var key in transaction) {
	        if (transaction[key] == null) {
	            continue;
	        }
	        var value = lib$1.hexlify(transaction[key]);
	        if ({ gasLimit: true, gasPrice: true, nonce: true, value: true }[key]) {
	            value = lib$1.hexValue(value);
	        }
	        result.push(key + "=" + value);
	    }
	    return result.join("&");
	}
	function getResult(result) {
	    // getLogs, getHistory have weird success responses
	    if (result.status == 0 && (result.message === "No records found" || result.message === "No transactions found")) {
	        return result.result;
	    }
	    if (result.status != 1 || result.message != "OK") {
	        // @TODO: not any
	        var error = new Error("invalid response");
	        error.result = JSON.stringify(result);
	        throw error;
	    }
	    return result.result;
	}
	function getJsonResult(result) {
	    if (result.jsonrpc != "2.0") {
	        // @TODO: not any
	        var error = new Error("invalid response");
	        error.result = JSON.stringify(result);
	        throw error;
	    }
	    if (result.error) {
	        // @TODO: not any
	        var error = new Error(result.error.message || "unknown error");
	        if (result.error.code) {
	            error.code = result.error.code;
	        }
	        if (result.error.data) {
	            error.data = result.error.data;
	        }
	        throw error;
	    }
	    return result.result;
	}
	// The blockTag was normalized as a string by the Provider pre-perform operations
	function checkLogTag(blockTag) {
	    if (blockTag === "pending") {
	        throw new Error("pending not supported");
	    }
	    if (blockTag === "latest") {
	        return blockTag;
	    }
	    return parseInt(blockTag.substring(2), 16);
	}
	var defaultApiKey = "9D13ZE7XSBTJ94N9BNJ2MA33VMAY2YPIRB";
	var EtherscanProvider = /** @class */ (function (_super) {
	    __extends(EtherscanProvider, _super);
	    function EtherscanProvider(network, apiKey) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, EtherscanProvider);
	        _this = _super.call(this, network) || this;
	        var name = "invalid";
	        if (_this.network) {
	            name = _this.network.name;
	        }
	        var baseUrl = null;
	        switch (name) {
	            case "homestead":
	                baseUrl = "https://api.etherscan.io";
	                break;
	            case "ropsten":
	                baseUrl = "https://api-ropsten.etherscan.io";
	                break;
	            case "rinkeby":
	                baseUrl = "https://api-rinkeby.etherscan.io";
	                break;
	            case "kovan":
	                baseUrl = "https://api-kovan.etherscan.io";
	                break;
	            case "goerli":
	                baseUrl = "https://api-goerli.etherscan.io";
	                break;
	            default:
	                throw new Error("unsupported network");
	        }
	        lib$3.defineReadOnly(_this, "baseUrl", baseUrl);
	        lib$3.defineReadOnly(_this, "apiKey", apiKey || defaultApiKey);
	        return _this;
	    }
	    EtherscanProvider.prototype.detectNetwork = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                return [2 /*return*/, this.network];
	            });
	        });
	    };
	    EtherscanProvider.prototype.perform = function (method, params) {
	        return __awaiter(this, void 0, void 0, function () {
	            var url, apiKey, get, _a, transaction, transaction, topic0, logs, txs, i, log, tx, _b;
	            var _this = this;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0:
	                        url = this.baseUrl;
	                        apiKey = "";
	                        if (this.apiKey) {
	                            apiKey += "&apikey=" + this.apiKey;
	                        }
	                        get = function (url, procFunc) { return __awaiter(_this, void 0, void 0, function () {
	                            var result;
	                            return __generator(this, function (_a) {
	                                switch (_a.label) {
	                                    case 0:
	                                        this.emit("debug", {
	                                            action: "request",
	                                            request: url,
	                                            provider: this
	                                        });
	                                        return [4 /*yield*/, lib$l.fetchJson(url, null, procFunc || getJsonResult)];
	                                    case 1:
	                                        result = _a.sent();
	                                        this.emit("debug", {
	                                            action: "response",
	                                            request: url,
	                                            response: lib$3.deepCopy(result),
	                                            provider: this
	                                        });
	                                        return [2 /*return*/, result];
	                                }
	                            });
	                        }); };
	                        _a = method;
	                        switch (_a) {
	                            case "getBlockNumber": return [3 /*break*/, 1];
	                            case "getGasPrice": return [3 /*break*/, 2];
	                            case "getBalance": return [3 /*break*/, 3];
	                            case "getTransactionCount": return [3 /*break*/, 4];
	                            case "getCode": return [3 /*break*/, 5];
	                            case "getStorageAt": return [3 /*break*/, 6];
	                            case "sendTransaction": return [3 /*break*/, 7];
	                            case "getBlock": return [3 /*break*/, 8];
	                            case "getTransaction": return [3 /*break*/, 9];
	                            case "getTransactionReceipt": return [3 /*break*/, 10];
	                            case "call": return [3 /*break*/, 11];
	                            case "estimateGas": return [3 /*break*/, 12];
	                            case "getLogs": return [3 /*break*/, 13];
	                            case "getEtherPrice": return [3 /*break*/, 20];
	                        }
	                        return [3 /*break*/, 22];
	                    case 1:
	                        url += "/api?module=proxy&action=eth_blockNumber" + apiKey;
	                        return [2 /*return*/, get(url)];
	                    case 2:
	                        url += "/api?module=proxy&action=eth_gasPrice" + apiKey;
	                        return [2 /*return*/, get(url)];
	                    case 3:
	                        // Returns base-10 result
	                        url += "/api?module=account&action=balance&address=" + params.address;
	                        url += "&tag=" + params.blockTag + apiKey;
	                        return [2 /*return*/, get(url, getResult)];
	                    case 4:
	                        url += "/api?module=proxy&action=eth_getTransactionCount&address=" + params.address;
	                        url += "&tag=" + params.blockTag + apiKey;
	                        return [2 /*return*/, get(url)];
	                    case 5:
	                        url += "/api?module=proxy&action=eth_getCode&address=" + params.address;
	                        url += "&tag=" + params.blockTag + apiKey;
	                        return [2 /*return*/, get(url, getJsonResult)];
	                    case 6:
	                        url += "/api?module=proxy&action=eth_getStorageAt&address=" + params.address;
	                        url += "&position=" + params.position;
	                        url += "&tag=" + params.blockTag + apiKey;
	                        return [2 /*return*/, get(url, getJsonResult)];
	                    case 7:
	                        url += "/api?module=proxy&action=eth_sendRawTransaction&hex=" + params.signedTransaction;
	                        url += apiKey;
	                        return [2 /*return*/, get(url).catch(function (error) {
	                                if (error.responseText) {
	                                    // "Insufficient funds. The account you tried to send transaction from does not have enough funds. Required 21464000000000 and got: 0"
	                                    if (error.responseText.toLowerCase().indexOf("insufficient funds") >= 0) {
	                                        logger.throwError("insufficient funds", lib.Logger.errors.INSUFFICIENT_FUNDS, {});
	                                    }
	                                    // "Transaction with the same hash was already imported."
	                                    if (error.responseText.indexOf("same hash was already imported") >= 0) {
	                                        logger.throwError("nonce has already been used", lib.Logger.errors.NONCE_EXPIRED, {});
	                                    }
	                                    // "Transaction gas price is too low. There is another transaction with same nonce in the queue. Try increasing the gas price or incrementing the nonce."
	                                    if (error.responseText.indexOf("another transaction with same nonce") >= 0) {
	                                        logger.throwError("replacement fee too low", lib.Logger.errors.REPLACEMENT_UNDERPRICED, {});
	                                    }
	                                }
	                                throw error;
	                            })];
	                    case 8:
	                        if (params.blockTag) {
	                            url += "/api?module=proxy&action=eth_getBlockByNumber&tag=" + params.blockTag;
	                            if (params.includeTransactions) {
	                                url += "&boolean=true";
	                            }
	                            else {
	                                url += "&boolean=false";
	                            }
	                            url += apiKey;
	                            return [2 /*return*/, get(url)];
	                        }
	                        throw new Error("getBlock by blockHash not implemented");
	                    case 9:
	                        url += "/api?module=proxy&action=eth_getTransactionByHash&txhash=" + params.transactionHash;
	                        url += apiKey;
	                        return [2 /*return*/, get(url)];
	                    case 10:
	                        url += "/api?module=proxy&action=eth_getTransactionReceipt&txhash=" + params.transactionHash;
	                        url += apiKey;
	                        return [2 /*return*/, get(url)];
	                    case 11:
	                        {
	                            transaction = getTransactionString(params.transaction);
	                            if (transaction) {
	                                transaction = "&" + transaction;
	                            }
	                            url += "/api?module=proxy&action=eth_call" + transaction;
	                            //url += "&tag=" + params.blockTag + apiKey;
	                            if (params.blockTag !== "latest") {
	                                throw new Error("EtherscanProvider does not support blockTag for call");
	                            }
	                            url += apiKey;
	                            return [2 /*return*/, get(url)];
	                        }
	                        _c.label = 12;
	                    case 12:
	                        {
	                            transaction = getTransactionString(params.transaction);
	                            if (transaction) {
	                                transaction = "&" + transaction;
	                            }
	                            url += "/api?module=proxy&action=eth_estimateGas&" + transaction;
	                            url += apiKey;
	                            return [2 /*return*/, get(url)];
	                        }
	                        _c.label = 13;
	                    case 13:
	                        url += "/api?module=logs&action=getLogs";
	                        if (params.filter.fromBlock) {
	                            url += "&fromBlock=" + checkLogTag(params.filter.fromBlock);
	                        }
	                        if (params.filter.toBlock) {
	                            url += "&toBlock=" + checkLogTag(params.filter.toBlock);
	                        }
	                        if (params.filter.address) {
	                            url += "&address=" + params.filter.address;
	                        }
	                        // @TODO: We can handle slightly more complicated logs using the logs API
	                        if (params.filter.topics && params.filter.topics.length > 0) {
	                            if (params.filter.topics.length > 1) {
	                                logger.throwError("unsupported topic count", lib.Logger.errors.UNSUPPORTED_OPERATION, { topics: params.filter.topics });
	                            }
	                            if (params.filter.topics.length === 1) {
	                                topic0 = params.filter.topics[0];
	                                if (typeof (topic0) !== "string" || topic0.length !== 66) {
	                                    logger.throwError("unsupported topic format", lib.Logger.errors.UNSUPPORTED_OPERATION, { topic0: topic0 });
	                                }
	                                url += "&topic0=" + topic0;
	                            }
	                        }
	                        url += apiKey;
	                        return [4 /*yield*/, get(url, getResult)];
	                    case 14:
	                        logs = _c.sent();
	                        txs = {};
	                        i = 0;
	                        _c.label = 15;
	                    case 15:
	                        if (!(i < logs.length)) return [3 /*break*/, 19];
	                        log = logs[i];
	                        if (log.blockHash != null) {
	                            return [3 /*break*/, 18];
	                        }
	                        if (!(txs[log.transactionHash] == null)) return [3 /*break*/, 17];
	                        return [4 /*yield*/, this.getTransaction(log.transactionHash)];
	                    case 16:
	                        tx = _c.sent();
	                        if (tx) {
	                            txs[log.transactionHash] = tx.blockHash;
	                        }
	                        _c.label = 17;
	                    case 17:
	                        log.blockHash = txs[log.transactionHash];
	                        _c.label = 18;
	                    case 18:
	                        i++;
	                        return [3 /*break*/, 15];
	                    case 19: return [2 /*return*/, logs];
	                    case 20:
	                        if (this.network.name !== "homestead") {
	                            return [2 /*return*/, 0.0];
	                        }
	                        url += "/api?module=stats&action=ethprice";
	                        url += apiKey;
	                        _b = parseFloat;
	                        return [4 /*yield*/, get(url, getResult)];
	                    case 21: return [2 /*return*/, _b.apply(void 0, [(_c.sent()).ethusd])];
	                    case 22: return [3 /*break*/, 23];
	                    case 23: return [2 /*return*/, _super.prototype.perform.call(this, method, params)];
	                }
	            });
	        });
	    };
	    // @TODO: Allow startBlock and endBlock to be Promises
	    EtherscanProvider.prototype.getHistory = function (addressOrName, startBlock, endBlock) {
	        var _this = this;
	        var url = this.baseUrl;
	        var apiKey = "";
	        if (this.apiKey) {
	            apiKey += "&apikey=" + this.apiKey;
	        }
	        if (startBlock == null) {
	            startBlock = 0;
	        }
	        if (endBlock == null) {
	            endBlock = 99999999;
	        }
	        return this.resolveName(addressOrName).then(function (address) {
	            url += "/api?module=account&action=txlist&address=" + address;
	            url += "&startblock=" + startBlock;
	            url += "&endblock=" + endBlock;
	            url += "&sort=asc" + apiKey;
	            _this.emit("debug", {
	                action: "request",
	                request: url,
	                provider: _this
	            });
	            return lib$l.fetchJson(url, null, getResult).then(function (result) {
	                _this.emit("debug", {
	                    action: "response",
	                    request: url,
	                    response: lib$3.deepCopy(result),
	                    provider: _this
	                });
	                var output = [];
	                result.forEach(function (tx) {
	                    ["contractAddress", "to"].forEach(function (key) {
	                        if (tx[key] == "") {
	                            delete tx[key];
	                        }
	                    });
	                    if (tx.creates == null && tx.contractAddress != null) {
	                        tx.creates = tx.contractAddress;
	                    }
	                    var item = _this.formatter.transactionResponse(tx);
	                    if (tx.timeStamp) {
	                        item.timestamp = parseInt(tx.timeStamp);
	                    }
	                    output.push(item);
	                });
	                return output;
	            });
	        });
	    };
	    return EtherscanProvider;
	}(baseProvider.BaseProvider));
	exports.EtherscanProvider = EtherscanProvider;

	});

	var etherscanProvider$1 = unwrapExports(etherscanProvider);
	var etherscanProvider_1 = etherscanProvider.EtherscanProvider;

	var fallbackProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });









	var logger = new lib.Logger(_version$I.version);
	function now() { return (new Date()).getTime(); }
	// Returns to network as long as all agree, or null if any is null.
	// Throws an error if any two networks do not match.
	function checkNetworks(networks) {
	    var result = null;
	    for (var i = 0; i < networks.length; i++) {
	        var network = networks[i];
	        // Null! We do not know our network; bail.
	        if (network == null) {
	            return null;
	        }
	        if (result) {
	            // Make sure the network matches the previous networks
	            if (!(result.name === network.name && result.chainId === network.chainId &&
	                ((result.ensAddress === network.ensAddress) || (result.ensAddress == null && network.ensAddress == null)))) {
	                logger.throwArgumentError("provider mismatch", "networks", networks);
	            }
	        }
	        else {
	            result = network;
	        }
	    }
	    return result;
	}
	function median(values, maxDelta) {
	    values = values.slice().sort();
	    var middle = Math.floor(values.length / 2);
	    // Odd length; take the middle
	    if (values.length % 2) {
	        return values[middle];
	    }
	    // Even length; take the average of the two middle
	    var a = values[middle - 1], b = values[middle];
	    if (maxDelta != null && Math.abs(a - b) > maxDelta) {
	        return null;
	    }
	    return (a + b) / 2;
	}
	function serialize(value) {
	    if (value === null) {
	        return "null";
	    }
	    else if (typeof (value) === "number" || typeof (value) === "boolean") {
	        return JSON.stringify(value);
	    }
	    else if (typeof (value) === "string") {
	        return value;
	    }
	    else if (lib$2.BigNumber.isBigNumber(value)) {
	        return value.toString();
	    }
	    else if (Array.isArray(value)) {
	        return JSON.stringify(value.map(function (i) { return serialize(i); }));
	    }
	    else if (typeof (value) === "object") {
	        var keys = Object.keys(value);
	        keys.sort();
	        return "{" + keys.map(function (key) {
	            var v = value[key];
	            if (typeof (v) === "function") {
	                v = "[function]";
	            }
	            else {
	                v = serialize(v);
	            }
	            return JSON.stringify(key) + ":" + v;
	        }).join(",") + "}";
	    }
	    throw new Error("unknown value type: " + typeof (value));
	}
	// Next request ID to use for emitting debug info
	var nextRid = 1;
	;
	function stall(duration) {
	    var cancel = null;
	    var timer = null;
	    var promise = (new Promise(function (resolve) {
	        cancel = function () {
	            if (timer) {
	                clearTimeout(timer);
	                timer = null;
	            }
	            resolve();
	        };
	        timer = setTimeout(cancel, duration);
	    }));
	    var wait = function (func) {
	        promise = promise.then(func);
	        return promise;
	    };
	    function getPromise() {
	        return promise;
	    }
	    return { cancel: cancel, getPromise: getPromise, wait: wait };
	}
	;
	function exposeDebugConfig(config, now) {
	    var result = {
	        provider: config.provider,
	        weight: config.weight
	    };
	    if (config.start) {
	        result.start = config.start;
	    }
	    if (now) {
	        result.duration = (now - config.start);
	    }
	    if (config.done) {
	        if (config.error) {
	            result.error = config.error;
	        }
	        else {
	            result.result = config.result || null;
	        }
	    }
	    return result;
	}
	function normalizedTally(normalize, quorum) {
	    return function (configs) {
	        // Count the votes for each result
	        var tally = {};
	        configs.forEach(function (c) {
	            var value = normalize(c.result);
	            if (!tally[value]) {
	                tally[value] = { count: 0, result: c.result };
	            }
	            tally[value].count++;
	        });
	        // Check for a quorum on any given result
	        var keys = Object.keys(tally);
	        for (var i = 0; i < keys.length; i++) {
	            var check = tally[keys[i]];
	            if (check.count >= quorum) {
	                return check.result;
	            }
	        }
	        // No quroum
	        return undefined;
	    };
	}
	function getProcessFunc(provider, method, params) {
	    var normalize = serialize;
	    switch (method) {
	        case "getBlockNumber":
	            // Return the median value, unless there is (median + 1) is also
	            // present, in which case that is probably true and the median
	            // is going to be stale soon. In the event of a malicious node,
	            // the lie will be true soon enough.
	            return function (configs) {
	                var values = configs.map(function (c) { return c.result; });
	                // Get the median block number
	                var blockNumber = median(configs.map(function (c) { return c.result; }), 2);
	                if (blockNumber == null) {
	                    return undefined;
	                }
	                blockNumber = Math.ceil(blockNumber);
	                // If the next block height is present, its prolly safe to use
	                if (values.indexOf(blockNumber + 1) >= 0) {
	                    blockNumber++;
	                }
	                // Don't ever roll back the blockNumber
	                if (blockNumber >= provider._highestBlockNumber) {
	                    provider._highestBlockNumber = blockNumber;
	                }
	                return provider._highestBlockNumber;
	            };
	        case "getGasPrice":
	            // Return the middle (round index up) value, similar to median
	            // but do not average even entries and choose the higher.
	            // Malicious actors must compromise 50% of the nodes to lie.
	            return function (configs) {
	                var values = configs.map(function (c) { return c.result; });
	                values.sort();
	                return values[Math.floor(values.length / 2)];
	            };
	        case "getEtherPrice":
	            // Returns the median price. Malicious actors must compromise at
	            // least 50% of the nodes to lie (in a meaningful way).
	            return function (configs) {
	                return median(configs.map(function (c) { return c.result; }));
	            };
	        // No additional normalizing required; serialize is enough
	        case "getBalance":
	        case "getTransactionCount":
	        case "getCode":
	        case "getStorageAt":
	        case "call":
	        case "estimateGas":
	        case "getLogs":
	            break;
	        // We drop the confirmations from transactions as it is approximate
	        case "getTransaction":
	        case "getTransactionReceipt":
	            normalize = function (tx) {
	                if (tx == null) {
	                    return null;
	                }
	                tx = lib$3.shallowCopy(tx);
	                tx.confirmations = -1;
	                return serialize(tx);
	            };
	            break;
	        // We drop the confirmations from transactions as it is approximate
	        case "getBlock":
	            // We drop the confirmations from transactions as it is approximate
	            if (params.includeTransactions) {
	                normalize = function (block) {
	                    if (block == null) {
	                        return null;
	                    }
	                    block = lib$3.shallowCopy(block);
	                    block.transactions = block.transactions.map(function (tx) {
	                        tx = lib$3.shallowCopy(tx);
	                        tx.confirmations = -1;
	                        return tx;
	                    });
	                    return serialize(block);
	                };
	            }
	            else {
	                normalize = function (block) {
	                    if (block == null) {
	                        return null;
	                    }
	                    return serialize(block);
	                };
	            }
	            break;
	        default:
	            throw new Error("unknown method: " + method);
	    }
	    // Return the result if and only if the expected quorum is
	    // satisfied and agreed upon for the final result.
	    return normalizedTally(normalize, provider.quorum);
	}
	// If we are doing a blockTag query, we need to make sure the backend is
	// caught up to the FallbackProvider, before sending a request to it.
	function waitForSync(config, blockNumber) {
	    return __awaiter(this, void 0, void 0, function () {
	        var provider;
	        return __generator(this, function (_a) {
	            provider = (config.provider);
	            if ((provider.blockNumber != null && provider.blockNumber >= blockNumber) || blockNumber === -1) {
	                return [2 /*return*/, provider];
	            }
	            return [2 /*return*/, lib$l.poll(function () {
	                    return new Promise(function (resolve, reject) {
	                        setTimeout(function () {
	                            // We are synced
	                            if (provider.blockNumber >= blockNumber) {
	                                return resolve(provider);
	                            }
	                            // We're done; just quit
	                            if (config.cancelled) {
	                                return resolve(null);
	                            }
	                            // Try again, next block
	                            return resolve(undefined);
	                        }, 0);
	                    });
	                }, { oncePoll: provider })];
	        });
	    });
	}
	function getRunner(config, currentBlockNumber, method, params) {
	    return __awaiter(this, void 0, void 0, function () {
	        var provider, _a, filter;
	        return __generator(this, function (_b) {
	            switch (_b.label) {
	                case 0:
	                    provider = config.provider;
	                    _a = method;
	                    switch (_a) {
	                        case "getBlockNumber": return [3 /*break*/, 1];
	                        case "getGasPrice": return [3 /*break*/, 1];
	                        case "getEtherPrice": return [3 /*break*/, 2];
	                        case "getBalance": return [3 /*break*/, 3];
	                        case "getTransactionCount": return [3 /*break*/, 3];
	                        case "getCode": return [3 /*break*/, 3];
	                        case "getStorageAt": return [3 /*break*/, 6];
	                        case "getBlock": return [3 /*break*/, 9];
	                        case "call": return [3 /*break*/, 12];
	                        case "estimateGas": return [3 /*break*/, 12];
	                        case "getTransaction": return [3 /*break*/, 15];
	                        case "getTransactionReceipt": return [3 /*break*/, 15];
	                        case "getLogs": return [3 /*break*/, 16];
	                    }
	                    return [3 /*break*/, 19];
	                case 1: return [2 /*return*/, provider[method]()];
	                case 2:
	                    if (provider.getEtherPrice) {
	                        return [2 /*return*/, provider.getEtherPrice()];
	                    }
	                    return [3 /*break*/, 19];
	                case 3:
	                    if (!(params.blockTag && lib$1.isHexString(params.blockTag))) return [3 /*break*/, 5];
	                    return [4 /*yield*/, waitForSync(config, currentBlockNumber)];
	                case 4:
	                    provider = _b.sent();
	                    _b.label = 5;
	                case 5: return [2 /*return*/, provider[method](params.address, params.blockTag || "latest")];
	                case 6:
	                    if (!(params.blockTag && lib$1.isHexString(params.blockTag))) return [3 /*break*/, 8];
	                    return [4 /*yield*/, waitForSync(config, currentBlockNumber)];
	                case 7:
	                    provider = _b.sent();
	                    _b.label = 8;
	                case 8: return [2 /*return*/, provider.getStorageAt(params.address, params.position, params.blockTag || "latest")];
	                case 9:
	                    if (!(params.blockTag && lib$1.isHexString(params.blockTag))) return [3 /*break*/, 11];
	                    return [4 /*yield*/, waitForSync(config, currentBlockNumber)];
	                case 10:
	                    provider = _b.sent();
	                    _b.label = 11;
	                case 11: return [2 /*return*/, provider[(params.includeTransactions ? "getBlockWithTransactions" : "getBlock")](params.blockTag || params.blockHash)];
	                case 12:
	                    if (!(params.blockTag && lib$1.isHexString(params.blockTag))) return [3 /*break*/, 14];
	                    return [4 /*yield*/, waitForSync(config, currentBlockNumber)];
	                case 13:
	                    provider = _b.sent();
	                    _b.label = 14;
	                case 14: return [2 /*return*/, provider[method](params.transaction)];
	                case 15: return [2 /*return*/, provider[method](params.transactionHash)];
	                case 16:
	                    filter = params.filter;
	                    if (!((filter.fromBlock && lib$1.isHexString(filter.fromBlock)) || (filter.toBlock && lib$1.isHexString(filter.toBlock)))) return [3 /*break*/, 18];
	                    return [4 /*yield*/, waitForSync(config, currentBlockNumber)];
	                case 17:
	                    provider = _b.sent();
	                    _b.label = 18;
	                case 18: return [2 /*return*/, provider.getLogs(filter)];
	                case 19: return [2 /*return*/, logger.throwError("unknown method error", lib.Logger.errors.UNKNOWN_ERROR, {
	                        method: method,
	                        params: params
	                    })];
	            }
	        });
	    });
	}
	var FallbackProvider = /** @class */ (function (_super) {
	    __extends(FallbackProvider, _super);
	    function FallbackProvider(providers, quorum) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, FallbackProvider);
	        if (providers.length === 0) {
	            logger.throwArgumentError("missing providers", "providers", providers);
	        }
	        var providerConfigs = providers.map(function (configOrProvider, index) {
	            if (lib$b.Provider.isProvider(configOrProvider)) {
	                return Object.freeze({ provider: configOrProvider, weight: 1, stallTimeout: 750, priority: 1 });
	            }
	            var config = lib$3.shallowCopy(configOrProvider);
	            if (config.priority == null) {
	                config.priority = 1;
	            }
	            if (config.stallTimeout == null) {
	                config.stallTimeout = 750;
	            }
	            if (config.weight == null) {
	                config.weight = 1;
	            }
	            var weight = config.weight;
	            if (weight % 1 || weight > 512 || weight < 1) {
	                logger.throwArgumentError("invalid weight; must be integer in [1, 512]", "providers[" + index + "].weight", weight);
	            }
	            return Object.freeze(config);
	        });
	        var total = providerConfigs.reduce(function (accum, c) { return (accum + c.weight); }, 0);
	        if (quorum == null) {
	            quorum = total / 2;
	        }
	        else if (quorum > total) {
	            logger.throwArgumentError("quorum will always fail; larger than total weight", "quorum", quorum);
	        }
	        // Are all providers' networks are known
	        var networkOrReady = checkNetworks(providerConfigs.map(function (c) { return (c.provider).network; }));
	        // Not all networks are known; we must stall
	        if (networkOrReady == null) {
	            networkOrReady = new Promise(function (resolve, reject) {
	                setTimeout(function () {
	                    _this.detectNetwork().then(resolve, reject);
	                }, 0);
	            });
	        }
	        _this = _super.call(this, networkOrReady) || this;
	        // Preserve a copy, so we do not get mutated
	        lib$3.defineReadOnly(_this, "providerConfigs", Object.freeze(providerConfigs));
	        lib$3.defineReadOnly(_this, "quorum", quorum);
	        _this._highestBlockNumber = -1;
	        return _this;
	    }
	    FallbackProvider.prototype.detectNetwork = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var networks;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, Promise.all(this.providerConfigs.map(function (c) { return c.provider.getNetwork(); }))];
	                    case 1:
	                        networks = _a.sent();
	                        return [2 /*return*/, checkNetworks(networks)];
	                }
	            });
	        });
	    };
	    FallbackProvider.prototype.perform = function (method, params) {
	        return __awaiter(this, void 0, void 0, function () {
	            var results, i_1, result, processFunc, configs, currentBlockNumber, i, first, _loop_1, this_1, state_1;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!(method === "sendTransaction")) return [3 /*break*/, 2];
	                        return [4 /*yield*/, Promise.all(this.providerConfigs.map(function (c) {
	                                return c.provider.sendTransaction(params.signedTransaction).then(function (result) {
	                                    return result.hash;
	                                }, function (error) {
	                                    return error;
	                                });
	                            }))];
	                    case 1:
	                        results = _a.sent();
	                        // Any success is good enough (other errors are likely "already seen" errors
	                        for (i_1 = 0; i_1 < results.length; i_1++) {
	                            result = results[i_1];
	                            if (typeof (result) === "string") {
	                                return [2 /*return*/, result];
	                            }
	                        }
	                        // They were all an error; pick the first error
	                        throw results[0];
	                    case 2:
	                        if (!(this._highestBlockNumber === -1 && method !== "getBlockNumber")) return [3 /*break*/, 4];
	                        return [4 /*yield*/, this.getBlockNumber()];
	                    case 3:
	                        _a.sent();
	                        _a.label = 4;
	                    case 4:
	                        processFunc = getProcessFunc(this, method, params);
	                        configs = browser$6.shuffled(this.providerConfigs.map(lib$3.shallowCopy));
	                        configs.sort(function (a, b) { return (a.priority - b.priority); });
	                        currentBlockNumber = this._highestBlockNumber;
	                        i = 0;
	                        first = true;
	                        _loop_1 = function () {
	                            var t0, inflightWeight, _loop_2, waiting, results, result;
	                            return __generator(this, function (_a) {
	                                switch (_a.label) {
	                                    case 0:
	                                        t0 = now();
	                                        inflightWeight = configs.filter(function (c) { return (c.runner && ((t0 - c.start) < c.stallTimeout)); })
	                                            .reduce(function (accum, c) { return (accum + c.weight); }, 0);
	                                        _loop_2 = function () {
	                                            var config = configs[i++];
	                                            var rid = nextRid++;
	                                            config.start = now();
	                                            config.staller = stall(config.stallTimeout);
	                                            config.staller.wait(function () { config.staller = null; });
	                                            config.runner = getRunner(config, currentBlockNumber, method, params).then(function (result) {
	                                                config.done = true;
	                                                config.result = result;
	                                                if (_this.listenerCount("debug")) {
	                                                    _this.emit("debug", {
	                                                        action: "request",
	                                                        rid: rid,
	                                                        backend: exposeDebugConfig(config, now()),
	                                                        request: { method: method, params: lib$3.deepCopy(params) },
	                                                        provider: _this
	                                                    });
	                                                }
	                                            }, function (error) {
	                                                config.done = true;
	                                                config.error = error;
	                                                if (_this.listenerCount("debug")) {
	                                                    _this.emit("debug", {
	                                                        action: "request",
	                                                        rid: rid,
	                                                        backend: exposeDebugConfig(config, now()),
	                                                        request: { method: method, params: lib$3.deepCopy(params) },
	                                                        provider: _this
	                                                    });
	                                                }
	                                            });
	                                            if (this_1.listenerCount("debug")) {
	                                                this_1.emit("debug", {
	                                                    action: "request",
	                                                    rid: rid,
	                                                    backend: exposeDebugConfig(config, null),
	                                                    request: { method: method, params: lib$3.deepCopy(params) },
	                                                    provider: this_1
	                                                });
	                                            }
	                                            inflightWeight += config.weight;
	                                        };
	                                        // Start running enough to meet quorum
	                                        while (inflightWeight < this_1.quorum && i < configs.length) {
	                                            _loop_2();
	                                        }
	                                        waiting = [];
	                                        configs.forEach(function (c) {
	                                            if (c.done || !c.runner) {
	                                                return;
	                                            }
	                                            waiting.push(c.runner);
	                                            if (c.staller) {
	                                                waiting.push(c.staller.getPromise());
	                                            }
	                                        });
	                                        if (!waiting.length) return [3 /*break*/, 2];
	                                        return [4 /*yield*/, Promise.race(waiting)];
	                                    case 1:
	                                        _a.sent();
	                                        _a.label = 2;
	                                    case 2:
	                                        results = configs.filter(function (c) { return (c.done && c.error == null); });
	                                        if (!(results.length >= this_1.quorum)) return [3 /*break*/, 5];
	                                        result = processFunc(results);
	                                        if (result !== undefined) {
	                                            // Shut down any stallers
	                                            configs.forEach(function (c) {
	                                                if (c.staller) {
	                                                    c.staller.cancel();
	                                                }
	                                                c.cancelled = true;
	                                            });
	                                            return [2 /*return*/, { value: result }];
	                                        }
	                                        if (!!first) return [3 /*break*/, 4];
	                                        return [4 /*yield*/, stall(100).getPromise()];
	                                    case 3:
	                                        _a.sent();
	                                        _a.label = 4;
	                                    case 4:
	                                        first = false;
	                                        _a.label = 5;
	                                    case 5:
	                                        // All configs have run to completion; we will never get more data
	                                        if (configs.filter(function (c) { return !c.done; }).length === 0) {
	                                            return [2 /*return*/, "break"];
	                                        }
	                                        return [2 /*return*/];
	                                }
	                            });
	                        };
	                        this_1 = this;
	                        _a.label = 5;
	                    case 5:
	                        if (!true) return [3 /*break*/, 7];
	                        return [5 /*yield**/, _loop_1()];
	                    case 6:
	                        state_1 = _a.sent();
	                        if (typeof state_1 === "object")
	                            return [2 /*return*/, state_1.value];
	                        if (state_1 === "break")
	                            return [3 /*break*/, 7];
	                        return [3 /*break*/, 5];
	                    case 7:
	                        // Shut down any stallers; shouldn't be any
	                        configs.forEach(function (c) {
	                            if (c.staller) {
	                                c.staller.cancel();
	                            }
	                            c.cancelled = true;
	                        });
	                        return [2 /*return*/, logger.throwError("failed to meet quorum", lib.Logger.errors.SERVER_ERROR, {
	                                method: method,
	                                params: params,
	                                //results: configs.map((c) => c.result),
	                                //errors: configs.map((c) => c.error),
	                                results: configs.map(function (c) { return exposeDebugConfig(c); }),
	                                provider: this
	                            })];
	                }
	            });
	        });
	    };
	    return FallbackProvider;
	}(baseProvider.BaseProvider));
	exports.FallbackProvider = FallbackProvider;

	});

	var fallbackProvider$1 = unwrapExports(fallbackProvider);
	var fallbackProvider_1 = fallbackProvider.FallbackProvider;

	"use strict";
	var IpcProvider = null;


	var browserIpcProvider = {
		IpcProvider: IpcProvider
	};

	var infuraProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$I.version);

	var defaultProjectId = "84842078b09946638c03157f83405213";
	var InfuraProvider = /** @class */ (function (_super) {
	    __extends(InfuraProvider, _super);
	    function InfuraProvider() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    InfuraProvider.getWebSocketProvider = function (network, apiKey) {
	        var provider = new InfuraProvider(network, apiKey);
	        var connection = provider.connection;
	        if (connection.password) {
	            logger.throwError("INFURA WebSocket project secrets unsupported", lib.Logger.errors.UNSUPPORTED_OPERATION, {
	                operation: "InfuraProvider.getWebSocketProvider()"
	            });
	        }
	        var url = connection.url.replace(/^http/i, "ws").replace("/v3/", "/ws/v3/");
	        return new websocketProvider.WebSocketProvider(url, network);
	    };
	    InfuraProvider.getApiKey = function (apiKey) {
	        var apiKeyObj = {
	            apiKey: defaultProjectId,
	            projectId: defaultProjectId,
	            projectSecret: null
	        };
	        if (apiKey == null) {
	            return apiKeyObj;
	        }
	        if (typeof (apiKey) === "string") {
	            apiKeyObj.projectId = apiKey;
	        }
	        else if (apiKey.projectSecret != null) {
	            logger.assertArgument((typeof (apiKey.projectId) === "string"), "projectSecret requires a projectId", "projectId", apiKey.projectId);
	            logger.assertArgument((typeof (apiKey.projectSecret) === "string"), "invalid projectSecret", "projectSecret", "[REDACTED]");
	            apiKeyObj.projectId = apiKey.projectId;
	            apiKeyObj.projectSecret = apiKey.projectSecret;
	        }
	        else if (apiKey.projectId) {
	            apiKeyObj.projectId = apiKey.projectId;
	        }
	        apiKeyObj.apiKey = apiKeyObj.projectId;
	        return apiKeyObj;
	    };
	    InfuraProvider.getUrl = function (network, apiKey) {
	        var host = null;
	        switch (network ? network.name : "unknown") {
	            case "homestead":
	                host = "mainnet.infura.io";
	                break;
	            case "ropsten":
	                host = "ropsten.infura.io";
	                break;
	            case "rinkeby":
	                host = "rinkeby.infura.io";
	                break;
	            case "kovan":
	                host = "kovan.infura.io";
	                break;
	            case "goerli":
	                host = "goerli.infura.io";
	                break;
	            default:
	                logger.throwError("unsupported network", lib.Logger.errors.INVALID_ARGUMENT, {
	                    argument: "network",
	                    value: network
	                });
	        }
	        var connection = {
	            url: ("https:/" + "/" + host + "/v3/" + apiKey.projectId)
	        };
	        if (apiKey.projectSecret != null) {
	            connection.user = "";
	            connection.password = apiKey.projectSecret;
	        }
	        return connection;
	    };
	    return InfuraProvider;
	}(urlJsonRpcProvider.UrlJsonRpcProvider));
	exports.InfuraProvider = InfuraProvider;

	});

	var infuraProvider$1 = unwrapExports(infuraProvider);
	var infuraProvider_1 = infuraProvider.InfuraProvider;

	var nodesmithProvider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$I.version);
	// Special API key provided by Nodesmith for ethers.js
	var defaultApiKey = "ETHERS_JS_SHARED";
	var NodesmithProvider = /** @class */ (function (_super) {
	    __extends(NodesmithProvider, _super);
	    function NodesmithProvider() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    NodesmithProvider.getApiKey = function (apiKey) {
	        if (apiKey && typeof (apiKey) !== "string") {
	            logger.throwArgumentError("invalid apiKey", "apiKey", apiKey);
	        }
	        return apiKey || defaultApiKey;
	    };
	    NodesmithProvider.getUrl = function (network, apiKey) {
	        logger.warn("NodeSmith will be discontinued on 2019-12-20; please migrate to another platform.");
	        var host = null;
	        switch (network.name) {
	            case "homestead":
	                host = "https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc";
	                break;
	            case "ropsten":
	                host = "https://ethereum.api.nodesmith.io/v1/ropsten/jsonrpc";
	                break;
	            case "rinkeby":
	                host = "https://ethereum.api.nodesmith.io/v1/rinkeby/jsonrpc";
	                break;
	            case "goerli":
	                host = "https://ethereum.api.nodesmith.io/v1/goerli/jsonrpc";
	                break;
	            case "kovan":
	                host = "https://ethereum.api.nodesmith.io/v1/kovan/jsonrpc";
	                break;
	            default:
	                logger.throwArgumentError("unsupported network", "network", arguments[0]);
	        }
	        return (host + "?apiKey=" + apiKey);
	    };
	    return NodesmithProvider;
	}(urlJsonRpcProvider.UrlJsonRpcProvider));
	exports.NodesmithProvider = NodesmithProvider;

	});

	var nodesmithProvider$1 = unwrapExports(nodesmithProvider);
	var nodesmithProvider_1 = nodesmithProvider.NodesmithProvider;

	var web3Provider = createCommonjsModule(function (module, exports) {
	"use strict";
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$I.version);

	var _nextId = 1;
	function buildWeb3LegacyFetcher(provider, sendFunc) {
	    return function (method, params) {
	        // Metamask complains about eth_sign (and on some versions hangs)
	        if (method == "eth_sign" && provider.isMetaMask) {
	            // https://github.com/ethereum/go-ethereum/wiki/Management-APIs#personal_sign
	            method = "personal_sign";
	            params = [params[1], params[0]];
	        }
	        var request = {
	            method: method,
	            params: params,
	            id: (_nextId++),
	            jsonrpc: "2.0"
	        };
	        return new Promise(function (resolve, reject) {
	            sendFunc(request, function (error, result) {
	                if (error) {
	                    return reject(error);
	                }
	                if (result.error) {
	                    var error_1 = new Error(result.error.message);
	                    error_1.code = result.error.code;
	                    error_1.data = result.error.data;
	                    return reject(error_1);
	                }
	                resolve(result.result);
	            });
	        });
	    };
	}
	function buildEip1193Fetcher(provider) {
	    return function (method, params) {
	        if (params == null) {
	            params = [];
	        }
	        // Metamask complains about eth_sign (and on some versions hangs)
	        if (method == "eth_sign" && provider.isMetaMask) {
	            // https://github.com/ethereum/go-ethereum/wiki/Management-APIs#personal_sign
	            method = "personal_sign";
	            params = [params[1], params[0]];
	        }
	        return provider.request({ method: method, params: params });
	    };
	}
	var Web3Provider = /** @class */ (function (_super) {
	    __extends(Web3Provider, _super);
	    function Web3Provider(provider, network) {
	        var _newTarget = this.constructor;
	        var _this = this;
	        logger.checkNew(_newTarget, Web3Provider);
	        if (provider == null) {
	            logger.throwArgumentError("missing provider", "provider", provider);
	        }
	        var path = null;
	        var jsonRpcFetchFunc = null;
	        var subprovider = null;
	        if (typeof (provider) === "function") {
	            path = "unknown:";
	            jsonRpcFetchFunc = provider;
	        }
	        else {
	            path = provider.host || provider.path || "";
	            if (!path && provider.isMetaMask) {
	                path = "metamask";
	            }
	            subprovider = provider;
	            if (provider.request) {
	                if (path === "") {
	                    path = "eip-1193:";
	                }
	                jsonRpcFetchFunc = buildEip1193Fetcher(provider);
	            }
	            else if (provider.sendAsync) {
	                jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.sendAsync.bind(provider));
	            }
	            else if (provider.send) {
	                jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.send.bind(provider));
	            }
	            else {
	                logger.throwArgumentError("unsupported provider", "provider", provider);
	            }
	            if (!path) {
	                path = "unknown:";
	            }
	        }
	        _this = _super.call(this, path, network) || this;
	        lib$3.defineReadOnly(_this, "jsonRpcFetchFunc", jsonRpcFetchFunc);
	        lib$3.defineReadOnly(_this, "provider", subprovider);
	        return _this;
	    }
	    Web3Provider.prototype.send = function (method, params) {
	        return this.jsonRpcFetchFunc(method, params);
	    };
	    return Web3Provider;
	}(jsonRpcProvider.JsonRpcProvider));
	exports.Web3Provider = Web3Provider;

	});

	var web3Provider$1 = unwrapExports(web3Provider);
	var web3Provider_1 = web3Provider.Web3Provider;

	var lib$m = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.Provider = lib$b.Provider;

	exports.getNetwork = lib$k.getNetwork;

	exports.BaseProvider = baseProvider.BaseProvider;

	exports.AlchemyProvider = alchemyProvider.AlchemyProvider;

	exports.CloudflareProvider = cloudflareProvider.CloudflareProvider;

	exports.EtherscanProvider = etherscanProvider.EtherscanProvider;

	exports.FallbackProvider = fallbackProvider.FallbackProvider;

	exports.IpcProvider = browserIpcProvider.IpcProvider;

	exports.InfuraProvider = infuraProvider.InfuraProvider;

	exports.JsonRpcProvider = jsonRpcProvider.JsonRpcProvider;
	exports.JsonRpcSigner = jsonRpcProvider.JsonRpcSigner;

	exports.NodesmithProvider = nodesmithProvider.NodesmithProvider;

	exports.StaticJsonRpcProvider = urlJsonRpcProvider.StaticJsonRpcProvider;
	exports.UrlJsonRpcProvider = urlJsonRpcProvider.UrlJsonRpcProvider;

	exports.Web3Provider = web3Provider.Web3Provider;

	exports.WebSocketProvider = websocketProvider.WebSocketProvider;

	exports.Formatter = formatter.Formatter;


	var logger = new lib.Logger(_version$I.version);
	////////////////////////
	// Helper Functions
	function getDefaultProvider(network, options) {
	    if (network == null) {
	        network = "homestead";
	    }
	    // If passed a URL, figure out the right type of provider based on the scheme
	    if (typeof (network) === "string") {
	        // @TODO: Add support for IpcProvider; maybe if it ends in ".ipc"?
	        // Handle http and ws (and their secure variants)
	        var match = network.match(/^(ws|http)s?:/i);
	        if (match) {
	            switch (match[1]) {
	                case "http":
	                    return new jsonRpcProvider.JsonRpcProvider(network);
	                case "ws":
	                    return new websocketProvider.WebSocketProvider(network);
	                default:
	                    logger.throwArgumentError("unsupported URL scheme", "network", network);
	            }
	        }
	    }
	    var n = lib$k.getNetwork(network);
	    if (!n || !n._defaultProvider) {
	        logger.throwError("unsupported getDefaultProvider network", lib.Logger.errors.NETWORK_ERROR, {
	            operation: "getDefaultProvider",
	            network: network
	        });
	    }
	    return n._defaultProvider({
	        FallbackProvider: fallbackProvider.FallbackProvider,
	        AlchemyProvider: alchemyProvider.AlchemyProvider,
	        CloudflareProvider: cloudflareProvider.CloudflareProvider,
	        EtherscanProvider: etherscanProvider.EtherscanProvider,
	        InfuraProvider: infuraProvider.InfuraProvider,
	        JsonRpcProvider: jsonRpcProvider.JsonRpcProvider,
	        NodesmithProvider: nodesmithProvider.NodesmithProvider,
	        Web3Provider: web3Provider.Web3Provider,
	        IpcProvider: browserIpcProvider.IpcProvider,
	    }, options);
	}
	exports.getDefaultProvider = getDefaultProvider;

	});

	var index$m = unwrapExports(lib$m);
	var lib_1$m = lib$m.Provider;
	var lib_2$k = lib$m.getNetwork;
	var lib_3$f = lib$m.BaseProvider;
	var lib_4$c = lib$m.AlchemyProvider;
	var lib_5$b = lib$m.CloudflareProvider;
	var lib_6$7 = lib$m.EtherscanProvider;
	var lib_7$6 = lib$m.FallbackProvider;
	var lib_8$5 = lib$m.IpcProvider;
	var lib_9$5 = lib$m.InfuraProvider;
	var lib_10$3 = lib$m.JsonRpcProvider;
	var lib_11$2 = lib$m.JsonRpcSigner;
	var lib_12$2 = lib$m.NodesmithProvider;
	var lib_13$2 = lib$m.StaticJsonRpcProvider;
	var lib_14$1 = lib$m.UrlJsonRpcProvider;
	var lib_15$1 = lib$m.Web3Provider;
	var lib_16$1 = lib$m.WebSocketProvider;
	var lib_17 = lib$m.Formatter;
	var lib_18 = lib$m.getDefaultProvider;

	var lib$n = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });





	var regexBytes = new RegExp("^bytes([0-9]+)$");
	var regexNumber = new RegExp("^(u?int)([0-9]*)$");
	var regexArray = new RegExp("^(.*)\\[([0-9]*)\\]$");
	var Zeros = "0000000000000000000000000000000000000000000000000000000000000000";
	function _pack(type, value, isArray) {
	    switch (type) {
	        case "address":
	            if (isArray) {
	                return lib$1.zeroPad(value, 32);
	            }
	            return lib$1.arrayify(value);
	        case "string":
	            return lib$8.toUtf8Bytes(value);
	        case "bytes":
	            return lib$1.arrayify(value);
	        case "bool":
	            value = (value ? "0x01" : "0x00");
	            if (isArray) {
	                return lib$1.zeroPad(value, 32);
	            }
	            return lib$1.arrayify(value);
	    }
	    var match = type.match(regexNumber);
	    if (match) {
	        //let signed = (match[1] === "int")
	        var size = parseInt(match[2] || "256");
	        if ((match[2] && String(size) !== match[2]) || (size % 8 !== 0) || size === 0 || size > 256) {
	            throw new Error("invalid number type - " + type);
	        }
	        if (isArray) {
	            size = 256;
	        }
	        value = lib$2.BigNumber.from(value).toTwos(size);
	        return lib$1.zeroPad(value, size / 8);
	    }
	    match = type.match(regexBytes);
	    if (match) {
	        var size = parseInt(match[1]);
	        if (String(size) !== match[1] || size === 0 || size > 32) {
	            throw new Error("invalid bytes type - " + type);
	        }
	        if (lib$1.arrayify(value).byteLength !== size) {
	            throw new Error("invalid value for " + type);
	        }
	        if (isArray) {
	            return lib$1.arrayify((value + Zeros).substring(0, 66));
	        }
	        return value;
	    }
	    match = type.match(regexArray);
	    if (match && Array.isArray(value)) {
	        var baseType_1 = match[1];
	        var count = parseInt(match[2] || String(value.length));
	        if (count != value.length) {
	            throw new Error("invalid value for " + type);
	        }
	        var result_1 = [];
	        value.forEach(function (value) {
	            result_1.push(_pack(baseType_1, value, true));
	        });
	        return lib$1.concat(result_1);
	    }
	    throw new Error("invalid type - " + type);
	}
	// @TODO: Array Enum
	function pack(types, values) {
	    if (types.length != values.length) {
	        throw new Error("type/value count mismatch");
	    }
	    var tight = [];
	    types.forEach(function (type, index) {
	        tight.push(_pack(type, values[index]));
	    });
	    return lib$1.hexlify(lib$1.concat(tight));
	}
	exports.pack = pack;
	function keccak256(types, values) {
	    return lib$4.keccak256(pack(types, values));
	}
	exports.keccak256 = keccak256;
	function sha256(types, values) {
	    return browser.sha256(pack(types, values));
	}
	exports.sha256 = sha256;

	});

	var index$n = unwrapExports(lib$n);
	var lib_1$n = lib$n.pack;
	var lib_2$l = lib$n.keccak256;
	var lib_3$g = lib$n.sha256;

	var _version$K = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "units/5.0.2";

	});

	var _version$L = unwrapExports(_version$K);
	var _version_1$n = _version$K.version;

	var lib$o = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });



	var logger = new lib.Logger(_version$K.version);
	var names = [
	    "wei",
	    "kwei",
	    "mwei",
	    "gwei",
	    "szabo",
	    "finney",
	    "ether",
	];
	// Some environments have issues with RegEx that contain back-tracking, so we cannot
	// use them.
	function commify(value) {
	    var comps = String(value).split(".");
	    if (comps.length > 2 || !comps[0].match(/^-?[0-9]*$/) || (comps[1] && !comps[1].match(/^[0-9]*$/)) || value === "." || value === "-.") {
	        logger.throwArgumentError("invalid value", "value", value);
	    }
	    // Make sure we have at least one whole digit (0 if none)
	    var whole = comps[0];
	    var negative = "";
	    if (whole.substring(0, 1) === "-") {
	        negative = "-";
	        whole = whole.substring(1);
	    }
	    // Make sure we have at least 1 whole digit with no leading zeros
	    while (whole.substring(0, 1) === "0") {
	        whole = whole.substring(1);
	    }
	    if (whole === "") {
	        whole = "0";
	    }
	    var suffix = "";
	    if (comps.length === 2) {
	        suffix = "." + (comps[1] || "0");
	    }
	    while (suffix.length > 2 && suffix[suffix.length - 1] === "0") {
	        suffix = suffix.substring(0, suffix.length - 1);
	    }
	    var formatted = [];
	    while (whole.length) {
	        if (whole.length <= 3) {
	            formatted.unshift(whole);
	            break;
	        }
	        else {
	            var index = whole.length - 3;
	            formatted.unshift(whole.substring(index));
	            whole = whole.substring(0, index);
	        }
	    }
	    return negative + formatted.join(",") + suffix;
	}
	exports.commify = commify;
	function formatUnits(value, unitName) {
	    if (typeof (unitName) === "string") {
	        var index = names.indexOf(unitName);
	        if (index !== -1) {
	            unitName = 3 * index;
	        }
	    }
	    return lib$2.formatFixed(value, (unitName != null) ? unitName : 18);
	}
	exports.formatUnits = formatUnits;
	function parseUnits(value, unitName) {
	    if (typeof (unitName) === "string") {
	        var index = names.indexOf(unitName);
	        if (index !== -1) {
	            unitName = 3 * index;
	        }
	    }
	    return lib$2.parseFixed(value, (unitName != null) ? unitName : 18);
	}
	exports.parseUnits = parseUnits;
	function formatEther(wei) {
	    return formatUnits(wei, 18);
	}
	exports.formatEther = formatEther;
	function parseEther(ether) {
	    return parseUnits(ether, 18);
	}
	exports.parseEther = parseEther;

	});

	var index$o = unwrapExports(lib$o);
	var lib_1$o = lib$o.commify;
	var lib_2$m = lib$o.formatUnits;
	var lib_3$h = lib$o.parseUnits;
	var lib_4$d = lib$o.formatEther;
	var lib_5$c = lib$o.parseEther;

	var utils$3 = createCommonjsModule(function (module, exports) {
	"use strict";
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result["default"] = mod;
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.AbiCoder = lib$a.AbiCoder;
	exports.checkResultErrors = lib$a.checkResultErrors;
	exports.defaultAbiCoder = lib$a.defaultAbiCoder;
	exports.EventFragment = lib$a.EventFragment;
	exports.FormatTypes = lib$a.FormatTypes;
	exports.Fragment = lib$a.Fragment;
	exports.FunctionFragment = lib$a.FunctionFragment;
	exports.Indexed = lib$a.Indexed;
	exports.Interface = lib$a.Interface;
	exports.LogDescription = lib$a.LogDescription;
	exports.ParamType = lib$a.ParamType;
	exports.TransactionDescription = lib$a.TransactionDescription;

	exports.getAddress = lib$6.getAddress;
	exports.getCreate2Address = lib$6.getCreate2Address;
	exports.getContractAddress = lib$6.getContractAddress;
	exports.getIcapAddress = lib$6.getIcapAddress;
	exports.isAddress = lib$6.isAddress;
	var base64 = __importStar(browser$8);
	exports.base64 = base64;

	exports.arrayify = lib$1.arrayify;
	exports.concat = lib$1.concat;
	exports.hexDataSlice = lib$1.hexDataSlice;
	exports.hexDataLength = lib$1.hexDataLength;
	exports.hexlify = lib$1.hexlify;
	exports.hexStripZeros = lib$1.hexStripZeros;
	exports.hexValue = lib$1.hexValue;
	exports.hexZeroPad = lib$1.hexZeroPad;
	exports.isBytes = lib$1.isBytes;
	exports.isBytesLike = lib$1.isBytesLike;
	exports.isHexString = lib$1.isHexString;
	exports.joinSignature = lib$1.joinSignature;
	exports.zeroPad = lib$1.zeroPad;
	exports.splitSignature = lib$1.splitSignature;
	exports.stripZeros = lib$1.stripZeros;

	exports.hashMessage = lib$9.hashMessage;
	exports.id = lib$9.id;
	exports.isValidName = lib$9.isValidName;
	exports.namehash = lib$9.namehash;

	exports.defaultPath = lib$h.defaultPath;
	exports.entropyToMnemonic = lib$h.entropyToMnemonic;
	exports.HDNode = lib$h.HDNode;
	exports.isValidMnemonic = lib$h.isValidMnemonic;
	exports.mnemonicToEntropy = lib$h.mnemonicToEntropy;
	exports.mnemonicToSeed = lib$h.mnemonicToSeed;

	exports.getJsonWalletAddress = lib$i.getJsonWalletAddress;

	exports.keccak256 = lib$4.keccak256;

	exports.Logger = lib.Logger;

	exports.computeHmac = browser.computeHmac;
	exports.ripemd160 = browser.ripemd160;
	exports.sha256 = browser.sha256;
	exports.sha512 = browser.sha512;

	exports.solidityKeccak256 = lib$n.keccak256;
	exports.solidityPack = lib$n.pack;
	exports.soliditySha256 = lib$n.sha256;

	exports.randomBytes = browser$6.randomBytes;
	exports.shuffled = browser$6.shuffled;

	exports.checkProperties = lib$3.checkProperties;
	exports.deepCopy = lib$3.deepCopy;
	exports.defineReadOnly = lib$3.defineReadOnly;
	exports.getStatic = lib$3.getStatic;
	exports.resolveProperties = lib$3.resolveProperties;
	exports.shallowCopy = lib$3.shallowCopy;
	var RLP = __importStar(lib$5);
	exports.RLP = RLP;

	exports.computePublicKey = lib$f.computePublicKey;
	exports.recoverPublicKey = lib$f.recoverPublicKey;
	exports.SigningKey = lib$f.SigningKey;

	exports.formatBytes32String = lib$8.formatBytes32String;
	exports.nameprep = lib$8.nameprep;
	exports.parseBytes32String = lib$8.parseBytes32String;
	exports._toEscapedUtf8String = lib$8._toEscapedUtf8String;
	exports.toUtf8Bytes = lib$8.toUtf8Bytes;
	exports.toUtf8CodePoints = lib$8.toUtf8CodePoints;
	exports.toUtf8String = lib$8.toUtf8String;
	exports.Utf8ErrorFuncs = lib$8.Utf8ErrorFuncs;

	exports.computeAddress = lib$g.computeAddress;
	exports.parseTransaction = lib$g.parse;
	exports.recoverAddress = lib$g.recoverAddress;
	exports.serializeTransaction = lib$g.serialize;

	exports.commify = lib$o.commify;
	exports.formatEther = lib$o.formatEther;
	exports.parseEther = lib$o.parseEther;
	exports.formatUnits = lib$o.formatUnits;
	exports.parseUnits = lib$o.parseUnits;

	exports.verifyMessage = lib$j.verifyMessage;

	exports.fetchJson = lib$l.fetchJson;
	exports.poll = lib$l.poll;
	////////////////////////
	// Enums
	var sha2_2 = browser;
	exports.SupportedAlgorithm = sha2_2.SupportedAlgorithm;
	var strings_2 = lib$8;
	exports.UnicodeNormalizationForm = strings_2.UnicodeNormalizationForm;
	exports.Utf8ErrorReason = strings_2.Utf8ErrorReason;

	});

	var utils$4 = unwrapExports(utils$3);
	var utils_1$3 = utils$3.AbiCoder;
	var utils_2$1 = utils$3.checkResultErrors;
	var utils_3$1 = utils$3.defaultAbiCoder;
	var utils_4$1 = utils$3.EventFragment;
	var utils_5 = utils$3.FormatTypes;
	var utils_6 = utils$3.Fragment;
	var utils_7 = utils$3.FunctionFragment;
	var utils_8 = utils$3.Indexed;
	var utils_9 = utils$3.Interface;
	var utils_10 = utils$3.LogDescription;
	var utils_11 = utils$3.ParamType;
	var utils_12 = utils$3.TransactionDescription;
	var utils_13 = utils$3.getAddress;
	var utils_14 = utils$3.getCreate2Address;
	var utils_15 = utils$3.getContractAddress;
	var utils_16 = utils$3.getIcapAddress;
	var utils_17 = utils$3.isAddress;
	var utils_18 = utils$3.base64;
	var utils_19 = utils$3.arrayify;
	var utils_20 = utils$3.concat;
	var utils_21 = utils$3.hexDataSlice;
	var utils_22 = utils$3.hexDataLength;
	var utils_23 = utils$3.hexlify;
	var utils_24 = utils$3.hexStripZeros;
	var utils_25 = utils$3.hexValue;
	var utils_26 = utils$3.hexZeroPad;
	var utils_27 = utils$3.isBytes;
	var utils_28 = utils$3.isBytesLike;
	var utils_29 = utils$3.isHexString;
	var utils_30 = utils$3.joinSignature;
	var utils_31 = utils$3.zeroPad;
	var utils_32 = utils$3.splitSignature;
	var utils_33 = utils$3.stripZeros;
	var utils_34 = utils$3.hashMessage;
	var utils_35 = utils$3.id;
	var utils_36 = utils$3.isValidName;
	var utils_37 = utils$3.namehash;
	var utils_38 = utils$3.defaultPath;
	var utils_39 = utils$3.entropyToMnemonic;
	var utils_40 = utils$3.HDNode;
	var utils_41 = utils$3.isValidMnemonic;
	var utils_42 = utils$3.mnemonicToEntropy;
	var utils_43 = utils$3.mnemonicToSeed;
	var utils_44 = utils$3.getJsonWalletAddress;
	var utils_45 = utils$3.keccak256;
	var utils_46 = utils$3.Logger;
	var utils_47 = utils$3.computeHmac;
	var utils_48 = utils$3.ripemd160;
	var utils_49 = utils$3.sha256;
	var utils_50 = utils$3.sha512;
	var utils_51 = utils$3.solidityKeccak256;
	var utils_52 = utils$3.solidityPack;
	var utils_53 = utils$3.soliditySha256;
	var utils_54 = utils$3.randomBytes;
	var utils_55 = utils$3.shuffled;
	var utils_56 = utils$3.checkProperties;
	var utils_57 = utils$3.deepCopy;
	var utils_58 = utils$3.defineReadOnly;
	var utils_59 = utils$3.getStatic;
	var utils_60 = utils$3.resolveProperties;
	var utils_61 = utils$3.shallowCopy;
	var utils_62 = utils$3.RLP;
	var utils_63 = utils$3.computePublicKey;
	var utils_64 = utils$3.recoverPublicKey;
	var utils_65 = utils$3.SigningKey;
	var utils_66 = utils$3.formatBytes32String;
	var utils_67 = utils$3.nameprep;
	var utils_68 = utils$3.parseBytes32String;
	var utils_69 = utils$3._toEscapedUtf8String;
	var utils_70 = utils$3.toUtf8Bytes;
	var utils_71 = utils$3.toUtf8CodePoints;
	var utils_72 = utils$3.toUtf8String;
	var utils_73 = utils$3.Utf8ErrorFuncs;
	var utils_74 = utils$3.computeAddress;
	var utils_75 = utils$3.parseTransaction;
	var utils_76 = utils$3.recoverAddress;
	var utils_77 = utils$3.serializeTransaction;
	var utils_78 = utils$3.commify;
	var utils_79 = utils$3.formatEther;
	var utils_80 = utils$3.parseEther;
	var utils_81 = utils$3.formatUnits;
	var utils_82 = utils$3.parseUnits;
	var utils_83 = utils$3.verifyMessage;
	var utils_84 = utils$3.fetchJson;
	var utils_85 = utils$3.poll;
	var utils_86 = utils$3.SupportedAlgorithm;
	var utils_87 = utils$3.UnicodeNormalizationForm;
	var utils_88 = utils$3.Utf8ErrorReason;

	var _version$M = createCommonjsModule(function (module, exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = "ethers/5.0.6";

	});

	var _version$N = unwrapExports(_version$M);
	var _version_1$o = _version$M.version;

	var ethers = createCommonjsModule(function (module, exports) {
	"use strict";
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result["default"] = mod;
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.Contract = lib$d.Contract;
	exports.ContractFactory = lib$d.ContractFactory;

	exports.BigNumber = lib$2.BigNumber;
	exports.FixedNumber = lib$2.FixedNumber;

	exports.Signer = lib$c.Signer;
	exports.VoidSigner = lib$c.VoidSigner;

	exports.Wallet = lib$j.Wallet;
	var constants = __importStar(lib$7);
	exports.constants = constants;
	var providers = __importStar(lib$m);
	exports.providers = providers;
	var providers_1 = lib$m;
	exports.getDefaultProvider = providers_1.getDefaultProvider;

	exports.Wordlist = browser$4.Wordlist;
	exports.wordlists = browser$4.wordlists;
	var utils = __importStar(utils$3);
	exports.utils = utils;

	exports.errors = lib.ErrorCode;
	////////////////////////
	// Compile-Time Constants
	// This is generated by "npm run dist"

	exports.version = _version$M.version;
	var logger = new lib.Logger(_version$M.version);
	exports.logger = logger;

	});

	var ethers$1 = unwrapExports(ethers);
	var ethers_1 = ethers.Contract;
	var ethers_2 = ethers.ContractFactory;
	var ethers_3 = ethers.BigNumber;
	var ethers_4 = ethers.FixedNumber;
	var ethers_5 = ethers.Signer;
	var ethers_6 = ethers.VoidSigner;
	var ethers_7 = ethers.Wallet;
	var ethers_8 = ethers.constants;
	var ethers_9 = ethers.providers;
	var ethers_10 = ethers.getDefaultProvider;
	var ethers_11 = ethers.Wordlist;
	var ethers_12 = ethers.wordlists;
	var ethers_13 = ethers.utils;
	var ethers_14 = ethers.errors;
	var ethers_15 = ethers.version;
	var ethers_16 = ethers.logger;

	var lib$p = createCommonjsModule(function (module, exports) {
	"use strict";
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result["default"] = mod;
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	// To modify this file, you must update ./admin/cmds/update-exports.js
	var ethers$1 = __importStar(ethers);
	exports.ethers = ethers$1;
	try {
	    var anyGlobal = window;
	    if (anyGlobal._ethers == null) {
	        anyGlobal._ethers = ethers$1;
	    }
	}
	catch (error) { }
	var ethers_1 = ethers;
	exports.Signer = ethers_1.Signer;
	exports.Wallet = ethers_1.Wallet;
	exports.VoidSigner = ethers_1.VoidSigner;
	exports.getDefaultProvider = ethers_1.getDefaultProvider;
	exports.providers = ethers_1.providers;
	exports.Contract = ethers_1.Contract;
	exports.ContractFactory = ethers_1.ContractFactory;
	exports.BigNumber = ethers_1.BigNumber;
	exports.FixedNumber = ethers_1.FixedNumber;
	exports.constants = ethers_1.constants;
	exports.errors = ethers_1.errors;
	exports.logger = ethers_1.logger;
	exports.utils = ethers_1.utils;
	exports.wordlists = ethers_1.wordlists;
	////////////////////////
	// Compile-Time Constants
	exports.version = ethers_1.version;
	exports.Wordlist = ethers_1.Wordlist;

	});

	var index$p = unwrapExports(lib$p);
	var lib_1$p = lib$p.ethers;
	var lib_2$n = lib$p.Signer;
	var lib_3$i = lib$p.Wallet;
	var lib_4$e = lib$p.VoidSigner;
	var lib_5$d = lib$p.getDefaultProvider;
	var lib_6$8 = lib$p.providers;
	var lib_7$7 = lib$p.Contract;
	var lib_8$6 = lib$p.ContractFactory;
	var lib_9$6 = lib$p.BigNumber;
	var lib_10$4 = lib$p.FixedNumber;
	var lib_11$3 = lib$p.constants;
	var lib_12$3 = lib$p.errors;
	var lib_13$3 = lib$p.logger;
	var lib_14$2 = lib$p.utils;
	var lib_15$2 = lib$p.wordlists;
	var lib_16$2 = lib$p.version;
	var lib_17$1 = lib$p.Wordlist;

	exports.BigNumber = lib_9$6;
	exports.Contract = lib_7$7;
	exports.ContractFactory = lib_8$6;
	exports.FixedNumber = lib_10$4;
	exports.Signer = lib_2$n;
	exports.VoidSigner = lib_4$e;
	exports.Wallet = lib_3$i;
	exports.Wordlist = lib_17$1;
	exports.constants = lib_11$3;
	exports.default = index$p;
	exports.errors = lib_12$3;
	exports.ethers = lib_1$p;
	exports.getDefaultProvider = lib_5$d;
	exports.logger = lib_13$3;
	exports.providers = lib_6$8;
	exports.utils = lib_14$2;
	exports.version = lib_16$2;
	exports.wordlists = lib_15$2;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
