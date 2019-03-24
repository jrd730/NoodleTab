var NoodleTab = require("../src/noodle-tab.js");

var format = {
  noteSpacing: 3,
};

var phrases = {
  I:  "6: 0 4 5: 2 4: 2 ",
  IV: "[@I]>5",
  V:  "[@I]>7",
  start: "[@I]*2 [@IV] [@V]"
};

var output = NoodleTab.makeTab('start', phrases, format);
console.log(output);