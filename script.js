
if(!localStorage.getItem('appPassword')) localStorage.setItem('appPassword','199512');

function togglePassword(){
 let i=document.getElementById('passwordInput');
 i.type=i.type==='password'?'text':'password';
}

function showApp(){
 loginScreen.classList.add('hidden');
 appScreen.classList.remove('hidden');
 renderLinks();
}

function checkLogin(){
 if(passwordInput.value===localStorage.getItem('appPassword')){
   localStorage.setItem('loggedIn','true');
   showApp();
 }
}

if(localStorage.getItem('loggedIn')==='true'){
 window.onload=showApp;
}

function logout(){
 localStorage.removeItem('loggedIn');
 location.reload();
}

function toggleSettings(){settingsPanel.classList.toggle('hidden');}

function changePassword(){
 if(currentPass.value!==localStorage.getItem('appPassword')) return alert('Wrong current password');
 if(newPass.value!==confirmPass.value) return alert('Passwords do not match');
 localStorage.setItem('appPassword',newPass.value);
 alert('Password updated');
}

function getLinks(){return JSON.parse(localStorage.getItem('links')||'[]')}
function saveLinks(v){localStorage.setItem('links',JSON.stringify(v))}
function getBin(){return JSON.parse(localStorage.getItem('recycleBin')||'[]')}
function saveBin(v){localStorage.setItem('recycleBin',JSON.stringify(v))}

function addLink(){
 if(!titleInput.value||!urlInput.value)return;
 let l=getLinks();
 l.unshift({id:Date.now(),title:titleInput.value,url:urlInput.value,note:noteInput.value});
 saveLinks(l);
 titleInput.value=urlInput.value=noteInput.value='';
 renderLinks();
}

function moveToBin(id){
 let links=getLinks(), item=links.find(x=>x.id===id);
 saveLinks(links.filter(x=>x.id!==id));
 let bin=getBin(); bin.unshift(item); saveBin(bin);
 renderLinks();
}

function deleteSelected(){
 document.querySelectorAll('.selector:checked').forEach(x=>moveToBin(Number(x.value)));
}

function toggleBin(){binSection.classList.toggle('hidden');}

function restoreLink(id){
 let bin=getBin(), item=bin.find(x=>x.id===id);
 saveBin(bin.filter(x=>x.id!==id));
 let links=getLinks(); links.unshift(item); saveLinks(links);
 renderLinks();
}

function deleteForever(id){
 saveBin(getBin().filter(x=>x.id!==id));
 renderLinks();
}

function copyLink(url){navigator.clipboard.writeText(url);}

function updateSelectionBar(){
 let c=document.querySelectorAll('.selector:checked').length;
 selectionBar.classList.toggle('hidden',c===0);
 selectionBar.querySelector('button').innerText='Delete Selected ('+c+')';
}

function renderLinks(){
 activeCount.innerText=getLinks().length+' Links';
 binCount.innerText=getBin().length;

 let q=(searchInput.value||'').toLowerCase();
 linksContainer.innerHTML='';
 getLinks().filter(l=>JSON.stringify(l).toLowerCase().includes(q)).forEach(l=>{
 linksContainer.innerHTML+=`<div class="link-card">
 <input class="selector" type="checkbox" value="${l.id}" onchange="updateSelectionBar()" style="width:auto">
 <h3>${l.title}</h3><p>${l.note||''}</p><small>${l.url}</small>
 <div class="actions">
 <button onclick="window.open('${l.url}','_blank')">Open</button>
 <button onclick="copyLink('${l.url}')">Copy</button>
 <button onclick="moveToBin(${l.id})">Delete</button>
 </div></div>`;
 });

 binContainer.innerHTML='';
 getBin().forEach(l=>{
 binContainer.innerHTML+=`<div class="link-card">
 <h3>${l.title}</h3>
 <div class="actions">
 <button onclick="restoreLink(${l.id})">Restore</button>
 <button onclick="deleteForever(${l.id})">Delete Forever</button>
 </div></div>`;
 });
}
