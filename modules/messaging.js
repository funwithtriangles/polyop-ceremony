var elHint = document.querySelector('.hint-container');
var elSell = document.querySelector('.sell-container');
var elIntro = document.querySelector('.intro');
var elStatus = document.querySelector('.status');

var showHint = function() {
	elHint.classList.add('show');
}

var hideHint = function() {
	elHint.classList.remove('show');
}

var initScripts = function() {
	elStatus.innerHTML = "Initialising Scripts";
}

var loadingAudio = function() {

	document.querySelector('.landscape-warning').classList.remove('hide');
	elStatus.innerHTML = "Downloading Audio";
}

var decodingAudio = function() {
	elStatus.innerHTML = "Decoding Audio";
}

var endState = function() {
	elIntro.style.display = 'none';
	elSell.classList.add('show');
}

var ready = function() {
	ga('send', 'event', 'Ceremony', 'loaded');
	document.querySelector('.play').classList.remove('hide');
	document.querySelector('.loading').classList.add('hide');
	document.querySelector('.status').innerHTML = "Ready";
}

module.exports = {
	showHint: showHint,
	hideHint: hideHint,
	endState: endState,
	loadingAudio: loadingAudio,
	decodingAudio: decodingAudio,
	initScripts: initScripts,
	ready: ready
}