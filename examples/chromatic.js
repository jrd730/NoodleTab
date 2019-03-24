var NoodleTab = require("../src/noodle-tab.js");

var phrases = {
  maj3: "6: 0 1 2 3 4",
  riff: "@maj3 [ @maj3 [@maj3]^-1 ]^-1",
  start: "@riff"
};

var output = NoodleTab.makeTab('start', phrases);
console.log(output);