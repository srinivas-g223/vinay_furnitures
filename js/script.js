(function(){
'use strict';
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var toastEl=$('#toast'),tmr;
function toast(m){toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tmr);tmr=setTimeout(function(){toastEl.classList.remove('on')},3200)}

/* Loader + first hero reveal */
function ready(){$('#loader').classList.add('off');setTimeout(function(){$('#copy').classList.add('in')},350)}
window.addEventListener('load',function(){setTimeout(ready,reduce?0:900)});setTimeout(ready,3500);

/* Header, progress, back to top, active link */
var hdr=$('#hdr'),prog=$('#prog'),topb=$('#totop'),galbg=$('#galbg'),gal=$('#gallery');
var links=$$('#nav a'),secs=links.map(function(a){return $(a.getAttribute('href'))});
function onScroll(){
 var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
 hdr.classList.toggle('s',y>30);prog.style.width=(h>0?y/h*100:0)+'%';topb.classList.toggle('on',y>600);
 var cur=0;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i});
 links.forEach(function(a,i){a.classList.toggle('on',i===cur)});
 if(!reduce){var r=gal.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)galbg.style.transform='translateY('+((r.top+r.height/2-innerHeight/2)*-.12)+'px)'}
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
topb.addEventListener('click',function(){scrollTo({top:0})});

/* Mobile menu */
var nav=$('#nav');$('#burger').addEventListener('click',function(){nav.classList.toggle('open')});
nav.addEventListener('click',function(e){if(e.target.closest('a'))nav.classList.remove('open')});

/* Scroll reveal with stagger */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var t=e.target,sib=$$('.rv',t.parentNode),i=Math.max(0,sib.indexOf(t));setTimeout(function(){t.classList.add('in')},reduce?0:i*130);io.unobserve(t)}})},{threshold:.15});
$$('.rv').forEach(function(el){io.observe(el)});

/* Hero slider (3 slides, auto + arrows + dots) */
var S=[
 {e:'Premium furniture for',t:['A Better Living','Experience'],p:'Transform your house into a home with our stylish, durable and comfortable furniture collection.'},
 {e:'Bedrooms made for',t:['Rest, Warmth','&amp; Comfort'],p:'Solid beds, spacious wardrobes and soft finishes that make every night feel like a getaway.'},
 {e:'Workspaces that',t:['Inspire Your','Best Work'],p:'Desks, chairs and storage built for long days, designed to look good while they work hard.'}];
var sl=$$('.slide'),dots=$$('#dots b'),copy=$('#copy'),idx=0,auto;
function go(n){
 idx=(n+S.length)%S.length;
 sl.forEach(function(s,i){s.classList.remove('on');if(i===idx){void s.offsetWidth;s.classList.add('on')}});
 dots.forEach(function(d,i){d.classList.toggle('on',i===idx)});
 copy.classList.remove('in');
 setTimeout(function(){var d=S[idx];$('#h-eye').textContent=d.e;$('#h-title').innerHTML='<span><i>'+d.t[0]+'</i></span><span><i>'+d.t[1]+'</i></span>';$('#h-text').textContent=d.p;void copy.offsetWidth;copy.classList.add('in')},reduce?0:380);
}
function run(){clearInterval(auto);if(!reduce)auto=setInterval(function(){go(idx+1)},7000)}
$('#next').addEventListener('click',function(){go(idx+1);run()});$('#prev').addEventListener('click',function(){go(idx-1);run()});
dots.forEach(function(d,i){d.style.cursor='pointer';d.addEventListener('click',function(){go(i);run()})});
run();
$('#vid').addEventListener('click',function(){toast('Showroom video coming soon. Call us to book a visit!')});

/* Category cards: 3D tilt on desktop */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
 $$('.cat').forEach(function(c){
  c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(900px) rotateY('+x*8+'deg) rotateX('+-y*8+'deg) translateY(-8px)'});
  c.addEventListener('mouseleave',function(){c.style.transform=''})});
}

/* Testimonials carousel */
var tt=$('#tt'),cards=$$('figure',tt),ti=0,tauto;
function per(){return innerWidth<=560?1:innerWidth<=980?2:3}
function tgo(n){var max=cards.length-per();ti=n>max?0:n<0?max:n;var w=cards[0].getBoundingClientRect().width+20;tt.style.transform='translateX('+(-ti*w)+'px)'}
function trun(){clearInterval(tauto);if(!reduce)tauto=setInterval(function(){tgo(ti+1)},5000)}
$('#tn').addEventListener('click',function(){tgo(ti+1);trun()});$('#tp').addEventListener('click',function(){tgo(ti-1);trun()});
addEventListener('resize',function(){tgo(0)});trun();
/* touch swipe */
var sx=0;tt.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
tt.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40){tgo(ti+(d<0?1:-1));trun()}});

/* Contact form: validate, then open WhatsApp with the message */
var f=$('#form'),err=$('#err');
f.addEventListener('submit',function(e){
 e.preventDefault();var n=$('#fn').value.trim(),p=$('#fp').value.trim(),m=$('#fe').value.trim(),t=$('#fm').value.trim();
 if(!n||!p||!m||!t){err.textContent='Please fill in all the fields.';return}
 if(!/^\S+@\S+\.\S+$/.test(m)){err.textContent='Please enter a valid email address.';return}
 if(p.replace(/\D/g,'').length<10){err.textContent='Please enter a valid 10-digit phone number.';return}
 err.textContent='';
 var msg='Hello Vinay Furniture, I am '+n+' ('+p+', '+m+'). '+t;
 window.open('https://wa.me/919876543210?text='+encodeURIComponent(msg),'_blank','noopener');
 toast('Thank you, '+n.split(' ')[0]+'! Opening WhatsApp to send your message.');f.reset();
});
})();

/* Stats counters + FAQ accordion */
(function(){
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var b=e.target,to=+b.dataset.n,s=b.dataset.s||'',t0=null;
 if(matchMedia('(prefers-reduced-motion:reduce)').matches){b.textContent=to.toLocaleString()+s;return}
 (function st(t){t0=t0||t;var p=Math.min((t-t0)/1800,1);b.textContent=Math.round(to*(1-Math.pow(1-p,3))).toLocaleString()+s;if(p<1)requestAnimationFrame(st)})(performance.now())})},{threshold:.6});
[].forEach.call(document.querySelectorAll('[data-n]'),function(b){cio.observe(b)});
var acc=document.getElementById('acc');
function open(i,on){i.classList.toggle('open',on);var p=i.querySelector('.ap');p.style.maxHeight=on?p.scrollHeight+'px':0}
acc.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var it=b.parentNode,was=it.classList.contains('open');[].forEach.call(acc.querySelectorAll('.ai'),function(x){open(x,false)});open(it,!was)});
open(acc.querySelector('.ai'),true);
})();

/* Full catalog: tabs + search */
(function(){
var D={
'Living Room':[['Sofa Sets','sofa','3+1+1 and 3+2 sets in fabric or leatherette'],['L-Shape Sofas','sofa','Corner sofas that fill the room beautifully'],['Recliners','chair','Push-back and motorised comfort seats'],['Lounge Chairs','chair','Accent chairs with wooden arms'],['Coffee Tables','i-table','Round, oval and nested wooden tables'],['TV Units','i-shelf','Wall-mount and floor units with storage'],['Bookshelves','i-shelf','Open and closed shelving for books and decor'],['Console Tables','i-table','Slim entry and hall tables']],
'Bedroom':[['Beds','i-bed','Single, queen and king sizes in solid wood'],['Storage Beds','i-bed','Hydraulic and box beds with hidden space'],['Wardrobes','i-ward','Sliding and hinged doors, built to your wall'],['Dressing Tables','i-table','With mirror, drawers and seating'],['Bedside Tables','i-table','Compact tables with drawers'],['Chest of Drawers','i-ward','Extra storage for linen and clothes'],['Mattresses','i-bed','Foam, spring and orthopaedic options']],
'Dining Room':[['Dining Tables','i-table','Four, six and eight seaters in teak and sheesham'],['Dining Chairs','i-chair','Cushioned and wooden chairs, sold in sets'],['Sideboards','i-ward','Serving units with drawers and doors'],['Crockery Units','i-shelf','Glass-front display and storage'],['Bar Units','i-ward','Home bar cabinets with glass storage'],['Bar Stools','i-chair','Counter and bar height seating']],
'Office':[['Work Desks','i-desk','Straight and L-shape desks with drawers'],['Executive Chairs','i-chair','High-back ergonomic chairs'],['Conference Tables','i-table','Meeting tables for small and large rooms'],['Filing Cabinets','i-ward','Lockable storage for documents'],['Reception Desks','i-desk','Front desks that welcome clients'],['Office Sofas','sofa','Waiting area and lounge seating']],
'Kids & Study':[['Study Tables','i-desk','With shelves and drawers for books'],['Study Chairs','i-chair','Comfortable seating for long hours'],['Kids Beds','i-bed','Safe, sturdy beds in fun designs'],['Bunk Beds','i-bed','Two beds, one compact frame'],['Toy Storage','i-shelf','Low shelves and boxes kids can reach']],
'Storage':[['Shoe Racks','i-shelf','Open and closed racks for the entrance'],['Cupboards','i-ward','Multi-purpose storage cupboards'],['Pooja Units','i-ward','Wooden mandir units for home prayer'],['Wall Shelves','i-shelf','Floating shelves for books and plants'],['Foyer Cabinets','i-ward','Neat storage for keys and bags']],
'Outdoor & Decor':[['Garden Chairs','i-chair','Weather-friendly seating for lawns'],['Swing Chairs','i-chair','Hanging chairs for balconies'],['Balcony Sets','i-table','Compact table and chair sets'],['Mirrors','i-lamp','Wall and standing mirrors in wooden frames'],['Wall Panels','i-shelf','Wooden panels that warm up a wall'],['Lamps & Decor','i-lamp','Floor lamps and finishing touches']]};
var cats=Object.keys(D),tabs=document.getElementById('ctabs'),box=document.getElementById('items'),cnt=document.getElementById('cnt'),q=document.getElementById('q'),cur='All';
var all=[];cats.forEach(function(c){D[c].forEach(function(i){all.push({c:c,n:i[0],i:i[1]==='chair'?'i-chair':i[1],d:i[2]})})});
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function tabsHtml(){tabs.innerHTML=['All'].concat(cats).map(function(c){return '<button type="button" role="tab" class="'+(c===cur?'on':'')+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join('')}
function render(){
 var term=q.value.trim().toLowerCase(),list=all.filter(function(x){return(cur==='All'||x.c===cur)&&(!term||(x.n+' '+x.d+' '+x.c).toLowerCase().indexOf(term)>-1)});
 cnt.textContent=list.length+(list.length===1?' item':' items')+(cur!=='All'?' in '+cur:'')+(term?' matching "'+q.value.trim()+'"':'');
 box.innerHTML=list.length?list.map(function(x,k){return '<article class="it" style="--i:'+Math.min(k,16)+'"><span class="ib"><svg><use href="#'+x.i+'"/></svg></span><small>'+esc(x.c)+'</small><h4>'+esc(x.n)+'</h4><p>'+esc(x.d)+'</p><a href="#contact" data-ask="'+esc(x.n)+'">Ask for price</a></article>'}).join(''):'<p class="none">Nothing matches that search. Try "sofa" or "bed", or call us for a custom piece.</p>';
}
function setTab(c){cur=c;tabsHtml();render()}
tabs.addEventListener('click',function(e){var b=e.target.closest('button');if(b)setTab(b.dataset.c)});
q.addEventListener('input',function(){if(q.value&&cur!=='All'){cur='All';tabsHtml()}render()});
document.addEventListener('click',function(e){
 var c=e.target.closest('.cat[data-tab],.cat[data-q]');if(c){if(c.dataset.q){q.value=c.dataset.q;setTab('All')}else{q.value='';setTab(c.dataset.tab)}}
 var a=e.target.closest('[data-ask]');if(a){var m=document.getElementById('fm');if(m&&!m.value)m.value='I would like to know the price of: '+a.dataset.ask}
});
tabsHtml();render();
})();
