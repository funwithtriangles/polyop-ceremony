var audioContext, analyser, source, freqs;
var levelsData = [];
var levelsCount = 4;

var gotStream = function( stream ) {

	audioContext = new( window.AudioContext || window.webkitAudioContext );

	analyser = audioContext.createAnalyser();
	source = audioContext.createMediaStreamSource( stream );
	freqs = new Uint8Array( analyser.frequencyBinCount );

	source.connect( analyser );

	levelBins = Math.floor( ( analyser.frequencyBinCount - 500 ) / levelsCount ); //number of bins in each level

	analyser.fftSize = 1024;

}

var updateLevels = function() {

	analyser.smoothingTimeConstant = 0.9;

	// Get the frequency data from the currently playing music
	analyser.getByteFrequencyData( freqs );

	for ( var i = 0; i < levelsCount; i++ ) {

		var sum = 0;

		for ( var j = 0; j < levelBins; j++ ) {

			sum += freqs[ ( i * levelBins ) + j ];
		
			levelsData[ i ] = ( sum / levelBins ) / 256; // Convert to val between 0 and 1;

		}
	}

}

var getLevels = function() {
	return levelsData;
}

module.exports = {
	gotStream: gotStream,
	getLevels: getLevels,
	updateLevels: updateLevels
}