const STORAGE_KEY = 'phishshield_reports';

async function saveReport(report) {
  const data = await chrome.storage.sync.get({ [STORAGE_KEY]: [] });
  const arr = data[STORAGE_KEY] || [];
  arr.unshift(report);
  if (arr.length > 500) arr.splice(500);
  await chrome.storage.sync.set({ [STORAGE_KEY]: arr });
}

function heuristicCheck(url) {
  const suspiciousTerms = ['login','secure','update','verify','confirm','account','bank','signin','webscr','password','otp','confirmaccount','verifyaccount'];
  let score = 0;
  const u = (url || '').toLowerCase();
  suspiciousTerms.forEach(t => { if (u.includes(t)) score += 1; });
  try {
    const urlObj = new URL(url);
    if (/^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) score += 2;
    const dotCount = (urlObj.hostname.match(/\./g) || []).length;
    if (dotCount >= 3) score += 1;
    ['paypal','facebook','google','instagram','microsoft','apple'].forEach(brand => {
      if (u.includes(brand) && !urlObj.hostname.includes(brand+'.com')) score += 2;
    });
  } catch(e){ score += 1; }
  return { score, detected: score >= 2 };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'manual_tab_check') {
    (async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = tabs[0]?.url || '';
      const res = heuristicCheck(url);
      const report = {
        url,
        detected: res.detected,
        score: res.score,
        timestamp: new Date().toISOString(),
        tabId: tabs[0]?.id,
        source:'demo-heuristic'
      };
      await saveReport(report);
      chrome.runtime.sendMessage({ type:'scan_result', report });
      sendResponse({ report });
    })();
    return true;
  }
});
