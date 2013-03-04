/*
 * JsRand - predictable random number generation for javascript
 *
 * For the latest copy try here: https://github.com/kristopolous/jsrand
 */

var Random = (function(){

  function Base() {}

  Base.prototype.set = function(count, min, max){
    var ret = [];

    while(count-- > 0) {
      ret.push(this.generate(min, max));
    }
    return ret;
  }

  // This is Fisher-Yates 
  // see here: http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  Base.prototype.shuffle = function(array) {
    var remaining = array.length, slosh, ptr;

    while (remaining) {

      ptr = Math.floor(this.generate(0, remaining--));

      slosh = array[remaining];
      array[remaining] = array[ptr];
      array[ptr] = slosh;
    }

    return array;
  }

  Base.prototype.base = function (len, base) {
    return Math.floor( this.generate( 0, base )).toString(base) + (
      (len > 1) ?
        arguments.callee(len - 1, base) : ''
      );
  }

  Base.prototype.UUID = function(){
    return [
      this.base(8, 16),
      this.base(4, 16),
      this.base(4, 16),
      this.base(4, 16),
      this.base(12, 16)
    ].join('-');
  }

  Base.prototype.integer = function(){
    return Math.round(this.generate.apply(this, arguments));
  }

  Base.prototype.generate = function(min, max) {
    var unit = this._unitgenerate();

    if(!arguments.length) { return unit; }
    return (unit * (max - min) + min);
  }

  function Generator(initializer){
    function type(){
      var funcNames = initializer();
      for(var func in funcNames) {
        this[func] = funcNames[func];
      }
      this.seed(0);
    }
    type.prototype = new Base();
    return type;
  }

  return {
    Generator: Generator,
    PRNG: Generator(function(){
        var 
          round = 0,
          lastrand = 0,
          p1 = 0,
          p2 = 0,
          
          fallover = Math.pow(2, 16),
          primes = [[
            15485933, 15486347, 15486953, 15487177,
            15486173, 15485993, 15487253, 15488107,
            15488197, 15488321, 15487403, 15487429,
            15487583, 15487609, 15489559, 15489587
          ], [ 
            15829799, 15830189, 15830873, 15829423,
            15846617, 15846707, 15846221, 15846269,
            15879271, 15879371, 15878839, 15879239,
            15905347, 15905629, 15905059, 15904909
          ]];

        return {
          seed: function(num) {
            lastrand = num;
            round = 0;
          },
          _unitgenerate: function(){
            if(round++ % fallover == 0) {
              p1 = primes[0][Math.floor(round / fallover / 16) & 15]; 
              p2 = primes[1][Math.floor(round / fallover) & 15]; 
            }

            lastrand = (lastrand * p1 + round) % p2;

            return lastrand / p2;
          }
        }
      }),

    // From http://en.wikipedia.org/wiki/Mersenne_twister
    MT: Generator(function(){
      var twist = [], index = 0;

      return {
        seed: function(num) {
          twist[0] = num;
          for(var i = 1; i < 624; i++) {
            twist[i] = (0x6c078965 * (twist[ i - 1 ] ^ (twist[ i - 1 ] >> 30)) + i) & 0xFFFFFFFF;
          }
        },
        _unitgenerate: function(){
          if(index == 0) {
            for(var i = 0; i < 624; i++) {
              var y = (twist[i] & 0x80000000) + (twist[ (i + 1) % 624 ] & 0x7FFFFFFF);
              twist[i] = twist[(i + 397) % 624] ^ (y >> 1);
              if ((y % 2) != 0) {
                twist[i] ^= 0x9908b0df;
              }
            }
          }

          var num = twist[index];
          num ^= (num >> 11);
          num ^= (num << 7) & 0x9d2c5680;
          num ^= (num << 15) & 0xefc60000;
          num ^= (num >> 18);

          index = (index + 1) % 624;
          return num / Math.pow(2, 31);
        }
      }
    })
  };
})();
