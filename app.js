'use strict';
const $=id=>document.getElementById(id);
const form=$('reflectionForm'),empty=$('emptyState'),loading=$('loadingState'),output=$('output'),fallback=$('fallback');
let lastResult=null,lastMode=null;
const setHidden=(el,hidden)=>{el.hidden=hidden;el.style.display=hidden?'none':''};
function resetResults(){[empty,loading,output,fallback].forEach(el=>setHidden(el,true))}
function showMessage(str){$('errorMessage').textContent=str;setHidden($('errorMessage'),!str)}
function addList(id,values){const root=$(id);root.replaceChildren();values.forEach(str=>{const li=document.createElement('li');li.textContent=str;root.append(li)})}
function saveText(text){const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='SIP_Reality_Check_Reflection.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function showResult(result,mode){
 lastResult=result;lastMode=mode;
 $('status').textContent=mode==='ai'?'✓ AI reflection checked for unsafe advice and obvious unsupported claims':'ⓘ Guided reflection · AI temporarily unavailable; no AI analysis performed';
 $('status').style.background=mode==='ai'?'':'#fff4df';$('status').style.color=mode==='ai'?'':'#75501b';
 addList('facts',result.facts);addList('assumptions',result.assumptions);addList('unknowns',result.unknowns);
 $('takeaway').textContent=result.takeaway;
 setHidden(output,false);
}
function localGuided(data){
 // Browser-only fallback if even the backend cannot be reached. Not presented as AI.
 const short=s=>s.length>145?s.slice(0,144).trimEnd()+'…':s;
 return {facts:[`You described your starting intention as: “${short(data.intent)}”`,`Your current concern, in your own words: “${short(data.concern)}”`],assumptions:['You may be reconsidering how your original goal relates to what is worrying you today.'],unknowns:['What additional information or change in circumstances matters most to this concern?','Have your original goals or personal circumstances changed?'],takeaway:'This is a guided reflection, not AI analysis. It uses only the words you entered and cannot check your investments or tell you what to do.'};
}
function validateForm(data){if(data.intent.length<8||data.concern.length<12)return 'Please add a little more detail to both required answers.';if(/\b\d{9,18}\b|\b[A-Z]{5}\d{4}[A-Z]\b|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/i.test([data.intent,data.concern,data.context].join(' ')))return 'Please remove account numbers, PAN or email addresses.';return ''}
form.addEventListener('submit',async e=>{
 e.preventDefault();showMessage('');const data={intent:$('intent').value.trim(),concern:$('concern').value.trim(),context:$('context').value.trim()};
 const problem=validateForm(data);if(problem){showMessage(problem);return}
 resetResults();setHidden(loading,false);$('submitButton').disabled=true;$('buttonText').textContent='Reflecting…';
 try{
  const resp=await fetch('/.netlify/functions/reflect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const body=await resp.json();setHidden(loading,true);
  if(!resp.ok||!body.ok){
   if(resp.status===400||resp.status===413){showMessage(body.message||'Please check your answers.');setHidden(empty,false);return}
   showResult(localGuided(data),'guided');return;
  }
  if(!body.result||!Array.isArray(body.result.facts)||!Array.isArray(body.result.assumptions)||!Array.isArray(body.result.unknowns)||typeof body.result.takeaway!=='string'){
   showResult(localGuided(data),'guided');return;
  }
  showResult(body.result,body.mode==='ai'?'ai':'guided');
 }catch(e){setHidden(loading,true);showResult(localGuided(data),'guided')}
 finally{$('submitButton').disabled=false;$('buttonText').textContent='See my Reality Check';if(window.innerWidth<771)$('resultCard').scrollIntoView({behavior:'smooth',block:'start'})}
});
$('downloadButton').addEventListener('click',()=>{if(!lastResult)return;const r=lastResult;saveText(['SIP REALITY CHECK',lastMode==='ai'?'AI-assisted reflection':'Guided reflection (AI unavailable)','', 'WHAT YOU SHARED',...r.facts.map(x=>'- '+x),'','WHAT YOU MIGHT BE ASSUMING',...r.assumptions.map(x=>'- '+x),'','WHAT IS STILL UNCLEAR',...r.unknowns.map(x=>'- '+x),'',r.takeaway,'','Based only on information entered by the user. Not financial advice.'].join('\n'))});
$('retryButton').addEventListener('click',()=>$('concern').focus());
$('privacyMore').addEventListener('click',()=>$('privacyDialog').showModal());
$('closeDialog').addEventListener('click',()=>$('privacyDialog').close());
$('gotIt').addEventListener('click',()=>$('privacyDialog').close());
