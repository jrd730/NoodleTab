var parser = require("../src/noodle-parser.js");

var input = "6: 0 - #022 0232# @P1 [3: 2]*2";
var result = parser.parse(input);

console.assert(result[0].type == 'StringChange');
console.assert(result[0].value == '6');

console.assert(result[1].type == 'Fret');
console.assert(result[1].value == 0);

console.assert(result[2].type == 'Rest');

console.assert(result[3].type == 'ChordLow');
console.assert(result[3].value.length == 3);

console.assert(result[4].type == 'ChordHigh');
console.assert(result[4].value.length == 4);

console.assert(result[5].type == 'PhraseId');
console.assert(result[5].value == 'P1');

console.assert(result[6].type == 'Sequence');
console.assert(result[6].value.length == 2);
console.assert(result[6].repeat == 2);

console.log(result);
