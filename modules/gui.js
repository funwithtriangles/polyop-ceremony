var dat = require('dat-gui');
var gui = new dat.GUI();
gui.close();

// Should require all modules and have gui controls externally here
// rather than inline for each module
// Need to implement in one go otherwise it breaks

// TRIBE
// var tribe = require('./tribe');
// var tribeFolder = gui.addFolder('Tribe');

// tribeFolder.add(tribe.params, 'enterMasks').name('Enter Masks');


module.exports = gui;
