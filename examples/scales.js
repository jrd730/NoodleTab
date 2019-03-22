var NoodleTab = require("../src/noodle-tab.js");

var format = {
   lineWidth: 37,
   noteSpacing: 4,
   barSpacing: 2
}

var phrases = {
   Cmaj: "5: 3 4: 0 2 3 3: 0 2 2: 0 1",
   Amin: "5: 0 2 3 4: 0 2  3 3: 0 2",
   F:    "6: 1 3 5: 0 2 3 4: 0 2 3",
   G:    "6: 3 5: 0 2 3 4: 0 2 3 3: 0",
   start: "@Cmaj 32010# , @Amin 02210# , @F #133211 , @G #320003"
};

var output = NoodleTab.makeTab('start', phrases, format);
console.log(output);