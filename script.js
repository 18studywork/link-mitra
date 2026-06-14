
if(!localStorage.getItem('appPassword')) localStorage.setItem('appPassword','199512');

function togglePassword(){
 const el=document.getElementById('pinInput');
 el.type = el.type === 'password' ? 'text' : 'password';
}

function checkLogin(){
 const pass=localStorage.getItem('appPassword');
 if(document.getElementById('pinInput').value===pass){
   localStorage.setItem('loggedIn','true');
   loginScreen.classList.add('hidden');
   appScreen.classList.remove('hidden');
   renderLinks();
 }
}

window.onload=function(){
 if(localStorage.getItem('loggedIn')==='true'){
   loginScreen.classList.add('hidden');
   appScreen.classList.remove('hidden');
   renderLinks();
 }
}

function logout(){localStorage.removeItem('loggedIn');location.reload();}
function toggleSettings(){settings.classList.toggle('hidden');}

function changePassword(){
 const current=currentPass.value;
 const newp=newPass.value;
 const conf=confirmPass.value;
 if(current!==localStorage.getItem('appPassword')) return alert('Wrong current password');
 if(newp!==conf) return alert('Passwords do not match');
 localStorage.setItem('appPassword',newp);
 alert('Password updated');
}

function getLinks(){return JSON.parse(localStorage.getItem('links')||'[]')}
function saveLinks(v){localStorage.setItem('links',JSON.stringify(v))}
function getBin(){return JSON.parse(localStorage.getItem('recycleBin')||'[]')}
function saveBin(v){localStorage.setItem('recycleBin',JSON.stringify(v))}

function addLink(){
 let t=titleInput.value.trim(),u=urlInput.value.trim(),n=noteInput.value.trim();
 if(!t||!u) return;
 let links=getLinks();
 links.unshift({id:Date.now(),title:t,url:u,note:n});
 saveLinks(links);
 titleInput.value='';urlInput.value='';noteInput.value='';
 renderLinks();
}

function moveToBin(id){
 let links=getLinks();
 let item=links.find(x=>x.id===id);
 if(!item) return;
 saveLinks(links.filter(x=>x.id!==id));
 let bin=getBin(); bin.unshift(item); saveBin(bin);
 renderLinks();
}

function deleteSelected(){
 document.querySelectorAll('.selector:checked').forEach(c=>moveToBin(Number(c.value)));
}

function restoreLink(id){
 let bin=getBin();
 let item=bin.find(x=>x.id===id);
 saveBin(bin.filter(x=>x.id!==id));
 let links=getLinks(); links.unshift(item); saveLinks(links);
 renderLinks();
}

function deleteForever(id){
 saveBin(getBin().filter(x=>x.id!==id));
 renderLinks();
}

function copyLink(url){navigator.clipboard.writeText(url);alert('Copied');}
function toggleRecycleBin(){recycleBinSection.classList.toggle('hidden');}

function updateSelectionBar(){
 let count=document.querySelectorAll('.selector:checked').length;
 selectionBar.classList.toggle('hidden',count===0);
 selectionBar.querySelector('button').innerText='Delete Selected ('+count+')';
}

function renderLinks(){
 activeCount.innerText=getLinks().length+' Links';
 binCount.innerText=getBin().length+' In Bin';

 let q=(searchInput.value||'').toLowerCase();
 linksContainer.innerHTML='';

 getLinks().filter(l=>JSON.stringify(l).toLowerCase().includes(q)).forEach(l=>{
 linksContainer.innerHTML+=`<div class="link-card">
 <input class="selector" type="checkbox" value="${l.id}" onchange="updateSelectionBar()" style="width:auto">
 <h3>${l.title}</h3>
 <p>${l.note||''}</p>
 <small>${l.url}</small>
 <div class="actions">
 <button onclick="window.open('${l.url}','_blank')">Open</button>
 <button onclick="copyLink('${l.url}')">Copy</button>
 <button onclick="moveToBin(${l.id})">Delete</button>
 </div></div>`;
 });

 recycleBinContainer.innerHTML='';
 getBin().forEach(l=>{
 recycleBinContainer.innerHTML+=`<div class="link-card">
 <h3>${l.title}</h3>
 <div class="actions">
 <button onclick="restoreLink(${l.id})">Restore</button>
 <button onclick="deleteForever(${l.id})">Delete Forever</button>
 </div></div>`;
 });
}
