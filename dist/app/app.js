$.fn.mobileMenuToggle = function (options) {
    const settings = $.extend(
      {
        menu: ".menuItems",
        activeClass: "open",
        speed: 300,
      },
      options
    );

    return this.each(function () {
      const $toggleBtn = $(this);
      const $menu = $(settings.menu);

      $toggleBtn.on("click", function () {
        if ($menu.hasClass("hidden")) {
          $menu
            .removeClass("hidden")
            .hide()
            .slideDown(settings.speed)
            .addClass(settings.activeClass);
        } else {
          $menu.slideUp(settings.speed, function () {
            $menu.addClass("hidden").removeClass(settings.activeClass);
          });
        }
      });
    });
  };


  $.fn.videoSectionControl = function (options) {
    const settings = $.extend(
      {
        videoSelector: "video",
        playBtnSelector: ".playBtn",
        threshold: 0.5,
      },
      options
    );

    return this.each(function () {
      const $section = $(this);
      const $video = $section.find(settings.videoSelector)[0];
      const $playBtn = $section.find(settings.playBtnSelector);

      if (!$video) return;

      // ▶ Toggle Play / Pause on button click
      $playBtn.on("click", function (e) {
        e.stopPropagation();

        if ($video.paused) {
          $video.play();
          $playBtn.fadeOut(200);
        } else {
          $video.pause();
          $playBtn.fadeIn(200);
        }
      });

      // 🛑 Pause when clicking outside section
      $(document).on("click", function (e) {
        if (!$(e.target).closest($section).length) {
          if (!$video.paused) {
            $video.pause();
            $playBtn.fadeIn(200);
          }
        }
      });

      // 👀 Auto pause when section not visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && !$video.paused) {
              $video.pause();
              $playBtn.fadeIn(200);
            }
          });
        },
        { threshold: settings.threshold }
      );

      observer.observe($section[0]);
    });
  };


  // =====================================
// Universal Dynamic Swiper
// =====================================
$.fn.dynamicSwiper = function () {

  return this.each(function () {

      const el = this;
      const $el = $(el);

      // ----------------------------
      // HARD SAFETY CHECKS
      // ----------------------------

      if (!el) return;
      if (!el.classList.contains('swiper')) return;
      if (!el.querySelector('.swiper-wrapper')) return;
      if (el.swiper) return; // prevent double init

      // ----------------------------
      // Helpers
      // ----------------------------

      const getData = (key, fallback) => {
          const val = $el.data(key);
          return val !== undefined ? val : fallback;
      };

      const num = (v, f) => {
          const n = parseFloat(v);
          return isNaN(n) ? f : n;
      };

      const bool = (v, f) => {
          if (v === undefined) return f;
          if (typeof v === "boolean") return v;
          return ["true", "1"].includes(String(v).toLowerCase());
      };

      // ----------------------------
      // Base Config
      // ----------------------------

      const swiperId = getData("swiper-id", null);

      const base = {
          slidesPerView: num(getData("items", 1), 1),
          loop: bool(getData("loop", false), false),
          centeredSlides: bool(getData("center", false), false),
          spaceBetween: num(getData("space", 0), 0),
          speed: num(getData("speed", 600), 600),
          breakpoints: {
              0: {
                  slidesPerView: num(getData("items-mobile", 1), 1)
              },
              768: {
                  slidesPerView: num(getData("items-tab", 1), 1)
              },
              1024: {
                  slidesPerView: num(getData("items-desktop", 1), 1)
              }
          }
      };

      // ----------------------------
      // AUTOPLAY
      // ----------------------------

      if (bool(getData("autoplay", false), false)) {
          base.autoplay = {
              delay: num(getData("autoplay-timeout", 4000), 4000),
              pauseOnMouseEnter: bool(getData("autoplay-hover-pause", true), true),
              disableOnInteraction: false
          };
      }

      // ----------------------------
      // NAVIGATION
      // ----------------------------

      const hasNav = bool(getData("nav", false), false);

      if (hasNav) {

          let nextEl = null;
          let prevEl = null;

          if (swiperId) {
              nextEl = document.querySelector(`.swiper-button-next[data-nav-id="${swiperId}"]`);
              prevEl = document.querySelector(`.swiper-button-prev[data-nav-id="${swiperId}"]`);
          } else {
              nextEl = $el.find(".swiper-button-next")[0] || null;
              prevEl = $el.find(".swiper-button-prev")[0] || null;
          }

          if (nextEl instanceof Element && prevEl instanceof Element) {

              base.navigation = {
                  nextEl,
                  prevEl,
              };

              const prevImg = getData("nav-img-prev", null);
              const nextImg = getData("nav-img-next", null);

              if (prevImg) prevEl.innerHTML = `<img src="${prevImg}" alt="Prev">`;
              if (nextImg) nextEl.innerHTML = `<img src="${nextImg}" alt="Next">`;
          }
      }

      // ----------------------------
      // RESPONSIVE PAGINATION
      // ----------------------------

      const dotsDefault = bool(getData("dots", false), false);
      const dotsMobile = bool(getData("dots-mobile", dotsDefault), dotsDefault);
      const dotsTab = bool(getData("dots-tab", dotsDefault), dotsDefault);
      const dotsDesktop = bool(getData("dots-desktop", dotsDefault), dotsDefault);

      let paginationEl = null;

      if (swiperId) {
          paginationEl = document.querySelector(
              `.swiper-pagination[data-pagination-id="${swiperId}"]`
          );
      } else {
          paginationEl = $el.find(".swiper-pagination")[0] || null;
      }

      if (paginationEl instanceof Element) {

          // Enable globally if any breakpoint needs it
          if (dotsMobile || dotsTab || dotsDesktop) {
              base.pagination = {
                  el: paginationEl,
                  clickable: true,
                  dynamicBullets: true
              };
          }

          // Apply responsive control
          base.breakpoints[0].pagination =
              dotsMobile ? { el: paginationEl, clickable: true, dynamicBullets: true } : false;

          base.breakpoints[768].pagination =
              dotsTab ? { el: paginationEl, clickable: true, dynamicBullets: true } : false;

          base.breakpoints[1024].pagination =
              dotsDesktop ? { el: paginationEl, clickable: true, dynamicBullets: true } : false;
      }

      // ----------------------------
      // INIT SWIPER
      // ----------------------------

      try {

          const swiper = new Swiper(el, base);

          swiper.on('slideChangeTransitionEnd', () => {
              document.dispatchEvent(new Event('swiperSlideChange'));
          });

      } catch (err) {
          console.warn("Swiper init failed:", err, el);
      }

  });

};



// =====================================
// Optimized Layout (Grid/Flex) → Swiper
// =====================================
class LayoutSwiperAdapter {

  constructor({
      selector = '.swiper-grid, .swiper-flex',
      breakpoint = 1024
  } = {}) {

      this.selector   = selector;
      this.breakpoint = breakpoint;
      this.isMobile   = window.innerWidth < this.breakpoint;

      this.handleResize = this.debounce(this.onResize.bind(this), 200);

      this.update();
      window.addEventListener('resize', this.handleResize);
  }

  // ---------------------------------
  // Resize Handler (optimized)
  // ---------------------------------
  onResize() {

      const newState = window.innerWidth < this.breakpoint;

      // Only run if state actually changes
      if (newState === this.isMobile) return;

      this.isMobile = newState;
      this.update();
  }

  // ---------------------------------
  // Update All
  // ---------------------------------
  update() {
      document.querySelectorAll(this.selector).forEach(el => {
          this.toggle(el);
      });
  }

  // ---------------------------------
  // Toggle
  // ---------------------------------
  toggle(el) {

      const isActive = el.dataset.layoutSwiper === 'true';

      switch (true) {

          case (this.isMobile && !isActive):
              this.enable(el);
              break;

          case (!this.isMobile && isActive):
              this.disable(el);
              break;
      }
  }

  // =====================================
  // ENABLE
  // =====================================
  enable(el) {

      if (!el.dataset.originalHtml) {
          el.dataset.originalHtml  = el.innerHTML;
          el.dataset.originalClass = el.className;
      }

      // Remove layout utility classes
      el.className = el.className.replace(
          /\b(grid\S*|flex\S*|gap\S*|items-\S+|justify-\S+|content-\S+|place-\S+|mt-\S+|col-span-\S+|basis-\S+|md:\S+|lg:\S+)\b/g,
          ''
      ).trim();

      el.classList.add('swiper');

      const children = Array.from(el.children)
          .filter(child => !child.classList.contains('swiper-pagination'));

      const wrapper = document.createElement('div');
      wrapper.className = 'swiper-wrapper';

      children.forEach(child => {
          child.classList.add('swiper-slide');
          wrapper.appendChild(child);
      });

      el.prepend(wrapper);

      // Let dynamicSwiper read ALL data attributes
      $(el).dynamicSwiper();

      el.dataset.layoutSwiper = 'true';
  }

  // =====================================
  // DISABLE
  // =====================================
  disable(el) {

      const instance = el.swiper;

      if (instance) {
          instance.destroy(true, true);
      }

      el.innerHTML = el.dataset.originalHtml;
      el.className = el.dataset.originalClass;

      el.classList.remove('swiper', 'swiper-initialized', 'swiper-horizontal');
      el.dataset.layoutSwiper = 'false';
  }

  // ---------------------------------
  // Debounce (memory safe)
  // ---------------------------------
  debounce(fn, delay) {
      let t;
      return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn(...args), delay);
      };
  }
}



  $(document).ready(function () {
    $(".menuToggle").mobileMenuToggle({
      menu: ".menuItems",
      speed: 300
    });

    $(".js-swiper").dynamicSwiper();
    new LayoutSwiperAdapter();


    $(".videoSection").videoSectionControl({
        threshold: 0.5
      });
  });