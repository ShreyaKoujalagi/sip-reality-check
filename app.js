'use strict';
const $=id=>document.getElementById(id);
const form=$('reflectionForm'),empty=$('emptyState'),loading=$('loadingState'),output=$('output'),fallback=$('fallback');
let lastResult=null,lastMode=null,lastNextStep='',lastLearning='',lastData=null,selectedLearningTopic='basics';
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

// Short, general-purpose explanations. They never imply account or portfolio verification.
function helpContentFor(data){
 const text=(data.concern+' '+data.context).toLowerCase();
 const starting=(data.intent+' '+data.context).toLowerCase();
 const noGoal=/not sure why i started|never (?:really )?(?:set|had|made) (?:a |any )?(?:financial )?goal|no (?:clear )?(?:financial )?goal|did not (?:set|have) (?:a |any )?goal|didn't (?:set|have) (?:a |any )?goal/.test(starting);
 if(/(?:which mutual fund|which fund|what fund should|should i (?:buy|sell|stop|continue|switch)|tell me exactly whether)/.test(text))return {
  learn:'A personal investment decision depends on facts this prototype cannot verify, including your needs, timeline and ability to take risk.',
  explain:'There is no single fund or SIP action that fits everyone. This tool can explain terms and questions, but cannot select an investment for you.',
  verify:'Check your actual account information, investment purpose, time horizon and current circumstances. A qualified adviser can assess those details with you.'};
 if(/(?:expense|rent|income|salary|emergency|afford|budget|cash flow|bills?|job loss)/.test(text))return {
  learn:'A change in what you can afford is a real-life constraint, not a failure to understand investing.',
  explain:'Your budget comes first when understanding how much room you have for a regular payment. This is different from whether the investment itself made a profit or loss.',
  verify:'Compare current income, essential expenses and upcoming commitments. Only you can confirm what is manageable.'};
 if(/(?:failed|deduct|debit|payment|mandate|transaction|instalment|installment)/.test(text))return {
  learn:'A failed SIP instalment is a payment event. It does not, by itself, mean that the whole investment has failed.',
  explain:'A SIP is a scheduled investment. If one payment fails, it may affect that instalment, but it does not establish whether earlier investments rose or fell in value.',
  verify:'Look up the instalment status and any reason for failure in your investment account or bank record. Use official Groww support if the reason is unclear.'};
 if(/(?:always|guarantee|assured|never lose)/.test(text)&&/(?:mutual fund|returns?|profit|money|sip)/.test(text))return {
  learn:'Mutual fund returns are not guaranteed, even when someone invests every month through a SIP.',
  explain:'A SIP sets a schedule for investing. It does not guarantee how the investment performs. Market-linked investments can rise or fall.',
  verify:'Compare what you were told with your actual investment statements and official mutual fund disclosures. Avoid relying on promised returns.'};
 if(noGoal)return {
  learn:'You do not need to invent an original financial goal. Not knowing why you started is useful information in itself.',
  explain:'A SIP is a regular way to invest; it is not a financial goal on its own. You can think about whether you want the money for a particular need or simply to explore investing.',
  verify:'Consider whether you expect to need this money, whether your financial circumstances have changed, and what you want to understand before choosing an action.'};
 if(/(?:negative|loss|return|market|profit|down|performance|growing|grow|confus)/.test(text))return {
  learn:'Investing regularly does not guarantee positive returns. Mutual fund units can change in value as markets move.',
  explain:'A SIP means investing at regular intervals. The units bought can become worth less or more over time. A short-term loss does not alone tell you whether a plan suits you.',
  verify:'Review your invested amount, current value and the period covered by your returns in your actual account. This prototype cannot see or verify those figures.'};
 return {
  learn:'A SIP is a way to invest regularly; the right next step depends on what you want to understand and your circumstances.',
  explain:'Try separating what you can verify from what you are worried might happen. You do not have to decide from this reflection alone.',
  verify:'Check one relevant fact in your own account or official product information before deciding what it means for you.'};
}
// Curated, deterministic educational content; never generated investment instructions.
const LEARNING_RESOURCES={
 returns:{title:'Why do SIP returns fluctuate?',bullets:['A SIP is a way of investing regularly, not a promise of positive returns.','The value of mutual fund units can rise or fall with market conditions.','Check the time period, invested amount, and scheme risk information before interpreting a return.'],takeaway:'A short-term return alone cannot tell you what decision is suitable for you.',videoTopic:'Mutual Funds: What is NAV? / Different types of risk in equity funds',readUrl:'https://www.amfiindia.com/investor/knowledge-center-info?zoneName=riskInMutualFunds'},
 budget:{title:'What if my budget has changed?',bullets:['Essential expenses and available cash matter when thinking about a contribution.','Review the amount you can comfortably set aside without assuming it must stay the same.','For decisions that depend on your personal finances, consider a SEBI-registered investment adviser.'],takeaway:'Your circumstances matter more than maintaining a streak.',videoTopic:'Financial Planning for a secure financial future / Importance of Emergency Fund',readUrl:'https://investor.sebi.gov.in/investment-thingsbeforeinv.html'},
 payment:{title:'What does a failed SIP payment mean?',bullets:['An unsuccessful debit is a payment event; it is not the same as the value of your existing mutual fund units.','Check the mandate, bank entry, and SIP status in the official app.','If the status remains unclear, contact official Groww support; never share your OTP or password.'],takeaway:'Verify the payment status before drawing a conclusion.',videoTopic:'What is SIP? (general basics)',readUrl:'https://groww.in/help'},
 goal:{title:'What if I am unsure of my investment goal?',bullets:['You do not need to make up a past goal if you did not have one.','Think about what you want your money to be available for and approximately when.','Different time horizons and risks can call for different considerations.'],takeaway:'Getting clearer on your needs can be a useful first step.',videoTopic:'I haven’t thought of any goals / A plan for every goal',readUrl:'https://investor.sebi.gov.in/investment-thingsbeforeinv.html'},
 basics:{title:'How does an SIP work?',bullets:['A SIP invests a chosen amount into a mutual fund at regular intervals.','The value of the mutual fund units changes; neither SIPs nor mutual funds guarantee a profit.','Review your risk tolerance, financial needs and the fund information before deciding anything.'],takeaway:'Understanding the mechanism is different from deciding whether it is right for you.',videoTopic:'What is SIP? / What is a Mutual Fund?',readUrl:'https://www.amfiindia.com/investor'}
};
function learningTopicFor(data){
 // Match the CURRENT concern first. An earlier reason to start the SIP should not
 // override what is troubling the investor today. This is a deterministic hint,
 // and users can always correct it using the topic selector.
 const t=((data?.concern||'')+' '+(data?.context||'')).toLowerCase(),intent=(data?.intent||'').toLowerCase();
 if(/failed|unsuccessful|rejected|bounced|payment|debit|mandate|transaction|instalment|installment|deduct|autopay|auto.pay/.test(t))return 'payment';
 if(/expense|rent|income|salary|emergency|afford|budget|cash.flow|bills?|job loss|lost (?:my |the )?job|money is tight|cannot pay|can't pay|unable to pay|not enough money|financial stress/.test(t))return 'budget';
 if(/negative|loss|losing|lost money|return|market|profit|down|performance|performing|growing|growth|not growing|risk|volatile|volatility|nav|value (?:fell|dropped|decreased)|declining|underperform|not making money|no gains|disappoint|fluctuat/.test(t))return 'returns';
 if(/(?:why|what).*(?:start|invest)|goal|purpose|not sure why i started|no goal|without a goal|don't know why/.test(t))return 'goal';
 if(/not sure why i started|no goal|without a goal|don't know why/.test(intent))return 'goal';
 return 'basics';
}
function currentLearningResource(){return LEARNING_RESOURCES[selectedLearningTopic]||LEARNING_RESOURCES.basics;}
function updateLearningTopic(){
 selectedLearningTopic=$('learnTopicSelect').value;
 const r=currentLearningResource();
 $('learnTopic').textContent=r.title;
 if(!$('learnStarter').hidden)$('learnStarter').textContent=r.bullets[0];
 setHidden($('learnAnswer'),true);
 document.querySelectorAll('[data-learn]').forEach(b=>b.setAttribute('aria-pressed','false'));
}
function resetLearning(response){
 setHidden($('learnAnswer'),true);setHidden($('learnBulletBox'),true);setHidden($('learnLink'),true);
 document.querySelectorAll('[data-learn]').forEach(b=>b.setAttribute('aria-pressed','false'));
 selectedLearningTopic=learningTopicFor(lastData);
 $('learnTopicSelect').value=selectedLearningTopic;
 const resource=currentLearningResource();
 $('learnTopic').textContent=resource.title;
 const partly=response==='partly';
 $('helpHeading').textContent=partly?'What is the one thing you still want to clarify?':'What would help you feel less unsure?';
 $('learnHeading').textContent=partly?'Clear up one remaining question':'Start with something simple';
 $('learnIntro').textContent=partly?'You have some clarity already. Pick the format that helps you resolve a remaining doubt.':'You do not have to figure everything out now. Start with one simple idea, then explore more only if useful.';
 $('learnStarter').textContent=partly?'':resource.bullets[0];
 setHidden($('learnStarter'),partly);
 document.querySelector('[data-learn="later"]').textContent=partly?'Continue exploring later':'Maybe later';
}
function showLearning(kind){
 const r=currentLearningResource();
 document.querySelectorAll('[data-learn]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.learn===kind)));
 setHidden($('learnAnswer'),false);setHidden($('learnBulletBox'),kind!=='read');setHidden($('learnLink'),kind==='later');
 $('learnSource').textContent='';
 if(kind==='read'){
  $('learnAnswerText').textContent='Here are three simple things to know:';
  $('learnBullets').replaceChildren();r.bullets.forEach(b=>{const li=document.createElement('li');li.textContent=b;$('learnBullets').append(li)});
  $('learnTakeaway').textContent=r.takeaway;
  $('learnLink').href=r.readUrl;$('learnLink').textContent='Explore the official resource ↗';
  $('learnSource').textContent='Optional deeper reading · SEBI / AMFI / official Groww support';
 }else if(kind==='video'){
  $('learnAnswerText').textContent='SEBI’s education library includes videos on: '+r.videoTopic+'. Choose a video that interests you; the link opens the official video collection.';
  $('learnLink').href='https://investor.sebi.gov.in/inv_aware_edu_videos.html';$('learnLink').textContent='Browse SEBI educational videos ↗';
  $('learnSource').textContent='Educational video library · SEBI Investor';
 }else{
  $('learnAnswerText').textContent='You can explore this again whenever it suits you. No investment decision is required here.';
 }
}
function displayHelp(kind){
 const info=helpContentFor(lastData||{intent:'',concern:'',context:''});
 const messages={explain:info.explain,verify:info.verify,support:'For an investment decision based on your personal circumstances, a SEBI-registered investment adviser can provide individualized guidance. For payments or account issues, use official Groww support.'};
 document.querySelectorAll('[data-help]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.help===kind)));
 $('helpAnswerText').textContent=messages[kind];setHidden($('helpAnswer'),false);setHidden($('supportChoices'),kind!=='support');
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
 lastData=data;lastNextStep=nextStepFor(data);lastLearning=helpContentFor(data).learn;$('nextStepText').textContent=lastNextStep;$('learningText').textContent=lastLearning;
 setHidden($('extraHelp'),true);resetLearning('no');setHidden($('helpAnswer'),true);setHidden($('supportChoices'),true);document.querySelectorAll('[data-help]').forEach(b=>b.setAttribute('aria-pressed','false'));
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
$('downloadButton').addEventListener('click',()=>{if(!lastResult)return;const r=lastResult;saveText(['SIP REALITY CHECK',lastMode==='ai'?'AI-assisted reflection':'Guided reflection (AI unavailable)','', 'WHAT YOU SHARED',...r.facts.map(x=>'- '+x),'','WHAT YOU MIGHT BE ASSUMING',...r.assumptions.map(x=>'- '+x),'','WHAT IS STILL UNCLEAR',...r.unknowns.map(x=>'- '+x),'',r.takeaway,'','GOOD TO KNOW',lastLearning,'','YOUR WAY FORWARD',lastNextStep,'','Based only on information entered by the user. Not financial advice.'].join('\n'))});
$('retryButton').addEventListener('click',()=>$('concern').focus());
$('privacyMore').addEventListener('click',()=>$('privacyDialog').showModal());
$('closeDialog').addEventListener('click',()=>$('privacyDialog').close());
$('gotIt').addEventListener('click',()=>$('privacyDialog').close());

document.querySelectorAll('[data-clarity]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-clarity]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const response=button.dataset.clarity;
 $('clarityMessage').textContent=response==='yes'?'Glad this helped you understand the concern. The decision remains yours.':response==='partly'?'You already have some clarity. Let’s focus on the question that remains.':'That’s okay. Start with one simple explanation; there is no need to decide today.';
 setHidden($('extraHelp'),response==='yes');resetLearning(response);setHidden($('helpAnswer'),true);setHidden($('supportChoices'),true);document.querySelectorAll('[data-help]').forEach(b=>b.setAttribute('aria-pressed','false'));
}));
document.querySelectorAll('[data-help]').forEach(button=>button.addEventListener('click',()=>displayHelp(button.dataset.help)));

document.querySelectorAll('[data-learn]').forEach(b=>b.addEventListener('click',()=>showLearning(b.dataset.learn)));
$('learnTopicSelect').addEventListener('change',updateLearningTopic);
