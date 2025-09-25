// content/dom-scanner.js
// Scans the DOM for basic phishing indicators and notifies the background service worker
(function() {
  try {
    const url = location.href;
    const suspiciousKeywords = ['password', 'confirm', 'verify', 'secure', 'one-time', 'bank', 'account'];
    let score = 0;
    // Check for forms that request sensitive input
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input');
      inputs.forEach(inp => {
        const t = (inp.getAttribute('type') || '').toLowerCase();
        const name = (inp.getAttribute('name') || '').toLowerCase();
        const placeholder = (inp.getAttribute('placeholder') || '').toLowerCase();
        if (['password', 'email', 'tel'].includes(t)) score += 1;
        suspiciousKeywords.forEach(k => {
          if ((name && name.includes(k)) || (placeholder && placeholder.includes(k))) score += 1;
        });
      });
    });
    // Check for suspicious links that impersonate known brands
    const anchors = Array.from(document.querySelectorAll('a')).slice(0,80);
    anchors.forEach(a => {
      const href = (a.href || '').toLowerCase();
      if (!href) return;
      if (href.includes('login') || href.includes('secure') || href.includes('update')) score += 0.2;
      if (href.includes('paypal') && !location.hostname.includes('paypal.com')) score += 1;
    });
    // If score threshold reached, ask background to record
    if (score >= 2) {
      chrome.runtime.sendMessage({ type: 'check_url', url, evidence_score: score }, (resp) => {
        // Optionally show a small warning overlay
        try {
          if (resp && resp.report && resp.report.detected) {
            const existing = document.getElementById('__phishshield_warn');
            if (!existing) {
              const warn = document.createElement('div');
              warn.id = '__phishshield_warn';
              warn.style.position = 'fixed';
              warn.style.right = '12px';
              warn.style.bottom = '12px';
              warn.style.zIndex = 2147483647;
              warn.style.background = 'rgba(255,70,70,0.95)';
              warn.style.color = '#fff';
              warn.style.padding = '10px 14px';
              warn.style.borderRadius = '8px';
              warn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
              warn.style.fontFamily = 'Arial, sans-serif';
              warn.innerText = 'PhishShield: Possible phishing page detected — open extension for actions.';
              document.body.appendChild(warn);
              setTimeout(()=> warn.remove(), 12000);
            }
          }
        } catch (e) { /* ignore DOM errors */ }
      });
    }
  } catch (e) {
    // fail silently for page scripts
    console.error('dom-scanner error', e);
  }
})();