function getLinks(){return JSON.parse(localStorage.getItem('links')||'[]');}
function saveLinks(v){localStorage.setItem('links',JSON.stringify(v));}
function getBin(){return JSON.parse(localStorage.getItem('recycleBin')||'[]');}
function saveBin(v){localStorage.setItem('recycleBin',JSON.stringify(v));}

function addLink(){
const title=titleInput.value.trim();
const url=urlInput.value.trim();
const note=noteInput.value.trim();
if(!title||!url)return;
const links=getLinks();
links.unshift({id:Date.now(),title,url,note});
saveLinks(links);
titleInput.value='';urlInput.value='';noteInput.value='';
renderLinks();
}

function copyLink(url){navigator.clipboard.writeText(url);alert('Copied');}

function moveToBin(id){
let links=getLinks();
const item=links.find(x=>x.id===id);
if(!item)return;
saveLinks(links.filter(x=>x.id!==id));
const bin=getBin(); bin.unshift(item); saveBin(bin);
renderLinks();
}

function deleteSelected(){
const ids=[...document.querySelectorAll('.selector:checked')].map(x=>Number(x.value));
ids.forEach(moveToBin);
}

function restoreLink(id){
let bin=getBin();
const item=bin.find(x=>x.id===id);
saveBin(bin.filter(x=>x.id!==id));
const links=getLinks(); links.unshift(item); saveLinks(links);
renderLinks();
}

function deleteForever(id){
saveBin(getBin().filter(x=>x.id!==id));
renderLinks();
}

function toggleRecycleBin(){
document.getElementById('recycleBinSection').classList.toggle('hidden');
}

function renderLinks(){
const q=(document.getElementById('searchInput').value||'').toLowerCase();
const links=getLinks().filter(l=>
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
<input class="selector" type="checkbox" value="${l.id}" style="width:auto">
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
renderLinks();