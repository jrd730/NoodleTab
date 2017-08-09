var Parser = require("./noodle-parser.js");

class NoodleTab
{
    constructor(conf) 
    {
        this.parser = Parser;
        this.phrases = {};
        this.setDefaultConf();
        if (conf) {
            this.lineWidth = conf.lineWidth || this.lineWidth;
            this.noteSpacing = conf.noteSpacing || this.noteSpacing;
            this.barSpacing = conf.barSpacing || this.barSpacing;
            this.openTunings = conf.openTunings || this.openTunings;
        }
        this.lineCount = this.openTunings.length;
    }

    setDefaultConf()
    {
        this.lineWidth = 64;
        this.lineCount = 6;
        this.noteSpacing = 2;
        this.barSpacing = 2;
        this.openTunings = ["E", "A", "D", "G", "B", "E"];
    }

    makeTab(startPhraseId, phrases)
    {
        if (phrases != null)
        {
            this.parsePhrases(phrases);
            var phraseId = (startPhraseId || 'start');
            var lineBlocks = [this.makeLineBlock()];
            var printPos = {
                block: 0,
                string: 0,
                column: this.barSpacing
            }
            var sequence = this.phrases[phraseId];
            console.log(JSON.stringify(sequence));
            this.overlaySequence(sequence, lineBlocks, printPos);
            return lineBlocks.map((block) => { return block.join('\n')}).join('\n\n\n');
        }
    }

    overlaySequence(sequence, lineBlocks, printPos)
    {
        sequence.forEach((item, index, list) => {
            if (item.type == "Block" || (printPos.column >= this.lineWidth)){
                printPos.block += 1;
                printPos.column = this.barSpacing;
                if (printPos.block >= lineBlocks.length){
                    lineBlocks.push(this.makeLineBlock());   
                }
            }
            var printPosCopy = Object.assign({}, printPos);

            switch(item.type){
                case 'Sequence':
                    for (let reps = item.repeat || 1; reps > 0; reps--){
                        this.overlaySequence(item.value, lineBlocks, printPos);
                    }
                    if (item.next != null){
                        this.overlaySequence([item.next], lineBlocks, printPosCopy);
                    }
                break;
                case 'PhraseId':
                    if (!this.phrases.hasOwnProperty(item.value))
                        throw `Error: Phrase not defined: ${item.value}`;
                    this.overlaySequence(this.phrases[item.value], lineBlocks, printPos);
                break;
                case 'ChordHigh':
                    if (item.value.length > this.lineCount) 
                        throw `Error: Too many strings in chord: ${item.value.join('')}`;
                    item.value.forEach((fret, index) => {
                        printPosCopy.string = item.value.length - index - 1;
                        this.printSymbol(lineBlocks, printPosCopy, fret);
                    });
                break;
                case 'ChordLow':
                    if (item.value.length > this.lineCount) 
                        throw `Error: Too many strings in chord: ${item.value.join('')}`;
                    item.value.forEach((fret, index) => {
                        printPosCopy.string = this.lineCount - index - 1;
                        this.printSymbol(lineBlocks, printPosCopy, fret);
                    });
                break;
                case 'StringChange':
                    if (item.value < 1 || item.value > this.lineCount)
                        throw `Error: Line number out of bounds, must be between 1 and ${this.lineCount} inclusive.`;
                    printPos.string = item.value-1;
                break;
                case 'Fret':
                    if (parseInt(item.value) < 0)
                        throw `Error: Fret number must be greater than or equal to 0.`
                    this.printSymbol(lineBlocks, printPos, item.value.toString());
                break;
                case 'Bar':
                    if (printPos.column > this.barSpacing){
                        for (let i = 0; i < this.lineCount; i++){
                            printPosCopy.string = i;
                            this.printSymbol(lineBlocks, printPosCopy, '|');
                        }
                    }
                break;
            }

            if (item.type != 'Block' && item.type != 'StringChange' && item.type != 'PhraseId'){
                printPos.column += this.noteSpacing;
            }
        });
    }

    parsePhrases(phraseDef)
    {
        for (var id in phraseDef){
            var sequence = this.parser.parse(phraseDef[id]);
            if (sequence != null){
                this.phrases[id] = sequence;
            }
        }
    }

    makeLineBlock()
    {
        var lines = new Array(this.lineCount);
        var tabLine = `|${"-".repeat(this.lineWidth)}|`;
        lines.fill(tabLine);
        return lines;
    }

    printSymbol(lineBlocks, printPos, symbol)
    {
        if (printPos.block < 0 || printPos.block >= lineBlocks.length)
            return;
        var str = lineBlocks[printPos.block][printPos.string];
        lineBlocks[printPos.block][printPos.string] =
                str.slice(0, printPos.column) 
                + symbol.toString()
                + str.slice(printPos.column + symbol.length, str.length);
            
    }
}

module.exports = NoodleTab;