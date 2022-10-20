// get visitor's location
function getLocation(showPosition: PositionCallback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}

// watch visitor's location
function watchLocation(showPosition: PositionCallback) {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition, handleError);
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}

const handleError: PositionErrorCallback = (error) => {
  let errorStr;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorStr = 'User denied the request for Geolocation.';
      break;
    case error.POSITION_UNAVAILABLE:
      errorStr = 'Location information is unavailable.';
      break;
    case error.TIMEOUT:
      errorStr = 'The request to get user location timed out.';
      break;
    default:
      errorStr = 'An unknown error occurred.';
  }
  console.error('Error occurred: ' + errorStr);
  alert('Error occurred: ' + errorStr);
};

// const showPosition: PositionCallback = (position) => {
//   console.log(
//     `Latitude: ${position.coords.latitude}, longitude: ${position.coords.longitude}`,
//   );
// };

export { getLocation, watchLocation };
