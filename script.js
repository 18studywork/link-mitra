
const PIN='199512';

function unlockVault(){
 const p=document.getElementById('pinInput').value;
 if(p===PIN){
  loginScreen.classList.add('hidden');
  appScreen.classList.remove('hidden');
  renderLinks();
 } else loginMessage.innerText='Wrong PIN';
}

function togglePassword(){
 const f=document.getElementById('pinInput');
 f.type=f.type==='password'?'text':'password';
}

function getLinks(){return JSON.parse(localStorage.getItem('links')||'[]')}
function saveLinks(v){localStorage.setItem('links',JSON.stringify(v))}
function getBin(){return JSON.parse(localStorage.getItem('recycleBin')||'[]')}
function saveBin(v){localStorage.setItem('recycleBin',JSON.stringify(v))}

function addLink(){
 let title=titleInput.value.trim(),url=urlInput.value.trim(),note=noteInput.value.trim();
 if(!title||!url) return;
 let links=getLinks();
 links.unshift({id:Date.now(),title,url,note});
 saveLinks(links);
 titleInput.value=urlInput.value=noteInput.value='';
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

function copyLink(url){navigator.clipboard.writeText(url);}
function toggleRecycleBin(){recycleBinSection.classList.toggle('hidden')}

function updateSelectionBar(){
 let count=document.querySelectorAll('.selector:checked').length;
 selectionBar.classList.toggle('hidden',count===0);
 selectionBar.querySelector('button').innerText=`Delete Selected (${count})`;
}

function renderLinks(){
 let q=(searchInput?.value||'').toLowerCase();

 let links=getLinks().filter(l=>
 l.title.toLowerCase().includes(q)||
 l.url.toLowerCase().includes(q)||
 (l.note||'').toLowerCase().includes(q)
 );

 activeCount.innerText=getLinks().length+' Links';
 binCount.innerText=getBin().length+' In Bin';

 linksContainer.innerHTML='';
 links.forEach(l=>{
 linksContainer.innerHTML+=`
 <div class="link-card">
 <input class="selector" onchange="updateSelectionBar()" type="checkbox" value="${l.id}" style="width:auto">
 <h3>${l.title}</h3>
 <p>${l.note||''}</p>
 <small>${l.url}</small>
 <div class="actions">
 <button onclick="window.open('${l.url}','_blank')">Open</button>
 <button onclick="copyLink('${l.url}')">Copy</button>
 <button onclick="moveToBin(${l.id})">Delete</button>
 </div>
 </div>`;
 });

 recycleBinContainer.innerHTML='';
 getBin().forEach(l=>{
 recycleBinContainer.innerHTML+=`
 <div class="link-card">
 <h3>${l.title}</h3>
 <div class="actions">
 <button onclick="restoreLink(${l.id})">Restore</button>
 <button onclick="deleteForever(${l.id})">Delete Forever</button>
 </div>
 </div>`;
 });
}
