var NoodleTab = require("../src/noodle-tab.js");

var phrases = {
  E: "#022100",
  A: "02220#",
  B7: "24242#",
  start: "[@E @A @B7]>5"
};

var output = NoodleTab.makeTab('start', phrases);
console.log(output);