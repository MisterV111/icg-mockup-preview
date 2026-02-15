/* ═══════════════════════════════════════════════════════════════
   ORCHESTRATION ANIMATION — Scroll-driven agent flow
   Self-contained: no impact on existing scripts
   Dependencies: GSAP 3.12, ScrollTrigger, DrawSVGPlugin
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // Bail if GSAP isn't loaded or reduced motion preferred
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Register DrawSVG if available
    if (typeof DrawSVGPlugin !== 'undefined') gsap.registerPlugin(DrawSVGPlugin);

    var container = document.querySelector('.orchestration');
    var sticky = document.querySelector('.orchestration-sticky');
    if (!container || !sticky) return;

    // ─── Helper: show node with animation ───
    function nodeIn(id, props) {
        var defaults = { autoAlpha: 1, duration: 0.3, ease: 'power2.out' };
        var el = document.getElementById(id);
        if (!el) return;
        return gsap.to(el, Object.assign(defaults, props || {}));
    }

    // ─── Helper: draw SVG line ───
    function drawLine(id, duration) {
        var el = document.getElementById(id);
        if (!el) return;
        var len = el.getTotalLength ? el.getTotalLength() : 100;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        return gsap.to(el, { strokeDashoffset: 0, duration: duration || 0.5, ease: 'none' });
    }

    // ─── Pre-hide all nodes ───
    gsap.set('.orch-node, .orch-track, .orch-stat, .orch-header', { autoAlpha: 0 });

    // ─── Pre-set all lines hidden ───
    document.querySelectorAll('.orch-line').forEach(function(line) {
        var len = line.getTotalLength ? line.getTotalLength() : 100;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    });

    // ─── Master Timeline ───
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: false // using position:sticky instead
        }
    });

    // ─── Phase 0: Header (0% → 5%) ───
    tl.to('#orch-header', { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0);

    // ─── Phase 1: Brief Enters (5% → 15%) ───
    tl.to('#node-brief', { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' }, 0.3);
    tl.add(function() {
        drawLine('line-brief-strategic', 0.5);
    }, 0.6);

    // ─── Phase 2: Strategic Layer (15% → 30%) ───
    tl.to('#node-strategic', { autoAlpha: 1, duration: 0.3 }, 0.8);
    tl.to('#node-strategic', { className: '+=orch-node--active', duration: 0.01 }, 0.85);

    // Agents fan out
    tl.to('#agent-research', { autoAlpha: 1, x: 0, duration: 0.3 }, 1.0);
    tl.to('#agent-script', { autoAlpha: 1, x: 0, duration: 0.3 }, 1.15);
    tl.to('#agent-mood', { autoAlpha: 1, x: 0, duration: 0.3 }, 1.3);

    // Outputs appear
    tl.to('#output-research', { autoAlpha: 1, duration: 0.2 }, 1.5);
    tl.to('#output-brief', { autoAlpha: 1, duration: 0.2 }, 1.6);
    tl.to('#output-shots', { autoAlpha: 1, duration: 0.2 }, 1.7);

    // Strategic deactivates
    tl.to('#node-strategic', { className: '-=orch-node--active', duration: 0.01 }, 1.9);

    // Line to coordination
    tl.add(function() {
        drawLine('line-strategic-coord', 0.4);
    }, 1.8);

    // ─── Phase 3: Coordination Layer (30% → 45%) ───
    tl.to('#node-coordination', { autoAlpha: 1, duration: 0.3 }, 2.0);
    tl.to('#node-coordination', { className: '+=orch-node--active', duration: 0.01 }, 2.05);

    // Lines fan out to 4 specialists
    tl.add(function() { drawLine('line-coord-spec1', 0.4); }, 2.3);
    tl.add(function() { drawLine('line-coord-spec2', 0.4); }, 2.35);
    tl.add(function() { drawLine('line-coord-spec3', 0.4); }, 2.4);
    tl.add(function() { drawLine('line-coord-spec4', 0.4); }, 2.45);

    tl.to('#node-coordination', { className: '-=orch-node--active', duration: 0.01 }, 2.7);

    // ─── Phase 4: Specialist Layer (45% → 65%) ───
    // Agents appear
    tl.to('#spec-video', { autoAlpha: 1, duration: 0.2 }, 2.8);
    tl.to('#spec-image', { autoAlpha: 1, duration: 0.2 }, 2.9);
    tl.to('#spec-music', { autoAlpha: 1, duration: 0.2 }, 3.0);
    tl.to('#spec-copy', { autoAlpha: 1, duration: 0.2 }, 3.1);

    // Add pulse to all active specialists
    tl.to(['#spec-video','#spec-image','#spec-music','#spec-copy'].join(','), {
        className: '+=orch-node--pulse', duration: 0.01
    }, 3.2);

    // Progress tracks appear and fill
    tl.to('#track-video', { autoAlpha: 1, duration: 0.2 }, 3.2);
    tl.to('#track-image', { autoAlpha: 1, duration: 0.2 }, 3.25);
    tl.to('#track-music', { autoAlpha: 1, duration: 0.2 }, 3.3);
    tl.to('#track-copy', { autoAlpha: 1, duration: 0.2 }, 3.35);

    // Bars fill up
    tl.to('#fill-video', { width: '100%', duration: 0.8, ease: 'power1.inOut' }, 3.4);
    tl.to('#fill-image', { width: '100%', duration: 0.9, ease: 'power1.inOut' }, 3.45);
    tl.to('#fill-music', { width: '100%', duration: 0.7, ease: 'power1.inOut' }, 3.5);
    tl.to('#fill-copy', { width: '100%', duration: 0.85, ease: 'power1.inOut' }, 3.55);

    // Remove pulse
    tl.to(['#spec-video','#spec-image','#spec-music','#spec-copy'].join(','), {
        className: '-=orch-node--pulse', duration: 0.01
    }, 4.3);

    // Lines converge to verification
    tl.add(function() { drawLine('line-spec-verify1', 0.3); }, 4.3);
    tl.add(function() { drawLine('line-spec-verify2', 0.3); }, 4.35);
    tl.add(function() { drawLine('line-spec-verify3', 0.3); }, 4.4);
    tl.add(function() { drawLine('line-spec-verify4', 0.3); }, 4.45);

    // ─── Phase 5: Verification (65% → 80%) ───
    tl.to('#node-verification', { autoAlpha: 1, duration: 0.3 }, 4.6);
    tl.to('#node-verification', { className: '+=orch-node--active', duration: 0.01 }, 4.65);

    tl.to('#agent-qa', { autoAlpha: 1, duration: 0.2 }, 4.7);
    tl.to('#agent-qa', { className: '+=orch-node--pulse', duration: 0.01 }, 4.75);

    // Brand score counter
    tl.to('#output-score', { autoAlpha: 1, duration: 0.2 }, 4.8);
    tl.to({ val: 0 }, {
        val: 97,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: function() {
            var el = document.getElementById('brand-score');
            if (el) el.textContent = Math.round(this.targets()[0].val);
        }
    }, 4.9);

    tl.to('#agent-qa', { className: '-=orch-node--pulse', duration: 0.01 }, 5.2);
    tl.to('#node-verification', { className: '-=orch-node--active', duration: 0.01 }, 5.3);

    // Line to assembly
    tl.add(function() { drawLine('line-verify-assembly', 0.4); }, 5.2);

    // ─── Phase 6: Assembly & Delivery (80% → 100%) ───
    tl.to('#node-assembly', { autoAlpha: 1, duration: 0.3 }, 5.4);
    tl.to('#node-assembly', { className: '+=orch-node--active', duration: 0.01 }, 5.45);

    // Final deliverable
    tl.to('#node-final', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, 5.6);
    gsap.set('#node-final', { scale: 0.8 });

    // Completion stat
    tl.to('#orch-stat', { autoAlpha: 1, y: 0, duration: 0.3 }, 5.9);
    gsap.set('#orch-stat', { y: 20 });

    tl.to('#node-assembly', { className: '-=orch-node--active', duration: 0.01 }, 6.0);

    // ─── Parallax Background ───
    gsap.to('#orch-bg-1', {
        y: -80, rotation: 5, scale: 1.05,
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2
        }
    });

    gsap.to('#orch-bg-2', {
        y: -120, rotation: -3, scale: 1.1,
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5
        }
    });

    gsap.to('#orch-bg-3', {
        y: -50, rotation: 8, scale: 0.95,
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 3
        }
    });

    // Background red glow intensifies as orchestration progresses
    gsap.to('.orch-bg', {
        background: 'radial-gradient(ellipse at center, rgba(232,0,13,0.03) 0%, transparent 70%)',
        scrollTrigger: {
            trigger: container,
            start: '60% top',
            end: 'bottom bottom',
            scrub: 2
        }
    });

})();
