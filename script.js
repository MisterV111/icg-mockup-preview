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


    // ─── Counter Animation for Stats ─────────────────────────────
    const stats = document.querySelectorAll('.hero-stat-number');
    let statsCounted = false;

    function animateCounters() {
        if (statsCounted) return;
        statsCounted = true;
        
        stats.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const target = parseInt(text);
            let current = 0;
            const increment = target / 40;
            const duration = 1500;
            const stepTime = duration / 40;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.round(current) + (hasPlus ? '+' : '');
            }, stepTime);
        });
    }

    // Trigger counter when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 800);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObserver.observe(heroStats);


    // ─── AI Layer Accordion (accessible) ────────────────────────
    document.querySelectorAll('.ai-layer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const layer = btn.closest('.ai-layer--expandable');
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            
            btn.setAttribute('aria-expanded', !isExpanded);
            layer.classList.toggle('expanded');
        });
    });

    // Stagger entrance delay for layers
    document.querySelectorAll('.ai-layer').forEach((layer, i) => {
        layer.style.transitionDelay = `${i * 50}ms`;
    });


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


    // ═══════════════════════════════════════════════════════════════
    // GSAP ENHANCEMENTS — layered ON TOP of working IntersectionObserver
    // The IO system handles all visibility. GSAP adds richer motion.
    // If GSAP fails, everything still works via IO + CSS transitions.
    // ═══════════════════════════════════════════════════════════════
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);

        let mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {

            // ── HERO: SplitText word-by-word reveal ──
            // Override the IO fade for hero title with a richer word stagger
            let heroTitle = document.querySelector(".hero-title");
            if (heroTitle && typeof SplitText !== 'undefined') {
                // Wait for IO to make it visible, then enhance
                let split = SplitText.create(heroTitle, { type: "words" });
                gsap.from(split.words, {
                    opacity: 0, y: 15,
                    duration: 0.4, stagger: 0.05, ease: "power2.out",
                    delay: 0.5
                });
            }

            // ── HERO STATS: number counter with GSAP timing ──
            // (counter already handled by existing animateCounters function)

            // ── AI LAYERS: staggered cascade (enhance the IO fade) ──
            let aiLayers = gsap.utils.toArray(".ai-system .ai-layer");
            if (aiLayers.length) {
                ScrollTrigger.create({
                    trigger: ".ai-system",
                    start: "top 80%",
                    once: true,
                    onEnter: () => {
                        gsap.from(aiLayers, {
                            y: 20, duration: 0.4, stagger: 0.1, ease: "power2.out"
                        });
                    }
                });
            }

            // ── PILLAR CARDS: bounce scale entrance ──
            let pillarCards = gsap.utils.toArray(".pillar-card");
            if (pillarCards.length) {
                ScrollTrigger.create({
                    trigger: pillarCards[0],
                    start: "top 85%",
                    once: true,
                    onEnter: () => {
                        gsap.from(pillarCards, {
                            scale: 0.92, duration: 0.5, stagger: 0.12, ease: "back.out(1.4)"
                        });
                    }
                });
            }

            // ── TEAM MEMBERS: slide from alternating sides ──
            gsap.utils.toArray(".team-member").forEach((member, i) => {
                ScrollTrigger.create({
                    trigger: member,
                    start: "top 85%",
                    once: true,
                    onEnter: () => {
                        gsap.from(member, {
                            x: i % 2 === 0 ? -30 : 30, duration: 0.6, ease: "power2.out"
                        });
                    }
                });
            });

            // ── FEATURED IN BADGES: scale with bounce ──
            let featuredBadges = gsap.utils.toArray(".featured-badge");
            if (featuredBadges.length) {
                ScrollTrigger.create({
                    trigger: ".about-featured",
                    start: "top 85%",
                    once: true,
                    onEnter: () => {
                        gsap.from(featuredBadges, {
                            scale: 0.85, duration: 0.5, stagger: 0.12, ease: "back.out(1.7)"
                        });
                    }
                });
            }

            // ── PLAN STEPS: stagger left to right ──
            let planSteps = gsap.utils.toArray(".plan-step");
            if (planSteps.length) {
                ScrollTrigger.create({
                    trigger: ".plan-steps",
                    start: "top 80%",
                    once: true,
                    onEnter: () => {
                        gsap.from(planSteps, {
                            x: -20, duration: 0.4, stagger: 0.15, ease: "power2.out"
                        });
                    }
                });
            }

            // ── SERVICE BLOCKS: alternate slide direction ──
            gsap.utils.toArray(".service-block").forEach((block, i) => {
                ScrollTrigger.create({
                    trigger: block,
                    start: "top 85%",
                    once: true,
                    onEnter: () => {
                        gsap.from(block, {
                            x: i % 2 === 0 ? -25 : 25, duration: 0.5, ease: "power2.out"
                        });
                    }
                });
            });

            // ── PORTFOLIO CARDS: scale pop on enter ──
            ScrollTrigger.batch(".work-card", {
                start: "top 92%",
                once: true,
                onEnter: (batch) => {
                    gsap.from(batch, {
                        scale: 0.95, duration: 0.4, stagger: 0.06, ease: "power2.out"
                    });
                }
            });

            // ── TESTIMONIAL CARDS: stagger ──
            let testimonialCards = gsap.utils.toArray(".testimonial-card");
            if (testimonialCards.length) {
                ScrollTrigger.create({
                    trigger: ".testimonials-grid",
                    start: "top 80%",
                    once: true,
                    onEnter: () => {
                        gsap.from(testimonialCards, {
                            y: 15, duration: 0.4, stagger: 0.1, ease: "power2.out"
                        });
                    }
                });
            }

        }); // end matchMedia
    }
    // If GSAP doesn't load, the IO + CSS system handles everything.

});
