var composers = require('./composers')

var sample = new Array();
var sampleSize = 64;
var sum;
var average;
var fpsThreshold = 30;
var quality = 1; // Higher is worse

var check = function(fps) {

	sample.unshift(fps);

	if (sample.length > sampleSize) {
		sample.pop();

		if (average < fpsThreshold && quality < 3 ) {

			quality++;
			sample = [];
			console.log('quality: '+quality);
			composers.changeQuality(quality);



		}
	}

	sum = 0;

	for (var i = 0; i < sample.length; i++) {
		sum += sample[i];
	}

	average = sum/sample.length;

	
	

}

module.exports = {
	check: check
}