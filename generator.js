const morseChars = `1234567890QWERTYUIOPASDFGHJKLZXCVBNM!@$&()_+-=:;'"/.?`;
const morseCharsEncode = `.---- ..--- ...-- ....- ..... -.... --... ---.. ----. ----- --.- .-- . .-. - -.-- ..- .. --- .--. .- ... -.. ..-. --. .... .--- -.- .-.. --.. -..- -.-. ...- -... -. -- -.-.-- .--.-. ...-..- .-... -.--. -.--.- ..--.- .-.-. -....- -...- ---... -.-.-. .----. .-..-. -..-. .-.-.- ..--..`.split(" ");

let generatorRepeatPattern = 1; 
let generatorScale = 0; 
let generatorFillGaps = false;
let generatorFillGapsKey = 1;

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

let playPosition = 0;
let playInterval = 0;
let isPlaying = false;

window.onload = function() {
    display = document.getElementById('display-canvas');

    document.title = `BeepBox Song Generator | "` + songName + `"`;

    document.onkeypress = function(e) {  
        if(e.code == 'Space' && e.target == document.body) {
            e.preventDefault();
        }
        console.log(e.target);
        if(e.code == 'Space' 
            && e.target.tagName != 'TEXTAREA'
            && e.target.tagName != 'INPUT') {
            isPlaying = !isPlaying;
        }
        console.log(e.code);
    }

    document.getElementById('input-text').oninput = function() {
        updateSong();
    }

    document.getElementById('songName').oninput = function() {
        songName = this.value
        document.title = `BeepBox Song Generator | "` + songName + `"`;
    };
    document.getElementById('songKey').onchange = function() {
        songKey = this.options[this.selectedIndex].text;
        updateSong();
    };
    document.getElementById('songBeatsPerBar').oninput = function() {
        songBeatsPerBar = Math.max(2, this.value);
        updateTickLenght();
        updateSong();
     };
    document.getElementById('songTicksPerBeat').oninput = function() {
        songTicksPerBeat = Math.max(2, this.value);
        updateTickLenght();
        updateSong();
    };
    document.getElementById('songBeatsPerMinute').oninput = function() {
        songBeatsPerMinute = this.value;
        updateSong();
    };
    // document.getElementById('songReverb').oninput = function() {songReverb = this.value};
    document.getElementById('tickLenght').oninput = function() {
        updateTickLenght();
        updateSong();
    };

    document.getElementById('generatorRepeatPattern').oninput = function() { 
        generatorRepeatPattern = this.value;
        updateSong();
    };
    document.getElementById('generatorScale').onchange = function() {
        generatorScale = this.selectedIndex;
        updateSong();
    };
    document.getElementById('generatorFillGaps').onchange = function() {
        generatorFillGaps = this.checked;
        document.getElementById('generatorFillGapsKey').disabled = !this.checked;
        updateSong();
    };

    document.getElementById('generatorFillGapsKey').oninput = function() { 
        generatorFillGapsKey = this.value;
        updateSong();
    };





    setInterval(updateDisplay, 10);


    updateSong();
    setInterval(playSong, 10);

    rotateDevice = document.getElementById('rotate-device');
    setInterval(updateLayout, 100);
}

let rotateDevice = null;
function updateLayout() {
    rotateDevice.classList = screen.orientation.angle == 0 ? "hidden" : "";
}


function updateSong() {
    crateNotes();
}

function updateKey() {

}


//   
//      ##############          ##                  ##############      ##          ##
//      ##          ##          ##                  ##          ##      ##          ##
//      ##          ##          ##                  ##          ##      ##          ##
//      ##          ##          ##                  ##          ##      ##          ##
//      ##          ##          ##                  ##          ##      ##          ##
//      ##          ##          ##                  ##          ##      ##          ##
//      ##############          ##                  ##############      ##############
//      ##                      ##                  ##          ##                  ##
//      ##                      ##                  ##          ##                  ##
//      ##                      ##                  ##          ##                  ##
//      ##                      ##                  ##          ##                  ##
//      ##                      ##                  ##          ##                  ##
//      ##                      ##############      ##          ##      ##############
//


let playTimer = 0;
let playLast = 0;
function playSong() {
      // playNote(392.0, 'sine'); 
      // playNote(392.0, 'square'); 
      // playNote(392.0, 'triangle'); 
      // playNote(392.0, 'sawtooth'); 

    // let context = new AudioContext();
    // let o = context.createOscillator();
    // let g = context.createGain();
    // o.type = 'square';
    // o.connect(g);
    // o.start(0);
    // for (var i = 0; i < notes.length; i++) {
    //     playNote(notes[i], i * interval);
    // }
    // var notes = [392, 2794, 100];
    // for (var i = 0; i < notes.length; i++) {
    //     playNote(notes[i], i * interval);
    // }

    // for (var i = 0; i < songNotes.length; i++) {
    //     let note = songNotes[i];
    //     if(note != null)
    //         // playNote(frequencyFromPitch(songStartKey + note), 'sawtooth', i * interval);
    //         setTimeout(playNote(frequencyFromPitch(songStartKey + note), 'sawtooth', i * interval), i*1000);
    // }
    // setTimeout(function() {o.end()}, songNotes.length*1000);

    /*
        150 beat/minute    songBeatsPerMinute
        2 tick/beat         songTicksPerBeat

        150 beat/minute * 2 tick/beat = 300 tick/minute
    */
    if(isPlaying) playTimer += 10;

    /*

        1000 = 1*songTicksPerBeat (beat/sec) = 60*songTicksPerBeat  (beat/min)
        2000 = 2*songTicksPerBeat (beat/sec) = 120*songTicksPerBeat (beat/min)

        100*time = 6*songTicksPerBeat
        100*time = 6*songTicksPerBeat
        time = 6*songTicksPerBeat/100

        600  = 0.6   beat/sec = 100 beat/min
        6    = 0.006 beat/sec = 1   beat/min

        60 b/m = 1b/s
        
    */
    playInterval = 1000/(songBeatsPerMinute/60)/songTicksPerBeat * tickLenght; //songBeatsPerMinute * songTicksPerBeat * songBeatsPerBar / 6
    // 6*
    ///songTicksPerBeat

    if(playTimer > playInterval){
        playTimer -= playInterval;
        play();

        //playPosition = Math.floor(playTimer/2/playInterval);
        // playTimer -= playInterval;
        //if(playLast != playPosition) play();
        //playLast = playPosition;
    }
    // playInterval = 60 / songTicksPerBeat*songBeatsPerMinute / 10;
    // console.log(playInterval, playPosition);
    // setTimeout(playSong, playInterval);
}

let audio = new AudioContext();

function createOscillator(frequency, type) {
    var osc = audio.createOscillator();

    osc.frequency.value = frequency;
    osc.type = type;
    osc.connect(audio.destination);
    osc.start(0);

    setTimeout(function() {
        osc.stop(0);
        osc.disconnect(audio.destination);
    }, playInterval)
}

function play() {
    var note = songNotes[playPosition];
    if(note == null || note == undefined) {
        playNextNote();
        return;
    }
    freq = frequencyFromPitch(note + songStartKey);
    if(freq) {
        // createOscillator(freq, 'triangle');
        // createOscillator(freq, 'square');

        createOscillator(freq, 'square');
        createOscillator(freq, 'triangle');
        createOscillator(freq, 'sawtooth');
      // playNote(392.0, 'sine'); 
      // playNote(392.0, 'square'); 
      // playNote(392.0, 'triangle'); 
      // playNote(392.0, 'sawtooth'); 
    }
    playNextNote();
}

function playNextNote() {
    playPosition += 1;
    if(playPosition >= songNotes.length) {
        playPosition = 0;
    }
}

function frequencyFromPitch(pitch) {
    return 440.0 * Math.pow(2.0, (pitch - 69.0) / 12.0);
}


// function playNote(frequency, type) {
//   let context=new AudioContext();
//   let o=null;
//   let g=null;
//   setTimeout(function(){
//     o = context.createOscillator();
//       g = context.createGain();
//       o.type = type;
//       o.connect(g);
//       o.frequency.value = frequency;
//       g.connect(context.destination);
//       o.start(0);
//       g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
//   },1000);
// }



//   
//      ##############          ##############      ##############      ##          ##
//      ##          ##          ##          ##      ##          ##      ##          ##
//      ##            ##        ##          ##      ##          ##      ##          ##
//      ##            ##        ##          ##      ##          ##      ##          ##
//      ##              ##      ##          ##      ##          ##      ##          ##
//      ##              ##      ##          ##      ##          ##      ##          ##
//      ##              ##      ##############      ##############      ##          ##
//      ##              ##      ##  ##              ##          ##      ##          ##
//      ##              ##      ##    ##            ##          ##      ##    ##    ##
//      ##            ##        ##      ##          ##          ##      ##  ##  ##  ##
//      ##            ##        ##       ##         ##          ##      ##  ##  ##  ##
//      ##          ##          ##        ##        ##          ##      ##  ##  ##  ##
//      ##############          ##          ##      ##          ##      ####      ####
//


function updateDisplay() {

    let ticksPerBar = songTicksPerBeat*songBeatsPerBar;
    let g = display.getContext('2d');
    display.height = display.parentElement.offsetHeight;

    let height = display.height;

    let h = height/15;

    let w = h;
    let barPadding = 10;
    display.width = songNotes.length*w*tickLenght + ticksPerBar;

    let width = display.width;

    let playPositionX = playPosition + playTimer/playInterval;

    g.fillStyle = "#000";
    g.fillRect(0, 0, width, height);

    g.fillStyle = "#222";
    g.fillRect(0, h, width, height-h*3);

    g.strokeStyle = "#555";
    g.beginPath();
    for (var key = 1; key < 14; key++) {
        g.moveTo(0, h*key);
        g.lineTo(width, h*key);
    }
    g.stroke();

    g.strokeStyle = "#777";
    g.beginPath();
    for (var i = 0; i <= songNotes.length*tickLenght; i+=songTicksPerBeat) {
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
    }

    g.stroke();

    // Scale

    g.fillStyle = "#000000AA";
    for (var i = 1; i <= 12; i++) {
        if(scaleKeys[generatorScale].indexOf(i) == -1)
        g.fillRect(0, height - (i+2)*h, width, h);
    }

    // Play
    let playX = playPositionX*w*tickLenght + Math.floor(playPosition*tickLenght/ticksPerBar)*barPadding;//*ticksPerBar*w + (playPosition-1)*barPadding;
    g.fillStyle = "#FFF";
    g.fillRect(playX-2, h, 2, height-3*h);
    g.fillStyle = "#FFFFFF33";
    g.fillRect(0, h, playX, height-3*h);

    for (var i = 0; i < songNotes.length; i++) {
        let note = songNotes[i];
        let gray = 1-Math.min(1, Math.max(0, (playPositionX-i)/10));
        g.fillStyle = 'hsl(183deg 100% ' + (57+43*gray) + '%)';
        let sizeK = Math.sin(playPositionX-i)*gray;
        if(playPositionX < i) {
            g.fillStyle = '#25F3FF';
            sizeK = 0;
        }
        if(note != null)
        g.fillRect(w*i*tickLenght + Math.floor(i*tickLenght/ticksPerBar)*barPadding, height - h*(note+2) + sizeK*h, w*tickLenght, h);
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

//   
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//      #####################################################################################
//


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
                    songNotes.push(generatorFillGaps ? (generatorFillGapsKey-0) : null);
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