document.addEventListener('DOMContentLoaded', () => {

  // EmailJS v4 initialization
  try {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: "YN__2qWaVX8ZQUoBK" });
    }
  } catch (err) {
    console.warn("EmailJS initialization skipped:", err);
  }

  // Header elevation and quick jump to customizer
  const siteHeader = document.getElementById('siteHeader');
  const customizeLink = document.querySelector('.header-cta');

  if (siteHeader) {
    const updateHeaderState = () => {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  if (customizeLink) {
    customizeLink.addEventListener('click', (event) => {
      const orderForm = document.getElementById('orderForm');
      if (!orderForm) return;

      event.preventDefault();
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#orderForm`);

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      orderForm.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });

      const firstField = orderForm.querySelector('input:not([type="file"])');
      window.setTimeout(() => firstField?.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 450);
    });
  }

  // Live Input Sync to Disc Preview
  const inputArcText = document.getElementById('inputArcText');
  const inputTitle = document.getElementById('inputTitle');
  const inputFirstName = document.getElementById('inputFirstName');
  const inputLastName = document.getElementById('inputLastName');
  const inputGradeSection = document.getElementById('inputGradeSection');

  const svgArcText = document.getElementById('svgArcText');
  const displayTitle = document.getElementById('displayTitle');
  const displayName = document.getElementById('displayName');
  const displayGradeSec = document.getElementById('displayGradeSec');

  function updatePreview() {
    if (svgArcText) svgArcText.textContent = inputArcText?.value || 'YOUR NAME';
    if (displayTitle) displayTitle.textContent = inputTitle?.value || 'YOUR TITLE';
    
    const fn = inputFirstName?.value.trim() || '';
    const ln = inputLastName?.value.trim() || '';
    if (displayName) displayName.textContent = `NAME: ${fn} ${ln}`.trim();
    if (displayGradeSec) displayGradeSec.textContent = `CLASS: ${inputGradeSection?.value.trim() || ''}`;
  }

  [inputArcText, inputTitle, inputFirstName, inputLastName, inputGradeSection].forEach(input => {
    if (input) input.addEventListener('input', updatePreview);
  });

  updatePreview();

  // Drag and Drop Image Uploading & Instant Preview Updating
  let uploadedImageData = '';
  const dropZone = document.getElementById('dropZone');
  const imgUpload = document.getElementById('imgUpload');
  const cdImagePreview = document.getElementById('cdImagePreview');
  const miniCdImagePreview = document.getElementById('miniCdImagePreview');
  const fileName = document.getElementById('fileName');

  if (dropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleImageFile(files[0]);
      }
    });
  }

  if (imgUpload) {
    imgUpload.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        handleImageFile(e.target.files[0]);
      }
    });
  }

  function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    
    if (fileName) fileName.textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = function(event) {
      uploadedImageData = event.target.result; // Base64 String
      
      // Update the CD disc artwork immediately
      if (cdImagePreview) {
        cdImagePreview.src = uploadedImageData;
      }
      
      // Update the Keychain artwork immediately
      if (miniCdImagePreview) {
        miniCdImagePreview.src = uploadedImageData;
      }
    };
    reader.readAsDataURL(file);
  }

  // Acrylic Box / Flat View Toggle
  const btnModeFlat = document.getElementById('btnModeFlat');
  const btnModeAcrylic = document.getElementById('btnModeAcrylic');
  const cdBoxContainer = document.getElementById('cdBoxContainer');

  if (btnModeFlat && btnModeAcrylic && cdBoxContainer) {
    btnModeFlat.addEventListener('click', () => {
      btnModeFlat.classList.add('active');
      btnModeAcrylic.classList.remove('active');
      cdBoxContainer.classList.remove('acrylic-mode');
    });

    btnModeAcrylic.addEventListener('click', () => {
      btnModeAcrylic.classList.add('active');
      btnModeFlat.classList.remove('active');
      cdBoxContainer.classList.add('acrylic-mode');
    });
  }

  // Audio Player & Background Switcher
  const audioPlayer = new Audio();
  const musicButtons = document.querySelectorAll('.music-btn');
  const stopMusicBtn = document.getElementById('stopMusicBtn');
  const bgSlides = document.querySelectorAll('.bg-slide');

  function changeBackgroundSmoothly(bgUrl) {
    bgSlides.forEach(slide => {
      if (slide.dataset.bg === bgUrl || slide.style.backgroundImage.includes(bgUrl) || slide.style.backgroundImage.includes(encodeURI(bgUrl))) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  musicButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const songSrc = btn.getAttribute('data-src');
      const targetBg = btn.getAttribute('data-bg');

      musicButtons.forEach(b => b.classList.remove('playing'));

      if (audioPlayer.src === songSrc && !audioPlayer.paused) {
        audioPlayer.pause();
      } else {
        audioPlayer.src = songSrc;
        audioPlayer.play().catch(err => console.log('Audio playback prevented:', err));
        btn.classList.add('playing');
      }

      if (targetBg) {
        changeBackgroundSmoothly(targetBg);
      }
    });
  });

  if (stopMusicBtn) {
    stopMusicBtn.addEventListener('click', () => {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      musicButtons.forEach(b => b.classList.remove('playing'));
    });
  }

  // Minimize / Expand Music Player Toggle
  const toggleMinimizeBtn = document.getElementById('toggleMinimizeBtn');
  const musicPlayerWidget = document.getElementById('musicPlayerWidget');
  const minimizeIcon = document.getElementById('minimizeIcon');

  if (toggleMinimizeBtn && musicPlayerWidget && minimizeIcon) {
    toggleMinimizeBtn.addEventListener('click', () => {
      musicPlayerWidget.classList.toggle('minimized');
      minimizeIcon.textContent = musicPlayerWidget.classList.contains('minimized') ? '+' : '−';
    });
  }

  // Rotatable CD Disc Physics
  const cdDisplay = document.getElementById('interactiveCd');
  const cdRotatingContent = document.getElementById('cdRotatingContent');

  if (cdDisplay && cdRotatingContent) {
    let isDragging = false;
    let currentRotation = 0;
    let previousAngle = 0;
    let rotationVelocity = 0;
    let animationFrameId = null;

    function getAngle(x, y) {
      const rect = cdDisplay.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    }

    function startDrag(e) {
      isDragging = true;
      cancelAnimationFrame(animationFrameId);
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      previousAngle = getAngle(clientX, clientY);
    }

    function moveDrag(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const currentAngle = getAngle(clientX, clientY);
      
      let delta = currentAngle - previousAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      rotationVelocity = delta;
      currentRotation += delta;
      previousAngle = currentAngle;
      
      cdRotatingContent.style.transform = `rotate(${currentRotation}deg)`;
    }

    function stopDrag() {
      if (!isDragging) return;
      isDragging = false;
      applyInertia();
    }

    function applyInertia() {
      if (Math.abs(rotationVelocity) > 0.1) {
        currentRotation += rotationVelocity;
        rotationVelocity *= 0.95;
        cdRotatingContent.style.transform = `rotate(${currentRotation}deg)`;
        animationFrameId = requestAnimationFrame(applyInertia);
      }
    }

    cdDisplay.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', stopDrag);

    cdDisplay.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchmove', moveDrag, { passive: true });
    window.addEventListener('touchend', stopDrag);
  }

  // EmailJS Mobile-Optimized Form Submission
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = orderForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Check image payload size (EmailJS limits free request bodies to 50KB)
      let finalImageData = uploadedImageData;
      if (uploadedImageData && uploadedImageData.length > 50000) {
        finalImageData = "Custom artwork uploaded (Preview generated on page, base64 payload omitted for email length limit)";
      } else if (!uploadedImageData) {
        finalImageData = "No custom image uploaded (Default artwork active)";
      }

      const templateParams = {
        top_text: inputArcText?.value || '',
        title: inputTitle?.value || '',
        first_name: inputFirstName?.value || '',
        last_name: inputLastName?.value || '',
        grade_section: inputGradeSection?.value || '',
        nfc_link: document.getElementById('inputNfc')?.value || '',
        image_data: finalImageData
      };

      if (typeof emailjs !== 'undefined') {
        emailjs.send('service_0qaj8o3', 'template_n9up1ht', templateParams)
          .then(function() {
            alert('Design details & artwork sent successfully!');
            orderForm.reset();
            updatePreview();
          })
          .catch(function(error) {
            alert('Failed to send design. Please check network connection.');
            console.error('EmailJS Error:', error);
          })
          .finally(function() {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Send Order via EmailJS';
            }
          });
      } else {
        alert('EmailJS SDK not loaded. Form input captured locally.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Order via EmailJS';
        }
      }
    });
  }
});
