var NoodleTab = require("../src/noodle-tab.js");

var format = {
	lineWidth: 36,
	noteSpacing: 2
};

var phrases = {
	start: "6:5 p3 h5 5:3 6:5 5:3 h5 p3 h5 s7"
};

var output = NoodleTab.makeTab('start', phrases, format);
console.log(output);