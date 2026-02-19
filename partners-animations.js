/* ═══════════════════════════════════════════════════════════════
   ICG PARTNERS PAGE — GSAP Scroll Animations
   
   Mirrors main page animation system (gsap-animations.js)
   DESIGN_TRUTH aligned:
   - Ease-out for entrances, never linear (§4.4)
   - Stagger 2-4 frames = 0.033-0.066s at 60fps (§4.4)
   - Max 2 text elements moving at once (§4.4)
   - Mask line reveal = editorial (§4.4)
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
    var IR = true;  // immediateRender for scroll-triggered from()
    var hasSplitText = typeof SplitText !== 'undefined';


    // ─── Helper: SplitText mask line reveal on section titles ────
    function splitTitleReveal(selector, triggerEl, startPos) {
        var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!el || !hasSplitText) {
            if (el) {
                gsap.from(el, {
                    scrollTrigger: { trigger: triggerEl || el, start: startPos || 'top 85%' },
                    autoAlpha: 0, y: 60, duration: 1, ease: EASE, immediateRender: IR
                });
            }
            return;
        }

        var doSplit = function() {
            var split = SplitText.create(el, {
                type: 'lines',
                mask: 'lines',
                linesClass: 'split-line'
            });

            gsap.from(split.lines, {
                scrollTrigger: { trigger: triggerEl || el, start: startPos || 'top 85%' },
                y: '100%',
                autoAlpha: 0,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power4.out',
                immediateRender: IR,
                onComplete: function() {
                    setTimeout(function() { split.revert(); }, 100);
                }
            });
        };

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(doSplit);
        } else {
            doSplit();
        }
    }


    // ═══════════════════════════════════════════════════════════
    // HERO — Sequential reveal (matches main page hero)
    // ═══════════════════════════════════════════════════════════
    gsap.set([
        '.partners-hero-badge.gsap-animate',
        '.partners-hero-title.gsap-animate',
        '.partners-hero-subtitle.gsap-animate',
        '.partners-hero .gsap-animate-cta'
    ], { autoAlpha: 0 });

    var heroTitle = document.querySelector('.partners-hero-title.gsap-animate');
    var heroTitleSplit = null;

    var buildHeroTimeline = function() {
        if (heroTitle && hasSplitText) {
            gsap.set(heroTitle, { visibility: 'visible' });
            heroTitleSplit = SplitText.create(heroTitle, { type: 'words, chars' });
            gsap.set(heroTitleSplit.chars, { autoAlpha: 0, y: 80, rotateX: -40 });
            gsap.set(heroTitle, { autoAlpha: 1 });
        }

        var heroTl = gsap.timeline({ defaults: { ease: EASE } });

        heroTl.fromTo('.partners-hero-badge.gsap-animate',
            { autoAlpha: 0, y: -30 },
            { autoAlpha: 1, y: 0, duration: 0.4 }
        );

        if (heroTitleSplit) {
            heroTl.to(heroTitleSplit.chars, {
                autoAlpha: 1, y: 0, rotateX: 0,
                stagger: 0.035, duration: 0.5, ease: 'back.out(1.7)'
            }, '+=0.05');
        } else {
            heroTl.fromTo('.partners-hero-title.gsap-animate',
                { autoAlpha: 0, y: 60 },
                { autoAlpha: 1, y: 0, duration: 0.7 },
            '+=0.05');
        }

        heroTl
            .fromTo('.partners-hero-subtitle.gsap-animate',
                { autoAlpha: 0, y: 50 },
                { autoAlpha: 1, y: 0, duration: 0.6 },
            '+=0.05')
            .fromTo('.partners-hero .gsap-animate-cta',
                { autoAlpha: 0, y: 40, scale: 0.9 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.3)' },
            '+=0.05');
    };

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(buildHeroTimeline);
    } else {
        buildHeroTimeline();
    }


    // ═══════════════════════════════════════════════════════════
    // SECTION HEADERS — SplitText mask line reveal (editorial)
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.section-header.gsap-animate').forEach(function(header) {
        var title = header.querySelector('.section-title');
        if (title && hasSplitText) {
            splitTitleReveal(title, header, 'top 85%');
            var label = header.querySelector('.section-label');
            var subtitle = header.querySelector('.section-subtitle');
            if (label) {
                gsap.from(label, {
                    scrollTrigger: { trigger: header, start: 'top 85%' },
                    autoAlpha: 0, y: 20, duration: 0.6, ease: EASE, immediateRender: IR
                });
            }
            if (subtitle) {
                gsap.from(subtitle, {
                    scrollTrigger: { trigger: header, start: 'top 82%' },
                    autoAlpha: 0, y: 30, duration: 0.8, delay: 0.3, ease: EASE, immediateRender: IR
                });
            }
            gsap.set(header, { autoAlpha: 1 });
        } else {
            gsap.from(header, {
                scrollTrigger: { trigger: header, start: 'top 85%' },
                autoAlpha: 0, y: 60, duration: 1, ease: EASE, immediateRender: IR
            });
        }
    });


    // ═══════════════════════════════════════════════════════════
    // PROBLEM CARDS — batch stagger with scale
    // ═══════════════════════════════════════════════════════════
    var problemCards = gsap.utils.toArray('.partners-problem-card.gsap-animate');
    if (problemCards.length) {
        gsap.set(problemCards, { autoAlpha: 0, y: 80, scale: 0.88 });
        ScrollTrigger.batch(problemCards, {
            onEnter: function(elements) {
                gsap.to(elements, {
                    autoAlpha: 1, y: 0, scale: 1,
                    stagger: 0.15, duration: 0.9, ease: 'back.out(1.1)', overwrite: true
                });
            },
            start: 'top 88%',
            once: true
        });
    }

    var problemSolution = document.querySelector('.partners-problem-solution.gsap-animate');
    if (problemSolution) {
        gsap.from(problemSolution, {
            scrollTrigger: { trigger: problemSolution, start: 'top 88%' },
            autoAlpha: 0, y: 40, duration: 0.8, ease: EASE, immediateRender: IR
        });
    }


    // ═══════════════════════════════════════════════════════════
    // SOLUTION CARDS — progressive reveal with scale + bounce
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.partners-solution-card.gsap-animate').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            autoAlpha: 0, y: 80, scale: 0.85,
            rotation: i === 0 ? -2 : i === 2 ? 2 : 0,
            duration: 1, delay: i * 0.2, ease: 'back.out(1.2)', immediateRender: IR
        });
    });


    // ═══════════════════════════════════════════════════════════
    // WHY US — stats counter-style + empathy block
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.partners-why-stat.gsap-animate').forEach(function(stat, i) {
        gsap.from(stat, {
            scrollTrigger: { trigger: stat, start: 'top 88%' },
            autoAlpha: 0, y: 60, scale: 0.9,
            duration: 0.8, delay: i * 0.15, ease: 'back.out(1.1)', immediateRender: IR
        });
    });


    // ═══════════════════════════════════════════════════════════
    // PROCESS STEPS — cascade from left (like Plan section)
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.partners-step.gsap-animate').forEach(function(step, i) {
        gsap.from(step, {
            scrollTrigger: { trigger: step, start: 'top 88%' },
            autoAlpha: 0, y: 60, x: -40,
            duration: 0.9, delay: i * 0.2, ease: 'power4.out', immediateRender: IR
        });
    });


    // ═══════════════════════════════════════════════════════════
    // LOGO CAROUSEL — scale + fade
    // ═══════════════════════════════════════════════════════════
    var logoCarousel = document.querySelector('.partners-logo-carousel');
    if (logoCarousel) {
        gsap.from(logoCarousel, {
            scrollTrigger: { trigger: logoCarousel, start: 'top 88%' },
            autoAlpha: 0, y: 60, scale: 0.95, duration: 1.2, ease: 'power4.out', immediateRender: IR
        });
    }


    // ═══════════════════════════════════════════════════════════
    // DELIVERABLES — batch grid reveal
    // ═══════════════════════════════════════════════════════════
    var deliverables = gsap.utils.toArray('.partners-deliverable.gsap-animate');
    if (deliverables.length) {
        gsap.set(deliverables, { autoAlpha: 0, y: 80, scale: 0.88 });
        ScrollTrigger.batch(deliverables, {
            onEnter: function(elements) {
                gsap.to(elements, {
                    autoAlpha: 1, y: 0, scale: 1,
                    stagger: 0.1, duration: 0.9, ease: 'back.out(1.1)', overwrite: true
                });
            },
            start: 'top 92%',
            once: true
        });
    }


    // ═══════════════════════════════════════════════════════════
    // TESTIMONIALS — 3-layer cascade (matches main page)
    // ═══════════════════════════════════════════════════════════
    var testimonialCards = gsap.utils.toArray('.testimonial-card.gsap-animate');
    if (testimonialCards.length) {
        gsap.set(testimonialCards, { autoAlpha: 0, y: 60 });
        testimonialCards.forEach(function(card) {
            var quote = card.querySelector('.testimonial-quote');
            var text = card.querySelector('.testimonial-text');
            var author = card.querySelector('.testimonial-author');
            if (quote) gsap.set(quote, { autoAlpha: 0, scale: 0.3 });
            if (text) gsap.set(text, { autoAlpha: 0, y: 20 });
            if (author) gsap.set(author, { autoAlpha: 0, x: -20 });
        });

        ScrollTrigger.batch(testimonialCards, {
            start: 'top 85%',
            onEnter: function(batch) {
                gsap.to(batch, {
                    autoAlpha: 1, y: 0,
                    duration: 0.8, ease: 'power3.out',
                    stagger: 0.15
                });
                batch.forEach(function(card, i) {
                    var delay = i * 0.15 + 0.3;
                    var quote = card.querySelector('.testimonial-quote');
                    var text = card.querySelector('.testimonial-text');
                    var author = card.querySelector('.testimonial-author');
                    if (quote) {
                        gsap.to(quote, {
                            autoAlpha: 1, scale: 1,
                            duration: 0.5, ease: 'back.out(2)',
                            delay: delay
                        });
                    }
                    if (text) {
                        gsap.to(text, {
                            autoAlpha: 1, y: 0,
                            duration: 0.6, ease: 'power2.out',
                            delay: delay + 0.15
                        });
                    }
                    if (author) {
                        gsap.to(author, {
                            autoAlpha: 1, x: 0,
                            duration: 0.5, ease: 'power2.out',
                            delay: delay + 0.3
                        });
                    }
                });
            }
        });
    }


    // ═══════════════════════════════════════════════════════════
    // FAQ — simple stagger fade up
    // ═══════════════════════════════════════════════════════════
    var faqItems = gsap.utils.toArray('.partners-faq-item.gsap-animate');
    if (faqItems.length) {
        gsap.set(faqItems, { autoAlpha: 0, y: 30 });
        ScrollTrigger.batch(faqItems, {
            onEnter: function(elements) {
                gsap.to(elements, {
                    autoAlpha: 1, y: 0,
                    stagger: 0.08, duration: 0.6, ease: EASE, overwrite: true
                });
            },
            start: 'top 90%',
            once: true
        });
    }


    // ═══════════════════════════════════════════════════════════
    // CONTACT — slide from sides (matches main page)
    // ═══════════════════════════════════════════════════════════
    var contactInfo = document.querySelector('.partners-contact-info.gsap-animate');
    if (contactInfo) {
        gsap.from(contactInfo, {
            scrollTrigger: { trigger: contactInfo, start: 'top 82%' },
            autoAlpha: 0, x: -100, duration: 1.1, ease: 'power4.out', immediateRender: IR
        });
    }

    var contactForm = document.querySelector('.partners-contact-form-wrapper.gsap-animate');
    if (contactForm) {
        gsap.from(contactForm, {
            scrollTrigger: { trigger: contactForm, start: 'top 82%' },
            autoAlpha: 0, x: 100, duration: 1.1, delay: 0.2, ease: 'power4.out', immediateRender: IR
        });
    }


    // ─── Lead Generator Flow ────────────────────────
    var flowWithout = document.getElementById('flow-without');
    if (flowWithout) {
        gsap.from(flowWithout, {
            scrollTrigger: { trigger: flowWithout, start: 'top 85%' },
            autoAlpha: 0, y: 50, duration: 0.9, ease: 'power3.out', immediateRender: IR
        });
    }

    var flowWith = document.getElementById('flow-with');
    if (flowWith) {
        gsap.from(flowWith, {
            scrollTrigger: { trigger: flowWith, start: 'top 85%' },
            autoAlpha: 0, y: 50, duration: 0.9, delay: 0.15, ease: 'power3.out', immediateRender: IR
        });
        // Skill card gets a subtle bounce
        var skillCard = flowWith.querySelector('.flow-skill');
        if (skillCard) {
            gsap.from(skillCard, {
                scrollTrigger: { trigger: flowWith, start: 'top 82%' },
                autoAlpha: 0, scale: 0.9, duration: 0.8, delay: 0.4, ease: 'back.out(1.4)', immediateRender: IR
            });
        }
    }

    var leadCta = document.querySelector('.lead-gen-cta.gsap-animate');
    if (leadCta) {
        gsap.from(leadCta, {
            scrollTrigger: { trigger: leadCta, start: 'top 85%' },
            autoAlpha: 0, y: 40, duration: 0.9, ease: 'power3.out', immediateRender: IR
        });
    }

    // ─── Refresh ScrollTrigger after all images load ────────────
    window.addEventListener('load', function() {
        ScrollTrigger.refresh();
    });

})();
