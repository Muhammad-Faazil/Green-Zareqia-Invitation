/**
 * Royal Grace Wedding Invitation Interaction Logic
 * 100% Faithful Recreation of Zareqia "Royal Grace"
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Elements
  // ---------------------------------------------------------------------------
  const heroVideo = document.getElementById('heroVideo');
  const tapHint = document.getElementById('tapHint');
  const coupleOverlay = document.getElementById('coupleOverlay');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIconOn = document.getElementById('musicIconOn');
  const musicIconOff = document.getElementById('musicIconOff');
  const heroSection = document.getElementById('heroSection');

  let hasStarted = false;
  let hasRevealed = false;

  // ---------------------------------------------------------------------------
  // 2. Video Opening Sequence & Couple Reveal
  // ---------------------------------------------------------------------------
  const revealCoupleDetails = () => {
    if (hasRevealed) return;
    hasRevealed = true;
    document.body.classList.remove('locked');
    coupleOverlay.classList.add('revealed');
    scrollIndicator.classList.add('revealed');
  };

  const startInvitation = () => {
    if (hasStarted) return;
    hasStarted = true;

    // Fade out tap hint
    if (tapHint) {
      tapHint.classList.add('hidden');
    }

    // Play video synchronously within user gesture
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.play().catch((err) => {
      console.log('Video play error:', err);
    });

    // Play background audio synchronously within user gesture for iOS Safari & Android
    bgMusic.volume = 0.7;
    bgMusic.play().then(() => {
      updateMusicIcons(false);
    }).catch((err) => {
      console.log('Audio autoplay waiting for user interaction:', err);
      updateMusicIcons(true);
    });

    // Reveal couple names & genuinely restore scrolling at 6.0 seconds (matching original component)
    window.setTimeout(() => {
      revealCoupleDetails();
    }, 6000);
  };

  // Video time tracking backup
  heroVideo.addEventListener('timeupdate', () => {
    if (heroVideo.currentTime >= 5.8) {
      revealCoupleDetails();
    }
  });

  heroVideo.addEventListener('ended', () => {
    heroVideo.pause();
    revealCoupleDetails();
  });

  // Safety fallback: ensure invitation content is never stuck if video fails to play
  window.setTimeout(() => {
    if (hasStarted && !hasRevealed) {
      revealCoupleDetails();
    }
  }, 6500);

  // Start on tap/click anywhere on hero
  heroSection.addEventListener('click', () => {
    startInvitation();
  });

  // Support keyboard interaction (Enter or Space)
  heroSection.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      startInvitation();
    }
  });

  // Support touch interaction
  heroSection.addEventListener('touchend', (e) => {
    if (!hasStarted) {
      e.preventDefault();
      startInvitation();
    }
  }, { passive: false });

  // Clicking scroll indicator smoothly jumps to welcome section
  scrollIndicator.addEventListener('click', (e) => {
    e.stopPropagation();
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Background Music Controls
  // ---------------------------------------------------------------------------
  function updateMusicIcons(isMuted) {
    if (isMuted) {
      musicIconOn.style.display = 'none';
      musicIconOff.style.display = 'block';
      musicToggleBtn.classList.add('muted');
    } else {
      musicIconOn.style.display = 'block';
      musicIconOff.style.display = 'none';
      musicToggleBtn.classList.remove('muted');
    }
  }

  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!hasStarted) {
      startInvitation();
      return;
    }

    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        updateMusicIcons(false);
      }).catch(() => {});
    } else {
      bgMusic.pause();
      updateMusicIcons(true);
    }
  });

  // Auto-pause audio if page loses focus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !bgMusic.paused) {
      bgMusic.pause();
      updateMusicIcons(true);
    }
  });

  // ---------------------------------------------------------------------------
  // 4. Large Green Glitter Heart Scratch Card (HTML5 Canvas)
  // ---------------------------------------------------------------------------
  const initScratchCard = () => {
    const canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Render green glitter metallic surface matching original screenshot
    const drawGlitterHeartSurface = () => {
      ctx.clearRect(0, 0, width, height);

      // Base radial green gradient
      const grad = ctx.createRadialGradient(
        width * 0.45, height * 0.35, 10,
        width * 0.5, height * 0.55, width * 0.6
      );
      grad.addColorStop(0, '#869f78');
      grad.addColorStop(0.35, '#68825c');
      grad.addColorStop(0.75, '#4f6745');
      grad.addColorStop(1, '#3b4e34');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Sparkles and glitter noise particles
      for (let i = 0; i < 900; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.5;
        const alpha = Math.random() * 0.55 + 0.15;
        const isGold = Math.random() > 0.6;
        ctx.fillStyle = isGold
          ? `rgba(235, 215, 170, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Larger bright specular star glints
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * width * 0.8 + width * 0.1;
        const y = Math.random() * height * 0.8 + height * 0.1;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawGlitterHeartSurface();

    const particlesContainer = document.getElementById('scratchParticles');
    let isDrawing = false;
    let scratchesCount = 0;
    let isRevealedState = false;

    // Particle glyphs and luxury palette
    const particleGlyphs = ['🌸', '🍃', '🤍', '✨'];
    const particleColors = ['#5f6d55', '#e8b4b8', '#faf7f0', '#c9a96e'];

    const spawnParticle = (px, py, isBurst = false) => {
      if (!particlesContainer) return;
      // Strict concurrent limit to keep performance silky smooth
      if (particlesContainer.childElementCount > 30) {
        particlesContainer.firstElementChild.remove();
      }

      const particle = document.createElement('span');
      particle.className = 'scratch-particle';
      const glyph = particleGlyphs[Math.floor(Math.random() * particleGlyphs.length)];
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      particle.textContent = glyph;
      particle.style.color = color;
      particle.style.left = `${px}px`;
      particle.style.top = `${py}px`;

      const tx = (Math.random() - 0.5) * (isBurst ? 100 : 45);
      const ty = isBurst ? -(Math.random() * 80 + 50) : -(Math.random() * 55 + 30);
      const rot = (Math.random() - 0.5) * 80;
      const scale = Math.random() * 0.5 + 0.8;
      const duration = Math.random() * 0.4 + 1.1;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--rot', `${rot}deg`);
      particle.style.setProperty('--scale', scale);
      particle.style.setProperty('--duration', `${duration}s`);
      particle.style.fontSize = `${Math.floor(Math.random() * 6 + 12)}px`;

      particlesContainer.appendChild(particle);

      const cleanup = () => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      };
      particle.addEventListener('animationend', cleanup, { once: true });
      setTimeout(cleanup, duration * 1000 + 100);
    };

    const triggerCelebrationBurst = () => {
      if (!particlesContainer) return;
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      for (let i = 0; i < 16; i++) {
        setTimeout(() => {
          const offsetX = centerX + (Math.random() - 0.5) * 40;
          const offsetY = centerY + (Math.random() - 0.5) * 40;
          spawnParticle(offsetX, offsetY, true);
        }, i * 35);
      }
    };

    const scratch = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();

      // Emit floating particles relative to the container
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      scratchesCount++;

      if (scratchesCount % 2 === 0) {
        spawnParticle(localX, localY);
      }

      if (scratchesCount % 12 === 0) {
        checkClearedPercent();
      }
    };

    const checkClearedPercent = () => {
      if (isRevealedState) return;
      try {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let transparentPixels = 0;
        const totalSampled = data.length / 4;

        for (let i = 3; i < data.length; i += 16) {
          if (data[i] === 0) transparentPixels++;
        }

        const percent = (transparentPixels / (totalSampled / 4)) * 100;
        if (percent > 42) {
          isRevealedState = true;
          canvas.style.opacity = '0';
          canvas.style.pointerEvents = 'none';
          triggerCelebrationBurst();
        }
      } catch (e) {}
    };

    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      scratch(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => {
      if (isDrawing) scratch(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', () => { isDrawing = false; });

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDrawing = true;
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (isDrawing && e.touches.length > 0) {
        e.preventDefault();
        const touch = e.touches[0];
        scratch(touch.clientX, touch.clientY);
      }
    }, { passive: false });

    window.addEventListener('touchend', () => { isDrawing = false; });
  };

  initScratchCard();

  // ---------------------------------------------------------------------------
  // 5. Live Countdown Timer
  // ---------------------------------------------------------------------------
  const initCountdown = () => {
    // 24 December 2026 at 11:30 AM IST (Asia/Kolkata)
    const targetDate = new Date('2026-12-24T11:30:00+05:30').getTime();

    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minEl = document.getElementById('countMinutes');
    const secEl = document.getElementById('countSeconds');

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minEl.textContent = '00';
        secEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minEl.textContent = String(minutes).padStart(2, '0');
      secEl.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  };

  initCountdown();

  // ---------------------------------------------------------------------------
  // 6. Save The Date Calendar Dropdown / ICS Generator
  // ---------------------------------------------------------------------------
  const saveCalendarBtn = document.getElementById('saveCalendarBtn');
  if (saveCalendarBtn) {
    const title = encodeURIComponent("Wedding & Nikah of FAAZIL ABOOBAKER & SAFA AAMINA");
    const details = encodeURIComponent("You are warmly invited to celebrate the Wedding and Nikah ceremony of FAAZIL ABOOBAKER & SAFA AAMINA at TMA Pai Conventional Centre, Mangalore.");
    const location = encodeURIComponent("TMA Pai Conventional Centre, MG Road, Kodailbail, Mangaluru, Karnataka");
    // 24 December 2026 11:30 AM IST (UTC+5:30) is 20261224T060000Z
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261224T060000Z/20261224T110000Z&details=${details}&location=${location}`;
    saveCalendarBtn.setAttribute('href', gcalUrl);
    saveCalendarBtn.setAttribute('target', '_blank');
    saveCalendarBtn.setAttribute('rel', 'noopener noreferrer');
  }

  // ---------------------------------------------------------------------------
  // 7. Demo-Only In-Memory RSVP Form Handler
  // ---------------------------------------------------------------------------
  const initRsvpForm = () => {
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpConfirmation = document.getElementById('rsvpConfirmation');
    const attendanceSelect = document.getElementById('attendanceSelect');
    const guestCountGroup = document.getElementById('guestCountGroup');
    const guestNameInput = document.getElementById('guestName');
    const guestCountSelect = document.getElementById('guestCount');
    const confirmHeading = document.getElementById('rsvpConfirmHeading');
    const confirmMessage = document.getElementById('rsvpConfirmMessage');
    const confirmDetails = document.getElementById('rsvpConfirmDetails');
    const rsvpEditBtn = document.getElementById('rsvpEditBtn');

    if (!rsvpForm) return;

    // In-memory response storage for current session only (no API, no DB)
    let sessionRsvpResponse = null;

    // Toggle guest count field when declining
    if (attendanceSelect && guestCountGroup) {
      attendanceSelect.addEventListener('change', () => {
        if (attendanceSelect.value === 'decline') {
          guestCountGroup.style.display = 'none';
        } else {
          guestCountGroup.style.display = 'flex';
        }
      });
    }

    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (guestNameInput.value || '').trim();
      const attendance = attendanceSelect.value;
      const guests = guestCountSelect ? guestCountSelect.value : '1';
      const message = (document.getElementById('guestMessage')?.value || '').trim();

      if (!name) {
        alert('Please enter your name.');
        guestNameInput.focus();
        return;
      }
      if (!attendance) {
        alert('Please select whether you will be attending.');
        attendanceSelect.focus();
        return;
      }

      // Store in memory for current page session only
      sessionRsvpResponse = {
        name,
        attendance,
        guests: attendance === 'accept' ? guests : '0',
        message,
        timestamp: new Date().toISOString()
      };

      // Populate in-place confirmation message
      if (attendance === 'accept') {
        confirmHeading.textContent = `Thank you, ${name}!`;
        confirmMessage.textContent = 'We look forward to celebrating with you.';
        confirmDetails.style.display = 'inline-block';
        confirmDetails.textContent = `Seats Reserved: ${guests} ${guests === '1' ? 'Guest' : 'Guests'}`;
      } else {
        confirmHeading.textContent = `Thank you, ${name}.`;
        confirmMessage.textContent = 'Thank you for letting us know. You will be missed.';
        confirmDetails.style.display = 'none';
      }

      // Transition smoothly to confirmation card
      rsvpForm.style.display = 'none';
      rsvpConfirmation.style.display = 'block';
      rsvpConfirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    if (rsvpEditBtn) {
      rsvpEditBtn.addEventListener('click', () => {
        rsvpConfirmation.style.display = 'none';
        rsvpForm.style.display = 'flex';
      });
    }
  };

  initRsvpForm();
});
