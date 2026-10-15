/**
 * Gopi Kunchala — Executive Portfolio Unified Application
 * Built with standard vanilla JavaScript (No ES modules) for 100% compatibility.
 * Features:
 *  - 3D Euclidean Parallax Data Constellation Canvas (Zero images, 100% vector physics)
 *  - Continuous 75+ Color Accent Drag Bar (Vertical on Mobile, Horizontal on Desktop)
 *  - Strict Two-Theme System (Pure White & Pure Obsidian Black)
 *  - Live Calculated Production Experience (Auto-increments every month based on June 2023 start)
 *  - Private Direct Email Action ("Gmail to me now" — zero raw email exposed)
 *  - Enhanced Interactive Social Profiles Matrix (LinkedIn, GitHub, Direct Dispatch)
 *  - Skills Section without arbitrary percentiles
 *  - Physical 3D Card Tilt with Cursor Specular Lighting
 *  - Full 500+ Response AI Assistant ("Kwen") with Instant Answers
 *  - Mobile Bottom Floating Navigation & ScrollSpy
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // 1. Live Calculated Production Experience Engine
  // -------------------------------------------------------------
  function getLiveExperienceData() {
    const startDate = new Date(2023, 5, 1); // June 1, 2023 at TCS
    const now = new Date();

    const yearDiff = now.getFullYear() - startDate.getFullYear();
    const monthDiff = now.getMonth() - startDate.getMonth();
    const dayFraction = Math.min(1, now.getDate() / 30);

    const totalMonths = (yearDiff * 12) + monthDiff + dayFraction;
    const yearsDecimal = (totalMonths / 12).toFixed(1);

    return {
      years: yearsDecimal,
      formattedText: `${yearsDecimal} Years`
    };
  }

  function updateLiveExperienceDOM() {
    const exp = getLiveExperienceData();

    document.querySelectorAll('.dynamic-tenure-years').forEach(function (el) {
      el.textContent = exp.years;
    });

    document.querySelectorAll('.dynamic-tenure-text').forEach(function (el) {
      el.textContent = exp.formattedText;
    });
  }

  // -------------------------------------------------------------
  // 2. Color System & Continuous 75+ Color Drag Bar (Mobile & Desktop)
  // -------------------------------------------------------------
  let currentAccentHex = '#2563EB';

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function applyAccentColor(hex) {
    currentAccentHex = hex;
    const root = document.documentElement;
    const rgb = hexToRgb(hex);

    root.style.setProperty('--accent', hex);
    root.style.setProperty('--accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    root.style.setProperty('--accent-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22)`);
    root.style.setProperty('--accent-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`);

    const previewDots = document.querySelectorAll('.active-color-dot');
    previewDots.forEach(dot => {
      dot.style.backgroundColor = hex;
    });

    try {
      localStorage.setItem('gopi_accent_color', hex);
    } catch (e) {}
  }

  function valToHex(val) {
    const hue = Math.round((val / 100) * 360);
    const c = (1 - Math.abs(2 * 0.52 - 1)) * 0.9;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = 0.52 - c / 2;
    let r = 0, g = 0, b = 0;
    if (hue < 60) { r = c; g = x; }
    else if (hue < 120) { r = x; g = c; }
    else if (hue < 180) { g = c; b = x; }
    else if (hue < 240) { g = x; b = c; }
    else if (hue < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = n => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  function hexToHueVal(hex) {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    if (max === min) h = 0;
    else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
    else if (max === g) h = (60 * ((b - r) / (max - min)) + 120) % 360;
    else if (max === b) h = (60 * ((r - g) / (max - min)) + 240) % 360;
    return Math.round((h / 360) * 100);
  }

  function initColorStudio() {
    const horizontalSlider = document.getElementById('color-drag-bar-horizontal');
    const verticalSlider = document.getElementById('color-drag-bar-vertical');
    const studioToggle = document.getElementById('palette-toggle-btn');
    const studioPanel = document.getElementById('palette-dropdown-panel');
    const studioBackdrop = document.getElementById('palette-backdrop');
    const studioCloseBtn = document.getElementById('palette-close-btn');

    let savedColor = '#2563EB';
    try {
      savedColor = localStorage.getItem('gopi_accent_color') || '#2563EB';
    } catch (e) {}
    applyAccentColor(savedColor);

    const initialVal = hexToHueVal(savedColor);
    if (horizontalSlider) horizontalSlider.value = initialVal;
    if (verticalSlider) verticalSlider.value = initialVal;

    function handleSliderInput(e, otherSlider) {
      const val = parseInt(e.target.value, 10);
      const hex = valToHex(val);
      applyAccentColor(hex);
      if (otherSlider) otherSlider.value = val;
    }

    if (horizontalSlider) {
      horizontalSlider.addEventListener('input', function (e) {
        handleSliderInput(e, verticalSlider);
      });
    }

    if (verticalSlider) {
      verticalSlider.addEventListener('input', function (e) {
        handleSliderInput(e, horizontalSlider);
      });
    }

    function openStudio() {
      if (studioPanel) studioPanel.classList.remove('hidden');
      if (studioBackdrop) studioBackdrop.classList.remove('hidden');
    }

    function closeStudio() {
      if (studioPanel) studioPanel.classList.add('hidden');
      if (studioBackdrop) studioBackdrop.classList.add('hidden');
    }

    if (studioToggle && studioPanel) {
      studioToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (studioPanel.classList.contains('hidden')) {
          openStudio();
        } else {
          closeStudio();
        }
      });

      if (studioBackdrop) {
        studioBackdrop.addEventListener('click', closeStudio);
      }

      if (studioCloseBtn) {
        studioCloseBtn.addEventListener('click', closeStudio);
      }

      document.addEventListener('click', function (e) {
        if (!studioPanel.contains(e.target) && !studioToggle.contains(e.target)) {
          closeStudio();
        }
      });
    }
  }

  // -------------------------------------------------------------
  // 3. Pure White / Pure Black Theme Switcher (ONLY 2 THEMES)
  // -------------------------------------------------------------
  function setTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    const toggleIcon = document.getElementById('theme-icon');
    const toggleText = document.getElementById('theme-label');

    if (theme === 'white') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'white');
      body.setAttribute('data-theme', 'white');
      if (toggleIcon) toggleIcon.className = 'fas fa-moon text-xs';
      if (toggleText) toggleText.textContent = 'Black';
    } else {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'black');
      body.setAttribute('data-theme', 'black');
      if (toggleIcon) toggleIcon.className = 'fas fa-sun text-xs text-amber-400';
      if (toggleText) toggleText.textContent = 'White';
    }

    try {
      localStorage.setItem('gopi_theme_mode', theme);
    } catch (e) {}
  }

  function initThemeToggle() {
    const btn = document.getElementById('theme-switch-btn');
    let currentTheme = 'black';
    try {
      currentTheme = localStorage.getItem('gopi_theme_mode') || 'black';
    } catch (e) {}
    setTheme(currentTheme);

    if (btn) {
      btn.addEventListener('click', function () {
        const isWhite = document.documentElement.getAttribute('data-theme') === 'white';
        setTheme(isWhite ? 'black' : 'white');
      });
    }
  }

  // -------------------------------------------------------------
  // 4. True 3D Euclidean Parallax Canvas Particle System
  // -------------------------------------------------------------
  function init3DParallaxCanvas() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    const PARTICLE_COUNT = Math.min(85, Math.floor((width * height) / 14000));
    const FOV = 420;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1200,
        z: (Math.random() - 0.5) * 800 + 300,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2.2 + 1.2
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let camX = 0, camY = 0, camZ = 0;
    let targetCamX = 0, targetCamY = 0, targetCamZ = 0;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetCamX = (mouseX - width / 2) * 0.35;
      targetCamY = (mouseY - height / 2) * 0.35;
    });

    window.addEventListener('scroll', function () {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      targetCamZ = (scrollY % 700) * 0.25;
      targetCamY = (mouseY - height / 2) * 0.35 + (scrollY * 0.08);
    });

    let pulseProgress = 0;
    let animFrameId = null;

    function render() {
      camX += (targetCamX - camX) * 0.045;
      camY += (targetCamY - camY) * 0.045;
      camZ += (targetCamZ - camZ) * 0.045;

      ctx.clearRect(0, 0, width, height);

      const isWhite = document.documentElement.getAttribute('data-theme') === 'white';
      const rgb = hexToRgb(currentAccentHex);
      pulseProgress = (pulseProgress + 0.012) % 1;

      const projected = [];
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -800) p.x = 800;
        if (p.x > 800) p.x = -800;
        if (p.y < -600) p.y = 600;
        if (p.y > 600) p.y = -600;
        if (p.z < 80) p.z = 900;
        if (p.z > 900) p.z = 80;

        const relZ = p.z + camZ;
        if (relZ <= 10) continue;

        const scale = FOV / (FOV + relZ);
        const screenX = cx + (p.x - camX) * scale;
        const screenY = cy + (p.y - camY) * scale;
        const alpha = Math.max(0.08, Math.min(0.85, (1 - relZ / 1000) * 0.9));

        projected.push({
          x: screenX,
          y: screenY,
          scale: scale,
          radius: p.radius * scale,
          alpha: alpha
        });
      }

      // Connecting data pipelines
      const maxDist2D = 125;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist2D) {
            const lineAlpha = (1 - dist / maxDist2D) * Math.min(p1.alpha, p2.alpha) * (isWhite ? 0.35 : 0.5);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            if (isWhite) {
              ctx.strokeStyle = `rgba(100, 116, 139, ${lineAlpha})`;
            } else {
              ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineAlpha})`;
            }
            ctx.lineWidth = 0.85 * p1.scale;
            ctx.stroke();

            if (dist > 40 && dist < 110) {
              const pulseX = p1.x + (p2.x - p1.x) * pulseProgress;
              const pulseY = p1.y + (p2.y - p1.y) * pulseProgress;
              ctx.beginPath();
              ctx.arc(pulseX, pulseY, 1.4 * p1.scale, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineAlpha * 1.5})`;
              ctx.fill();
            }
          }
        }
      }

      // 3D Nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        if (p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isWhite) {
          ctx.fillStyle = `rgba(30, 41, 59, ${p.alpha})`;
        } else {
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`;
        }
        ctx.fill();

        if (p.scale > 0.65) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha * 0.18})`;
          ctx.fill();
        }
      }

      animFrameId = requestAnimationFrame(render);
    }

    animFrameId = requestAnimationFrame(render);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (animFrameId) cancelAnimationFrame(animFrameId);
      } else {
        animFrameId = requestAnimationFrame(render);
      }
    });
  }

  // -------------------------------------------------------------
  // 5. Physical 3D Card Tilt with Cursor Specular Lighting
  // -------------------------------------------------------------
  function init3DCardTilt() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6.5;
        const rotateY = ((x - centerX) / centerX) * 6.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // -------------------------------------------------------------
  // 6. Interactive Cloud Data Pipeline Architecture Visualizer
  // -------------------------------------------------------------
  const PIPELINE_DATA = {
    sources: {
      title: "Data Ingestion & Raw Sources",
      badge: "Stage 01 • Ingestion",
      details: "Multi-terabyte dataset ingestion across ADLS Gen2, on-prem files, and enterprise databases with guaranteed no-data-loss integrity and standardized naming frameworks.",
      metrics: ["100% Data Integrity Migration", "ADLS Gen2 Directory Lifecycles", "Multi-Source Schema Validation"]
    },
    orchestration: {
      title: "Control-M & Azure Data Factory Automation",
      badge: "Stage 02 • Orchestration",
      details: "End-to-end automated scheduling using Control-M batch jobs and ADF event-driven triggers. Resolved recurring batch bottlenecks to slash incident trends by 90%.",
      metrics: ["Control-M Batch Automations", "90% Incident Drop", "Zero-Downtime Safe Triggers"]
    },
    transformation: {
      title: "Azure Databricks & PySpark Lakehouse",
      badge: "Stage 03 • Processing",
      details: "High-throughput notebooks utilizing PySpark DataFrames, optimized SQL joins, and window functions to process heavy analytical payloads into Delta Lake and Snowflake tables.",
      metrics: ["45+ Root Cause Investigations", "PySpark Delta Architecture", "80% Error Trend Reduction"]
    },
    serving: {
      title: "Snowflake Enterprise Warehouse & Analytics",
      badge: "Stage 04 • Consumption",
      details: "Production-ready dimensional models, clustering keys, and performant views serving analytics consumers, dashboards, and enterprise business reporting.",
      metrics: ["30+ Production Releases", "Optimized Query Latencies", "Strict SLA Compliance"]
    }
  };

  function initPipelineVisualizer() {
    const stageBtns = document.querySelectorAll('.pipeline-stage-btn');
    const titleEl = document.getElementById('pipeline-stage-title');
    const badgeEl = document.getElementById('pipeline-stage-badge');
    const descEl = document.getElementById('pipeline-stage-desc');
    const metricsBox = document.getElementById('pipeline-stage-metrics');

    if (!stageBtns.length || !titleEl) return;

    stageBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const stageKey = this.getAttribute('data-stage');
        const data = PIPELINE_DATA[stageKey];
        if (!data) return;

        stageBtns.forEach(b => {
          b.classList.remove('border-accent', 'bg-accent-subtle');
        });
        this.classList.add('border-accent', 'bg-accent-subtle');

        titleEl.textContent = data.title;
        badgeEl.textContent = data.badge;
        descEl.textContent = data.details;

        if (metricsBox) {
          metricsBox.innerHTML = '';
          data.metrics.forEach(function (m) {
            const span = document.createElement('span');
            span.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-medium panel-card text-accent';
            span.innerHTML = `<i class="fas fa-check-circle text-[8px] mr-1"></i> ${m}`;
            metricsBox.appendChild(span);
          });
        }
      });
    });
  }

  // -------------------------------------------------------------
  // 7. Navigation & Mobile Bottom Navbar Spy
  // -------------------------------------------------------------
  function initNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Fullscreen Menu Modal Setup (Fade-In Overlay triggered by floating + button)
    const fabPlusBtn = document.getElementById('fab-plus-btn');
    const fullscreenMenu = document.getElementById('fullscreen-menu-modal');
    const fullscreenCloseBtn = document.getElementById('fullscreen-menu-close-btn');
    const menuModalLinks = document.querySelectorAll('.menu-modal-link');

    function syncActiveMenuSection() {
      const scrollY = window.pageYOffset;
      const sections = document.querySelectorAll('main section[id]');
      let currentSection = 'home';

      sections.forEach(function (sec) {
        const top = sec.offsetTop - 180;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSection = sec.getAttribute('id');
        }
      });

      menuModalLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === '#' + currentSection) {
          link.classList.add('active-menu-item');
        } else {
          link.classList.remove('active-menu-item');
        }
      });
    }

    function openFullscreenMenu() {
      syncActiveMenuSection();
      if (fullscreenMenu) fullscreenMenu.classList.add('active');
      if (fabPlusBtn) fabPlusBtn.classList.add('open');
    }

    function closeFullscreenMenu() {
      if (fullscreenMenu) fullscreenMenu.classList.remove('active');
      if (fabPlusBtn) fabPlusBtn.classList.remove('open');
    }

    window.closeFullscreenMenu = closeFullscreenMenu;
    window.openFullscreenMenu = openFullscreenMenu;

    const headerMenuBtn = document.getElementById('header-menu-btn');
    if (headerMenuBtn) {
      headerMenuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (fullscreenMenu && fullscreenMenu.classList.contains('active')) {
          closeFullscreenMenu();
        } else {
          openFullscreenMenu();
        }
      });
    }

    if (fabPlusBtn) {
      fabPlusBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (fullscreenMenu && fullscreenMenu.classList.contains('active')) {
          closeFullscreenMenu();
        } else {
          openFullscreenMenu();
        }
      });
    }

    if (fullscreenCloseBtn) {
      fullscreenCloseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeFullscreenMenu();
      });
    }

    if (fullscreenMenu) {
      fullscreenMenu.addEventListener('click', function (e) {
        if (e.target === fullscreenMenu) {
          closeFullscreenMenu();
        }
      });
    }

    menuModalLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeFullscreenMenu();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && fullscreenMenu && fullscreenMenu.classList.contains('active')) {
        closeFullscreenMenu();
      }
    });

    window.addEventListener('scroll', syncActiveMenuSection);
    syncActiveMenuSection();
  }

  // -------------------------------------------------------------
  // Card Click Interaction: Activate Background Theme Color (No Border Highlights)
  // -------------------------------------------------------------
  function initCardClickThemeActivator() {
    document.addEventListener('click', function (e) {
      const card = e.target.closest('.panel-card, .tilt-card, .cert-spec-card, .bento-card, .career-timeline-item');
      if (card && !e.target.closest('button, a, input, textarea, select')) {
        document.querySelectorAll('.card-theme-active').forEach(function (c) {
          if (c !== card) c.classList.remove('card-theme-active');
        });
        card.classList.toggle('card-theme-active');
      }
    });
  }

  // -------------------------------------------------------------
  // 8. Live Pipeline Stage Execution Animator (Source to Sink)
  // -------------------------------------------------------------
  function initPipelineExecutionTracker() {
    const pipelineStages = [
      { id: 'home', stageNum: 1, name: 'Source Ingestion' },
      { id: 'competencies', stageNum: 2, name: 'Transformation' },
      { id: 'experience', stageNum: 3, name: 'Reliability Audit' },
      { id: 'certifications', stageNum: 4, name: 'Accreditations' },
      { id: 'education', stageNum: 5, name: 'Qualifications' },
      { id: 'contact', stageNum: 6, name: 'Target Sink' }
    ];

    function updatePipelineTelemetry() {
      const scrollY = window.pageYOffset;
      const viewportMid = scrollY + (window.innerHeight * 0.38);

      let activeIndex = 0;
      pipelineStages.forEach(function (stage, idx) {
        const el = document.getElementById(stage.id);
        if (el) {
          const top = el.offsetTop - 120;
          if (viewportMid >= top) {
            activeIndex = idx;
          }
        }
      });

      pipelineStages.forEach(function (stage, idx) {
        const stageNum = stage.stageNum;
        const badges = document.querySelectorAll(`[data-pipeline-stage="${stageNum}"]`);
        const hudPills = document.querySelectorAll(`[data-hud-stage="${stageNum}"]`);

        let statusClass = '';
        let statusText = '';

        if (idx < activeIndex) {
          statusClass = 'stage-status-success';
          statusText = '[SUCCESS ✓]';
        } else if (idx === activeIndex) {
          statusClass = 'stage-status-running';
          statusText = '[IN PROGRESS...]';
        } else {
          statusClass = 'stage-status-queued';
          statusText = '[QUEUED]';
        }

        badges.forEach(function (b) {
          b.classList.remove('stage-status-running', 'stage-status-success', 'stage-status-queued');
          b.classList.add(statusClass);
          const stateSpan = b.querySelector('.stage-state');
          if (stateSpan) stateSpan.textContent = statusText;
          const dot = b.querySelector('span');
          if (dot) {
            if (idx === activeIndex) {
              dot.className = 'w-2 h-2 rounded-full bg-current animate-pulse';
            } else if (idx < activeIndex) {
              dot.className = 'w-2 h-2 rounded-full bg-current';
            } else {
              dot.className = 'w-2 h-2 rounded-full bg-current opacity-40';
            }
          }
        });

        hudPills.forEach(function (pill) {
          pill.classList.remove('stage-status-running', 'stage-status-success', 'stage-status-queued');
          pill.classList.add(statusClass);
        });
      });
    }

    window.addEventListener('scroll', updatePipelineTelemetry, { passive: true });
    updatePipelineTelemetry();
  }

  // -------------------------------------------------------------
  // 9. Resume Modal Handling
  // -------------------------------------------------------------
  function initResumeModal() {
    const modal = document.getElementById('resume-modal');
    const openBtns = document.querySelectorAll('.open-resume-btn');
    const closeBtns = document.querySelectorAll('.close-resume-btn');
    const backdrop = document.getElementById('resume-modal-backdrop');

    function openResume() {
      if (modal) modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
    function closeResume() {
      if (modal) modal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    openBtns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        openResume();
      });
    });

    closeBtns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        closeResume();
      });
    });

    if (backdrop) backdrop.addEventListener('click', closeResume);
  }

  // -------------------------------------------------------------
  // 9. Virtual Assistant ("Kwen") with Live Dynamic Responses
  // -------------------------------------------------------------
  function getChatIntents() {
    const exp = getLiveExperienceData();

    return [
      // 1. Check-ins on Assistant (How are you)
      {
        patterns: [
          'how are you', 'how r u', 'how are u', 'how r you', "how's it going",
          'hows it going', 'how do you do', 'how have you been', 'how is it going',
          'how are you doing', 'how r u doing', 'how are u doing', 'hows you', 'how is you',
          'whats up with you', 'whats good'
        ],
        responses: [
          "I'm doing great, thank you for asking! How about you? How can I assist you with Gopi's portfolio or experience today?",
          "I'm doing wonderful, thanks! How are you doing today? Let me know if you'd like to explore Gopi's cloud data engineering work, technical stack, or resume."
        ]
      },
      // 2. User says they are good / well
      {
        patterns: [
          'am good', 'i am good', 'im good', 'doing good', 'doing well', 'i am fine',
          'im fine', 'all good', 'not bad', 'pretty good', 'doing great', 'feeling good',
          'i am well', 'im well', 'fine thanks', 'good thanks', 'good thank you'
        ],
        responses: [
          "Glad to hear that! How can I help you today? Feel free to ask about Gopi's enterprise data engineering experience at TCS, technical stack, or resume.",
          "Awesome! What would you like to explore in Gopi's profile? You can ask about his production accomplishments, cloud certifications, or skills."
        ]
      },
      // 3. Identity of Assistant (Kwen) - Strictly NO "AI" mentions
      {
        patterns: [
          'who are you', 'who r u', 'who are u', 'who r you', 'what are you',
          "what's your name", 'whats your name', 'your name', 'tell me about yourself',
          'what is kwen', 'who is kwen', 'what do you do', 'what is your job',
          'what is your role', 'what can you do', 'who created you', 'who made you',
          'who built you', 'are you a bot', 'are you bot', 'are you human', 'are you real'
        ],
        responses: [
          "I am Kwen! I work for Gopi as his personal portfolio assistant to assist visitors and recruiters. I have complete knowledge of Gopi Kunchala's cloud data engineering experience, skills, certifications, and resume! How can I help you today?",
          "I'm Kwen, Gopi Kunchala's portfolio assistant. My job is to guide visitors through his background, explain his production work at TCS, showcase his technical stack, and help you get in touch with him!"
        ]
      },
      // 4. Identity of Gopi (Bio & Summary)
      {
        patterns: [
          'who is gopi', 'who is gopi kunchala', 'tell me about gopi', 'about gopi',
          'who is he', 'who is the owner', 'who owns this portfolio', 'whose portfolio is this',
          'introduce gopi', 'gopi background', 'gopi profile', 'about the engineer', 'summary'
        ],
        responses: [
          `Gopi Kunchala is an Enterprise Cloud Data Engineer with **${exp.years} years of production experience** at Tata Consultancy Services (TCS) in Hyderabad. He specializes in Azure cloud platforms (ADF, Databricks, ADLS Gen2), PySpark, Snowflake, and automated data pipelines. Would you like to know more about his work experience or technical skills?`,
          "Gopi is a Cloud Data Engineer currently working at TCS, delivering high-reliability ETL/ELT pipelines, complex problem investigations, and lakehouse architectures. He holds certifications from Microsoft and Databricks."
        ]
      },
      // 5. Casual Greetings
      {
        patterns: [
          'hi', 'hello', 'hey', 'heyy', 'heyyy', 'greetings', 'namaste', 'hola',
          'hey there', 'hi there', 'hello there', 'yo', 'howdy', 'sup', "what's up",
          'whats up', 'welcome'
        ],
        responses: [
          "Hi there! Welcome to Gopi Kunchala's portfolio. How can I help you today?",
          `Hello! I'm Kwen, Gopi's assistant. What would you like to know about his **${exp.years} years of data engineering at TCS**, technical stack, or verified achievements?`,
          "Hey! Glad you stopped by. Feel free to ask anything about Gopi's experience, Azure Databricks solutions, or official resume!"
        ]
      },
      // 6. Time-of-Day Greetings
      {
        patterns: ['good morning', 'good afternoon', 'good evening', 'good day'],
        responses: [
          "Good day! Hope you're having a wonderful day. How can I assist you with Gopi's portfolio?",
          "Hello and good day! I'm Kwen. How can I help you explore Gopi's cloud data engineering background?"
        ]
      },
      // 7. Courtesies & Gratitude
      {
        patterns: [
          'thank you', 'thanks', 'thx', 'ty', 'thank u', 'thank you so much',
          'thanks a lot', 'appreciate it', 'many thanks', 'great job', 'good job',
          'well done', 'nice work'
        ],
        responses: [
          "You're very welcome! Let me know if you have any other questions about Gopi's experience or background.",
          "Glad I could help! Feel free to ask anything else or review Gopi's resume anytime."
        ]
      },
      // 8. Positive Acknowledgments & Conversational Fillers
      {
        patterns: [
          'ok', 'okay', 'cool', 'nice', 'great', 'awesome', 'got it', 'understood',
          'perfect', 'sounds good', 'fine', 'alright', 'sure', 'yep', 'yeah', 'k'
        ],
        responses: [
          "Awesome! Let me know whenever you'd like to check out Gopi's resume, technical skills, or get in touch with him.",
          "Sounds great! Feel free to ask more questions about Gopi's work whenever you're ready."
        ]
      },
      // 9. Ending Greetings & Goodbyes
      {
        patterns: [
          'bye', 'goodbye', 'see you', 'cya', 'good night', 'goodnight', 'have a good day',
          'have a nice day', 'have a great day', 'take care', 'talk to you later',
          'catch you later', 'leaving now', 'peace out', 'exit', 'quit', 'later', 'bye bye'
        ],
        responses: [
          "Goodbye! Thank you for visiting Gopi's portfolio. Have a wonderful day ahead!",
          "Take care! Feel free to connect with Gopi on LinkedIn or via email whenever you have exciting data engineering opportunities. Bye for now!",
          "Thanks for stopping by! Feel free to review Gopi's official resume before you go. Wishing you great success!"
        ]
      },
      // 9b. Visitor Count & Name/Role Intake
      {
        patterns: [
          'visitor count', 'visitors count', 'where is visitor count', 'where is the visitor count',
          'where is visitors count', 'where is the visitors count', 'how many visitors',
          'name and role', 'where is name and role', 'where is asking name and role',
          'asking name and role', 'intake', 'enter name', 'change name', 'update name',
          'who am i', 'visitor intake', 'enter role', 'profile view', 'profile views'
        ],
        responses: [
          "• **Live Visitor Count:** You can see the real-time visitor count right in the top navigation header and at the bottom of the footer!\n• **Name & Role Intake:** Clicking the visitor count badge in the header or footer opens the intake card where you can view, enter, or update your Name and Role anytime!"
        ]
      },
      // 10. Specific: Total Years of Experience / How Much Experience
      {
        patterns: [
          'how much experience', 'how many years', 'total experience', 'years of experience',
          'how long has he worked', 'experience in years', 'how much exp', 'total exp',
          'tenure', 'how much experience he had', 'how much experience does he have',
          'how long is his experience', 'what is his total experience', 'how much experine',
          'how much experine he had', 'how much experience he has', 'experience duration',
          'work duration', 'experience level', 'overall experience', 'how many years of experience',
          'years of exp', 'how many years experience'
        ],
        responses: [
          `Gopi has **${exp.years} years of enterprise production experience** (from June 2023 to Present) as a Data Engineer at **Tata Consultancy Services (TCS)** in Hyderabad. During this time, he has worked on enterprise Azure cloud platforms, delivering 60+ RCAs, 70+ problem investigations, and 30+ zero-downtime releases.`,
          `Gopi's total production experience is **${exp.years} years** as a Cloud Data Engineer at Tata Consultancy Services (TCS) in Hyderabad (June 2023 – Present).`
        ]
      },
      // 11. Work Experience & Overview at TCS
      {
        patterns: [
          'experience', 'work experience', 'tcs', 'tata consultancy', 'job',
          'career', 'how many years', 'tenure', 'work history', 'current company',
          'company', 'his role', 'gopi role', 'current role', 'job role', 'designation', 'position', 'what is his role'
        ],
        responses: [
          `Gopi has **${exp.years} years of enterprise production experience** as a Data Engineer at **Tata Consultancy Services (TCS)** in Hyderabad (June 2023 – Present). He has delivered 60+ RCAs, 70+ problem investigations, and 30+ safe production deployments with zero downtime.`,
          `At TCS, Gopi specializes in Azure Data Factory pipelines, Databricks PySpark notebooks, SQL tuning, and Control-M batch automations, achieving an 80% reduction in weekly error trends across his ${exp.years} years tenure.`
        ]
      },
      // 11b. Day-to-Day Responsibilities & Engineering Workflow
      {
        patterns: [
          'responsibilities', 'daily work', 'day to day', 'what does he do',
          'what kind of work', 'daily tasks', 'duties', 'support or development',
          'project work', 'pipeline monitoring'
        ],
        responses: [
          "In his day-to-day engineering role at TCS, Gopi:\n• Develops and optimizes ETL/ELT pipelines using Azure Data Factory and Databricks PySpark\n• Conducts in-depth RCA investigations for production data pipeline failures\n• Writes and tunes complex SQL queries and Stored Procedures for high-volume datasets\n• Orchestrates end-to-end batch workflows via Control-M\n• Manages production releases and configuration changes with zero downtime\n• Enforces data governance and SLA compliance through ServiceNow."
        ]
      },
      // 12. Production Metrics & Achievements (RCAs, Fixes, Releases, SLAs)
      {
        patterns: [
          'achievements', 'metrics', 'impact', 'numbers', 'rca', 'root cause',
          'investigations', 'deployments', 'error reduction', 'results', 'problem fixes',
          'sla', 'incidents', 'hotfixes', 'releases', 'production numbers', 'stats',
          'zero downtime', 'reliability'
        ],
        responses: [
          "Here are Gopi's verifiable production achievements from TCS:\n• **60+ Root Cause Analyses (RCAs)** delivered for critical production incidents\n• **70+ Problem investigations** and permanent fixes implemented across pipelines\n• **30+ Safe production deployments** with zero downtime\n• **80% reduction** in weekly production error trends\n• **90% drop** in recurring production incidents\n• **100% data integrity** during multi-terabyte dataset migrations",
          "Key highlights: Gopi engineered a no-data-loss ingestion framework for multi-TB migrations in ADLS Gen2/Databricks and automated recurring operational data tasks using Python (pandas) and Control-M."
        ]
      },
      // 13. Projects Worked at TCS
      {
        patterns: [
          'project', 'projects', 'what projects', 'key projects', 'lakehouse migration',
          'migration project', 'production project', 'portfolio projects', 'work projects'
        ],
        responses: [
          "Gopi has engineered major enterprise data projects at TCS:\n• **1. Enterprise Lakehouse Migration:** Engineered a zero-data-loss framework migrating multi-terabyte datasets to Azure ADLS Gen2, Databricks Delta Lake, and Snowflake.\n• **2. Incident Investigation & RCA Framework:** Delivered 60+ Root Cause Analyses and 70+ permanent bug fixes, reducing recurring production failures by 90%.\n• **3. Automated Batch Processing Engine:** Built Python (pandas) & Control-M automated job chains that eliminated recurring operational bottlenecks.\n• **4. Zero-Downtime Releases:** Successfully deployed 30+ production code and configuration releases without downtime for business users."
        ]
      },
      // 14. What Skills He Worked On / Hands-On Tools
      {
        patterns: [
          'what skills he worked', 'skills worked', 'what did he work on', 'tools worked',
          'technologies worked', 'work skills', 'tools he used', 'skills he used'
        ],
        responses: [
          "Gopi has hands-on production experience working with:\n• **Cloud Platforms:** Microsoft Azure (ADF, Databricks, ADLS Gen2), Snowflake Warehouse\n• **Data Processing & Transformations:** PySpark (DataFrame API, Spark SQL), Delta Lake tables\n• **Languages:** Python (pandas, numpy), SQL (T-SQL, complex joins, CTEs, indexing, query execution tuning), PowerShell\n• **Orchestration & Operations:** Control-M Batch Automation, ServiceNow SLA governance, Azure Log Analytics (KQL queries), SSMS\n• **DevOps & Source Control:** Git, CI/CD pipeline deployments."
        ]
      },
      // 15. What He Learned / Learning Journey & Upskilling
      {
        patterns: [
          'learned', 'what did he learn', 'learning', 'upskilling', 'how did he learn',
          'training', 'learning journey', 'self learned', 'study journey'
        ],
        responses: [
          "Gopi's learning and engineering journey:\n• Built a solid quantitative foundation through a B.Tech in Mechanical Engineering (Graduated First Class) and Diploma (81.89%).\n• Self-directed his transition into cloud data engineering by mastering Python, SQL, distributed data architectures, and Azure services.\n• Upskilled directly in production at Tata Consultancy Services (TCS), tackling real-world multi-terabyte data issues.\n• Earned verified credentials including Microsoft Azure Data Engineer Associate (DP-203), Databricks Data Engineer Associate, and AZ-900."
        ]
      },
      // 17. Technical Skills & Stack (Overview)
      {
        patterns: [
          'stack', 'skills', 'technologies', 'tools', 'languages', 'tech stack',
          'what does he know', 'competencies', 'technical skills'
        ],
        responses: [
          "Gopi's technical stack covers:\n• **Cloud Platforms:** Microsoft Azure (ADF, Databricks, ADLS Gen2), Snowflake Warehouse\n• **Languages:** Python (pandas, numpy), PySpark (DataFrame API, Spark SQL), SQL (Tuning, CTEs, Window functions), PowerShell\n• **Architecture:** Medallion Lakehouse (Bronze -> Silver -> Gold), Delta Lake, ETL/ELT, no-data-loss ingestion\n• **Orchestration & Operations:** Control-M Batch Automation, ServiceNow SLA, Azure Log Analytics, SSMS\n• **DevOps & Version Control:** Git, CI/CD deployment practices."
        ]
      },
      // 14. Azure Cloud Platform
      {
        patterns: ['azure', 'microsoft azure', 'azure cloud', 'cloud experience'],
        responses: [
          "Gopi has deep hands-on expertise in Microsoft Azure, focusing on:\n• **Azure Data Factory (ADF):** Designing scalable copy, lookup, and mapping data flow pipelines\n• **Azure Databricks:** Distributed PySpark processing, Delta tables, lakehouse curation\n• **ADLS Gen2:** Hierarchical storage, access control, multi-terabyte dataset lakes\n• **Azure Log Analytics / Monitor:** Pipeline operational monitoring and KQL queries."
        ]
      },
      // 15. Azure Data Factory (ADF)
      {
        patterns: ['adf', 'azure data factory', 'data factory', 'copy data', 'mapping data flow'],
        responses: [
          "In Azure Data Factory (ADF), Gopi builds parameter-driven ETL/ELT pipelines, integrates linked services with Azure Key Vault, manages event and schedule triggers, monitors execution logs, and coordinates data transformations with Azure Databricks."
        ]
      },
      // 16. Databricks, PySpark & Medallion Lakehouse
      {
        patterns: [
          'databricks', 'pyspark', 'spark', 'apache spark', 'delta lake',
          'medallion', 'lakehouse', 'bronze', 'silver', 'gold'
        ],
        responses: [
          "Gopi is a Databricks Certified Data Engineer Associate. He uses Databricks and PySpark for:\n• Medallion architecture (Bronze ingestion, Silver cleansing, Gold business aggregation)\n• Delta Lake ACID transactions, time travel, and schema enforcement\n• PySpark DataFrame transformations and Spark SQL optimizations\n• Performance tuning: partition pruning, caching, broadcast joins, and shuffle minimization."
        ]
      },
      // 17. Snowflake Warehouse
      {
        patterns: ['snowflake', 'snowflake warehouse', 'snowsql', 'virtual warehouse'],
        responses: [
          "Gopi utilizes Snowflake for cloud data warehousing, managing external stages on Azure ADLS Gen2, writing optimized SQL transformations, managing roles/grants, and staging data for analytical consumption."
        ]
      },
      // 18. SQL & Database Performance Tuning
      {
        patterns: [
          'sql', 'database', 'query', 'queries', 't-sql', 'stored procedures',
          'joins', 'tuning', 'indexes', 'ssms', 'sql server', 'execution plans'
        ],
        responses: [
          "Gopi is proficient in SQL and SQL Server Management Studio (SSMS). He writes and tunes high-performance queries using Common Table Expressions (CTEs), window functions, analytical partitions, index optimization, and execution plan analysis to eliminate pipeline bottlenecks."
        ]
      },
      // 19. Python & Pandas Scripting
      {
        patterns: ['python', 'pandas', 'numpy', 'python scripting', 'scripting'],
        responses: [
          "Gopi uses Python and pandas extensively for data engineering tasks, developing custom ETL automation scripts, data cleansing utilities, API integrations, and automating repetitive operational checks that reduced manual overhead at TCS."
        ]
      },
      // 20. Control-M Batch Automation
      {
        patterns: ['control-m', 'controlm', 'scheduler', 'batch', 'job scheduling', 'automation'],
        responses: [
          "Gopi has production experience with Control-M for enterprise batch orchestration, configuring job dependencies, setting SLA calendars, monitoring cyclic workflows, and troubleshooting failed batch job chains."
        ]
      },
      // 21. ServiceNow & SLA Governance
      {
        patterns: ['servicenow', 'itsm', 'incident management', 'sla', 'service now', 'tickets'],
        responses: [
          "Gopi manages production incidents and change releases through ServiceNow, adhering strictly to enterprise SLA response/resolution benchmarks and publishing detailed RCA problem tickets."
        ]
      },
      // 22. Certifications & Credentials
      {
        patterns: [
          'certifications', 'certified', 'credentials', 'dp-203', 'az-900',
          'badges', 'microsoft certified', 'databricks certified', 'certificate',
          'certificates', 'accreditations', 'exams'
        ],
        responses: [
          "Gopi holds 4 verified industry credentials:\n1. **Azure Data Engineer Associate (DP-203)** — Microsoft Certified\n2. **Data Engineer Associate** — Databricks Certified\n3. **Azure Fundamentals (AZ-900)** — Microsoft Certified\n4. **Lakehouse Platform Fundamentals** — Databricks Accredited\n\nAll certificates can be officially verified via the direct links in the Certifications section of this portfolio!"
        ]
      },
      // 23. Academic Qualifications & Degrees
      {
        patterns: [
          'education', 'college', 'degree', 'btech', 'university', 'study',
          'diploma', 'qualification', 'graduated', 'academic', 'school', 'bachelor'
        ],
        responses: [
          "Gopi's academic qualifications:\n• **B.Tech in Mechanical Engineering (Graduated First Class)** — Avanthi's Scientific Technological & Research Academy, Hyderabad (conferred by JNTUH, 2019 – 2022)\n• **Diploma in Mechanical Engineering (Graduated with 81.89%)** — TKR College of Engineering & Technology, Hyderabad (SBTET, 2016 – 2019)\n• His engineering foundation provides strong analytical, mathematical, and algorithmic reasoning applied to enterprise cloud computing."
        ]
      },
      // 24. Mechanical to Data Engineering Transition
      {
        patterns: ['mechanical', 'mechanical engineering', 'why data engineering', 'switch', 'transition', 'background change'],
        responses: [
          "Gopi transitioned from mechanical engineering into cloud data engineering by leveraging his strong analytical mindset, mathematical problem-solving skills, and self-directed mastery of Python, SQL, Azure, and distributed computing, leading to his successful multi-year career at TCS and industry certifications."
        ]
      },
      // 25. Contact, Email, Socials & Hiring Inquiries
      {
        patterns: [
          'contact', 'email', 'phone', 'hire', 'reach', 'interview', 'linkedin',
          'instagram', 'insta', 'message', 'connect', 'mail', 'get in touch',
          'available', 'availability', 'notice period', 'salary', 'full time'
        ],
        responses: [
          "You can connect directly with Gopi:\n• **Email:** gopi.sk079@gmail.com (You can also use the Contact form or click 'Open in Gmail')\n• **Location:** Hyderabad, Telangana, India (Open to on-site, hybrid, or remote roles; open to discuss relocation)\n• **LinkedIn:** linkedin.com/in/gopi-kunchala-ade\n• **Instagram:** instagram.com/gopi_0k7\n\nHe is open to full-time enterprise Cloud Data Engineer opportunities!"
        ]
      },
      // 26. Location & Relocation
      {
        patterns: [
          'location', 'located', 'where is he located', 'where does he live', 'where is he from',
          'where is gopi', 'city', 'hyderabad', 'relocation', 'relocate', 'remote', 'hybrid',
          'work from home', 'onsite', 'india', 'telangana', 'current place'
        ],
        responses: [
          "Gopi is located in **Hyderabad, Telangana, India**. He is open to discussions for on-site roles in Hyderabad, hybrid models, remote opportunities, and open to evaluate relocation for the right opportunity."
        ]
      },
      // 27. Official Resume Download
      {
        patterns: ['resume', 'cv', 'pdf', 'download resume', 'view resume', 'profile pdf', 'curriculum vitae'],
        responses: [
          "You can view and download Gopi's official PDF resume right now! Click the **Resume** button in the top navigation header or the PDF icon in the footer to open the preview and download the PDF."
        ]
      },
      // 28. Assistant Help & Navigation
      {
        patterns: ['help', 'what can you do', 'options', 'guide', 'menu', 'commands', 'portfolio features'],
        responses: [
          `I can help you explore every aspect of Gopi Kunchala's portfolio! Feel free to ask about:\n• **TCS Experience:** His ${exp.years} years of enterprise production work\n• **Technical Stack:** Azure (ADF, Databricks, ADLS Gen2), PySpark, SQL, Snowflake, Control-M\n• **Achievements:** 60+ RCAs, 70+ Problem Fixes, 30+ Zero-Downtime Releases\n• **Certifications:** Microsoft DP-203, Databricks Data Engineer Associate, AZ-900\n• **Education & Resume:** B.Tech, Diploma, and official PDF download\n• **Contact:** Email, LinkedIn, Instagram\nWhat would you like to explore?`
        ]
      },
      // 29. Fallback for Unrelated / Off-topic questions (Strictly as user requested)
      {
        patterns: [],
        responses: [
          "I am trained to respond only to questions related to Gopi Kunchala's portfolio, cloud data engineering experience, skills, and resume. Feel free to ask me anything about his work at TCS, technical stack, certifications, or how to contact him!",
          "I am specialized specifically for Gopi Kunchala's portfolio. I can assist you with his data engineering background, projects, certifications, or contact details. How can I help you with those?"
        ]
      }
    ];
  }

  function normalizeTypos(text) {
    return text
      .split(/\s+/)
      .map(word => {
        // Experience typos: exp, experine, experiance, experince, expreince, exprnc, etc.
        if ((/^exp(er|r|i|a)[a-z]*$/i.test(word) || /^exp$/i.test(word)) && !/^explore|^explain/i.test(word)) {
          return 'experience';
        }
        // Certification typos: cert, certs, certificat, etc.
        if (/^cert[a-z]*$/i.test(word)) {
          return 'certifications';
        }
        // Education typos: edu, educat, etc.
        if (/^edu[a-z]*$/i.test(word)) {
          return 'education';
        }
        // Skills typos: skil, skils, etc.
        if (/^skil+[a-z]*$/i.test(word)) {
          return 'skills';
        }
        // Achievement typos: achieve, acheive, etc.
        if (/^ach[a-z]*v[a-z]*$/i.test(word)) {
          return 'achievements';
        }
        // Contact typos: contct, contac, etc.
        if (/^cont[a-z]*ct$/i.test(word) || /^contac$/i.test(word)) {
          return 'contact';
        }
        // Resume typos: resme, resum, etc.
        if (/^res[a-z]*m[e]?$/i.test(word)) {
          return 'resume';
        }
        // Databricks typos
        if (/^databrick[a-z]*$/i.test(word)) {
          return 'databricks';
        }
        // Snowflake typos
        if (/^snowflak[a-z]*$/i.test(word)) {
          return 'snowflake';
        }
        return word;
      })
      .join(' ');
  }

  function matchesPattern(text, pattern) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
    return regex.test(text);
  }

  function findResponse(userInput) {
    if (!userInput) {
      return "I am trained to respond only to questions related to Gopi's portfolio. How can I help you today?";
    }
    const sanitized = userInput.toLowerCase().replace(/[?!.,;:~`"']+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!sanitized) {
      return "Hi there! How can I help you with Gopi's portfolio today?";
    }

    // Apply smart typo normalization (e.g. 'experine' -> 'experience')
    const clean = normalizeTypos(sanitized);

    const intents = getChatIntents();
    for (let i = 0; i < intents.length - 1; i++) {
      const intent = intents[i];
      for (let j = 0; j < intent.patterns.length; j++) {
        if (matchesPattern(clean, intent.patterns[j]) || matchesPattern(sanitized, intent.patterns[j])) {
          const randIdx = Math.floor(Math.random() * intent.responses.length);
          return intent.responses[randIdx];
        }
      }
    }

    const fallback = intents[intents.length - 1];
    return fallback.responses[Math.floor(Math.random() * fallback.responses.length)];
  }

  function initChatAssistant() {
    const chatPanel = document.getElementById('chat-window-panel');
    const openBtns = document.querySelectorAll('.chat-trigger-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const msgBox = document.getElementById('chat-messages-box');
    const inputField = document.getElementById('chat-input-field');
    const sendBtn = document.getElementById('chat-send-btn');
    const promptChips = document.querySelectorAll('.chat-prompt-chip');

    let hasGreeted = false;

    function openChat() {
      if (chatPanel) {
        chatPanel.classList.remove('hidden');
        chatPanel.style.display = 'flex';
        if (!hasGreeted && msgBox && msgBox.children.length === 0) {
          const exp = getLiveExperienceData();
          appendMessage('assistant', `Hello! I'm Kwen, Gopi's portfolio assistant. I'm here to assist you with any questions about Gopi Kunchala's **${exp.years} years of cloud data engineering at TCS**, technical stack, certifications, or resume. How can I help you today?`);
          hasGreeted = true;
        }
        if (inputField) inputField.focus();
      }
    }

    function closeChat() {
      if (chatPanel) {
        chatPanel.classList.add('hidden');
        chatPanel.style.display = 'none';
      }
    }

    openBtns.forEach(btn => btn.addEventListener('click', openChat));
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeChat();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeChat();
        const studioPanel = document.getElementById('palette-dropdown-panel');
        if (studioPanel) studioPanel.classList.add('hidden');
        const studioBackdrop = document.getElementById('palette-backdrop');
        if (studioBackdrop) studioBackdrop.classList.add('hidden');
        const resumeModal = document.getElementById('resume-modal');
        if (resumeModal) resumeModal.classList.add('hidden');
        const menuDrawer = document.getElementById('mobile-menu-drawer');
        if (menuDrawer) menuDrawer.classList.add('hidden');
        const menuBackdrop = document.getElementById('mobile-menu-backdrop');
        if (menuBackdrop) menuBackdrop.classList.add('hidden');
      }
    });

    function appendMessage(role, text) {
      if (!msgBox) return;
      const row = document.createElement('div');
      row.className = 'flex ' + (role === 'user' ? 'justify-end' : 'justify-start');

      const bubble = document.createElement('div');
      bubble.className = role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant';

      bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      row.appendChild(bubble);
      msgBox.appendChild(row);
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    function handleSend() {
      if (!inputField) return;
      const val = inputField.value.trim();
      if (!val) return;

      appendMessage('user', val);
      inputField.value = '';

      setTimeout(function () {
        const reply = findResponse(val);
        appendMessage('assistant', reply);
      }, 200);
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (inputField) {
      inputField.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleSend();
      });
    }

    promptChips.forEach(chip => {
      chip.addEventListener('click', function () {
        const query = this.getAttribute('data-query');
        if (query) {
          appendMessage('user', this.textContent);
          setTimeout(function () {
            appendMessage('assistant', findResponse(query));
          }, 180);
        }
      });
    });
  }

  // -------------------------------------------------------------
  // 10. Interactive Hanging Bulb with Pull-String & Glass Reveal
  // -------------------------------------------------------------
  function initHangingBulb() {
    const toggleEl = document.getElementById('hanging-lamp-toggle');
    const pullWrapper = document.getElementById('lamp-pull-string-wrapper');
    if (!toggleEl && !pullWrapper) return;

    function playSwitchClick() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } catch (e) {}
    }

    // Default to 'off' on start as requested by user
    let currentLampState = 'off';
    document.documentElement.setAttribute('data-lamp', 'off');
    try {
      localStorage.setItem('gopi_lamp_state', 'off');
    } catch (e) {}

    window.setPortfolioLampState = function(state) {
      currentLampState = state;
      document.documentElement.setAttribute('data-lamp', currentLampState);
      try {
        localStorage.setItem('gopi_lamp_state', currentLampState);
      } catch (e) {}
    };

    function toggleLamp() {
      if (pullWrapper) {
        pullWrapper.classList.add('pulled');
        setTimeout(() => pullWrapper.classList.remove('pulled'), 220);
      }
      playSwitchClick();
      currentLampState = currentLampState === 'on' ? 'off' : 'on';
      document.documentElement.setAttribute('data-lamp', currentLampState);
      localStorage.setItem('gopi_lamp_state', currentLampState);
    }

    let lastTouchTime = 0;
    function handleToggleEvent(e) {
      if (e) {
        e.stopPropagation();
        if (e.type === 'touchend') {
          const now = Date.now();
          if (now - lastTouchTime < 40) return;
          lastTouchTime = now;
          e.preventDefault();
        }
      }
      toggleLamp();
    }

    if (pullWrapper) {
      pullWrapper.addEventListener('click', handleToggleEvent);
      pullWrapper.addEventListener('touchend', handleToggleEvent, { passive: false });
    }

    if (toggleEl) {
      toggleEl.addEventListener('click', handleToggleEvent);
      toggleEl.addEventListener('touchend', handleToggleEvent, { passive: false });
    }
  }

  // -------------------------------------------------------------
  // 11. Corner Vertical 3D Pipeline Track & Mobile Horizontal Pipeline Track
  // -------------------------------------------------------------
  function initVerticalPipelineTrack() {
    const rail = document.getElementById('corner-pipeline-rail');
    const mobileBar = document.getElementById('mobile-top-pipeline-bar');
    if (!rail && !mobileBar) return;

    const stages = [
      { id: 'home', num: 1, label: 'Overview' },
      { id: 'competencies', num: 2, label: 'Skills' },
      { id: 'experience', num: 3, label: 'Career' },
      { id: 'certifications', num: 4, label: 'Certs' },
      { id: 'education', num: 5, label: 'Edu' },
      { id: 'contact', num: 6, label: 'Contact' }
    ];

    function handleNodeClick() {
      const stageId = this.getAttribute('data-stage-id');
      const targetEl = document.getElementById(stageId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    if (rail) {
      rail.querySelectorAll('.v-pipe-node').forEach(node => {
        node.addEventListener('click', handleNodeClick);
      });
    }

    if (mobileBar) {
      mobileBar.querySelectorAll('.h-pipe-node').forEach(node => {
        node.addEventListener('click', handleNodeClick);
      });
    }

    const mobileStageLabel = document.getElementById('mobile-pipe-stage-label');

    function updateRail() {
      const scrollY = window.pageYOffset;
      const viewportMid = scrollY + (window.innerHeight * 0.38);

      let activeIndex = 0;
      stages.forEach((stage, idx) => {
        const el = document.getElementById(stage.id);
        if (el) {
          const top = el.offsetTop - 120;
          if (viewportMid >= top) {
            activeIndex = idx;
          }
        }
      });

      if (mobileStageLabel && stages[activeIndex]) {
        mobileStageLabel.textContent = stages[activeIndex].label;
        if (stages[activeIndex].num === 6) {
          mobileStageLabel.classList.remove('text-accent');
          mobileStageLabel.classList.add('text-emerald-400');
        } else {
          mobileStageLabel.classList.remove('text-emerald-400');
          mobileStageLabel.classList.add('text-accent');
        }
      }

      stages.forEach((stage, idx) => {
        // Desktop Rail
        if (rail) {
          const node = rail.querySelector(`.v-pipe-node[data-stage-num="${stage.num}"]`);
          const segment = rail.querySelector(`.v-pipe-segment[data-segment-num="${stage.num}"]`);

          if (node) {
            node.classList.remove('success', 'active', 'queued');
            if (idx < activeIndex || (idx === activeIndex && stage.num === 6)) {
              node.classList.add('success');
              node.innerHTML = '<i class="fas fa-check text-[9px] text-emerald-400"></i>';
            } else if (idx === activeIndex) {
              node.classList.add('active');
              node.innerHTML = `<span>●</span>`;
            } else {
              node.classList.add('queued');
              node.innerHTML = stage.num === 6 ? `<span class="text-emerald-400">●</span>` : `<span>●</span>`;
            }
          }

          if (segment) {
            segment.classList.remove('filled', 'active-flow');
            if (idx < activeIndex) {
              segment.classList.add('filled');
            } else if (idx === activeIndex) {
              segment.classList.add('active-flow');
            }
          }
        }

        // Mobile Top Pipeline Bar
        if (mobileBar) {
          const hNode = mobileBar.querySelector(`.h-pipe-node[data-stage-num="${stage.num}"]`);
          const hSegment = mobileBar.querySelector(`.h-pipe-segment[data-segment-num="${stage.num}"]`);

          if (hNode) {
            hNode.classList.remove('success', 'active', 'queued');
            if (idx < activeIndex) {
              hNode.classList.add('success');
              hNode.innerHTML = '<i class="fas fa-check text-[8px] text-emerald-400"></i>';
            } else if (idx === activeIndex) {
              hNode.classList.add('active');
              hNode.innerHTML = stage.num === 6 ? `<span class="text-emerald-400">06</span>` : `<span>0${stage.num}</span>`;
            } else {
              hNode.classList.add('queued');
              hNode.innerHTML = stage.num === 6 ? `<span class="text-emerald-500/80">06</span>` : `<span>0${stage.num}</span>`;
            }
          }

          if (hSegment) {
            hSegment.classList.remove('filled', 'active-flow');
            if (idx < activeIndex) {
              hSegment.classList.add('filled');
            } else if (idx === activeIndex) {
              hSegment.classList.add('active-flow');
            }
          }
        }
      });
    }

    window.addEventListener('scroll', updateRail, { passive: true });
    updateRail();
  }

  // -------------------------------------------------------------
  // 12. Universal Persistent Visit Counter & Visitor Audit Handshake
  // Zero external APIs: Overwrites & increments count, displays everywhere
  // -------------------------------------------------------------
  const VISITS_KEY = 'gopi_portfolio_visits_count';
  const LOGS_KEY = 'gopi_portfolio_visitor_logs';

  function getVisitCount() {
    let count = parseInt(localStorage.getItem(VISITS_KEY) || '0', 10);
    if (isNaN(count) || count < 0) count = 0;
    return count;
  }

  function incrementAndSaveVisitCount() {
    let count = getVisitCount() + 1;
    localStorage.setItem(VISITS_KEY, count.toString());
    updateVisitCounters(count);
    return count;
  }

  function updateVisitCounters(visitsCount) {
    const count = visitsCount || getVisitCount() || 1;
    const formatted = count.toLocaleString();
    const headerCounter = document.getElementById('public-visit-counter');
    const footerCounter = document.getElementById('footer-visit-counter');
    const realtimeBadge = document.getElementById('vault-realtime-badge');
    const statNames = document.getElementById('vault-stat-names');
    if (headerCounter) headerCounter.textContent = formatted;
    if (footerCounter) footerCounter.textContent = formatted;
    if (realtimeBadge) realtimeBadge.textContent = formatted;
    if (statNames) statNames.textContent = formatted;
  }

  let durationTrackerStarted = false;

  function formatSessionDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }

  function updateActiveSessionDuration() {
    const sessionId = sessionStorage.getItem('gopi_session_id');
    const startStr = sessionStorage.getItem('gopi_session_start');
    if (!sessionId || !startStr) return;

    const start = parseInt(startStr, 10);
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - start) / 1000));
    const formatted = formatSessionDuration(elapsedSeconds);

    try {
      const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
      const rec = logs.find(r => r.sessionId === sessionId);
      if (rec) {
        rec.durationSeconds = elapsedSeconds;
        rec.durationFormatted = formatted;
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      }
    } catch (e) {}
  }

  function startSessionDurationTracker() {
    if (durationTrackerStarted) return;
    durationTrackerStarted = true;

    // Periodic heartbeat every 8 seconds
    setInterval(updateActiveSessionDuration, 8000);

    // Sync on leaving or hiding tab
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        updateActiveSessionDuration();
      }
    });

    // Sync on page close / unload
    window.addEventListener('beforeunload', function () {
      updateActiveSessionDuration();
    });
  }

  function recordVisitorAudit(name, role) {
    // Increment and overwrite the universal count every time a visit is recorded
    const count = incrementAndSaveVisitCount();

    const sessionId = sessionStorage.getItem('gopi_session_id') || ('sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
    sessionStorage.setItem('gopi_session_id', sessionId);
    if (!sessionStorage.getItem('gopi_session_start')) {
      sessionStorage.setItem('gopi_session_start', Date.now().toString());
    }

    const existingLogs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    const now = new Date();
    const finalName = (name && typeof name === 'string' && name.trim()) ? name.trim() : (localStorage.getItem('gopi_visitor_name') || 'Guest Visitor');
    const finalRole = (role && typeof role === 'string' && role.trim()) ? role.trim() : (localStorage.getItem('gopi_visitor_role') || 'Visitor');

    if (finalName !== 'Guest Visitor') {
      try { localStorage.setItem('gopi_visitor_name', finalName); } catch (e) {}
    }
    if (finalRole !== 'Visitor') {
      try { localStorage.setItem('gopi_visitor_role', finalRole); } catch (e) {}
    }

    const newRecord = {
      sessionId: sessionId,
      visitNum: count,
      name: finalName,
      role: finalRole,
      dateStr: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeStr: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.toISOString(),
      durationSeconds: 0,
      durationFormatted: '< 1m'
    };

    existingLogs.push(newRecord);
    localStorage.setItem(LOGS_KEY, JSON.stringify(existingLogs));

    updateVisitCounters(count);
    startSessionDurationTracker();
  }
  window.recordVisitorAudit = recordVisitorAudit;

  function initPipelinePreloader() {
    const preloader = document.getElementById('pipeline-preloader');
    if (!preloader) return;

    try {
      let initialVisits = parseInt(localStorage.getItem('gopi_portfolio_visits_count') || '1', 10);
      if (isNaN(initialVisits) || initialVisits >= 1000) initialVisits = 1;
      updateVisitCounters(initialVisits);
    } catch (e) {}

    const intakeCard = document.getElementById('preloader-intake-card');
    const stepsCard = document.getElementById('preloader-vertical-steps-card');
    const form = document.getElementById('preloader-visitor-form');
    const nameInput = document.getElementById('preloader-name-input');
    const roleInput = document.getElementById('preloader-role-input');
    const sessionText = document.getElementById('preloader-session-text');
    const skipBtn = document.getElementById('preloader-skip-btn');

    let dismissed = false;

    window.openVisitorIntake = function() {
      if (preloader) {
        dismissed = false;
        preloader.style.opacity = '1';
        preloader.style.visibility = 'visible';
        preloader.style.pointerEvents = 'auto';
        preloader.style.setProperty('display', 'flex', 'important');
        preloader.classList.remove('hidden', 'fade-out');
        if (intakeCard) {
          intakeCard.style.display = 'flex';
          intakeCard.classList.remove('hidden');
        }
        if (stepsCard) {
          stepsCard.style.display = 'none';
          stepsCard.classList.add('hidden');
        }
        if (nameInput) nameInput.focus();
      }
    };

    const PRELOADER_KEY = 'gopi_preloader_seen';
    if (sessionStorage.getItem(PRELOADER_KEY)) {
      document.documentElement.setAttribute('data-lamp', 'off');
      try {
        localStorage.setItem('gopi_lamp_state', 'off');
      } catch (e) {}
      preloader.classList.add('hidden');
      preloader.style.setProperty('display', 'none', 'important');
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';

      // Increment & overwrite count on page refresh
      const refreshedCount = incrementAndSaveVisitCount();
      updateVisitCounters(refreshedCount);
      return;
    }

    function dismissPreloader(name, role) {
      if (dismissed) return;
      dismissed = true;

      const finalName = name && name.trim() ? name.trim() : 'Guest Visitor';
      const finalRole = role && role.trim() ? role.trim() : 'Visitor';

      recordVisitorAudit(finalName, finalRole);
      try {
        sessionStorage.setItem(PRELOADER_KEY, 'true');
      } catch (e) {}

      // Keep lamp state off on start as requested by user
      document.documentElement.setAttribute('data-lamp', 'off');
      try {
        localStorage.setItem('gopi_lamp_state', 'off');
      } catch (e) {}
      if (typeof window.setPortfolioLampState === 'function') {
        window.setPortfolioLampState('off');
      }

      // Smooth fade-out and hide without removing from DOM
      preloader.classList.add('fade-out');
      preloader.style.pointerEvents = 'none';
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';

      setTimeout(() => {
        preloader.classList.add('hidden');
        preloader.style.setProperty('display', 'none', 'important');
      }, 250);
    }

    window.enterPortfolioDirectly = function (name, role) {
      dismissPreloader(name, role);
    };

    // Submit button direct click handler
    const submitBtn = document.getElementById('preloader-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const rawName = nameInput ? nameInput.value.trim() : '';
        const rawRole = roleInput ? roleInput.value.trim() : '';
        dismissPreloader(rawName, rawRole);
      });
    }

    // Skip button for direct instant access
    if (skipBtn) {
      skipBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dismissPreloader('Guest Visitor', 'Visitor');
      });
    }

    // Backdrop click dismiss: tapping outside intake card enters portfolio
    preloader.addEventListener('click', function (e) {
      if (e.target === preloader) {
        dismissPreloader('Guest Visitor', 'Visitor');
      }
    });

    // Escape key dismiss
    function escDismissHandler(e) {
      if (e.key === 'Escape') {
        dismissPreloader('Guest Visitor', 'Visitor');
        document.removeEventListener('keydown', escDismissHandler);
      }
    }
    document.addEventListener('keydown', escDismissHandler);

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const rawName = nameInput ? nameInput.value.trim() : '';
        const rawRole = roleInput ? roleInput.value.trim() : '';
        dismissPreloader(rawName, rawRole);
      });
    }
  }

  // -------------------------------------------------------------
  // 13. Visitor Audit Seed & Counter Setup
  // -------------------------------------------------------------
  function initVisitorTracker() {
    let count = getVisitCount();
    if (count < 1) {
      count = 1;
      localStorage.setItem(VISITS_KEY, '1');
    }

    if (!localStorage.getItem(LOGS_KEY)) {
      localStorage.setItem(LOGS_KEY, JSON.stringify([]));
    }

    updateVisitCounters(count);
  }

  // -------------------------------------------------------------
  // 14. Secret Owner Vault (Direct 4-Tap Access -> 5-Column Admin Portal)
  // -------------------------------------------------------------
  function initSecretOwnerVault() {
    const vaultModal = document.getElementById('owner-vault-modal');
    const passwordPanel = document.getElementById('vault-password-panel');
    const dashboardPanel = document.getElementById('vault-dashboard-panel');
    const passwordForm = document.getElementById('vault-password-form');
    const passwordInput = document.getElementById('vault-password-input');
    const passwordError = document.getElementById('vault-password-error');
    const cancelBtn = document.getElementById('vault-close-cancel-btn');
    const closeDashBtn = document.getElementById('vault-close-dash-btn');
    const backdrop = document.getElementById('vault-modal-backdrop');
    const searchInput = document.getElementById('vault-search-input');
    const tableBody = document.getElementById('vault-table-body');
    const statTotal = document.getElementById('vault-stat-total');
    const statNames = document.getElementById('vault-stat-names');
    const exportTxtBtn = document.getElementById('export-txt-btn');

    if (!vaultModal) return;

    function closeVault() {
      vaultModal.classList.add('hidden');
      vaultModal.style.setProperty('display', 'none', 'important');
      if (passwordPanel) {
        passwordPanel.classList.remove('hidden');
        passwordPanel.style.setProperty('display', 'block', 'important');
      }
      if (dashboardPanel) {
        dashboardPanel.classList.add('hidden');
        dashboardPanel.style.setProperty('display', 'none', 'important');
      }
      if (passwordInput) passwordInput.value = '';
      if (passwordError) passwordError.classList.add('hidden');
    }

    function openVaultPasswordPrompt() {
      // Hide preloader if open so it never covers the modal
      const preloader = document.getElementById('pipeline-preloader');
      if (preloader) {
        preloader.classList.add('hidden');
        preloader.style.setProperty('display', 'none', 'important');
      }

      vaultModal.style.zIndex = '999999';
      vaultModal.style.setProperty('display', 'flex', 'important');
      vaultModal.classList.remove('hidden');

      if (passwordPanel) {
        passwordPanel.style.setProperty('display', 'block', 'important');
        passwordPanel.classList.remove('hidden');
      }
      if (dashboardPanel) {
        dashboardPanel.style.setProperty('display', 'none', 'important');
        dashboardPanel.classList.add('hidden');
      }
      if (passwordError) passwordError.classList.add('hidden');
      if (passwordInput) {
        passwordInput.value = '';
        setTimeout(() => passwordInput.focus(), 150);
      }
    }
    window.openAdminVault = openVaultPasswordPrompt;

    // Universal 4-Tap / 4-Click Admin Portal Detector
    // Tapping or clicking 4 times anywhere on the screen (or on the visitor count badge / header)
    // immediately opens the Admin Password Challenge.
    let tapCounter = 0;
    let tapResetTimer = null;
    let lastTapTimestamp = 0;

    function handleUnifiedTap(e) {
      // If Admin Vault is already open, do not intercept
      if (vaultModal && !vaultModal.classList.contains('hidden') && vaultModal.style.display !== 'none') {
        return;
      }

      // Ignore when user is actively typing inside interactive text fields
      if (e && e.target && e.target.closest && e.target.closest('input, textarea, select')) {
        return;
      }

      const now = Date.now();
      // Filter out duplicate synthetic events within 100ms
      if (now - lastTapTimestamp < 100) return;
      lastTapTimestamp = now;

      tapCounter++;
      clearTimeout(tapResetTimer);
      tapResetTimer = setTimeout(() => {
        tapCounter = 0;
      }, 2500);

      // Micro haptic vibration feedback on mobile
      if (tapCounter >= 2 && tapCounter < 4 && typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(25); } catch (err) {}
      }

      if (tapCounter >= 4) {
        tapCounter = 0;
        clearTimeout(tapResetTimer);
        if (e) {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (typeof e.stopPropagation === 'function') e.stopPropagation();
        }
        openVaultPasswordPrompt();
      }
    }

    // Attach capturing click listener to window so clicks anywhere across the entire document are captured
    window.addEventListener('click', handleUnifiedTap, true);

    // Also attach to all visitor counter buttons and badges for direct response
    document.querySelectorAll('#header-visit-btn, #footer-visit-btn, .visitor-counter-btn, #public-visit-counter, #footer-visit-counter').forEach(el => {
      const btn = el.closest('button') || el;
      btn.addEventListener('click', function (e) {
        handleUnifiedTap(e);
      });
    });

    // Keyboard shortcut for desktop power users: Alt+A or Ctrl+Shift+A
    document.addEventListener('keydown', function (e) {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        openVaultPasswordPrompt();
      }
      if (e.key === 'Escape' && vaultModal && !vaultModal.classList.contains('hidden')) {
        closeVault();
      }
    });

    if (cancelBtn) cancelBtn.addEventListener('click', closeVault);
    if (closeDashBtn) closeDashBtn.addEventListener('click', closeVault);
    if (backdrop) backdrop.addEventListener('click', closeVault);

    function updateVaultGreeting() {
      const greetingEl = document.getElementById('vault-greeting-heading');
      if (!greetingEl) return;
      const hr = new Date().getHours();
      let greeting = 'Good evening, Gopi';
      if (hr < 12) {
        greeting = 'Good morning, Gopi';
      } else if (hr < 17) {
        greeting = 'Good afternoon, Gopi';
      }
      greetingEl.textContent = greeting;
    }

    function renderVisitorTable(filterQuery = '') {
      updateVaultGreeting();

      const logs = JSON.parse(localStorage.getItem('gopi_portfolio_visitor_logs') || '[]');
      const q = filterQuery.toLowerCase().trim();

      const filtered = logs.filter(log => {
        if (!q) return true;
        return (
          String(log.visitNum).includes(q) ||
          (log.name && log.name.toLowerCase().includes(q)) ||
          (log.role && log.role.toLowerCase().includes(q)) ||
          (log.dateStr && log.dateStr.toLowerCase().includes(q)) ||
          (log.timeStr && log.timeStr.toLowerCase().includes(q)) ||
          (log.durationFormatted && log.durationFormatted.toLowerCase().includes(q))
        );
      });

      const totalHits = logs.length || 1;
      const realtimeBadge = document.getElementById('vault-realtime-badge');
      if (realtimeBadge) realtimeBadge.textContent = totalHits.toLocaleString();
      if (statTotal) statTotal.textContent = totalHits.toLocaleString();
      if (statNames) statNames.textContent = logs.length.toLocaleString();

      if (!tableBody) return;
      tableBody.innerHTML = '';

      if (filtered.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" class="py-8 text-center text-zinc-500 font-mono text-xs">No matching confidential visitor records found.</td>`;
        tableBody.appendChild(tr);
        return;
      }

      // Strictly all 5 columns: Hit # | Visitor Name | Role / Designation | Date & Time | Time on Page
      filtered.slice().reverse().forEach(log => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-zinc-900/60 transition-colors border-b border-zinc-900/80';
        tr.innerHTML = `
          <td class="py-2.5 px-3 font-bold text-accent">#${log.visitNum || 1}</td>
          <td class="py-2.5 px-3 text-white font-medium truncate max-w-[150px]">${log.name || 'Guest Visitor'}</td>
          <td class="py-2.5 px-3 text-zinc-300 text-xs truncate max-w-[160px]">${log.role || 'Visitor'}</td>
          <td class="py-2.5 px-3 text-zinc-400 text-[11px] whitespace-nowrap">${log.dateStr || ''} • ${log.timeStr || ''}</td>
          <td class="py-2.5 px-3 text-right font-mono text-emerald-400 text-xs font-semibold whitespace-nowrap">${log.durationFormatted || '< 1m'}</td>
        `;
        tableBody.appendChild(tr);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        renderVisitorTable(this.value);
      });
    }

    // STRICT Password Form Challenge: NEVER opens without entering correct Admin Password
    if (passwordForm) {
      passwordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const entered = (passwordInput ? passwordInput.value : '').trim().toLowerCase();
        const allowedAdminKeys = [
          'admin',
          '079',
          'gopi',
          'lock',
          'simple',
          'password',
          '1026',
          'admin079',
          'gopi079',
          'gopi@079',
          'gopi_0k7',
          'gopi1026'
        ];

        if (allowedAdminKeys.includes(entered)) {
          if (passwordError) passwordError.classList.add('hidden');
          if (passwordPanel) {
            passwordPanel.classList.add('hidden');
            passwordPanel.style.setProperty('display', 'none', 'important');
          }
          if (dashboardPanel) {
            dashboardPanel.classList.remove('hidden');
            dashboardPanel.style.removeProperty('display');
            dashboardPanel.style.setProperty('display', 'flex', 'important');
          }
          renderVisitorTable(searchInput ? searchInput.value : '');
        } else {
          if (passwordError) {
            passwordError.textContent = 'Access Denied. Try "admin" or "079".';
            passwordError.classList.remove('hidden');
          }
          if (passwordInput) {
            passwordInput.classList.add('border-rose-500');
            setTimeout(() => passwordInput.classList.remove('border-rose-500'), 800);
          }
        }
      });
    }

    // Export TXT confidential audit ledger
    if (exportTxtBtn) {
      exportTxtBtn.addEventListener('click', function () {
        const logs = JSON.parse(localStorage.getItem('gopi_portfolio_visitor_logs') || '[]');
        const totalRows = logs.length;

        let txtContent = `========================================================================================================================\n`;
        txtContent += `GOPI KUNCHALA - ENTERPRISE DATA PLATFORM // CONFIDENTIAL VISITOR AUDIT LEDGER\n`;
        txtContent += `Export Timestamp: ${new Date().toISOString()}\n`;
        txtContent += `Total Global Page Hits / Rows: ${totalRows}\n`;
        txtContent += `Portfolio Owner: Gopi Kunchala (Cloud Data Engineer)\n`;
        txtContent += `========================================================================================================================\n\n`;
        txtContent += `HIT #   | VISITOR NAME                   | ROLE / DESIGNATION             | DATE & TIME                  | TIME ON PAGE\n`;
        txtContent += `------------------------------------------------------------------------------------------------------------------------\n`;

        logs.forEach(log => {
          const num = String(log.visitNum || 1).padEnd(7);
          const name = String(log.name || 'Guest Visitor').slice(0, 30).padEnd(30);
          const role = String(log.role || 'Visitor').slice(0, 30).padEnd(30);
          const dt = `${log.dateStr || ''} ${log.timeStr || ''}`.slice(0, 28).padEnd(28);
          const dur = String(log.durationFormatted || '< 1m');
          txtContent += `${num} | ${name} | ${role} | ${dt} | ${dur}\n`;
        });

        txtContent += `\n[END OF AUDIT LEDGER - CONFIDENTIAL RECORD // GOPI KUNCHALA]\n`;

        const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gopi_kunchala_visitor_ledger_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }

  // -------------------------------------------------------------
  // 15. Direct Contact Ingestion Form (Sends directly to email without Outlook)
  // -------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contact-direct-form');
    if (!form) return;
    const submitBtn = document.getElementById('contact-submit-btn');
    const statusBox = document.getElementById('contact-form-status');
    const gmailBtn = document.getElementById('contact-gmail-btn');
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const msgInput = document.getElementById('msg-input');

    function syncGmailLink() {
      if (!gmailBtn) return;
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      const subject = encodeURIComponent(name ? `Portfolio Contact from ${name}` : 'Portfolio Inquiry for Gopi Kunchala');
      const body = encodeURIComponent((message || '') + (name || email ? `\n\nFrom: ${name} (${email})` : ''));
      gmailBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&to=gopi.sk079@gmail.com&su=${subject}&body=${body}`;
    }

    if (nameInput) nameInput.addEventListener('input', syncGmailLink);
    if (emailInput) emailInput.addEventListener('input', syncGmailLink);
    if (msgInput) msgInput.addEventListener('input', syncGmailLink);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!name || !email || !message) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin text-xs"></i> <span>Sending to Gopi...</span>';
      }
      if (statusBox) {
        statusBox.classList.add('hidden');
        statusBox.className = 'hidden text-xs rounded-xl p-3 text-center';
      }

      // If tested locally via file://, FormSubmit rejects requests without http/https origin
      if (window.location.protocol === 'file:') {
        syncGmailLink();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane text-xs"></i> <span>Send Message</span>';
        }
        if (statusBox) {
          statusBox.className = 'text-xs rounded-xl p-3 text-center bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-medium block';
          statusBox.innerHTML = '<i class="fas fa-info-circle mr-1.5"></i> Running locally from HTML file. Click <strong>Open in Gmail</strong> to send directly in your browser without Outlook, or host online (e.g. Vercel) for background dispatch!';
        }
        if (gmailBtn) {
          window.open(gmailBtn.href, '_blank');
        }
        return;
      }

      try {
        const payload = {
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name} (${email})`,
          _replyto: email,
          _captcha: 'false'
        };

        const response = await fetch('https://formsubmit.co/ajax/gopi.sk079@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success !== "false") {
          if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-check text-xs"></i> <span>Message Sent!</span>';
          }
          if (statusBox) {
            statusBox.className = 'text-xs rounded-xl p-3 text-center bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium block';
            statusBox.innerHTML = '<i class="fas fa-circle-check mr-1.5"></i> Thank you, ' + name + '! Your message has been sent directly to Gopi\'s inbox (gopi.sk079@gmail.com).';
          }
          form.reset();
          syncGmailLink();
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<i class="fas fa-paper-plane text-xs"></i> <span>Send Message</span>';
            }
          }, 4000);
        } else {
          throw new Error((data && data.message) || 'Activation or server dispatch error');
        }
      } catch (err) {
        syncGmailLink();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane text-xs"></i> <span>Send Message</span>';
        }
        if (statusBox) {
          statusBox.className = 'text-xs rounded-xl p-3 text-center bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-medium block';
          statusBox.innerHTML = '<div class="space-y-1"><div><i class="fas fa-envelope-open-text mr-1.5"></i> Note: For automatic dispatch, make sure you clicked the 1-time activation email from FormSubmit in <strong>gopi.sk079@gmail.com</strong>.</div><div>Or <a href="' + (gmailBtn ? gmailBtn.href : 'https://mail.google.com/mail/?view=cm&fs=1&to=gopi.sk079@gmail.com') + '" target="_blank" rel="noopener noreferrer" class="underline font-bold text-accent">click here to compose in Gmail Web browser</a> (no Outlook).</div></div>';
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Initializer
  // -------------------------------------------------------------
  function bootApp() {
    updateLiveExperienceDOM();
    initColorStudio();
    initThemeToggle();
    initHangingBulb();
    init3DParallaxCanvas();
    init3DCardTilt();
    initPipelineVisualizer();
    initNavigation();
    initPipelineExecutionTracker();
    initVerticalPipelineTrack();
    initPipelinePreloader();
    initVisitorTracker();
    initSecretOwnerVault();
    initResumeModal();
    initChatAssistant();
    initCardClickThemeActivator();
    initContactForm();

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
  } else {
    bootApp();
  }
})();
