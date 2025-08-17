// ===== ADVANCED ANIMATIONS JAVASCRIPT =====

// Animation controller class
class AnimationController {
  constructor() {
    this.animations = new Map();
    this.isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    this.init();
  }

  init() {
    this.initNeonEffects();
    this.initHoverAnimations();
    this.initLoadingAnimations();
    this.initGlitchEffects();
    this.initFloatingElements();
    this.initTextAnimations();
  }

  // ===== NEON EFFECTS =====
  initNeonEffects() {
    if (this.isReducedMotion) return;

    // Animated neon borders
    const neonElements = document.querySelectorAll(".neon-border, .neon-card");
    neonElements.forEach((element, index) => {
      this.addNeonPulse(element, index * 200);
    });

    // Neon text glow animation
    const neonTexts = document.querySelectorAll(".neon-text");
    neonTexts.forEach((text) => {
      this.addTextGlow(text);
    });
  }

  addNeonPulse(element, delay = 0) {
    setTimeout(() => {
      element.style.animation = "neonBorder 4s ease-in-out infinite";
      element.style.animationDelay = `${delay}ms`;
    }, delay);
  }

  addTextGlow(element) {
    const originalText = element.textContent;
    element.addEventListener("mouseenter", () => {
      if (!this.isReducedMotion) {
        element.style.animation = "neonGlow 0.5s ease-in-out";
      }
    });

    element.addEventListener("animationend", () => {
      element.style.animation = "";
    });
  }

  // ===== HOVER ANIMATIONS =====
  initHoverAnimations() {
    // Card hover effects
    const cards = document.querySelectorAll(
      ".neon-card, .skill-card, .project-card"
    );
    cards.forEach((card) => {
      this.addCardHoverEffect(card);
    });

    // Button hover effects
    const buttons = document.querySelectorAll(".neon-btn");
    buttons.forEach((button) => {
      this.addButtonHoverEffect(button);
    });

    // Social link hover effects
    const socialLinks = document.querySelectorAll(".social-link");
    socialLinks.forEach((link) => {
      this.addSocialHoverEffect(link);
    });
  }

  addCardHoverEffect(card) {
    card.addEventListener("mouseenter", () => {
      if (!this.isReducedMotion) {
        card.style.transform = "translateY(-10px) scale(1.02)";
        card.style.boxShadow =
          "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 255, 255, 0.3)";
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  }

  addButtonHoverEffect(button) {
    button.addEventListener("mouseenter", () => {
      if (!this.isReducedMotion) {
        button.style.transform = "translateY(-2px)";
        button.style.boxShadow =
          "0 0 20px rgba(0, 255, 255, 0.6), 0 5px 15px rgba(0, 0, 0, 0.3)";
      }
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
      button.style.boxShadow = "";
    });

    button.addEventListener("mousedown", () => {
      if (!this.isReducedMotion) {
        button.style.transform = "translateY(0)";
      }
    });

    button.addEventListener("mouseup", () => {
      if (!this.isReducedMotion) {
        button.style.transform = "translateY(-2px)";
      }
    });
  }

  addSocialHoverEffect(link) {
    link.addEventListener("mouseenter", () => {
      if (!this.isReducedMotion) {
        link.style.transform = "translateY(-3px) scale(1.1)";
        link.style.animation = "glowPulse 0.5s ease-in-out";
      }
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "";
      link.style.animation = "";
    });
  }

  // ===== LOADING ANIMATIONS =====
  initLoadingAnimations() {
    // Page loading animation
    this.addPageLoadAnimation();

    // Section loading animations
    this.addSectionLoadAnimations();
  }

  addPageLoadAnimation() {
    const loader = document.createElement("div");
    loader.className = "page-loader";
    loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo neon-text">&lt;/Dev&gt;</div>
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading Portfolio...</div>
            </div>
        `;

    loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--primary-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease;
        `;

    const loaderContent = loader.querySelector(".loader-content");
    loaderContent.style.cssText = `
            text-align: center;
            color: var(--text-primary);
        `;

    const loaderLogo = loader.querySelector(".loader-logo");
    loaderLogo.style.cssText = `
            font-family: var(--font-primary);
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            animation: neonGlow 2s ease-in-out infinite;
        `;

    const loaderSpinner = loader.querySelector(".loader-spinner");
    loaderSpinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid transparent;
            border-top: 3px solid var(--accent-neon);
            border-radius: 50%;
            margin: 20px auto;
            animation: rotate 1s linear infinite;
        `;

    const loaderText = loader.querySelector(".loader-text");
    loaderText.style.cssText = `
            font-size: 1rem;
            color: var(--text-secondary);
            margin-top: 20px;
        `;

    document.body.appendChild(loader);

    // Remove loader after page load
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
      }, 1000);
    });
  }

  addSectionLoadAnimations() {
    const sections = document.querySelectorAll("section");
    sections.forEach((section, index) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(50px)";
      section.style.transition = "opacity 0.8s ease, transform 0.8s ease";

      setTimeout(() => {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }, (index + 1) * 200);
    });
  }

  // ===== GLITCH EFFECTS =====
  initGlitchEffects() {
    if (this.isReducedMotion) return;

    const glitchElements = document.querySelectorAll("[data-glitch]");
    glitchElements.forEach((element) => {
      this.addGlitchEffect(element);
    });
  }

  addGlitchEffect(element) {
    const text = element.textContent;
    element.setAttribute("data-text", text);
    element.classList.add("glitch");

    // Random glitch trigger
    setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance
        element.style.animation = "glitch 0.3s ease-in-out";
        setTimeout(() => {
          element.style.animation = "";
        }, 300);
      }
    }, 3000);
  }

  // ===== FLOATING ELEMENTS =====
  initFloatingElements() {
    if (this.isReducedMotion) return;

    const floatingElements = document.querySelectorAll(
      ".float, .hero-visual, .about-image"
    );
    floatingElements.forEach((element, index) => {
      this.addFloatingAnimation(element, index);
    });
  }

  addFloatingAnimation(element, index) {
    const duration = 3 + (index % 3); // 3-5 seconds
    const delay = index * 0.5; // Stagger the animations

    element.style.animation = `float ${duration}s ease-in-out infinite`;
    element.style.animationDelay = `${delay}s`;
  }

  // ===== TEXT ANIMATIONS =====
  initTextAnimations() {
    this.initRevealAnimations();
    this.initCountUpAnimations();
    this.initTypingAnimations();
  }

  initRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal-text");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.revealText(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  revealText(element) {
    const text = element.textContent;
    element.textContent = "";
    element.style.opacity = "1";

    [...text].forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.opacity = "0";
      span.style.transform = "translateY(20px)";
      span.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      span.style.transitionDelay = `${index * 0.05}s`;

      element.appendChild(span);

      setTimeout(() => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      }, index * 50);
    });
  }

  initCountUpAnimations() {
    const countElements = document.querySelectorAll("[data-count]");

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains("counted")
          ) {
            this.animateCount(entry.target);
            entry.target.classList.add("counted");
          }
        });
      },
      { threshold: 0.5 }
    );

    countElements.forEach((element) => {
      countObserver.observe(element);
    });
  }

  animateCount(element) {
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

  initTypingAnimations() {
    const typingElements = document.querySelectorAll(".typing-effect");

    typingElements.forEach((element) => {
      const text = element.textContent;
      const speed = parseInt(element.getAttribute("data-speed")) || 100;

      element.textContent = "";
      element.style.borderRight = "2px solid var(--accent-neon)";

      this.typeText(element, text, speed);
    });
  }

  typeText(element, text, speed) {
    let i = 0;

    const typeTimer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeTimer);
        // Blinking cursor effect
        setInterval(() => {
          element.style.borderRight =
            element.style.borderRight === "none"
              ? "2px solid var(--accent-neon)"
              : "none";
        }, 500);
      }
    }, speed);
  }

  // ===== SCROLL-TRIGGERED ANIMATIONS =====
  initScrollAnimations() {
    if (this.isReducedMotion) return;

    const scrollElements = document.querySelectorAll(".scroll-animate");

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animationType =
              entry.target.getAttribute("data-animation") || "fadeInUp";
            this.triggerScrollAnimation(entry.target, animationType);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    scrollElements.forEach((element) => {
      scrollObserver.observe(element);
    });
  }

  triggerScrollAnimation(element, animationType) {
    element.classList.add(`animate-${animationType}`);

    // Remove animation class after completion to allow re-triggering
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(`animate-${animationType}`);
      },
      { once: true }
    );
  }

  // ===== PARTICLE EFFECTS =====
  createParticleEffect(container, options = {}) {
    if (this.isReducedMotion) return;

    const defaults = {
      count: 50,
      size: { min: 1, max: 4 },
      speed: { min: 1, max: 3 },
      color: "var(--accent-neon)",
      opacity: { min: 0.2, max: 0.8 },
    };

    const config = { ...defaults, ...options };

    for (let i = 0; i < config.count; i++) {
      this.createParticle(container, config);
    }
  }

  createParticle(container, config) {
    const particle = document.createElement("div");
    particle.className = "particle";

    const size =
      Math.random() * (config.size.max - config.size.min) + config.size.min;
    const left = Math.random() * 100;
    const duration =
      Math.random() * (config.speed.max - config.speed.min) + config.speed.min;
    const opacity =
      Math.random() * (config.opacity.max - config.opacity.min) +
      config.opacity.min;

    particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${config.color};
            border-radius: 50%;
            left: ${left}%;
            opacity: ${opacity};
            animation: particleFloat ${duration}s linear infinite;
            pointer-events: none;
        `;

    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, duration * 1000);
  }

  // ===== UTILITY METHODS =====
  pauseAnimations() {
    document.body.style.animationPlayState = "paused";
  }

  resumeAnimations() {
    document.body.style.animationPlayState = "running";
  }

  toggleAnimations() {
    this.isReducedMotion = !this.isReducedMotion;
    if (this.isReducedMotion) {
      this.pauseAnimations();
    } else {
      this.resumeAnimations();
    }
  }
}

// Initialize animation controller when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.animationController = new AnimationController();
});

// Handle visibility change to pause/resume animations
document.addEventListener("visibilitychange", () => {
  if (window.animationController) {
    if (document.hidden) {
      window.animationController.pauseAnimations();
    } else {
      window.animationController.resumeAnimations();
    }
  }
});

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.init();
  }

  init() {
    this.measureFPS();
    this.optimizeAnimations();
  }

  measureFPS() {
    const now = performance.now();
    this.frameCount++;

    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;

      // Reduce animations if FPS is too low
      if (this.fps < 30) {
        this.reduceAnimations();
      }
    }

    requestAnimationFrame(() => this.measureFPS());
  }

  optimizeAnimations() {
    // Use CSS transforms instead of changing layout properties
    const animatedElements = document.querySelectorAll(".animate");
    animatedElements.forEach((element) => {
      element.style.willChange = "transform, opacity";
    });
  }

  reduceAnimations() {
    // Disable complex animations on low-performance devices
    document.body.classList.add("reduced-animations");
  }
}

// Initialize performance monitor
document.addEventListener("DOMContentLoaded", () => {
  if (window.requestAnimationFrame) {
    new PerformanceMonitor();
  }
});
