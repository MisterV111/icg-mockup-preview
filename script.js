/* ═══════════════════════════════════════════════════════════════
   ICG WEBSITE MOCKUP — JavaScript
   Smooth scroll, animations, navigation, form handling
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Scroll Animation (Intersection Observer) ───────────────
    const animateElements = document.querySelectorAll('.animate-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));


    // ─── Navigation Scroll Effect ────────────────────────────────
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });


    // ─── Active Nav Link ────────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
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
    }

    window.addEventListener('scroll', updateActiveLink);


    // ─── Mobile Navigation Toggle ────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        const isOpen = navLinksContainer.classList.contains('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });


    // ─── Smooth Scroll for Anchor Links ──────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 72; // nav height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ─── Portfolio Category Filters ─────────────────────────────
    const filterPills = document.querySelectorAll('.filter-pill');
    const workCards = document.querySelectorAll('.work-card');
    const showreel = document.querySelector('.work-showreel');
    const hiddenTiers = document.querySelectorAll('.work-tier--hidden');
    const hiddenCards = document.querySelectorAll('.work-card--hidden-extra');
    const showAllBtn = document.getElementById('showAllWork');
    const showAllWrap = document.querySelector('.work-show-all');
    const workGridFeatured = document.querySelector('.work-grid-featured');
    const workTiers = document.querySelectorAll('.work-tier');
    const workTierAi = document.querySelector('.work-tier-ai');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Update active pill and aria-selected
            filterPills.forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-selected', 'false');
            });
            pill.classList.add('active');
            pill.setAttribute('aria-selected', 'true');

            const filter = pill.dataset.filter;
            const isAll = filter === 'all';

            // Show/hide showreel: visible only on "All"
            if (showreel) {
                showreel.style.display = isAll ? '' : 'none';
            }

            if (isAll) {
                // Reset to default progressive disclosure state
                workCards.forEach(card => {
                    card.classList.remove('filter-hidden', 'filter-visible');
                });
                // Remove filtering class from tiers
                workTiers.forEach(t => t.classList.remove('filtering'));
                // Show AI tier again (remove filtering-hide)
                if (workTierAi) workTierAi.classList.remove('filtering-hide');
                // Re-hide progressive disclosure items (unless user already clicked "View All")
                if (showAllBtn && !showAllBtn.classList.contains('hidden')) {
                    hiddenCards.forEach(c => c.classList.remove('revealed'));
                    hiddenTiers.forEach(t => t.classList.remove('revealed'));
                }
                // Show the "View All" button wrapper
                if (showAllWrap) showAllWrap.style.display = '';
            } else {
                // Filtering: reveal ALL work tiers so we can filter across them
                hiddenCards.forEach(c => c.classList.add('revealed'));
                hiddenTiers.forEach(t => t.classList.add('revealed'));
                // Add filtering class to hide tier labels
                workTiers.forEach(t => t.classList.add('filtering'));
                // Hide AI/LinkedIn tier (not filterable by category)
                if (workTierAi) workTierAi.classList.add('filtering-hide');
                // Hide "View All" button (not needed when filtering)
                if (showAllWrap) showAllWrap.style.display = 'none';

                // Filter ALL work cards across all tiers
                workCards.forEach(card => {
                    const categories = (card.dataset.categories || '').split(' ');
                    if (categories.includes(filter)) {
                        card.classList.remove('filter-hidden');
                        card.classList.add('filter-visible');
                    } else {
                        card.classList.remove('filter-visible');
                        card.classList.add('filter-hidden');
                    }
                });
            }

            // Scroll to the work grid (below showreel) when filtering
            if (!isAll && workGridFeatured) {
                const offset = workGridFeatured.getBoundingClientRect().top + window.scrollY - 90;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });


    // ─── Contact Form Handling (Formspree) ───────────────────────
    const form = document.getElementById('contactForm');
    const formAction = form.getAttribute('action');
    const isFormspreeConfigured = formAction && !formAction.includes('{form_id}');
    
    form.addEventListener('submit', (e) => {
        const btn = form.querySelector('.btn');
        const originalText = btn.textContent;

        // If Formspree is not configured yet, prevent submission and show demo feedback
        if (!isFormspreeConfigured) {
            e.preventDefault();
            btn.textContent = 'Message Sent! ✓';
            btn.style.background = '#16a34a';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                form.reset();
            }, 3000);
            return;
        }
        
        // If Formspree IS configured, let the form submit naturally via POST
        // but show a brief "Sending..." state
        btn.textContent = 'Sending...';
        btn.disabled = true;
    });


    // ─── Parallax on Hero Stats (subtle) ─────────────────────────
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const rate = scrolled * 0.15;
                hero.querySelector('.hero-content').style.transform = `translateY(${rate}px)`;
                hero.querySelector('.hero-content').style.opacity = 1 - (scrolled / heroHeight * 0.8);
            }
        }
    });


    // ─── Counter Animation for Stats (looping) ────────────────────
    const stats = document.querySelectorAll('.hero-stat-number');
    let counterStarted = false;

    // Parse targets once on load
    const statTargets = [];
    stats.forEach(stat => {
        const text = stat.textContent;
        statTargets.push({
            el: stat,
            target: parseInt(text),
            hasPlus: text.includes('+')
        });
    });

    function animateCounters() {
        const countUpDuration = 1500;
        const steps = 40;
        const stepTime = countUpDuration / steps;

        statTargets.forEach(s => {
            let current = 0;
            const increment = s.target / steps;

            s.el.textContent = '0' + (s.hasPlus ? '+' : '');

            const timer = setInterval(() => {
                current += increment;
                if (current >= s.target) {
                    current = s.target;
                    clearInterval(timer);
                }
                s.el.textContent = Math.round(current) + (s.hasPlus ? '+' : '');
            }, stepTime);
        });
    }

    function startCounterLoop() {
        if (counterStarted) return;
        counterStarted = true;

        // First count-up
        animateCounters();

        // Loop: hold 2.5s → reset to 0 → count up again
        setInterval(() => {
            animateCounters();
        }, 4000); // 1.5s count-up + 2.5s hold
    }

    // Trigger counter when hero stats become visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(startCounterLoop, 800);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObserver.observe(heroStats);


    // ─── AI Layer Accordion (accessible) ────────────────────────
    document.querySelectorAll('.ai-layer--expandable').forEach(layer => {
        layer.style.cursor = 'pointer';

        layer.addEventListener('click', (e) => {
            // Don't close when clicking inside the detail content
            if (e.target.closest('.ai-layer-detail')) return;

            var btn = layer.querySelector('.ai-layer-btn');
            var detail = layer.querySelector('.ai-layer-detail');
            var toggle = layer.querySelector('.ai-layer-toggle');
            var num = layer.querySelector('.ai-layer-num');
            var content = layer.querySelector('.ai-layer-content');
            var isExpanded = btn.getAttribute('aria-expanded') === 'true';
            var hasFlip = (typeof gsap !== 'undefined' && typeof Flip !== 'undefined');

            if (hasFlip) {
                // Capture current positions of num + content
                var flipTargets = [num, content];
                var state = Flip.getState(flipTargets);

                if (!isExpanded) {
                    // OPEN
                    btn.setAttribute('aria-expanded', 'true');
                    btn.style.justifyContent = 'flex-start';
                    layer.classList.add('expanded');

                    // Animate num + content from centered to left
                    Flip.from(state, {
                        duration: 0.5,
                        ease: 'power3.out',
                        targets: flipTargets
                    });

                    // Reveal detail
                    gsap.set(detail, { maxHeight: 'none', opacity: 1 });
                    var h = detail.scrollHeight;
                    gsap.fromTo(detail,
                        { maxHeight: 0, opacity: 0 },
                        { maxHeight: h, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.15 }
                    );
                    gsap.to(toggle, { rotation: 45, duration: 0.3, ease: 'power2.out' });
                } else {
                    // CLOSE — collapse detail first, then re-center
                    gsap.to(detail, {
                        maxHeight: 0, opacity: 0, duration: 0.35, ease: 'power3.in',
                        onComplete: function() {
                            var closeState = Flip.getState(flipTargets);
                            layer.classList.remove('expanded');
                            btn.setAttribute('aria-expanded', 'false');
                            btn.style.justifyContent = 'center';
                            Flip.from(closeState, {
                                duration: 0.4,
                                ease: 'power2.out',
                                targets: flipTargets
                            });
                        }
                    });
                    gsap.to(toggle, { rotation: 0, duration: 0.3, ease: 'power2.in' });
                }
            } else {
                btn.setAttribute('aria-expanded', !isExpanded);
                layer.classList.toggle('expanded');
            }
        });
    });

    // Stagger entrance delay for layers — now handled by GSAP (gsap-animations.js)
    // Kept as fallback if GSAP doesn't load (no-op since layers use .gsap-animate not .animate-in)


    // ─── Portfolio Progressive Disclosure ──────────────────────
    // (showAllBtn already declared in filter section above)
    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            hiddenCards.forEach(card => card.classList.add('revealed'));
            hiddenTiers.forEach(tier => tier.classList.add('revealed'));
            showAllBtn.classList.add('hidden');
        });
    }


    // ─── Service Block Collapse/Expand ─────────────────────────
    document.querySelectorAll('.service-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !expanded);
            const targetId = btn.getAttribute('aria-controls');
            const target = document.getElementById(targetId);
            if (target) {
                target.classList.toggle('expanded');
            }
        });
    });

    // ─── Back to Top Button ────────────────────────────────────
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Sticky Contact Pill ───────────────────────────────────
    const stickyContact = document.getElementById('stickyContact');
    const contactSection = document.getElementById('contact');
    if (stickyContact && contactSection) {
        window.addEventListener('scroll', () => {
            const contactTop = contactSection.getBoundingClientRect().top;
            const pastFirstScreen = window.scrollY > window.innerHeight;
            const contactInView = contactTop < window.innerHeight;
            
            if (pastFirstScreen && !contactInView) {
                stickyContact.classList.add('visible');
            } else {
                stickyContact.classList.remove('visible');
            }
        });
    }

});
