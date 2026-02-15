/* ═══════════════════════════════════════════════════════════════
   ORCHESTRATION ANIMATION — Scroll-driven agent flow
   Self-contained: no impact on existing scripts
   Dependencies: GSAP 3.12+, ScrollTrigger
   Optional: DrawSVGPlugin (falls back to strokeDashoffset)
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (typeof DrawSVGPlugin !== 'undefined') gsap.registerPlugin(DrawSVGPlugin);

    var container = document.querySelector('.orchestration');
    if (!container) return;

    // ─── Utility: get element by ID safely ───
    function $(id) { return document.getElementById(id); }

    // ─── Pre-hide everything ───
    gsap.set('.orch-node, .orch-track, .orch-stat', { autoAlpha: 0 });
    gsap.set('#orch-header', { autoAlpha: 0, y: 20 });
    gsap.set('#node-brief', { autoAlpha: 0, y: -20 });
    gsap.set('#node-final', { autoAlpha: 0, scale: 0.8 });
    gsap.set('#orch-stat', { autoAlpha: 0, y: 20 });

    // Pre-set agent nodes with offset for entrance
    gsap.set('#agent-research', { autoAlpha: 0, x: -30 });
    gsap.set('#agent-script', { autoAlpha: 0, x: -30 });
    gsap.set('#agent-mood', { autoAlpha: 0, x: 30 });

    // ─── SVG Line Setup ───
    var lines = document.querySelectorAll('.orch-line');
    lines.forEach(function(line) {
        if (line.getTotalLength) {
            var len = line.getTotalLength();
            gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        }
    });

    function drawLine(id, tl, position, dur) {
        var el = $(id);
        if (!el) return;
        tl.to(el, { strokeDashoffset: 0, duration: dur || 0.4, ease: 'none' }, position);
    }

    function activateNode(id, tl, position) {
        var el = $(id);
        if (!el) return;
        tl.to(el, {
            borderColor: '#E8000D',
            boxShadow: '0 0 20px rgba(232,0,13,0.15), 0 0 40px rgba(232,0,13,0.08)',
            duration: 0.3
        }, position);
    }

    function deactivateNode(id, tl, position) {
        var el = $(id);
        if (!el) return;
        tl.to(el, {
            borderColor: '#222222',
            boxShadow: '0 0 0 rgba(232,0,13,0)',
            duration: 0.3
        }, position);
    }

    // ─── Master Timeline (scrub-linked to scroll) ───
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2
        }
    });

    // === PHASE 0: Header (0→0.3) ===
    tl.to('#orch-header', { autoAlpha: 1, y: 0, duration: 0.3 }, 0);

    // === PHASE 1: Brief Enters (0.3→0.8) ===
    tl.to('#node-brief', { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' }, 0.3);
    drawLine('line-brief-strategic', tl, 0.6, 0.3);

    // === PHASE 2: Strategic Layer (0.8→1.8) ===
    tl.to('#node-strategic', { autoAlpha: 1, duration: 0.3 }, 0.8);
    activateNode('node-strategic', tl, 0.85);

    // Agents fan out
    tl.to('#agent-research', { autoAlpha: 1, x: 0, duration: 0.25 }, 1.0);
    tl.to('#agent-script', { autoAlpha: 1, x: 0, duration: 0.25 }, 1.1);
    tl.to('#agent-mood', { autoAlpha: 1, x: 0, duration: 0.25 }, 1.2);

    // Outputs
    tl.to('#output-research', { autoAlpha: 1, duration: 0.2 }, 1.35);
    tl.to('#output-brief', { autoAlpha: 1, duration: 0.2 }, 1.45);
    tl.to('#output-shots', { autoAlpha: 1, duration: 0.2 }, 1.55);

    deactivateNode('node-strategic', tl, 1.7);
    drawLine('line-strategic-coord', tl, 1.7, 0.3);

    // === PHASE 3: Coordination Layer (2.0→2.8) ===
    tl.to('#node-coordination', { autoAlpha: 1, duration: 0.3 }, 2.0);
    activateNode('node-coordination', tl, 2.05);

    // Lines fan out to specialists
    drawLine('line-coord-spec1', tl, 2.3, 0.3);
    drawLine('line-coord-spec2', tl, 2.35, 0.3);
    drawLine('line-coord-spec3', tl, 2.4, 0.3);
    drawLine('line-coord-spec4', tl, 2.45, 0.3);

    deactivateNode('node-coordination', tl, 2.7);

    // === PHASE 4: Specialist Layer (2.8→4.3) ===
    // Agents appear
    tl.to('#spec-video', { autoAlpha: 1, duration: 0.2 }, 2.8);
    tl.to('#spec-image', { autoAlpha: 1, duration: 0.2 }, 2.9);
    tl.to('#spec-music', { autoAlpha: 1, duration: 0.2 }, 3.0);
    tl.to('#spec-copy', { autoAlpha: 1, duration: 0.2 }, 3.1);

    // Activate specialists
    ['spec-video','spec-image','spec-music','spec-copy'].forEach(function(id, i) {
        activateNode(id, tl, 3.15 + i * 0.05);
    });

    // Progress tracks appear
    tl.to('#track-video', { autoAlpha: 1, duration: 0.15 }, 3.3);
    tl.to('#track-image', { autoAlpha: 1, duration: 0.15 }, 3.35);
    tl.to('#track-music', { autoAlpha: 1, duration: 0.15 }, 3.4);
    tl.to('#track-copy', { autoAlpha: 1, duration: 0.15 }, 3.45);

    // Bars fill (the visual centerpiece)
    tl.to('#fill-video', { width: '100%', duration: 0.7, ease: 'power1.inOut' }, 3.5);
    tl.to('#fill-image', { width: '100%', duration: 0.8, ease: 'power1.inOut' }, 3.5);
    tl.to('#fill-music', { width: '100%', duration: 0.6, ease: 'power1.inOut' }, 3.55);
    tl.to('#fill-copy', { width: '100%', duration: 0.75, ease: 'power1.inOut' }, 3.55);

    // Deactivate specialists
    ['spec-video','spec-image','spec-music','spec-copy'].forEach(function(id) {
        deactivateNode(id, tl, 4.2);
    });

    // Lines converge to verification
    drawLine('line-spec-verify1', tl, 4.2, 0.25);
    drawLine('line-spec-verify2', tl, 4.25, 0.25);
    drawLine('line-spec-verify3', tl, 4.3, 0.25);
    drawLine('line-spec-verify4', tl, 4.35, 0.25);

    // === PHASE 5: Verification (4.5→5.3) ===
    tl.to('#node-verification', { autoAlpha: 1, duration: 0.3 }, 4.5);
    activateNode('node-verification', tl, 4.55);

    tl.to('#agent-qa', { autoAlpha: 1, duration: 0.2 }, 4.6);
    activateNode('agent-qa', tl, 4.65);

    // Brand score counter
    tl.to('#output-score', { autoAlpha: 1, duration: 0.2 }, 4.7);

    var scoreObj = { val: 0 };
    tl.to(scoreObj, {
        val: 97,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: function() {
            var el = $('brand-score');
            if (el) el.textContent = Math.round(scoreObj.val);
        }
    }, 4.8);

    deactivateNode('agent-qa', tl, 5.1);
    deactivateNode('node-verification', tl, 5.15);

    drawLine('line-verify-assembly', tl, 5.1, 0.3);

    // === PHASE 6: Assembly & Delivery (5.3→6.2) ===
    tl.to('#node-assembly', { autoAlpha: 1, duration: 0.3 }, 5.3);
    activateNode('node-assembly', tl, 5.35);

    // Final deliverable card
    tl.to('#node-final', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, 5.5);

    // Completion stat
    tl.to('#orch-stat', { autoAlpha: 1, y: 0, duration: 0.3 }, 5.8);

    deactivateNode('node-assembly', tl, 6.0);

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

    // Subtle red glow builds as orchestration progresses
    var bgEl = document.querySelector('.orch-bg');
    if (bgEl) {
        gsap.fromTo(bgEl,
            { background: 'radial-gradient(ellipse at center, rgba(232,0,13,0) 0%, transparent 70%)' },
            {
                background: 'radial-gradient(ellipse at center, rgba(232,0,13,0.04) 0%, transparent 70%)',
                scrollTrigger: { trigger: container, start: '50% top', end: 'bottom bottom', scrub: 2 }
            }
        );
    }

})();
