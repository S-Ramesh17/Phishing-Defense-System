document.getElementById('pwd')?.addEventListener('input', function(e){
  const s = e.target.value;
  let score = 0;
  if(s.length >= 8) score++;
  if(/[A-Z]/.test(s)) score++;
  if(/[a-z]/.test(s)) score++;
  if(/[0-9]/.test(s)) score++;
  if(/[^A-Za-z0-9]/.test(s)) score++;
  const labels = ['Very weak','Weak','Okay','Good','Strong','Very strong'];
  document.getElementById('score').innerText = labels[score] || 'Very weak';
});