var elHint = document.querySelector('.hint');

var showHint = function() {
	elHint.classList.add('show');
}

var hideHint = function() {
	elHint.classList.remove('show');
}

module.exports = {
	showHint: showHint,
	hideHint: hideHint
}