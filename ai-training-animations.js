/* ═══════════════════════════════════════════════════════════════
   AI Workshops — GSAP Scroll Animations
   
   Duplicates the EXACT pattern from partners-animations.js:
   - CSS: .gsap-animate { visibility: hidden }
   - GSAP: set all to { visibility: visible, opacity: 1 }
   - GSAP: from() with autoAlpha + immediateRender for scroll reveals
   - Fallback: if GSAP missing, show everything
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── Fallback: if GSAP didn't load, show everything ─────────
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        document.querySelectorAll('.gsap-animate').forEach(function(el) {
            el.style.visibility = 'visible';
        });
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ─── Respect prefers-reduced-motion ──────────────────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('.gsap-animate', { autoAlpha: 1, y: 0, x: 0, scale: 1 });
        return;
    }

    // ─── Override CSS visibility so GSAP end-state = visible ────
    gsap.set('.gsap-animate', { visibility: 'visible', opacity: 1 });

    var EASE = 'power3.out';
    var IR = true; // immediateRender for scroll-triggered from()

    // ─── Hero (plays on load, no scroll trigger) ────────────────
    gsap.from('.workshop-hero .gsap-animate', {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.15,
        ease: EASE,
        delay: 0.2,
        immediateRender: IR
    });

    // ─── Section headers ────────────────────────────────────────
    document.querySelectorAll('.section .section-header.gsap-animate').forEach(function(el) {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%' },
            autoAlpha: 0, y: 40, duration: 0.8, ease: EASE, immediateRender: IR
        });
    });

    // ─── Problem cards ──────────────────────────────────────────
    gsap.from('.workshop-problem-card.gsap-animate', {
        scrollTrigger: { trigger: '.workshop-problem-grid', start: 'top 80%' },
        autoAlpha: 0, y: 50, duration: 0.7, stagger: 0.15, ease: EASE, immediateRender: IR
    });

    // ─── Outline section subtitle ───────────────────────────────
    var outlineSub = document.querySelector('.workshop-outline .section-subtitle.gsap-animate');
    if (outlineSub) {
        gsap.from(outlineSub, {
            scrollTrigger: { trigger: outlineSub, start: 'top 85%' },
            autoAlpha: 0, y: 30, duration: 0.7, ease: EASE, immediateRender: IR
        });
    }

    // ─── Outline cards ──────────────────────────────────────────
    gsap.from('.workshop-outline-card.gsap-animate', {
        scrollTrigger: { trigger: '.workshop-outline-grid', start: 'top 80%' },
        autoAlpha: 0, y: 50, duration: 0.7, stagger: 0.12, ease: EASE, immediateRender: IR
    });

    // ─── Failure stakes + mid CTA ─────────────────────────────
    var failureStakes = document.querySelector('.workshop-failure-stakes.gsap-animate');
    if (failureStakes) {
        gsap.from(failureStakes, {
            scrollTrigger: { trigger: failureStakes, start: 'top 85%' },
            autoAlpha: 0, y: 30, duration: 0.7, ease: EASE, immediateRender: IR
        });
    }
    var midCta = document.querySelector('.workshop-mid-cta.gsap-animate');
    if (midCta) {
        gsap.from(midCta, {
            scrollTrigger: { trigger: midCta, start: 'top 88%' },
            autoAlpha: 0, y: 20, duration: 0.6, ease: EASE, immediateRender: IR
        });
    }

    // ─── Success items ──────────────────────────────────────────
    gsap.from('.workshop-success-item.gsap-animate', {
        scrollTrigger: { trigger: '.workshop-success-grid', start: 'top 80%' },
        autoAlpha: 0, y: 50, duration: 0.7, stagger: 0.15, ease: EASE, immediateRender: IR
    });

    // ─── Testimonial Carousel (matches index.html pattern) ─────
    var testimonialCards = gsap.utils.toArray('.testimonial-card');
    var testimonialDots = gsap.utils.toArray('.testimonial-dot');
    var testimonialGrid = document.querySelector('.testimonials-grid');

    if (testimonialCards.length && testimonialGrid) {
        var currentTestimonial = 0;
        var autoplayTimer = null;
        var isAnimating = false;
        var DWELL_TIME = 6;

        function measureHeight() {
            testimonialCards.forEach(function(card) {
                card.style.position = 'relative';
                card.style.visibility = 'visible';
            });
            var maxH = 0;
            testimonialCards.forEach(function(card) {
                var h = card.offsetHeight;
                if (h > maxH) maxH = h;
            });
            testimonialGrid.style.height = maxH + 'px';
            testimonialCards.forEach(function(card) {
                card.style.position = '';
                card.style.visibility = '';
            });
        }
        measureHeight();
        window.addEventListener('resize', measureHeight);

        testimonialCards.forEach(function(card, i) {
            gsap.set(card, { autoAlpha: i === 0 ? 1 : 0, y: 0 });
            if (i === 0) card.classList.add('is-active');
            gsap.set(card.querySelector('.testimonial-quote'), { autoAlpha: 0, scale: 0.3 });
            gsap.set(card.querySelector('.testimonial-text'), { autoAlpha: 0, y: 20 });
            gsap.set(card.querySelector('.testimonial-author'), { autoAlpha: 0, x: -20 });
        });

        function revealCardInternals(card) {
            var quote = card.querySelector('.testimonial-quote');
            var text = card.querySelector('.testimonial-text');
            var author = card.querySelector('.testimonial-author');
            gsap.to(quote, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.2 });
            gsap.to(text, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.35 });
            gsap.to(author, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.5 });
        }

        function resetCardInternals(card) {
            gsap.set(card.querySelector('.testimonial-quote'), { autoAlpha: 0, scale: 0.3 });
            gsap.set(card.querySelector('.testimonial-text'), { autoAlpha: 0, y: 20 });
            gsap.set(card.querySelector('.testimonial-author'), { autoAlpha: 0, x: -20 });
        }

        function updateDots(index) {
            testimonialDots.forEach(function(dot, i) {
                if (i === index) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                }
            });
        }

        function goToSlide(index) {
            if (isAnimating || index === currentTestimonial) return;
            isAnimating = true;
            var outCard = testimonialCards[currentTestimonial];
            var inCard = testimonialCards[index];
            gsap.to(outCard, {
                autoAlpha: 0, y: -20,
                duration: 0.5, ease: 'power3.in',
                onComplete: function() {
                    outCard.classList.remove('is-active');
                    gsap.set(outCard, { y: 0 });
                    resetCardInternals(outCard);
                }
            });
            inCard.classList.add('is-active');
            gsap.fromTo(inCard,
                { autoAlpha: 0, y: 20 },
                {
                    autoAlpha: 1, y: 0,
                    duration: 0.6, ease: 'power3.out', delay: 0.15,
                    onComplete: function() { isAnimating = false; }
                }
            );
            revealCardInternals(inCard);
            currentTestimonial = index;
            updateDots(index);
        }

        function nextSlide() {
            var next = gsap.utils.wrap(0, testimonialCards.length, currentTestimonial + 1);
            goToSlide(next);
        }

        function prevSlide() {
            var prev = gsap.utils.wrap(0, testimonialCards.length, currentTestimonial - 1);
            goToSlide(prev);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = gsap.delayedCall(DWELL_TIME, function() {
                nextSlide();
                startAutoplay();
            });
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                autoplayTimer.kill();
                autoplayTimer = null;
            }
        }

        testimonialGrid.addEventListener('mouseenter', stopAutoplay);
        testimonialGrid.addEventListener('mouseleave', function() {
            autoplayTimer = gsap.delayedCall(1, function() {
                nextSlide();
                startAutoplay();
            });
        });

        testimonialDots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                var index = parseInt(dot.getAttribute('data-index'), 10);
                stopAutoplay();
                goToSlide(index);
                autoplayTimer = gsap.delayedCall(DWELL_TIME, function() {
                    nextSlide();
                    startAutoplay();
                });
            });
        });

        var dotsContainer = document.querySelector('.testimonial-dots');
        if (dotsContainer) {
            dotsContainer.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    stopAutoplay();
                    nextSlide();
                    testimonialDots[currentTestimonial].focus();
                    startAutoplay();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    stopAutoplay();
                    prevSlide();
                    testimonialDots[currentTestimonial].focus();
                    startAutoplay();
                }
            });
        }

        ScrollTrigger.observe({
            target: testimonialGrid,
            type: 'touch,pointer',
            dragMinimum: 30,
            onLeft: function() { stopAutoplay(); nextSlide(); startAutoplay(); },
            onRight: function() { stopAutoplay(); prevSlide(); startAutoplay(); }
        });

        gsap.set(testimonialGrid, { autoAlpha: 0, y: 40 });
        gsap.set('.testimonial-dots', { autoAlpha: 0 });

        ScrollTrigger.create({
            trigger: '.testimonials-grid',
            start: 'top 80%',
            once: true,
            onEnter: function() {
                gsap.to(testimonialGrid, {
                    autoAlpha: 1, y: 0,
                    duration: 1.0, ease: 'power3.out'
                });
                gsap.delayedCall(0.4, function() {
                    revealCardInternals(testimonialCards[0]);
                });
                gsap.to('.testimonial-dots', {
                    autoAlpha: 1,
                    duration: 0.6, ease: 'power2.out', delay: 1.0
                });
                gsap.delayedCall(1.8, startAutoplay);
            }
        });
    }

    // ─── Audience list items ────────────────────────────────────
    gsap.from('.audience-item.gsap-animate', {
        scrollTrigger: { trigger: '.workshop-audience-list', start: 'top 80%' },
        autoAlpha: 0, x: -30, duration: 0.6, stagger: 0.1, ease: EASE, immediateRender: IR
    });

    // ─── Audience note ──────────────────────────────────────────
    var audienceNote = document.querySelector('.workshop-audience-note.gsap-animate');
    if (audienceNote) {
        gsap.from(audienceNote, {
            scrollTrigger: { trigger: audienceNote, start: 'top 85%' },
            autoAlpha: 0, y: 30, duration: 0.7, ease: EASE, immediateRender: IR
        });
    }

    // ─── Instructor ─────────────────────────────────────────────
    gsap.from('.workshop-instructor-photo.gsap-animate', {
        scrollTrigger: { trigger: '.workshop-instructor-grid', start: 'top 80%' },
        autoAlpha: 0, y: 40, duration: 0.8, ease: EASE, immediateRender: IR
    });
    gsap.from('.workshop-instructor-bio.gsap-animate', {
        scrollTrigger: { trigger: '.workshop-instructor-grid', start: 'top 80%' },
        autoAlpha: 0, y: 40, duration: 0.8, delay: 0.15, ease: EASE, immediateRender: IR
    });

    // ─── Pricing tier cards ────────────────────────────────────
    gsap.from('.workshop-tier-card.gsap-animate', {
        scrollTrigger: { trigger: '.workshop-tiers-grid', start: 'top 80%' },
        autoAlpha: 0, y: 50, duration: 0.7, stagger: 0.12, ease: EASE, immediateRender: IR
    });

    // ─── Signup section ─────────────────────────────────────────
    gsap.from('.workshop-signup-info.gsap-animate', {
        scrollTrigger: { trigger: '.workshop-signup-grid', start: 'top 80%' },
        autoAlpha: 0, y: 40, duration: 0.8, ease: EASE, immediateRender: IR
    });
    gsap.from('.workshop-signup-form-wrapper.gsap-animate', {
        scrollTrigger: { trigger: '.workshop-signup-grid', start: 'top 80%' },
        autoAlpha: 0, y: 40, duration: 0.8, delay: 0.15, ease: EASE, immediateRender: IR
    });

})();
