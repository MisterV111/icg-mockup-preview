/* ═══════════════════════════════════════════════════════════════
   ICG WEBSITE — GSAP Scroll Animations
   
   DESIGN_TRUTH aligned:
   - Ease-out for entrances, never linear (§4.4)
   - Stagger 2-4 frames = 0.033-0.066s at 60fps (§4.4)
   - Max 2 text elements moving at once (§4.4)
   - Mask line reveal = editorial (§4.4)
   - Parallax 3-5 layers at decreasing speeds (§5.1)
   - Every animation serves narrative purpose (§Pro vs Amateur)
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
    if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);

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
    // DESIGN_TRUTH §4.4: "Line reveal from below mask" = editorial
    function splitTitleReveal(selector, triggerEl, startPos) {
        var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!el || !hasSplitText) {
            // Fallback: simple fade up
            if (el) {
                gsap.from(el, {
                    scrollTrigger: { trigger: triggerEl || el, start: startPos || 'top 85%' },
                    autoAlpha: 0, y: 60, duration: 1, ease: EASE, immediateRender: IR
                });
            }
            return;
        }

        // Wait for fonts before splitting
        var doSplit = function() {
            var split = SplitText.create(el, {
                type: 'lines',
                mask: 'lines',       // built-in overflow mask for reveal effect
                linesClass: 'split-line'
            });

            gsap.from(split.lines, {
                scrollTrigger: { trigger: triggerEl || el, start: startPos || 'top 85%' },
                y: '100%',           // slide up from fully below the mask
                autoAlpha: 0,
                stagger: 0.05,       // DESIGN_TRUTH: 2-4 frames = ~0.05s
                duration: 0.8,
                ease: 'power4.out',
                immediateRender: IR,
                onComplete: function() {
                    // DESIGN_TRUTH: revert split after animation for clean DOM
                    // Delay slightly so the final frame renders
                    setTimeout(function() { split.revert(); }, 100);
                }
            });
        };

        // Ensure fonts are loaded before measuring lines
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(doSplit);
        } else {
            doSplit();
        }
    }


    // ═══════════════════════════════════════════════════════════
    // HERO — Sequential reveal
    // DESIGN_TRUTH §4.4: max 2 text elements moving at once
    // ═══════════════════════════════════════════════════════════
    gsap.set([
        '.hero-badge.gsap-animate',
        '.hero-title.gsap-animate',
        '.hero-subtitle.gsap-animate',
        '.hero-video.gsap-animate',
        '.hero-cta.gsap-animate',
        '.hero-stats.gsap-animate'
    ], { autoAlpha: 0 });

    // SplitText character reveal on hero title
    var heroTitle = document.querySelector('.hero-title.gsap-animate');
    var heroTitleSplit = null;

    var buildHeroTimeline = function() {
        if (heroTitle && hasSplitText) {
            gsap.set(heroTitle, { visibility: 'visible' });
            heroTitleSplit = SplitText.create(heroTitle, { type: 'words, chars' });
            gsap.set(heroTitleSplit.chars, { autoAlpha: 0, y: 80, rotateX: -40 });
            gsap.set(heroTitle, { autoAlpha: 1 });
        }

        var heroTl = gsap.timeline({ defaults: { ease: EASE } });

        heroTl
            .fromTo('.hero-badge.gsap-animate',
                { autoAlpha: 0, y: -30 },
                { autoAlpha: 1, y: 0, duration: 0.4 });

        // DESIGN_TRUTH §4.4: stagger 2-4 frames = 0.033s at 60fps
        if (heroTitleSplit) {
            heroTl.to(heroTitleSplit.chars, {
                autoAlpha: 1, y: 0, rotateX: 0,
                stagger: 0.035, duration: 0.5, ease: 'back.out(1.7)'
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
            '+=0.05')                              // wait for subtitle to finish
            .fromTo('.hero-cta.gsap-animate',
                { autoAlpha: 0, y: 40 },
                { autoAlpha: 1, y: 0, duration: 0.5 },
            '-=0.2')
            .fromTo('.hero-stats.gsap-animate',
                { autoAlpha: 0, y: 40 },
                { autoAlpha: 1, y: 0, duration: 0.5 },
            '-=0.2');
    };

    // Wait for fonts before building hero (SplitText needs correct measurements)
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(buildHeroTimeline);
    } else {
        buildHeroTimeline();
    }


    // ═══════════════════════════════════════════════════════════
    // SECTION HEADERS — SplitText mask line reveal (editorial)
    // DESIGN_TRUTH §4.4: "Line reveal from below mask"
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.section-header.gsap-animate').forEach(function(header) {
        var title = header.querySelector('.section-title');
        if (title && hasSplitText) {
            // Mask reveal on the title text
            splitTitleReveal(title, header, 'top 85%');
            // Fade up the label and subtitle normally
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
            // Make the header container visible (SplitText handles title visibility)
            gsap.set(header, { autoAlpha: 1 });
        } else {
            // Fallback: simple fade up
            gsap.from(header, {
                scrollTrigger: { trigger: header, start: 'top 85%' },
                autoAlpha: 0, y: 60, duration: 1, ease: EASE, immediateRender: IR
            });
        }
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

    // AI Layers — scrub-linked to scrollbar (interactive reveal)
    // As user scrolls through the section, layers progressively slide in
    var aiLayers = document.querySelector('.ai-layers');
    var aiLayerEls = gsap.utils.toArray('.ai-layer.gsap-animate');
    if (aiLayers && aiLayerEls.length) {
        // Set initial state
        gsap.set(aiLayerEls, { autoAlpha: 0, x: -100 });

        // Build a timeline with all 5 layers staggered
        var layersTl = gsap.timeline({
            scrollTrigger: {
                trigger: aiLayers,
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: 1,            // smooth 1s catch-up
                // markers: true,    // uncomment for debugging
            }
        });

        aiLayerEls.forEach(function(layer, i) {
            layersTl.to(layer, {
                autoAlpha: 1, x: 0,
                duration: 1,
                ease: 'power4.out'
            }, i * 0.3);  // stagger start within timeline
        });
    }

    var aiBottom = document.querySelector('.ai-bottom-line.gsap-animate');
    if (aiBottom) {
        // Mask reveal on the quote text
        var quoteP = aiBottom.querySelector('.ai-quote p');
        if (quoteP && hasSplitText) {
            splitTitleReveal(quoteP, aiBottom, 'top 85%');
        }
        gsap.from(aiBottom, {
            scrollTrigger: { trigger: aiBottom, start: 'top 85%' },
            autoAlpha: 0, y: 60, duration: 1, ease: EASE, immediateRender: IR
        });
    }


    // ═══════════════════════════════════════════════════════════
    // STAKES CARDS — batch reveal
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.stakes-card.gsap-animate').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            autoAlpha: 0, y: 60, scale: 0.9,
            duration: 0.9, delay: i * 0.15, ease: EASE, immediateRender: IR
        });
    });

    // VALUE PROPOSITION — scale + bounce (same pattern as pillars)
    // ═══════════════════════════════════════════════════════════
    gsap.utils.toArray('.value-prop-card.gsap-animate').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            autoAlpha: 0, y: 80, scale: 0.85,
            rotation: i === 0 ? -3 : i === 2 ? 3 : 0,
            duration: 1, delay: i * 0.25, ease: 'back.out(1.2)', immediateRender: IR
        });
    });


    // THREE PILLARS — scale + bounce in (legacy)
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
    // ABOUT — story, team (with parallax), logos, featured
    // ═══════════════════════════════════════════════════════════
    var aboutStory = document.querySelector('.about-story.gsap-animate');
    if (aboutStory) {
        gsap.from(aboutStory, {
            scrollTrigger: { trigger: aboutStory, start: 'top 85%' },
            autoAlpha: 0, y: 60, duration: 1, ease: EASE, immediateRender: IR
        });
    }

    // Team members: slide from sides + parallax on images
    // DESIGN_TRUTH §5.1: parallax at decreasing speeds
    gsap.utils.toArray('.team-member.gsap-animate').forEach(function(member) {
        var isReverse = member.classList.contains('team-member--reverse');

        // Entrance animation
        gsap.from(member, {
            scrollTrigger: { trigger: member, start: 'top 82%' },
            autoAlpha: 0, x: isReverse ? 120 : -120,
            duration: 1.2, ease: 'power4.out', immediateRender: IR
        });

        // Subtle parallax on team photos (30% speed = background layer)
        var img = member.querySelector('.team-member-image');
        if (img) {
            gsap.to(img, {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: member,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
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
    // PORTFOLIO — pinned header + batch stagger cards
    // ═══════════════════════════════════════════════════════════

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
    // Testimonials — batch cascade with layered internal reveal
    var testimonialCards = gsap.utils.toArray('.testimonial-card.gsap-animate');
    if (testimonialCards.length) {
        // Pre-hide cards + internal elements
        gsap.set(testimonialCards, { autoAlpha: 0, y: 60 });
        testimonialCards.forEach(function(card) {
            gsap.set(card.querySelector('.testimonial-quote'), { autoAlpha: 0, scale: 0.3 });
            gsap.set(card.querySelector('.testimonial-text'), { autoAlpha: 0, y: 20 });
            gsap.set(card.querySelector('.testimonial-author'), { autoAlpha: 0, x: -20 });
        });

        ScrollTrigger.batch(testimonialCards, {
            start: 'top 85%',
            onEnter: function(batch) {
                // Cards slide up with stagger
                gsap.to(batch, {
                    autoAlpha: 1, y: 0,
                    duration: 0.8, ease: 'power3.out',
                    stagger: 0.15
                });
                // Internal elements reveal per card
                batch.forEach(function(card, i) {
                    var delay = i * 0.15 + 0.3;
                    // Quote mark scales in with bounce
                    gsap.to(card.querySelector('.testimonial-quote'), {
                        autoAlpha: 1, scale: 1,
                        duration: 0.5, ease: 'back.out(2)',
                        delay: delay
                    });
                    // Text fades up
                    gsap.to(card.querySelector('.testimonial-text'), {
                        autoAlpha: 1, y: 0,
                        duration: 0.6, ease: 'power2.out',
                        delay: delay + 0.15
                    });
                    // Author slides in from left
                    gsap.to(card.querySelector('.testimonial-author'), {
                        autoAlpha: 1, x: 0,
                        duration: 0.5, ease: 'power2.out',
                        delay: delay + 0.3
                    });
                });
            }
        });
    }


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


    // ═══════════════════════════════════════════════════════════
    // HERO PARALLAX — subtle depth on background grid
    // DESIGN_TRUTH §5.1: parallax at decreasing speeds
    // ═══════════════════════════════════════════════════════════
    var heroBgGrid = document.querySelector('.hero-bg-grid');
    if (heroBgGrid) {
        gsap.to(heroBgGrid, {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // Hero video thumbnail — subtle parallax (60% speed = mid layer)
    var heroVideoEl = document.querySelector('.hero-video .hero-video-thumb');
    if (heroVideoEl) {
        gsap.to(heroVideoEl, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }


    // ─── Lead Generator ────────────────────────────────────────
    var leadGenEls = document.querySelectorAll('.lead-gen .gsap-animate');
    if (leadGenEls.length) {
        leadGenEls.forEach(function(el) {
            gsap.from(el, {
                y: 60,
                autoAlpha: 0,
                duration: 0.8,
                ease: 'back.out(1.1)',
                immediateRender: true,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // ─── Refresh ScrollTrigger after all images load ────────────
    window.addEventListener('load', function() {
        ScrollTrigger.refresh();
    });

})();
