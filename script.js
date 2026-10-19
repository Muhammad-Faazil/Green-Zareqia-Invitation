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
  // 4. Three Circular Date Scratch Cards (HTML5 Canvas)
  // ---------------------------------------------------------------------------
  const initScratchCards = () => {
    const cardBoxes = document.querySelectorAll('.date-card-box');
    if (!cardBoxes.length) return;

    // Render solid uniform dark olive green scratch coating matching the Save the Date button
    const drawCardSurface = (canvas) => {
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      ctx.clearRect(0, 0, w, h);

      // Clip drawing strictly to the circle
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
      ctx.clip();

      // Solid, uniform dark olive green surface
      ctx.fillStyle = '#40563A';
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
    };

    // Initialize individual scratch card
    const setupCard = (cardBox) => {
      const canvas = cardBox.querySelector('.date-card-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      drawCardSurface(canvas);

      let isDrawing = false;
      let lastPoint = null;
      let scratchesCount = 0;
      let isRevealedState = false;

      const getCoords = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        return {
          x: (clientX - rect.left) * (w / rect.width),
          y: (clientY - rect.top) * (h / rect.height),
        };
      };

      const checkClearedPercent = () => {
        if (isRevealedState) return;
        try {
          const imageData = ctx.getImageData(0, 0, w, h);
          const data = imageData.data;
          let transparentInsideCircle = 0;
          let totalSampledInsideCircle = 0;
          const stride = 16;
          const cx = w / 2;
          const cy = h / 2;
          const rSq = (w / 2) * (w / 2);

          for (let i = 3; i < data.length; i += stride * 4) {
            const pixelIndex = (i - 3) / 4;
            const px = pixelIndex % w;
            const py = Math.floor(pixelIndex / w);
            const dx = px - cx;
            const dy = py - cy;
            if (dx * dx + dy * dy <= rSq) {
              totalSampledInsideCircle++;
              if (data[i] === 0) {
                transparentInsideCircle++;
              }
            }
          }

          if (totalSampledInsideCircle > 0) {
            const percent = (transparentInsideCircle / totalSampledInsideCircle) * 100;
            if (percent >= 50) {
              isRevealedState = true;
              canvas.classList.add('revealed');
            }
          }
        } catch (e) {}
      };

      const scratch = (x, y, prev) => {
        if (isRevealedState) return;
        ctx.globalCompositeOperation = 'destination-out';

        if (prev) {
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(x, y);
          ctx.lineWidth = 48;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();

        scratchesCount++;
        if (scratchesCount % 10 === 0) {
          checkClearedPercent();
        }
      };

      const startScratch = (clientX, clientY) => {
        isDrawing = true;
        lastPoint = getCoords(clientX, clientY);
        scratch(lastPoint.x, lastPoint.y, null);
      };

      const moveScratch = (clientX, clientY) => {
        if (!isDrawing) return;
        const current = getCoords(clientX, clientY);
        scratch(current.x, current.y, lastPoint);
        lastPoint = current;
      };

      const endScratch = () => {
        if (!isDrawing) return;
        isDrawing = false;
        lastPoint = null;
        checkClearedPercent();
      };

      // Pointer events for unified Mouse, Stylus, and Touch support
      if (window.PointerEvent) {
        canvas.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
          startScratch(e.clientX, e.clientY);
        });

        canvas.addEventListener('pointermove', (e) => {
          if (isDrawing) {
            e.preventDefault();
            moveScratch(e.clientX, e.clientY);
          }
        });

        const handlePointerEnd = (e) => {
          if (isDrawing) {
            endScratch();
            try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
          }
        };

        canvas.addEventListener('pointerup', handlePointerEnd);
        canvas.addEventListener('pointercancel', handlePointerEnd);
      } else {
        // Fallback for older browsers
        canvas.addEventListener('mousedown', (e) => {
          startScratch(e.clientX, e.clientY);
        });
        window.addEventListener('mousemove', (e) => {
          if (isDrawing) moveScratch(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', endScratch);

        canvas.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (e.touches.length > 0) {
            startScratch(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
          if (isDrawing && e.touches.length > 0) {
            e.preventDefault();
            moveScratch(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, { passive: false });

        window.addEventListener('touchend', endScratch);
        window.addEventListener('touchcancel', endScratch);
      }
    };

    cardBoxes.forEach((cardBox) => setupCard(cardBox));
  };

  initScratchCards();

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
