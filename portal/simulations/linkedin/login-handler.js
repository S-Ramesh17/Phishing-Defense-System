document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('msg').innerText = 'Training submission received. Good job — do not use real passwords.';
});