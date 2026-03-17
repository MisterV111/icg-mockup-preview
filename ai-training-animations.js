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

    // ─── Testimonial ────────────────────────────────────────────
    var testimonial = document.querySelector('.workshop-testimonial.gsap-animate');
    if (testimonial) {
        gsap.from(testimonial, {
            scrollTrigger: { trigger: testimonial, start: 'top 85%' },
            autoAlpha: 0, y: 30, duration: 0.8, ease: EASE, immediateRender: IR
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
