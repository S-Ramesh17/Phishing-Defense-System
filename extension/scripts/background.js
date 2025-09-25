// background.js - service worker (Manifest V3)
/*
  NOTE: This demo uses placeholder calls for Google Safe Browsing / PhishTank.
  Replace with your own free API keys and server-side proxy for production use.
*/
const STORAGE_KEY = 'phishshield_reports';

// utility to save report
async function saveReport(report) {
  const data = await chrome.storage.sync.get({ [STORAGE_KEY]: [] });
  const arr = data[STORAGE_KEY];
  arr.unshift(report);
  await chrome.storage.sync.set({ [STORAGE_KEY]: arr });
  // limit to 200 entries
  if (arr.length > 200) {
    arr.splice(200);
    await chrome.storage.sync.set({ [STORAGE_KEY]: arr });
  }
}

async function checkUrlWithApis(url) {
  // This function SHOULD call Google Safe Browsing and PhishTank APIs.
  // For demo, perform simple heuristics and mark suspicious if URL contains known phishing terms.
  let score = 0;
  const suspiciousTerms = ['login', 'secure', 'update', 'verify', 'confirm', 'account', 'bank', 'signin', 'webscr'];
  const u = url.toLowerCase();
  suspiciousTerms.forEach(term => { if (u.includes(term)) score += 1; });
  // very naive: long hostnames, IP-based, or many subdomains increase suspicion
  try {
    const urlObj = new URL(url);
    if (/^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) score += 2;
    const dots = urlObj.hostname.split('.').length;
    if (dots >= 4) score += 1;
    if (u.includes('paypal') || u.includes('facebook') || u.includes('google') || u.includes('instagram')) {
      // if the path seems unrelated to official domains, slight increase
      if (!urlObj.hostname.includes('paypal.com') && (u.includes('paypal') || u.includes('pay-pal'))) score += 2;
    }
  } catch (e) {
    score += 1;
  }
  return {score};
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('cleanup', { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'cleanup') {
    // keep storage size in check
    const data = await chrome.storage.sync.get({ [STORAGE_KEY]: [] });
    if (data[STORAGE_KEY].length > 500) {
      data[STORAGE_KEY].splice(500);
      chrome.storage.sync.set({ [STORAGE_KEY]: data[STORAGE_KEY] });
    }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'check_url') {
    (async () => {
      const url = msg.url || (sender.tab && sender.tab.url) || '';
      const res = await checkUrlWithApis(url);
      const detected = res.score >= 2;
      const report = {
        url,
        detected,
        score: res.score,
        timestamp: new Date().toISOString(),
        tabId: sender.tab ? sender.tab.id : null
      };
      await saveReport(report);
      sendResponse({ report });
    })();
    // return true to indicate async response
    return true;
  }
});

// simple context menu? (optional: commented)
// chrome.contextMenus.create({ id: 'report', title: 'Report this page to PhishShield', contexts: ['page'] });
