'use client';
import {useEffect,useRef} from 'react';
/** One measured layout contract shared by every Scanner screen. */
export function useScannerMobileLayout(screen:string){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const nav=el.querySelector<HTMLElement>('.sc-nav'),cta=el.querySelector<HTMLElement>('.sc-sticky-actions');
  const measure=()=>{
   const bounds=el.getBoundingClientRect(),vv=window.visualViewport;
   const editing=document.activeElement?.matches('input,textarea,select')||false;
   const keyboard=editing&&!!vv&&window.innerHeight-vv.height>100;
   el.dataset.keyboard=keyboard?'open':'closed';
   el.style.setProperty('--sc-phone-width',`${bounds.width}px`);el.style.setProperty('--sc-phone-left',`${bounds.left}px`);
   el.style.setProperty('--sc-keyboard-offset',keyboard&&vv?`${Math.max(0,innerHeight-vv.height-vv.offsetTop)}px`:'0px');
   el.style.setProperty('--sc-nav-height',`${keyboard?0:nav?.getBoundingClientRect().height||0}px`);
   el.style.setProperty('--sc-action-height',`${cta?.getBoundingClientRect().height||0}px`);
  };
  let frame=0;const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
  const observer=new ResizeObserver(schedule);observer.observe(el);if(nav)observer.observe(nav);if(cta)observer.observe(cta);
  measure();window.addEventListener('resize',measure);window.visualViewport?.addEventListener('resize',measure);document.addEventListener('focusin',measure);document.addEventListener('focusout',measure);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',measure);window.visualViewport?.removeEventListener('resize',measure);document.removeEventListener('focusin',measure);document.removeEventListener('focusout',measure);};
 },[screen]);return root;
}
