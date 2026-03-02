/* ============================================================
   architecture-animations.js
   GSAP animations + dynamic content for ICG Architecture page
   ============================================================ */

(function () {
  'use strict';

  /* ── Data ─────────────────────────────────────────────── */

  var agents = [
    { name: 'Claudia', role: 'Coordinator', color: '#E8000D', desc: 'Manages all agents, routes tasks, tracks progress, reports status' },
    { name: 'Pixel', role: 'Design', color: '#A855F7', desc: 'Website design, brand visuals, UI/UX, image generation, design QA' },
    { name: 'Reel', role: 'Video', color: '#F59E0B', desc: 'Video production, motion graphics, editing, compositing' },
    { name: 'Buzz', role: 'Social Media', color: '#3B82F6', desc: 'LinkedIn content, social strategy, post scheduling' },
    { name: 'Scout', role: 'Research', color: '#22C55E', desc: 'Market research, competitor analysis, trend monitoring' },
    { name: 'Reach', role: 'Outreach', color: '#EC4899', desc: 'Email campaigns, client communications, lead nurturing' },
    { name: 'Dev', role: 'Software', color: '#14B8A6', desc: 'Web development, automation scripts, tool building' },
    { name: 'Forge', role: 'Local LLM', color: '#F97316', desc: 'On-device AI processing, local model management' },
    { name: 'Jane', role: 'Personal', color: '#6B7280', desc: 'Home automation, personal tasks, scheduling' }
  ];

  var execCategories = [
    { name: 'Video', count: '7 Agents', color: '#F59E0B', desc: 'Generation, editing, compositing, format conversion, prompt engineering' },
    { name: 'Image', count: '5 Agents', color: '#A855F7', desc: 'Generation, editing, upscaling, style analysis, prompt optimization' },
    { name: 'Music', count: '2 Agents', color: '#22C55E', desc: 'AI music generation, style analysis, copyright-safe production' },
    { name: 'Audio', count: '6 Agents', color: '#3B82F6', desc: 'Text-to-speech, audio editing, transient analysis, format processing' },
    { name: 'Analysis', count: '7 Agents', color: '#EC4899', desc: 'Content analysis, quality validation, multimodal understanding' },
    { name: 'Orchestrators', count: '4 Agents', color: '#14B8A6', desc: 'Pipeline coordination, workflow routing, dependency management' },
    { name: 'Production', count: '5 Agents', color: '#F97316', desc: 'Assembly direction, art direction, cinematography, storyboarding' },
    { name: 'Utility', count: '5 Agents', color: '#6B7280', desc: 'File processing, format conversion, batch operations' }
  ];

  var pipelines = [
    { name: 'Video', steps: ['Concept', 'Generation', 'Editing', 'Compositing', 'Delivery'] },
    { name: 'Music', steps: ['Direction', 'Generation', 'Editing', 'Mixing', 'Mastering'] },
    { name: 'Design', steps: ['Brief', 'Generation', 'QA', 'Brand Check', 'Export'] },
    { name: 'Audio', steps: ['Script', 'Recording', 'Cleanup', 'Mixing', 'Format'] }
  ];

  var memoryLayers = [
    { num: 1, tool: 'Obsidian', purpose: 'Knowledge Graph' },
    { num: 2, tool: 'Notion', purpose: 'Task Board' },
    { num: 3, tool: 'Mem0', purpose: 'Durable Memory' },
    { num: 4, tool: 'Google Workspace', purpose: 'Email \u00b7 Calendar \u00b7 Drive' },
    { num: 5, tool: 'Daily Logs', purpose: 'Operational History' },
    { num: 6, tool: 'Team Playbook', purpose: 'Technical Learnings' }
  ];

  /* ── Helpers ──────────────────────────────────────────── */

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* ── Render Agent Cards (Section 3) ──────────────────── */

  var agentGrid = document.getElementById('archAgentGrid');
  if (agentGrid) {
    agents.forEach(function (a) {
      var card = document.createElement('div');
      card.className = 'arch-card arch-agent-card gsap-animate';
      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.innerHTML =
        '<div class="arch-agent-header">' +
          '<span class="arch-agent-dot" style="background:' + a.color + ';box-shadow:0 0 8px ' + a.color + '50"></span>' +
          '<span class="arch-agent-name">' + esc(a.name) + '</span>' +
          '<span class="arch-agent-role">' + esc(a.role) + '</span>' +
        '</div>' +
        '<div class="arch-card-detail">' +
          '<div class="arch-card-detail-inner">' + esc(a.desc) + '</div>' +
        '</div>';
      agentGrid.appendChild(card);
    });
  }

  /* ── Render Execution Cards (Section 5) ──────────────── */

  var execGrid = document.getElementById('archExecGrid');
  if (execGrid) {
    execCategories.forEach(function (c) {
      var card = document.createElement('div');
      card.className = 'arch-card arch-exec-card gsap-animate';
      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.innerHTML =
        '<div class="arch-exec-dot" style="background:' + c.color + ';box-shadow:0 0 8px ' + c.color + '50"></div>' +
        '<div class="arch-exec-name">' + esc(c.name) + '</div>' +
        '<div class="arch-exec-count">' + esc(c.count) + '</div>' +
        '<div class="arch-card-detail">' +
          '<div class="arch-card-detail-inner">' + esc(c.desc) + '</div>' +
        '</div>';
      execGrid.appendChild(card);
    });
  }

  /* ── Render Pipeline Cards (Section 6) ────────────────── */

  var pipelinesGrid = document.getElementById('archPipelinesGrid');
  if (pipelinesGrid) {
    pipelines.forEach(function (p) {
      var stepsHtml = p.steps.map(function (s, i) {
          var arrow = i < p.steps.length - 1 ? '<span class="arch-pipeline-arrow">\u2192</span>' : '';
          return '<span class="arch-pipeline-step">' + esc(s) + '</span>' + arrow;
        }).join('');
      var card = document.createElement('div');
      card.className = 'arch-card arch-pipeline-card gsap-animate';
      card.innerHTML =
        '<div class="arch-pipeline-name">' + esc(p.name) + '</div>' +
        '<div class="arch-pipeline-steps">' + stepsHtml + '</div>';
      pipelinesGrid.appendChild(card);
    });
  }

  /* ── Render Memory Layers (Section 7) ─────────────────── */

  var memoryStack = document.getElementById('archMemoryStack');
  if (memoryStack) {
    memoryLayers.forEach(function (m) {
      var layer = document.createElement('div');
      layer.className = 'arch-memory-layer gsap-animate';
      layer.innerHTML =
        '<span class="arch-memory-num">' + m.num + '</span>' +
        '<span class="arch-memory-tool">' + esc(m.tool) + '</span>' +
        '<span class="arch-memory-purpose">' + esc(m.purpose) + '</span>';
      memoryStack.appendChild(layer);
    });
  }

  /* ── Accordion Behavior ──────────────────────────────── */

  function setupAccordions(container) {
    if (!container) return;
    var cards = container.querySelectorAll('[aria-expanded]');
    cards.forEach(function (card) {
      function toggle() {
        var expanded = card.getAttribute('aria-expanded') === 'true';
        var detail = card.querySelector('.arch-card-detail');
        if (!detail) return;

        if (!expanded) {
          card.setAttribute('aria-expanded', 'true');
          gsap.fromTo(detail,
            { height: 0, autoAlpha: 0 },
            { height: 'auto', autoAlpha: 1, duration: 0.4, ease: 'power2.out' }
          );
        } else {
          gsap.to(detail, {
            height: 0, autoAlpha: 0, duration: 0.3, ease: 'power2.in',
            onComplete: function () { card.setAttribute('aria-expanded', 'false'); }
          });
        }
      }
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }

  setupAccordions(agentGrid);
  setupAccordions(execGrid);

  /* ── Form Handling ───────────────────────────────────── */

  var form = document.getElementById('archForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = data.get('name');
      var email = data.get('email');

      // Honeypot check
      if (data.get('_gotcha')) return;

      var btn = form.querySelector('.arch-form-btn');
      btn.textContent = 'Sending\u2026';
      btn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.style.display = 'none';
          var success = document.getElementById('archFormSuccess');
          if (success) success.style.display = 'block';

          // Trigger PDF download
          var a = document.createElement('a');
          a.href = '/assets/downloads/prompt-engineering-toolkit-2026.pdf';
          a.download = 'prompt-engineering-toolkit-2026.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          // Fire GAS auto-reply
          var gasUrl = 'https://script.google.com/macros/s/AKfycbyBt62avorESe_eb_nTW6QyCAN3LllspGAsl5bKW6pYltmnfA9GS9f_Y2TdiXWTrSwb/exec';
          fetch(gasUrl + '?email=' + encodeURIComponent(email) + '&name=' + encodeURIComponent(name), { mode: 'no-cors' });
        } else {
          btn.textContent = 'Download Free Toolkit';
          btn.disabled = false;
        }
      }).catch(function () {
        btn.textContent = 'Download Free Toolkit';
        btn.disabled = false;
      });
    });
  }

  /* ── Mobile Nav Toggle ───────────────────────────────── */

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var navEl = document.getElementById('nav');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      var isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      if (navEl) navEl.classList.toggle('nav-open');
    });
  }

  /* ── GSAP Animations ─────────────────────────────────── */

  gsap.registerPlugin(ScrollTrigger);

  // Respect prefers-reduced-motion
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Show everything immediately
    document.querySelectorAll('.gsap-animate').forEach(function (el) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });
    // Set counter to final value
    var counter = document.getElementById('archCounter');
    if (counter) counter.textContent = '50';
    // Show bridge line
    var bridgeLine = document.getElementById('archBridgeLine');
    if (bridgeLine) bridgeLine.style.transform = 'scaleX(1)';
    return; // exit early — no animations
  }

  // Default ease
  var ease = 'power3.out';

  /* 1. Hero counter: 0 → 50 */
  var counterEl = document.getElementById('archCounter');
  if (counterEl) {
    var obj = { val: 0 };
    gsap.to(obj, {
      val: 50,
      duration: 2,
      ease: 'power2.out',
      delay: 0.5,
      onUpdate: function () {
        counterEl.textContent = Math.round(obj.val);
      }
    });
  }

  /* 2. Hero elements fade up */
  gsap.utils.toArray('#arch-hero .gsap-animate').forEach(function (el, i) {
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      delay: 0.3 + i * 0.12,
      ease: ease,
      immediateRender: true
    });
  });

  /* 3. Section headings & labels */
  gsap.utils.toArray('.arch-section-heading.gsap-animate, .arch-section-label.gsap-animate, .arch-section-copy.gsap-animate').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      y: 40,
      autoAlpha: 0,
      duration: 0.7,
      ease: ease,
      immediateRender: true
    });
  });

  /* 4. Human cards — slide from sides */
  var juanCard = document.getElementById('arch-human-juan');
  var sandyCard = document.getElementById('arch-human-sandy');
  if (juanCard) {
    gsap.from(juanCard, {
      scrollTrigger: { trigger: juanCard, start: 'top 85%', once: true },
      x: -60, autoAlpha: 0, duration: 0.8, ease: ease, immediateRender: true
    });
  }
  if (sandyCard) {
    gsap.from(sandyCard, {
      scrollTrigger: { trigger: sandyCard, start: 'top 85%', once: true },
      x: 60, autoAlpha: 0, duration: 0.8, ease: ease, immediateRender: true
    });
  }

  /* 5. Communication bubbles */
  gsap.utils.toArray('.arch-chat-bubbles .arch-bubble').forEach(function (el, i) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      y: 20, autoAlpha: 0, duration: 0.5, delay: i * 0.15, ease: ease, immediateRender: true
    });
  });

  /* 6. Agent cards — batch */
  ScrollTrigger.batch('#archAgentGrid .arch-agent-card', {
    start: 'top 88%',
    once: true,
    onEnter: function (batch) {
      gsap.from(batch, {
        y: 40, autoAlpha: 0, scale: 0.95,
        stagger: 0.08, duration: 0.6, ease: ease, immediateRender: true
      });
    }
  });

  /* 7. Hardware badges */
  gsap.utils.toArray('.arch-hw-badge.gsap-animate').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      y: 20, autoAlpha: 0, duration: 0.6, ease: ease, immediateRender: true
    });
  });

  /* 8. Bridge line — scaleX from 0 */
  var bridgeLine = document.getElementById('archBridgeLine');
  if (bridgeLine) {
    gsap.to(bridgeLine, {
      scrollTrigger: { trigger: bridgeLine, start: 'top 80%', once: true },
      scaleX: 1, duration: 1.2, ease: 'power2.out'
    });
  }

  /* 9. Execution cards — batch */
  ScrollTrigger.batch('#archExecGrid .arch-exec-card', {
    start: 'top 88%',
    once: true,
    onEnter: function (batch) {
      gsap.from(batch, {
        y: 40, autoAlpha: 0, scale: 0.95,
        stagger: 0.08, duration: 0.6, ease: ease, immediateRender: true
      });
    }
  });

  /* 10. MCP badges */
  gsap.utils.toArray('.arch-mcp-badge').forEach(function (el, i) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      y: 15, autoAlpha: 0, duration: 0.4, delay: i * 0.06, ease: ease, immediateRender: true
    });
  });

  /* 11. Pipeline cards */
  ScrollTrigger.batch('#archPipelinesGrid .arch-pipeline-card', {
    start: 'top 88%',
    once: true,
    onEnter: function (batch) {
      gsap.from(batch, {
        y: 40, autoAlpha: 0,
        stagger: 0.12, duration: 0.6, ease: ease, immediateRender: true
      });
    }
  });

  /* 12. Pipeline steps — sequential highlight (after card reveal) */
  document.querySelectorAll('.arch-pipeline-card').forEach(function (card) {
    var steps = card.querySelectorAll('.arch-pipeline-step, .arch-pipeline-arrow');
    steps.forEach(function (step, i) {
      gsap.set(step, { autoAlpha: 1 });
    });
  });

  /* 13. Memory layers — stack reveal */
  gsap.utils.toArray('.arch-memory-layer').forEach(function (el, i) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      y: 30, autoAlpha: 0, duration: 0.5, delay: i * 0.12, ease: ease, immediateRender: true
    });
  });

  /* 14. CTA — scale in */
  var ctaInner = document.querySelector('.arch-cta-inner');
  if (ctaInner) {
    gsap.from(ctaInner, {
      scrollTrigger: { trigger: ctaInner, start: 'top 85%', once: true },
      scale: 0.95, autoAlpha: 0, duration: 0.8, ease: ease, immediateRender: true
    });
  }

  /* 15. Agent count labels */
  gsap.utils.toArray('.arch-agent-count.gsap-animate').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      y: 20, autoAlpha: 0, duration: 0.5, ease: ease, immediateRender: true
    });
  });

  /* 16. MCP label */
  gsap.utils.toArray('.arch-mcp-label.gsap-animate').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      y: 20, autoAlpha: 0, duration: 0.5, ease: ease, immediateRender: true
    });
  });

  /* 17. Comm icon */
  gsap.utils.toArray('.arch-comm-icon.gsap-animate').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      scale: 0.8, autoAlpha: 0, duration: 0.6, ease: ease, immediateRender: true
    });
  });

})();
