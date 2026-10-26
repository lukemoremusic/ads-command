import http from 'node:http';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT || 10000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN || '';
const MAX_BYTES = 12000;
const limits = new Map();

function json(res,status,body) {
  res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});
  res.end(JSON.stringify(body));
}
function authorized(header) {
  if (!ADMIN_API_TOKEN || !header?.startsWith('Bearer ')) return false;
  const submitted=Buffer.from(header.slice(7));const expected=Buffer.from(ADMIN_API_TOKEN);
  return submitted.length===expected.length && crypto.timingSafeEqual(submitted,expected);
}
function rateLimit(ip){
  const now=Date.now();const old=limits.get(ip)||{start:now,requests:0};
  if(now-old.start>60000){old.start=now;old.requests=0;}
  old.requests++;limits.set(ip,old);return old.requests<=5;
}
async function readJson(req){
  let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>MAX_BYTES)throw Error('Too large');}
  return JSON.parse(raw);
}
http.createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(req.method==='GET' && pathname==='/health')
    return json(res,200,{status:'ok',service:'ads-command-api',openaiConfigured:!!OPENAI_API_KEY,access:'protected'});
  if(req.method!=='POST'||pathname!=='/api/analyze')return json(res,404,{error:'Not found'});
  if(!authorized(req.headers.authorization))return json(res,401,{error:'Unauthorized'});
  if(!OPENAI_API_KEY)return json(res,503,{error:'OPENAI_API_KEY is not configured'});
  if(!rateLimit(req.socket.remoteAddress||'unknown'))return json(res,429,{error:'Too many requests'});
  let data;try{data=await readJson(req)}catch{return json(res,400,{error:'Invalid JSON or too large'});}
  const {genre,spent,savesBefore,savesAfter,notes}=data||{};
  if(typeof genre!=='string'||genre.length>100||typeof spent!=='number'||!Number.isFinite(spent)||spent<0||spent>1e6
     ||!Number.isSafeInteger(savesBefore)||!Number.isSafeInteger(savesAfter)||savesBefore<0||savesAfter<0
     ||typeof notes!=='string'||notes.length>2000)return json(res,400,{error:'Invalid campaign data'});
  try{
    const reply=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',headers:{authorization:'Bearer '+OPENAI_API_KEY,'content-type':'application/json'},
      body:JSON.stringify({model:'gpt-4.1-mini',store:false,max_output_tokens:900,input:[
        {role:'system',content:'You analyze TikTok ad campaigns promoting Spotify playlists. Explain in concise German. Save count changes are observational and cannot establish ad attribution. Never promise results or recommend unbounded spend.'},
        {role:'user',content:JSON.stringify({genre,spent,savesBefore,savesAfter,notes})}
      ]})
    });
    if(!reply.ok)return json(res,502,{error:'Upstream AI request failed',status:reply.status});
    const response=await reply.json();
    const analysis=(response.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text||'').join('\n').trim();
    if(!analysis){
      console.error('OpenAI empty analysis', {status:response.status,reason:response.incomplete_details?.reason,outputTypes:(response.output||[]).map(x=>x.type)});
      return json(res,502,{error:'OpenAI returned an empty analysis',responseStatus:response.status||'unknown'});
    }
    return json(res,200,{analysis,observedSaveChange:savesAfter-savesBefore,attributed:false});
  }catch{return json(res,502,{error:'Could not connect to OpenAI'});}
}).listen(PORT,'0.0.0.0',()=>console.log('ADS COMMAND backend listening on '+PORT));
