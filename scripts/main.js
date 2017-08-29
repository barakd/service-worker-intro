if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}


function requestRoomService() {
  const $loader = $('#loader-room-service');
  const data = $('#room-service-details').serializeArray();
  $loader.show();
  fetch('http://localhost:3000/room-service/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data
  })
    .then(() => {
      {
        $loader.hide();
        $('#roomServiceModal').modal('hide');
        $('#booking-sucess-modal').modal('show');
      }
    });
}