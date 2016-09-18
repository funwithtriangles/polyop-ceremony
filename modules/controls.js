var THREE = require('three');
var threeEnv = require('./threeEnv');
var camera = require('./camera');
var audio = require('./audioAnalyser').audio;

var controlMode;

var controlElement = document.body;

var positionObject, innerObject, pointerObject;

var positionObject = new THREE.Object3D();
var innerObject = new THREE.Object3D();

threeEnv.scene.add(positionObject);
positionObject.add(innerObject);

camera.params.positionObject = positionObject;

var params = {
  resetPose: function() {

    positionObject.rotation.x = 0;
    positionObject.rotation.y = 0;
    positionObject.rotation.z = 0;

    if (controlMode == 'VR') {

        controls.resetPose();

    } else {
       
        // Yaw
        innerObject.children[0].rotation.x = 0;
        innerObject.children[0].rotation.y = 0;
        innerObject.children[0].rotation.z = 0;

        // Pitch
        innerObject.children[0].children[0].rotation.x = 0;
        innerObject.children[0].children[0].rotation.y = 0;
        innerObject.children[0].children[0].rotation.z = 0;



        // camera.params.object.children[0].rotation.set(new THREE.Vector3( 0, 0, 0));
        // camera.params.object.children[0].children[0].rotation.set(new THREE.Vector3( 0, 0, 0));

    }
  },
  startOrbit: function() {

    params.resetPose();
    innerObject.rotation.y = Math.PI;
    

  },
  stopOrbit: function() {

    innerObject.rotation.y = 0;

  }
}


// var effect = new THREE.VREffect( threeEnv.renderer );


// var controls = new THREE.DeviceOrientationControls(threeEnv.camera);
//var WebVRManager = require('./webvr-manager');
//var composers = require('./composers');

//var manager = new WebVRManager(threeEnv.renderer, effect);


var mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;


if (mobileAndTabletcheck()) {

  startVRControls();

} else if (havePointerLock) {

  startPointerLockControls();

} else {

  startVRControlsControls();

}


function pointerlockchange( event ) {

  if ( document.pointerLockElement === controlElement || document.mozPointerLockElement === controlElement || document.webkitPointerLockElement === controlElement ) {

    controls.enabled = true;

  } else {

    controls.enabled = false;

  }

};

function pointerlockerror( event ) {

  console.error(event);

};



function startPointerLockControls() {


  controlElement.requestPointerLock = controlElement.requestPointerLock || controlElement.mozRequestPointerLock || controlElement.webkitRequestPointerLock;

  controlMode = 'pointer';

  controls = new THREE.PointerLockControls(threeEnv.camera);

  var pointerObject = controls.getObject();
  // pointerObject.position.z = 500;
  // camera.params.zReset = 0;



  innerObject.add(pointerObject);


 
  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

}


function startVRControls() {

  controlMode = 'VR';
  controls = new THREE.VRControls(threeEnv.camera);

  innerObject.add(threeEnv.camera);

}



function launchIntoFullscreen(element) {
  if(controlElement.requestFullscreen) {
    controlElement.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    controlElement.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    controlElement.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    controlElement.msRequestFullscreen();
  }
}

document.querySelector('.play').addEventListener('click', function() {
  params.resetPose();
	launchIntoFullscreen(threeEnv.renderer.domElement);
	audio.play();
  document.querySelector('.intro').classList.add('hide');


  if (controlMode == 'pointer') {

    controlElement.requestPointerLock();

  }



})

var run = function(timePassed) {

  if (controlMode == 'VR') {
    controls.update();
  }
	
	//manager.render(threeEnv.scene, threeEnv.camera, composers.finalComposer.renderTarget2);

}

var onResize = function(e) {
  // effect.setSize(window.innerWidth, window.innerHeight);
  threeEnv.renderer.setSize( window.innerWidth, window.innerHeight )
  threeEnv.camera.aspect = window.innerWidth / window.innerHeight;
  threeEnv.camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

module.exports = {
	run: run,
  params: params
}