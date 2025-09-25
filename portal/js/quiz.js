const quizData = [
  {q:'You received an email asking you to "verify" your bank account by clicking a link. What should you do?', a:['Click and verify','Ignore and report','Forward to friends'], key:1},
  {q:'The URL shows a long string of numbers instead of a company domain. This is likely:', a:['Safe','Suspicious','Faster'], key:1},
  {q:'A login page asks for your password and an OTP in same form. This is:', a:['Normal','Suspicious','Required'], key:1}
];
(function render(){
  const root = document.getElementById('quiz-root');
  if(!root) return;
  let idx=0, score=0;
  function show(){
    const cur=quizData[idx];
    root.innerHTML = `<div><h3>Q${idx+1}: ${cur.q}</h3>`+cur.a.map((opt,i)=>`<div><button data-i="${i}">${opt}</button></div>`).join('')+`</div>`;
    root.querySelectorAll('button').forEach(b=>b.addEventListener('click',e=>{
      const sel = +b.getAttribute('data-i');
      if(sel===cur.key) score++;
      idx++;
      if(idx<quizData.length) show(); else root.innerHTML = `<h3>Score: ${score}/${quizData.length}</h3>`;
    }));
  }
  show();
})();