/* My-O-Staff Pty Ltd — interactions
   Scroll-reveal, count-up numbers, case-study slideshow, mobile nav. */

(function () {
  'use strict';

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', function () {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target).toLocaleString('en-AU');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counted = new WeakSet();
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !counted.has(entry.target)) {
        counted.add(entry.target);
        countUp(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.count-up').forEach(function (el) {
    countObserver.observe(el);
  });

  /* ---------- Scroll-reveal ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Case-study slideshow ---------- */
  var slideshow = document.getElementById('caseSlideshow');
  if (slideshow) {
    var slides = slideshow.querySelectorAll('.slide');
    var dotsWrap = document.getElementById('slideDots');
    var current = 0;
    var timer = null;
    var interval = 9000;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('button');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      // Re-trigger count-ups inside the newly shown slide
      slides[current].querySelectorAll('.count-up').forEach(function (el) {
        if (!counted.has(el)) {
          counted.add(el);
          countUp(el);
        }
      });
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, interval);
    }

    document.getElementById('prevSlide').addEventListener('click', function () { goTo(current - 1); restart(); });
    document.getElementById('nextSlide').addEventListener('click', function () { goTo(current + 1); restart(); });

    goTo(0);
    restart();
  }
})();
