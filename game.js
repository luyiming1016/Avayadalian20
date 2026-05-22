/* ============================================================
 *  Avaya Dalian 20 Years — Backbone 传奇
 *  game.js  ·  状态机 + 渲染 + 存档 + 终章路由 + 结局判定
 * ============================================================ */

/* ---------- 全局状态 ---------- */
const SAVE_KEY = "avara_backbone_save_v1";

const DEFAULT_STATE = () => ({
  player: {
    name:"李墨", enName:"Mo Li", gender:"M",
    hometown:"dalian", edu:"normal", major:"voice",
    extrovert:0, decisive:0, live:"share",
    tech:35, comm:40, stam:65, eq:40, en:50, res:40, hp:80, money:12, family:50,
    grade:"Contractor",
    legend:0, father:null, caseScore:0,
    spouseName:null, spouseType:null,
    flags:{}
  },
  rel:{ cruce:60, david:50, laok:55, frank:0, eric:40, spouse:0 },
  site:{ headcount:100 },
  yearIdx:0, eventIdx:0,
  finaleIdx:0,
  epiIdx:0,
  caseSeed:0,
  case:{ monthly:{}, lowStreak:0 },
  log:[],
  ending:null,
  // 多周目可用
  achievements:[]
});

let S = DEFAULT_STATE();

/* ---------- 屏幕切换 ---------- */
function goto(id){
  document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
  const t = document.getElementById(id);
  if (t) t.classList.add("active");
  window.scrollTo(0,0);
}

/* ---------- 选项 button 行为（角色创建那一屏） ---------- */
document.querySelectorAll(".opt-group").forEach(g => {
  g.addEventListener("click", e => {
    if (!e.target.classList.contains("opt")) return;
    g.querySelectorAll(".opt").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
  });
});
const extInput = document.getElementById("char-ext");
const decInput = document.getElementById("char-dec");
if (extInput) extInput.addEventListener("input", () => document.getElementById("trait-ext").textContent = extInput.value);
if (decInput) decInput.addEventListener("input", () => document.getElementById("trait-dec").textContent = decInput.value);

/* ---------- 工具函数 ---------- */
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function toast(msg, ms=2200){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.add("hidden"), ms);
}
function showModal(title, body){
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").innerHTML = body;
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal(){ document.getElementById("modal").classList.add("hidden"); }

/* ---------- 角色创建确认 ---------- */
function confirmCreate(){
  S = DEFAULT_STATE();
  const get = (id, fallback="") => (document.getElementById(id) && document.getElementById(id).value) || fallback;
  const getActive = (groupId) => {
    const g = document.getElementById(groupId);
    if (!g) return null;
    const a = g.querySelector(".opt.active");
    return a ? a.dataset.v : null;
  };
  S.player.name = get("char-name", "李墨").trim() || "李墨";
  S.player.enName = get("char-en", "Mo Li").trim() || "Mo Li";
  S.player.gender = getActive("opt-gender") || "M";
  S.player.hometown = getActive("opt-hometown") || "dalian";
  S.player.edu = getActive("opt-edu") || "normal";
  S.player.major = getActive("opt-major") || "voice";
  S.player.live = getActive("opt-live") || "share";
  S.player.extrovert = parseInt(get("char-ext","0"));
  S.player.decisive = parseInt(get("char-dec","0"));

  // 学历微调起手属性
  if (S.player.edu === "985") { S.player.en += 8; S.player.money += 3; }
  else if (S.player.edu === "haigui") { S.player.en += 15; S.player.money -= 2; }
  // 居住起点
  if (S.player.live === "solo") { S.player.money -= 3; S.player.stam += 5; }
  else if (S.player.live === "relative") { S.player.money += 3; S.player.eq -= 2; }

  S.caseSeed = Date.now() % 1000000;
  if (CONTENT.injectMonthlyCases) CONTENT.injectMonthlyCases(S.caseSeed);
  startGame();
}

/* ---------- 开始游戏（推进到第一年第一事件） ---------- */
function startGame(){
  if (CONTENT.injectMonthlyCases) CONTENT.injectMonthlyCases(S.caseSeed || 1);
  S.yearIdx = 0; S.eventIdx = 0;
  S.site.headcount = CONTENT.years[0].siteHeadcount;
  goto("screen-game");
  renderTopBar();
  renderSidebar();
  renderEvent();
}

/* ---------- 顶部状态条 ---------- */
function renderTopBar(){
  const yearData = CONTENT.years[S.yearIdx];
  const yr = yearData?.year || 2018;
  const evForTime = yearData?.events?.[S.eventIdx];
  const month = evForTime?.month;
  document.getElementById("ui-date").textContent = month ? `${yr}-${String(month).padStart(2, "0")}` : `${yr}`;
  document.getElementById("ui-season").textContent = month >= 3 && month <= 5 ? "🌸 春"
    : month >= 6 && month <= 8 ? "☀ 夏"
    : month >= 9 && month <= 11 ? "🍂 秋"
    : "❄ 冬";
  const uiG = document.getElementById("ui-grade");
  if (uiG) uiG.textContent = S.player.grade;
  const uiP = document.getElementById("ui-player");
  if (uiP) uiP.textContent = `${S.player.name}${S.player.enName ? " · " + S.player.enName : ""}`;

  const p = S.player;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("ui-tech", p.tech); set("ui-comm", p.comm); set("ui-stam", clamp(p.stam,0,100));
  set("ui-eq", p.eq); set("ui-en", p.en); set("ui-res", p.res);
  set("ui-hp", clamp(p.hp,0,100)); set("ui-money", Math.round(p.money));
  set("ui-case", p.caseScore || 0);
}

/* ---------- 左侧栏 ---------- */
function renderPlayerCard(){
  const el = document.getElementById("player-card");
  if (!el || !S || !S.player) return;
  const p = S.player;

  const genderMap   = { M:"男", F:"女", N:"不愿透露" };
  const eduMap      = { "985":"985 / 211 本科", normal:"普通本科", haigui:"海归硕士" };
  const majorMap    = {
    voice:"Voice / Aura Core",
    sip:"Session & Routing",
    cc:"Contact Center",
    cloud:"Cloud / AXP",
    endpoint:"Endpoints & Devices"
  };
  const hometownMap = { dalian:"大连本地", northeast:"东北其他", south:"关内" };
  const liveMap     = { share:"与同事合租", solo:"独居小公寓", relative:"借住亲戚家" };
  const spouseTypeMap = {
    wife:"已婚", husband:"已婚", spouse:"已婚",
    girlfriend:"恋爱中", boyfriend:"恋爱中", partner:"恋爱中",
    fiancee:"已订婚", fiance:"已订婚"
  };

  let relText, relClass;
  if (p.spouseName){
    const label = spouseTypeMap[p.spouseType] || "已婚";
    relText = `${label} · ${_slEscape(p.spouseName)} ★`;
    relClass = "pc-rel pc-rel-on";
  } else {
    relText = "单身";
    relClass = "pc-rel pc-rel-off";
  }

  const avatar = p.gender === "F" ? "👩" : p.gender === "N" ? "🧑" : "👨";

  el.innerHTML = `
    <div class="pc-head">Engineer Profile</div>
    <div class="pc-body">
      <div class="pc-top">
        <div class="pc-avatar">${avatar}</div>
        <div class="pc-id">
          <div class="pc-name">${_slEscape(p.name)}<span class="pc-en">${_slEscape(p.enName || "")}</span></div>
          <div class="pc-grade"><span class="pc-grade-lbl">职级</span><b>${_slEscape(p.grade || "—")}</b></div>
        </div>
      </div>
      <dl class="pc-fields">
        <dt>性别</dt><dd>${genderMap[p.gender] || "—"}</dd>
        <dt>主修</dt><dd>${majorMap[p.major] || "—"}</dd>
        <dt>学历</dt><dd>${eduMap[p.edu] || "—"}</dd>
        <dt>籍贯</dt><dd>${hometownMap[p.hometown] || "—"}</dd>
        <dt>居住</dt><dd>${liveMap[p.live] || "—"}</dd>
        <dt>感情</dt><dd class="${relClass}">${relText}</dd>
      </dl>
    </div>
  `;
}

function renderSidebar(){
  renderPlayerCard();
  document.getElementById("ui-site").textContent = S.site.headcount;
  document.getElementById("ui-legend").textContent = S.player.legend;
  document.getElementById("ui-father").textContent = (S.player.father == null ? "—" : S.player.father);

  const updRel = (id, label, val, max=100, who=null) => {
    const el = document.getElementById(id);
    if (!el) return;
    const pct = clamp(Math.round(val), 0, max);
    let nameSpan = label;
    if (id === "rel-spouse" && S.player.spouseName) {
      nameSpan = `${S.player.spouseName} ★`;
    }
    el.innerHTML = `<span>${nameSpan}</span><div class="bar"><i style="width:${pct}%"></i></div><b>${pct}</b>`;
  };
  updRel("rel-cruce","Cruce ★", S.rel.cruce);
  updRel("rel-david","David（Manager）", S.rel.david);
  updRel("rel-laok","老 K", S.rel.laok);
  updRel("rel-spouse","—（伴侣）", S.rel.spouse);

  // 日志（仅显示最近 12 条）
  const lg = document.getElementById("log-list");
  lg.innerHTML = "";
  S.log.slice(-12).reverse().forEach(line => {
    const li = document.createElement("li");
    li.innerHTML = line;
    lg.appendChild(li);
  });
}

/* ---------- 把 body 数组渲染成 HTML ---------- */
function renderBody(body){
  return body.map(b => {
    switch (b.type){
      case "narr": return `<p class="narr">${b.text}</p>`;
      case "p":    return `<p>${b.text}</p>`;
      case "dialog": return `<p class="dialog"><b>${b.who}：</b>${b.text}</p>`;
      case "quote": return `<blockquote class="quote">${b.text}</blockquote>`;
      case "mail": return `<div class="ui-mail">
          <div class="m-from">From: ${b.from}</div>
          <div class="m-sub">Subject: ${b.sub}</div>
          <div class="m-body">${b.body}</div>
        </div>`;
      case "im": return `<div class="ui-im">
          <div class="m-who">${b.who}</div>
          <div>${b.text}</div>
        </div>`;
      default: return `<p>${b.text||""}</p>`;
    }
  }).join("");
}

function renderCaseTitle(ev){
  const severity = (ev.severity || "NBI").toLowerCase();
  return `
    <span class="case-title-line">
      <span class="case-severity severity-${severity}">${ev.severity || "NBI"}</span>
      <span class="case-number">${ev.caseNo || ev.caseId || "1-UNKNOWN"}</span>
    </span>
    <span class="case-title-name">${ev.product || "OCD Case"} · ${ev.title}</span>
  `;
}

/* ---------- 渲染当前事件 ---------- */
function renderEvent(){
  const year = CONTENT.years[S.yearIdx];
  if (!year) return finaleEnter();
  const ev = year.events[S.eventIdx];
  if (!ev) return endOfYear();

  const titleEl = document.getElementById("event-title");
  if (ev.isCase) titleEl.innerHTML = renderCaseTitle(ev);
  else titleEl.textContent = ev.title;
  document.getElementById("event-meta").textContent =
    `${year.year}${ev.month ? `-${String(ev.month).padStart(2, "0")}` : ""} · 第${[ "一","二","三","四","五","六","七","八","九" ][S.yearIdx]||""}年 · ${ev.beat || "日常"}`;
  document.getElementById("event-body").innerHTML = renderBody(ev.body);

  // 场景图
  const sb = document.getElementById("scene-bg");
  sb.dataset.scene = ev.scene || "office";
  document.querySelector(".scene-box").dataset.emoji = ev.emoji || "🏙";
  document.getElementById("scene-title").textContent = ev.title;
  document.getElementById("scene-sub").textContent = `${year.year} · ${year.title}`;

  // 选项
  const cc = document.getElementById("event-choices");
  cc.innerHTML = "";
  (ev.choices || []).forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    const tag = ch.tag ? `<span class="ch-tag ${ch.tag==='danger'?'danger':ch.tag==='cruce'?'cruce':ch.tag==='legend'?'legend':''}">${tagText(ch.tag)}</span>` : "";
    btn.innerHTML = `${tag}${ch.label}${ch.sub ? `<span class="ch-sub">${ch.sub}</span>` : ""}`;
    btn.onclick = () => onChoice(ev, ch);
    cc.appendChild(btn);
  });

  // 无选项事件（演出型），加一个"继续"按钮
  if (!ev.choices || ev.choices.length === 0){
    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.textContent = "继续 →";
    btn.onclick = () => { S.eventIdx++; renderEvent(); };
    cc.appendChild(btn);
  }
}

function tagText(t){
  return {EQ:"EQ", danger:"风险", cruce:"Cruce", legend:"传奇"}[t] || t;
}

/* ---------- 应用选项效果 ---------- */
function applyEffects(eff, logText){
  if (!eff) return;
  const stats = ["tech","comm","stam","eq","en","res","hp","money","family","legend"];
  stats.forEach(k => { if (typeof eff[k] === "number") S.player[k] = clamp((S.player[k]||0) + eff[k], -50, 200); });
  if (typeof eff.father === "number"){
    S.player.father = clamp((S.player.father||0) + eff.father, 0, 200);
  }
  ["cruce","david","laok","frank","eric","spouse"].forEach(k => {
    if (typeof eff[k] === "number") S.rel[k] = clamp((S.rel[k]||0) + eff[k], 0, 100);
  });
  if (eff.flag){
    if (eff.flag.set)  S.player.flags[eff.flag.set]  = true;
    if (eff.flag.set2) S.player.flags[eff.flag.set2] = true;
  }
  if (logText) S.log.push(logText);
}

function recordCaseResult(ev, score){
  if (!ev || !ev.isCase) return false;
  if (!S.case) S.case = { monthly:{}, lowStreak:0 };
  if (!S.case.monthly) S.case.monthly = {};
  const year = CONTENT.years[S.yearIdx]?.year || 2019;
  const key = `${year}-${String(ev.month || 1).padStart(2, "0")}`;
  const row = S.case.monthly[key] || {score:0, count:0};
  row.score += score;
  row.count += 1;
  S.case.monthly[key] = row;
  S.player.caseScore = (S.player.caseScore || 0) + score;

  if (row.count >= 3){
    if (row.score < 2) S.case.lowStreak = (S.case.lowStreak || 0) + 1;
    else S.case.lowStreak = 0;

    S.log.push(`${key} · OCD 月度 case 得分 ${row.score}/6 · 连续低分 ${S.case.lowStreak || 0} 月`);
    if ((S.case.lowStreak || 0) >= 3){
      S.ending = "unqualified";
      renderEnding("unqualified");
      autoSave();
      return true;
    }
  }
  return false;
}

/* ---------- 选项点击 ---------- */
function onChoice(ev, ch){
  // 处理 spouse name 设定
  if (ch.effects && ch.effects.flag && ch.effects.flag.set && ch.effects.flag.set.indexOf("spouse_") === 0){
    const map = { spouse_sarah:["Sarah","同公司 SE"], spouse_xiake:["夏可","自由设计师"],
                  spouse_linyi:["林一","医院护士"], spouse_zhouting:["周婷","事业单位"] };
    const tag = ch.effects.flag.set;
    if (map[tag]){
      S.player.spouseName = map[tag][0];
      S.player.spouseType = map[tag][1];
    }
  }
  applyEffects(ch.effects, ch.log);
  if (recordCaseResult(ev, ch.effects?.caseScore || 0)) return;
  toast(ch.log || "已记录这次选择");
  S.eventIdx++;
  renderTopBar(); renderSidebar();
  // 等动画一下再渲下一事件
  setTimeout(() => renderEvent(), 250);
  // 每次自动存档
  autoSave();
}

/* ---------- 年末：进入年度回顾 ---------- */
function yearlyCaseScore(year){
  if (!S.case || !S.case.monthly) return null;
  let score = 0, months = 0;
  Object.keys(S.case.monthly).forEach(key => {
    if (key.indexOf(`${year}-`) === 0){
      score += S.case.monthly[key].score || 0;
      months += 1;
    }
  });
  return months ? {score, months} : null;
}

function endOfYear(){
  const year = CONTENT.years[S.yearIdx];
  // 更新年末职级（按 review.grade）
  const caseYear = yearlyCaseScore(year.year);
  if (year.review && year.review.grade){
    const wantsPromotion = year.review.grade !== S.player.grade;
    if (wantsPromotion && caseYear && caseYear.score < 12){
      S.log.push(`${year.year} · case 年度得分 ${caseYear.score}，晋升证据不足`);
    } else {
      S.player.grade = year.review.grade;
      if (caseYear && caseYear.score >= 36){
        S.player.legend += 3;
        S.rel.david = clamp((S.rel.david || 0) + 3, 0, 100);
        S.log.push(`${year.year} · case 年度高分 ${caseYear.score}，晋升材料更扎实`);
      }
    }
  }
  // 站点人数：用下一年的 siteHeadcount，制造"每年都少一点"
  const next = CONTENT.years[S.yearIdx + 1];
  if (next){ S.site.headcount = next.siteHeadcount; }

  // 渲染年度回顾
  document.getElementById("yr-title").textContent = `${year.year} ｜《${year.title}》`;
  document.getElementById("yr-sub").textContent = year.subtitle || "";
  document.getElementById("yr-quote").textContent = year.review?.quote || "";
  const grid = document.getElementById("yr-grid");
  grid.innerHTML = `
    <div>本年 Site 人数<b>${year.siteHeadcount}</b></div>
    <div>当前职级<b>${S.player.grade}</b></div>
    <div>传奇分<b>${S.player.legend}</b></div>
    <div>Case 分<b>${S.player.caseScore || 0}</b></div>
    <div>体力<b>${clamp(S.player.stam,0,100)}</b></div>
    <div>家庭关系<b>${S.player.family}</b></div>
    <div>Cruce<b>${S.rel.cruce}</b></div>
    <div>${S.player.spouseName ? "伴侣（" + S.player.spouseName + "）" : "伴侣"}<b>${S.rel.spouse}</b></div>
  `;
  goto("screen-yearreview");
  autoSave();
}

function continueYear(){
  S.yearIdx++;
  S.eventIdx = 0;
  if (S.yearIdx >= CONTENT.years.length){
    return finaleEnter();
  }
  goto("screen-game");
  renderTopBar(); renderSidebar(); renderEvent();
}

/* ---------- 终章入口 ---------- */
function finaleEnter(){
  S.finaleIdx = 0;
  S.site.headcount = CONTENT.finale.siteHeadcount;
  // 直接复用游戏屏 + 把事件源切换到 finale.beats
  goto("screen-game");
  renderTopBar(); renderSidebar();
  renderFinaleBeat();
}

function renderFinaleBeat(){
  const beat = CONTENT.finale.beats[S.finaleIdx];
  if (!beat){ return finaleClimax(); }

  document.getElementById("event-title").innerHTML =
    `<span class="finale-tick">${beat.tick}</span> &nbsp; ${beat.title}`;
  document.getElementById("event-meta").textContent = `${CONTENT.finale.title}`;
  document.getElementById("event-body").innerHTML = renderBody(beat.body);

  const sb = document.getElementById("scene-bg");
  sb.dataset.scene = beat.scene || "office";
  document.querySelector(".scene-box").dataset.emoji = beat.emoji || "⏳";
  document.getElementById("scene-title").textContent = beat.title;
  document.getElementById("scene-sub").textContent = "2026 · 最长的一天";

  const cc = document.getElementById("event-choices");
  cc.innerHTML = "";
  if (beat.choices && beat.choices.length){
    beat.choices.forEach(ch => {
      const btn = document.createElement("button");
      btn.className = "choice";
      const tag = ch.tag ? `<span class="ch-tag ${ch.tag==='danger'?'danger':ch.tag==='cruce'?'cruce':ch.tag==='legend'?'legend':''}">${tagText(ch.tag)}</span>` : "";
      btn.innerHTML = `${tag}${ch.label}${ch.sub ? `<span class="ch-sub">${ch.sub}</span>` : ""}`;
      btn.onclick = () => {
        applyEffects(ch.effects, ch.log);
        toast(ch.log || "");
        S.finaleIdx++;
        renderTopBar(); renderSidebar();
        setTimeout(() => renderFinaleBeat(), 250);
        autoSave();
      };
      cc.appendChild(btn);
    });
  } else {
    // 演出型 beat（fin-5 之类），自动进下一段
    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.textContent = "屏幕分屏 →";
    btn.onclick = () => { S.finaleIdx++; renderFinaleBeat(); };
    cc.appendChild(btn);
  }
}

/* ---------- 终章高潮：进入分屏画面 ---------- */
function finaleClimax(){
  // 填入分屏数据
  const date = "2026-10-21 15:00";
  document.getElementById("fin-date").textContent = date;
  document.getElementById("fin-name").textContent = S.player.enName || S.player.name;

  // N+X 计算
  const baseX = 1;
  let X = baseX + Math.floor(S.player.legend / 15) + Math.floor(S.rel.david / 30);
  if (S.player.flags.negotiated_X) X += 1;
  if (S.player.flags.hr_dignified) X += 1;
  X = clamp(X, 1, 6);
  document.getElementById("fin-pkg").textContent = `N + ${X}`;
  document.getElementById("fin-years").textContent = "8";

  // 婴儿性别 = 玩家性别相反；不愿透露 = 随机
  const g = S.player.gender;
  let babyText;
  if (g === "M") babyText = `"恭喜，是个 <b>女孩</b>。"`;
  else if (g === "F") babyText = `"恭喜，是个 <b>男孩</b>。"`;
  else babyText = `"恭喜，<b>母女平安 / 母子平安</b>。"`;
  document.getElementById("fin-baby").innerHTML = babyText;
  document.getElementById("fin-time").textContent = "2026-10-21 15:00:07";

  // 独白
  let mono = "在我失去一个身份的同一秒，我成为了另一个身份。";
  if (S.player.flags.mono_B) mono = "Avaya 给了我 8 年，今天她还了我一个人。";
  if (S.player.flags.mono_C) mono = "原来传奇不是没有摔倒，是摔倒的时候，怀里有东西要护住。";
  document.getElementById("fin-mono").textContent = mono;

  goto("screen-finale");
  autoSave();
}

/* ---------- 尾声章 ---------- */
function enterEpilogue(){
  S.epiIdx = 0;
  goto("screen-epilogue");
  renderEpiStep();
}

function renderEpiStep(){
  const step = CONTENT.epilogue.steps[S.epiIdx];
  if (!step) return computeEnding();

  document.getElementById("epi-narr").textContent =
    S.epiIdx === 0 ? CONTENT.epilogue.intro : "回家路上，红灯一个接一个。TA 在副驾安静地拍着孩子。";
  document.getElementById("epi-q").textContent = step.q;

  const cc = document.getElementById("epi-choices");
  cc.innerHTML = "";
  step.choices.forEach(ch => {
    const btn = document.createElement("button");
    btn.className = "choice";
    const tag = ch.tag ? `<span class="ch-tag ${ch.tag==='danger'?'danger':ch.tag==='cruce'?'cruce':ch.tag==='legend'?'legend':''}">${tagText(ch.tag)}</span>` : "";
    btn.innerHTML = `${tag}${ch.label}`;
    btn.onclick = () => {
      applyEffects(ch.effects, ch.log);
      S.epiIdx++;
      renderEpiStep();
      autoSave();
    };
    cc.appendChild(btn);
  });
}

/* ---------- 结局判定 ---------- */
function computeEnding(){
  const f = S.player.flags;
  const money = S.player.money;
  const family = S.player.family;
  const legend = S.player.legend;
  const father = S.player.father || 0;
  const spouseRel = S.rel.spouse;

  let endKey = "balance";
  let badPossible = false;

  // 隐藏「Backbone 传奇」条件
  const legendaryCond =
    f.mono_C &&
    f.laok_referred && f.mentor_xiaozhao && f.xiaozhao_succeed &&
    legend >= 70 &&
    spouseRel >= 70;

  // 一般结局
  if (f.choice_cloud && money >= -5 && spouseRel >= 50) endKey = "cloud";
  else if (f.choice_startup && legend >= 40 && money >= -10) endKey = "startup";
  else if (f.choice_transfer) endKey = "transfer";
  else if (f.choice_father && father >= 40 && spouseRel >= 60) endKey = "father";
  else if (f.choice_gap) endKey = "balance";
  else if (f.choice_relocate){ endKey = "drift"; badPossible = true; }
  else endKey = "balance";

  // 黯然落幕优先级（健康崩 + 婚姻破裂）
  if (S.player.hp <= 30 && spouseRel <= 30) endKey = "fade";
  // 漂泊远行强条件
  if (f.choice_relocate && (money < -15 || spouseRel < 40)) endKey = "drift";

  if (legendaryCond) endKey = "legendary";

  S.ending = endKey;
  renderEnding(endKey);
}

function renderEnding(key){
  const e = CONTENT.endings[key];
  document.getElementById("end-tag").textContent = e.hidden ? "★ 隐藏结局解锁" : (e.bad ? "结局解锁（BAD）" : "结局解锁");
  document.getElementById("end-name").textContent = e.name;
  document.getElementById("end-narr").innerHTML = `${e.narr}<br><br><i style="color:#8892b0">${e.threeYearsLater}</i>`;

  const stats = document.getElementById("end-stats");
  const p = S.player;
  stats.innerHTML = `
    <div>传奇分<b>${p.legend}</b></div>
    <div>Case 分<b>${p.caseScore || 0}</b></div>
    <div>父亲分<b>${p.father==null?"—":p.father}</b></div>
    <div>婚姻分<b>${S.rel.spouse}</b></div>
  `;

  // 解锁成就
  const ach = collectAchievements();
  S.achievements = ach;

  goto("screen-ending");
  autoSave();
}

function collectAchievements(){
  const f = S.player.flags || {};
  const list = [];
  // 主线节点保底
  list.push("工牌之日");
  list.push("最长的一天");
  if (S.player.flags.ach_sameSecond) list.push("同一秒");
  if (S.player.flags.ach_anotherBackbone) list.push("另一种 Backbone");
  if (S.player.flags.ach_sheKnowsFirst) list.push("她先知道");
  if (S.player.flags.parents_hide) list.push("父辈的沉默");
  if (S.ending === "legendary") list.push("★ 传奇收尾");
  if (f.laok_referred) list.push("老 K 的内推");
  if (f.cruce_warning_heard) list.push("机场那一句听懂了");
  if (f.xiaozhao_succeed) list.push("师徒接班");
  if (f.farewell_perfect) list.push("谢幕演出");
  if (S.ending === "unqualified") list.push("不合格工程师");
  if (S.player.legend >= 70) list.push("Backbone 影响力");
  return list;
}

function showAchievements(){
  const list = S.achievements || [];
  const html = list.length ? "<ul style='text-align:left;line-height:2'>" + list.map(a => "✦ " + a).join("<br>") + "</ul>" : "（暂无）";
  showModal("已解锁成就", html);
}

/* ---------- 存档系统 ---------- */
const SLOTS_KEY = "avara_backbone_slots_v1";
const SLOT_COUNT = 10;
let _slMode = "save";       // "save" | "load"
let _slReturnTo = null;     // 关闭存档页时返回哪个 screen id

function autoSave(){
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(buildSnapshotState())); } catch(e){}
}

function buildSnapshotState(){
  // 简单深拷贝，避免之后修改 S 影响存档
  try { return JSON.parse(JSON.stringify(S)); } catch(e){ return S; }
}

function buildSlotMeta(){
  const yearData = (typeof CONTENT !== "undefined" && CONTENT.years) ? CONTENT.years[S.yearIdx] : null;
  const yr = yearData?.year || 2018;
  const ev = yearData?.events?.[S.eventIdx];
  const month = ev?.month;
  const gameDate = month ? `${yr}-${String(month).padStart(2,"0")}` : `${yr}`;
  let phase = "进行中";
  if (S.ending) phase = "已结局：" + S.ending;
  else if (S.epiIdx > 0) phase = "尾声章";
  else if (S.finaleIdx > 0 || (CONTENT.years && S.yearIdx >= CONTENT.years.length)) phase = "终章";
  return {
    savedAt: new Date().toISOString(),
    gameDate,
    playerName: S.player?.name || "—",
    playerEn: S.player?.enName || "",
    grade: S.player?.grade || "—",
    legend: S.player?.legend || 0,
    money: Math.round(S.player?.money || 0),
    phase,
  };
}

function readSlots(){
  try {
    const raw = localStorage.getItem(SLOTS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    while (arr.length < SLOT_COUNT) arr.push(null);
    return arr.slice(0, SLOT_COUNT);
  } catch(e){ return new Array(SLOT_COUNT).fill(null); }
}

function writeSlots(arr){
  try { localStorage.setItem(SLOTS_KEY, JSON.stringify(arr)); } catch(e){}
}

function readAutoSlot(){
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const st = JSON.parse(raw);
    return st;
  } catch(e){ return null; }
}

function autoSlotMetaFromState(st){
  const yearData = (typeof CONTENT !== "undefined" && CONTENT.years) ? CONTENT.years[st.yearIdx] : null;
  const yr = yearData?.year || 2018;
  const ev = yearData?.events?.[st.eventIdx];
  const month = ev?.month;
  return {
    gameDate: month ? `${yr}-${String(month).padStart(2,"0")}` : `${yr}`,
    playerName: st.player?.name || "—",
    playerEn: st.player?.enName || "",
    grade: st.player?.grade || "—",
    legend: st.player?.legend || 0,
    money: Math.round(st.player?.money || 0),
  };
}

function _slEscape(s){
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function _slRealTime(iso){
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    const hh = String(d.getHours()).padStart(2,"0");
    const mi = String(d.getMinutes()).padStart(2,"0");
    return `${y}-${m}-${dd} ${hh}:${mi}`;
  } catch(e){ return "—"; }
}

function _activeScreenId(){
  const el = document.querySelector(".screen.active");
  return el ? el.id : null;
}

function _hasInGameState(){
  // 角色已创建且未进入终章/结局 → 视为"游戏中"
  return !!(S && S.player && S.player.name && !S.ending);
}

/* 打开存档/读档屏 */
function openSaveScreen(mode){
  _slMode = mode === "load" ? "load" : "save";
  _slReturnTo = _activeScreenId() || "screen-title";
  goto("screen-saveload");
  renderSlotList();
}
function closeSaveScreen(){
  goto(_slReturnTo || "screen-title");
}

function saveGame(){
  if (!_hasInGameState()){ toast("当前没有可保存的游戏进度"); return; }
  openSaveScreen("save");
}
function loadGame(){ openSaveScreen("load"); }

function renderSlotList(){
  const isSave = _slMode === "save";
  document.getElementById("sl-title").textContent = isSave ? "存档管理 · 保存进度" : "存档管理 · 读取进度";
  document.getElementById("sl-sub").textContent = isSave
    ? "选择一个存档位保存当前进度（已有存档将被覆盖）"
    : "选择一个存档位读取游戏进度";

  const wrap = document.getElementById("slot-list");
  const slots = readSlots();
  let html = "";

  // 自动存档卡（始终在最上）
  const auto = readAutoSlot();
  html += renderAutoCardHtml(auto, isSave);

  // 10 个手动存档位
  slots.forEach((slot, i) => { html += renderSlotCardHtml(slot, i, isSave); });

  wrap.innerHTML = html;
}

function renderAutoCardHtml(state, isSave){
  if (!state){
    return `
      <article class="slot-card slot-auto slot-empty">
        <header class="slot-head">
          <span class="slot-no">AUTO</span>
          <span class="slot-tag">自动存档</span>
        </header>
        <div class="slot-body"><span class="slot-empty-tag">— 暂无自动存档 —</span></div>
        <footer class="slot-actions"></footer>
      </article>`;
  }
  const meta = autoSlotMetaFromState(state);
  const acts = isSave
    ? `<span class="slot-note">每次事件结束自动写入，此位不可手动保存</span>`
    : `<button class="btn-primary" onclick="doLoadAuto()">读取自动存档</button>`;
  return `
    <article class="slot-card slot-auto">
      <header class="slot-head">
        <span class="slot-no">AUTO</span>
        <span class="slot-tag">自动存档</span>
      </header>
      <div class="slot-body">
        <div class="slot-name">${_slEscape(meta.playerName)} <span class="slot-en">${_slEscape(meta.playerEn)}</span></div>
        <dl class="slot-meta">
          <dt>游戏时间</dt><dd>${_slEscape(meta.gameDate)}</dd>
          <dt>职级</dt><dd>${_slEscape(meta.grade)}</dd>
          <dt>传奇分</dt><dd>${_slEscape(meta.legend)}</dd>
          <dt>金钱</dt><dd>¥${_slEscape(meta.money)}w</dd>
        </dl>
      </div>
      <footer class="slot-actions">${acts}</footer>
    </article>`;
}

function renderSlotCardHtml(slot, idx, isSave){
  const no = String(idx+1).padStart(2,"0");
  if (!slot){
    return `
      <article class="slot-card slot-empty">
        <header class="slot-head">
          <span class="slot-no">SLOT ${no}</span>
          <span class="slot-tag">空</span>
        </header>
        <div class="slot-body"><span class="slot-empty-tag">— 空存档位 —</span></div>
        <footer class="slot-actions">
          ${isSave
            ? `<button class="btn-primary" onclick="doSaveToSlot(${idx})">存档到此位</button>`
            : `<button class="btn-ghost" disabled>无可读档</button>`}
        </footer>
      </article>`;
  }
  const m = slot.meta || {};
  const realTime = _slRealTime(m.savedAt);
  const acts = isSave
    ? `<button class="btn-primary" onclick="doSaveToSlot(${idx})">覆盖此存档</button>
       <button class="btn-ghost" onclick="doDeleteSlot(${idx})">删除</button>`
    : `<button class="btn-primary" onclick="doLoadFromSlot(${idx})">读取</button>
       <button class="btn-ghost" onclick="doDeleteSlot(${idx})">删除</button>`;
  return `
    <article class="slot-card">
      <header class="slot-head">
        <span class="slot-no">SLOT ${no}</span>
        <span class="slot-tag">${_slEscape(m.phase || "进行中")}</span>
      </header>
      <div class="slot-body">
        <div class="slot-name">${_slEscape(m.playerName)} <span class="slot-en">${_slEscape(m.playerEn)}</span></div>
        <dl class="slot-meta">
          <dt>游戏时间</dt><dd>${_slEscape(m.gameDate)}</dd>
          <dt>职级</dt><dd>${_slEscape(m.grade)}</dd>
          <dt>传奇分</dt><dd>${_slEscape(m.legend)}</dd>
          <dt>金钱</dt><dd>¥${_slEscape(m.money)}w</dd>
        </dl>
        <div class="slot-real">实际存档时间：<b>${realTime}</b></div>
      </div>
      <footer class="slot-actions">${acts}</footer>
    </article>`;
}

function doSaveToSlot(idx){
  if (!_hasInGameState()){ toast("当前没有可保存的游戏进度"); return; }
  const slots = readSlots();
  const existed = !!slots[idx];
  if (existed && !confirm(`SLOT ${String(idx+1).padStart(2,"0")} 已有存档，覆盖？`)) return;
  slots[idx] = {
    meta: buildSlotMeta(),
    state: buildSnapshotState(),
  };
  writeSlots(slots);
  toast(`已${existed?"覆盖":"保存"}到 SLOT ${String(idx+1).padStart(2,"0")}`);
  renderSlotList();
}

function doDeleteSlot(idx){
  const slots = readSlots();
  if (!slots[idx]) return;
  if (!confirm(`确认删除 SLOT ${String(idx+1).padStart(2,"0")} 存档？`)) return;
  slots[idx] = null;
  writeSlots(slots);
  toast(`已删除 SLOT ${String(idx+1).padStart(2,"0")}`);
  renderSlotList();
}

function doLoadFromSlot(idx){
  const slots = readSlots();
  const slot = slots[idx];
  if (!slot || !slot.state){ toast("此位无存档"); return; }
  _applyLoadedState(slot.state, `SLOT ${String(idx+1).padStart(2,"0")}`);
}

function doLoadAuto(){
  const st = readAutoSlot();
  if (!st){ toast("没有自动存档"); return; }
  _applyLoadedState(st, "自动存档");
}

function _applyLoadedState(state, label){
  try {
    S = JSON.parse(JSON.stringify(state));
    if (!S.case) S.case = { monthly:{}, lowStreak:0 };
    if (CONTENT.injectMonthlyCases) CONTENT.injectMonthlyCases(S.caseSeed || 1);
    // 同步写入 autosave 槽，使后续 autoSave 链路正常
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch(e){}
    // 路由到合适的屏
    if (S.ending){ renderEnding(S.ending); toast(`已读取 ${label}`); return; }
    if (S.epiIdx > 0 || (S.finaleIdx >= CONTENT.finale.beats.length && S.ending == null)){
      goto("screen-epilogue");
      renderEpiStep();
      toast(`已读取 ${label}`);
      return;
    }
    if (S.finaleIdx > 0 || S.yearIdx >= CONTENT.years.length){
      finaleEnter();
      toast(`已读取 ${label}`);
      return;
    }
    goto("screen-game");
    renderTopBar(); renderSidebar(); renderEvent();
    toast(`已读取 ${label}`);
  } catch(e){
    toast("存档损坏，已忽略");
  }
}

/* ---------- 启动 ---------- */
(function init(){
  // 默认显示标题屏（HTML 已经 active），无需额外动作
  // 但要把性格滑块的初值刷出来
  if (document.getElementById("trait-ext")) document.getElementById("trait-ext").textContent = "0";
  if (document.getElementById("trait-dec")) document.getElementById("trait-dec").textContent = "0";
})();
