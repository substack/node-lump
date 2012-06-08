var Stream = require('stream');
var util = require('util');
var pathway = require('pathway');

module.exports = function (opts) {
    return new Lump(opts);
};

function Lump (opts, path) {
    if (!opts) opts = {};
    if (typeof opts === 'number') opts = { size : opts };
    if (!opts.size) throw new Error('required parameter "size" not given');
    
    this.writable = true;
    this.size = opts.size;
    this.path = path || opts.path || [];
    this.data = [];
}

util.inherits(Lump, Stream);

Lump.prototype.lumps = function () {
    var min = Math.min.apply(null, this.data);
    var max = Math.max.apply(null, this.data);
    var step = (max - min) / this.size;
    
    var lumps = [];
    var sorted = this.data.sort();
    var ix = 0;
    
    for (var x = min; x < max; x += step) {
        var lump = { min : x, max : x + step, count : 0 };
        for (; sorted[ix] < x + step; ix++) {
            lump.count ++;
        }
        lumps.push(lump);
    }
    return lumps;
};

Lump.prototype.write = function (obj) {
    var self = this;
    var xs = pathway(obj, self.path);
    self.data.push.apply(self.data, xs);
};

Lump.prototype.end = function () {
    this.emit('end');
};
