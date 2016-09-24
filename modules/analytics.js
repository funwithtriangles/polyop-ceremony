var fps;
var played = false;

function update(newFps) {
	fps = newFps;
}

function event(name) {

	switch (name) {
		case 'play':
			if (!played) {
				ga('send', 'event', 'Ceremony', 'play');
				played = true;
			}
			break;
		case 'pause':
			ga('send', 'event', 'Ceremony', 'pause');
			break;
		case 'opening':
			ga('send', 'event', 'Ceremony', 'opening', null, fps);
			break;
		case 'ribbons':
			ga('send', 'event', 'Ceremony', 'ribbons', null, fps);
		case 'rumble':
			ga('send', 'event', 'Ceremony', 'rumble', null, fps);
		case 'finished':
			ga('send', 'event', 'Ceremony', 'finished', null, fps);
			break;
	}

}

module.exports = {
	event: event,
	update: update
}
