# NoodleTab
A NodeJS module for making guitar and bass tabs using a shorthand notation.

## API

### NoodleTab(config)
Constructs a new instance with an optional configuration object.

### makeTab(startPhrase, phrases)
Parses a set of phrases and returns a string containing the tab starting from the specified start phrase.

- #### Parameters
    - startPhrase: A string containing the name of a phrase to start from.
    - phrases: An object where each key is the id of a phrase and each value is a string representing the phrase in shorthand notation.

## Grammar
NoodleTab uses the following symbols in its phrase notation.

* \<int> 
    Specifies a fret to be played on the current string

* \<int>:  
    Changes the current string, must be within the range [1 - StringCount] inclusive.

* \#<int>
    Specifies a chord using the digits of the integer as frets starting on the lowest string. 

* \<int>#
    Specifies a chord using the digits of the integer as frets ending on the highest string.

* \-
    Specifies a rest at the current column which creates space between notes.

* \|
    Specifies a measure bar to be printed at the current column

* \, 
    Starts a new block below the current one.

* \@<string>
    Specifies a phrase with the given id. Phrases cannot contain circular references.

* \[<string>]
    Specifies a bracketed sequence containing combinations of the aforementioned symbols.

* \*<int>
    Can be placed immediately after a bracketed sequence to repeat it the given number of times.

* \+ 
    Can be place between two bracketed sequences to have them be superimposed.


