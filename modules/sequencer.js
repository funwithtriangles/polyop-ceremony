var audioAnalyser = require('./audioAnalyser');
var clock = require('./clock');
var TWEEN = require('tween.js');

var cowbellData = require('../assets/cowbell.json');
var flutesData = require('../assets/flutes.json');
var manData = require('../assets/man.json');
var bongosData = require('../assets/bongos.json');

var timelineIndex = 0;

var cowbellCamera = true;
var cowbellRibbons = false;
var congosSpin = true;
var manLeaves = true;

var mask = require('./mask');
var ribbons = require('./ribbons');
var crystals = require('./crystals');
var leaves = require('./leaves');
var background = require('./background');
var lines = require('./lines');
var vLight = require('./vLight');
var camera = require('./camera');
var titles = require('./titles');

var now;

// Get time sig in seconds of specified bar / beat
var barBeat = function(bar, beat) {

	var beats = (bar * 4) + beat;
	return beats * (60/clock.params.bpm);

}

var timeline = [
	{
		time: 8.5,
		event: titles.nudibranch.enter
	},
	{
		time: 15,
		event: titles.nudibranch.exit
	},
	{
		time: 20,
		event: titles.polyop.enter
	},
	{
		time: 25,
		event: function() {
			titles.polyop.exitFancy();
			mask.params.enterScene();
		}
	},
	{
		time: barBeat(20, 0),
		event: crystals.params.fadeIn
	},
	{
		time: barBeat(24, 0),
		event: function() {
			mask.params.defaultPos();
			camera.params.startOrbit();

		}
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
		event: function(skip) {
			crystals.params.changeSpeed(skip, 0.16);
			crystals.params.startSpeedFlux();
			camera.params.stopOrbit();
			mask.params.startDancing(skip, 10)
			leaves.params.speed = -0.2;
			leaves.params.groupRotZ = 0.04;
			background.params.scale = 4.0;
		}
	},
	{
		time: barBeat(44, 0),
		event: function() {
			leaves.params.active = false;
		}
	},
	{
		time: barBeat(48, 0),
		event: function(skip) {
			crystals.params.fadeOut(skip);
			ribbons.params.startRibbons();
		}
	},
	{
		time: barBeat(56, 0),
		event: function(skip) {
			leaves.params.active = true;
			mask.params.startDancing(skip, 2);
			ribbons.params.stopRibbons();
			ribbons.params.opacity = 0;
			manLeaves = false;
			congosSpin = false;
		}
	},
	{
		time: barBeat(64, 0),
		event: function() {
			cowbellCamera = false;
			cowbellRibbons = true;
			camera.params.stopOrbit();
			leaves.params.gotoCircle();
			ribbons.params.startRibbons();
			leaves.params.groupRotZ = 0.08;
			leaves.params.speed = -0.4;

		}
	},
	{
		time: barBeat(68, 0),
		event: function() {
			leaves.params.gotoCircle()
		}
	},
	{
		time: barBeat(69, 0),
		event: function() {
			manLeaves = true;
		}
	},
	{
		time: barBeat(72, 0),
		event: function() {
			leaves.params.gotoCircle()
			
		}
	},
	{
		time: barBeat(76, 0),
		event: function() {
			leaves.params.gotoCircle()
		}
	},
	{
		time: barBeat(80, 0),
		event: function(skip) {
			mask.params.startRumble(skip);
			leaves.params.slowDown();
			vLight.params.fadeIn(skip);
			leaves.params.gotoCircle(15000, TWEEN.Easing.Quadratic.InOut);
			leaves.params.particleRot = 0;
		}
	},
	{
		time: barBeat(95, 3),
		event: function(skip) {
			manLeaves = false;
			leaves.params.opacity = 0;
		}
	},
	{
		time: barBeat(96, 0),
		event: function(skip) {
			mask.params.explode(skip);
		}
	},
	{
		time: barBeat(96, 0),
		event: function(skip) {
			mask.params.explode(skip);
			manLeaves = false;
			leaves.params.opacity = 0;
		}
	},
	{
		time: barBeat(127, 2),
		event: function(skip) {
			mask.params.implode(skip);
		}
	},
]



var checkTimeline = function(time) {

	// EVENTS
	while (timeline[timelineIndex] && time >= timeline[timelineIndex].time) {

		// Skip event if user has skipped ahead and there 
		// is more than one event queued up
		if (timeline[timelineIndex+1] && time >= timeline[timelineIndex+1].time) {
			timeline[timelineIndex].event(true);
		} else {
			timeline[timelineIndex].event();
		}
		
		timelineIndex++;
	}


}

var MidiPart = function(data, callback) {

	var index = 0;

	this.check = function(time) {

		while (time >= data[index] * clock.params.spp) {

			// Only fire if there isn't another event queued up ahead
			if (data[index+1] && time <= data[index+1] * clock.params.spp) {

				callback();

			}
			
			index++;

		}
	
	}

}

var cowbellPart = new MidiPart(cowbellData, function() {

	if (cowbellCamera) {
		camera.params.startOrbit();
	}

	if (cowbellRibbons) {
		ribbons.params.randomFlash();
	}

})

var flutesPart = new MidiPart(flutesData, function() {

	lines.params.randomFlash();

})

var manPart = new MidiPart(manData, function() {

	crystals.params.pulseScale();

	if (manLeaves) {
		leaves.params.allFade();
	}
	
	//crystals.params.toggleVisible();

})

var bongosPart = new MidiPart(bongosData, function() {

	if (congosSpin) {
		mask.params.spin();
	}

})



var run = function() {
	now = audioAnalyser.getTime();

	checkTimeline(now);
	cowbellPart.check(now);
	flutesPart.check(now);
	manPart.check(now);
	bongosPart.check(now);

}

module.exports = {
	run: run
}