(function () {
  'use strict';

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reduceMotion) return;

  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  var interactive = 'a, button, [data-modal], [data-close], input, textarea, select, label';

  var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, started = false;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px)';
    if (!started) {
      started = true;
      ringX = mouseX;
      ringY = mouseY;
      document.body.classList.add('has-cursor');
      requestAnimationFrame(follow);
    }
  });

  // The ring eases toward the dot for the trailing effect
  function follow() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px)';
    requestAnimationFrame(follow);
  }

  document.addEventListener('mouseover', function (e) {
    ring.classList.toggle('hover', !!e.target.closest(interactive));
  });
  document.addEventListener('mousedown', function () { ring.classList.add('down'); });
  document.addEventListener('mouseup', function () { ring.classList.remove('down'); });

  // Hide when the pointer leaves the window
  document.documentElement.addEventListener('mouseleave', function () {
    document.body.classList.remove('has-cursor');
    started = false;
  });
})();
