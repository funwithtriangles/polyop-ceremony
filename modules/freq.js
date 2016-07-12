// Overwrite properties of one object with another
var extend = function() {
  var extended = {};

  for(key in arguments) {
    var argument = arguments[key];
    for (prop in argument) {
      if (Object.prototype.hasOwnProperty.call(argument, prop)) {
        extended[prop] = argument[prop];
      }
    }
  }

  return extended;
};

Freq = function() {
	this.streams = [];
};

Freq.prototype.createStream = function( source, settings ) {

	var stream = new this.Stream( source, settings );

	this.streams.push( stream );

	return stream;
}

Freq.prototype.Stream = function( source, settings ) {

	this.defaults = {
		bandVals: [
			[ 0, 0.25 ],
			[ 0.25, 0.5 ],
			[ 0.5, 0.75 ],
			[ 0.75, 1]
		],
		smoothing: 0.85
	}

	console.log(settings);

	// Extend the defaults with any settings defined
	this.settings = extend(this.defaults, settings);

	// Create bands array to hold band objs
	this.bands = [];
	

	var context = source.context;

	//create analyser node
	this.analyser = context.createAnalyser();

	//set size of how many bits we analyse on
	this.analyser.fftSize = 1024;

	// Setup frequency array
	this.freqDomain = new Uint8Array( this.analyser.frequencyBinCount );

	this.analyser.smoothingTimeConstant = settings.smoothing;

	//connect to source
	source.connect( this.analyser );

	//pipe to speakers
	this.analyser.connect( context.destination );

	// Create array of band objs
	for ( var i = 0; i < this.settings.bandVals.length; i++ ) {

		var lower = this.settings.bandVals[ i ][ 0 ];
		var upper = this.settings.bandVals[ i ][ 1 ];

		this.bands.push( new Band( lower, upper, this.freqDomain ) );
	}

}

// Update band data (should only happen once per tick)
Freq.prototype.Stream.prototype.update = function() {

	this.analyser.getByteFrequencyData( this.freqDomain );

	// Array that will store the returned data
	this.bandData = [];

	var numBands = this.bands.length;
	

	for ( var i = 0; i < numBands; i++ ) {

		band = this.bands[ i ];

		this.bandData.push( {
			width: band.widthPerc,
			location: band.lowerPerc,
			average: band.getAverage(),
		} );

	}

}

// Band data can then be read by many modules
Freq.prototype.Stream.prototype.read = function() {
	return {
		bands: this.bandData,
		rawFreqs: this.freqDomain
	}
}

// Band data can then be read by many modules
Freq.prototype.Stream.prototype.updateSmoothing = function(value) {
	this.analyser.smoothingTimeConstant = value;
}



Freq.prototype.Stream.prototype.visualiser = function( containerElement ) {

	var stream = this;

	// Create canvas and context
	var canvasElement = document.createElement( 'canvas' );
	var visualContext = canvasElement.getContext( "2d" );
	containerElement.appendChild( canvasElement );

	var WIDTH = containerElement.offsetWidth;
	var HEIGHT = containerElement.offsetHeight;
	canvasElement.width = WIDTH;
	canvasElement.height = HEIGHT;

	var barWidth = WIDTH / this.analyser.frequencyBinCount;

	// Function to draw graph
	var drawGraph = function() {

		var data = stream.read();

		// Create background bars
		for ( var i = 0; i < stream.analyser.frequencyBinCount; i++ ) {

			var value = stream.freqDomain[ i ];
			var percent = value / 256;
			var height = HEIGHT * percent;
			var offset = HEIGHT - height - 1;
			var hue = i / stream.analyser.frequencyBinCount * 360;

			visualContext.fillStyle = 'hsla(' + hue + ', 100%, 50%, 0.5)';
			visualContext.fillRect( i * barWidth, offset, barWidth, height );

		}

		// Create band bars
		for ( var i = 0; i < stream.settings.bandVals.length; i++ ) {

			var bandWidth = data.bands[ i ].width * WIDTH;
			var location = data.bands[ i ].location * WIDTH;
			var height = HEIGHT * data.bands[ i ].average;
			var offset = HEIGHT - height - 1;
			var hue = i / stream.settings.bandVals.length * 360;

			visualContext.fillStyle = 'hsla(' + hue + ', 100%, 50%, 0.5)';
			visualContext.fillRect( location, offset, bandWidth, height );

		}
	}

	// Animation loop
	var draw = function() {

		visualContext.fillStyle = 'black';
		visualContext.fillRect( 0, 0, WIDTH, HEIGHT );

		drawGraph();

		window.requestAnimationFrame( draw );
	}

	// Start loop
	window.requestAnimationFrame( draw );

}

var Band = function( lower, upper, freqDomain ) {

	this.binCount = freqDomain.length;
	this.freqDomain = freqDomain;

	this.lowerPerc = lower;
	this.upperPerc = upper;

	this.calculate();

}

Band.prototype.calculate = function() {

	this.widthPerc = this.upperPerc - this.lowerPerc;
	this.widthFreq = Math.floor( this.binCount * this.widthPerc );
	this.startFreq = Math.floor( this.lowerPerc * this.binCount );

}

// Calculate average value for frequencies inside a band
Band.prototype.getAverage = function() {

	var bandTotal = 0;

	for ( var j = 0; j < this.widthFreq; j++ ) {
		bandTotal += this.freqDomain[ this.startFreq + j ];
	}

	// Return an average of the band
	return (bandTotal / this.widthFreq) / 256;

}

Band.prototype.updatePosition = function( perc ) {

	this.lowerPerc = perc;
	this.upperPerc = perc + this.widthPerc;
	this.calculate();

}

Band.prototype.updateLower = function( perc ) {

	this.lowerPerc = perc;
	this.calculate();

}

Band.prototype.updateUpper = function( perc ) {

	this.upperPerc = perc;
	this.calculate();

}

// Updates width from upper and lower equally (i.e. center aligned)
Band.prototype.updateWidth = function( perc ) {

	var centerPerc = this.lowerPerc + ( this.widthPerc / 2 );

	this.lowerPerch = centerPerc - ( perc / 2 );
	this.upperPerc = centerPerc + ( perc / 2 );

	this.calculate();

}

module.exports = Freq;