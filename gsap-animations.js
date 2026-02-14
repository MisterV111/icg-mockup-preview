/* ═══════════════════════════════════════════════════════════════
   ICG WEBSITE — GSAP Scroll Animations
   
   Pattern:
   1. CSS: .gsap-animate { visibility: hidden } prevents FOUC
   2. JS: gsap.set() overrides to visibility:visible (same frame)
   3. All scroll-triggered from() use immediateRender:true so
      elements start hidden and reveal on scroll
   4. Hero uses explicit set(autoAlpha:0) + fromTo() for sequence
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
    if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);

    // ─── Respect prefers-reduced-motion ──────────────────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('.gsap-animate, .gsap-animate-cta', { autoAlpha: 1, y: 0, x: 0, scale: 1, rotation: 0 });
        return;
    }

    // ─── Override CSS visibility so GSAP end-state = visible ────
    gsap.set('.gsap-animate, .gsap-animate-cta', { visibility: 'visible', opacity: 1 });

    var EASE = 'power3.out';
    // immediateRender:true is THE key for scroll-triggered from() —
    // without it, elements stay visible until their trigger fires
    var IR = true;


    // ═══════════════════════════════════════════════════════════
    // HERO — Sequential reveal (badge → title → subtitle → video → CTA → stats)
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

    // ─── SplitText for hero title ──────────────────────────────
    var heroTitle = document.querySelector('.hero-title.gsap-animate');
    var heroTitleSplit = null;
    if (heroTitle && typeof SplitText !== 'undefined') {
        // Make title visible so SplitText can measure it, but keep content hidden
        gsap.set(heroTitle, { visibility: 'visible' });
        heroTitleSplit = SplitText.create(heroTitle, { type: 'words, chars' });
        gsap.set(heroTitleSplit.chars, { autoAlpha: 0, y: 80, rotateX: -40 });
        gsap.set(heroTitle, { autoAlpha: 1 }); // container visible, chars hidden
    }

    heroTl
        .fromTo('.hero-badge.gsap-animate',
            { autoAlpha: 0, y: -30 },
            { autoAlpha: 1, y: 0, duration: 0.4 });

    // SplitText character reveal OR simple fade for fallback
    if (heroTitleSplit) {
        heroTl.to(heroTitleSplit.chars, {
            autoAlpha: 1, y: 0, rotateX: 0,
            stagger: 0.02, duration: 0.5, ease: 'back.out(1.7)'
        }, '+=0.05');
    } else {
        heroTl.fromTo('.hero-title.gsap-animate',
            { autoAlpha: 0, y: 60 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
        '+=0.05');
    }

    heroTl
        .fromTo('.hero-subtitle.gsap-animate',
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, duration: 0.6 },
        '+=0.05')
        .fromTo('.hero-video.gsap-animate',
            { autoAlpha: 0, y: 60, scale: 0.9 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 },
        '-=0.1')
        .fromTo('.hero-cta.gsap-animate',
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
        '-=0.3')
        .fromTo('.hero-stats.gsap-animate',
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
        '-=0.2');


    // ═══════════════════════════════════════════════════════════
    // SECTION HEADERS — rise up
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.section-header.gsap-animate').forEach(function(header) {
        gsap.from(header, {
            scrollTrigger: { trigger: header, start: 'top 85%' },
            autoAlpha: 0, y: 60, duration: 1, ease: EASE, immediateRender: IR
        });
    });


    // ═══════════════════════════════════════════════════════════
    // STAKES — AI Innovation
    // ═══════════════════════════════════════════════════════════
    var aiProblem = document.querySelector('.ai-problem.gsap-animate');
    if (aiProblem) {
        gsap.from(aiProblem, {
            scrollTrigger: { trigger: aiProblem, start: 'top 82%' },
            autoAlpha: 0, y: 80, scale: 0.92, duration: 1.1, ease: EASE, immediateRender: IR
        });
    }

    var aiSystem = document.querySelector('.ai-system.gsap-animate');
    if (aiSystem) {
        gsap.from(aiSystem, {
            scrollTrigger: { trigger: aiSystem, start: 'top 85%' },
            autoAlpha: 0, y: 50, duration: 1, ease: EASE, immediateRender: IR
        });
    }

    gsap.utils.toArray('.ai-layer.gsap-animate').forEach(function(layer, i) {
        gsap.from(layer, {
            scrollTrigger: { trigger: layer, start: 'top 88%' },
            autoAlpha: 0, x: -100, duration: 0.9, delay: i * 0.15,
            ease: 'power4.out', immediateRender: IR
        });
    });

    var aiBottom = document.querySelector('.ai-bottom-line.gsap-animate');
    if (aiBottom) {
        gsap.from(aiBottom, {
            scrollTrigger: { trigger: aiBottom, start: 'top 85%' },
            autoAlpha: 0, y: 60, duration: 1, ease: EASE, immediateRender: IR
        });
    }


    // ═══════════════════════════════════════════════════════════
    // THREE PILLARS — scale + bounce in
    // ═══════════════════════════════════════════════════════════
    var pillarsIntro = document.querySelector('.pillars-intro.gsap-animate');
    if (pillarsIntro) {
        gsap.from(pillarsIntro, {
            scrollTrigger: { trigger: pillarsIntro, start: 'top 85%' },
            autoAlpha: 0, y: 40, duration: 0.8, ease: EASE, immediateRender: IR
        });
    }

    gsap.utils.toArray('.pillar-card.gsap-animate').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            autoAlpha: 0, y: 80, scale: 0.85,
            rotation: i === 0 ? -3 : i === 2 ? 3 : 0,
            duration: 1, delay: i * 0.25, ease: 'back.out(1.2)', immediateRender: IR
        });
    });


    // ═══════════════════════════════════════════════════════════
    // ABOUT — story, team, logos, featured
    // ═══════════════════════════════════════════════════════════
    var aboutStory = document.querySelector('.about-story.gsap-animate');
    if (aboutStory) {
        gsap.from(aboutStory, {
            scrollTrigger: { trigger: aboutStory, start: 'top 85%' },
            autoAlpha: 0, y: 60, duration: 1, ease: EASE, immediateRender: IR
        });
    }

    gsap.utils.toArray('.team-member.gsap-animate').forEach(function(member) {
        var isReverse = member.classList.contains('team-member--reverse');
        gsap.from(member, {
            scrollTrigger: { trigger: member, start: 'top 82%' },
            autoAlpha: 0, x: isReverse ? 120 : -120,
            duration: 1.2, ease: 'power4.out', immediateRender: IR
        });
    });

    var clientLogos = document.querySelector('.about-clients.gsap-animate');
    if (clientLogos) {
        gsap.from(clientLogos, {
            scrollTrigger: { trigger: clientLogos, start: 'top 88%' },
            autoAlpha: 0, y: 60, scale: 0.95, duration: 1.2, ease: 'power4.out', immediateRender: IR
        });
    }

    var featured = document.querySelector('.about-featured.gsap-animate');
    if (featured) {
        gsap.from(featured, {
            scrollTrigger: { trigger: featured, start: 'top 85%' },
            autoAlpha: 0, y: 50, duration: 1, ease: EASE, immediateRender: IR
        });
    }


    // ═══════════════════════════════════════════════════════════
    // THE PLAN — cascade from left
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.plan-step.gsap-animate').forEach(function(step, i) {
        gsap.from(step, {
            scrollTrigger: { trigger: step, start: 'top 88%' },
            autoAlpha: 0, y: 60, x: -40,
            duration: 0.9, delay: i * 0.3, ease: 'power4.out', immediateRender: IR
        });
    });


    // ═══════════════════════════════════════════════════════════
    // SERVICES — alternate sides
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.service-block.gsap-animate').forEach(function(block, i) {
        gsap.from(block, {
            scrollTrigger: { trigger: block, start: 'top 82%' },
            autoAlpha: 0, x: i % 2 === 0 ? -100 : 100, y: 40,
            duration: 1.1, delay: i * 0.15, ease: 'power4.out', immediateRender: IR
        });
    });

    gsap.utils.toArray('.ai-cap.gsap-animate').forEach(function(cap, i) {
        gsap.from(cap, {
            scrollTrigger: { trigger: cap, start: 'top 88%' },
            autoAlpha: 0, y: 50, scale: 0.88,
            duration: 0.8, delay: i * 0.15, ease: 'back.out(1.1)', immediateRender: IR
        });
    });


    // ═══════════════════════════════════════════════════════════
    // PORTFOLIO — batch stagger for card grid
    // ═══════════════════════════════════════════════════════════

    // Pre-hide all work cards so they don't show before batch triggers
    gsap.set('.work-card.gsap-animate', { autoAlpha: 0, y: 80, scale: 0.88 });

    ScrollTrigger.batch('.work-card.gsap-animate', {
        onEnter: function(elements) {
            gsap.to(elements, {
                autoAlpha: 1, y: 0, scale: 1,
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
            autoAlpha: 0, y: 40, duration: 0.8, ease: EASE, immediateRender: IR
        });
    }

    gsap.utils.toArray('.work-tier-label.gsap-animate, .work-show-all.gsap-animate, .work-tier.gsap-animate').forEach(function(el) {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%' },
            autoAlpha: 0, y: 30, duration: 0.7, ease: EASE, immediateRender: IR
        });
    });


    // ═══════════════════════════════════════════════════════════
    // TESTIMONIALS — stagger with tilt
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.testimonial-card.gsap-animate').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            autoAlpha: 0, y: 70, rotation: i % 2 === 0 ? -2 : 2,
            duration: 0.9, delay: i * 0.2, ease: 'power4.out', immediateRender: IR
        });
    });


    // ═══════════════════════════════════════════════════════════
    // CONTACT — slide from sides
    // ═══════════════════════════════════════════════════════════
    var contactInfo = document.querySelector('.contact-info.gsap-animate');
    if (contactInfo) {
        gsap.from(contactInfo, {
            scrollTrigger: { trigger: contactInfo, start: 'top 82%' },
            autoAlpha: 0, x: -100, duration: 1.1, ease: 'power4.out', immediateRender: IR
        });
    }

    var contactForm = document.querySelector('.contact-form-wrap.gsap-animate');
    if (contactForm) {
        gsap.from(contactForm, {
            scrollTrigger: { trigger: contactForm, start: 'top 82%' },
            autoAlpha: 0, x: 100, duration: 1.1, delay: 0.2, ease: 'power4.out', immediateRender: IR
        });
    }


    // ═══════════════════════════════════════════════════════════
    // CTA BUTTONS — pop with bounce
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.gsap-animate-cta').forEach(function(cta) {
        gsap.from(cta, {
            scrollTrigger: { trigger: cta, start: 'top 90%' },
            autoAlpha: 0, y: 40, scale: 0.9,
            duration: 0.7, ease: 'back.out(1.3)', immediateRender: IR
        });
    });

})();
