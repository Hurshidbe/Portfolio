// ===== MAIN JAVASCRIPT FILE =====

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initTypewriter();
  initParticles();
  initScrollAnimations();
  initCounters();
  initSkillBars();
  initContactForm();
  initScrollToTop();
  initThemeToggle();

  // Add loading class removal after page load
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Active navigation link highlighting
  window.addEventListener("scroll", function () {
    let current = "";
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Navbar background on scroll
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.style.background = "var(--navbar-bg-scroll)";
      navbar.style.backdropFilter = "blur(15px)";
    } else {
      navbar.style.background = "var(--navbar-bg)";
      navbar.style.backdropFilter = "blur(10px)";
    }
  });
}

// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
  const typingElement = document.querySelector(".typing-text");
  if (!typingElement) return;

  const text =
    typingElement.getAttribute("data-text") || "Hello, I'm a Backend Developer";
  const cursor = document.querySelector(".cursor");

  let i = 0;
  let isDeleting = false;
  let currentText = "";

  function typeWriter() {
    if (!isDeleting && i < text.length) {
      currentText += text.charAt(i);
      typingElement.textContent = currentText;
      i++;
      setTimeout(typeWriter, 100);
    } else if (isDeleting && i > 0) {
      currentText = text.substring(0, i - 1);
      typingElement.textContent = currentText;
      i--;
      setTimeout(typeWriter, 50);
    } else if (!isDeleting && i === text.length) {
      setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, 2000);
    } else if (isDeleting && i === 0) {
      setTimeout(() => {
        isDeleting = false;
        typeWriter();
      }, 500);
    }
  }

  // Start typewriter effect
  setTimeout(typeWriter, 1000);
}

// ===== PARTICLE SYSTEM =====
function initParticles() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  function createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random properties
    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 3 + 2;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            opacity: ${opacity};
            animation-duration: ${animationDuration}s;
        `;

    particlesContainer.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, animationDuration * 1000);
  }

  // Create particles periodically
  setInterval(createParticle, 300);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");

        // Trigger specific animations based on element type
        if (entry.target.classList.contains("skill-card")) {
          animateSkillBar(entry.target);
        }

        if (entry.target.classList.contains("stat-number")) {
          animateCounter(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const animatedElements = document.querySelectorAll(`
        .neon-card,
        .skill-card,
        .project-card,
        .timeline-item,
        .stat-number,
        .section-title,
        .about-description
    `);

  animatedElements.forEach((el) => {
    el.classList.add("scroll-reveal");
    observer.observe(el);
  });
}

// ===== COUNTER ANIMATIONS =====
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    counter.style.opacity = "0";
    counter.style.transform = "translateY(20px)";
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-count"));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  element.style.opacity = "1";
  element.style.transform = "translateY(0)";
  element.style.transition = "opacity 0.5s ease, transform 0.5s ease";

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// ===== SKILL BAR ANIMATIONS =====
function initSkillBars() {
  const skillBars = document.querySelectorAll(".progress-bar");

  skillBars.forEach((bar) => {
    bar.style.width = "0%";
  });
}

function animateSkillBar(skillCard) {
  const progressBar = skillCard.querySelector(".progress-bar");
  if (!progressBar) return;

  const targetWidth = progressBar.getAttribute("data-width");

  setTimeout(() => {
    progressBar.style.width = targetWidth + "%";
    progressBar.style.transition = "width 2s ease-out";
  }, 200);
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector(".form-submit");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");

    // Show loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      // Hide loading state
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;

      // Show success message
      showNotification("Message sent successfully!", "success");

      // Reset form
      form.reset();

      // Reset form labels
      const formInputs = form.querySelectorAll(".form-input");
      formInputs.forEach((input) => {
        input.classList.remove("filled");
      });
    }, 2000);
  });

  // Form input animations
  const formInputs = document.querySelectorAll(".form-input");
  formInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentNode.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      this.parentNode.classList.remove("focused");
      if (this.value !== "") {
        this.classList.add("filled");
      } else {
        this.classList.remove("filled");
      }
    });

    // Check if input has value on page load
    if (input.value !== "") {
      input.classList.add("filled");
    }
  });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => {
    notification.remove();
  });

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary-dark);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: var(--border-radius);
        border: 1px solid var(--accent-neon);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    hideNotification(notification);
  });

  // Auto hide after 5 seconds
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);
}

function hideNotification(notification) {
  notification.style.opacity = "0";
  notification.style.transform = "translateX(100%)";
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// ===== SCROLL TO TOP =====
function initScrollToTop() {
  // Create scroll to top button
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.className = "scroll-to-top neon-btn";
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-neon);
        color: var(--primary-dark);
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;

  document.body.appendChild(scrollToTopBtn);

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.visibility = "visible";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.visibility = "hidden";
    }
  });

  // Scroll to top functionality
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Add CSS class with animation delay
function addClassWithDelay(elements, className, delay = 100) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(className);
    }, index * delay);
  });
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Optimize scroll events
const optimizedScrollHandler = throttle(function () {
  // Handle scroll-based animations here
}, 16);

window.addEventListener("scroll", optimizedScrollHandler);

// Optimize resize events
const optimizedResizeHandler = debounce(function () {
  // Handle resize-based adjustments here
}, 250);

window.addEventListener("resize", optimizedResizeHandler);

// ===== ERROR HANDLING =====
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.error);
  // You can add error reporting here
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener("keydown", function (e) {
  // ESC key to close mobile menu
  if (e.key === "Escape") {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu && navMenu.classList.contains("active")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  }
});

// Focus management for accessibility
document.addEventListener("focusin", function (e) {
  if (e.target.matches(".nav-link, .btn, .form-input, .social-link")) {
    e.target.classList.add("keyboard-focus");
  }
});

document.addEventListener("focusout", function (e) {
  if (e.target.matches(".nav-link, .btn, .form-input, .social-link")) {
    e.target.classList.remove("keyboard-focus");
  }
});

// ===== BROWSER COMPATIBILITY =====
// Check for IntersectionObserver support
if (!("IntersectionObserver" in window)) {
  // Fallback for older browsers
  const animatedElements = document.querySelectorAll(".scroll-reveal");
  animatedElements.forEach((el) => {
    el.classList.add("revealed");
  });
}

// Check for CSS custom properties support
if (!CSS.supports("color", "var(--fake-var)")) {
  // Add fallback styles for older browsers
  document.body.classList.add("no-css-variables");
}

// ===== THEME TOGGLE FUNCTIONALITY =====
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");

  // Check for saved theme preference or default to 'dark'
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);

  // Update icon based on current theme
  updateThemeIcon(currentTheme, themeIcon);

  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Apply theme transition
    document.documentElement.style.transition = "all 0.3s ease";
    document.documentElement.setAttribute("data-theme", newTheme);

    // Save theme preference
    localStorage.setItem("theme", newTheme);

    // Update icon
    updateThemeIcon(newTheme, themeIcon);

    // Remove transition after animation completes
    setTimeout(() => {
      document.documentElement.style.transition = "";
    }, 300);
  });
}

function updateThemeIcon(theme, iconElement) {
  if (theme === "dark") {
    iconElement.className = "fas fa-sun";
    iconElement.parentElement.title = "Switch to Light Mode";
  } else {
    iconElement.className = "fas fa-moon";
    iconElement.parentElement.title = "Switch to Dark Mode";
  }
}
