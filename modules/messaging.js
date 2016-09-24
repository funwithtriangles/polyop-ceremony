var elHint = document.querySelector('.hint-container');
var elSell = document.querySelector('.sell-container');
var elIntro = document.querySelector('.intro');

var showHint = function() {
	elHint.classList.add('show');
}

var hideHint = function() {
	elHint.classList.remove('show');
}

var endState = function() {
	elIntro.style.display = 'none';
	elSell.classList.add('show');
}

module.exports = {
	showHint: showHint,
	hideHint: hideHint,
	endState: endState
}