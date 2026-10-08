/* =========================================================
   Siam. — Personal Portfolio  |  script.js (vanilla JS)
   1. Loader   2. Navbar   3. Mobile menu   4. Active link
   5. Scroll reveal   6. Contact form
   ========================================================= */
(function () {
  'use strict';

  // Change this to your real email address. The contact form opens
  // the visitor's mail app addressed to it (no server needed).
  var CONTACT_EMAIL = 'hello@example.com';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. LOADER: types a search query, then fades out ---------- */
  var loader = document.getElementById('loader');
  var loaderText = document.getElementById('loaderText');
  var query = 'siam seo expert';
  var typed = 0;

  function hideLoader() {
    loader.classList.add('is-done');
    document.body.classList.remove('no-scroll');
  }

  if (reduceMotion) {
    hideLoader();
  } else {
    document.body.classList.add('no-scroll');
    var typer = setInterval(function () {
      loaderText.textContent = query.slice(0, ++typed);
      if (typed >= query.length) {
        clearInterval(typer);
        setTimeout(hideLoader, 450);
      }
    }, 55);
    // Safety net: never keep the page hidden for long
    setTimeout(hideLoader, 2500);
  }

  /* ---------- 2. NAVBAR: background after scrolling ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('is-stuck', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. MOBILE MENU ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('navMenu');

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  burger.addEventListener('click', function () {
    setMenu(!menu.classList.contains('is-open'));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) setMenu(false);
  });

  /* ---------- 4. ACTIVE LINK HIGHLIGHT ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function setActive() {
    // The section whose top has passed the line just under the navbar
    var line = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= line) current = s; });
    // Bottom of page → contact
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      current = sections[sections.length - 1];
    }
    links.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('load', setActive);
  setActive();

  /* ---------- 5. SCROLL REVEAL (subtle, once) ---------- */
  var items = document.querySelectorAll('.reveal');

  // Small stagger for siblings inside the same grid
  items.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.classList.contains('reveal');
    });
    el.style.setProperty('--d', (siblings.indexOf(el) % 4) * 0.07 + 's');
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 6. CONTACT FORM ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  function showError(field, msg) {
    var wrap = field.closest('.field');
    wrap.classList.toggle('has-error', !!msg);
    wrap.querySelector('.err').textContent = msg || '';
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;

    if (name.value.trim().length < 2) { showError(name, 'Please enter your name.'); ok = false; } else showError(name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showError(email, 'Please enter a valid email address.'); ok = false; } else showError(email);
    if (message.value.trim().length < 10) { showError(message, 'Please write at least 10 characters.'); ok = false; } else showError(message);
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    if (!validate()) {
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    var subject = 'Portfolio message from ' + form.elements.name.value.trim();
    var body = form.elements.message.value.trim() + '\n\n— ' + form.elements.name.value.trim() + ' (' + form.elements.email.value.trim() + ')';
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    status.textContent = 'Opening your email app with your message ready to send.';
    form.reset();
  });

  // Clear an error as soon as the visitor fixes the field
  form.addEventListener('input', function (e) {
    if (e.target.closest('.has-error')) showError(e.target);
  });
})();
