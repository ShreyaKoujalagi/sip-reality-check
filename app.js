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
 $('status').textContent=mode==='ai'?'✓ AI reflection checked for unsafe advice and obvious unsupported claims':'ⓘ Guided reflection · limited non-AI worksheet; AI result not shown';
 $('status').style.background=mode==='ai'?'':'#fff4df';$('status').style.color=mode==='ai'?'':'#75501b';
 addList('facts',result.facts);addList('assumptions',result.assumptions);addList('unknowns',result.unknowns);
 $('takeaway').textContent=result.takeaway;
 setHidden(output,false);
}
function localGuided(data){
 // Browser-only, deterministic reflection; never presented as AI.
 const short=(s,n=140)=>s.length>n?s.slice(0,n-1).trimEnd()+'…':s;
 const text=(data.concern+' '+data.context).toLowerCase();
 const noGoal=/(?:never|didn.t|did not|haven.t|have not|no|without|not really|don't|do not)\s+(?:(?:actually|really|even|yet|ever|originally)\s+)?(?:set|have|had|make|made|define|defined|choose|chosen|know)\s+(?:(?:a|an|any|my|specific|clear|financial|investment|saving|savings|real|proper|personal)\s+){0,4}(?:goal|plan|purpose|target|reason|objective)/i.test(data.intent+' '+data.context);
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
