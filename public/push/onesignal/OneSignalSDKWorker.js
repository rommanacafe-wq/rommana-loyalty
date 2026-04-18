self.addEventListener('push', function(event) {
  self.registration.showNotification("TEST WORKING", {
    body: "If you see this, worker is fixed",
  });
});