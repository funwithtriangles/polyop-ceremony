var audioAnalyser = require('./audioAnalyser');
var bpm = 115;
var ppb = 24; // pulses per beat
var spp = (60/(bpm*ppb)); // seconds per pulse
var marker = audioAnalyser.getTime();
var now;

var cowbell = require('../assets/cowbell.json');
var cowbellIndex = 0;

var tick = 0;

var pulse = function() {
	tick++;

	// Every beat
	if (tick % 24 == 0) {

	}
}


var checkChannels = function(time) {

	while (time >= cowbell[cowbellIndex]) {
		// console.log(time);
		cowbellIndex++;
	}
}

var run = function() {
	now = audioAnalyser.getTime();

	checkChannels(now * 1000);
			
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