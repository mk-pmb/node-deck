var deck = require('deck');
var assert = require('assert');
var eql = assert.deepEqual;

function shuffler (fn) {
    var xs = [0,1,2,3,4,5,6,7,8,9];
    var xs_ = fn(xs);
    eql(xs, [0,1,2,3,4,5,6,7,8,9], 'shuffle mutated its argument');
    eql(xs.length, 10);
    assert.ok(xs.every(function (x) {
        return xs_.indexOf(x) >= 0
    }));
}

exports.shuffle = function () {
    shuffler(deck.shuffle);
};

exports.shuffleObj = function () {
    shuffler(function (xs) {
        return deck(xs).shuffle()
    });
};

exports.weightedShuffle = function () {
    eql(deck.shuffle({ a : 1000, b : 0.01 }), [ 'a', 'b' ]);
    
    var weights = { a : 3, b : 1, c : 10 };
    var total = 3 + 1 + 10;
    var loops = 5000;
    
    var counts = {};
    for (var i = 0; i < loops; i++) {
        var x = deck.shuffle(weights).join('');
        counts[x] = (counts[x] || 0) + 1;
    }
    
    function margins (key) {
        var keys = key.split('');
        var expected = key.split('').reduce(function (p, x) {
            var p_ = p * weights[x] / keys.reduce(function (acc, k) {
                return acc + weights[k];
            }, 0);
            keys.shift();
            return p_;
        }, loops);
        assert.ok(counts[key] >= 0.95 * expected);
        assert.ok(counts[key] <= 1.05 * expected);
    }
    
    Object.keys(counts).every(margins);
};
