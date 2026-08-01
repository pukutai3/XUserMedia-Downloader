(()=>{"use strict";
const VERSION="1.0.0";
const API={
  bearer:"AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
  user:"/i/api/graphql/ck5KkZ8t5cOmoLssopN99Q/UserByScreenName",
  media:"/i/api/graphql/jCRhbOzdgOHp6u9H4g2tEg/UserMedia"
};
const FEATURES={
  rweb_video_screen_enabled:false,payments_enabled:false,rweb_xchat_enabled:false,
  profile_label_improvements_pcf_label_in_post_enabled:true,rweb_tipjar_consumption_enabled:true,
  verified_phone_label_enabled:false,creator_subscriptions_tweet_preview_api_enabled:true,
  responsive_web_graphql_timeline_navigation_enabled:true,
  responsive_web_graphql_skip_user_profile_image_extensions_enabled:false,
  premium_content_api_read_enabled:false,communities_web_enable_tweet_community_results_fetch:true,
  c9s_tweet_anatomy_moderator_badge_enabled:true,
  responsive_web_grok_analyze_button_fetch_trends_enabled:false,
  responsive_web_grok_analyze_post_followups_enabled:true,responsive_web_jetfuel_frame:true,
  responsive_web_grok_share_attachment_enabled:true,articles_preview_enabled:true,
  responsive_web_edit_tweet_api_enabled:true,
  graphql_is_translatable_rweb_tweet_is_translatable_enabled:true,
  view_counts_everywhere_api_enabled:true,longform_notetweets_consumption_enabled:true,
  responsive_web_twitter_article_tweet_consumption_enabled:true,tweet_awards_web_tipping_enabled:false,
  responsive_web_grok_show_grok_translated_post:false,
  responsive_web_grok_analysis_button_from_backend:true,
  creator_subscriptions_quote_tweet_preview_enabled:false,
  freedom_of_speech_not_reach_fetch_enabled:true,standardized_nudges_misinfo:true,
  tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:true,
  longform_notetweets_rich_text_read_enabled:true,longform_notetweets_inline_media_enabled:true,
  responsive_web_grok_image_annotation_enabled:true,responsive_web_grok_imagine_annotation_enabled:true,
  responsive_web_grok_community_note_auto_translation_is_enabled:false,
  responsive_web_enhance_cards_enabled:false
};

if(!/(^|\.)x\.com$|(^|\.)twitter\.com$/.test(location.hostname)){
  alert("このブックマークは、ログイン済みの x.com 上で実行してください。");return;
}
if(document.querySelector("#xmd-overlay")){return;}

const root=document.createElement("div");root.id="xmd-overlay";
root.innerHTML=`<style>
#xmd-overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(12,14,17,.72);display:grid;place-items:center;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#17191c}
#xmd-panel{width:min(540px,calc(100vw - 28px));background:#f7f6f2;border:1px solid #17191c;box-shadow:0 24px 80px rgba(0,0,0,.34)}
#xmd-head{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid #bfc1bd;font:700 12px/1 ui-monospace,monospace;letter-spacing:.1em}
#xmd-close{border:0;background:transparent;color:#17191c;font-size:24px;line-height:1;cursor:pointer}
#xmd-body{padding:28px 22px}#xmd-body h2{margin:0 0 9px;font-size:25px}#xmd-body p{margin:0 0 22px;color:#62676d;line-height:1.6;font-size:14px}
#xmd-label{display:block;margin-bottom:8px;font-weight:700;font-size:13px}#xmd-user{width:100%;height:50px;border:1px solid #777d83;background:#fff;padding:0 14px;color:#17191c;font:16px/1 system-ui}
#xmd-user:focus{outline:3px solid #1686f0;outline-offset:2px}#xmd-actions{display:flex;gap:10px;margin-top:16px}
#xmd-start,#xmd-cancel{height:46px;border:1px solid #17191c;padding:0 18px;font-weight:700;cursor:pointer}#xmd-start{flex:1;background:#1686f0;border-color:#1686f0;color:white}#xmd-cancel{background:transparent;color:#17191c}
#xmd-start:disabled{opacity:.55;cursor:wait}#xmd-progress{display:none;margin-top:22px;border-top:1px solid #c9c9c3;padding-top:18px}
#xmd-progress.show{display:block}#xmd-status{font-weight:700;font-size:14px}#xmd-detail{margin-top:7px;color:#62676d;font:12px/1.5 ui-monospace,monospace;word-break:break-word}
#xmd-bar{height:5px;margin-top:14px;background:#d9dad6;overflow:hidden}#xmd-fill{height:100%;width:0;background:#1686f0;transition:width .2s}
@media(prefers-reduced-motion:reduce){#xmd-fill{transition:none}}
</style><section id="xmd-panel" role="dialog" aria-modal="true" aria-labelledby="xmd-title"><header id="xmd-head"><span>X MEDIA DOWNLOADER / ${VERSION}</span><button id="xmd-close" aria-label="閉じる">×</button></header><div id="xmd-body"><h2 id="xmd-title">ユーザーのメディアを保存</h2><p>現在から過去へ取得し、ブラウザー内でZIPを作ります。処理中はこのタブを閉じないでください。</p><label id="xmd-label" for="xmd-user">Xユーザー名</label><input id="xmd-user" autocomplete="off" spellcheck="false" placeholder="例: OpenAI"><div id="xmd-actions"><button id="xmd-start">取得を開始</button><button id="xmd-cancel">中止</button></div><div id="xmd-progress" aria-live="polite"><div id="xmd-status">準備中</div><div id="xmd-detail"></div><div id="xmd-bar"><div id="xmd-fill"></div></div></div></div></section>`;
document.body.append(root);

const $=id=>root.querySelector(id),userInput=$("#xmd-user"),start=$("#xmd-start"),progress=$("#xmd-progress"),status=$("#xmd-status"),detail=$("#xmd-detail"),fill=$("#xmd-fill");
let aborted=false,busy=false;
const close=()=>{aborted=true;if(!busy)root.remove();};
$("#xmd-close").onclick=close;$("#xmd-cancel").onclick=close;
userInput.focus();

function setStatus(text,sub="",percent=0){status.textContent=text;detail.textContent=sub;fill.style.width=`${Math.max(0,Math.min(100,percent))}%`;}
function username(value){const clean=value.trim().replace(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\//i,"").replace(/^@/,"").split(/[/?#]/)[0];if(!/^[A-Za-z0-9_]{1,15}$/.test(clean))throw Error("正しいXユーザー名を入力してください。");return clean;}
function headers(){return{"authorization":`Bearer ${API.bearer}`,"x-csrf-token":decodeURIComponent((document.cookie.match(/(?:^|; )ct0=([^;]+)/)||[])[1]||""),"x-twitter-active-user":"yes","x-twitter-auth-type":"OAuth2Session","x-twitter-client-language":"ja"};}
async function gql(path,variables,features=FEATURES,fieldToggles){const query=new URLSearchParams({variables:JSON.stringify(variables),features:JSON.stringify(features)});if(fieldToggles)query.set("fieldToggles",JSON.stringify(fieldToggles));const response=await fetch(`${path}?${query}`,{credentials:"include",headers:headers()});if(response.status===429)throw Error("Xの取得制限に達しました。時間を置いて再実行してください。");if(!response.ok)throw Error(`Xから取得できませんでした (HTTP ${response.status})`);const json=await response.json();if(json.errors?.length)throw Error(json.errors.map(e=>e.message).join(" / "));return json;}
function findUser(result){let value=result?.data?.user?.result;while(value?.result)value=value.result;if(!value||value.__typename==="UserUnavailable")throw Error("ユーザーが見つからないか、閲覧できません。");return value;}
function scanTimeline(data){const tweets=[],seen=new Set(),stack=[data];let cursor="";while(stack.length){const value=stack.pop();if(!value||typeof value!=="object")continue;if(seen.has(value))continue;seen.add(value);if(value.cursorType==="Bottom"&&value.value)cursor=value.value;if(value.tweet_results?.result){let tweet=value.tweet_results.result;while(tweet?.tweet)tweet=tweet.tweet;if(tweet?.legacy&&tweet?.rest_id)tweets.push(tweet);}for(const key in value){if(key!=="tweet_results")stack.push(value[key]);}}return{tweets,cursor};}
function mediaItems(tweet,targetId){const legacy=tweet.legacy||{};if(String(legacy.user_id_str||tweet.core?.user_results?.result?.rest_id||"")!==String(targetId))return[];const items=legacy.extended_entities?.media||[];return items.map((media,index)=>{let url,ext;if(media.type==="photo"){const raw=media.media_url_https||media.media_url;if(!raw)return null;ext=(raw.match(/\.([a-zA-Z0-9]+)$/)||[])[1]||"jpg";url=`${raw}?format=${ext}&name=orig`;}else{const variants=(media.video_info?.variants||[]).filter(v=>v.content_type==="video/mp4"&&v.url).sort((a,b)=>(b.bit_rate||0)-(a.bit_rate||0));if(!variants.length)return null;url=variants[0].url;ext="mp4";}return{key:`${tweet.rest_id}-${media.id_str||media.media_key||index}`,name:`${tweet.rest_id}_${String(index+1).padStart(2,"0")}.${ext}`,url,type:media.type,tweetId:tweet.rest_id,createdAt:legacy.created_at||null,postUrl:`https://x.com/i/status/${tweet.rest_id}`};}).filter(Boolean);}
async function collect(handle){const userFeatures={hidden_profile_subscriptions_enabled:true,payments_enabled:false,rweb_xchat_enabled:false,profile_label_improvements_pcf_label_in_post_enabled:true,rweb_tipjar_consumption_enabled:true,verified_phone_label_enabled:false,highlights_tweets_tab_ui_enabled:true,responsive_web_twitter_article_notes_tab_enabled:true,subscriptions_feature_can_gift_premium:true,creator_subscriptions_tweet_preview_api_enabled:true,responsive_web_graphql_skip_user_profile_image_extensions_enabled:false,responsive_web_graphql_timeline_navigation_enabled:true,subscriptions_verification_info_is_identity_verified_enabled:true,subscriptions_verification_info_verified_since_enabled:true};const user=findUser(await gql(API.user,{screen_name:handle,withGrokTranslatedBio:false},userFeatures,{withAuxiliaryUserLabels:true}));const userId=user.rest_id,found=new Map();let cursor="",page=0;const cursors=new Set();do{if(aborted)throw Error("処理を中止しました。");page++;setStatus("メディア一覧を取得中",`${page}ページ / ${found.size}件`,Math.min(35,page));const variables={userId,count:50,includePromotedContent:false,withClientEventToken:false,withBirdwatchNotes:false,withVoice:true};if(cursor)variables.cursor=cursor;const batch=scanTimeline(await gql(API.media,variables,FEATURES,{withArticlePlainText:false}));for(const tweet of batch.tweets)for(const item of mediaItems(tweet,userId))if(!found.has(item.key))found.set(item.key,item);if(!batch.cursor||cursors.has(batch.cursor))break;cursors.add(batch.cursor);cursor=batch.cursor;await new Promise(r=>setTimeout(r,350));}while(page<1000);return{userId,items:[...found.values()]};}

const crcTable=(()=>{const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0;}return table;})();
function crc32(bytes){let c=0xffffffff;for(const byte of bytes)c=crcTable[(c^byte)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function u16(view,offset,value){view.setUint16(offset,value,true);}function u32(view,offset,value){view.setUint32(offset,value>>>0,true);}
function zip(files){const encoder=new TextEncoder(),locals=[],centrals=[];let offset=0;for(const file of files){const name=encoder.encode(file.name),data=file.data,crc=crc32(data),local=new Uint8Array(30+name.length),lv=new DataView(local.buffer);u32(lv,0,0x04034b50);u16(lv,4,20);u16(lv,6,0x0800);u16(lv,8,0);u16(lv,10,0);u16(lv,12,0);u32(lv,14,crc);u32(lv,18,data.length);u32(lv,22,data.length);u16(lv,26,name.length);u16(lv,28,0);local.set(name,30);locals.push(local,data);const central=new Uint8Array(46+name.length),cv=new DataView(central.buffer);u32(cv,0,0x02014b50);u16(cv,4,20);u16(cv,6,20);u16(cv,8,0x0800);u16(cv,10,0);u16(cv,12,0);u16(cv,14,0);u32(cv,16,crc);u32(cv,20,data.length);u32(cv,24,data.length);u16(cv,28,name.length);u16(cv,30,0);u16(cv,32,0);u16(cv,34,0);u16(cv,36,0);u32(cv,38,0);u32(cv,42,offset);central.set(name,46);centrals.push(central);offset+=local.length+data.length;}const centralSize=centrals.reduce((n,p)=>n+p.length,0),end=new Uint8Array(22),ev=new DataView(end.buffer);u32(ev,0,0x06054b50);u16(ev,4,0);u16(ev,6,0);u16(ev,8,files.length);u16(ev,10,files.length);u32(ev,12,centralSize);u32(ev,16,offset);u16(ev,20,0);return new Blob([...locals,...centrals,end],{type:"application/zip"});}
function safeName(name){return name.replace(/[^A-Za-z0-9_.-]/g,"_");}
async function downloadAll(handle,items){if(!items.length)throw Error("保存できるメディアが見つかりませんでした。");const files=[],manifest={version:VERSION,username:handle,createdAt:new Date().toISOString(),count:items.length,items:[]};for(let i=0;i<items.length;i++){if(aborted)throw Error("処理を中止しました。");const item=items[i];setStatus("メディアをダウンロード中",`${i+1} / ${items.length} — ${item.name}`,35+Math.round((i/items.length)*55));try{const response=await fetch(item.url,{credentials:"omit"});if(!response.ok)throw Error(`HTTP ${response.status}`);files.push({name:item.name,data:new Uint8Array(await response.arrayBuffer())});manifest.items.push({...item,status:"saved"});}catch(error){manifest.items.push({...item,status:"failed",error:String(error.message||error)});}}const manifestBytes=new TextEncoder().encode(JSON.stringify(manifest,null,2));files.push({name:"manifest.json",data:manifestBytes});setStatus("ZIPを作成中",`${files.length-1}件を格納しています`,94);const blob=zip(files),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`x-media-${safeName(handle)}-${new Date().toISOString().slice(0,10)}.zip`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);return files.length-1;}

async function run(){if(busy)return;busy=true;start.disabled=true;progress.classList.add("show");try{const handle=username(userInput.value);const result=await collect(handle);const saved=await downloadAll(handle,result.items);setStatus("保存を開始しました",`${saved}件 / ZIPファイルを確認してください`,100);busy=false;start.disabled=false;start.textContent="もう一度取得";}catch(error){setStatus("処理を完了できませんでした",String(error.message||error),0);busy=false;start.disabled=false;}}
start.onclick=run;userInput.addEventListener("keydown",event=>{if(event.key==="Enter")run();if(event.key==="Escape")close();});
})();
