(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("ano");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    if (mobileNav) {
      mobileNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          header.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- route line draw-in ---------- */
  var route = document.querySelector(".route");
  if (route) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      route.classList.add("in-view");
    } else {
      var routeObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              routeObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      routeObserver.observe(route);
    }
  }

  /* ---------- metric count-up ---------- */
  var metricEls = document.querySelectorAll(".metric-value[data-count-to]");

  function formatNumber(value, decimals) {
    return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  }

  function animateMetric(el) {
    var target = parseFloat(el.getAttribute("data-count-to"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = el.getAttribute("data-count-to").indexOf(".") > -1 ? 1 : 0;

    if (prefersReduced) {
      el.textContent = prefix + formatNumber(target, decimals) + suffix;
      return;
    }

    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;
      el.textContent = prefix + formatNumber(current, decimals) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = prefix + formatNumber(target, decimals) + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  if (metricEls.length) {
    if (!("IntersectionObserver" in window)) {
      metricEls.forEach(animateMetric);
    } else {
      var metricObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateMetric(entry.target);
              metricObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      metricEls.forEach(function (el) { metricObserver.observe(el); });
    }
  }
})();
