var Parser = require("./noodle-parser.js");

var format = {
    autoWidth: true,
    lineWidth: 64,
    lineCount: 6,
    noteSpacing: 4,
    barSpacing: 2,
    openTunings: ["E", "A", "D", "G", "B", "E"]
}

var phrases = {};

function makeTab(startPhraseId, newPhrases, newFormat)
{
    if (typeof newFormat != undefined) {
        Object.assign(format, newFormat);
    }

    if (newPhrases != null)
    {
        parsePhrases(newPhrases);
        var phraseId = (startPhraseId || 'start');
        var lineBlocks = [makeLineBlock()];
        var printPos = {
            block: 0,
            string: 0,
            column: format.barSpacing,
            stringShift: 0,
            fretShift: 0
        }

        var sequence = phrases[phraseId];
        // console.log(JSON.stringify(sequence, null, 2));
        overlaySequence(sequence, lineBlocks, printPos);
        return lineBlocks.map((block, blockNum) => {
            return block.map((line, lineNum) => {
                if (format.autoWidth === true && blockNum === printPos.block){
                    line = line.substr(0, printPos.column);
                }
                return `${format.openTunings[ format.lineCount - lineNum - 1 ]}|${line}|`;
            }).join('\n')
        }).join('\n\n\n');
    }
}

function overlaySequence(sequence, lineBlocks, printPos)
{
    sequence.forEach((item, index, list) => {
        if (item.type == "Block" || (printPos.column >= format.lineWidth)){
            printPos.block += 1;
            printPos.column = format.barSpacing;
            if (printPos.block >= lineBlocks.length){
                lineBlocks.push(makeLineBlock());
            }
        }
        var printPosCopy = Object.assign({}, printPos);

        switch(item.type){
            case 'Sequence':
                if (item.stringShift) printPos.stringShift += item.stringShift;
                if (item.fretShift) printPos.fretShift += item.fretShift;

                for (let reps = item.repeat || 1; reps > 0; reps--){
                    overlaySequence(item.value, lineBlocks, printPos);
                }
                if (item.next != null){
                    overlaySequence([item.next], lineBlocks, printPosCopy);
                }

                if (item.stringShift) printPos.stringShift -= item.stringShift;
                if (item.fretShift) printPos.fretShift -= item.fretShift;

            break;
            case 'PhraseId':
                if (!phrases.hasOwnProperty(item.value))
                    throw `Error: Phrase not defined: ${item.value}`;
                overlaySequence(phrases[item.value], lineBlocks, printPos);
            break;
            case 'ChordHigh':
                printChord(lineBlocks, printPosCopy, item.value, item.value.length - 1)
            break;
            case 'ChordLow':
                printChord(lineBlocks, printPosCopy, item.value, format.lineCount - 1)
            break;
            case 'StringChange':
                let stringNum = item.value + printPos.stringShift;
                if (stringNum < 1 || stringNum > format.lineCount)
                    throw `Error: Line number out of bounds, must be between 1 and ${format.lineCount} inclusive.`;
                printPos.string = stringNum-1;
            break;
            case 'Technique':
                printSymbol(lineBlocks, printPosCopy, item.value.toString());
            break;
            case 'Fret':
                let fret = item.value + printPos.fretShift;
                if (fret < 0)
                    throw `Error: Fret number must be greater than or equal to 0.`
                printSymbol(lineBlocks, printPosCopy, fret.toString());
            break;
            case 'Bar':
                if (printPos.column > format.barSpacing){
                    for (let i = 0; i < format.lineCount; i++){
                        printPosCopy.string = i;
                        printSymbol(lineBlocks, printPosCopy, '|');
                    }
                }
            break;
        }

        if (item.type != 'Sequence' && item.type != 'Block' && item.type != 'StringChange' && item.type != 'PhraseId'){
            printPos.column += format.noteSpacing;
        }
    });
}

function parsePhrases(phraseDef)
{
    for (var id in phraseDef){
        var sequence = Parser.parse(phraseDef[id]);
        if (sequence != null){
            phrases[id] = sequence;
        }
    }
}

function makeLineBlock()
{
    var lines = new Array(format.lineCount);
    var tabLine = "-".repeat(format.lineWidth);
    lines.fill(tabLine);
    return lines;
}

function printSymbol(lineBlocks, printPos, symbol)
{
    if (printPos.block < 0 || printPos.block >= lineBlocks.length)
        return;
    if (printPos.string < 0 ||  printPos.string >= format.lineCount){
        return;
    }
    var str = lineBlocks[printPos.block][printPos.string];
    lineBlocks[printPos.block][printPos.string] =
            str.slice(0, printPos.column)
            + symbol.toString()
            + str.slice(printPos.column + symbol.length);
}

function printChord(lineBlocks, printPos, chord, startString)
{
    if (chord.length > format.lineCount)
        throw `Error: Too many strings in chord: ${item.value.join('')}`;
    chord.forEach((fret, index) => {
        printPos.string = startString - index;
        if (printPos.stringShift){
            printPos.string += printPos.stringShift;
        }
        var fretSymbol = fret;
        if (printPos.fretShift){
            fretSymbol = parseInt(fret) + parseInt(printPos.fretShift);
        }
        printSymbol(lineBlocks, printPos, fretSymbol.toString());
    });
}

module.exports = {
    format,
    makeTab
}