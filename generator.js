const morseChars = `1234567890QWERTYUIOPASDFGHJKLZXCVBNM!@$&()_+-=:;'"/.?`;
const morseCharsEncode = `.---- ..--- ...-- ....- ..... -.... --... ---.. ----. ----- --.- .-- . .-. - -.-- ..- .. --- .--. .- ... -.. ..-. --. .... .--- -.- .-.. --.. -..- -.-. ...- -... -. -- -.-.-- .--.-. ...-..- .-... -.--. -.--.- ..--.- .-.-. -....- -...- ---... -.-.-. .----. .-..-. -..-. .-.-.- ..--..`.split(" ");

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

window.onload = function() {
    document.title = `BeepBox Song Generator | "` + songName + `"`;
    document.getElementById('songName').oninput = function() {
        songName = this.value
        document.title = `BeepBox Song Generator | "` + songName + `"`;
    };
    document.getElementById('songKey').onchange = function() {songKey = this.options[this.selectedIndex].text};
    document.getElementById('songBeatsPerBar').oninput = function() {songBeatsPerBar = this.value; updateTickLenght()};
    document.getElementById('songTicksPerBeat').oninput = function() {songTicksPerBeat = this.value; updateTickLenght()};
    document.getElementById('songBeatsPerMinute').oninput = function() {songBeatsPerMinute = this.value};
    // document.getElementById('songReverb').oninput = function() {songReverb = this.value};
    document.getElementById('tickLenght').oninput = function() {updateTickLenght()};
}

function updateKey() {

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

function generate() {
    console.log("Generating...");
    let text = document.getElementById('input-text').value.toUpperCase();
    songNotes = [];
    console.log("Text length", text.length);
    for (var i = 0; i < text.length; i++) {
        let char = text.charAt(i);
        let charIndex = morseChars.indexOf(char);
        if(charIndex != -1) {
            let charKey = char.charCodeAt(0)%12;
            let morse = morseCharsEncode[charIndex];
            for (var j = 0; j < morse.length; j++) {
                if(morse.charAt(j) == '.') {
                    songNotes.push(charKey);
                }else {
                    songNotes.push(charKey);
                    songNotes.push(charKey);
                }
                songNotes.push(null);
            }
        }
    }
    console.log(tickLenght);
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