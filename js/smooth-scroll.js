// ===== SMOOTH SCROLL NAVIGATION =====

class SmoothScroll {
  constructor() {
    this.navLinks = document.querySelectorAll('a[href^="#"]');
    this.sections = document.querySelectorAll("section[id]");
    this.navHeight = 70; // Height of fixed navigation
    this.scrollOffset = 100; // Additional offset for better positioning
    this.isScrolling = false;
    this.scrollDuration = 800; // Duration in milliseconds

    this.init();
  }

  init() {
    this.bindEvents();
    this.initScrollSpy();
    this.initScrollIndicator();
  }

  // ===== EVENT BINDING =====
  bindEvents() {
    // Smooth scroll for navigation links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");

        if (targetId === "#") return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          this.scrollToSection(targetSection);
          this.updateActiveLink(link);
          this.closeMobileMenu();
        }
      });
    });

    // Handle browser back/forward buttons
    window.addEventListener("popstate", () => {
      const hash = window.location.hash;
      if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
          this.scrollToSection(targetSection, false);
        }
      }
    });

    // Throttled scroll event for performance
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        this.updateScrollSpy();
        this.updateScrollIndicator();
      }, 10);
    });
  }

  // ===== SMOOTH SCROLLING =====
  scrollToSection(targetSection, updateHistory = true) {
    if (this.isScrolling) return;

    this.isScrolling = true;

    const targetPosition =
      targetSection.offsetTop - this.navHeight - this.scrollOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    // Easing function for smooth animation
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / this.scrollDuration, 1);
      const easedProgress = easeInOutCubic(progress);

      const currentPosition = startPosition + distance * easedProgress;
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        this.isScrolling = false;

        // Update URL hash without triggering scroll
        if (updateHistory) {
          const targetId = targetSection.getAttribute("id");
          history.pushState(null, null, `#${targetId}`);
        }
      }
    };

    requestAnimationFrame(animateScroll);
  }

  // ===== SCROLL SPY =====
  initScrollSpy() {
    // Set up intersection observer for scroll spy
    const observerOptions = {
      root: null,
      rootMargin: `-${this.navHeight + this.scrollOffset}px 0px -50% 0px`,
      threshold: 0,
    };

    this.scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute("id");
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (entry.isIntersecting) {
          this.setActiveLink(navLink);
        }
      });
    }, observerOptions);

    // Observe all sections
    this.sections.forEach((section) => {
      this.scrollSpyObserver.observe(section);
    });
  }

  updateScrollSpy() {
    if (this.isScrolling) return;

    const scrollPosition =
      window.pageYOffset + this.navHeight + this.scrollOffset;
    let activeSection = null;

    // Find the current section
    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeSection = section;
      }
    });

    // Update active navigation link
    if (activeSection) {
      const activeId = activeSection.getAttribute("id");
      const activeLink = document.querySelector(`a[href="#${activeId}"]`);
      this.setActiveLink(activeLink);
    }
  }

  setActiveLink(activeLink) {
    // Remove active class from all links
    this.navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to current link
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  updateActiveLink(clickedLink) {
    this.setActiveLink(clickedLink);
  }

  // ===== SCROLL INDICATOR =====
  initScrollIndicator() {
    // Create scroll progress indicator
    const scrollIndicator = document.createElement("div");
    scrollIndicator.className = "scroll-indicator";
    scrollIndicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-neon), var(--secondary-neon));
            z-index: 10001;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px var(--accent-neon);
        `;

    document.body.appendChild(scrollIndicator);
    this.scrollIndicator = scrollIndicator;
  }

  updateScrollIndicator() {
    const scrollTop = window.pageYOffset;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    this.scrollIndicator.style.width = `${Math.min(scrollPercent, 100)}%`;
  }

  // ===== MOBILE MENU =====
  closeMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  }

  // ===== UTILITY METHODS =====
  scrollToTop() {
    this.scrollToSection(document.body);
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  getCurrentSection() {
    const scrollPosition =
      window.pageYOffset + this.navHeight + this.scrollOffset;

    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      if (scrollPosition >= section.offsetTop) {
        return section;
      }
    }

    return this.sections[0];
  }

  // ===== KEYBOARD NAVIGATION =====
  initKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      // Page Up/Down navigation
      if (e.key === "PageUp" || e.key === "PageDown") {
        e.preventDefault();

        const currentSection = this.getCurrentSection();
        const currentIndex = Array.from(this.sections).indexOf(currentSection);

        let targetIndex;
        if (e.key === "PageUp") {
          targetIndex = Math.max(0, currentIndex - 1);
        } else {
          targetIndex = Math.min(this.sections.length - 1, currentIndex + 1);
        }

        const targetSection = this.sections[targetIndex];
        if (targetSection) {
          this.scrollToSection(targetSection);
        }
      }

      // Home/End navigation
      if (e.key === "Home") {
        e.preventDefault();
        this.scrollToSection(this.sections[0]);
      }

      if (e.key === "End") {
        e.preventDefault();
        this.scrollToSection(this.sections[this.sections.length - 1]);
      }
    });
  }

  // ===== SECTION TRANSITIONS =====
  addSectionTransitions() {
    const transitionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            this.triggerSectionAnimations(entry.target);
          } else {
            entry.target.classList.remove("section-visible");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    this.sections.forEach((section) => {
      section.classList.add("section-transition");
      transitionObserver.observe(section);
    });
  }

  triggerSectionAnimations(section) {
    // Trigger specific animations based on section
    const sectionId = section.getAttribute("id");

    switch (sectionId) {
      case "skills":
        this.animateSkillBars(section);
        break;
      case "about":
        this.animateCounters(section);
        break;
      case "projects":
        this.animateProjectCards(section);
        break;
      case "experience":
        this.animateTimeline(section);
        break;
    }
  }

  animateSkillBars(section) {
    const skillBars = section.querySelectorAll(".progress-bar");
    skillBars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.getAttribute("data-width");
        bar.style.width = `${width}%`;
      }, index * 200);
    });
  }

  animateCounters(section) {
    const counters = section.querySelectorAll("[data-count]");
    counters.forEach((counter) => {
      if (!counter.classList.contains("animated")) {
        this.animateCounter(counter);
        counter.classList.add("animated");
      }
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute("data-count"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  animateProjectCards(section) {
    const cards = section.querySelectorAll(".project-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in-up");
      }, index * 150);
    });
  }

  animateTimeline(section) {
    const timelineItems = section.querySelectorAll(".timeline-item");
    timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("animate-slide-in");
      }, index * 300);
    });
  }

  // ===== PERFORMANCE OPTIMIZATION =====
  optimizeScrollPerformance() {
    // Use passive event listeners for better performance
    const passiveOptions = { passive: true };

    window.addEventListener(
      "scroll",
      this.updateScrollSpy.bind(this),
      passiveOptions
    );
    window.addEventListener(
      "scroll",
      this.updateScrollIndicator.bind(this),
      passiveOptions
    );

    // Debounce resize events
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.recalculatePositions();
      }, 250);
    });
  }

  recalculatePositions() {
    // Recalculate section positions after resize
    this.sections = document.querySelectorAll("section[id]");
    this.updateScrollSpy();
  }

  // ===== ACCESSIBILITY =====
  initAccessibility() {
    // Add ARIA labels for screen readers
    this.navLinks.forEach((link) => {
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const sectionTitle = targetSection.querySelector("h1, h2, h3");
        if (sectionTitle) {
          link.setAttribute(
            "aria-label",
            `Navigate to ${sectionTitle.textContent}`
          );
        }
      }
    });

    // Add focus indicators
    this.navLinks.forEach((link) => {
      link.addEventListener("focus", () => {
        link.classList.add("keyboard-focus");
      });

      link.addEventListener("blur", () => {
        link.classList.remove("keyboard-focus");
      });
    });
  }

  // ===== CLEANUP =====
  destroy() {
    // Remove event listeners and observers
    if (this.scrollSpyObserver) {
      this.scrollSpyObserver.disconnect();
    }

    if (this.scrollIndicator && this.scrollIndicator.parentNode) {
      this.scrollIndicator.parentNode.removeChild(this.scrollIndicator);
    }
  }
}

// Initialize smooth scroll when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.smoothScroll = new SmoothScroll();

  // Initialize additional features
  window.smoothScroll.addSectionTransitions();
  window.smoothScroll.initKeyboardNavigation();
  window.smoothScroll.optimizeScrollPerformance();
  window.smoothScroll.initAccessibility();
});

// Handle page unload
window.addEventListener("beforeunload", () => {
  if (window.smoothScroll) {
    window.smoothScroll.destroy();
  }
});
