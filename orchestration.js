/* ═══════════════════════════════════════════════════════════════
   ORCHESTRATION ANIMATION — Scroll-driven agent flow
   Self-contained: no impact on existing scripts
   Dependencies: GSAP 3.12+, ScrollTrigger
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (typeof DrawSVGPlugin !== 'undefined') gsap.registerPlugin(DrawSVGPlugin);

    var container = document.querySelector('.orchestration');
    if (!container) return;

    function $(id) { return document.getElementById(id); }

    // ─── Pre-hide everything ───
    gsap.set('.orch-node, .orch-track, .orch-stat', { autoAlpha: 0 });
    gsap.set('#orch-header', { autoAlpha: 0, y: 20 });
    gsap.set('#node-brief', { autoAlpha: 0, scale: 0.9 });
    gsap.set('#node-final', { autoAlpha: 0, scale: 0.85 });
    gsap.set('#orch-stat', { autoAlpha: 0, y: 20 });
    gsap.set('#agent-research', { autoAlpha: 0, x: -20 });
    gsap.set('#agent-script', { autoAlpha: 0, x: -20 });
    gsap.set('#agent-mood', { autoAlpha: 0, x: 20 });

    // ─── SVG Line Setup — hide all ───
    document.querySelectorAll('.orch-line').forEach(function(line) {
        if (line.getTotalLength) {
            var len = line.getTotalLength();
            gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        }
    });

    // Helper: draw line in timeline
    function draw(id, tl, pos, dur) {
        tl.to(id, { strokeDashoffset: 0, duration: dur || 0.3, ease: 'none' }, pos);
    }

    // Helper: activate/deactivate node glow
    function glow(id, tl, pos) {
        tl.to(id, {
            borderColor: '#E8000D',
            boxShadow: '0 0 20px rgba(232,0,13,0.2), 0 0 40px rgba(232,0,13,0.1)',
            duration: 0.2
        }, pos);
    }
    function unglow(id, tl, pos) {
        tl.to(id, {
            borderColor: '#222222',
            boxShadow: '0 0 0px rgba(232,0,13,0)',
            duration: 0.3
        }, pos);
    }

    // ─── Master Timeline ───
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2
        }
    });

    // ═══ PHASE 0: Header appears ═══
    tl.to('#orch-header', { autoAlpha: 1, y: 0, duration: 0.4 }, 0);

    // ═══ PHASE 1: Brief Card drops in (after header is visible) ═══
    tl.to('#node-brief', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }, 0.5);

    // Line draws FROM brief DOWN to strategic
    draw('#line-brief-strategic', tl, 0.9, 0.4);

    // ═══ PHASE 2: Strategic Layer — line arrives, THEN node appears ═══
    tl.to('#node-strategic', { autoAlpha: 1, duration: 0.3 }, 1.3);
    glow('node-strategic', tl, 1.35);

    // Lines draw FROM strategic TO each agent → agent appears at end of line
    // Research (left)
    tl.to('#agent-research', { autoAlpha: 1, x: 0, duration: 0.25 }, 1.5);
    // Script (left below)
    tl.to('#agent-script', { autoAlpha: 1, x: 0, duration: 0.25 }, 1.65);
    // Mood Board (right)
    tl.to('#agent-mood', { autoAlpha: 1, x: 0, duration: 0.25 }, 1.8);

    // Agents produce outputs — appear sequentially
    tl.to('#output-research', { autoAlpha: 1, duration: 0.2 }, 2.0);
    tl.to('#output-brief', { autoAlpha: 1, duration: 0.2 }, 2.1);
    tl.to('#output-shots', { autoAlpha: 1, duration: 0.2 }, 2.2);

    unglow('node-strategic', tl, 2.3);

    // Line draws FROM strategic DOWN to coordination
    draw('#line-strategic-coord', tl, 2.3, 0.4);

    // ═══ PHASE 3: Coordination — line arrives, node appears ═══
    tl.to('#node-coordination', { autoAlpha: 1, duration: 0.3 }, 2.7);
    glow('node-coordination', tl, 2.75);

    // Lines fan out FROM coordination TO each specialist — draw simultaneously
    draw('#line-coord-spec1', tl, 2.9, 0.4);
    draw('#line-coord-spec2', tl, 2.95, 0.4);
    draw('#line-coord-spec3', tl, 3.0, 0.4);
    draw('#line-coord-spec4', tl, 3.05, 0.4);

    unglow('node-coordination', tl, 3.3);

    // ═══ PHASE 4: Specialists — lines arrive, agents appear at endpoints ═══
    tl.to('#spec-video', { autoAlpha: 1, duration: 0.2 }, 3.3);
    glow('spec-video', tl, 3.35);
    tl.to('#spec-image', { autoAlpha: 1, duration: 0.2 }, 3.4);
    glow('spec-image', tl, 3.45);
    tl.to('#spec-music', { autoAlpha: 1, duration: 0.2 }, 3.5);
    glow('spec-music', tl, 3.55);
    tl.to('#spec-copy', { autoAlpha: 1, duration: 0.2 }, 3.6);
    glow('spec-copy', tl, 3.65);

    // Progress tracks appear right with their agent
    tl.to('#track-video', { autoAlpha: 1, duration: 0.15 }, 3.4);
    tl.to('#track-image', { autoAlpha: 1, duration: 0.15 }, 3.5);
    tl.to('#track-music', { autoAlpha: 1, duration: 0.15 }, 3.6);
    tl.to('#track-copy', { autoAlpha: 1, duration: 0.15 }, 3.7);

    // Bars fill up — the visual centerpiece
    tl.to('#fill-video', { width: '100%', duration: 0.6, ease: 'power1.inOut' }, 3.7);
    tl.to('#fill-image', { width: '100%', duration: 0.7, ease: 'power1.inOut' }, 3.75);
    tl.to('#fill-music', { width: '100%', duration: 0.5, ease: 'power1.inOut' }, 3.8);
    tl.to('#fill-copy', { width: '100%', duration: 0.65, ease: 'power1.inOut' }, 3.85);

    // Specialists unglow after work complete
    unglow('spec-video', tl, 4.3);
    unglow('spec-image', tl, 4.3);
    unglow('spec-music', tl, 4.3);
    unglow('spec-copy', tl, 4.3);

    // Lines converge FROM specialists TO verification — draw simultaneously
    draw('#line-spec-verify1', tl, 4.3, 0.3);
    draw('#line-spec-verify2', tl, 4.35, 0.3);
    draw('#line-spec-verify3', tl, 4.4, 0.3);
    draw('#line-spec-verify4', tl, 4.45, 0.3);

    // ═══ PHASE 5: Verification — lines arrive, node appears ═══
    tl.to('#node-verification', { autoAlpha: 1, duration: 0.3 }, 4.6);
    glow('node-verification', tl, 4.65);

    // QA agent appears connected
    tl.to('#agent-qa', { autoAlpha: 1, duration: 0.2 }, 4.7);
    glow('agent-qa', tl, 4.75);

    // Brand score counter
    tl.to('#output-score', { autoAlpha: 1, duration: 0.2 }, 4.8);
    var scoreObj = { val: 0 };
    tl.to(scoreObj, {
        val: 97,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: function() {
            var el = $('brand-score');
            if (el) el.textContent = Math.round(scoreObj.val);
        }
    }, 4.9);

    unglow('agent-qa', tl, 5.1);
    unglow('node-verification', tl, 5.15);

    // Line draws TO assembly
    draw('#line-verify-assembly', tl, 5.1, 0.3);

    // ═══ PHASE 6: Assembly — line arrives, node appears ═══
    tl.to('#node-assembly', { autoAlpha: 1, duration: 0.3 }, 5.4);
    glow('node-assembly', tl, 5.45);

    // Final deliverable
    tl.to('#node-final', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, 5.6);

    // Completion stat
    tl.to('#orch-stat', { autoAlpha: 1, y: 0, duration: 0.3 }, 5.9);

    unglow('node-assembly', tl, 6.0);

    // ─── Parallax Background ───
    gsap.to('#orch-bg-1', {
        y: -80, rotation: 5, scale: 1.05,
        scrollTrigger: { trigger: container, start: 'top top', end: 'bottom bottom', scrub: 2 }
    });

    gsap.to('#orch-bg-2', {
        y: -120, rotation: -3, scale: 1.1,
        scrollTrigger: { trigger: container, start: 'top top', end: 'bottom bottom', scrub: 1.5 }
    });

    gsap.to('#orch-bg-3', {
        y: -50, rotation: 8, scale: 0.95,
        scrollTrigger: { trigger: container, start: 'top top', end: 'bottom bottom', scrub: 3 }
    });

    // Red glow intensifies
    var bgEl = document.querySelector('.orch-bg');
    if (bgEl) {
        gsap.fromTo(bgEl,
            { background: 'radial-gradient(ellipse at center, rgba(232,0,13,0) 0%, transparent 70%)' },
            {
                background: 'radial-gradient(ellipse at center, rgba(232,0,13,0.08) 0%, transparent 70%)',
                scrollTrigger: { trigger: container, start: '50% top', end: 'bottom bottom', scrub: 2 }
            }
        );
    }

})();
