/* Host API: CVScene.mount(element, { labels, links, eyebrow, caption, hint }). */
(function(global){
'use strict';
const materials={stone:['#c4c1ae','#a7aa98','#e5e0cb','#d2d1ba'],teal:['#526d67','#304c47','#8fa59a','#6b847a'],bronze:['#9f8657','#6b5836','#d0b780','#b3a073'],paper:['#d7d0b6','#b2af98','#eee6cc','#ded8bf']};
function box(x,y,z,w,h,d,material){const e=document.createElement('div');e.className='cv-scene__box';e.dataset.material=material;const c=materials[material];Object.entries({x,y,z,w,h,d}).forEach(([key,v])=>e.style.setProperty('--'+key,v+'px'));['front','side','top','left'].forEach((key,i)=>e.style.setProperty('--'+key,c[i]));['front','back','left','right','top','bottom'].forEach(side=>{const face=document.createElement('div');face.className='cv-scene__face cv-scene__face--'+side;e.appendChild(face)});return e;}
function mount(root,options={}){
 if(!root)throw new Error('CVScene requires a root element.');
 if(root._cvSceneCleanup)root._cvSceneCleanup();
 root.classList.add('cv-scene');root.classList.toggle('cv-scene--compact',!!options.compact);root.dataset.case=options.caseKey||'ickey';root._cvSceneOptions=options;root.replaceChildren();
 const viewport=document.createElement('div');viewport.className='cv-scene__viewport';viewport.setAttribute('aria-hidden','true');
 const world=document.createElement('div');world.className='cv-scene__world';
 const floor=document.createElement('div');floor.className='cv-scene__floor';floor.innerHTML='<div class="cv-scene__grid"></div><div class="cv-scene__shadow"></div><div class="cv-scene__route"></div>';world.appendChild(floor);
 // Evidence: sediment-like source layers, held by a bronze datum.
 [[45,265,55,146,25,150,'stone'],[55,243,52,132,15,137,'paper'],[44,224,60,142,12,145,'paper'],[61,205,53,126,12,132,'paper'],[74,186,60,102,12,116,'paper'],[102,169,60,52,10,66,'bronze'],[56,197,124,7,92,8,'bronze']].forEach(a=>world.appendChild(box(...a)));
 // Judgment: a thick, open threshold with clearly lit front and shaded reveals.
 [[255,80,0,34,210,100,'teal'],[374,80,0,34,210,100,'teal'],[255,46,0,153,34,100,'teal'],[246,280,0,171,10,121,'stone'],[299,228,0,61,52,61,'bronze']].forEach(a=>world.appendChild(box(...a)));
 // Delivery: three resolved steps, a measured plane and an offset bronze marker.
 [[452,264,-26,161,26,142,'stone'],[474,237,-42,139,27,110,'stone'],[496,210,-58,117,27,78,'teal'],[545,183,-58,40,27,43,'bronze']].forEach(a=>world.appendChild(box(...a)));
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
