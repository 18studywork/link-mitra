
if(!localStorage.getItem('appPassword')){
 localStorage.setItem('appPassword','199512');
}

function togglePassword(){
 const input=document.getElementById('pinInput');
 input.type=input.type==='password'?'text':'password';
}

function checkLogin(){
 const pass=localStorage.getItem('appPassword');
 if(document.getElementById('pinInput').value===pass){
   document.getElementById('loginScreen').style.display='none';
   document.getElementById('appScreen').style.display='block';
 }
}
