const fs=require('fs'),assert=require('assert'),vm=require('vm');
const s=fs.readFileSync('app.js','utf8');
const f=s.slice(s.indexOf('function learningTopicFor(data){'),s.indexOf('function currentLearningResource(){'));
const topic=vm.runInNewContext(f+'; learningTopicFor');
const cases=[
 [{intent:'I started to save money',concern:'My returns are disappointing and the fund is not growing'},'returns'],
 [{intent:'I started to save',concern:'My SIP is underperforming'},'returns'],
 [{intent:'I started to save',concern:'My bank debit failed this month'},'payment'],
 [{intent:'I started to save',concern:'I cannot afford my SIP now'},'budget'],
 [{intent:'I am not sure why I started my SIP.',concern:'I do not understand SIPs'},'goal'],
 [{intent:'I started for the long term',concern:'What is NAV?'},'returns']
];
for(const [data,expected] of cases)assert.equal(topic(data),expected,`${JSON.stringify(data)} should map to ${expected}`);
const h=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('styles.css','utf8');
assert(h.includes('id="learnTopicSelect"'));
assert(s.includes("$('learnTopicSelect').addEventListener('change',updateLearningTopic)"));
assert(css.includes('.workspace { align-items: start; }'));
assert(css.includes('.form-card { position: sticky;'));
console.log('PASS 6 topic scenarios, manual correction, and compact desktop layout');
