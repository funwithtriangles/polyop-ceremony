var Freq = require('./freq');

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

// Create a stream
stream = analyser.createStream(source, {
	bandVals: [
		[ 0, 0.01 ],
		[ 0.1, 0.5]
	]
});

// Create a new visualiser from stream passing in an empty div
stream.visualiser(elVisualiser);

var updateLevels = function() {
	stream.update();
}

var getLevels = function() {
	return stream.read();
}

module.exports = {
	getLevels: getLevels,
	updateLevels: updateLevels
}