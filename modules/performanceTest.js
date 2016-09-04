var composers = require('./composers')
var threeEnv = require('./threeEnv');
var mask = require('./mask');
var sample = new Array();
var sampleSize = 64;
var sum;
var average;
var fpsThreshold = 40;
var screenAreaLimit = 1500000;
var adjustTime = 3000; // How long to let FPS adjust before checking agaiin
var lastChange = 0;
var changed = false;
var quality = 0;

var check = function(timePassed, fps) {

	sample.unshift(fps);

	if (sample.length > sampleSize) {
		
		sample.pop();

		if (timePassed > lastChange + adjustTime) {


			if (average < fpsThreshold) {
				// If screen is large, reduce render size
				if (threeEnv.box.area > screenAreaLimit) {
					composers.changeQuality(2);
					changed = true;
				}

				if (!changed && quality < 1) {

					switch (quality) {
						case 0:
							mask.params.cubeCamera = false;
							break;
					}

					quality++;
					changed = true; 

				}
			}

		}


	}

	sum = 0;

	for (var i = 0; i < sample.length; i++) {
		sum += sample[i];
	}

	average = sum/sample.length;

	if (changed) {
		lastChange = Date.now();
		changed = false;
	}

	
	

}

module.exports = {
	check: check
}