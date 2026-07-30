(function() {
  const THEME_KEY = 'rag_theme';
  const SIDEBAR_KEY = 'rag_sb';
  const DRAFT_KEY = 'project_inquiry_draft';
  const SESSION_KEY = 'project_inquiry_session';

  const sidebar = document.getElementById('sidebar');
  const sidebarLogo = document.getElementById('sidebarLogo');
  const collapseBtn = document.getElementById('collapseBtn');
  const themeBtn = document.getElementById('themeBtn');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const versionText = document.getElementById('versionText');
  const inquiryForm = document.getElementById('inquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const responseCard = document.getElementById('responseCard');
  const responseIcon = document.getElementById('responseIcon');
  const responseTitle = document.getElementById('responseTitle');
  const responseMessage = document.getElementById('responseMessage');
  const responseReference = document.getElementById('responseReference');
  const referenceValue = document.getElementById('referenceValue');

  function generateSessionId() {
    return 'c_' + Date.now() + Math.random().toString(36).slice(2, 8);
  }

  function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }

  function initSidebar() {
    const collapsed = localStorage.getItem(SIDEBAR_KEY) === 'true';
    if (collapsed) sidebar.classList.add('collapsed');
    versionText.textContent = CONFIG.VERSION;
  }

  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem(SIDEBAR_KEY, sidebar.classList.contains('collapsed'));
  }

  function openMobile() {
    sidebar.classList.add('mobile-open');
    mobileOverlay.classList.add('active');
  }

  function closeMobile() {
    sidebar.classList.remove('mobile-open');
    mobileOverlay.classList.remove('active');
  }

  function loadDraft() {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const data = JSON.parse(draft);
        Object.keys(data).forEach(key => {
          const input = inquiryForm.elements[key];
          if (input) input.value = data[key];
        });
      }
    } catch (e) {}
  }

  function saveDraft() {
    const formData = {};
    Array.from(inquiryForm.elements).forEach(el => {
      if (el.name) formData[el.name] = el.value;
    });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  function resetForm() {
    inquiryForm.reset();
    clearDraft();
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      Array.from(inquiryForm.elements).forEach(el => el.disabled = true);
    } else {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      Array.from(inquiryForm.elements).forEach(el => el.disabled = false);
    }
  }

  function showResponse(success, title, message, reference) {
    responseCard.style.display = 'block';
    responseCard.className = 'response-card ' + (success ? 'success' : 'error');
    responseIcon.textContent = success ? '✅' : '❌';
    responseTitle.textContent = title;
    responseMessage.textContent = message;

    if (reference) {
      responseReference.style.display = 'inline-flex';
      referenceValue.textContent = reference;
    } else {
      responseReference.style.display = 'none';
    }

    responseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideResponse() {
    responseCard.style.display = 'none';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitBtn.classList.contains('loading')) return;
    if (!inquiryForm.reportValidity()) return;

    setLoading(true);
    hideResponse();

    const formData = {};
    Array.from(inquiryForm.elements).forEach(el => {
      if (el.name) formData[el.name] = el.value;
    });

    const payload = {
      message: [
        'Project Inquiry Form Submission',
        'Full Name: ' + formData.fullName,
        'Business Email: ' + formData.businessEmail,
        'Phone Number: ' + formData.phoneNumber,
        'Company Name: ' + formData.companyName,
        'Service Interested In: ' + formData.serviceInterestedIn,
        'Requirements: ' + (formData.requirements || 'N/A')
      ].join('\n'),
      sessionId: getSessionId(),
      formType: 'project_inquiry',
      fullName: formData.fullName,
      businessEmail: formData.businessEmail,
      phoneNumber: formData.phoneNumber,
      companyName: formData.companyName,
      serviceInterestedIn: formData.serviceInterestedIn,
      requirements: formData.requirements || ''
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const data = await res.json();
      const result = Array.isArray(data) ? data[0] : data;

      const success = result.success !== false;
      const title = result.title || 'Response Received';
      const message = result.message || result.text || result.output || result.response || result.answer || result.content || '';
      const reference = result.reference || result.referenceId || result.ref || null;

      showResponse(success, title, message, reference);
      if (success) resetForm();

    } catch (err) {
      const isTimeout = err.name === 'AbortError';
      showResponse(
        false,
        isTimeout ? 'Request Timeout' : 'Connection Error',
        isTimeout ? 'The request took too long to complete. Please try again.' : 'Unable to connect to the server. Please check your connection and try again.',
        null
      );
    } finally {
      setLoading(false);
    }
  }

  function init() {
    initTheme();
    initSidebar();
    loadDraft();

    themeBtn.addEventListener('click', toggleTheme);
    collapseBtn.addEventListener('click', toggleSidebar);
    sidebarLogo.addEventListener('click', function() {
      if (sidebar.classList.contains('collapsed')) toggleSidebar();
    });
    hamburgerBtn.addEventListener('click', openMobile);
    mobileOverlay.addEventListener('click', closeMobile);

    inquiryForm.addEventListener('input', saveDraft);
    inquiryForm.addEventListener('submit', handleSubmit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
