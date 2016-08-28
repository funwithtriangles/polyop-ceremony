var audioAnalyser = require('./audioAnalyser');
var clock = require('./clock');

var now;

var cowbell = require('../assets/cowbell.json');
var cowbellIndex = 0;
var timelineIndex = 0;

var mask = require('./mask');
var ribbons = require('./ribbons');
var crystals = require('./crystals');
var camera = require('./camera');


// Get time sig in seconds of specified bar / beat
var barBeat = function(bar, beat) {

	var beats = (bar * 4) + beat;
	return beats * (60/clock.params.bpm);

}

var timeline = [
	{
		time: 25,
		event: mask.params.enterScene
	},
	{
		time: barBeat(20, 0),
		event: crystals.params.fadeIn
	},
	{
		time: barBeat(24, 0),
		event: mask.params.defaultPos
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
	},
	{
		time: barBeat(40, 0),
		event: ribbons.params.startRibbons
	},
	{
		time: barBeat(40, 0),
		event: crystals.params.startSpeedFlux
	},
	{
		time: barBeat(40, 0),
		event: function() {
			mask.params.startDancing(10)
		}
	},
	{
		time: barBeat(56, 0),
		event: function() {
			mask.params.startDancing(2)
		}
	},
	{
		time: barBeat(56, 0),
		event: function() {
			ribbons.params.stopRibbons()
		}
	}
]



var checkChannels = function(time) {

	// EVENTS
	while (timeline[timelineIndex] && time >= timeline[timelineIndex].time) {
		
		timeline[timelineIndex].event();
		timelineIndex++;
	}


	// MIDI
	while (time >= cowbell[cowbellIndex] * clock.params.spp) {
		//camera.params.startOrbit();
		cowbellIndex++;
	}
}

var run = function() {
	now = audioAnalyser.getTime();

	checkChannels(now);
}

module.exports = {
	run: run
}