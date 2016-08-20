var audioAnalyser = require('./audioAnalyser');
var bpm = 115;
var ppq = 480; // pulses per quarter note (per beat)
var spp = (60/(bpm*ppq)); // seconds per pulse
var marker = audioAnalyser.getTime();
var now;

var cowbell = require('../assets/cowbell.json');
var cowbellIndex = 0;

var tick = 0;

var pulse = function() {
	tick++;

	// Every beat
	if (tick % ppq == 0) {

	}
}

var checkChannels = function(time) {

	while (time >= cowbell[cowbellIndex] * spp) {
		console.log('b');
		cowbellIndex++;
	}
}

var run = function() {
	now = audioAnalyser.getTime();

	checkChannels(now);
			
	// Check to see if time passed is more than time per pulse
	var result = now - marker;

	while (result > spp) {
		// Pulse if so
		pulse();
		// Increase next time to check against by time per pulse
		marker+=spp;
		// Loop over in case missed more than one pulse
		result-=spp;
	}
}

module.exports = {
	run: run
}