/* ═══════════════════════════════════════════════════════════════
   ICG WEBSITE — GSAP Scroll Animations
   
   How it works:
   1. CSS sets .gsap-animate { visibility: hidden } to prevent FOUC
   2. JS immediately overrides to visibility:visible (same frame)
   3. gsap.from() then sets autoAlpha:0 and animates to 1
   This ensures GSAP knows the END state is "visible".
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── Fallback: if GSAP didn't load, show everything ─────────
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        document.querySelectorAll('.gsap-animate, .gsap-animate-cta').forEach(function(el) {
            el.style.visibility = 'visible';
        });
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ─── Respect prefers-reduced-motion ──────────────────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('.gsap-animate, .gsap-animate-cta', { autoAlpha: 1, y: 0, x: 0, scale: 1, rotation: 0 });
        return;
    }

    // ─── CRITICAL: Override CSS visibility so GSAP knows end state is "visible"
    // This happens synchronously before any render, so no flash.
    gsap.set('.gsap-animate, .gsap-animate-cta', { visibility: 'visible', opacity: 1 });

    // ─── Shared ─────────────────────────────────────────────────
    var EASE = 'power3.out';


    // ═══════════════════════════════════════════════════════════
    // HERO — Clear sequential reveal: each element waits its turn
    // Hide ALL hero elements first, then reveal one by one
    // ═══════════════════════════════════════════════════════════
    gsap.set([
        '.hero-badge.gsap-animate',
        '.hero-title.gsap-animate',
        '.hero-subtitle.gsap-animate',
        '.hero-video.gsap-animate',
        '.hero-cta.gsap-animate',
        '.hero-stats.gsap-animate'
    ], { autoAlpha: 0 });

    var heroTl = gsap.timeline({ defaults: { ease: EASE } });

    heroTl
        .to('.hero-badge.gsap-animate', {
            autoAlpha: 1, y: 0, duration: 0.6
        })
        .fromTo('.hero-title.gsap-animate',
            { autoAlpha: 0, y: 60 },
            { autoAlpha: 1, y: 0, duration: 1 },
        '+=0.1')
        .fromTo('.hero-subtitle.gsap-animate',
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
        '+=0.1')
        .fromTo('.hero-video.gsap-animate',
            { autoAlpha: 0, y: 60, scale: 0.9 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1 },
        '+=0.05')
        .fromTo('.hero-cta.gsap-animate',
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
        '-=0.3')
        .fromTo('.hero-stats.gsap-animate',
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
        '-=0.2');


    // ═══════════════════════════════════════════════════════════
    // SECTION HEADERS
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.section-header.gsap-animate').forEach(function(header) {
        gsap.from(header, {
            scrollTrigger: { trigger: header, start: 'top 85%' },
            autoAlpha: 0, y: 60, duration: 1, ease: EASE
        });
    });


    // ═══════════════════════════════════════════════════════════
    // STAKES — AI Innovation
    // ═══════════════════════════════════════════════════════════
    var aiProblem = document.querySelector('.ai-problem.gsap-animate');
    if (aiProblem) {
        gsap.from(aiProblem, {
            scrollTrigger: { trigger: aiProblem, start: 'top 82%' },
            autoAlpha: 0, y: 80, scale: 0.92, duration: 1.1, ease: EASE
        });
    }

    var aiSystem = document.querySelector('.ai-system.gsap-animate');
    if (aiSystem) {
        gsap.from(aiSystem, {
            scrollTrigger: { trigger: aiSystem, start: 'top 85%' },
            autoAlpha: 0, y: 50, duration: 1, ease: EASE
        });
    }

    // AI Layers — slide from left
    gsap.utils.toArray('.ai-layer.gsap-animate').forEach(function(layer, i) {
        gsap.from(layer, {
            scrollTrigger: { trigger: layer, start: 'top 88%' },
            autoAlpha: 0, x: -100, duration: 0.9, delay: i * 0.15, ease: 'power4.out'
        });
    });

    var aiBottom = document.querySelector('.ai-bottom-line.gsap-animate');
    if (aiBottom) {
        gsap.from(aiBottom, {
            scrollTrigger: { trigger: aiBottom, start: 'top 85%' },
            autoAlpha: 0, y: 60, duration: 1, ease: EASE
        });
    }


    // ═══════════════════════════════════════════════════════════
    // THREE PILLARS
    // ═══════════════════════════════════════════════════════════
    var pillarsIntro = document.querySelector('.pillars-intro.gsap-animate');
    if (pillarsIntro) {
        gsap.from(pillarsIntro, {
            scrollTrigger: { trigger: pillarsIntro, start: 'top 85%' },
            autoAlpha: 0, y: 40, duration: 0.8, ease: EASE
        });
    }

    gsap.utils.toArray('.pillar-card.gsap-animate').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            autoAlpha: 0, y: 80, scale: 0.85,
            rotation: i === 0 ? -3 : i === 2 ? 3 : 0,
            duration: 1, delay: i * 0.25, ease: 'back.out(1.2)'
        });
    });


    // ═══════════════════════════════════════════════════════════
    // ABOUT
    // ═══════════════════════════════════════════════════════════
    var aboutStory = document.querySelector('.about-story.gsap-animate');
    if (aboutStory) {
        gsap.from(aboutStory, {
            scrollTrigger: { trigger: aboutStory, start: 'top 85%' },
            autoAlpha: 0, y: 60, duration: 1, ease: EASE
        });
    }

    gsap.utils.toArray('.team-member.gsap-animate').forEach(function(member) {
        var isReverse = member.classList.contains('team-member--reverse');
        gsap.from(member, {
            scrollTrigger: { trigger: member, start: 'top 82%' },
            autoAlpha: 0, x: isReverse ? 120 : -120, duration: 1.2, ease: 'power4.out'
        });
    });

    var clientLogos = document.querySelector('.about-clients.gsap-animate');
    if (clientLogos) {
        gsap.from(clientLogos, {
            scrollTrigger: { trigger: clientLogos, start: 'top 85%' },
            autoAlpha: 0, y: 50, duration: 1, ease: EASE
        });
    }

    var featured = document.querySelector('.about-featured.gsap-animate');
    if (featured) {
        gsap.from(featured, {
            scrollTrigger: { trigger: featured, start: 'top 85%' },
            autoAlpha: 0, y: 50, duration: 1, ease: EASE
        });
    }


    // ═══════════════════════════════════════════════════════════
    // THE PLAN
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.plan-step.gsap-animate').forEach(function(step, i) {
        gsap.from(step, {
            scrollTrigger: { trigger: step, start: 'top 88%' },
            autoAlpha: 0, y: 60, x: -40, duration: 0.9, delay: i * 0.3, ease: 'power4.out'
        });
    });


    // ═══════════════════════════════════════════════════════════
    // SERVICES
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.service-block.gsap-animate').forEach(function(block, i) {
        gsap.from(block, {
            scrollTrigger: { trigger: block, start: 'top 82%' },
            autoAlpha: 0, x: i % 2 === 0 ? -100 : 100, y: 40,
            duration: 1.1, delay: i * 0.15, ease: 'power4.out'
        });
    });

    gsap.utils.toArray('.ai-cap.gsap-animate').forEach(function(cap, i) {
        gsap.from(cap, {
            scrollTrigger: { trigger: cap, start: 'top 88%' },
            autoAlpha: 0, y: 50, scale: 0.88,
            duration: 0.8, delay: i * 0.15, ease: 'back.out(1.1)'
        });
    });


    // ═══════════════════════════════════════════════════════════
    // PORTFOLIO
    // ═══════════════════════════════════════════════════════════
    ScrollTrigger.batch('.work-card.gsap-animate', {
        onEnter: function(elements) {
            gsap.from(elements, {
                autoAlpha: 0, y: 80, scale: 0.88,
                stagger: 0.15, duration: 0.9, ease: 'back.out(1.1)', overwrite: true
            });
        },
        start: 'top 92%',
        once: true
    });

    var workFilters = document.querySelector('.work-filters.gsap-animate');
    if (workFilters) {
        gsap.from(workFilters, {
            scrollTrigger: { trigger: workFilters, start: 'top 85%' },
            autoAlpha: 0, y: 40, duration: 0.8, ease: EASE
        });
    }

    gsap.utils.toArray('.work-tier-label.gsap-animate, .work-show-all.gsap-animate, .work-tier.gsap-animate').forEach(function(el) {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%' },
            autoAlpha: 0, y: 30, duration: 0.7, ease: EASE
        });
    });


    // ═══════════════════════════════════════════════════════════
    // TESTIMONIALS
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.testimonial-card.gsap-animate').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            autoAlpha: 0, y: 70, rotation: i % 2 === 0 ? -2 : 2,
            duration: 0.9, delay: i * 0.2, ease: 'power4.out'
        });
    });


    // ═══════════════════════════════════════════════════════════
    // CONTACT
    // ═══════════════════════════════════════════════════════════
    var contactInfo = document.querySelector('.contact-info.gsap-animate');
    if (contactInfo) {
        gsap.from(contactInfo, {
            scrollTrigger: { trigger: contactInfo, start: 'top 82%' },
            autoAlpha: 0, x: -100, duration: 1.1, ease: 'power4.out'
        });
    }

    var contactForm = document.querySelector('.contact-form-wrap.gsap-animate');
    if (contactForm) {
        gsap.from(contactForm, {
            scrollTrigger: { trigger: contactForm, start: 'top 82%' },
            autoAlpha: 0, x: 100, duration: 1.1, delay: 0.2, ease: 'power4.out'
        });
    }


    // ═══════════════════════════════════════════════════════════
    // CTA BUTTONS
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.gsap-animate-cta').forEach(function(cta) {
        gsap.from(cta, {
            scrollTrigger: { trigger: cta, start: 'top 90%' },
            autoAlpha: 0, y: 40, scale: 0.9, duration: 0.7, ease: 'back.out(1.3)'
        });
    });

})();
