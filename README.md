# NoodleTab
A Javascript module for making guitar and bass tabs using a shorthand notation.  

## Usage

```
var NoodleTab = require("../src/noodle-tab.js");

var phrases = {
	start: "5: 5 7 8 4: 5 5: 7 - 6: 8 5: 5 - 54650# -"
};

var output = NoodleTab.makeTab('start', phrases);
console.log(output);
```
```
E|--------------------------------------0-------|
B|--------------------------------------5-------|
G|--------------------------------------6-------|
D|--------------5-----------------------4-------|
A|--5---7---8-------7-----------5-------5-------|
E|--------------------------8-------------------|

```

## Building
This step is only necessary if you want to change the grammar.
To rebuild the parser make sure you have Pegjs installed.
 ```
 npm install -g pegjs
 ```
Then run Pegjs with the updated grammar file as the input.
```
pegjs ./src/noodle-parser.pegjs
```
This should create a new file ./src/noodle-parser.js

## API

### makeTab(start, phrases, [format])
Parses a set of phrases and returns a string containing the tab starting from the specified start phrase.

- #### Parameters
    - startPhrase: A string containing the name of a phrase to start from.
    - phrases: An object where each key is the id of a phrase and each value is a string representing the phrase in shorthand notation.
    - format: Optional config object with values that control tab formatting
        - autoWidth: if true the last block will be truncated
        - lineWidth: the number of dashes in each tab line
        - noteSpacing: the number of dashes between each note
        - barSpacing:  the number of dashes to put after a bar
        - lineCount: the number of tab lines in each block
        - openTunings: an array of strings to specify the tuning of each string 

## Grammar
NoodleTab uses the following symbols in its phrase notation. Symbols can be separated with spaces, tabs, or newlines.

Symbol|Description
------|-----------
_\<int>_|Specifies a fret to be played on the current string
_\<int>_:|Changes the current string, must be within the range [1 - StringCount] inclusive.
\#_\<int>_|Specifies a chord using the digits of the integer as frets starting on the lowest string. 
_\<int>_\#|Specifies a chord using the digits of the integer as frets ending on the highest string.
\-|Specifies a rest at the current column which creates space between notes.
\||Specifies a measure bar to be printed at the current column
\,|Starts a new block below the current one.
\@_\<string>_|Specifies a phrase with the given id. Phrases cannot contain circular references.
\[_\<string>_]|Specifies a bracketed sequence containing combinations of the aforementioned symbols.
\^_\<int>_|Can be placed immediately after a bracketed sequence to shift the string of each note in the sequence.
\>_\<int>_|Can be placed immediately after a bracketed sequence to shift the fret of each note in the sequence.
\*_\<int>_|Can be placed immediately after a bracketed sequence to repeat it the given number of times.
\+|Can be place between two bracketed sequences to have them be superimposed.

## Todo
* add support for annotations (lyrics, chord names)
* output to svg or canvas

## License
MIT

