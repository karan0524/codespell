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


  $(document).ready(function () {
    $(".menuToggle").mobileMenuToggle({
      menu: ".menuItems",
      speed: 300
    });

    $(".videoSection").videoSectionControl({
        threshold: 0.5
      });
  });