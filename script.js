const PIN='199512';

function unlockVault(){
const pin=document.getElementById('pinInput').value;

if(pin===PIN){
document.getElementById('loginScreen').classList.add('hidden');
document.getElementById('appScreen').classList.remove('hidden');
renderLinks();
}else{
document.getElementById('loginMessage').innerText='Wrong PIN';
}
}

function getLinks(){
return JSON.parse(localStorage.getItem('links')||'[]');
}

function saveLinks(links){
localStorage.setItem('links',JSON.stringify(links));
}

function addLink(){
const title=document.getElementById('titleInput').value.trim();
const url=document.getElementById('urlInput').value.trim();
const note=document.getElementById('noteInput').value.trim();

if(!title||!url) return;

const links=getLinks();

links.unshift({
id:Date.now(),
title,
url,
note
});

saveLinks(links);

document.getElementById('titleInput').value='';
document.getElementById('urlInput').value='';
document.getElementById('noteInput').value='';

renderLinks();
}

function deleteLink(id){
let links=getLinks();
links=links.filter(l=>l.id!==id);
saveLinks(links);
renderLinks();
}

function copyLink(url){
navigator.clipboard.writeText(url);
alert('Link Copied');
}

function renderLinks(){
const search=document.getElementById('searchInput').value.toLowerCase();
const container=document.getElementById('linksContainer');

let links=getLinks();

links=links.filter(l=>
l.title.toLowerCase().includes(search)||
l.url.toLowerCase().includes(search)||
l.note.toLowerCase().includes(search)
);

container.innerHTML='';

links.forEach(link=>{
container.innerHTML+=`
<div class="link-card">
<h3>${link.title}</h3>
<small>${link.url}</small>
<p>${link.note}</p>

<div class="actions">
<button onclick="window.open('${link.url}','_blank')">Open</button>
<button onclick="copyLink('${link.url}')">Copy</button>
<button onclick="deleteLink(${link.id})">Delete</button>
</div>
</div>
`;
});
}