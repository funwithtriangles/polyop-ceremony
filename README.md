# Polyop - Ceremony
Interactive music video for "Polyop - Ceremony". Built with [three.js](https://github.com/mrdoob/three.js/) and WebVR controls. 
See it in action at [polyop.uk/ceremony](http://polyop.uk/ceremony).

## How to work this repository

Make sure you have installed [node](https://nodejs.org/en/download/). After cloning or downloading the repo, navigate to directory and run:

`npm install`

To build:

`webpack`

To start a server running at http://localhost:8080:

`webpack-dev-server`

You can also minimize JS/CSS/HTML with:

`webpack --minimize` or `webpack-dev-server --minimize`

## Credits

A few things that were very helpful in making this:

* [three.js](https://github.com/mrdoob/three.js/)
* [tween.js](https://github.com/tweenjs/tween.js/)
* [WebVR Polyfill](https://github.com/googlevr/webvr-polyfill)
* [webpack](https://github.com/webpack/webpack)
* [Thibaut Despoulain](http://bkcore.com/blog/3d/webgl-three-js-volumetric-light-godrays.html) - And his blog post on WebGL volumetric light
* [Foolproof](http://www.foolproof.co.uk/) - For use of their incredibly extensive open device lab
