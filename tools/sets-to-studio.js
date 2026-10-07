/* 변형문제 세트(docs/sets/set*.json) → 변형 출제실 세트 문서.
 *   node tools/sets-to-studio.js <출력 폴더>   → studio-<이름>.json (set*.json · drill-*.json)
 * 출제실 저장소의 sets/variant-N 에 그대로 넣으면 출제실 목록에 뜨고, 패드에서 풀고 채점할 수 있다.
 * 근거 자료(units)는 출제실의 buildUnits 로 범위 전체를 만들어 붙인다(Claude 채점 때 쓰임). */
// docs/sets/set*.json → 출제실 세트 문서 (sets/<id>)
const http=require("http"),fs=require("fs"),path=require("path");
const {chromium}=require("/home/user/Japan/node_modules/playwright");
const ROOT="/home/user/Japan/studio", OUT=process.argv[2];
(async()=>{
  const srv=http.createServer((q,r)=>{const f=path.join(ROOT,q.url.split("?")[0].replace(/^\/$/,"/index.html"));
    fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{"content-type":f.endsWith(".js")?"text/javascript; charset=utf-8":"text/html; charset=utf-8"});r.end(b)})}).listen(0);
  const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"});
  const p=await (await b.newContext({ignoreHTTPSErrors:true})).newPage();
  await p.goto(`http://localhost:${srv.address().port}/`,{waitUntil:"domcontentloaded"});
  await p.waitForFunction(()=>window.__studio);
  const units=await p.evaluate(()=>{const S=window.__studio;return {ids:S.PARTS.map(x=>x.id),units:S.buildUnits(S.PARTS.map(x=>x.id),false)}});
  await b.close();srv.close();
  const NEG=/(않은|아닌|틀린)\s*것/;
  const ul=s=>String(s||"").replace(/\[\[(.*?)\]\]/g,"【$1】");
  // set*.json(시험형 세트)과 drill-*.json(유형 집중 연습) 을 모두 바꾼다 → studio-<이름>.json
  const files=fs.readdirSync("/home/user/Japan/docs/sets").filter(f=>/^(set\d+|drill-[\w-]+)\.json$/.test(f)).sort();
  for(const f of files){
    const name=f.replace(/\.json$/,""),n=Number((name.match(/^set(\d+)$/)||[])[1]||0);
    const d=JSON.parse(fs.readFileSync(`/home/user/Japan/docs/sets/${f}`,"utf8"));
    // 출제실은 문항마다 카드가 따로다 — "위 대화"·"n번 대화" 문항에도 묶음의 본문을 붙여 그 카드만 보고도 풀게 한다
    const byNo=Object.fromEntries(d.questions.map(q=>[q.no,q]));
    const groupOf=q=>d.questions.find(x=>{const m=/^\[(\d+)~(\d+)/.exec(x.stem);return m&&q.no>+m[1]&&q.no<=+m[2]});
    const passage=q=>{
      if(/^위 /.test(q.stem)){const g=groupOf(q);if(g)return `(${g.no}번과 같은 대화)\n${g.box}`+(q.box?`\n\n${q.box}`:"")}
      const m=/^(\d+)번 (대화|글)/.exec(q.stem);
      if(m&&byNo[m[1]])return `(${m[1]}번 대화)\n${byNo[m[1]].box}\n\n${q.box||""}`;
      return q.box||"";
    };
    const questions=d.questions.map(q=>{
      const base={id:q.no,type:q.tag,level:"",stem:ul(q.stem).replace(/밑줄 친/g,"【 】 안의"),box:ul(passage(q)),fromNote:false,st:"pass",issues:[]};
      if(q.choices){
        const neg=NEG.test(q.stem);
        return {...base,format:"선택형",choices:q.choices.map(ul),answer:q.answer,unique:"",
          why:q.choices.map((c,i)=>({fits:neg?(i+1!==q.answer):(i+1===q.answer),refs:[],reason:i+1===q.answer?q.exp:"",trap:"",conj:null,group:null}))};
      }
      return {...base,format:"서답형",modelAnswer:q.answer,accept:q.accept||[],points:q.pts,refs:[],
        criteria:q.parts.map(([t,p])=>`${t} (${p}점)`).concat(q.exp?["해설: "+q.exp]:[]).slice(0, q.kana? 2 : 99),
        conj:q.conj?{base:q.conj.base,form:q.conj.form,shown:q.conj.shown}:null,group:q.group||null};
    });
    const mcN=questions.filter(q=>q.format==="선택형").length;
    const set={title:n?`변형문제 ${n}회 (전 범위 · 6과 + 회화 3·4과)`:d.title,unitIds:units.ids,useNote:false,useRef:false,hadNote:false,
      cond:{forms:[],mc:mcN,essay:questions.length-mcN,level:"중",must:"",real:!!n},units:units.units,examples:"",
      questions,attempts:[],stage:"done",createdAt:new Date(Date.UTC(2026,8,29,15,0+(n||30))).toISOString()};
    fs.writeFileSync(path.join(OUT,`studio-${name}.json`),JSON.stringify(set));
    console.log(name,questions.length,"문항",Buffer.byteLength(JSON.stringify(set)),"B");
  }
})();
