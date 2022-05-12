const morseChars = `1234567890QWERTYUIOPASDFGHJKLZXCVBNM!@$&()_+-=:;'"/.?`;
const morseCharsEncode = `.---- ..--- ...-- ....- ..... -.... --... ---.. ----. ----- --.- .-- . .-. - -.-- ..- .. --- .--. .- ... -.. ..-. --. .... .--- -.- .-.. --.. -..- -.-. ...- -... -. -- -.-.-- .--.-. ...-..- .-... -.--. -.--.- ..--.- .-.-. -....- -...- ---... -.-.-. .----. .-..-. -..-. .-.-.- ..--..`.split(" ");

let generatorRepeatPattern = 1; 
let generatorScale = 0; 

let songStartKey = 48;

let songName = "Generated Song";
let songKey = "C";
let songIntroBars = 0;
let songLoopBars = null;
let songBeatsPerBar = 8;
let songTicksPerBeat = 4;
let songBeatsPerMinute = 150;
let songReverb = 0;
let tickLenght = 2;

let songNotes = [48, 49, 50];

let scaleKeys = [
[12,11,10,9,8,7,6,5,4,3,2,1],
[11, 9, 7, 6, 4, 2, 1],
[11, 10, 8, 6, 4, 3, 1]
];

let display;

window.onload = function() {
    display = document.getElementById('display-canvas');

    document.title = `BeepBox Song Generator | "` + songName + `"`;
    document.getElementById('songName').oninput = function() {
        songName = this.value
        document.title = `BeepBox Song Generator | "` + songName + `"`;
    };
    document.getElementById('songKey').onchange = function() {songKey = this.options[this.selectedIndex].text};
    document.getElementById('songBeatsPerBar').oninput = function() {songBeatsPerBar = Math.max(2, this.value); updateTickLenght()};
    document.getElementById('songTicksPerBeat').oninput = function() {songTicksPerBeat = Math.max(2, this.value); updateTickLenght()};
    document.getElementById('songBeatsPerMinute').oninput = function() {songBeatsPerMinute = this.value};
    // document.getElementById('songReverb').oninput = function() {songReverb = this.value};
    document.getElementById('tickLenght').oninput = function() {updateTickLenght()};

    document.getElementById('generatorRepeatPattern').oninput = function() { generatorRepeatPattern = this.value};
    document.getElementById('generatorScale').onchange = function() {generatorScale = this.selectedIndex};
    setInterval(updateDisplay, 100);
}

function updateKey() {

}

function updateDisplay() {
    crateNotes();

    let ticksPerBar = songTicksPerBeat*songBeatsPerBar;
    let g = display.getContext('2d');
    display.height = display.parentElement.offsetHeight;

    let w = 20;
    let barPadding = 10;
    display.width = songNotes.length*w + ticksPerBar;

    let width = display.width;
    let height = display.height;

    let h = height/15;

    g.fillStyle = "#000";
    g.fillRect(0, 0, width, height);

    g.fillStyle = "#222";
    g.fillRect(0, h, width, height-h*3);

    g.fillStyle = "#25F3FF";
    for (var i = 0; i < songNotes.length; i++) {
        let note = songNotes[i];
        if(note != null)
        g.fillRect(w*i + Math.floor(i/ticksPerBar)*barPadding, h*(note), w, h);
    }

    g.strokeStyle = "#555";
    g.beginPath();
    for (var key = 1; key < 14; key++) {
        g.moveTo(0, h*key);
        g.lineTo(width, h*key);
    }
    g.stroke();

    g.strokeStyle = "#777";
    g.beginPath();
    for (var i = 0; i < songNotes.length; i+=songTicksPerBeat) {
        g.moveTo(w*i + Math.floor(i/ticksPerBar)*barPadding, h);
        g.lineTo(w*i + Math.floor(i/ticksPerBar)*barPadding, height-2*h);
    }
    g.stroke();

    g.strokeStyle = "#777";
    g.beginPath();
    g.font = "bold " + h*0.75 + "px Arial";
    for (var i = 0; i < 1 + songNotes.length/ticksPerBar; i++) {
        let x = i*ticksPerBar*w + (i-1)*barPadding;
        g.fillStyle = "#000";
        g.fillRect(x, h, barPadding, height-h*3);
        g.moveTo(x, h);
        g.lineTo(x, height-2*h);

        g.fillStyle = "#555";
        g.fillText(" Bar #" + i, x - ticksPerBar*w, h*1.75);
        // g.moveTo(w*i + Math.floor(i/ticksPerBar)*barPadding, h);
        // g.lineTo(w*i + Math.floor(i/ticksPerBar)*barPadding, height-2*h);
    }
    g.stroke();

    // Scale

    g.fillStyle = "#000000AA";
    for (var i = 1; i <= 12; i++) {
        if(scaleKeys[generatorScale].indexOf(i) == -1)
        g.fillRect(0, i*h, width, h);
    }
}

function updateTickLenght() {
    let tl = document.getElementById('tickLenght');
    let l = tl.value;
    let ticks = songBeatsPerBar*songTicksPerBeat;
    let isFound = false;
    if(l > tickLenght) {
        console.log('+');
        for (var i = l; i < ticks; i++) {
            if(ticks%i == 0) {
                l = i;
                isFound = true;
                break;
            }
        }
        if(!isFound) l = ticks;
    }else {
        console.log('-');
        for (var i = l - 1; i >= 1; i--) {
            if(ticks%i == 0) {
                l = i;
                isFound = true;
                break;
            }
        }
        if(!isFound) l = 0;
    }
    if(l > ticks) l = ticks;
    if(l < 1) l = 1;


    tl.value = l;
    tickLenght = l;
    //Math.round(songTicksPerBeat/tl.value)*tl.value/(songBeatsPerBar*songTicksPerBeat);
}

function crateNotes() {
    let text = document.getElementById('input-text').value.toUpperCase();
    songNotes = [];
    for (var i = 0; i < text.length; i++) {
        let char = text.charAt(i);
        let charIndex = morseChars.indexOf(char);
        if(charIndex != -1) {
            let charKey = char.charCodeAt(0)%scaleKeys[generatorScale].length;
            let morse = morseCharsEncode[charIndex];
            for (var j = 0; j < morse.length; j++) {
                for (var repeat = 0; repeat < generatorRepeatPattern; repeat++) {
                    if(morse.charAt(j) == '.') {
                        songNotes.push(scaleKeys[generatorScale][charKey]);
                    }else {
                        songNotes.push(scaleKeys[generatorScale][charKey]);
                        songNotes.push(scaleKeys[generatorScale][charKey]);
                    }
                    songNotes.push(null);
                }
            }
        }
    }
}

function generate() {
    crateNotes();
    exportSong();
}

function exportSong() {
    console.log("Exporting...");

   /*
        TODO:
        "masterGain": 1
        "compressionThreshold": 1
        "limitThreshold": 1
        "limitDecay": 4
        "limitRise": 4000
        "limitRatio": 1
        "compressionRatio": 1
        "layeredInstruments": false
        "patternInstruments": false
   */
    const barTicks = songBeatsPerBar*songTicksPerBeat/tickLenght;
    const bars = songNotes.length/barTicks;

    let song = new Object();

    song.format = "BeepBox";
    song.scale = "Free";
    song.version = 5;

    song.name = songName;
    song.key = songKey;
    song.introBars = songIntroBars;
    song.loopBars = (songLoopBars == null) ? bars : songLoopBars; // TODO
    song.beatsPerBar = songBeatsPerBar;
    song.ticksPerBeat = songTicksPerBeat;
    song.beatsPerMinute = songBeatsPerMinute;
    song.reverb = songReverb;
    song.masterGain = 1;
    song.compressionThreshold = 1;
    song.limitThreshold = 1;
    song.limitDecay = 4;
    song.limitRise = 4000;
    song.limitRatio = 1;
    song.compressionRatio = 1;
    song.layeredInstruments = false;
    song.patternInstruments = false;

    let channels = new Object();
    channels.type = "pitch";
    channels.name = "";

    let instruments = [];
    for (var i = 0; i < 1; i++) {
        let instrument = new Object();
        instrument.type = "chip";
        instrument.volume = "0";
        instrument.eqFilter = [];
        instrument.eqFilterType = true;
        instrument.eqSimpleCut = 7;
        instrument.eqSimplePeak = 2;
        instrument.effects = ["panning", "reverb"];
        instrument.pan = 0;
        instrument.panDelay = 10;
        instrument.reverb = 3;
        instrument.fadeInSeconds = 0.0263;
        instrument.fadeOutTicks = -3;
        instrument.wave = "square";
        instrument.unison = "none";
        instrument.envelopes = [{target: "none", envelope: "swell 1"}];

        instruments.push(instrument);
    }
    channels.instruments = instruments;

    console.log(songNotes);
    let patterns = [];
    for (var bar = 0; bar <= bars; bar++) {
        let pattern = new Object();
        let notes = [];
        for (var tick = 0; tick < barTicks; tick++) {
            let index = bar*barTicks+tick;
            let key = songNotes[index];
            if(key == null) continue;

            let note = new Object();
            note.pitches = [key + songStartKey];

            note.points = [
                {tick: tick*tickLenght, pitchBend: 0, volume: 100, forMod: false},
                {tick: (tick+1)*tickLenght, pitchBend: 0, volume: 100, forMod: false}
            ];

            note.continuesLastPattern = true;
            /*
            "points": [
                                {
                                    "tick": 0,
                                    "pitchBend": 0,
                                    "volume": 100,
                                    "forMod": false
                                },
                                {
                                    "tick": 4,
                                    "pitchBend": 0,
                                    "volume": 100,
                                    "forMod": false
                                }
                            ],
            */

            notes.push(note);
        }
        pattern.notes = notes;
        patterns.push(pattern);
    }
    channels.patterns = patterns;



    channels.instruments = instruments;
    let sequence = [];
    for (var i = 0; i <= bars; i++) {
        sequence.push(i+1);
    }
    channels.sequence = sequence;
    channels.octaveScrollBar = 2;
    song.channels = [channels];
    downloadJson(song);
}


function downloadJson(song){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(song, null, "\t"));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", songName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }