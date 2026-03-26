
import React from "react";
import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   ENERGY & MIDDLE EAST CONFLICT DASHBOARD  v6
   - Commodity prices: Brent, WTI, Henry Hub, TTF
   - FX & Macro: EUR/USD, USD/JPY, DXY, Gold, VIX, US10yr, XLE
   - Shipping risk panel
   - Middle East news with clickable headlines
   - Strait of Hormuz animated tanker map
═══════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0e1117;--bg2:#141920;--bg3:#1a2028;--bg4:#202830;--bg5:#28323e;
  --bd:#1e2a38;--bd2:#243040;
  --tx:#ccdaea;--tx2:#6a8aaa;--tx3:#3a5270;
  --gr:#22d47a;--rd:#e8384a;--am:#f0a828;--bl:#3aaaf0;--pu:#9070e8;
  --mn:'JetBrains Mono',monospace;--sn:'DM Sans',sans-serif;
}
body{background:var(--bg);color:var(--tx);font-family:var(--sn);font-size:13px;line-height:1.4}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:var(--bg2)}
::-webkit-scrollbar-thumb{background:var(--bg5);border-radius:2px}
.root{display:flex;flex-direction:column;min-height:100vh}

/* TOPBAR */
.topbar{display:flex;align-items:center;justify-content:space-between;
  padding:8px 14px;background:var(--bg2);border-bottom:1px solid var(--bd);
  position:sticky;top:0;z-index:99}
.tb-left{display:flex;align-items:center;gap:8px}
.tb-title{font-family:var(--sn);font-weight:700;font-size:13px;color:var(--tx)}
.tb-title em{font-style:normal;color:var(--am)}
.tb-right{display:flex;align-items:center;gap:10px;font-family:var(--mn);font-size:10px;color:var(--tx2)}
.pulse{width:7px;height:7px;border-radius:50%;background:var(--gr);flex-shrink:0;
  animation:pulse 2s infinite;box-shadow:0 0 0 0 rgba(34,212,122,.5)}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(34,212,122,.5)}70%{box-shadow:0 0 0 6px rgba(34,212,122,0)}100%{box-shadow:0 0 0 0 rgba(34,212,122,0)}}

/* BODY */
.body{padding:10px;display:flex;flex-direction:column;gap:8px;flex:1}

/* BANNER */
.banner{display:flex;align-items:center;gap:8px;padding:5px 12px;flex-wrap:wrap;
  background:rgba(58,170,240,.07);border:1px solid rgba(58,170,240,.18);border-radius:4px;
  font-family:var(--mn);font-size:9px;color:var(--tx3)}
.bdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.rbtn{margin-left:auto;background:none;border:1px solid var(--bd2);color:var(--tx3);
  font-family:var(--mn);font-size:9px;padding:2px 8px;border-radius:3px;cursor:pointer}
.rbtn:hover{color:var(--tx2)}.rbtn:disabled{opacity:.4;cursor:not-allowed}

/* BRIEF */
.brief{background:var(--bg2);border:1px solid var(--bd);border-radius:4px;padding:10px 14px}
.brief-hdr{display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap}
.brief-lbl{font-family:var(--mn);font-size:9px;font-weight:700;letter-spacing:2px;color:var(--tx2);text-transform:uppercase}
.brief-meta{font-family:var(--mn);font-size:9px;color:var(--tx3)}
.brief-txt{font-size:12px;line-height:1.65;color:var(--tx2)}
.ha{color:#f0a828;font-weight:600}.hb{color:#3aaaf0;font-weight:600}.hc{color:#e8384a;font-weight:600}
.aibtn{display:inline-flex;align-items:center;gap:5px;margin-left:auto;
  background:rgba(240,168,40,.1);border:1px solid rgba(240,168,40,.25);color:var(--am);
  font-family:var(--mn);font-size:9px;font-weight:700;letter-spacing:1px;
  padding:4px 10px;border-radius:3px;cursor:pointer;text-transform:uppercase}
.aibtn:hover{background:rgba(240,168,40,.18)}.aibtn:disabled{opacity:.45;cursor:not-allowed}
.dot{width:4px;height:4px;border-radius:50%;background:var(--am);display:inline-block}
@keyframes blink{0%,100%{opacity:.2}50%{opacity:1}}
.d1{animation:blink 1.2s 0s infinite}.d2{animation:blink 1.2s .2s infinite}.d3{animation:blink 1.2s .4s infinite}

/* PRICE ROW */
.prow{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.pc{background:var(--bg2);border:1px solid var(--bd);border-radius:4px;padding:10px 12px;position:relative;overflow:hidden}
.pc-lbl{font-family:var(--mn);font-size:8px;font-weight:700;letter-spacing:1.5px;color:var(--tx3);text-transform:uppercase;margin-bottom:2px}
.pc-sub{font-family:var(--mn);font-size:8px;color:var(--tx3);margin-bottom:4px}
.pc-pct{position:absolute;top:10px;right:12px;font-family:var(--mn);font-size:10px;font-weight:700}
.pc-chg{position:absolute;top:24px;right:12px;font-family:var(--mn);font-size:9px}
.pc-val{font-family:var(--mn);font-size:26px;font-weight:700;color:var(--tx);letter-spacing:-1px;line-height:1.1}
.pc-unit{font-family:var(--mn);font-size:9px;color:var(--tx3);margin-top:1px;margin-bottom:8px}
.pc-inrow{display:flex;gap:4px;align-items:center;margin-bottom:8px}
.pc-in{display:flex;align-items:center;gap:3px;background:var(--bg3);border:1px solid var(--bd2);border-radius:3px;padding:3px 6px;flex:1}
.pc-in input{background:none;border:none;outline:none;font-family:var(--mn);font-size:10px;color:var(--tx);width:60px}
.pc-in span{font-family:var(--mn);font-size:9px;color:var(--tx3)}
.lbadge{position:absolute;bottom:50px;right:8px;font-family:var(--mn);font-size:7px;padding:1px 4px;border-radius:2px;letter-spacing:.5px}
.live-b{background:rgba(34,212,122,.12);color:var(--gr);border:1px solid rgba(34,212,122,.25)}
.ref-b{background:rgba(240,168,40,.1);color:var(--am);border:1px solid rgba(240,168,40,.2)}
.sp{height:42px;width:100%}
.up{color:var(--gr)}.dn{color:var(--rd)}

/* STATS */
.stats{background:var(--bg2);border:1px solid var(--bd);border-radius:4px;overflow:hidden}
.ph{display:flex;align-items:center;gap:7px;padding:7px 12px;border-bottom:1px solid var(--bd);background:var(--bg3)}
.pi{font-size:11px}
.pt{font-family:var(--mn);font-size:9px;font-weight:700;letter-spacing:1.5px;color:var(--tx2);text-transform:uppercase}
.stbl{width:100%;border-collapse:collapse}
.stbl th{font-family:var(--mn);font-size:9px;color:var(--tx3);padding:6px 14px;text-align:left;font-weight:500;border-bottom:1px solid var(--bd)}
.stbl td{font-family:var(--mn);font-size:11px;padding:5px 14px;border-bottom:1px solid #182030}
.stbl tr:last-child td{border-bottom:none}
.stbl .tlb{color:var(--tx3);font-size:10px}
.stbl .tv{text-align:right;color:var(--tx)}
.stbl .tvu{text-align:right;color:var(--gr)}
.stbl .tvd{text-align:right;color:var(--rd)}
.ch{color:var(--am) !important;font-weight:700 !important;font-size:10px !important;text-align:right !important}

/* BOTTOM 3-COL */
.bot{display:grid;grid-template-columns:240px 1fr 1fr;gap:8px;align-items:start}

/* SHIP */
.shipp{background:var(--bg2);border:1px solid var(--bd);border-radius:4px;overflow:hidden}
.srow{padding:7px 12px;border-bottom:1px solid var(--bd);display:grid;grid-template-columns:1fr auto;gap:4px;align-items:center}
.srow:last-child{border-bottom:none}
.sn{font-size:11px;font-weight:600;color:var(--tx);margin-bottom:2px}
.sd{font-size:10px;color:var(--tx3);line-height:1.4}
.sr{display:flex;flex-direction:column;align-items:flex-end;gap:3px}
.rb{font-family:var(--mn);font-size:8px;font-weight:700;letter-spacing:.5px;padding:2px 6px;border-radius:2px}
.rC{background:rgba(232,56,74,.2);color:#e8384a;border:1px solid rgba(232,56,74,.4)}
.rH{background:rgba(232,56,74,.12);color:#e8384a;border:1px solid rgba(232,56,74,.25)}
.rE{background:rgba(240,168,40,.15);color:#f0a828;border:1px solid rgba(240,168,40,.3)}
.rL{background:rgba(34,212,122,.12);color:#22d47a;border:1px solid rgba(34,212,122,.25)}
.rbar{width:72px;height:5px;background:var(--bg4);border-radius:3px;overflow:hidden}
.rfill{height:100%;border-radius:3px}

/* FX */
.fxp{background:var(--bg2);border:1px solid var(--bd);border-radius:4px;overflow:hidden}
.fxrow{display:grid;grid-template-columns:1fr 80px 60px;gap:4px;align-items:center;padding:6px 12px;border-bottom:1px solid var(--bd)}
.fxrow:last-child{border-bottom:none}
.fx-pair{font-family:var(--mn);font-size:10px;font-weight:600;color:var(--tx2)}
.fx-note{font-size:9px;color:var(--tx3);margin-top:1px}
.fx-right{display:flex;flex-direction:column;align-items:flex-end;gap:1px}
.fx-val{font-family:var(--mn);font-size:13px;font-weight:700;color:var(--tx);white-space:nowrap}
.fx-pct{font-family:var(--mn);font-size:9px;white-space:nowrap}
.fx-sp{height:26px;width:80px}
.fxdiv{height:1px;background:var(--bd2);margin:0 12px}

/* NEWS */
.newsp{background:var(--bg2);border:1px solid var(--bd);border-radius:4px;overflow:hidden}
.ntabs{display:flex;gap:4px;padding:5px 8px;border-bottom:1px solid var(--bd);background:var(--bg3);flex-wrap:wrap}
.ntab{font-family:var(--mn);font-size:9px;padding:2px 8px;border-radius:3px;cursor:pointer;color:var(--tx3);font-weight:500;user-select:none}
.ntab:hover{color:var(--tx2)}.ntab.on{background:var(--bg4);color:var(--tx)}
.ntab.et{color:var(--am)}.ntab.mt{color:var(--rd)}.ntab.dt{color:var(--gr)}
.ngrid{display:grid;grid-template-columns:1fr 1fr}
.ncol{border-right:1px solid var(--bd)}.ncol:last-child{border-right:none}
.ni{padding:6px 10px;border-bottom:1px solid var(--bd);display:block;text-decoration:none;transition:background .1s}
.ni:last-child{border-bottom:none}.ni:hover{background:var(--bg3)}.ni:hover .nhl{color:#fff}
.nmeta{display:flex;align-items:center;gap:4px;margin-bottom:3px;flex-wrap:wrap}
.nsrc{font-family:var(--mn);font-size:8px;font-weight:700;padding:1px 5px;border-radius:2px}
.alj{background:rgba(232,56,74,.15);color:#e8384a;border:1px solid rgba(232,56,74,.3)}
.cbs{background:rgba(34,212,122,.12);color:#22d47a;border:1px solid rgba(34,212,122,.25)}
.cnn_{background:rgba(232,100,100,.12);color:#e87070}
.cnbc{background:rgba(240,168,40,.12);color:#f0a828;border:1px solid rgba(240,168,40,.2)}
.bb{background:rgba(58,170,240,.12);color:#3aaaf0;border:1px solid rgba(58,170,240,.2)}
.sou{background:rgba(144,112,232,.15);color:#9070e8}
.ncat{font-family:var(--mn);font-size:7px;padding:1px 4px;border-radius:2px;font-weight:700;letter-spacing:.4px}
.cml{background:rgba(232,56,74,.1);color:var(--rd)}
.cen{background:rgba(240,168,40,.1);color:var(--am)}
.cdp{background:rgba(34,212,122,.1);color:var(--gr)}
.ndate{font-family:var(--mn);font-size:8px;color:var(--tx3)}
.nhl{font-size:11px;color:var(--tx);line-height:1.4}
.ei{font-size:8px;color:var(--tx3);margin-left:3px;opacity:0}
.ni:hover .ei{opacity:1}

/* HORMUZ MAP */
.hmap{background:var(--bg2);border:1px solid var(--bd);border-radius:4px;overflow:hidden}
.hmap-leg{display:flex;gap:12px;padding:6px 12px;border-bottom:1px solid var(--bd);background:var(--bg3);flex-wrap:wrap}
.leg{display:flex;align-items:center;gap:5px;font-family:var(--mn);font-size:8px;color:var(--tx3)}
.ldot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.lline{width:16px;height:2px;flex-shrink:0;border-radius:1px}
.hsvg{display:block;width:100%}
.tklbl{font-family:'JetBrains Mono',monospace;font-size:7px;fill:#c0d8e8;pointer-events:none}
.htbl{width:100%;border-collapse:collapse}
.htbl th{font-family:var(--mn);font-size:8px;color:var(--tx3);padding:5px 10px;text-align:left;
  border-bottom:1px solid var(--bd);background:var(--bg3);text-transform:uppercase;letter-spacing:.5px}
.htbl td{font-size:10px;padding:5px 10px;border-bottom:1px solid var(--bd);color:var(--tx2)}
.htbl tr:last-child td{border-bottom:none}
.htbl tr:hover td{background:var(--bg3)}
.htbl .mn{font-family:var(--mn);color:var(--tx)}
.sdot{display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:5px}
@keyframes blinkr{0%,100%{opacity:1}50%{opacity:.2}}
`;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function mkS(base, n=30, vol=0.008) {
  const a = []; let v = base * (1 + (Math.random()-.5)*.05);
  for (let i=0; i<n-1; i++) { v = +(v*(1+(Math.random()-.5)*vol*2)).toFixed(4); a.push(v); }
  a.push(+base.toFixed(4)); return a;
}
const maFn = (s,w=7) => { const sl=s.slice(-w); return +(sl.reduce((a,b)=>a+b,0)/sl.length).toFixed(2); };
const hiFn = s => Math.max(...s).toFixed(2);
const loFn = s => Math.min(...s).toFixed(2);
const dFn  = s => { const d=s[s.length-1]-s[0]; return {pct:((d/s[0])*100).toFixed(1)}; };

/* ── Sparkline ───────────────────────────────────────────────────────────── */
function Spark({ series, color, W=200, H=42, cls="sp" }) {
  if (!series || series.length < 2) return <svg className={cls} viewBox={`0 0 ${W} ${H}`}/>;
  const mn=Math.min(...series), mx=Math.max(...series), rng=mx-mn||1, n=series.length;
  const pts = series.map((v,i) => `${(i/(n-1))*W},${H-((v-mn)/rng)*(H-4)-2}`).join(" ");
  const uid = `g${color.replace(/[^a-z0-9]/gi,"")}${W}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cls} preserveAspectRatio="none">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${uid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Clock ───────────────────────────────────────────────────────────────── */
function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(id); }, []);
  const p = n => String(n).padStart(2,"0");
  return `${t.getUTCFullYear()}-${p(t.getUTCMonth()+1)}-${p(t.getUTCDate())} ${p(t.getUTCHours())}:${p(t.getUTCMinutes())}:${p(t.getUTCSeconds())} UTC`;
}

/* ── Yahoo Finance fetch ─────────────────────────────────────────────────── */
async function fetchYF(sym) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`;
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxy, { signal: AbortSignal.timeout(7000) });
  const outer = await res.json();
  const data = JSON.parse(outer.contents);
  const q = data?.chart?.result?.[0]?.meta;
  if (!q) throw new Error("no data");
  return {
    price: +(q.regularMarketPrice ?? q.previousClose).toFixed(4),
    prev:  +(q.previousClose ?? q.regularMarketPrice).toFixed(4),
  };
}

/* ── Static config ───────────────────────────────────────────────────────── */
const COMMS = [
  { id:"BRT", yf:"BZ=F",  label:"BRENT CRUDE",        sub:"USD/bbl",   color:"#f0a828", unit:"$", dp:2 },
  { id:"WTI", yf:"CL=F",  label:"WTI CRUDE",           sub:"USD/bbl",   color:"#22d47a", unit:"$", dp:2 },
  { id:"HH",  yf:"NG=F",  label:"HENRY HUB NAT. GAS",  sub:"USD/MMBtu", color:"#3aaaf0", unit:"$", dp:3 },
  { id:"TTF", yf:"TTF=F", label:"TTF EU GAS",           sub:"EUR/MWh",   color:"#9070e8", unit:"€", dp:2 },
];
const FXS = [
  { pair:"EUR / USD",  yf:"EURUSD=X", note:"USD safe-haven bid",            type:"fx4",  color:"#3aaaf0" },
  { pair:"USD / JPY",  yf:"USDJPY=X", note:"¥ weakening on risk-off",       type:"fx2",  color:"#22d47a" },
  { pair:"DXY",        yf:"DX-Y.NYB", note:"Dollar index — risk-off bid",   type:"dxy",  color:"#3aaaf0" },
  { pair:"Gold XAU",   yf:"GC=F",     note:"War safe-haven surge",          type:"price",color:"#f0a828" },
  { pair:"VIX",        yf:"^VIX",     note:"Equity vol — geopolitical spike",type:"vix", color:"#e8384a" },
  { pair:"US 10yr",    yf:"^TNX",     note:"Inflation fears rise",          type:"pct",  color:"#9070e8" },
  { pair:"XLE Energy", yf:"XLE",      note:"Energy stocks lead S&P",        type:"ytd",  color:"#22d47a" },
];
const FB = {
  "BZ=F":74.10,"CL=F":70.20,"NG=F":1.92,"TTF=F":34.50,
  "EURUSD=X":1.0842,"USDJPY=X":149.55,"DX-Y.NYB":104.22,
  "GC=F":3025,"^VIX":18.40,"^TNX":4.26,"XLE":92.10,
};
const SHIPS = [
  { name:"Strait of Hormuz", desc:"Partially closed; IRGCN exercises active. 21 Mbd at risk.", risk:"CRITICAL", score:94 },
  { name:"Persian Gulf",     desc:"Active threat; drone interdiction ops. Coalition monitoring.", risk:"HIGH",     score:78 },
  { name:"Red Sea / Suez",   desc:"Houthi activity. Rerouting via Cape. Insurance +0.2%.", risk:"ELEVATED", score:62 },
  { name:"Bab-el-Mandeb",    desc:"Limited but navigable. Naval patrols active.", risk:"ELEVATED", score:58 },
  { name:"Sumed Pipeline",   desc:"Egypt pipeline unaffected. Normal operations.", risk:"LOW", score:15 },
];
const NEWS = [
  { src:"AL JAZEERA", sc:"alj", cat:"MILITARY",  cc:"cml", date:"25 Mar", hl:"US-Israel attack plans on Iran reportedly shared with Gulf allies ahead of potential strike", url:"https://www.google.com/search?q=US+Israel+Iran+attack+plans+2026&tbm=nws" },
  { src:"CNBC",       sc:"cnbc",cat:"ENERGY",    cc:"cen", date:"25 Mar", hl:"Oil climbs on Iran tensions; traders price in Hormuz disruption risk premium", url:"https://www.google.com/search?q=oil+Iran+Hormuz+risk+2026&tbm=nws" },
  { src:"CBS NEWS",   sc:"cbs", cat:"MILITARY",  cc:"cml", date:"24 Mar", hl:"Iran's Hormuz threat prompts emergency OPEC+ call; Saudi signals output hike", url:"https://www.google.com/search?q=Iran+Hormuz+OPEC+2026&tbm=nws" },
  { src:"CNBC",       sc:"cnbc",cat:"ENERGY",    cc:"cen", date:"24 Mar", hl:"Brent spikes on Hormuz risk; options volatility rises sharply in energy markets", url:"https://www.google.com/search?q=Brent+Hormuz+options+2026&tbm=nws" },
  { src:"CNN",        sc:"cnn_",cat:"DIPLOMACY", cc:"cdp", date:"23 Mar", hl:"Trump weighs direct Iran talks as military options remain on the table", url:"https://www.google.com/search?q=Trump+Iran+diplomacy+2026&tbm=nws" },
  { src:"BLOOMBERG",  sc:"bb",  cat:"ENERGY",    cc:"cen", date:"22 Mar", hl:"Iran targets Qatar LNG vessels in Gulf; Ras Laffan output under threat", url:"https://www.google.com/search?q=Iran+Qatar+LNG+2026&tbm=nws" },
  { src:"AL JAZEERA", sc:"alj", cat:"MILITARY",  cc:"cml", date:"22 Mar", hl:"What happens if Iran closes Hormuz? Military and economic scenarios mapped", url:"https://www.google.com/search?q=Iran+close+Hormuz+scenarios&tbm=nws" },
  { src:"CNN",        sc:"cnn_",cat:"ENERGY",    cc:"cen", date:"21 Mar", hl:"Qatar LNG disruption: what it means for European winter gas supply", url:"https://www.google.com/search?q=Qatar+LNG+Europe+gas&tbm=nws" },
  { src:"SOUFAN CTR", sc:"sou", cat:"MILITARY",  cc:"cml", date:"20 Mar", hl:"Houthis weigh joining Iran conflict; new drone capabilities raise Red Sea stakes", url:"https://www.google.com/search?q=Houthi+Iran+Red+Sea+2026&tbm=nws" },
  { src:"AL JAZEERA", sc:"alj", cat:"DIPLOMACY", cc:"cdp", date:"19 Mar", hl:"Why Houthi-Iran coordination is complicating Gulf ceasefire diplomacy", url:"https://www.google.com/search?q=Houthi+Iran+ceasefire&tbm=nws" },
  { src:"CNBC",       sc:"cnbc",cat:"ENERGY",    cc:"cen", date:"18 Mar", hl:"Middle East tensions send TTF gas higher; Europe scrambles for alternative supply", url:"https://www.google.com/search?q=TTF+gas+Middle+East+2026&tbm=nws" },
  { src:"BLOOMBERG",  sc:"bb",  cat:"ENERGY",    cc:"cen", date:"17 Mar", hl:"Real oil costs hit multi-year highs when war risk premium is factored in", url:"https://www.google.com/search?q=oil+war+risk+premium+2026&tbm=nws" },
];
const BRIEF0 = `Brent hovers near $74/bbl with a modest geopolitical premium as Iran-Hormuz tensions remain unresolved. Qatar's Ras Laffan LNG complex faces intermittent disruption risk, keeping TTF above seasonal norms, while Henry Hub stays range-bound at sub-$2/MMBtu on strong US storage. Gold holds near $3,000 on safe-haven flows, DXY is firm at 104, and VIX is elevated — reflecting persistent market anxiety over a Hormuz closure scenario.`;

/* ── Hormuz Map component ────────────────────────────────────────────────── */
const INIT_TANKERS = [
  { id:"SCF NAKHODKA",  flag:"🇷🇺", type:"VLCC",    cargo:"Crude",  dwt:"300k DWT", speed:"11.2 kts", heading:"SW", status:"transit",   color:"#22d47a", path:[[58.8,24.5],[58.2,24.8],[57.5,25.3],[57.0,25.8],[56.4,26.4],[55.9,26.6]], prog:0.30 },
  { id:"EAGLE HOUSTON", flag:"🇺🇸", type:"Suezmax", cargo:"Crude",  dwt:"160k DWT", speed:"12.8 kts", heading:"NE", status:"transit",   color:"#3aaaf0", path:[[55.8,26.5],[56.3,26.3],[56.9,25.9],[57.4,25.4],[58.0,24.9],[58.6,24.3]], prog:0.55 },
  { id:"TITAN GLORY",   flag:"🇬🇷", type:"VLCC",    cargo:"Crude",  dwt:"320k DWT", speed:"0 kts",    heading:"—",  status:"anchored",  color:"#f0a828", path:[[56.3,26.2]], prog:0 },
  { id:"PACIFIC JEWEL", flag:"🇸🇬", type:"LNG",     cargo:"LNG",   dwt:"77k cbm",  speed:"14.1 kts", heading:"E",  status:"transit",   color:"#9070e8", path:[[55.6,26.7],[56.1,26.4],[56.8,26.0],[57.3,25.5],[57.9,25.0],[58.5,24.4]], prog:0.70 },
  { id:"GULF EAGLE",    flag:"🇦🇪", type:"Product", cargo:"Diesel", dwt:"45k DWT",  speed:"9.4 kts",  heading:"W",  status:"transit",   color:"#18c8c0", path:[[58.4,24.6],[57.9,25.1],[57.3,25.6],[56.7,26.1],[56.2,26.5]], prog:0.45 },
  { id:"IRAN HORMUZ 8", flag:"🇮🇷", type:"IRISL",   cargo:"Crude",  dwt:"280k DWT", speed:"8.1 kts",  heading:"SE", status:"monitored", color:"#e8384a", path:[[56.5,27.2],[56.8,26.8],[57.1,26.3],[57.5,25.8],[57.9,25.3]], prog:0.35 },
];

function ll(lon, lat) {
  return { x: +((lon-55)/5*600).toFixed(1), y: +((28-lat)/4*320).toFixed(1) };
}
function getPos(t) {
  const path = t.path;
  if (path.length === 1 || t.status === "anchored") return ll(path[0][0], path[0][1]);
  const p = t.prog * (path.length-1);
  const i = Math.min(Math.floor(p), path.length-2);
  const f = p - i;
  const a = ll(path[i][0], path[i][1]);
  const b = ll(path[i+1][0], path[i+1][1]);
  return { x: a.x+(b.x-a.x)*f, y: a.y+(b.y-a.y)*f };
}

function HormuzMap() {
  const [tankers, setTankers] = useState(INIT_TANKERS.map(t=>({...t})));
  const [sel, setSel] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTankers(prev => prev.map(t => {
        if (t.status === "anchored") return t;
        const spd = parseFloat(t.speed) || 10;
        const np = t.prog + 0.003 * (spd/12);
        return { ...t, prog: np >= 1 ? 0 : np };
      }));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const oman  = "M600,200 L540,190 L490,175 L460,168 L440,160 L420,158 L400,162 L380,168 L370,172 L360,178 L350,185 L340,195 L330,208 L320,220 L310,240 L300,260 L290,280 L280,300 L270,320 L600,320 Z";
  const iran  = "M0,0 L60,0 L120,8 L180,18 L220,22 L260,20 L300,16 L340,14 L380,10 L420,8 L460,12 L490,18 L520,22 L560,18 L600,12 L600,0 Z";
  const uae   = "M280,160 L300,145 L318,130 L330,115 L340,108 L350,112 L348,128 L340,145 L328,158 L310,168 L295,172 L280,168 Z";
  const qeshm = "M360,95 L390,88 L415,90 L420,100 L408,108 L385,108 L362,103 Z";
  const inLane  = "M600,148 L540,152 L480,158 L430,162 L390,164 L360,162 L340,158 L325,152 L310,145 L298,138";
  const outLane = "M600,170 L540,174 L480,180 L430,184 L390,186 L360,184 L340,180 L325,172 L310,165 L298,158";

  return (
    <div className="hmap">
      <div className="ph" style={{justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span className="pi">🛢</span>
          <span className="pt">Strait of Hormuz — Tanker Traffic Monitor</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,paddingRight:4}}>
          <span style={{fontFamily:"var(--mn)",fontSize:9,color:"var(--tx3)"}}>
            {tankers.filter(t=>t.status!=="anchored").length} vessels in transit
          </span>
          <span style={{fontFamily:"var(--mn)",fontSize:9,padding:"2px 7px",borderRadius:3,
            background:"rgba(232,56,74,.15)",color:"#e8384a",border:"1px solid rgba(232,56,74,.3)"}}>
            ⚠ CRITICAL RISK
          </span>
        </div>
      </div>

      <div className="hmap-leg">
        {[["#22d47a","Transit Outbound"],["#3aaaf0","Transit Inbound"],["#f0a828","Anchored"],["#e8384a","IRISL / Monitored"]].map(([c,l])=>(
          <div key={l} className="leg"><div className="ldot" style={{background:c}}/>{l}</div>
        ))}
        <div className="leg"><div className="lline" style={{background:"rgba(58,170,240,.5)"}}/> Inbound TSS</div>
        <div className="leg"><div className="lline" style={{background:"rgba(34,212,122,.5)"}}/> Outbound TSS</div>
      </div>

      <svg viewBox="0 0 600 320" className="hsvg" style={{height:270}}>
        <rect width="600" height="320" fill="#081018"/>
        <defs>
          <radialGradient id="od" cx="50%" cy="60%">
            <stop offset="0%" stopColor="#0d1e30"/>
            <stop offset="100%" stopColor="#060e18"/>
          </radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="600" height="320" fill="url(#od)"/>

        {/* TSS lanes */}
        <path d={inLane}  fill="none" stroke="rgba(58,170,240,.18)" strokeWidth="14"/>
        <path d={outLane} fill="none" stroke="rgba(34,212,122,.18)" strokeWidth="14"/>
        <path d={inLane}  fill="none" stroke="rgba(58,170,240,.55)" strokeWidth="1" strokeDasharray="8 5"/>
        <path d={outLane} fill="none" stroke="rgba(34,212,122,.55)" strokeWidth="1" strokeDasharray="8 5"/>

        {/* Land */}
        <path d={iran}  fill="#1a2530" stroke="#253545" strokeWidth="1"/>
        <path d={oman}  fill="#1a2530" stroke="#253545" strokeWidth="1"/>
        <path d={uae}   fill="#1a2530" stroke="#253545" strokeWidth="1"/>
        <path d={qeshm} fill="#1a2530" stroke="#253545" strokeWidth="1"/>

        {/* Place labels */}
        <text x="300" y="235" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono" fill="#1a3a50" fontWeight="700" letterSpacing="3">GULF OF OMAN</text>
        <text x="155" y="90"  textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="#1a3a50" fontWeight="700" letterSpacing="2">PERSIAN GULF</text>
        <text x="490" y="22" textAnchor="middle" fontSize="9"  fontFamily="JetBrains Mono" fill="#254055">IRAN</text>
        <text x="490" y="250" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="#254055">OMAN</text>
        <text x="315" y="128" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono" fill="#1e3a52">MUSANDAM</text>
        <text x="390" y="97"  textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono" fill="#1e3a52">QESHM IS.</text>

        {/* Strait annotation */}
        <line x1="298" y1="105" x2="298" y2="192" stroke="#e8384a" strokeWidth="1" strokeDasharray="2 2" opacity=".45"/>
        <text x="215" y="108" fontSize="8" fontFamily="JetBrains Mono" fill="#c03030" fontWeight="700">STRAIT OF HORMUZ</text>
        <text x="230" y="118" fontSize="7" fontFamily="JetBrains Mono" fill="#903030">~39km at narrowest</text>

        {/* IRGCN exercise zone */}
        <ellipse cx="360" cy="78" rx="55" ry="22" fill="rgba(232,56,74,.05)" stroke="rgba(232,56,74,.32)" strokeWidth="1" strokeDasharray="4 3"/>
        <text x="360" y="74" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono" fill="rgba(232,56,74,.75)">IRGCN EXERCISE ZONE</text>
        <text x="360" y="83" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fill="rgba(232,56,74,.55)">ACTIVE — USE CAUTION</text>

        <text x="548" y="145" fontSize="7" fontFamily="JetBrains Mono" fill="rgba(58,170,240,.6)" textAnchor="end">INBOUND →</text>
        <text x="548" y="186" fontSize="7" fontFamily="JetBrains Mono" fill="rgba(34,212,122,.6)" textAnchor="end">← OUTBOUND</text>

        {/* Path trails */}
        {tankers.map((t,i) => {
          if (t.path.length < 2) return null;
          const pts = t.path.map(([lon,lat])=>{ const c=ll(lon,lat); return `${c.x},${c.y}`; }).join(" ");
          return <polyline key={i} points={pts} fill="none" stroke={t.color} strokeWidth="1" opacity=".15" strokeDasharray="3 3"/>;
        })}

        {/* Tanker icons */}
        {tankers.map((t,i) => {
          const pos = getPos(t);
          const isSel = sel === t.id;
          const isAnch = t.status === "anchored";
          return (
            <g key={i} style={{cursor:"pointer"}} onClick={()=>setSel(isSel?null:t.id)} filter={isSel?"url(#glow)":""}>
              {isSel && <circle cx={pos.x} cy={pos.y} r="14" fill="none" stroke={t.color} strokeWidth="1.5" opacity=".5"/>}
              {isAnch
                ? <g transform={`translate(${pos.x},${pos.y})`}>
                    <circle r="7" fill="rgba(240,168,40,.15)" stroke="#f0a828" strokeWidth="1.5"/>
                    <text textAnchor="middle" y="4" fontSize="8" fill="#f0a828">⚓</text>
                  </g>
                : <g transform={`translate(${pos.x},${pos.y})`}>
                    <ellipse rx="8" ry="3.5" fill={t.color} opacity=".9"/>
                    <rect x="-3" y="-5" width="6" height="4" rx="1" fill={t.color} opacity=".7"/>
                  </g>
              }
              <text x={pos.x+10} y={pos.y-4}  className="tklbl" fill={t.color}>{t.id}</text>
              <text x={pos.x+10} y={pos.y+5}  className="tklbl" fill="rgba(140,170,195,.6)">{t.flag} {t.type}</text>
              {isSel && <text x={pos.x+10} y={pos.y+14} className="tklbl" fill="rgba(190,215,235,.85)">{t.speed} · {t.heading}</text>}
            </g>
          );
        })}

        {/* Scale + compass */}
        <line x1="18" y1="300" x2="68" y2="300" stroke="#1e3a50" strokeWidth="1.5"/>
        <line x1="18" y1="296" x2="18" y2="304" stroke="#1e3a50" strokeWidth="1.5"/>
        <line x1="68" y1="296" x2="68" y2="304" stroke="#1e3a50" strokeWidth="1.5"/>
        <text x="43" y="313" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono" fill="#1e3a50">~50 nm</text>
        <text x="574" y="298" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono" fill="#1e3a50">N↑</text>
      </svg>

      {/* Vessel table */}
      <table className="htbl">
        <thead>
          <tr><th>Vessel</th><th>Flag</th><th>Type</th><th>Cargo</th><th>Speed</th><th>Hdg</th><th>Status</th></tr>
        </thead>
        <tbody>
          {tankers.map((t,i) => {
            const sc = t.status==="transit"?t.color:t.status==="anchored"?"#f0a828":"#e8384a";
            return (
              <tr key={i} style={{cursor:"pointer",background:sel===t.id?"rgba(255,255,255,.03)":""}}
                onClick={()=>setSel(sel===t.id?null:t.id)}>
                <td className="mn" style={{color:t.color,fontWeight:600}}>{t.id}</td>
                <td style={{fontSize:14}}>{t.flag}</td>
                <td className="mn">{t.type}</td>
                <td>{t.cargo} · {t.dwt}</td>
                <td className="mn">{t.speed}</td>
                <td className="mn">{t.heading}</td>
                <td>
                  <span className="sdot" style={{background:sc,animation:t.status==="monitored"?"blinkr 1.5s infinite":""}}/>
                  <span style={{color:sc,fontFamily:"var(--mn)",fontSize:9,textTransform:"uppercase",fontWeight:600}}>{t.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  // Inject CSS once
  useEffect(() => {
    if (document.getElementById("eme-v6")) return;
    const s = document.createElement("style"); s.id="eme-v6"; s.textContent=CSS;
    document.head.appendChild(s);
  }, []);

  const [prices, setPrices] = useState(() =>
    Object.fromEntries(COMMS.map(c => [c.id, { price:FB[c.yf]??70, prev:(FB[c.yf]??70)*.998, series:mkS(FB[c.yf]??70,30,.008), live:false }]))
  );
  const [fxVals, setFxVals] = useState(() =>
    FXS.map(f => ({ ...f, val:FB[f.yf]??1, prev:(FB[f.yf]??1)*.999, chg:0, pct:0, live:false, series:mkS(FB[f.yf]??1,20,.005) }))
  );
  const [status, setStatus] = useState("idle");
  const [lastFetch, setLastFetch] = useState(null);
  const [brief, setBrief] = useState(BRIEF0);
  const [briefLoad, setBriefLoad] = useState(false);
  const [newsTab, setNewsTab] = useState("all");

  const fetchAll = useCallback(async () => {
    setStatus("loading");
    let any = false;
    const np = {...prices};
    await Promise.allSettled(COMMS.map(async c => {
      try {
        const { price, prev } = await fetchYF(c.yf);
        np[c.id] = { price, prev, series:[...(np[c.id]?.series??[]).slice(-29), price], live:true };
        any = true;
      } catch {
        if (!np[c.id]) { const fb=FB[c.yf]??70; np[c.id]={price:fb,prev:fb*.999,series:mkS(fb,30),live:false}; }
      }
    }));
    setPrices(np);
    const nfx = [...fxVals];
    await Promise.allSettled(FXS.map(async (f,i) => {
      try {
        const { price, prev } = await fetchYF(f.yf);
        const chg = +(price-prev).toFixed(4);
        nfx[i] = { ...nfx[i], val:price, prev, chg, pct:+((chg/prev)*100).toFixed(3), live:true, series:[...(nfx[i].series??[]).slice(-19),price] };
        any = true;
      } catch { nfx[i] = { ...nfx[i], live:false }; }
    }));
    setFxVals(nfx);
    setStatus(any ? "live" : "failed");
    setLastFetch(new Date());
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 5*60*1000);
    return () => clearInterval(id);
  }, []);

  // Gentle nudge between fetches
  useEffect(() => {
    const id = setInterval(() => {
      setPrices(prev => {
        const n = {};
        Object.entries(prev).forEach(([k,v]) => {
          const np = +(v.price*(1+(Math.random()-.5)*.001)).toFixed(4);
          n[k] = { ...v, price:np, series:[...v.series.slice(-29),np] };
        });
        return n;
      });
      setFxVals(prev => prev.map(f => {
        const nv = +(f.val*(1+(Math.random()-.5)*.0005)).toFixed(4);
        const chg = +(nv-f.prev).toFixed(4);
        return { ...f, val:nv, chg, pct:+((chg/f.prev)*100).toFixed(3), series:[...f.series.slice(-19),nv] };
      }));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const genBrief = useCallback(async () => {
    setBriefLoad(true);
    const b=prices.BRT?.price, w=prices.WTI?.price, h=prices.HH?.price, t=prices.TTF?.price;
    const vix=fxVals.find(f=>f.pair==="VIX")?.val;
    const gold=fxVals.find(f=>f.pair==="Gold XAU")?.val;
    const dxy=fxVals.find(f=>f.pair==="DXY")?.val;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:`Senior energy analyst. 3-sentence institutional dashboard briefing using these prices: Brent $${b?.toFixed(2)}/bbl, WTI $${w?.toFixed(2)}/bbl, TTF €${t?.toFixed(2)}/MWh, HenryHub $${h?.toFixed(3)}/MMBtu, VIX ${vix?.toFixed(1)}, Gold $${gold?.toFixed(0)}, DXY ${dxy?.toFixed(2)}. Context: Iran-Hormuz tension, Houthi Red Sea threat, 6 tankers in Hormuz transit. Bloomberg style, no preamble.`}]
        })
      });
      const d = await res.json();
      setBrief(d.content?.map(x=>x.text||"").join("")||BRIEF0);
    } catch { setBrief(BRIEF0); }
    setBriefLoad(false);
  }, [prices, fxVals]);

  const fxDisp = f => {
    const v = parseFloat(f.val);
    if (f.type==="price") return "$"+v.toFixed(0);
    if (f.type==="pct")   return v.toFixed(2)+"%";
    if (f.type==="ytd")   return (v>0?"+":"")+v.toFixed(2);
    if (f.type==="vix")   return v.toFixed(2);
    if (f.type==="dxy")   return v.toFixed(2);
    if (f.type==="fx2")   return v.toFixed(2);
    return v.toFixed(4);
  };

  const p2 = n => String(n).padStart(2,"0");
  const fmtT = d => d ? `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())} UTC` : "";
  const filtered = newsTab==="all"?NEWS : NEWS.filter(n => newsTab==="energy"?n.cat==="ENERGY":newsTab==="military"?n.cat==="MILITARY":n.cat==="DIPLOMACY");
  const nl=filtered.filter((_,i)=>i%2===0), nr=filtered.filter((_,i)=>i%2===1);

  return (
    <div className="root">
      {/* TOPBAR */}
      <div className="topbar">
        <div className="tb-left">
          <div className="pulse"/>
          <span className="tb-title">⚡ <em>Energy &amp; Middle East</em> Dashboard</span>
        </div>
        <div className="tb-right">
          <span><Clock/></span>
          <span style={{color:"var(--tx3)"}}>·</span>
          <span>Daily 07:00</span>
        </div>
      </div>

      <div className="body">
        {/* BANNER */}
        <div className="banner">
          {status==="loading" && <><span className="bdot" style={{background:"var(--am)"}}/><span>Fetching live prices…</span></>}
          {status==="live"    && <><span className="bdot" style={{background:"var(--gr)"}}/><span style={{color:"var(--gr)"}}>Live</span><span> — Yahoo Finance. Commodities &amp; FX both refresh every 5 min.{lastFetch&&` Last: ${fmtT(lastFetch)}`}</span></>}
          {status==="failed"  && <><span className="bdot" style={{background:"var(--am)"}}/><span style={{color:"var(--am)"}}>Reference prices</span><span> — CORS blocked in sandbox. Deploy to StackBlitz/Vercel for live data.</span></>}
          {status==="idle"    && <><span className="bdot" style={{background:"var(--tx3)"}}/><span>Initialising…</span></>}
          <button className="rbtn" onClick={fetchAll} disabled={status==="loading"}>↺ Refresh</button>
        </div>

        {/* BRIEFING */}
        <div className="brief">
          <div className="brief-hdr">
            <span>📋</span>
            <span className="brief-lbl">Situation Briefing</span>
            <span className="brief-meta">· {new Date().toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</span>
            <span className="brief-meta">· Generated by Claude</span>
            <button className="aibtn" onClick={genBrief} disabled={briefLoad}>
              {briefLoad ? <><span className="dot d1"/><span className="dot d2"/><span className="dot d3"/> Generating…</> : "↺ Refresh Briefing"}
            </button>
          </div>
          <div className="brief-txt">
            {brief.split(/(\bBrent\b|\bTTF\b|\bHenry Hub\b|\bGold\b|\bHouthi\b|\bRas Laffan\b|\bIran\b)/).map((part,i) => {
              if (["Brent","Gold","Henry Hub"].includes(part)) return <span key={i} className="ha">{part}</span>;
              if (["TTF","Ras Laffan"].includes(part)) return <span key={i} className="hb">{part}</span>;
              if (["Houthi","Iran"].includes(part)) return <span key={i} className="hc">{part}</span>;
              return part;
            })}
          </div>
        </div>

        {/* PRICE CARDS */}
        <div className="prow">
          {COMMS.map(c => {
            const pd = prices[c.id];
            const last=pd?.price??FB[c.yf]??0, prev=pd?.prev??last*.999;
            const chg=+(last-prev).toFixed(3), pct=+((chg/prev)*100).toFixed(2), up=chg>=0;
            return (
              <div className="pc" key={c.id}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div><div className="pc-lbl">{c.label}</div><div className="pc-sub">{c.sub}</div></div>
                  <div style={{textAlign:"right"}}>
                    <div className={`pc-pct ${up?"up":"dn"}`}>{up?"▲":"▼"}{Math.abs(pct)}%</div>
                    <div className={`pc-chg ${up?"up":"dn"}`}>{up?"+":""}{chg}</div>
                  </div>
                </div>
                <div className="pc-val">{c.unit}{last.toFixed(c.dp)}</div>
                <div className="pc-unit">{c.sub}</div>
                <span className={`lbadge ${pd?.live?"live-b":"ref-b"}`}>{pd?.live?"● LIVE":"◌ REF"}</span>
                <div className="pc-inrow">
                  <div className="pc-in"><input defaultValue={last.toFixed(c.dp)}/><span>{c.unit}</span></div>
                  <span style={{fontFamily:"var(--mn)",fontSize:10,color:"var(--tx3)"}}>$</span>
                </div>
                <Spark series={pd?.series??[last]} color={c.color}/>
              </div>
            );
          })}
        </div>

        {/* 7-DAY STATS */}
        <div className="stats">
          <div className="ph"><span className="pi">📊</span><span className="pt">7-Day Statistics</span></div>
          <table className="stbl">
            <thead><tr>
              <th style={{width:60}}></th>
              {COMMS.map(c=><th key={c.id} className="ch">{c.id==="BRT"?"Brent":c.id==="HH"?"Henry Hub":c.id}</th>)}
            </tr></thead>
            <tbody>
              {[
                {lbl:"7d H",fn:s=>hiFn(s)},
                {lbl:"7d L",fn:s=>loFn(s)},
                {lbl:"7d ø",fn:s=>maFn(s,7)},
                {lbl:"7d Δ",fn:s=>({...dFn(s),col:true})},
              ].map(row => (
                <tr key={row.lbl}>
                  <td className="tlb">{row.lbl}</td>
                  {COMMS.map(c => {
                    const s = prices[c.id]?.series??[FB[c.yf]??70];
                    const res = row.fn(s);
                    if (res?.col) {
                      const up = parseFloat(res.pct)>=0;
                      return <td key={c.id} className={up?"tvu":"tvd"}>{up?"+":""}{res.pct}%</td>;
                    }
                    return <td key={c.id} className="tv">{c.unit}{res}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTTOM 3-COL */}
        <div className="bot">
          {/* SHIPPING */}
          <div className="shipp">
            <div className="ph"><span className="pi">🚢</span><span className="pt">Shipping Route Risk</span></div>
            {SHIPS.map((r,i) => {
              const bc = r.score>75?"#e8384a":r.score>55?"#f0a828":"#22d47a";
              const rc = r.risk==="CRITICAL"?"rC":r.risk==="HIGH"?"rH":r.risk==="ELEVATED"?"rE":"rL";
              return (
                <div className="srow" key={i}>
                  <div><div className="sn">{r.name}</div><div className="sd">{r.desc}</div></div>
                  <div className="sr">
                    <span className={`rb ${rc}`}>{r.risk}</span>
                    <div className="rbar"><div className="rfill" style={{width:`${r.score}%`,background:bc}}/></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FX & MACRO */}
          <div className="fxp">
            <div className="ph"><span className="pi">💱</span><span className="pt">FX &amp; Macro</span></div>
            {fxVals.map((f,i) => {
              const up=f.chg>=0, dv=fxDisp(f);
              const isVix=f.type==="vix", isDxy=f.type==="dxy";
              return (
                <div key={i}>
                  {f.pair==="VIX" && <div className="fxdiv"/>}
                  <div className="fxrow">
                    <div>
                      <div className="fx-pair" style={isVix?{color:"#f0a828"}:isDxy?{color:"#3aaaf0"}:{}}>{f.pair}</div>
                      <div className="fx-note">{f.note}</div>
                      <span className={`lbadge ${f.live?"live-b":"ref-b"}`} style={{marginTop:3,display:"inline-block"}}>{f.live?"● LIVE":"◌ REF"}</span>
                    </div>
                    <Spark series={f.series??[f.val]} color={f.live?f.color:"#2a3f55"} W={80} H={26} cls="fx-sp"/>
                    <div className="fx-right">
                      <div className="fx-val" style={isVix&&f.val>20?{color:"#f0a828"}:isDxy?{color:"#3aaaf0"}:{}}>{dv}</div>
                      <div className={`fx-pct ${up?"up":"dn"}`}>{up?"▲":"▼"}{Math.abs(f.pct).toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* NEWS */}
          <div className="newsp">
            <div className="ph"><span className="pi">🌍</span><span className="pt">Middle East News</span></div>
            <div className="ntabs">
              {[{k:"all",l:"All",c:"",n:NEWS.length},{k:"energy",l:"🟡 Energy",c:"et",n:NEWS.filter(x=>x.cat==="ENERGY").length},{k:"military",l:"🔴 Military",c:"mt",n:NEWS.filter(x=>x.cat==="MILITARY").length},{k:"diplomacy",l:"🟢 Diplomacy",c:"dt",n:NEWS.filter(x=>x.cat==="DIPLOMACY").length}].map(t=>(
                <span key={t.k} className={`ntab ${t.c} ${newsTab===t.k?"on":""}`} onClick={()=>setNewsTab(t.k)}>
                  {t.l} <span style={{opacity:.6,fontSize:8}}>({t.n})</span>
                </span>
              ))}
            </div>
            <div className="ngrid">
              {[nl,nr].map((col,ci)=>(
                <div className="ncol" key={ci}>
                  {col.map((n,i)=>(
                    <a key={i} className="ni" href={n.url} target="_blank" rel="noopener noreferrer">
                      <div className="nmeta">
                        <span className={`nsrc ${n.sc}`}>{n.src}</span>
                        <span className={`ncat ${n.cc}`}>{n.cat}</span>
                        <span className="ndate">{n.date}</span>
                      </div>
                      <div className="nhl">{n.hl}<span className="ei">↗</span></div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HORMUZ MAP — full width */}
        <HormuzMap/>

      </div>
    </div>
  );
}