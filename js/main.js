(function () {
  'use strict';

  history.scrollRestoration = 'manual';

  var body = document.body;
  var preloader = document.getElementById('preloader');
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var toTop = document.getElementById('back-to-top');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('sessYear').textContent = new Date().getFullYear();

  /* Preloader: short boot screen, always cleared by a fallback timer */
  var cleared = false;
  function clearPreloader() {
    if (cleared) return;
    cleared = true;
    window.scrollTo(0, 0);
    preloader.classList.add('done');
    startReveal();
  }
  window.addEventListener('load', function () {
    setTimeout(clearPreloader, reduceMotion ? 0 : 700);
  });
  setTimeout(clearPreloader, 3000);

  /* Mobile menu */
  function setMenu(open) {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    body.classList.toggle('no-scroll', open);
  }
  hamburger.addEventListener('click', function () {
    setMenu(!mobileMenu.classList.contains('open'));
  });
  mobileMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* Scroll-spy: highlight the link for the section crossing the upper viewport */
  var links = document.querySelectorAll('[data-spy]');
  var spyIds = Array.prototype.map.call(
    document.querySelectorAll('.nav-links [data-spy]'),
    function (a) { return a.getAttribute('data-spy'); }
  );
  var sections = spyIds.map(function (id) { return document.getElementById(id); });

  function updateSpy() {
    var current = spyIds[0];
    var line = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(function (s) {
      if (s && s.offsetTop <= line) current = s.id;
    });
    // At page bottom the last (short) section should win
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = spyIds[spyIds.length - 1];
    }
    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-spy') === current);
    });
  }

  /* Back to top */
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateSpy();
      toTop.classList.toggle('show', window.scrollY > 500);
      ticking = false;
    });
  }, { passive: true });
  updateSpy();

  /* Scroll reveal. Items are revealed once the preloader is gone. */
  var revealItems = document.querySelectorAll('.reveal');
  function startReveal() {
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (el) { io.observe(el); });
  }
})();
