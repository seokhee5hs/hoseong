const dialog=document.querySelector('#consult');
const form=document.querySelector('#consult-form');
const result=document.querySelector('#result');
const status=document.querySelector('#status');
const remember=document.querySelector('#remember');
const key='hoseong-consult-draft-v1';
let selected='창호·샷시';
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.service;document.querySelectorAll('[data-service]').forEach(item=>{const active=item===button;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active));});}));
function readDraft(){try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}}
document.querySelectorAll('[data-consult]').forEach(button=>button.addEventListener('click',()=>{const draft=readDraft();form.reset();if(draft&&typeof draft.area==='string'&&typeof draft.message==='string'){form.elements.area.value=draft.area.slice(0,100);form.elements.message.value=draft.message.slice(0,1000);remember.checked=true;}form.elements.service.value=button.dataset.type||selected;form.hidden=false;result.hidden=true;status.textContent='';dialog.showModal();}));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
function save(){try{if(remember.checked){localStorage.setItem(key,JSON.stringify({area:form.elements.area.value,message:form.elements.message.value}));}else localStorage.removeItem(key);}catch{status.textContent='이 브라우저에서는 보관할 수 없습니다. 내용 정리와 문자 상담은 계속 이용할 수 있어요.';}}
form.addEventListener('input',()=>{status.textContent='';save();});
document.querySelector('.clear-draft').addEventListener('click',()=>{remember.checked=false;try{localStorage.removeItem(key);form.reset();status.textContent='이 기기에 보관한 내용과 작성 내용을 지웠습니다.';}catch{status.textContent='브라우저 저장소에 접근할 수 없습니다. 브라우저 설정에서 사이트 데이터를 삭제해 주세요.';}});
form.addEventListener('submit',event=>{event.preventDefault();const area=form.elements.area.value.trim(),message=form.elements.message.value.trim();if(!area||!message){status.textContent='시공 지역과 문의 내용을 입력해 주세요.';return;}save();const body=`[호성건축 시공 상담]\n시공 분야: ${form.elements.service.value}\n시공 지역: ${area}\n문의 내용: ${message}`;document.querySelector('#summary').value=body;const separator=/iPad|iPhone|iPod/.test(navigator.userAgent)?'&':'?';document.querySelector('#sms').href=`sms:01038235282${separator}body=${encodeURIComponent(body)}`;form.hidden=true;result.hidden=false;document.querySelector('#summary').focus();});
document.querySelector('#edit').addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.elements.area.focus();status.textContent='';});
document.querySelector('#copy').addEventListener('click',async()=>{const summary=document.querySelector('#summary');try{await navigator.clipboard.writeText(summary.value);status.textContent='상담 내용을 복사했습니다.';}catch{summary.focus();summary.select();status.textContent='내용을 선택했습니다. 복사 기능(Ctrl/Cmd+C 또는 길게 누르기)을 이용해 주세요.';}});
