if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      if (!('PushManager' in window)) return;
      askPermession().then(() => subscribeUser(registration));
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}


function askPermession() {
  return new Promise((resolve, reject) => {
    const promiseResult = Notification.requestPermission(result => resolve(result))
    if (promiseResult)
      promiseResult.then(resolve, reject);
  }).then(result => {
    if (result !== 'granted') {
      throw new Error('no permession');
    }
  });
}

function subscribeUser(registration) {
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('BClV-KeO_EQjxTtEibwfs6jCoIitFXo-MX-lyfK5Q2tOch5-cNIEAKcDpHpUaKQGJUwCRIv8bKQIcfqzExRDLfQ'),
  };
  return registration.pushManager.subscribe(subscribeOptions).then(pushSubscription => {
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    fetch('http://localhost:3000/subscribe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushSubscription)
    });
    return pushSubscription;
  })
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

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  ;
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

