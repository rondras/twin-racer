window.addEventListener('deviceorientation', handleOrientation, true);

function requestPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        })
        .catch(console.error);
    } else {
      // Non-iOS devices or iOS 12 and earlier
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  }
  
  // Call this function in response to a user interaction, e.g., a button click
  document.getElementById('startGameButton').addEventListener('click', requestPermission);
  

function handleOrientation(event) {
var tiltLR = event.gamma || 0;  // Left-to-right tilt in degrees [-90, 90]
var tiltFB = event.beta || 0;   // Front-to-back tilt in degrees [-180, 180]

// Left/Right control
if (tiltLR > 10) {          // Tilted to the right
    keyRight = true;
    keyLeft = false;
} else if (tiltLR < -10) {  // Tilted to the left
    keyLeft = true;
    keyRight = false;
} else {
    keyLeft = false;
    keyRight = false;
}

// Accelerate/Brake control
if (tiltFB > 10) {          // Tilted forward
    keyFaster = true;
    keySlower = false;
} else if (tiltFB < -10) {  // Tilted backward
    keySlower = true;
    keyFaster = false;
} else {
    keyFaster = false;
    keySlower = false;
}
}
  
