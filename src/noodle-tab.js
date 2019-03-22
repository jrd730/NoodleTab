var Parser = require("./noodle-parser.js");

var format = {
	lineWidth: 64,
	lineCount: 6,
	noteSpacing: 4,
	barSpacing: 2,
	openTunings: ["E", "A", "D", "G", "B", "E"],
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
			column: format.barSpacing
		}
		var sequence = phrases[phraseId];
		console.log(JSON.stringify(sequence));
		overlaySequence(sequence, lineBlocks, printPos);
		return lineBlocks.map((block) => { 
			return block.map((line, index) => {
				return `${format.openTunings[ format.lineCount - index - 1 ]}|${line}|`;
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
				for (let reps = item.repeat || 1; reps > 0; reps--){
					overlaySequence(item.value, lineBlocks, printPos);
				}
				if (item.next != null){
					overlaySequence([item.next], lineBlocks, printPosCopy);
				}
			break;
			case 'PhraseId':
				if (!phrases.hasOwnProperty(item.value))
					throw `Error: Phrase not defined: ${item.value}`;
				overlaySequence(phrases[item.value], lineBlocks, printPos);
			break;
			case 'ChordHigh':
				if (item.value.length > format.lineCount) 
					throw `Error: Too many strings in chord: ${item.value.join('')}`;
				item.value.forEach((fret, index) => {
					printPosCopy.string = item.value.length - index - 1;
					printSymbol(lineBlocks, printPosCopy, fret);
				});
			break;
			case 'ChordLow':
				if (item.value.length > format.lineCount) 
					throw `Error: Too many strings in chord: ${item.value.join('')}`;
				item.value.forEach((fret, index) => {
					printPosCopy.string = format.lineCount - index - 1;
					printSymbol(lineBlocks, printPosCopy, fret);
				});
			break;
			case 'StringChange':
				if (item.value < 1 || item.value > format.lineCount)
					throw `Error: Line number out of bounds, must be between 1 and ${format.lineCount} inclusive.`;
				printPos.string = item.value-1;
            break;
            case 'Technique':
                printSymbol(lineBlocks, printPosCopy, item.value.toString());
			break;
			case 'Fret':
				if (parseInt(item.value) < 0)
					throw `Error: Fret number must be greater than or equal to 0.`
				printSymbol(lineBlocks, printPos, item.value.toString());
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

		if (item.type != 'Block' && item.type != 'StringChange' && item.type != 'PhraseId'){
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
	var str = lineBlocks[printPos.block][printPos.string];
	lineBlocks[printPos.block][printPos.string] =
			str.slice(0, printPos.column) 
			+ symbol.toString()
			+ str.slice(printPos.column + symbol.length, str.length);
		
}

module.exports = { 
	format,
	makeTab
}