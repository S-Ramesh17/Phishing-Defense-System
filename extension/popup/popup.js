document.addEventListener('DOMContentLoaded', async () => {
  const statEl = document.getElementById('stat');
  const recentEl = document.getElementById('recent');
  const testBtn = document.getElementById('testBtn');
  const reportsBtn = document.getElementById('reportsBtn');
  const scanBtn = document.getElementById('scanBtn');

  async function loadRecent() {
    const data = await chrome.storage.sync.get({ phishshield_reports: [] });
    const arr = data.phishshield_reports.slice(0,5);
    recentEl.innerHTML = '<strong>Recent:</strong><br/>' + (arr.length ? arr.map(r=>`${new Date(r.timestamp).toLocaleString()}: ${r.detected? 'PHISHING':'clean'} - ${r.url}`).join('<br/>') : 'No reports yet');
  }

  loadRecent();

  testBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://USERNAME.github.io/PhishGuard/index.html' });
  });
  reportsBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://USERNAME.github.io/PhishGuard/report.html' });
  });

  scanBtn.addEventListener('click', async () => {
    statEl.textContent = 'Scanning...';
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'manual_scan' }, (res) => {
        statEl.textContent = 'Requested scan (see page overlay if flagged).';
        loadRecent();
      });
    } else {
      statEl.textContent = 'No active tab.';
    }
  });

});

// Export reports helper
const exportBtn = document.createElement('button');
exportBtn.textContent = 'Export Reports';
exportBtn.style.background = '#34a853';
exportBtn.style.marginTop = '8px';
exportBtn.addEventListener('click', async ()=>{
  const data = await chrome.storage.sync.get({ phishshield_reports: [] });
  const text = JSON.stringify(data.phishshield_reports || [], null, 2);
  await navigator.clipboard.writeText(text);
  alert('Reports JSON copied to clipboard. Paste into PhishGuard report page.');
});
document.querySelector('.container').appendChild(exportBtn);
