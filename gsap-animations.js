/* ═══════════════════════════════════════════════════════════════
   ICG WEBSITE — GSAP Scroll Animations
   Enhances specific sections with richer motion.
   The base .animate-in + IntersectionObserver system handles
   everything NOT listed here.
   
   Pattern: Elements use class="gsap-animate" instead of "animate-in".
   CSS sets .gsap-animate { visibility: hidden }.
   GSAP's autoAlpha animates visibility+opacity together.
   If GSAP fails to load, the fallback below makes them visible.
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── Fallback: if GSAP didn't load, show everything ─────────
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded — showing all elements');
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

    // ─── Shared defaults ────────────────────────────────────────
    var EASE = 'power3.out';

    // ─── HERO SECTION ───────────────────────────────────────────
    // Staggered entrance on page load
    var heroTl = gsap.timeline({ defaults: { ease: EASE } });

    heroTl
        .from('.hero-badge.gsap-animate', {
            autoAlpha: 0, y: 20, duration: 0.6
        })
        .from('.hero-title.gsap-animate', {
            autoAlpha: 0, y: 40, duration: 1
        }, '-=0.3')
        .from('.hero-subtitle.gsap-animate', {
            autoAlpha: 0, y: 30, duration: 0.8
        }, '-=0.5')
        .from('.hero-video.gsap-animate', {
            autoAlpha: 0, y: 30, scale: 0.97, duration: 0.8
        }, '-=0.4')
        .from('.hero-cta.gsap-animate', {
            autoAlpha: 0, y: 20, duration: 0.6
        }, '-=0.4')
        .from('.hero-stats.gsap-animate', {
            autoAlpha: 0, y: 20, duration: 0.6
        }, '-=0.3');


    // ─── SECTION HEADERS ────────────────────────────────────────
    gsap.utils.toArray('.section-header.gsap-animate').forEach(function(header) {
        gsap.from(header, {
            scrollTrigger: { trigger: header, start: 'top 88%' },
            autoAlpha: 0, y: 30, duration: 0.8, ease: EASE
        });
    });


    // ─── STAKES — AI Problem Card ───────────────────────────────
    var aiProblem = document.querySelector('.ai-problem.gsap-animate');
    if (aiProblem) {
        gsap.from(aiProblem, {
            scrollTrigger: { trigger: aiProblem, start: 'top 85%' },
            autoAlpha: 0, y: 40, duration: 0.9, ease: EASE
        });
    }

    // ─── STAKES — AI System Intro ───────────────────────────────
    var aiSystem = document.querySelector('.ai-system.gsap-animate');
    if (aiSystem) {
        gsap.from(aiSystem, {
            scrollTrigger: { trigger: aiSystem, start: 'top 85%' },
            autoAlpha: 0, y: 30, duration: 0.8, ease: EASE
        });
    }

    // ─── STAKES — AI Layers (cascade from left) ─────────────────
    gsap.utils.toArray('.ai-layer.gsap-animate').forEach(function(layer, i) {
        gsap.from(layer, {
            scrollTrigger: { trigger: layer, start: 'top 88%' },
            autoAlpha: 0, x: -30, duration: 0.7, delay: i * 0.1, ease: EASE
        });
    });

    // ─── STAKES — Bottom Line ───────────────────────────────────
    var aiBottom = document.querySelector('.ai-bottom-line.gsap-animate');
    if (aiBottom) {
        gsap.from(aiBottom, {
            scrollTrigger: { trigger: aiBottom, start: 'top 85%' },
            autoAlpha: 0, y: 30, duration: 0.8, ease: EASE
        });
    }


    // ─── THREE PILLARS ──────────────────────────────────────────
    var pillarsIntro = document.querySelector('.pillars-intro.gsap-animate');
    if (pillarsIntro) {
        gsap.from(pillarsIntro, {
            scrollTrigger: { trigger: pillarsIntro, start: 'top 88%' },
            autoAlpha: 0, y: 20, duration: 0.7, ease: EASE
        });
    }

    gsap.utils.toArray('.pillar-card.gsap-animate').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            autoAlpha: 0, y: 50, scale: 0.95, duration: 0.8, delay: i * 0.15, ease: EASE
        });
    });


    // ─── ABOUT — Story ──────────────────────────────────────────
    var aboutStory = document.querySelector('.about-story.gsap-animate');
    if (aboutStory) {
        gsap.from(aboutStory, {
            scrollTrigger: { trigger: aboutStory, start: 'top 85%' },
            autoAlpha: 0, y: 30, duration: 0.8, ease: EASE
        });
    }

    // ─── ABOUT — Team Members (slide in from sides) ─────────────
    gsap.utils.toArray('.team-member.gsap-animate').forEach(function(member) {
        var isReverse = member.classList.contains('team-member--reverse');
        gsap.from(member, {
            scrollTrigger: { trigger: member, start: 'top 85%' },
            autoAlpha: 0, x: isReverse ? 40 : -40, duration: 0.9, ease: EASE
        });
    });

    // ─── ABOUT — Client Logos ───────────────────────────────────
    var clientLogos = document.querySelector('.about-clients.gsap-animate');
    if (clientLogos) {
        gsap.from(clientLogos, {
            scrollTrigger: { trigger: clientLogos, start: 'top 85%' },
            autoAlpha: 0, y: 30, duration: 0.8, ease: EASE
        });
    }

    // ─── ABOUT — Featured In ────────────────────────────────────
    var featured = document.querySelector('.about-featured.gsap-animate');
    if (featured) {
        gsap.from(featured, {
            scrollTrigger: { trigger: featured, start: 'top 85%' },
            autoAlpha: 0, y: 30, duration: 0.8, ease: EASE
        });
    }


    // ─── THE PLAN — Steps (stagger) ─────────────────────────────
    gsap.utils.toArray('.plan-step.gsap-animate').forEach(function(step, i) {
        gsap.from(step, {
            scrollTrigger: { trigger: step, start: 'top 88%' },
            autoAlpha: 0, y: 40, duration: 0.7, delay: i * 0.2, ease: EASE
        });
    });


    // ─── SERVICES — Blocks (alternate slide direction) ──────────
    gsap.utils.toArray('.service-block.gsap-animate').forEach(function(block, i) {
        gsap.from(block, {
            scrollTrigger: { trigger: block, start: 'top 85%' },
            autoAlpha: 0, y: 40, x: i % 2 === 0 ? -20 : 20,
            duration: 0.8, delay: i * 0.12, ease: EASE
        });
    });

    // ─── SERVICES — AI Capabilities (stagger) ───────────────────
    gsap.utils.toArray('.ai-cap.gsap-animate').forEach(function(cap, i) {
        gsap.from(cap, {
            scrollTrigger: { trigger: cap, start: 'top 90%' },
            autoAlpha: 0, y: 30, scale: 0.95,
            duration: 0.6, delay: i * 0.1, ease: EASE
        });
    });


    // ─── PORTFOLIO — Batch stagger for work cards ───────────────
    ScrollTrigger.batch('.work-card.gsap-animate', {
        onEnter: function(elements) {
            gsap.from(elements, {
                autoAlpha: 0, y: 40, scale: 0.96,
                stagger: 0.1, duration: 0.7, ease: EASE, overwrite: true
            });
        },
        start: 'top 90%',
        once: true
    });


    // ─── TESTIMONIALS ───────────────────────────────────────────
    gsap.utils.toArray('.testimonial-card.gsap-animate').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            autoAlpha: 0, y: 30, duration: 0.7, delay: i * 0.12, ease: EASE
        });
    });


    // ─── CONTACT — Two columns ──────────────────────────────────
    var contactInfo = document.querySelector('.contact-info.gsap-animate');
    if (contactInfo) {
        gsap.from(contactInfo, {
            scrollTrigger: { trigger: contactInfo, start: 'top 85%' },
            autoAlpha: 0, x: -30, duration: 0.8, ease: EASE
        });
    }
    var contactForm = document.querySelector('.contact-form-wrap.gsap-animate');
    if (contactForm) {
        gsap.from(contactForm, {
            scrollTrigger: { trigger: contactForm, start: 'top 85%' },
            autoAlpha: 0, x: 30, duration: 0.8, delay: 0.15, ease: EASE
        });
    }


    // ─── GENERIC CTA BUTTONS ────────────────────────────────────
    gsap.utils.toArray('.gsap-animate-cta').forEach(function(cta) {
        gsap.from(cta, {
            scrollTrigger: { trigger: cta, start: 'top 90%' },
            autoAlpha: 0, y: 20, duration: 0.6, ease: EASE
        });
    });

})();
