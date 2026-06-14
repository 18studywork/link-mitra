
const DEFAULT='199512';
if(!localStorage.getItem('appPassword')) localStorage.setItem('appPassword',DEFAULT);

function checkLogin(){
 let pass=localStorage.getItem('appPassword');
 let val=pinInput.value;
 if(val===pass){
   localStorage.setItem('loggedIn','true');
   loginScreen.classList.add('hidden');
   appScreen.classList.remove('hidden');
   renderLinks();
 }
}

if(localStorage.getItem('loggedIn')==='true'){
 window.onload=()=>{
 loginScreen.classList.add('hidden');
 appScreen.classList.remove('hidden');
 renderLinks();
 };
}

function togglePassword(){pinInput.type=pinInput.type==='password'?'text':'password';}
function logout(){localStorage.removeItem('loggedIn');location.reload();}
function toggleSettings(){settings.classList.toggle('hidden');}

function changePassword(){
 let current=currentPass.value,newp=newPass.value,conf=confirmPass.value;
 if(current!==localStorage.getItem('appPassword')) return alert('Wrong current password');
 if(newp!==conf) return alert('Passwords do not match');
 localStorage.setItem('appPassword',newp);
 alert('Password Updated');
}

function getLinks(){return JSON.parse(localStorage.getItem('links')||'[]')}
function saveLinks(v){localStorage.setItem('links',JSON.stringify(v))}
function getBin(){return JSON.parse(localStorage.getItem('recycleBin')||'[]')}
function saveBin(v){localStorage.setItem('recycleBin',JSON.stringify(v))}

function addLink(){
 if(!titleInput.value||!urlInput.value) return;
 let links=getLinks();
 links.unshift({id:Date.now(),title:titleInput.value,url:urlInput.value,note:noteInput.value});
 saveLinks(links);
 titleInput.value=urlInput.value=noteInput.value='';
 renderLinks();
}

function moveToBin(id){
 let links=getLinks(); let item=links.find(x=>x.id===id);
 saveLinks(links.filter(x=>x.id!==id));
 let bin=getBin(); bin.unshift(item); saveBin(bin); renderLinks();
}

function deleteSelected(){
 document.querySelectorAll('.selector:checked').forEach(x=>moveToBin(Number(x.value)));
}

function restoreLink(id){
 let bin=getBin(); let item=bin.find(x=>x.id===id);
 saveBin(bin.filter(x=>x.id!==id));
 let links=getLinks(); links.unshift(item); saveLinks(links); renderLinks();
}

function deleteForever(id){saveBin(getBin().filter(x=>x.id!==id));renderLinks();}
function toggleRecycleBin(){recycleBinSection.classList.toggle('hidden');}
function copyLink(url){navigator.clipboard.writeText(url);}

function updateSelectionBar(){
 let c=document.querySelectorAll('.selector:checked').length;
 selectionBar.classList.toggle('hidden',c===0);
 selectionBar.querySelector('button').innerText='Delete Selected ('+c+')';
}

function renderLinks(){
 activeCount.innerText=getLinks().length+' Links';
 binCount.innerText=getBin().length+' In Bin';
 let q=(searchInput.value||'').toLowerCase();
 linksContainer.innerHTML='';
 getLinks().filter(l=>JSON.stringify(l).toLowerCase().includes(q)).forEach(l=>{
 linksContainer.innerHTML+=`<div class="link-card">
 <input class="selector" onchange="updateSelectionBar()" type="checkbox" value="${l.id}" style="width:auto">
 <h3>${l.title}</h3><p>${l.note||''}</p><small>${l.url}</small>
 <div class="actions">
 <button onclick="window.open('${l.url}','_blank')">Open</button>
 <button onclick="copyLink('${l.url}')">Copy</button>
 <button onclick="moveToBin(${l.id})">Delete</button>
 </div></div>`;
 });
 recycleBinContainer.innerHTML='';
 getBin().forEach(l=>{
 recycleBinContainer.innerHTML+=`<div class="link-card"><h3>${l.title}</h3>
 <div class="actions"><button onclick="restoreLink(${l.id})">Restore</button>
 <button onclick="deleteForever(${l.id})">Delete Forever</button></div></div>`;
 });
}
