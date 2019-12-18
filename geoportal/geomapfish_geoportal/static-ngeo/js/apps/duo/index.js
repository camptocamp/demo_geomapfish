import Duo from './Duo-Web-v2.js';

export function initialize(sig_request) {
  Duo.init({
    host: 'api-bfaf61bb.duosecurity.com',
    sig_request: sig_request,
    submit_callback: submitPostAction
  });
}

function submitPostAction(duo) {
  const request = fetch('/duoweb/post_action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sig_response: duo.sig_response.value
    })
  });
  request.then(response => {
    if (response.ok) {
      window.location.reload();
    }
  });
}
