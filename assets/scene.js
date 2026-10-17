/* Host API: CVScene.mount(element, { labels, links, eyebrow, caption, hint }). */
(function(global){
'use strict';
const materials={stone:['#c4c1ae','#a7aa98','#e5e0cb','#d2d1ba'],teal:['#345dcc','#172f7c','#7e9aed','#4f74d5'],bronze:['#d58d4d','#915827','#f1c289','#e1a869'],paper:['#d7d0b6','#b2af98','#eee6cc','#ded8bf']};
function box(x,y,z,w,h,d,material){const e=document.createElement('div');e.className='cv-scene__box';e.dataset.material=material;const c=materials[material];Object.entries({x,y,z,w,h,d}).forEach(([key,v])=>e.style.setProperty('--'+key,v+'px'));['front','side','top','left'].forEach((key,i)=>e.style.setProperty('--'+key,c[i]));['front','back','left','right','top','bottom'].forEach(side=>{const face=document.createElement('div');face.className='cv-scene__face cv-scene__face--'+side;e.appendChild(face)});return e;}
function mount(root,options={}){
 if(!root)throw new Error('CVScene requires a root element.');
 if(root._cvSceneCleanup)root._cvSceneCleanup();
 root.classList.add('cv-scene');root.classList.toggle('cv-scene--compact',!!options.compact);root.dataset.case=options.caseKey||'ickey';root._cvSceneOptions=options;root.replaceChildren();
 const viewport=document.createElement('div');viewport.className='cv-scene__viewport';viewport.setAttribute('aria-hidden','true');
 const world=document.createElement('div');world.className='cv-scene__world';
 const floor=document.createElement('div');floor.className='cv-scene__floor';floor.innerHTML='<div class="cv-scene__grid"></div><div class="cv-scene__shadow"></div><div class="cv-scene__route"></div>';world.appendChild(floor);
 // Three distinct conceptual models, each assembled from true six-faced CSS volumes.
 const models={
  ickey:[[45,265,55,146,25,150,'stone'],[55,243,52,132,15,137,'paper'],[44,224,60,142,12,145,'paper'],[61,205,53,126,12,132,'paper'],[74,186,60,102,12,116,'paper'],[102,169,60,52,10,66,'bronze'],[56,197,124,7,92,8,'bronze'],[255,80,0,34,210,100,'teal'],[374,80,0,34,210,100,'teal'],[255,46,0,153,34,100,'teal'],[246,280,0,171,10,121,'stone'],[299,228,0,61,52,61,'bronze'],[452,264,-26,161,26,142,'stone'],[474,237,-42,139,27,110,'stone'],[496,210,-58,117,27,78,'teal'],[545,183,-58,40,27,43,'bronze']],
  banker:[[44,265,15,570,25,160,'stone'],[66,221,40,115,34,115,'paper'],[76,197,40,95,16,95,'paper'],[88,172,40,70,16,70,'bronze'],[228,129,0,30,136,150,'teal'],[393,129,0,30,136,150,'teal'],[228,99,0,195,30,150,'teal'],[272,218,15,105,34,100,'paper'],[293,185,15,63,22,63,'bronze'],[469,215,-10,119,50,125,'teal'],[483,191,-10,91,24,99,'paper'],[508,165,-10,41,26,49,'bronze']],
  principal:[[55,265,15,550,25,160,'stone'],[79,205,35,118,60,115,'teal'],[79,185,35,118,20,115,'paper'],[91,165,35,94,12,93,'paper'],[263,145,0,118,120,115,'teal'],[263,125,0,118,20,115,'paper'],[275,105,0,94,12,93,'paper'],[447,85,-35,118,180,115,'teal'],[447,65,-35,118,20,115,'paper'],[459,45,-35,94,12,93,'bronze'],[189,209,25,82,9,28,'bronze'],[373,149,-10,82,9,28,'bronze']]
 };
 (models[options.caseKey]||models.ickey).forEach(a=>world.appendChild(box(...a)));
 viewport.appendChild(world);root.appendChild(viewport);
 const caption=document.createElement('div');caption.className='cv-scene__caption';[options.eyebrow||'A study in considered decisions',options.caption||'Sources → structure → outcome'].forEach(t=>{const s=document.createElement('span');s.textContent=t;caption.appendChild(s)});root.appendChild(caption);
 const hint=document.createElement('div');hint.className='cv-scene__hint';hint.textContent=options.hint||'Explore the three stages';root.appendChild(hint);
 const description=document.createElement('p');description.className='cv-scene__sr-only';description.textContent=options.description||'An architectural model: layered evidence, an open judgment threshold, and three delivery steps. Pointer movement reveals subtle geometric depth.';root.appendChild(description);
 const controls=document.createElement('nav');controls.className='cv-scene__controls';controls.setAttribute('aria-label',options.ariaLabel||'Explore selected work');
 const labels=options.labels||['Evidence','Judgment','Delivery'];const links=options.links||['#evidence','#judgment','#delivery'];
 const pose=(x,y)=>{world.style.transform=`translate3d(${12+x*5}px,${5+y*3}px,0) rotateX(${-20-y*2.2}deg) rotateY(${-29+x*4}deg)`};
 labels.slice(0,3).forEach((label,i)=>{const a=document.createElement('a');a.className='cv-scene__link';a.href=links[i]||'#';const n=document.createElement('span');n.className='cv-scene__number';n.textContent='0'+(i+1);const t=document.createElement('span');t.className='cv-scene__label';t.textContent=label;const arrow=document.createElement('span');arrow.className='cv-scene__arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');a.append(n,t,arrow);controls.appendChild(a)});if(!options.hideControls)root.appendChild(controls);else hint.style.bottom='20px';
 const motion=matchMedia('(prefers-reduced-motion: reduce)');const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const move=e=>{if(motion.matches||!fine.matches||e.pointerType==='touch')return;const r=root.getBoundingClientRect();pose(Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1)),Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1)))};
 const reset=()=>{world.style.transform=''};
 root.addEventListener('pointermove',move);root.addEventListener('pointerleave',reset);motion.addEventListener('change',reset);root.dataset.ready='true';
 const resize=()=>{if(options.compact)world.style.scale=String(Math.min(root.clientWidth/710,(root.clientHeight-25)/360,.92))};const observer=new ResizeObserver(resize);observer.observe(root);resize();
 root._cvSceneCleanup=()=>{observer.disconnect();root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',reset);motion.removeEventListener('change',reset)};
 return {destroy(){root._cvSceneCleanup();root.replaceChildren();delete root._cvSceneCleanup},setContent(next){return mount(root,Object.assign({},options,next))}};
}
function setCase(root,key,options={}){const settings=Object.assign({},root._cvSceneOptions||{},options,{caseKey:key});return mount(root,settings)}
global.CVScene={mount,setCase};
})(window);

