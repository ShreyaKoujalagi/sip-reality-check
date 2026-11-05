'use strict';
const $=id=>document.getElementById(id);
const form=$('reflectionForm'), inputCard=$('inputCard'), empty=$('emptyState'), loading=$('loadingState'), output=$('output'), fallback=$('fallback');
let lastResult=null;
const setHidden=(element,hidden)=>{element.hidden=hidden;element.style.display=hidden?'none':''};
function resetResults(){setHidden(empty,true);setHidden(loading,true);setHidden(output,true);setHidden(fallback,true)}
function showMessage(str){const el=$('errorMessage');el.textContent=str;setHidden(el,!str)}
function addList(id,values){const root=$(id);root.replaceChildren();values.forEach(str=>{const li=document.createElement('li');li.textContent=str;root.append(li)})}
function saveText(text){const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='SIP_Reality_Check_Reflection.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
form.addEventListener('submit',async e=>{
 e.preventDefault();showMessage('');let data={intent:$('intent').value.trim(),concern:$('concern').value.trim(),context:$('context').value.trim()};
 if(data.intent.length<8||data.concern.length<12){showMessage('Please add a little more detail to both required answers.');return}
 resetResults();setHidden(loading,false);$('submitButton').disabled=true;$('buttonText').textContent='Reflecting…';
 try{const resp=await fetch('/.netlify/functions/reflect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const body=await resp.json();setHidden(loading,true);
 if(!body.ok){$('fallbackText').textContent=body.message||'Something went wrong. Please try again.';setHidden(fallback,false);lastResult=null;return}
 lastResult=body.result;$('status').textContent='✓ Checked for unsafe advice and obvious unsupported claims';addList('facts',body.result.facts);addList('assumptions',body.result.assumptions);addList('unknowns',body.result.unknowns);$('takeaway').textContent=body.result.takeaway;setHidden(output,false);
 }catch(err){setHidden(loading,true);$('fallbackText').textContent='The AI service could not be reached. Please check your connection and try again.';setHidden(fallback,false)}
 finally{$('submitButton').disabled=false;$('buttonText').textContent='See my Reality Check';if(window.innerWidth<771)$('resultCard').scrollIntoView({behavior:'smooth',block:'start'})}
});
$('downloadButton').addEventListener('click',()=>{if(!lastResult)return;const r=lastResult;saveText(['SIP REALITY CHECK','', 'WHAT YOU SHARED',...r.facts.map(x=>'- '+x),'','WHAT YOU MIGHT BE ASSUMING',...r.assumptions.map(x=>'- '+x),'','WHAT IS STILL UNCLEAR',...r.unknowns.map(x=>'- '+x),'',r.takeaway,'','Based only on user-provided information. Not financial advice.'].join('\n'))});
$('retryButton').addEventListener('click',()=>$('concern').focus());
$('privacyMore').addEventListener('click',()=>$('privacyDialog').showModal());
$('closeDialog').addEventListener('click',()=>$('privacyDialog').close());
$('gotIt').addEventListener('click',()=>$('privacyDialog').close());
