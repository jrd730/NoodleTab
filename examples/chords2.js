var NoodleTab = require("../src/noodle-tab.js");

var phrases = {
  I: "5: 3 4: 2 3: 0 2: 1 3: 0 4: 2",
  VI: "5: 0 4: 2 3: 2 2: 1 3: 0 4: 2",
  start: "[ {Cmaj} @I | {Amin} @VI ]"
};

var output = NoodleTab.makeTab('start', phrases);
module.exports = output;