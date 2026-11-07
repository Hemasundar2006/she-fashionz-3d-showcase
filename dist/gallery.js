const products = [
  {name:'Vermilion Zari',price:'₹35,500',type:'bridal',image:'assets/sample-1.webp',tone:'#8b172d',desc:'Pure silk concept with a wide antique-gold border and temple-inspired pallu.'},
  {name:'Peacock Teal',price:'₹29,900',type:'silk',image:'assets/sample-2.webp',tone:'#075d58',desc:'Saturated teal silk concept woven with a statement gold border.'},
  {name:'Aubergine Heirloom',price:'₹31,800',type:'silk',image:'assets/sample-3.webp',tone:'#572744',desc:'Deep aubergine silk concept with an ornate woven floral finish.'},
  {name:'Champagne Vows',price:'₹32,000',type:'bridal',image:'assets/sample-4.webp',tone:'#b79058',desc:'Champagne bridal concept paired with an embellished blouse.'},
  {name:'Copper Ceremony',price:'₹27,500',type:'bridal',image:'assets/sample-5.webp',tone:'#a34d2c',desc:'Copper-gold ceremony silk concept with a matching statement blouse.'},
  {name:'Rose Gold Whisper',price:'₹24,900',type:'silk',image:'assets/sample-6.webp',tone:'#b86e71',desc:'A soft rose-gold drape concept with intricate tonal zari.'},
  {name:'Emerald Meenakari',price:'₹33,500',type:'meenakari',image:'assets/sample-7.webp',tone:'#174d38',desc:'Emerald silk concept alive with colourful Meenakari floral weaving.'},
  {name:'Plum Garden',price:'₹30,800',type:'meenakari',image:'assets/sample-8.webp',tone:'#693253',desc:'Plum silk concept with a richly coloured garden-inspired pallu.'},
  {name:'Midnight Peacock',price:'₹34,200',type:'silk',image:'assets/sample-9.webp',tone:'#1f3158',desc:'Midnight-blue silk concept finished with a vibrant peacock border.'}
];

const looks = [
  ['Ivory Rose','₹42,400'],['Emerald Rani','₹48,200'],['Copper Glow','₹44,600'],['Aubergine Élan','₹46,900'],
  ['Peacock Garden','₹45,500'],['Vermilion Vows','₹52,100'],['Champagne Light','₹49,800'],['Midnight Queen','₹47,300']
];
const reels = [
  ['Courtyard Red','Kanchi silk · Chennai','00:18'],['Temple Teal','Pure zari · Kanchipuram','00:22'],['Ivory Morning','Soft silk · Hyderabad','00:16'],['Lamp-lit Plum','Kanchi silk · Old city','00:21'],['Vermilion Vows','Bridal silk · The silk room','00:24']
];
let bagCount=0,lookIndex=0,reelIndex=2,bridalIndex=0,reelTimer,filmTimer,lookTimer,lookInView=false;
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const wrap=(value,length)=>(value%length+length)%length;
const whatsapp=message=>'https://wa.me/917207258606?text='+encodeURIComponent(message);
const toast=message=>{const el=$('.toast');el.textContent=message;el.classList.add('show');clearTimeout(el._timer);el._timer=setTimeout(()=>el.classList.remove('show'),2200)};
const addToBag=(label,amount=1)=>{bagCount+=amount;$('[data-bag-count]').textContent=bagCount;toast(`${label} added to your bag`)};

function setupIntro(){
  const opening=$('.brand-opening');
  if(!opening){document.body.classList.remove('intro-active');return}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let finished=false;
  const finish=()=>{
    if(finished)return;
    finished=true;
    opening.classList.add('is-complete');
    document.body.classList.remove('intro-active');
    setTimeout(()=>opening.remove(),reduced?80:1100);
  };
  const timer=setTimeout(finish,reduced?500:3200);
  $('[data-opening-enter]').addEventListener('click',()=>{clearTimeout(timer);finish()});
  opening.addEventListener('click',event=>{if(event.target.closest('button'))return;clearTimeout(timer);finish()});
  addEventListener('keydown',event=>{if(event.key==='Escape'||event.key==='Enter'){clearTimeout(timer);finish()}},{once:true});
}

function buildLooks(){
  $('#look-carousel').innerHTML=looks.map((look,i)=>`<button class="look-card" data-look="${i}" aria-label="View ${look[0]}"><img src="assets/portraits/look-${i+1}.webp" alt="Model wearing the ${look[0]} silk concept"></button>`).join('');
  updateLooks();
}
function updateLooks(){
  $$('.look-card').forEach((card,i)=>{let offset=i-lookIndex;if(offset>4)offset-=looks.length;if(offset<-4)offset+=looks.length;const distance=Math.abs(offset);card.classList.toggle('active',offset===0);card.style.zIndex=10-distance;card.style.opacity=distance>3?0:String(1-distance*.19);card.style.filter=`blur(${distance>1?(distance-1)*2:0}px)`;card.style.transform=`translateX(calc(-50% + ${offset*54}% + var(--look-drag, 0px))) scale(${1-distance*.12}) rotateY(${offset*-8}deg)`});
  $('[data-look-count]').textContent=String(lookIndex+1).padStart(2,'0');$('[data-look-name]').textContent=looks[lookIndex][0];$('[data-bundle-price]').textContent=looks[lookIndex][1];
  const pieces=[['Saree',products[lookIndex%products.length].name,products[lookIndex%products.length].price,products[lookIndex%products.length].image],['Blouse','Hand-finished silk blouse','₹4,200',`assets/portraits/look-${lookIndex+1}.webp`],['Jewellery','Temple choker & jhumkas','₹9,400','assets/sample-4.webp'],['Styling','Bangles & waist belt','₹7,800','assets/sample-5.webp']];
  $('#look-pieces').innerHTML=pieces.map(p=>`<article class="look-piece"><img src="${p[3]}" alt=""><div><small>SHE FASHIONZ · ${p[0]}</small><h4>${p[1]}</h4><strong>${p[2]}</strong></div><button aria-label="Add ${p[0]} to bag" data-piece="${p[0]}">＋</button></article>`).join('');
  $$('[data-piece]').forEach(button=>button.addEventListener('click',()=>addToBag(button.dataset.piece)));
}
function shiftLook(step){lookIndex=wrap(lookIndex+step,looks.length);updateLooks()}
function stopLookLoop(){clearInterval(lookTimer);lookTimer=null}
function startLookLoop(){
  if(lookTimer||!lookInView||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  lookTimer=setInterval(()=>shiftLook(1),2600);
}
function restartLookLoop(){stopLookLoop();startLookLoop()}

function buildSilks(){
  const rotations=['-7deg','-3deg','1deg','3deg','6deg','-2deg'];
  $('#silk-deck').innerHTML=products.slice(0,7).map((p,i)=>`<button class="silk-card" style="background:${p.tone};--rot:${rotations[i%rotations.length]}" data-product="${i}"><span></span><h3>${p.name}</h3><img src="assets/portraits/look-${i%8+1}.webp" alt="${p.name} styled saree concept"><b class="price">${p.price}</b><i class="heart" aria-hidden="true">♡</i><i class="plus" aria-hidden="true">＋</i></button>`).join('');
}
function buildRack(){
  $('#hangers').innerHTML=products.map((p,i)=>`<button class="hanger" data-product="${i}" data-type="${p.type}" aria-label="Preview ${p.name}"><span class="hook"></span><span class="wood"></span><img src="${p.image}" alt=""><figcaption><strong>${p.name}</strong><small>${p.price}</small></figcaption></button>`).join('');
}
function openProduct(index){
  const p=products[index],dialog=$('#product-dialog');$('#dialog-image').src=p.image;$('#dialog-image').alt=p.name+' saree concept';$('#dialog-name').textContent=p.name;$('#dialog-description').textContent=p.desc;$('#dialog-price').textContent=p.price;$('#dialog-enquire').href=whatsapp(`Hello SHE FASHIONZ, could you share current pieces similar to the ${p.name} concept?`);dialog.showModal();
}

function buildReels(){
  $('#reel-deck').innerHTML=reels.map((r,i)=>`<button class="reel-card" data-reel="${i}" aria-label="Open ${r[0]} visual story"><img src="assets/lifestyle/story-${i+1}.webp" alt="${r[0]} saree visual"><span class="reel-no">REEL ${String(i+1).padStart(2,'0')} · ${r[2]}</span><span class="reel-play">▶</span><span class="reel-meta"><small>${r[1]}</small><h3>${r[0]}</h3><span>Tap to bring this story forward</span></span></button>`).join('');updateReels();
}
function updateReels(){
  $$('.reel-card').forEach((card,i)=>{let offset=i-reelIndex;if(offset>2)offset-=reels.length;if(offset<-2)offset+=reels.length;const distance=Math.abs(offset);card.classList.toggle('active',offset===0);card.style.zIndex=10-distance;card.style.opacity=String(1-distance*.18);card.style.transform=`translateX(calc(-50% + ${offset*78}%)) translateZ(${-distance*130}px) rotateY(${offset*-22}deg) translateY(${distance*35}px) scale(${1-distance*.12})`});
}
function shiftReel(step){reelIndex=wrap(reelIndex+step,reels.length);updateReels()}

function buildBridal(){
  const bridal=[0,5,3,4,6];
  $('#bridal-carousel').innerHTML=bridal.map((p,i)=>`<button class="bridal-card" data-bridal="${i}" aria-label="View ${products[p].name}"><img src="assets/lifestyle/story-${i%6+1}.webp" alt="${products[p].name} bridal concept"></button>`).join('');updateBridal();
}
function updateBridal(){
  const map=[0,5,3,4,6];
  $$('.bridal-card').forEach((card,i)=>{let offset=i-bridalIndex;if(offset>2)offset-=5;if(offset<-2)offset+=5;const distance=Math.abs(offset);card.classList.toggle('active',offset===0);card.style.zIndex=10-distance;card.style.opacity=String(1-distance*.3);card.style.transform=`translateX(calc(-50% + ${offset*84}%)) rotateY(${offset*-17}deg) rotateZ(${offset*5}deg) scale(${1-distance*.15})`});
  const p=products[map[bridalIndex]];$('[data-bridal-name]').textContent=p.name;$('[data-bridal-price]').textContent=p.price;$('[data-bridal-note]').textContent=p.type==='bridal'?'BRIDAL SILK · EMBELLISHED FINISH':'PURE KANCHI · ANTIQUE GOLD PALLU';
}
function shiftBridal(step){bridalIndex=wrap(bridalIndex+step,5);updateBridal()}

function setupFilm(){
  const images=[1,4,5,2,6,3];let current=0,playing=false,elapsed=0;const button=$('[data-film-play]'),progress=$('.film-progress i');
  const frame=()=>{if(!playing)return;elapsed+=.2;current=Math.floor(elapsed/3)%images.length;$('#film-image').src=`assets/lifestyle/story-${images[current]}.webp`;progress.style.width=((elapsed%18)/18*100)+'%';if(elapsed>=18){playing=false;elapsed=0;button.textContent='▶';progress.style.width='0%'}else filmTimer=setTimeout(frame,200)};
  button.addEventListener('click',()=>{playing=!playing;button.textContent=playing?'Ⅱ':'▶';clearTimeout(filmTimer);if(playing)frame()});
}

function setupThree(){
  if(!window.THREE||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const canvas=$('#silk-canvas'),renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(0,0,11);
  const geometry=new THREE.PlaneGeometry(8,1.7,80,18),base=geometry.attributes.position.array.slice();const material=new THREE.MeshPhysicalMaterial({color:0x7a1530,roughness:.34,metalness:.18,clearcoat:.25,clearcoatRoughness:.45,side:THREE.DoubleSide,transparent:true,opacity:.9});const ribbon=new THREE.Mesh(geometry,material);ribbon.position.set(3.7,-2.2,0);ribbon.rotation.z=-.18;scene.add(ribbon);
  const goldGeo=new THREE.PlaneGeometry(8,.08,80,1),gold=new THREE.Mesh(goldGeo,new THREE.MeshBasicMaterial({color:0xe7bb5a,transparent:true,opacity:.9,side:THREE.DoubleSide}));gold.position.copy(ribbon.position);gold.position.y-=.62;gold.rotation.copy(ribbon.rotation);scene.add(gold);
  const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
  let t=0,scroll=0;addEventListener('scroll',()=>scroll=scrollY/innerHeight,{passive:true});
  const animate=()=>{t+=.012;const pos=geometry.attributes.position.array;for(let i=0;i<pos.length;i+=3){const x=base[i],y=base[i+1];pos[i+2]=Math.sin(x*.9+t)*.32+Math.cos(y*2+x*.4+t*.7)*.12;pos[i+1]=y+Math.sin(x*.55+t*.6)*.18}geometry.attributes.position.needsUpdate=true;ribbon.rotation.y=Math.sin(t*.4)*.12+scroll*.08;gold.rotation.y=ribbon.rotation.y;gold.position.y=-2.82+Math.sin(t*.6)*.18;resize();renderer.render(scene,camera);requestAnimationFrame(animate)};animate();
  const reelCanvas=$('#reel-canvas'),rr=new THREE.WebGLRenderer({canvas:reelCanvas,alpha:true,antialias:true});rr.setPixelRatio(Math.min(devicePixelRatio,1.4));const rs=new THREE.Scene(),rc=new THREE.PerspectiveCamera(40,1,.1,100);rc.position.z=10;for(let i=0;i<42;i++){const g=new THREE.BufferGeometry(),points=[];for(let j=0;j<2;j++)points.push(new THREE.Vector3((Math.random()-.5)*15,(Math.random()-.5)*9,-Math.random()*6));g.setFromPoints(points);const line=new THREE.Line(g,new THREE.LineBasicMaterial({color:i%2?0x9a2038:0xd8aa54,transparent:true,opacity:.12}));rs.add(line)}const drawReel=()=>{const w=reelCanvas.clientWidth,h=reelCanvas.clientHeight;rr.setSize(w,h,false);rc.aspect=w/h;rc.updateProjectionMatrix();rs.rotation.z+=.0004;rr.render(rs,rc);requestAnimationFrame(drawReel)};drawReel();
}

function setupEvents(){
  $('[data-look-prev]').addEventListener('click',()=>{shiftLook(-1);restartLookLoop()});$('[data-look-next]').addEventListener('click',()=>{shiftLook(1);restartLookLoop()});$('[data-add-look]').addEventListener('click',()=>addToBag(looks[lookIndex][0]+' full look',4));
  $$('.silk-card,.hanger').forEach(card=>card.addEventListener('click',()=>openProduct(Number(card.dataset.product))));
  $$('.filters button').forEach(button=>button.addEventListener('click',()=>{$$('.filters button').forEach(b=>b.classList.toggle('active',b===button));$$('.hanger').forEach(h=>h.classList.toggle('hidden',button.dataset.filter!=='all'&&h.dataset.type!==button.dataset.filter))}));
  $('.dialog-close').addEventListener('click',()=>$('#product-dialog').close());$('#product-dialog').addEventListener('click',e=>{if(e.target===$('#product-dialog'))$('#product-dialog').close()});$$('.sizes button').forEach(b=>b.addEventListener('click',()=>{$$('.sizes button').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
  $$('[data-reel]').forEach(card=>card.addEventListener('click',()=>{const i=Number(card.dataset.reel);if(i===reelIndex){toast(`${reels[i][0]} visual story selected`)}else{reelIndex=i;updateReels()}}));$('[data-reel-prev]').addEventListener('click',()=>shiftReel(-1));$('[data-reel-next]').addEventListener('click',()=>shiftReel(1));
  $('[data-reel-play]').addEventListener('click',e=>{if(reelTimer){clearInterval(reelTimer);reelTimer=null;e.currentTarget.textContent='▶'}else{reelTimer=setInterval(()=>shiftReel(1),2500);e.currentTarget.textContent='Ⅱ'}});
  $('[data-bridal-prev]').addEventListener('click',()=>shiftBridal(-1));$('[data-bridal-next]').addEventListener('click',()=>shiftBridal(1));$('[data-add-bridal]').addEventListener('click',()=>addToBag($('[data-bridal-name]').textContent));$$('.heart,[data-wishlist]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();b.classList.toggle('active');b.textContent=b.classList.contains('active')?'♥':'♡';toast(b.classList.contains('active')?'Saved to wishlist':'Removed from wishlist')}));
  $('[data-whatsapp]').href=whatsapp('Hello SHE FASHIONZ, I would like help choosing a saree for an occasion.');
  const menu=$('.menu-button');menu.addEventListener('click',()=>{const open=$('.nav-shell').classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
  const lookCarousel=$('#look-carousel');
  let dragState=null,suppressLookClick=false;
  const finishLookDrag=(e,cancelled=false)=>{
    if(!dragState)return;
    const dx=e.clientX-dragState.x,elapsed=Math.max(performance.now()-dragState.time,1),velocity=Math.abs(dx)/elapsed;
    const changed=!cancelled&&dragState.horizontal&&(Math.abs(dx)>34||velocity>.38);
    suppressLookClick=dragState.horizontal;
    if(suppressLookClick)setTimeout(()=>{suppressLookClick=false},250);
    lookCarousel.classList.remove('dragging');
    lookCarousel.style.removeProperty('--look-drag');
    if(changed)shiftLook(dx<0?1:-1);
    dragState=null;
    startLookLoop();
  };
  lookCarousel.addEventListener('pointerdown',e=>{
    if(!e.isPrimary)return;
    stopLookLoop();
    dragState={x:e.clientX,y:e.clientY,time:performance.now(),horizontal:false};
    e.currentTarget.setPointerCapture(e.pointerId);
  });
  lookCarousel.addEventListener('pointermove',e=>{
    if(!dragState||!e.isPrimary)return;
    const dx=e.clientX-dragState.x,dy=e.clientY-dragState.y;
    if(!dragState.horizontal){
      if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
      if(Math.abs(dy)>=Math.abs(dx))return;
      dragState.horizontal=true;
      lookCarousel.classList.add('dragging');
    }
    lookCarousel.style.setProperty('--look-drag',`${Math.max(-140,Math.min(140,dx*.78))}px`);
    if(e.cancelable)e.preventDefault();
  });
  lookCarousel.addEventListener('pointerup',e=>finishLookDrag(e));
  lookCarousel.addEventListener('pointercancel',e=>finishLookDrag(e,true));
  lookCarousel.addEventListener('click',e=>{if(!suppressLookClick)return;suppressLookClick=false;e.preventDefault();e.stopPropagation()},{capture:true});
  lookCarousel.addEventListener('focusin',stopLookLoop);lookCarousel.addEventListener('focusout',e=>{if(!lookCarousel.contains(e.relatedTarget))startLookLoop()});
  new IntersectionObserver(([entry])=>{lookInView=entry.isIntersecting;if(lookInView)startLookLoop();else stopLookLoop()},{threshold:.25}).observe($('#try-look'));
  document.addEventListener('visibilitychange',()=>document.hidden?stopLookLoop():startLookLoop());
  const progress=$('.page-progress i');addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max?scrollY/max:0})`},{passive:true});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('visible',e.isIntersecting)),{threshold:.12});$$('.reveal').forEach(el=>observer.observe(el));
}

setupIntro();buildLooks();buildSilks();buildRack();buildReels();buildBridal();setupFilm();setupEvents();setupThree();
