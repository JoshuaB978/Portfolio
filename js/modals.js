(function () {
  'use strict';

  var active = null;
  var opener = null;

  function open(modal, trigger) {
    active = modal;
    opener = trigger;
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
    var close = modal.querySelector('[data-close]');
    if (close) close.focus();
  }

  function close() {
    if (!active) return;
    active.classList.remove('active');
    document.body.classList.remove('no-scroll');
    if (opener) opener.focus();
    active = null;
    opener = null;
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal]');
    if (trigger) {
      var modal = document.getElementById(trigger.getAttribute('data-modal'));
      if (modal) open(modal, trigger);
      return;
    }
    // Close button, or a click on the dimmed backdrop itself
    if (e.target.closest('[data-close]') || e.target === active) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
