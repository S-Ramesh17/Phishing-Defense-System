// pdf-generator.js - simple client-side PDF generation (requires jsPDF CDN)
function loadReportsFromTextarea() {
  let txt = document.getElementById('data').value;
  try {
    const arr = JSON.parse(txt);
    renderTable(arr);
    window.loadedReports = arr;
  } catch (e) {
    alert('Invalid JSON');
  }
}
function renderTable(arr) {
  const table = document.getElementById('table');
  if(!arr || !arr.length){ table.innerHTML = '<p>No reports</p>'; return; }
  table.innerHTML = '<table border="1" cellpadding="6" cellspacing="0"><tr><th>Time</th><th>URL</th><th>Detected</th><th>Score</th></tr>' + arr.map(r=>`<tr><td>${new Date(r.timestamp).toLocaleString()}</td><td><a href="${r.url}" target="_blank">${r.url}</a></td><td>${r.detected}</td><td>${r.score}</td></tr>`).join('') + '</table>';
}
document.getElementById('load')?.addEventListener('click', loadReportsFromTextarea);
document.getElementById('exportPdf')?.addEventListener('click', function(){
  const arr = window.loadedReports || [];
  if(!arr.length){ alert('No reports loaded'); return; }
  // use jsPDF via CDN - create simple PDF
  const doc = new window.jspdf.jsPDF();
  doc.setFontSize(12);
  doc.text('PhishShield Reports', 14, 20);
  let y = 30;
  arr.forEach((r,i)=>{
    doc.text(`${i+1}. ${new Date(r.timestamp).toLocaleString()} — ${r.detected? 'PHISHING':'clean'} — ${r.url}`, 14, y);
    y += 8;
    if(y > 270){ doc.addPage(); y = 20; }
  });
  doc.save('phishshield-reports.pdf');
});