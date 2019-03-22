{
    function makeInt (chars){ return parseInt(chars.join(), 10); }
    var queue = [];
}

start
    = phrase 
    {
        return queue;
    }

phrase
    = myList:list
    {
        queue = queue.concat(myList);
    }

list
    = listItem+ 

listItem
    = sequence
    / phraseId
    / chordHigh
    / chordLow
    / stringChange
    / technique
    / fret
    / rest
    / block
    / bar

sequence
    = "[" _ myList:list _ "]" repeat:repeater? _ addItem:("+" _ sequence _)?
    {
        return {
            type: "Sequence",
            value: myList,
            repeat: repeat,
            next: (addItem != null)? addItem[2] : null
        }
    }
    
repeater
    = "*"repeat:[1-9]+
    {
        return parseInt(makeInt(repeat));
    }

phraseId
    = _ "@" myVar1:[a-zA-Z"_"]+ myVar2:[a-zA-Z0-9"_""#"]* _ 
    {
        var id = "";
        if (myVar1) id += myVar1.join('');
        if (myVar2) id += myVar2.join('');

        return {
            type: 'PhraseId',
            value: id
        }
    }

chordHigh
    = _ myVar:[0-9|"x"]+ "#" _ 
    {
        return {
            type: 'ChordHigh',
            value: myVar
        };
    }

chordLow
    = _ "#" myVar:[0-9|"x"]+ _ 
    {
        return {
            type: 'ChordLow',
            value: myVar
        };
    }

stringChange
    = _ myVar:[0-9]+ ":" _ 
    {
        return {
            type: 'StringChange',
            value: makeInt(myVar)
        };
    }

technique
    = _ myVar:["h""p""s""t"] _ 
    {
        return {
            type: 'Technique',
            value: myVar
        }
    }

fret
    = _ myVar:[0-9]+ _ 
    { 
        return {
            type: 'Fret',
            value: parseInt(text())
        };
    }

rest
    = _ "-" _
    {
        return {
            type: 'Rest',
            value: 1 
        }
    }

block
    = _ "," _
    {
        return {
            type: 'Block',
            value: 1
        }
    }

bar
    = _ "|" _
    {
        return {
            type: 'Bar',
            value: 1
        }
    }
_
    = [" "\t\r\n]*