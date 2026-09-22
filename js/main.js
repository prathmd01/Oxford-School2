(() => {
  const galleryMap = {
    "campus-buses": {
      src: "assets/campus-buses.jpg",
      alt: "Oxford English School building with school buses parked in front of the campus.",
    },
    assembly: {
      src: "assets/assembly.jpg",
      alt: "Students gathered for morning assembly on the school campus.",
    },
    "founder-portrait": {
      src: "assets/founder-portrait.jpg",
      alt: "Portrait of Late Honorable Mr. Shivanand Sambhajirao Kadam, founder and dean of Oxford English Medium School.",
    },
    "founder-message": {
      src: "assets/founder-message.jpg",
      alt: "Original founder’s message from Late Honorable Mr. Shivanand Sambhajirao Kadam, Founder and Dean of O.E.M. School.",
    },
    logo: {
      src: "assets/logo-mark.jpg",
      alt: "Oxford English Medium School official logo: in pursuit of excellence, since 2000.",
    },
    "award-golden-school": {
      src: "assets/award-golden-school.jpg",
      alt: "Golden School at State Level 2019–20 plaque presented to Oxford English School, Bhokar by Indian Talent Olympiad Group.",
    },
    "trophy-wall-1": {
      src: "assets/trophy-wall-1.jpg",
      alt: "Recognition displayed in the school's achievement collection.",
    },
    "trophy-wall-2": {
      src: "assets/trophy-wall-2.jpg",
      alt: "Trophy cabinet with plaques, trophies and certificates at Oxford English School.",
    },
    "trophy-wall-3": {
      src: "assets/trophy-wall-3.jpg",
      alt: "Wide view of Oxford English School trophy cabinets.",
    },
    "trophies-table": {
      src: "assets/trophies-table.jpg",
      alt: "Trophies and medals displayed at a school celebration.",
    },
    "faculty-event": {
      src: "assets/faculty-event.jpg",
      alt: "Faculty and leadership at an official school event.",
    },
    director: {
      src: "assets/director.jpg",
      alt: "Director Smt. Archana Shivanand Kadam at a school event.",
    },
    principal: {
      src: "assets/principal.jpg",
      alt: "Principal Bhausaheb Dandekar addressing a school gathering.",
    },
  };

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxViewport = document.getElementById("lightbox-viewport");
  const zoomInBtn = document.getElementById("lightbox-zoom-in");
  const zoomOutBtn = document.getElementById("lightbox-zoom-out");
  const zoomResetBtn = document.getElementById("lightbox-zoom-reset");

  const siteHeader = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.getElementById("primary-menu");
  const backToTop = document.querySelector(".back-to-top");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let items = [];
  let index = 0;
  let lastFocus = null;

  // Zoom and Pan state for Lightbox
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let startX = 0;
  let startY = 0;

  const updateZoomTransform = () => {
    if (!lightboxImage) return;
    lightboxImage.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
    if (lightboxViewport) {
      lightboxViewport.classList.toggle("is-zoomed", zoomLevel > 1);
    }
    if (zoomResetBtn) {
      zoomResetBtn.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
  };

  const resetZoom = () => {
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    updateZoomTransform();
  };

  const zoomIn = () => {
    if (zoomLevel < 3) {
      zoomLevel = Math.min(3, +(zoomLevel + 0.35).toFixed(2));
      updateZoomTransform();
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 1) {
      zoomLevel = Math.max(1, +(zoomLevel - 0.35).toFixed(2));
      if (zoomLevel === 1) {
        panX = 0;
        panY = 0;
      }
      updateZoomTransform();
    }
  };

  if (zoomInBtn) zoomInBtn.addEventListener("click", zoomIn);
  if (zoomOutBtn) zoomOutBtn.addEventListener("click", zoomOut);
  if (zoomResetBtn) zoomResetBtn.addEventListener("click", resetZoom);

  if (lightboxViewport) {
    lightboxViewport.addEventListener("mousedown", (e) => {
      if (zoomLevel <= 1) return;
      isPanning = true;
      startX = e.clientX - panX * zoomLevel;
      startY = e.clientY - panY * zoomLevel;
      lightboxViewport.classList.add("is-panning");
    });

    window.addEventListener("mousemove", (e) => {
      if (!isPanning || zoomLevel <= 1) return;
      panX = (e.clientX - startX) / zoomLevel;
      panY = (e.clientY - startY) / zoomLevel;
      updateZoomTransform();
    });

    window.addEventListener("mouseup", () => {
      if (isPanning) {
        isPanning = false;
        lightboxViewport.classList.remove("is-panning");
      }
    });

    lightboxViewport.addEventListener("touchstart", (e) => {
      if (zoomLevel <= 1 || e.touches.length !== 1) return;
      isPanning = true;
      startX = e.touches[0].clientX - panX * zoomLevel;
      startY = e.touches[0].clientY - panY * zoomLevel;
    }, { passive: true });

    lightboxViewport.addEventListener("touchmove", (e) => {
      if (!isPanning || zoomLevel <= 1 || e.touches.length !== 1) return;
      panX = (e.touches[0].clientX - startX) / zoomLevel;
      panY = (e.touches[0].clientY - startY) / zoomLevel;
      updateZoomTransform();
    }, { passive: true });

    lightboxViewport.addEventListener("touchend", () => {
      isPanning = false;
    });

    lightboxViewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    }, { passive: false });
  }

  const collectItems = () => {
    items = Array.from(document.querySelectorAll("[data-lightbox]")).map((el) => {
      const key = el.getAttribute("data-lightbox");
      const mapped = galleryMap[key] || {};
      return {
        el,
        key,
        src: mapped.src || el.querySelector("img")?.src,
        alt: mapped.alt || el.querySelector("img")?.alt || "",
        caption: el.getAttribute("data-caption") || mapped.alt || "",
      };
    });
  };

  const openLightbox = (i) => {
    collectItems();
    index = i;
    lastFocus = document.activeElement;
    resetZoom();
    renderLightbox();
    lightbox.hidden = false;
    document.body.classList.add("is-locked");
    backToTop.classList.remove("is-visible");
    const closeBtn = lightbox.querySelector(".lightbox__close");
    if (closeBtn) closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    resetZoom();
    document.body.classList.remove("is-locked");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  const renderLightbox = () => {
    const item = items[index];
    if (!item) return;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = item.caption;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} / ${items.length}`;
    }
    const isDoc = item.key === "founder-message";
    lightboxImage.style.maxWidth = isDoc ? "min(96vw, 980px)" : "min(92vw, 1100px)";
  };

  const next = () => {
    resetZoom();
    index = (index + 1) % items.length;
    renderLightbox();
  };

  const prev = () => {
    resetZoom();
    index = (index - 1 + items.length) % items.length;
    renderLightbox();
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox]");
    if (trigger) {
      collectItems();
      const i = items.findIndex((item) => item.el === trigger);
      openLightbox(i >= 0 ? i : 0);
    }
    if (event.target.closest("[data-close]")) closeLightbox();
    if (event.target.closest(".lightbox__next")) next();
    if (event.target.closest(".lightbox__prev")) prev();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) closeMenu();
      return;
    }
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
    if (event.key === "+" || event.key === "=") zoomIn();
    if (event.key === "-") zoomOut();
    if (event.key === "0") resetZoom();
    if (event.key === "Tab") trapFocus(event);
  });

  const trapFocus = (event) => {
    const focusable = lightbox.querySelectorAll("button:not([disabled])");
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  };

  const closeMenu = () => {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const onScroll = () => {
    const isScrolled = window.scrollY > 30;
    if (siteHeader) siteHeader.classList.toggle("is-scrolled", isScrolled);
    if (nav) nav.classList.toggle("is-scrolled", isScrolled);
    backToTop.classList.toggle("is-visible", window.scrollY > 500);

    const sections = document.querySelectorAll("main section[id]");
    let current = "";
    if (window.scrollY < 240) {
      current = "top";
    } else {
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 180) {
          current = section.id;
        }
      });
    }

    document.querySelectorAll(".nav__links a").forEach((link) => {
      const target = link.getAttribute("href");
      const match = target === `#${current}` || (current === "top" && target === "#top");
      if (match) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  const galleryItems = document.querySelectorAll(".masonry__item");
  const filters = document.querySelectorAll(".filters button");

  const applyFilter = (value) => {
    galleryItems.forEach((item) => {
      const cats = item.dataset.category || "";
      const show = value === "all" || cats.split(" ").includes(value);
      item.classList.toggle("is-visible", show);
      item.hidden = !show;
    });
  };

  applyFilter("all");

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((btn) => {
        btn.classList.toggle("is-active", btn === button);
        btn.setAttribute("aria-selected", btn === button ? "true" : "false");
      });
      applyFilter(button.dataset.filter);
    });
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 60}ms`;
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }
})();
