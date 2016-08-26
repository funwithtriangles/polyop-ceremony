var audioAnalyser = require('./audioAnalyser');

var params = {
	bpm: 115,
	ppq: 480,  // pulses per quarter note (per beat)
	spp: 60/(115*480)
}

var lfo = {
	sine: 0,
	sineHalf: 0
}

var tick = 0;


var deltaStep = Math.PI / params.ppq;
var marker = audioAnalyser.getTime();
var now;

var pulse = function() {
	tick++;

	// Every beat
	if (tick % params.ppq == 0) {

	}

	lfo.sine = Math.sin(deltaStep * tick);
	lfo.sineHalf = Math.sin(deltaStep * 2 * tick);

}


var run = function() {
	now = audioAnalyser.getTime();

	// Check to see if time passed is more than time per pulse
	var result = now - marker;

	while (result > params.spp) {
		// Pulse if so
		pulse();
		// Increase next time to check against by time per pulse
		marker+=params.spp;
		// Loop over in case missed more than one pulse
		result-=params.spp;
	}
}

module.exports = {
	run: run,
	params: params,
	lfo: lfo
}