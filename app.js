'use strict';
const $=id=>document.getElementById(id);
const form=$('reflectionForm'),empty=$('emptyState'),loading=$('loadingState'),output=$('output'),fallback=$('fallback');
let lastResult=null,lastMode=null,lastNextStep='';
const STORAGE_KEY='sipRealityCheck.savedStartingPoint.v1';
let savedIntent='';
function loadStartingPoint(){try{return localStorage.getItem(STORAGE_KEY)||''}catch{return ''}}
function saveStartingPoint(value){try{localStorage.setItem(STORAGE_KEY,value);return true}catch{return false}}
function removeStartingPoint(){try{localStorage.removeItem(STORAGE_KEY)}catch{}}
function renderStartingPoint(){
 const exists=Boolean(savedIntent);
 setHidden($('savedIntentPanel'),!exists);setHidden($('intentField'),exists);
 if(exists){$('savedIntentText').textContent=savedIntent;$('intent').value=savedIntent;}
}
savedIntent=loadStartingPoint();
$('unsureIntent').addEventListener('click',()=>{$('intent').value='I am not sure why I started my SIP.'});
$('editSavedIntent').addEventListener('click',()=>{setHidden($('savedIntentPanel'),true);setHidden($('intentField'),false);$('intent').value=savedIntent;$('rememberIntent').checked=true;$('intent').focus()});
$('forgetSavedIntent').addEventListener('click',()=>{removeStartingPoint();savedIntent='';$('intent').value='';$('rememberIntent').checked=false;renderStartingPoint();$('intent').focus()});
function nextStepFor(data){
 const text=(data.concern+' '+data.context).toLowerCase();
 const noGoal=/\b(?:i am|i'm|im) not sure why i started\b/i.test(data.intent)||/(?:never|didn.t|did not|haven.t|have not|no|without|not really|don't|do not|not sure)\s+(?:(?:actually|really|even|yet|ever|originally)\s+)?(?:set|have|had|make|made|define|defined|choose|chosen|know|why)\s+(?:(?:a|an|any|my|specific|clear|financial|investment|saving|savings|real|proper|personal)\s+){0,4}(?:goal|plan|purpose|target|reason|objective|i started)/i.test(data.intent+' '+data.context);
 if(/(?:expense|rent|income|salary|emergency|afford|budget|cash flow|bills?|job loss)/i.test(text))return 'Review your current monthly income and essential expenses to understand what you can realistically afford. A genuine affordability change is not a misunderstanding.';
 if(/(?:failed|deduct|debit|payment|mandate|transaction|instalment|installment)/i.test(text))return 'Check the SIP transaction status and any failure reason in your investing app or bank record. A missed instalment does not, by itself, tell you how the investment performed.';
 if(/(?:which mutual fund|which fund|what fund should|should i (?:buy|sell|stop|continue|switch)|tell me exactly whether)/i.test(text))return 'A fund choice or SIP continuation decision needs verified information about your circumstances. Review your own facts and consider a qualified financial adviser for individualized guidance.';
 if(/(?:always|guarantee|assured|never lose)/i.test(text)&&/(?:mutual fund|returns?|profit|money|sip)/i.test(text))return 'Separate what you were told from what can be verified: mutual fund returns are not guaranteed. Review the actual performance details rather than relying on promises.';
 if(noGoal)return 'Start by deciding whether there is anything you want your investing to achieve. It is okay not to have an answer yet; there is no previous goal to compare against.';
 if(/(?:negative|loss|return|market|profit|down|performance|growing|grow)/i.test(text))return 'Look at the verified return details in your investing app, then consider whether your time horizon or financial circumstances have changed. Recent returns alone cannot settle your decision.';
 return 'Identify one fact you can verify about your concern, using your own records or official product information, before drawing a conclusion.';
}

const setHidden=(el,hidden)=>{el.hidden=hidden;el.style.display=hidden?'none':''};
renderStartingPoint();
function resetResults(){[empty,loading,output,fallback].forEach(el=>setHidden(el,true))}
function showMessage(str){$('errorMessage').textContent=str;setHidden($('errorMessage'),!str)}
function addList(id,values){const root=$(id);root.replaceChildren();values.forEach(str=>{const li=document.createElement('li');li.textContent=str;root.append(li)})}
function saveText(text){const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='SIP_Reality_Check_Reflection.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function showResult(result,mode,data){
 lastResult=result;lastMode=mode;
 $('status').textContent=mode==='ai'?'✓ AI reflection checked for unsafe advice and obvious unsupported claims':'ⓘ Guided reflection · limited non-AI worksheet; AI result not shown';
 $('status').style.background=mode==='ai'?'':'#fff4df';$('status').style.color=mode==='ai'?'':'#75501b';
 addList('facts',result.facts);addList('assumptions',result.assumptions);addList('unknowns',result.unknowns);
 $('takeaway').textContent=result.takeaway;
 lastNextStep=nextStepFor(data);$('nextStepText').textContent=lastNextStep;
 document.querySelectorAll('[data-clarity]').forEach(b=>b.setAttribute('aria-pressed','false'));$('clarityMessage').textContent='';
 setHidden(output,false);
}
function localGuided(data){
 // Browser-only, deterministic reflection; never presented as AI.
 const short=(s,n=140)=>s.length>n?s.slice(0,n-1).trimEnd()+'…':s;
 const text=(data.concern+' '+data.context).toLowerCase();
 const noGoal=/\b(?:i am|i'm|im) not sure why i started\b/i.test(data.intent)||/(?:never|didn.t|did not|haven.t|have not|no|without|not really|don't|do not)\s+(?:(?:actually|really|even|yet|ever|originally)\s+)?(?:set|have|had|make|made|define|defined|choose|chosen|know)\s+(?:(?:a|an|any|my|specific|clear|financial|investment|saving|savings|real|proper|personal)\s+){0,4}(?:goal|plan|purpose|target|reason|objective)/i.test(data.intent+' '+data.context);
 const guarantee=/(always|guarantee|assured|never lose)/i.test(text)&&/(mutual fund|returns?|profit|money|sip)/i.test(text);
 const finances=/(expense|rent|income|salary|emergency|afford|budget|cash flow|bills?)/i.test(text);
 const payment=/(failed|debit|payment|transaction|instalment|installment)/i.test(text);
 const performance=/(negative|loss|return|market|profit|down|performance|growing)/i.test(text);
 const assumptions=[],unknowns=[];
 if(noGoal){assumptions.push('You said you did not set a clear goal. There is no original financial goal to compare against.');unknowns.push('What would you like investing to help you achieve, if anything?')}
 else if(finances){assumptions.push('Increased expenses are a real financial constraint, not automatically a misunderstanding.');unknowns.push('Which expenses or income changes are affecting what you can afford?')}
 else if(payment){assumptions.push('A payment failure is different from the overall progress of an investment goal.');unknowns.push('What transaction status or failure reason appears in the app or bank record?')}
 else if(performance){assumptions.push('Recent disappointing returns may not settle whether your earlier plan fits your circumstances.');unknowns.push('What part of the reported performance is concerning you?')}
 else{assumptions.push('Your current concern may differ from why you began investing.');unknowns.push('What would help you understand your current concern?')}
 if(guarantee){assumptions.unshift('Mutual funds do not guarantee positive returns. The claim that they always give good returns is unreliable.');unknowns.push('Where did that expectation come from?')}
 if(/(?:which mutual fund|should i (?:buy|sell|stop|continue|switch)|tell me exactly whether)/i.test(text)){assumptions.unshift('A specific fund or stop/continue decision cannot be determined from these answers.');unknowns.push('Which facts about your circumstances are still missing?')}
 const facts=['You said: “'+short(data.intent)+'”','You described your concern as: “'+short(data.concern)+'”'];
 if(data.context)facts.push('You added: “'+short(data.context)+'”');
 return {facts,assumptions:assumptions.slice(0,3),unknowns:unknowns.slice(0,3),takeaway:'This is a limited guided worksheet, not an AI analysis or verified financial assessment. It does not recommend an investment action.'};
}
function validateForm(data){if(data.intent.length<8||data.concern.length<12)return 'Please add a little more detail to both required answers.';if(/\b\d{9,18}\b|\b[A-Z]{5}\d{4}[A-Z]\b|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/i.test([data.intent,data.concern,data.context].join(' ')))return 'Please remove account numbers, PAN or email addresses.';return ''}
form.addEventListener('submit',async e=>{
 e.preventDefault();showMessage('');const data={intent:(savedIntent&&$('intentField').hidden?savedIntent:$('intent').value.trim()),concern:$('concern').value.trim(),context:$('context').value.trim()};
 const problem=validateForm(data);if(problem){showMessage(problem);return}
 if(!$('intentField').hidden){
  if($('rememberIntent').checked){if(saveStartingPoint(data.intent)){savedIntent=data.intent;renderStartingPoint()}else{showMessage('This browser cannot remember your starting point. You can still continue.')}}
  else if(savedIntent){removeStartingPoint();savedIntent='';}
 }
 resetResults();setHidden(loading,false);$('submitButton').disabled=true;$('buttonText').textContent='Reflecting…';
 try{
  const resp=await fetch('/.netlify/functions/reflect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const body=await resp.json();setHidden(loading,true);
  if(!resp.ok||!body.ok){
   if(resp.status===400||resp.status===413){showMessage(body.message||'Please check your answers.');setHidden(empty,false);return}
   showResult(localGuided(data),'guided',data);return;
  }
  if(!body.result||!Array.isArray(body.result.facts)||!Array.isArray(body.result.assumptions)||!Array.isArray(body.result.unknowns)||typeof body.result.takeaway!=='string'){
   showResult(localGuided(data),'guided',data);return;
  }
  showResult(body.result,body.mode==='ai'?'ai':'guided',data);
 }catch(e){setHidden(loading,true);showResult(localGuided(data),'guided',data)}
 finally{$('submitButton').disabled=false;$('buttonText').textContent='See my Reality Check';if(window.innerWidth<771)$('resultCard').scrollIntoView({behavior:'smooth',block:'start'})}
});
$('downloadButton').addEventListener('click',()=>{if(!lastResult)return;const r=lastResult;saveText(['SIP REALITY CHECK',lastMode==='ai'?'AI-assisted reflection':'Guided reflection (AI unavailable)','', 'WHAT YOU SHARED',...r.facts.map(x=>'- '+x),'','WHAT YOU MIGHT BE ASSUMING',...r.assumptions.map(x=>'- '+x),'','WHAT IS STILL UNCLEAR',...r.unknowns.map(x=>'- '+x),'',r.takeaway,'','YOUR WAY FORWARD',lastNextStep,'','Based only on information entered by the user. Not financial advice.'].join('\n'))});
$('retryButton').addEventListener('click',()=>$('concern').focus());
$('privacyMore').addEventListener('click',()=>$('privacyDialog').showModal());
$('closeDialog').addEventListener('click',()=>$('privacyDialog').close());
$('gotIt').addEventListener('click',()=>$('privacyDialog').close());

document.querySelectorAll('[data-clarity]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-clarity]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const response=button.dataset.clarity;
 $('clarityMessage').textContent=response==='yes'?'Thanks. Your choice remains yours.':response==='partly'?'You can review the facts or missing information above, or seek a qualified adviser for personal guidance.':'That is useful feedback. The tool may not have enough verified information; consider checking your records or seeking qualified guidance.';
}));
