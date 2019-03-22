var NoodleTab = require("../src/noodle-tab.js");

var format = {
	lineWidth: 68,
	noteSpacing: 4,
	barSpacing: 2
};

var phrases = {
	A: "3: 0 5: 3 2: 1 3: 2 0 5: 3",
	B: "3: 0 4: 3 | 2 2 3 3: 0 5: 3 4: 0",
	start: "@A @B 4:2 - @A @B 5: 3"
};

var output = NoodleTab.makeTab('start', phrases, format);
console.log(output);