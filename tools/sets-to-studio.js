/* 변형문제 세트(docs/sets/set*.json) → 변형 출제실 세트 문서.
 *   node tools/sets-to-studio.js <출력 폴더>   → studio-set1~3.json
 * 출제실 저장소의 sets/variant-1~3 에 그대로 넣으면 출제실 목록에 뜨고, 패드에서 풀고 채점할 수 있다.
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
  for(const n of [1,2,3]){
    const d=JSON.parse(fs.readFileSync(`/home/user/Japan/docs/sets/set${n}.json`,"utf8"));
    const questions=d.questions.map(q=>{
      const base={id:q.no,type:q.tag,level:"",stem:ul(q.stem).replace(/밑줄 친/g,"【 】 안의"),box:ul(q.box),fromNote:false,st:"pass",issues:[]};
      if(q.choices){
        const neg=NEG.test(q.stem);
        return {...base,format:"선택형",choices:q.choices.map(ul),answer:q.answer,unique:"",
          why:q.choices.map((c,i)=>({fits:neg?(i+1!==q.answer):(i+1===q.answer),refs:[],reason:i+1===q.answer?q.exp:"",trap:"",conj:null,group:null}))};
      }
      return {...base,format:"서답형",modelAnswer:q.answer,accept:q.accept||[],points:q.pts,refs:[],
        criteria:q.parts.map(([t,p])=>`${t} (${p}점)`).concat(q.exp?["해설: "+q.exp]:[]).slice(0, q.kana? 2 : 99),
        conj:q.conj?{base:q.conj.base,form:q.conj.form,shown:q.conj.shown}:null,group:q.group||null};
    });
    const set={title:`변형문제 ${n}회 (전 범위 · 6과 + 회화 3·4과)`,unitIds:units.ids,useNote:false,useRef:false,hadNote:false,
      cond:{forms:[],mc:21,essay:9,level:"중",must:"",real:true},units:units.units,examples:"",
      questions,attempts:[],stage:"done",createdAt:new Date(Date.UTC(2026,8,29,15,0+n)).toISOString()};
    fs.writeFileSync(path.join(OUT,`studio-set${n}.json`),JSON.stringify(set));
    console.log(n,questions.length,"문항",Buffer.byteLength(JSON.stringify(set)),"B");
  }
})();
