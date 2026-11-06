/**
 * ============================================================================
 * Arathi's Portfolio — JavaScript Logic
 * Features:
 *   1. Dynamic Typing Animation (Hero Section)
 *   2. Mobile Hamburger Menu Toggle
 *   3. Sticky Navbar & Scroll Spy (Active Link Highlighting)
 *   4. Scroll Reveal Animations (IntersectionObserver)
 *   5. Interactive Contact Form with Validation & Toast Feedback
 *   6. Toast Notification Helper
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Dynamic Typing Animation
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('typing-text');
  
  if (typingElement) {
    const phrases = [
      'Computer Science Student',
      'Aspiring Full-Stack Developer',
      'Creative Problem Solver',
      'Lifelong Tech Enthusiast'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 90;
    const deleteSpeed = 45;
    const holdTime = 1600;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        timeout = holdTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeout = 400;
      }

      setTimeout(typeLoop, timeout);
    }

    typeLoop();
  }


  // --------------------------------------------------------------------------
  // 2. Mobile Hamburger Menu Toggle
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any mobile navigation link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // --------------------------------------------------------------------------
  // 3. Sticky Navbar & Scroll Spy
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Sticky navbar shadow
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll spy: highlight current section in navigation
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });


  // --------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('visible'));
  }


  // --------------------------------------------------------------------------
  // 5. Toast Notification System
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message, icon = '✨') {
    if (!toast || !toastMessage) return;

    const toastIcon = toast.querySelector('.toast-icon');
    if (toastIcon) toastIcon.textContent = icon;

    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }


  // --------------------------------------------------------------------------
  // 6. Interactive Contact Form with Validation
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');

    // Validation helpers
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function setError(input, errorElementId, message) {
      input.classList.add('error');
      const errorEl = document.getElementById(errorElementId);
      if (errorEl) errorEl.textContent = message;
    }

    function clearError(input, errorElementId) {
      input.classList.remove('error');
      const errorEl = document.getElementById(errorElementId);
      if (errorEl) errorEl.textContent = '';
    }

    // Clear error on input typing
    [
      { input: nameInput, err: 'name-error' },
      { input: emailInput, err: 'email-error' },
      { input: subjectInput, err: 'subject-error' },
      { input: messageInput, err: 'message-error' }
    ].forEach(({ input, err }) => {
      if (input) {
        input.addEventListener('input', () => clearError(input, err));
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError(nameInput, 'name-error', 'Please enter your name.');
        hasError = true;
      } else {
        clearError(nameInput, 'name-error');
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        setError(emailInput, 'email-error', 'Please enter your email address.');
        hasError = true;
      } else if (!isValidEmail(emailInput.value.trim())) {
        setError(emailInput, 'email-error', 'Please enter a valid email address.');
        hasError = true;
      } else {
        clearError(emailInput, 'email-error');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setError(subjectInput, 'subject-error', 'Please enter a subject.');
        hasError = true;
      } else {
        clearError(subjectInput, 'subject-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setError(messageInput, 'message-error', 'Please write a message.');
        hasError = true;
      } else if (messageInput.value.trim().length < 10) {
        setError(messageInput, 'message-error', 'Message should be at least 10 characters.');
        hasError = true;
      } else {
        clearError(messageInput, 'message-error');
      }

      if (hasError) return;

      // Simulate sending with button feedback
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending Message...</span> <span>⏳</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        const senderName = nameInput.value.trim();
        contactForm.reset();
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.disabled = false;

        showToast(`Thank you, ${senderName}! Your message was sent successfully.`, '💌');
      }, 1200);
    });
  }

});

