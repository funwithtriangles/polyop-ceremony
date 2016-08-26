var audioAnalyser = require('./audioAnalyser');
var bpm = 115;
var ppq = 480; // pulses per quarter note (per beat)
var spp = (60/(bpm*ppq)); // seconds per pulse
var marker = audioAnalyser.getTime();
var now;

var cowbell = require('../assets/cowbell.json');
var cowbellIndex = 0;
var timelineIndex = 0;

var tick = 0;

var mask = require('./mask');
var camera = require('./camera');

// Get time sig in seconds of specified bar / beat
var barBeat = function(bar, beat) {

	var beats = (bar * 4) + beat;
	return beats * (60/bpm);

}

var timeline = [
	{
		time: 25,
		event: mask.params.enterScene
	},
	{
		time: barBeat(24, 0),
		event: camera.params.startOrbit
	},
	{
		time: barBeat(28, 0),
		event: camera.params.startOrbit
	},
	{
		time: barBeat(32, 0),
		event: camera.params.startOrbit
	},
	{
		time: barBeat(36, 0),
		event: camera.params.startOrbit
	},
	{
		time: barBeat(40, 0),
		event: camera.params.stopOrbit
	}
]

var pulse = function() {
	tick++;

	// Every beat
	if (tick % ppq == 0) {

	}
}

var checkChannels = function(time) {

	// EVENTS
	while (timeline[timelineIndex] && time >= timeline[timelineIndex].time) {
		
		timeline[timelineIndex].event();
		timelineIndex++;
	}


	// MIDI
	while (time >= cowbell[cowbellIndex] * spp) {
		//console.log('b');
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