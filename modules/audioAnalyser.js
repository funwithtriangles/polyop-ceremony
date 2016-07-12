var Freq = require('./freq');
var gui = require('./gui').addFolder('Frequencies');

var audioContext, analyser, source, stream, freqs;

var audio = new Audio();
audio.src = 'swamp.mp3';
audio.controls = true;
audio.autoplay = true;
document.body.appendChild(audio);

var elVisualiser = document.createElement("div");
elVisualiser.className = "debug-visualiser";
document.body.appendChild( elVisualiser );


audioContext = new( window.AudioContext || window.webkitAudioContext );

source = audioContext.createMediaElementSource(audio);

// Set up audio lib
analyser = new Freq(audioContext);

var ranges = {
	'a0': 0,
	'a1': 0.01,
	'b0': 0.1,
	'b1': 0.5
}

var a0 = gui.add(ranges, 'a0', 0, 1);
var a1 = gui.add(ranges, 'a1', 0, 1);
var b0 = gui.add(ranges, 'b0', 0, 1);
var b1 = gui.add(ranges, 'b1', 0, 1);

a0.onChange(function(value) {
	stream.bands[0].updateLower(value);
});

a1.onChange(function(value) {
	stream.bands[0].updateUpper(value);
});

b0.onChange(function(value) {
	stream.bands[1].updateLower(value);
});

b1.onChange(function(value) {
	stream.bands[1].updateUpper(value);
});

// Create a stream
stream = analyser.createStream(source, {
	bandVals: [
		[ ranges['a0'], ranges['a1'] ],
		[ ranges['b0'], ranges['b1'] ]
	]
});

// Create a new visualiser from stream passing in an empty div
stream.visualiser(elVisualiser);

// Should only happen once per tick
var updateLevels = function() {
	stream.update();
}

// Can be used to get data in many modules
var getLevels = function() {
	return stream.read();
}

module.exports = {
	getLevels: getLevels,
	updateLevels: updateLevels
}