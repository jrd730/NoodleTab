const assert = require('assert');
// const NoodleTab = require('../src/noodle-tab.js');

describe("NoodleTab", function (){
  it('should display chords with fret shifts', function () {
    let tab = require('../examples/chords1.js');
    assert.equal(tab,
`                
E|--5---5---7---|
B|--5---7---9---|
G|--6---7---7---|
D|--7---7---9---|
A|--7---5---7---|
E|--5-----------|`)
  });

  it('should show annotations above the tab', function () {
    let tab = require('../examples/chords2.js');
    assert.equal(tab,
`    Cmaj                        Amin                    
E|--------------------------|---------------------------|
B|--------------1-----------|---------------1-----------|
G|----------0-------0-------|-----------2-------0-------|
D|------2---------------2---|-------2---------------2---|
A|--3-----------------------|---0-----------------------|
E|--------------------------|---------------------------|`);

  });

  it('should display chords with skipped strings', function () {
    let tab = require('../examples/chords3.js');
    assert.equal(tab,
`                
E|--0---2---4---|
B|--------------|
G|--------------|
D|--2---4---6---|
A|--------------|
E|--0---2---4---|`);

  });

  it('should display a sequence of notes with fret shifts', function () {
    let tab = require('../examples/I_IV_V.js');
    assert.equal(tab,
`                                                    
E|--------------------------------------------------|
B|--------------------------------------------------|
G|--------------------------------------------------|
D|-----------2-----------2-----------7-----------9--|
A|--------2-----------2-----------7-----------9-----|
E|--0--4--------0--4--------5--9--------7--11-------|`);
  });
});