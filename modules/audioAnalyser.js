var Freq = require('./freq');
var gui = require('./gui');
var guiFolder = gui.addFolder('Frequencies');

var audioContext, analyser, source, stream, freqs;

var audio = new Audio();
audio.src = 'ceremony.ogg';
audio.controls = true;
// audio.autoplay = true;
document.body.appendChild(audio);

var elVisualiser = document.createElement("div");
elVisualiser.className = "debug-visualiser";
document.body.appendChild( elVisualiser );


audioContext = new( window.AudioContext || window.webkitAudioContext );

source = audioContext.createMediaElementSource(audio);

// Set up audio lib
analyser = new Freq(audioContext);

var params = {
	'a0': 0,
	'a1': 0.01,
	'b0': 0.1,
	'b1': 0.5,
	'c0': 0.5,
	'c1': 1,
	'smoothing': 0.85
}


// gui.remember(params);

var a0 = guiFolder.add(params, 'a0', 0, 1);
var a1 = guiFolder.add(params, 'a1', 0, 1);
var b0 = guiFolder.add(params, 'b0', 0, 1);
var b1 = guiFolder.add(params, 'b1', 0, 1);
var c0 = guiFolder.add(params, 'c0', 0, 1);
var c1 = guiFolder.add(params, 'c1', 0, 1);
var smoothing = guiFolder.add(params, 'smoothing', 0, 1);


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

c0.onChange(function(value) {
	stream.bands[2].updateLower(value);
});

c1.onChange(function(value) {
	stream.bands[2].updateUpper(value);
});

smoothing.onChange(function(value) {
	stream.updateSmoothing(value);
});

// Create a stream
stream = analyser.createStream(source, {
	bandVals: [
		[ params['a0'], params['a1'] ],
		[ params['b0'], params['b1'] ],
		[ params['c0'], params['c1'] ]
	],
	smoothing: params.smoothing
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

var getTime = function() {
	return audio.currentTime
}

module.exports = {
	getLevels: getLevels,
	updateLevels: updateLevels,
	getTime: getTime
}