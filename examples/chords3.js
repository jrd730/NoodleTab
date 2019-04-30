var NoodleTab = require("../src/noodle-tab.js");

var phrases = {
  oct: "#0x2xx0",
  start: "@oct [@oct]>2 [@oct]>4"
};

var output = NoodleTab.makeTab('start', phrases);
console.log(output);