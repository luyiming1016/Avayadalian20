/* ============================================================
 *  Avaya Dalian 20 Years — Backbone 传奇
 *  game.js  ·  状态机 + 渲染 + 存档 + 终章路由 + 结局判定
 * ============================================================ */

/* ---------- 全局状态 ---------- */
const SAVE_KEY = "avara_backbone_save_v1";

const DEFAULT_STATE = () => ({
  player: {
    name:"李墨", enName:"Mo Li", gender:"M",
    hometown:"dalian", edu:"normal",
    skillCategory:"UC",
    skills:["CM&MG"],
    skillProgress:0,
    extrovert:0, decisive:0, live:"share",
    tech:35, comm:40, stam:65, eq:40, en:50, res:40, hp:80, money:12, family:50,
    grade:"Contractor",
    legend:0, father:null, caseScore:0,
    spouseName:null, spouseType:null,
    avatar:null,
    salary:10000,
    houses:[],         // 多套房产：[{uid, propId, name, district, address, area, rooms, buyYear, totalPrice, payment, loan, renovation, isPrimary}]
    vehicles:[],       // 多辆车：[{uid, vehicleId, title, buyYear, buyMonth, totalPrice, payment, loan, isActive}]
    lastTickKey:null,  // 上次结算的 YYYY-MM
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

/* ---------- Skill 体系 ---------- */
const SKILL_CATALOG = {
  UC: ["CM&MG","SMGR&SM","AADS&AAWG","Endpoint","CS1K","SBC","Messaging"],
  CC: ["AES","WFO","ACR","CMS","ACCCM","Oceana"]
};
const SKILL_DESC = {
  "CM&MG":     "Communication Manager + Media Gateway。Aura 的呼叫处理核心（CM）与硬件中继网关（G430 / G450 / G650），承担拨号计划、特性激活、PSTN / 数字中继接入。",
  "SMGR&SM":   "System Manager + Session Manager。SMGR 是 Aura 的统一 Web 管理控制台，SM 是 SIP 会话路由核心，处理拨号模式、路由策略、注册与多 CM 联邦。",
  "AADS&AAWG": "Aura Device Services + Aura Web Gateway。AADS 为 SIP 终端（96x1 / J 系列 / Workplace）下发配置；AAWG 把 WebRTC / HTTP 客户端桥接到 SIP 网络。",
  "Endpoint":  "Avaya 终端家族：9608/9611/J139/J169/J179 桌机、B179 会议机、Workplace 软客户端。覆盖固件升级、注册、TLS / 证书、音质排障。",
  "CS1K":      "Communication Server 1000（前身 Nortel Meridian / CS1000）。传统 UNIStim / SIP 混合 PBX，APAC 老客户多，常需割接到 Aura。",
  "SBC":       "Avaya Session Border Controller for Enterprise（SBCE）。SIP 网络边界安全，承担 NAT 穿越、SIP 防火墙、消息规范化、Remote Worker 加密接入。",
  "Messaging": "Avaya Aura Messaging / Modular Messaging。语音邮箱与统一消息平台，提供 MWI、TUI、Outlook 集成与归档。",
  "AES":       "Application Enablement Services。把 CM 电话能力以 TSAPI / JTAPI / DMCC 暴露给 CTI 应用（座席桌面、录音、IVR）。",
  "WFO":       "Workforce Optimization 套件。覆盖通话录音、质检评分、座席排班、屏幕监控与培训管理。",
  "ACR":       "Avaya Contact Recorder。面向合规和质检的通话 / 屏幕录音平台，支持 SIPREC、DMCC、Service Observe 多种采集方式。",
  "CMS":       "Call Management System。Contact Center 的实时与历史报表引擎（VDN / Skill / Agent / Trunk），驱动 Supervisor 大屏与运营 KPI。",
  "ACCCM":     "Avaya Contact Center Control Manager。集中编排和配置多套 CC 组件，承担多租户、变更管理与跨系统同步。",
  "Oceana":    "Avaya Oceana / Avaya Experience Platform 前身。原生全渠道联络中心（语音 / 邮件 / 聊天 / 社交），基于微服务架构。"
};
// 每跨过一个阈值（累计 SR 成功得分）解锁一个新技能
const SKILL_UNLOCK_THRESHOLDS = [3, 7, 12, 18, 25, 33, 42, 52, 63, 75, 88];

function skillCategoryOf(skill){
  if (SKILL_CATALOG.UC.indexOf(skill) >= 0) return "UC";
  if (SKILL_CATALOG.CC.indexOf(skill) >= 0) return "CC";
  return null;
}
function ensureSkillTipEl(){
  let el = document.getElementById("skill-tip");
  if (el) return el;
  el = document.createElement("div");
  el.id = "skill-tip";
  el.setAttribute("role", "tooltip");
  document.body.appendChild(el);
  return el;
}
function showSkillTip(target){
  const skill = target.textContent.trim();
  const desc = SKILL_DESC[skill];
  if (!desc) return;
  const el = ensureSkillTipEl();
  el.innerHTML = `<span class="stip-head">${_slEscape(skill)}</span>${_slEscape(desc)}`;
  // 临时显示以测量尺寸
  el.style.left = "-9999px";
  el.style.top = "-9999px";
  el.classList.add("show");
  const r = target.getBoundingClientRect();
  const tipW = el.offsetWidth;
  const tipH = el.offsetHeight;
  const margin = 8;
  let left = r.left;
  let top = r.bottom + 6;
  if (left + tipW + margin > window.innerWidth) left = window.innerWidth - tipW - margin;
  if (left < margin) left = margin;
  if (top + tipH + margin > window.innerHeight) top = r.top - tipH - 6;
  if (top < margin) top = margin;
  el.style.left = left + "px";
  el.style.top  = top + "px";
}
function hideSkillTip(){
  const el = document.getElementById("skill-tip");
  if (el) el.classList.remove("show");
}
document.addEventListener("mouseover", e => {
  const t = e.target.closest && e.target.closest(".pc-skill[data-tip]");
  if (t) showSkillTip(t);
});
document.addEventListener("mouseout", e => {
  const t = e.target.closest && e.target.closest(".pc-skill[data-tip]");
  if (t) hideSkillTip();
});
window.addEventListener("scroll", hideSkillTip, true);

function maybeUnlockSkill(scoreDelta){
  if (!S || !S.player) return;
  if (typeof scoreDelta !== "number" || scoreDelta <= 0) return;
  const before = S.player.skillProgress || 0;
  const after = before + scoreDelta;
  S.player.skillProgress = after;
  if (!Array.isArray(S.player.skills)) S.player.skills = [];

  let unlocked = [];
  SKILL_UNLOCK_THRESHOLDS.forEach(t => {
    if (before < t && after >= t){
      const owned = new Set(S.player.skills);
      // 优先解锁起手类别里没拿过的，其次再跨到另一类
      const primary = S.player.skillCategory === "CC" ? "CC" : "UC";
      const secondary = primary === "UC" ? "CC" : "UC";
      const candidates = SKILL_CATALOG[primary].filter(s => !owned.has(s));
      const fallback   = SKILL_CATALOG[secondary].filter(s => !owned.has(s));
      const pool = candidates.length ? candidates : fallback;
      if (!pool.length) return;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      S.player.skills.push(pick);
      unlocked.push(pick);
    }
  });
  if (unlocked.length){
    S.log.push(`🆕 解锁新技能：${unlocked.join("，")}`);
    toast(`🎓 新技能解锁：${unlocked.join("、")}`, 3200);
    if (document.getElementById("player-card")) renderPlayerCard();
  }
}

/* ============================================================
 * 工资 + 楼市 + 月供系统
 * ============================================================ */
const GRADE_SALARY_TARGET = {
  "Contractor":        10000,
  "Engineer":          13000,
  "Senior Engineer":   17000,
  "L15-1":             22000,
  "L15-2":             28000,
  "Backbone Engineer · L15-2": 28000,
  "Backbone":          32000
};
const MORTGAGE_ANNUAL_RATE = 0.049;   // 商贷基准
const MORTGAGE_YEARS = 30;
const DOWN_PAY_RATIO = { new: 0.30, second: 0.40 };

function liveMapStatic(){
  return { share:"与同事合租", solo:"独居小公寓", relative:"借住亲戚家" };
}
function getPrimaryHouse(){
  const houses = (S && S.player && S.player.houses) || [];
  return houses.find(h => h.isPrimary) || houses[0] || null;
}
function liveText(p){
  if (!p) return "—";
  const primary = (p.houses || []).find(h => h.isPrimary) || (p.houses || [])[0];
  if (primary){
    const hint = p.spouseName ? "与" + p.spouseName + "同住" : "自住";
    const loanActive = primary.payment === "loan" && primary.loan && (primary.loan.paidMonths || 0) < primary.loan.months;
    const loanTag = loanActive ? " · 房贷中" : (primary.payment === "loan" ? " · 已还清" : " · 全款");
    const more = (p.houses || []).length > 1 ? `（共 ${p.houses.length} 套）` : "";
    return `${primary.district || ""} · ${primary.name}（${hint}${loanTag}）${more}`;
  }
  if (p.spouseName){
    return `与 ${p.spouseName} 同住 · 租房`;
  }
  const m = liveMapStatic();
  return m[p.live] || "—";
}

function getActiveVehicle(){
  const vehicles = (S && S.player && S.player.vehicles) || [];
  return vehicles.find(v => v.isActive) || vehicles[0] || null;
}
function vehicleText(p){
  if (!p) return "—";
  const vehicles = p.vehicles || [];
  const active = vehicles.find(v => v.isActive) || vehicles[0];
  if (!active) return "未购车";
  const loanActive = active.payment === "loan" && active.loan && (active.loan.paidMonths || 0) < active.loan.months;
  const loanTag = loanActive ? " · 车贷中" : (active.payment === "loan" ? " · 已还清" : " · 全款");
  const more = vehicles.length > 1 ? `（共 ${vehicles.length} 辆）` : "";
  return `${active.title || active.name || "当前座驾"}${loanTag}${more}`;
}

/* 估算贷款剩余本金（卖房用） */
function remainingLoanPrincipal(loan){
  if (!loan) return 0;
  const months = loan.months || 0;
  const paid = loan.paidMonths || 0;
  if (paid >= months) return 0;
  if (loan.type === "principal"){
    return Math.round(loan.principal * (1 - paid / months));
  }
  // 等额本息：用摊销公式精算剩余本金
  const r = (loan.annualRate || 0) / 12;
  if (r === 0) return Math.round(loan.principal * (1 - paid / months));
  const m = mortgageMonthlyEqual(loan.principal, loan.annualRate, months);
  let bal = loan.principal;
  for (let i = 0; i < paid; i++){
    const interest = bal * r;
    bal = bal - (m - interest);
  }
  return Math.round(Math.max(0, bal));
}

/* 当前估值（含装修溢价） */
const RENO_MULT = { 0:1.00, 1:1.05, 2:1.12, 3:1.20 };
const RENO_LABEL = { 0:"毛坯", 1:"简装", 2:"精装", 3:"豪装" };
const RENO_COST_PER_SQM = { 1:1500, 2:3000, 3:5000 };
function houseCurrentValue(house, year){
  const prop = HOUSING_CATALOG.find(p => p.id === house.propId);
  if (!prop) return house.totalPrice || 0;
  const base = housePriceTotal(prop, year);
  const lvl = (house.renovation && house.renovation.level) || 0;
  return Math.round(base * (RENO_MULT[lvl] || 1));
}

/* ---- 月度结算：发工资 / 扣房贷 / 每年 1 月调薪 ---- */
function monthlyTick(year, month){
  if (!S || !S.player) return;
  const key = `${year}-${String(month).padStart(2,"0")}`;
  if (S.player.lastTickKey === key) return;
  // 第一次结算就先标记到本月（防止跨年初始化时倒灌）
  if (!S.player.lastTickKey){ S.player.lastTickKey = key; return; }

  // 顺序推进每个未结算月份（一般只跑 1 次，跨多月也补齐）
  let [py, pm] = S.player.lastTickKey.split("-").map(Number);
  while (true){
    pm += 1; if (pm > 12){ pm = 1; py += 1; }
    _doSingleMonthTick(py, pm);
    if (py === year && pm === month) break;
    if (py > year + 1) break;     // 安全保险
  }
  S.player.lastTickKey = key;
}

function _doSingleMonthTick(y, m){
  const p = S.player;
  // 1 月：年度普调 3%–7%
  if (m === 1){
    const rate = 0.03 + Math.random() * 0.04;
    const before = p.salary || 10000;
    p.salary = Math.round(before * (1 + rate));
    S.log.push(`💵 ${y}-01 年度普调 +${(rate*100).toFixed(1)}% · ¥${before.toLocaleString()} → ¥${p.salary.toLocaleString()}`);
  }
  // 发工资（按万元单位累计到 money）
  if (p.salary > 0){
    p.money = (p.money || 0) + p.salary / 10000;
  }
  // 扣所有未还清的房贷
  (p.houses || []).forEach(h => {
    if (h.payment !== "loan" || !h.loan) return;
    const ln = h.loan;
    if (ln.paidMonths >= ln.months) return;
    let due;
    if (ln.type === "principal"){
      due = mortgageMonthlyPrincipalAt(ln.principal, ln.annualRate, ln.months, ln.paidMonths + 1);
    } else {
      due = ln.monthly;
    }
    p.money = (p.money || 0) - due / 10000;
    ln.paidMonths += 1;
    ln.paidPrincipal = (ln.paidPrincipal || 0) + (ln.principal / ln.months);
    if (ln.paidMonths >= ln.months){
      S.log.push(`🏦 ${y}-${String(m).padStart(2,"0")} ${h.name} 房贷已全部还清！`);
    }
  });
  // 扣所有未还清的车贷
  (p.vehicles || []).forEach(v => {
    if (v.payment !== "loan" || !v.loan) return;
    const ln = v.loan;
    if (ln.paidMonths >= ln.months) return;
    const due = ln.monthly || vehicleLoanMonthly(ln.principal, ln.annualRate || 0.045, ln.months);
    p.money = (p.money || 0) - due / 10000;
    ln.paidMonths += 1;
    if (ln.paidMonths >= ln.months){
      S.log.push(`🚗 ${y}-${String(m).padStart(2,"0")} ${v.title || "座驾"} 车贷已全部还清！`);
    }
  });
}

/* ---- 晋升涨薪：基于职级目标线 ---- */
function applyPromotionRaise(oldGrade, newGrade){
  if (!S || !S.player) return;
  if (oldGrade === newGrade) return;
  const target = GRADE_SALARY_TARGET[newGrade];
  if (!target) return;
  const before = S.player.salary || 10000;
  // 至少跳到目标线；若已超目标线，按 12%–18% 再加
  const next = target > before ? target : Math.round(before * (1.12 + Math.random() * 0.06));
  S.player.salary = next;
  S.log.push(`🎖 晋升 ${newGrade} · 月薪 ¥${before.toLocaleString()} → ¥${next.toLocaleString()}`);
  toast(`晋升 ${newGrade} · 月薪 ¥${next.toLocaleString()}`, 3000);
}

/* ---- 楼市屏：列表 + 筛选 + 详情 + 购房 ---- */
let _hsFilterCat = "all";
let _hsFilterDist = "all";
let _hsFilterRooms = "all";
let _hsFilterPrice = "all";
let _hsSort = "default";
let _hsPageSize = 60;
let _hsPage = 1;

function _currentGameYM(){
  const yearData = (typeof CONTENT !== "undefined" && CONTENT.years) ? CONTENT.years[S.yearIdx] : null;
  const yr = yearData?.year || 2018;
  const ev = yearData?.events?.[S.eventIdx];
  const mo = ev?.month || 1;
  return [yr, mo];
}

function openHousing(){
  if (!_hasInGameState()){ toast("当前没有可操作的游戏进度"); return; }
  if (typeof HOUSING_CATALOG === "undefined"){ toast("楼市数据未加载"); return; }
  _hsReturnTo = _activeScreenId() || "screen-game";
  // 构造区域筛选按钮
  const dwrap = document.getElementById("hs-dist");
  if (dwrap){
    const dl = districtList();
    dwrap.innerHTML = `<button class="opt active" data-v="all">全部区域</button>` +
      dl.map(d => `<button class="opt" data-v="${_slEscape(d)}">${_slEscape(d)}</button>`).join("");
  }
  goto("screen-housing");
  renderHousingScreen();
}
let _hsReturnTo = "screen-game";
function closeHousing(){
  _hsCloseModal();
  const back = _hsReturnTo || "screen-game";
  goto(back);
  if (back === "screen-game"){
    renderTopBar(); renderSidebar(); renderEvent();
  }
}

function renderHousingScreen(){
  const [yr] = _currentGameYM();
  const p = S.player;
  document.getElementById("hs-year").textContent = yr;
  document.getElementById("hs-money").textContent = `¥ ${Math.round(p.money || 0)} w`;
  document.getElementById("hs-live").textContent = liveText(p);
  renderHousingList();
}

function renderHousingList(){
  const [yr] = _currentGameYM();
  const wrap = document.getElementById("hs-grid");
  if (!wrap) return;
  let list = HOUSING_CATALOG.slice();
  if (_hsFilterCat !== "all") list = list.filter(x => x.category === _hsFilterCat);
  if (_hsFilterDist !== "all") list = list.filter(x => x.district === _hsFilterDist);
  if (_hsFilterRooms !== "all") list = list.filter(x => houseRoomBucket(x) === _hsFilterRooms);
  if (_hsFilterPrice !== "all") list = list.filter(x => housePriceBucket(x, yr) === _hsFilterPrice);

  // 排序
  if (_hsSort === "totalAsc")  list.sort((a,b) => housePriceTotal(a,yr) - housePriceTotal(b,yr));
  else if (_hsSort === "totalDesc") list.sort((a,b) => housePriceTotal(b,yr) - housePriceTotal(a,yr));
  else if (_hsSort === "unitAsc")   list.sort((a,b) => houseUnitPriceNow(a,yr) - houseUnitPriceNow(b,yr));
  else if (_hsSort === "unitDesc")  list.sort((a,b) => houseUnitPriceNow(b,yr) - houseUnitPriceNow(a,yr));

  const totalCount = list.length;
  const countEl = document.getElementById("hs-count");
  if (countEl) countEl.textContent = `共 ${totalCount} 套`;

  // 分页（避免一次性渲染 500 张卡）
  const start = 0;
  const end = Math.min(totalCount, _hsPage * _hsPageSize);
  const shown = list.slice(start, end);

  const cardHtml = shown.map(prop => {
    const unit = houseUnitPriceNow(prop, yr);
    const total = housePriceTotal(prop, yr);
    const totalWan = Math.round(total / 10000);
    const tag = prop.category === "new" ? "新房" : "二手房";
    return `
      <article class="hs-card hs-cat-${prop.category}" onclick="renderHousingDetail('${prop.id}')">
        <header class="hs-card-head">
          <span class="hs-cat-tag">${tag}</span>
          <span class="hs-dist-tag">${_slEscape(prop.district)}</span>
        </header>
        <h3 class="hs-name">${_slEscape(prop.name)}</h3>
        <p class="hs-dev">${_slEscape(prop.developer)} · ${_slEscape(prop.address)}</p>
        <div class="hs-row">
          <span>${_slEscape(prop.rooms)}</span><span>${prop.area} ㎡</span>
        </div>
        <div class="hs-row hs-floor">${_slEscape(prop.floor)}</div>
        <div class="hs-price">
          <span class="hs-unit">¥ ${unit.toLocaleString()} <small>元/㎡</small></span>
          <span class="hs-total">总价 <b>¥ ${totalWan} 万</b></span>
        </div>
      </article>`;
  }).join("");

  let html = cardHtml;
  if (end < totalCount){
    html += `<div class="hs-more"><button class="btn-ghost" onclick="_hsLoadMore()">加载更多（剩余 ${totalCount - end} 套）</button></div>`;
  }
  wrap.innerHTML = html;
  if (!totalCount){
    wrap.innerHTML = `<p class="hs-empty">没有符合条件的楼盘</p>`;
  }
}
function _hsLoadMore(){ _hsPage += 1; renderHousingList(); }

function renderHousingDetail(propId){
  const prop = HOUSING_CATALOG.find(x => x.id === propId);
  if (!prop) return;
  const [yr] = _currentGameYM();
  const unit = houseUnitPriceNow(prop, yr);
  const total = housePriceTotal(prop, yr);
  const totalWan = Math.round(total / 10000);
  const moneyWan = Math.round(S.player.money || 0);
  const ownedCount = (S.player.houses || []).length;
  const tag = prop.category === "new" ? "新房" : "二手房";

  const downRatio = DOWN_PAY_RATIO[prop.category] || 0.3;
  const downWan = Math.round(total * downRatio / 10000);
  const principal = total - Math.round(total * downRatio);
  const months = MORTGAGE_YEARS * 12;
  const annual = MORTGAGE_ANNUAL_RATE;
  const mEq = Math.round(mortgageMonthlyEqual(principal, annual, months));
  const mPr1 = Math.round(mortgageMonthlyPrincipalFirst(principal, annual, months));
  const mPrLast = Math.round(mortgageMonthlyPrincipalAt(principal, annual, months, months));
  const intEq = Math.round(mortgageTotalInterest(principal, annual, months, "equal"));
  const intPr = Math.round(mortgageTotalInterest(principal, annual, months, "principal"));

  const card = document.getElementById("hs-modal-card");
  card.innerHTML = `
    <header class="hs-modal-head">
      <div>
        <span class="hs-cat-tag">${tag}</span>
        <span class="hs-dist-tag">${_slEscape(prop.district)}</span>
        <h2>${_slEscape(prop.name)}</h2>
        <p class="hs-modal-dev">${_slEscape(prop.developer)} · ${_slEscape(prop.address)}</p>
      </div>
      <button class="btn-icon hs-modal-close" onclick="_hsCloseModal()" title="关闭">✕</button>
    </header>
    <section class="hs-modal-body">
      <dl class="hs-meta">
        <dt>户型</dt><dd>${_slEscape(prop.rooms)}</dd>
        <dt>面积</dt><dd>${prop.area} ㎡</dd>
        <dt>楼层</dt><dd>${_slEscape(prop.floor)}</dd>
        <dt>${yr} 单价</dt><dd>¥ ${unit.toLocaleString()} 元/㎡</dd>
        <dt>${yr} 总价</dt><dd><b>¥ ${totalWan} 万</b></dd>
      </dl>
      <div class="hs-pros-cons">
        <div class="hs-pros">优势：${_slEscape(prop.pros)}</div>
        <div class="hs-cons">劣势：${_slEscape(prop.cons)}</div>
      </div>
      ${ownedCount > 0 ? `
        <div class="hs-note">
          你目前已持有 <b>${ownedCount}</b> 套房产 · 再购入将记入 <a href="javascript:void(0)" onclick="_hsCloseModal();openAssets()">资产</a> 列表
        </div>
      ` : ""}
        <h4 class="hs-pay-title">购房方式</h4>
        <div class="hs-pay-grid">
          <button class="hs-pay-btn" onclick="confirmPurchase('${prop.id}','full')">
            <span class="hs-pay-lbl">全款</span>
            <span class="hs-pay-val">¥ ${totalWan} 万</span>
            <span class="hs-pay-sub">需 ${totalWan} 万一次付清</span>
          </button>
          <button class="hs-pay-btn" onclick="confirmPurchase('${prop.id}','loan-equal')">
            <span class="hs-pay-lbl">贷款 · 等额本息</span>
            <span class="hs-pay-val">首付 ${downWan} 万</span>
            <span class="hs-pay-sub">月供 ¥${mEq.toLocaleString()} × 360 期 · 总息 ¥${(intEq/10000).toFixed(1)} 万</span>
          </button>
          <button class="hs-pay-btn" onclick="confirmPurchase('${prop.id}','loan-principal')">
            <span class="hs-pay-lbl">贷款 · 等额本金</span>
            <span class="hs-pay-val">首付 ${downWan} 万</span>
            <span class="hs-pay-sub">首月 ¥${mPr1.toLocaleString()} · 末月 ¥${mPrLast.toLocaleString()} · 总息 ¥${(intPr/10000).toFixed(1)} 万</span>
          </button>
        </div>
        <p class="hs-money-hint">你目前手头：<b>¥ ${moneyWan} 万</b>，需首付：<b>¥ ${downWan} 万</b>（首付比例 ${Math.round(downRatio*100)}% · 30 年期 · 年利率 ${(annual*100).toFixed(2)}%）</p>
    </section>
  `;
  document.getElementById("hs-modal").classList.remove("hidden");
}

function _hsCloseModal(){
  const m = document.getElementById("hs-modal");
  if (m) m.classList.add("hidden");
}

function confirmPurchase(propId, mode){
  const prop = HOUSING_CATALOG.find(x => x.id === propId);
  if (!prop) return;
  if (!Array.isArray(S.player.houses)) S.player.houses = [];

  const [yr] = _currentGameYM();
  const total = housePriceTotal(prop, yr);
  const downRatio = DOWN_PAY_RATIO[prop.category] || 0.3;
  const totalWan = total / 10000;
  const downWan = Math.round(total * downRatio) / 10000;

  let payNow;
  let loan = null;
  if (mode === "full"){
    payNow = totalWan;
  } else {
    payNow = downWan;
    const principal = total - Math.round(total * downRatio);
    const months = MORTGAGE_YEARS * 12;
    const type = mode === "loan-principal" ? "principal" : "equal";
    const monthly = type === "equal" ? mortgageMonthlyEqual(principal, MORTGAGE_ANNUAL_RATE, months) : null;
    loan = {
      principal, annualRate: MORTGAGE_ANNUAL_RATE, months, type,
      paidMonths: 0, paidPrincipal: 0,
      monthly: monthly ? Math.round(monthly) : null
    };
  }

  if ((S.player.money || 0) < payNow){
    showModal("资金不足", `本次需要 <b>¥ ${payNow.toFixed(1)} 万</b>，你目前只有 <b>¥ ${(S.player.money||0).toFixed(1)} 万</b>。<br>建议换更便宜的楼盘或先攒钱。`);
    return;
  }
  if (!confirm(`确认${mode==="full"?"全款":"贷款"}购入「${prop.name}」？将扣除 ¥${payNow.toFixed(1)} 万。`)) return;

  S.player.money -= payNow;
  const isFirst = S.player.houses.length === 0;
  const newHouse = {
    uid: "h" + Date.now().toString(36) + Math.floor(Math.random() * 1000),
    propId: prop.id,
    name: prop.name, district: prop.district, address: prop.address,
    area: prop.area, rooms: prop.rooms,
    buyYear: yr, totalPrice: total,
    payment: mode === "full" ? "full" : "loan",
    loan,
    renovation: { level: 0, year: null, cost: 0 },
    isPrimary: isFirst
  };
  S.player.houses.push(newHouse);
  S.player.flags.bought_house = true;
  S.log.push(`🏠 ${yr} 购入 ${prop.district} · ${prop.name}（${mode==="full"?"全款":"贷款"} · ¥${(total/10000).toFixed(0)} 万）${isFirst?" · 设为自住":""}`);
  toast(`🏠 已购入 ${prop.name}`, 3200);
  _hsCloseModal();
  renderHousingScreen();
  if (document.getElementById("player-card")) renderPlayerCard();
  autoSave();
}

/* ---- 车市屏：列表 + 筛选 + 详情 + 买车 ---- */
let _vhFilterCat = "all";
let _vhFilterBrand = "all";
let _vhFilterBody = "all";
let _vhFilterPrice = "all";
let _vhSort = "default";
let _vhPageSize = 60;
let _vhPage = 1;
let _vhReturnTo = "screen-game";

const VEHICLE_LOAN_RATE = 0.045;
function vehicleDownRatio(item){
  if (!item) return 0.30;
  if (item.bodyType === "摩托车") return item.category === "new" ? 0.40 : 0.50;
  return item.category === "new" ? 0.30 : 0.40;
}

function openVehicleMarket(){
  if (!_hasInGameState()){ toast("当前没有可操作的游戏进度"); return; }
  if (typeof VEHICLE_CATALOG === "undefined"){ toast("车市数据未加载"); return; }
  _vhReturnTo = _activeScreenId() || "screen-game";
  const brandWrap = document.getElementById("vh-brand");
  if (brandWrap){
    const brands = vehicleBrandList();
    brandWrap.innerHTML = `<button class="opt active" data-v="all">全部品牌</button>` +
      brands.map(b => `<button class="opt" data-v="${_slEscape(b)}">${_slEscape(b)}</button>`).join("");
  }
  const bodyWrap = document.getElementById("vh-body");
  if (bodyWrap){
    const bodies = vehicleBodyList();
    bodyWrap.innerHTML = `<button class="opt active" data-v="all">全部车身</button>` +
      bodies.map(b => `<button class="opt" data-v="${_slEscape(b)}">${_slEscape(b)}</button>`).join("");
  }
  goto("screen-vehicle");
  renderVehicleScreen();
}
function closeVehicleMarket(){
  _vhCloseModal();
  const back = _vhReturnTo || "screen-game";
  goto(back);
  if (back === "screen-game"){
    renderTopBar(); renderSidebar(); renderEvent();
  }
}

function renderVehicleScreen(){
  const [yr] = _currentGameYM();
  const p = S.player;
  const yEl = document.getElementById("vh-year");
  const mEl = document.getElementById("vh-money");
  const rEl = document.getElementById("vh-ride");
  if (yEl) yEl.textContent = yr;
  if (mEl) mEl.textContent = `¥ ${Math.round(p.money || 0)} w`;
  if (rEl) rEl.textContent = vehicleText(p);
  renderVehicleList();
}

function renderVehicleList(){
  const [yr] = _currentGameYM();
  const wrap = document.getElementById("vh-grid");
  if (!wrap) return;
  let list = VEHICLE_CATALOG.slice();
  if (_vhFilterCat !== "all") list = list.filter(x => x.category === _vhFilterCat);
  if (_vhFilterBrand !== "all") list = list.filter(x => x.brand === _vhFilterBrand);
  if (_vhFilterBody !== "all") list = list.filter(x => x.bodyType === _vhFilterBody);
  if (_vhFilterPrice !== "all") list = list.filter(x => vehiclePriceBucket(x, yr) === _vhFilterPrice);
  if (_vhSort === "priceAsc") list.sort((a,b) => vehiclePriceOf(a,yr) - vehiclePriceOf(b,yr));
  else if (_vhSort === "priceDesc") list.sort((a,b) => vehiclePriceOf(b,yr) - vehiclePriceOf(a,yr));
  else if (_vhSort === "hpDesc") list.sort((a,b) => (b.hp||0) - (a.hp||0));
  else if (_vhSort === "ageAsc") list.sort((a,b) => (a.age||0) - (b.age||0));

  const totalCount = list.length;
  const countEl = document.getElementById("vh-count");
  if (countEl) countEl.textContent = `共 ${totalCount} 款`;
  const end = Math.min(totalCount, _vhPage * _vhPageSize);
  const shown = list.slice(0, end);
  wrap.innerHTML = shown.map(item => {
    const price = vehiclePriceOf(item, yr);
    const tag = item.category === "new" ? "新车" : "二手车";
    return `
      <article class="vh-card vh-cat-${item.category}" onclick="renderVehicleDetail('${item.id}')">
        <img class="vh-img" data-vehicle-id="${item.id}" loading="lazy" src="${vehicleImageSrc(item)}" alt="${_slEscape(item.title)}">
        <header class="hs-card-head">
          <span class="hs-cat-tag">${tag}</span>
          <span class="hs-dist-tag">${_slEscape(item.bodyType)}</span>
        </header>
        <h3 class="hs-name">${_slEscape(item.title)}</h3>
        <p class="hs-dev">${_slEscape(item.energy)} · ${item.hp} hp · 0-100 ${_slEscape(item.accel)}</p>
        <div class="hs-row"><span>${_slEscape(item.color)}</span><span>${item.category === "used" ? `${item.age} 年 · ${Math.round(item.mileage/10000)} 万 km` : "可选配置"}</span></div>
        <div class="hs-price">
          <span class="hs-unit">${item.category === "new" ? "指导价" : item.condition}</span>
          <span class="hs-total">约 <b>¥ ${Math.round(price/10000)} 万</b></span>
        </div>
      </article>`;
  }).join("");
  if (end < totalCount){
    wrap.innerHTML += `<div class="hs-more"><button class="btn-ghost" onclick="_vhLoadMore()">加载更多（剩余 ${totalCount - end} 款）</button></div>`;
  }
  if (!totalCount) wrap.innerHTML = `<p class="hs-empty">没有符合条件的车型</p>`;
  enhanceVehiclePhotos(wrap);
}
function _vhLoadMore(){ _vhPage += 1; renderVehicleList(); }

function renderVehicleDetail(vehicleId){
  const item = VEHICLE_CATALOG.find(x => x.id === vehicleId);
  if (!item) return;
  const [yr] = _currentGameYM();
  const ownedCount = (S.player.vehicles || []).length;
  const card = document.getElementById("vh-modal-card");
  const tag = item.category === "new" ? "新车" : "二手车";
  const trimHtml = (item.trims || []).map(trim => {
    const price = vehiclePriceOf(item, yr, trim.id);
    const downWan = price * vehicleDownRatio(item) / 10000;
    const principal = price - Math.round(price * vehicleDownRatio(item));
    const m24 = Math.round(vehicleLoanMonthly(principal, VEHICLE_LOAN_RATE, 24));
    const m36 = Math.round(vehicleLoanMonthly(principal, VEHICLE_LOAN_RATE, 36));
    const m60 = Math.round(vehicleLoanMonthly(principal, VEHICLE_LOAN_RATE, 60));
    return `
      <div class="vh-trim">
        <div>
          <b>${_slEscape(trim.name)}</b>
          <span>¥ ${Math.round(price/10000)} 万</span>
          <small>${(trim.features || []).map(_slEscape).join(" · ")}</small>
        </div>
        <div class="vh-buy-actions">
          <button class="hs-pay-btn" onclick="confirmVehiclePurchase('${item.id}','${trim.id}','full',0)">全款</button>
          <button class="hs-pay-btn" onclick="confirmVehiclePurchase('${item.id}','${trim.id}','loan',24)">24期 · ¥${m24.toLocaleString()}/月</button>
          <button class="hs-pay-btn" onclick="confirmVehiclePurchase('${item.id}','${trim.id}','loan',36)">36期 · ¥${m36.toLocaleString()}/月</button>
          <button class="hs-pay-btn" onclick="confirmVehiclePurchase('${item.id}','${trim.id}','loan',60)">60期 · ¥${m60.toLocaleString()}/月</button>
        </div>
        <p class="hs-money-hint">贷款首付约 <b>¥ ${downWan.toFixed(1)} 万</b> · 年利率 ${(VEHICLE_LOAN_RATE*100).toFixed(2)}%</p>
      </div>`;
  }).join("");
  card.innerHTML = `
    <header class="hs-modal-head">
      <div>
        <span class="hs-cat-tag">${tag}</span>
        <span class="hs-dist-tag">${_slEscape(item.bodyType)}</span>
        <h2>${_slEscape(item.title)}</h2>
        <p class="hs-modal-dev">${_slEscape(item.energy)} · ${item.hp} hp · 0-100 ${_slEscape(item.accel)}</p>
      </div>
      <button class="btn-icon hs-modal-close" onclick="_vhCloseModal()" title="关闭">✕</button>
    </header>
    <section class="hs-modal-body">
      <img class="vh-modal-img" data-vehicle-id="${item.id}" loading="lazy" src="${vehicleImageSrc(item)}" alt="${_slEscape(item.title)}">
      <dl class="hs-meta">
        <dt>车身</dt><dd>${_slEscape(item.bodyType)}</dd>
        <dt>能源</dt><dd>${_slEscape(item.energy)}</dd>
        <dt>动力</dt><dd>${item.hp} hp · 0-100 ${_slEscape(item.accel)}</dd>
        <dt>颜色</dt><dd>${_slEscape(item.color)}</dd>
        ${item.category === "used" ? `<dt>车况</dt><dd>${_slEscape(item.condition)} · ${item.age} 年车龄 · ${item.mileage.toLocaleString()} km</dd>` : `<dt>配置</dt><dd>新车可选不同级别配置</dd>`}
      </dl>
      <div class="hs-note">你目前已持有 <b>${ownedCount}</b> 辆车 · 买入后可在 <a href="javascript:void(0)" onclick="_vhCloseModal();openAssets()">资产</a> 中设为当前座驾、卖出或继续持有。</div>
      <h4 class="hs-pay-title">购买方式与配置</h4>
      <div class="vh-trim-list">${trimHtml}</div>
    </section>`;
  document.getElementById("vh-modal").classList.remove("hidden");
  enhanceVehiclePhotos(card);
}

function _vhCloseModal(){
  const m = document.getElementById("vh-modal");
  if (m) m.classList.add("hidden");
}

function confirmVehiclePurchase(vehicleId, trimId, mode, months){
  const item = VEHICLE_CATALOG.find(x => x.id === vehicleId);
  if (!item) return;
  if (!Array.isArray(S.player.vehicles)) S.player.vehicles = [];
  const [yr, mo] = _currentGameYM();
  const trim = item.trims.find(t => t.id === trimId) || item.trims[0];
  const total = vehiclePriceOf(item, yr, trim.id);
  const downRatio = vehicleDownRatio(item);
  let payNow = total / 10000;
  let loan = null;
  if (mode === "loan"){
    payNow = Math.round(total * downRatio) / 10000;
    const principal = total - Math.round(total * downRatio);
    const monthly = Math.round(vehicleLoanMonthly(principal, VEHICLE_LOAN_RATE, months));
    loan = { principal, annualRate:VEHICLE_LOAN_RATE, months, type:"equal", paidMonths:0, monthly };
  }
  if ((S.player.money || 0) < payNow){
    showModal("资金不足", `本次需要 <b>¥ ${payNow.toFixed(1)} 万</b>，你目前只有 <b>¥ ${(S.player.money||0).toFixed(1)} 万</b>。`);
    return;
  }
  if (!confirm(`确认${mode==="loan" ? "贷款" : "全款"}购买「${item.title} ${trim.name}」？\n将先扣除 ¥${payNow.toFixed(1)} 万。`)) return;
  S.player.money -= payNow;
  const isFirst = S.player.vehicles.length === 0;
  S.player.vehicles.push({
    uid:"vown" + Date.now().toString(36) + Math.floor(Math.random()*1000),
    vehicleId:item.id,
    title:item.title,
    brand:item.brand, model:item.model, bodyType:item.bodyType, energy:item.energy,
    hp:item.hp, accel:item.accel, color:item.color, features:trim.features || [],
    category:item.category, trimId:trim.id, trimName:trim.name,
    buyYear:yr, buyMonth:mo, totalPrice:total,
    payment:mode === "loan" ? "loan" : "full",
    loan,
    isActive:isFirst
  });
  S.log.push(`🚗 ${yr}-${String(mo).padStart(2,"0")} 购入 ${item.title} ${trim.name}（${mode==="loan" ? `${months}期车贷` : "全款"} · ¥${Math.round(total/10000)} 万）${isFirst ? " · 设为当前座驾" : ""}`);
  toast(`🚗 已购入 ${item.title}`);
  _vhCloseModal();
  renderVehicleScreen();
  if (document.getElementById("player-card")) renderPlayerCard();
  autoSave();
}

function _vhBindFilter(hostId, setter){
  return (e) => {
    const t = e.target;
    if (!t || !t.dataset) return;
    const host = t.closest && t.closest("#" + hostId);
    if (host && t.classList.contains("opt")){
      host.querySelectorAll(".opt").forEach(b => b.classList.remove("active"));
      t.classList.add("active");
      setter(t.dataset.v);
      _vhPage = 1;
      renderVehicleList();
    }
  };
}
document.addEventListener("click", _vhBindFilter("vh-tabs",  v => _vhFilterCat = v));
document.addEventListener("click", _vhBindFilter("vh-brand", v => _vhFilterBrand = v));
document.addEventListener("click", _vhBindFilter("vh-body",  v => _vhFilterBody = v));
document.addEventListener("click", _vhBindFilter("vh-price", v => _vhFilterPrice = v));
document.addEventListener("click", _vhBindFilter("vh-sort",  v => _vhSort = v));

/* ============================================================
 *  资产屏：所有持有房产 + 自住切换 / 装修 / 卖出
 * ============================================================ */
let _assetsReturnTo = "screen-game";
function openAssets(){
  if (!_hasInGameState()){ toast("当前没有可操作的游戏进度"); return; }
  _assetsReturnTo = _activeScreenId() || "screen-game";
  goto("screen-assets");
  renderAssets();
}
function closeAssets(){
  const back = _assetsReturnTo || "screen-game";
  goto(back);
  if (back === "screen-game"){
    renderTopBar(); renderSidebar();
  }
}

function renderAssets(){
  const [yr] = _currentGameYM();
  const [, mo] = _currentGameYM();
  const p = S.player;
  const houses = p.houses || [];
  const vehicles = p.vehicles || [];
  document.getElementById("as-year").textContent = yr;
  document.getElementById("as-money").textContent = `¥ ${Math.round(p.money || 0)} w`;

  // 资产汇总
  let totalValue = 0, totalLoan = 0, vehicleValue = 0, vehicleLoan = 0;
  houses.forEach(h => {
    totalValue += houseCurrentValue(h, yr);
    if (h.payment === "loan" && h.loan) totalLoan += remainingLoanPrincipal(h.loan);
  });
  vehicles.forEach(v => {
    vehicleValue += vehicleCurrentValue(v, yr, mo);
    if (v.payment === "loan" && v.loan) vehicleLoan += remainingLoanPrincipal(v.loan);
  });
  const netAsset = (p.money || 0) * 10000 + totalValue + vehicleValue - totalLoan - vehicleLoan;
  const sumEl = document.getElementById("as-summary");
  sumEl.innerHTML = `
    <div class="as-sum-item"><span>房产 / 车辆</span><b>${houses.length} 套 / ${vehicles.length} 辆</b></div>
    <div class="as-sum-item"><span>房产估值</span><b>¥ ${Math.round(totalValue/10000)} 万</b></div>
    <div class="as-sum-item"><span>车辆估值</span><b>¥ ${Math.round(vehicleValue/10000)} 万</b></div>
    <div class="as-sum-item"><span>剩余贷款</span><b>¥ ${Math.round((totalLoan + vehicleLoan)/10000)} 万</b></div>
    <div class="as-sum-item as-sum-net"><span>净资产</span><b>¥ ${Math.round(netAsset/10000)} 万</b></div>
  `;

  const wrap = document.getElementById("as-list");
  if (!houses.length && !vehicles.length){
    wrap.innerHTML = `<p class="as-empty">你还没有持有任何大件资产。<button class="btn-primary" onclick="closeAssets();openHousing()">去贝壳大连看房 →</button><button class="btn-primary" onclick="closeAssets();openVehicleMarket()">去车市看车 →</button></p>`;
    return;
  }

  const houseHtml = houses.map(h => {
    const value = houseCurrentValue(h, yr);
    const valueWan = Math.round(value / 10000);
    const remain = (h.payment === "loan" && h.loan) ? remainingLoanPrincipal(h.loan) : 0;
    const remainWan = Math.round(remain / 10000);
    const cashOut = Math.round((value - remain) / 10000);
    const lvl = (h.renovation && h.renovation.level) || 0;
    const renoLabel = RENO_LABEL[lvl] || "毛坯";
    const loanActive = h.payment === "loan" && h.loan && h.loan.paidMonths < h.loan.months;
    const loanProgress = h.payment === "loan" && h.loan
      ? `${h.loan.paidMonths}/${h.loan.months} 期 · 剩 ¥${remainWan} 万`
      : "—";
    const buyWan = Math.round((h.totalPrice || 0) / 10000);
    const delta = valueWan - buyWan;
    const deltaCls = delta >= 0 ? "as-up" : "as-down";
    const deltaTxt = (delta >= 0 ? "+" : "") + delta + " 万";
    const primaryTag = h.isPrimary ? `<span class="as-primary-tag">🏡 自住</span>` : "";
    const cantSell = h.isPrimary && houses.length > 1
      ? "" // 仍可卖，但下方提示
      : "";
    return `
      <article class="as-card${h.isPrimary ? ' as-card-primary' : ''}">
        <header class="as-card-head">
          <h3>${_slEscape(h.name)} ${primaryTag}</h3>
          <span class="as-dist">${_slEscape(h.district)} · ${_slEscape(h.address || "")}</span>
        </header>
        <dl class="as-meta">
          <dt>户型</dt><dd>${_slEscape(h.rooms)} · ${h.area} ㎡</dd>
          <dt>购入</dt><dd>${h.buyYear} 年 · ¥ ${buyWan} 万</dd>
          <dt>当前估值</dt><dd><b>¥ ${valueWan} 万</b> <span class="${deltaCls}">${deltaTxt}</span></dd>
          <dt>装修</dt><dd>${renoLabel}${lvl>0 ? ` · ${h.renovation.year} 年完成` : ""}</dd>
          <dt>贷款</dt><dd>${h.payment === "loan" ? loanProgress : "全款"}</dd>
          <dt>预估变现</dt><dd>¥ ${cashOut} 万 <small>（估值 - 剩余贷款）</small></dd>
        </dl>
        <footer class="as-actions">
          ${h.isPrimary
            ? `<button class="btn-ghost" disabled>✓ 当前自住</button>`
            : `<button class="btn-primary" onclick="setPrimaryHouse('${h.uid}')">设为自住</button>`}
          ${lvl < 3
            ? `<button class="btn-ghost" onclick="renovateHouse('${h.uid}')">装修 → ${RENO_LABEL[lvl+1]} (¥${Math.round(h.area * RENO_COST_PER_SQM[lvl+1] / 10000)} 万)</button>`
            : `<button class="btn-ghost" disabled>装修已满级</button>`}
          <button class="btn-ghost as-sell" onclick="sellHouse('${h.uid}')">卖出</button>
          ${loanActive ? `<span class="as-warn-tag">⚠ 贷款未结清</span>` : ""}
        </footer>
      </article>
    `;
  }).join("");
  wrap.innerHTML = houseHtml + renderVehicleAssets(vehicles, yr, mo);
  enhanceVehiclePhotos(wrap);
}

function renderVehicleAssets(vehicles, yr, mo){
  if (!vehicles.length){
    return `<article class="as-card as-card-vehicle as-card-empty"><p>还没有持有车辆。</p><button class="btn-primary" onclick="closeAssets();openVehicleMarket()">去车市看车 →</button></article>`;
  }
  return vehicles.map(v => {
    const value = vehicleCurrentValue(v, yr, mo);
    const remain = (v.payment === "loan" && v.loan) ? remainingLoanPrincipal(v.loan) : 0;
    const valueWan = Math.round(value / 10000);
    const buyWan = Math.round((v.totalPrice || 0) / 10000);
    const cashOut = Math.round((value - remain) / 10000);
    const delta = valueWan - buyWan;
    const loanActive = v.payment === "loan" && v.loan && v.loan.paidMonths < v.loan.months;
    const loanProgress = v.payment === "loan" && v.loan
      ? `${v.loan.paidMonths}/${v.loan.months} 期 · 剩 ¥${Math.round(remain/10000)} 万`
      : "全款";
    const item = VEHICLE_CATALOG.find(x => x.id === v.vehicleId);
    const activeTag = v.isActive ? `<span class="as-primary-tag as-ride-tag">🚗 当前座驾</span>` : "";
    return `
      <article class="as-card as-card-vehicle${v.isActive ? ' as-card-primary' : ''}">
        ${item ? `<img class="as-vehicle-img" data-vehicle-id="${item.id}" loading="lazy" src="${vehicleImageSrc(item)}" alt="${_slEscape(v.title)}">` : ""}
        <header class="as-card-head">
          <h3>${_slEscape(v.title)} ${activeTag}</h3>
          <span class="as-dist">${_slEscape(v.trimName || "")} · ${_slEscape(v.bodyType || "")} · ${_slEscape(v.energy || "")}</span>
        </header>
        <dl class="as-meta">
          <dt>购入</dt><dd>${v.buyYear} 年 ${v.buyMonth || 1} 月 · ¥ ${buyWan} 万</dd>
          <dt>性能</dt><dd>${_slEscape(v.energy || "")} · ${v.hp || "—"} hp · 0-100 ${_slEscape(v.accel || "—")}</dd>
          <dt>配置</dt><dd>${_slEscape(v.color || "—")} · ${_slEscape((v.features || []).slice(0,4).join(" · ") || v.trimName || "—")}</dd>
          <dt>当前估值</dt><dd><b>¥ ${valueWan} 万</b> <span class="as-down">${delta} 万</span></dd>
          <dt>贷款</dt><dd>${loanProgress}</dd>
          <dt>预估变现</dt><dd>¥ ${cashOut} 万 <small>（车辆只折旧不升值）</small></dd>
        </dl>
        <footer class="as-actions">
          ${v.isActive
            ? `<button class="btn-ghost" disabled>✓ 当前座驾</button>`
            : `<button class="btn-primary" onclick="setActiveVehicle('${v.uid}')">设为座驾</button>`}
          <button class="btn-ghost as-sell" onclick="sellVehicle('${v.uid}')">卖出</button>
          ${loanActive ? `<span class="as-warn-tag">⚠ 车贷未结清</span>` : ""}
        </footer>
      </article>
    `;
  }).join("");
}

function setPrimaryHouse(uid){
  const houses = (S.player && S.player.houses) || [];
  const target = houses.find(h => h.uid === uid);
  if (!target) return;
  houses.forEach(h => { h.isPrimary = false; });
  target.isPrimary = true;
  S.log.push(`🏡 自住房切换为：${target.name}`);
  toast(`已切换自住：${target.name}`);
  renderAssets();
  autoSave();
}

function renovateHouse(uid){
  const houses = (S.player && S.player.houses) || [];
  const h = houses.find(x => x.uid === uid);
  if (!h) return;
  const lvl = (h.renovation && h.renovation.level) || 0;
  if (lvl >= 3){ toast("装修已满级"); return; }
  const nextLvl = lvl + 1;
  const costWan = h.area * RENO_COST_PER_SQM[nextLvl] / 10000;
  if ((S.player.money || 0) < costWan){
    showModal("资金不足", `升级到「${RENO_LABEL[nextLvl]}」需要 <b>¥ ${costWan.toFixed(1)} 万</b>，你只有 <b>¥ ${(S.player.money||0).toFixed(1)} 万</b>。`);
    return;
  }
  if (!confirm(`将「${h.name}」从 ${RENO_LABEL[lvl]} 升级到 ${RENO_LABEL[nextLvl]}？\n费用：¥ ${costWan.toFixed(1)} 万 · 房产估值预计 +${Math.round((RENO_MULT[nextLvl]-RENO_MULT[lvl])*100)}%`)) return;
  const [yr] = _currentGameYM();
  S.player.money -= costWan;
  h.renovation = { level: nextLvl, year: yr, cost: (h.renovation?.cost || 0) + costWan };
  // 装修给伴侣/家庭加点小温度
  if (S.player.spouseName) S.rel.spouse = clamp((S.rel.spouse || 0) + 2, 0, 100);
  S.player.family = clamp((S.player.family || 0) + 1, 0, 200);
  S.log.push(`🛠 装修 ${h.name} → ${RENO_LABEL[nextLvl]}（¥${costWan.toFixed(1)} 万）`);
  toast(`🛠 装修完成：${RENO_LABEL[nextLvl]}`);
  renderAssets();
  if (document.getElementById("player-card")) renderPlayerCard();
  autoSave();
}

function sellHouse(uid){
  const houses = (S.player && S.player.houses) || [];
  const idx = houses.findIndex(h => h.uid === uid);
  if (idx < 0) return;
  const h = houses[idx];
  const [yr] = _currentGameYM();
  const value = houseCurrentValue(h, yr);
  const remain = (h.payment === "loan" && h.loan) ? remainingLoanPrincipal(h.loan) : 0;
  const cash = value - remain;
  const cashWan = cash / 10000;
  const underwater = cash < 0;
  const msg = `确认卖出「${h.name}」？\n\n` +
    `当前估值：¥ ${(value/10000).toFixed(1)} 万\n` +
    `剩余贷款：¥ ${(remain/10000).toFixed(1)} 万\n` +
    `${underwater ? "⚠ 资不抵债，将倒贴：" : "到手现金："}¥ ${cashWan.toFixed(1)} 万${underwater ? "（需自掏腰包）":""}` +
    (h.isPrimary ? "\n\n⚠ 这是你的自住房，卖出后将自动切换到其他房产 / 改为租房" : "");
  if (!confirm(msg)) return;
  if (underwater && (S.player.money || 0) + cashWan < 0){
    showModal("资金不足", `倒贴 ¥${Math.abs(cashWan).toFixed(1)} 万会让你的现金为负。请先攒钱再考虑止损卖出。`);
    return;
  }
  S.player.money += cashWan;
  const wasPrimary = h.isPrimary;
  houses.splice(idx, 1);
  if (wasPrimary && houses.length > 0){
    houses[0].isPrimary = true;
    S.log.push(`🏡 自住自动切换为：${houses[0].name}`);
  }
  S.log.push(`💸 卖出 ${h.name} · ${underwater?"倒贴":"到手"} ¥${Math.abs(cashWan).toFixed(1)} 万`);
  toast(`💸 已卖出 ${h.name}`);
  renderAssets();
  if (document.getElementById("player-card")) renderPlayerCard();
  autoSave();
}

function setActiveVehicle(uid){
  const vehicles = (S.player && S.player.vehicles) || [];
  const target = vehicles.find(v => v.uid === uid);
  if (!target) return;
  vehicles.forEach(v => { v.isActive = false; });
  target.isActive = true;
  S.log.push(`🚗 当前座驾切换为：${target.title}`);
  toast(`已切换座驾：${target.title}`);
  renderAssets();
  if (document.getElementById("player-card")) renderPlayerCard();
  autoSave();
}

function sellVehicle(uid){
  const vehicles = (S.player && S.player.vehicles) || [];
  const idx = vehicles.findIndex(v => v.uid === uid);
  if (idx < 0) return;
  const v = vehicles[idx];
  const [yr, mo] = _currentGameYM();
  const value = vehicleCurrentValue(v, yr, mo);
  const remain = (v.payment === "loan" && v.loan) ? remainingLoanPrincipal(v.loan) : 0;
  const cash = value - remain;
  const cashWan = cash / 10000;
  const underwater = cash < 0;
  const msg = `确认卖出「${v.title}」？\n\n` +
    `车辆估值：¥ ${(value/10000).toFixed(1)} 万\n` +
    `剩余车贷：¥ ${(remain/10000).toFixed(1)} 万\n` +
    `${underwater ? "⚠ 资不抵债，将倒贴：" : "到手现金："}¥ ${cashWan.toFixed(1)} 万` +
    (v.isActive ? "\n\n⚠ 这是当前座驾，卖出后将自动切换到其他车辆 / 无车状态" : "");
  if (!confirm(msg)) return;
  if (underwater && (S.player.money || 0) + cashWan < 0){
    showModal("资金不足", `倒贴 ¥${Math.abs(cashWan).toFixed(1)} 万会让你的现金为负。请先攒钱再卖。`);
    return;
  }
  S.player.money += cashWan;
  const wasActive = v.isActive;
  vehicles.splice(idx, 1);
  if (wasActive && vehicles.length > 0){
    vehicles[0].isActive = true;
    S.log.push(`🚗 当前座驾自动切换为：${vehicles[0].title}`);
  }
  S.log.push(`💸 卖出 ${v.title} · ${underwater ? "倒贴" : "到手"} ¥${Math.abs(cashWan).toFixed(1)} 万`);
  toast(`💸 已卖出 ${v.title}`);
  renderAssets();
  if (document.getElementById("player-card")) renderPlayerCard();
  autoSave();
}

/* 楼市筛选交互 */
function _hsBindFilter(hostId, setter){
  // 通过事件委托捕获，所有筛选行共用一个委托
  return (e) => {
    const t = e.target;
    if (!t || !t.dataset) return;
    const host = t.closest && t.closest("#" + hostId);
    if (host && t.classList.contains("opt")){
      host.querySelectorAll(".opt").forEach(b => b.classList.remove("active"));
      t.classList.add("active");
      setter(t.dataset.v);
      _hsPage = 1;
      renderHousingList();
    }
  };
}
document.addEventListener("click", _hsBindFilter("hs-tabs",  v => _hsFilterCat = v));
document.addEventListener("click", _hsBindFilter("hs-dist",  v => _hsFilterDist = v));
document.addEventListener("click", _hsBindFilter("hs-rooms", v => _hsFilterRooms = v));
document.addEventListener("click", _hsBindFilter("hs-price", v => _hsFilterPrice = v));
document.addEventListener("click", _hsBindFilter("hs-sort",  v => _hsSort = v));

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
    if (g.id && g.id.indexOf("av-") === 0) updateAvatarPreview();
    else if (g.id === "opt-gender") syncAvatarToGender(e.target.dataset.v);
    else if (g.id === "opt-skill-cat") filterSkillsByCategory(e.target.dataset.v);
  });
});

function filterSkillsByCategory(cat){
  const wrap = document.getElementById("opt-skill");
  if (!wrap) return;
  wrap.dataset.cat = cat;
  const opts = wrap.querySelectorAll(".opt");
  let firstVisible = null;
  opts.forEach(b => {
    const match = b.dataset.cat === cat;
    b.hidden = !match;
    if (match && !firstVisible) firstVisible = b;
  });
  // 起手只能选一个；切类时如果之前选的属于另一类，就选中本类第一项
  const active = wrap.querySelector(".opt.active:not([hidden])");
  if (!active && firstVisible){
    opts.forEach(b => b.classList.remove("active"));
    firstVisible.classList.add("active");
  }
}
/* ---------- 头像自定（DiceBear avataaars） ---------- */
const AVATAR_BASE = "https://api.dicebear.com/9.x/avataaars/svg";
const AV_GROUP_IDS = [
  "av-skin","av-top","av-haircolor","av-beard",
  "av-acc","av-eyes","av-mouth","av-cloth","av-clothcolor"
];
const AV_GENDER_HAIR = {
  M: ["shortFlat","shortWaved","shortCurly","theCaesar","shortRound"],
  F: ["longButNotTooLong","straight01","straight02","bigHair","bob","curvy","miaWallace"],
  N: ["hat","hijab","noHair"]
};
function buildAvatarUrl(opts){
  const o = opts || getCurrentAvatarOpts();
  if (!o) return AVATAR_BASE + "?seed=Mo+Li";
  const p = new URLSearchParams();
  p.set("seed", o.seed || "Mo Li");
  if (o.skin)       p.set("skinColor", o.skin);
  if (o.top)        p.set("top", o.top);
  if (o.hairColor)  p.set("hairColor", o.hairColor);
  if (o.mouth)      p.set("mouth", o.mouth);
  if (o.eyes)       p.set("eyes", o.eyes);
  if (o.cloth)      p.set("clothing", o.cloth);
  if (o.clothColor) p.set("clothesColor", o.clothColor);
  if (o.acc && o.acc !== "none"){
    p.set("accessories", o.acc);
    p.set("accessoriesProbability", "100");
  } else {
    p.set("accessoriesProbability", "0");
  }
  if (o.beard && o.beard !== "none"){
    p.set("facialHair", o.beard);
    p.set("facialHairProbability", "100");
  } else {
    p.set("facialHairProbability", "0");
  }
  return AVATAR_BASE + "?" + p.toString();
}
function _getActiveOpt(groupId, fallback){
  const g = document.getElementById(groupId);
  if (!g) return fallback;
  const a = g.querySelector(".opt.active");
  return a ? a.dataset.v : fallback;
}
function _setActiveOpt(groupId, value){
  const g = document.getElementById(groupId);
  if (!g) return false;
  const target = g.querySelector(`.opt[data-v="${value}"]`);
  if (!target) return false;
  g.querySelectorAll(".opt").forEach(b => b.classList.remove("active"));
  target.classList.add("active");
  return true;
}
function getCurrentAvatarOpts(){
  const seedEl = document.getElementById("avatar-img");
  const seedAttr = seedEl && seedEl.dataset ? seedEl.dataset.seed : null;
  const nameEl = document.getElementById("char-en");
  const seed = seedAttr || (nameEl && nameEl.value) || "Mo Li";
  return {
    seed: seed,
    skin:       _getActiveOpt("av-skin",       "edb98a"),
    top:        _getActiveOpt("av-top",        "shortFlat"),
    hairColor:  _getActiveOpt("av-haircolor",  "2c1b18"),
    beard:      _getActiveOpt("av-beard",      "none"),
    acc:        _getActiveOpt("av-acc",        "none"),
    eyes:       _getActiveOpt("av-eyes",       "default"),
    mouth:      _getActiveOpt("av-mouth",      "default"),
    cloth:      _getActiveOpt("av-cloth",      "blazerAndShirt"),
    clothColor: _getActiveOpt("av-clothcolor", "262e33")
  };
}
function updateAvatarPreview(){
  const img = document.getElementById("avatar-img");
  if (!img) return;
  const opts = getCurrentAvatarOpts();
  img.dataset.seed = opts.seed;
  img.src = buildAvatarUrl(opts);
}
function syncAvatarToGender(gender){
  // 切换性别时挑一个匹配的发型；女性默认无胡须
  const g = gender || _getActiveOpt("opt-gender", "M");
  const currentTop = _getActiveOpt("av-top", null);
  const isMaleTop = AV_GENDER_HAIR.M.indexOf(currentTop) >= 0;
  const isFemaleTop = AV_GENDER_HAIR.F.indexOf(currentTop) >= 0;
  if (g === "F" && !isFemaleTop){
    _setActiveOpt("av-top", AV_GENDER_HAIR.F[0]);
    _setActiveOpt("av-beard", "none");
  } else if (g === "M" && !isMaleTop){
    _setActiveOpt("av-top", AV_GENDER_HAIR.M[0]);
  }
  if (g === "F") _setActiveOpt("av-beard", "none");
  updateAvatarPreview();
}
function randomizeAvatar(){
  const gender = _getActiveOpt("opt-gender", "M");
  const pickRand = (groupId) => {
    const g = document.getElementById(groupId);
    if (!g) return;
    const opts = g.querySelectorAll(".opt");
    if (!opts.length) return;
    const pick = opts[Math.floor(Math.random() * opts.length)];
    g.querySelectorAll(".opt").forEach(b => b.classList.remove("active"));
    pick.classList.add("active");
  };
  AV_GROUP_IDS.forEach(pickRand);
  // 用性别限制发型与胡须
  const tops = AV_GENDER_HAIR[gender] || AV_GENDER_HAIR.M;
  _setActiveOpt("av-top", tops[Math.floor(Math.random()*tops.length)]);
  if (gender === "F") _setActiveOpt("av-beard", "none");
  const img = document.getElementById("avatar-img");
  if (img) img.dataset.seed = "S-" + Math.random().toString(36).slice(2, 10);
  updateAvatarPreview();
}
document.addEventListener("DOMContentLoaded", () => {
  const nameEn = document.getElementById("char-en");
  if (nameEn) nameEn.addEventListener("input", updateAvatarPreview);
  updateAvatarPreview();
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
  S.player.skillCategory = getActive("opt-skill-cat") || "UC";
  const startingSkill = getActive("opt-skill") || (SKILL_CATALOG[S.player.skillCategory] || SKILL_CATALOG.UC)[0];
  S.player.skills = [startingSkill];
  S.player.skillProgress = 0;
  S.player.live = getActive("opt-live") || "share";
  S.player.extrovert = parseInt(get("char-ext","0"));
  S.player.decisive = parseInt(get("char-dec","0"));
  S.player.avatar = getCurrentAvatarOpts();

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
  const salEl = document.getElementById("ui-salary");
  if (salEl) salEl.textContent = (p.salary || 0).toLocaleString();
}

/* ---------- 左侧栏 ---------- */
function renderPlayerCard(){
  const el = document.getElementById("player-card");
  if (!el || !S || !S.player) return;
  const p = S.player;

  const genderMap   = { M:"男", F:"女", N:"不愿透露" };
  const eduMap      = { "985":"985 / 211 本科", normal:"普通本科", haigui:"海归硕士" };
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

  const emoji = p.gender === "F" ? "👩" : p.gender === "N" ? "🧑" : "👨";
  const avatarMarkup = p.avatar
    ? `<img class="pc-avatar-img" alt="avatar" src="${buildAvatarUrl(p.avatar)}">`
    : emoji;

  const skills = Array.isArray(p.skills) ? p.skills : [];
  const skillChips = skills.length
    ? skills.map(s => {
        const cat = skillCategoryOf(s);
        const cls = cat === "CC" ? "pc-skill pc-skill-cc"
                  : cat === "UC" ? "pc-skill pc-skill-uc"
                  : "pc-skill";
        const desc = SKILL_DESC[s] || "";
        const tipAttr = desc ? ` data-tip="${_slEscape(desc)}" title="${_slEscape(desc)}"` : "";
        return `<span class="${cls}"${tipAttr}>${_slEscape(s)}</span>`;
      }).join("")
    : `<span class="pc-skill pc-skill-empty">—</span>`;
  const skillProg = p.skillProgress || 0;
  const nextThresh = SKILL_UNLOCK_THRESHOLDS.find(t => t > skillProg);
  const skillHint = nextThresh
    ? `<span class="pc-skill-prog">SR ${skillProg} / ${nextThresh}</span>`
    : `<span class="pc-skill-prog">已满级</span>`;

  el.innerHTML = `
    <div class="pc-head">Engineer Profile</div>
    <div class="pc-body">
      <div class="pc-top">
        <div class="pc-avatar">${avatarMarkup}</div>
        <div class="pc-id">
          <div class="pc-name">${_slEscape(p.name)}<span class="pc-en">${_slEscape(p.enName || "")}</span></div>
          <div class="pc-grade"><span class="pc-grade-lbl">职级</span><b>${_slEscape(p.grade || "—")}</b></div>
        </div>
      </div>
      <dl class="pc-fields">
        <dt>性别</dt><dd>${genderMap[p.gender] || "—"}</dd>
        <dt>学历</dt><dd>${eduMap[p.edu] || "—"}</dd>
        <dt>籍贯</dt><dd>${hometownMap[p.hometown] || "—"}</dd>
        <dt>居住</dt><dd>${_slEscape(liveText(p))}</dd>
        <dt>座驾</dt><dd>${_slEscape(vehicleText(p))}</dd>
        <dt>感情</dt><dd class="${relClass}">${relText}</dd>
        <dt>月薪</dt><dd>¥ ${(p.salary || 0).toLocaleString()}</dd>
      </dl>
      <div class="pc-skills">
        <div class="pc-skills-head">
          <span class="pc-skills-lbl">Skills · ${_slEscape(p.skillCategory || "UC")}</span>
          ${skillHint}
        </div>
        <div class="pc-skills-list">${skillChips}</div>
      </div>
    </div>
  `;
}

function renderSidebar(){
  renderPlayerCard();
  document.getElementById("ui-site").textContent = S.site.headcount;
  document.getElementById("ui-legend").textContent = S.player.legend;
  const fatherBadge = document.getElementById("ui-family-badge");
  const fatherVal = S.player.father;
  if (fatherBadge){
    if (fatherVal == null || fatherVal === 0){
      fatherBadge.hidden = true;
    } else {
      fatherBadge.hidden = false;
      document.getElementById("ui-father").textContent = fatherVal;
    }
  }

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

  renderNewsBox();
}

function renderNewsBox(){
  const list = document.getElementById("news-list");
  const monthEl = document.getElementById("news-month");
  if (!list || typeof getNewsForMonth !== "function") return;
  const yearData = CONTENT.years[S.yearIdx];
  const yr = yearData?.year || 2018;
  const ev = yearData?.events?.[S.eventIdx];
  const mo = ev?.month || 1;
  if (monthEl) monthEl.textContent = `${yr}-${String(mo).padStart(2, "0")}`;
  const items = getNewsForMonth(yr, mo);
  list.innerHTML = items.map(n => {
    const scope = n.scope ? `<span class="news-tag news-tag-${n.scope}">${_slEscape(n.scope)}</span>` : "";
    return `<li><a href="${n.u}" target="_blank" rel="noopener noreferrer">${scope}<span class="news-title">${_slEscape(n.t)}</span></a></li>`;
  }).join("");
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
  let ev = year.events[S.eventIdx];
  if (!ev) return endOfYear();

  // 跳过：已买房则跳过 requireNoHouse 的剧情
  while (ev && ev.requireNoHouse && getPrimaryHouse()){
    const ph = getPrimaryHouse();
    S.log.push(`（已自购 ${ph.name} · 跳过 "${ev.title}"）`);
    S.eventIdx++;
    ev = year.events[S.eventIdx];
  }
  if (!ev) return endOfYear();

  // 每月结算（发工资、扣房贷、1 月调薪）
  if (ev.month){
    monthlyTick(year.year, ev.month);
    renderTopBar();
  }

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
  if (score > 0) maybeUnlockSkill(score);

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
  // 选项可触发系统动作（如直接跳楼市）
  if (ch.action === "openHousing"){
    autoSave();
    setTimeout(() => openHousing(), 200);
    return;
  }
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
      const oldGrade = S.player.grade;
      S.player.grade = year.review.grade;
      if (wantsPromotion) applyPromotionRaise(oldGrade, year.review.grade);
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
    ${(p.father == null || p.father === 0) ? "" : `<div>家庭分<b>${p.father}</b></div>`}
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
    // 老存档兼容：补齐工资 / 房产字段
    if (S.player){
      if (typeof S.player.salary !== "number") S.player.salary = 10000;
      if (typeof S.player.lastTickKey === "undefined") S.player.lastTickKey = null;
      if (!Array.isArray(S.player.houses)) S.player.houses = [];
      if (!Array.isArray(S.player.vehicles)) S.player.vehicles = [];
      // 旧存档迁移：单套 house -> houses[]
      if (S.player.house && typeof S.player.house === "object"){
        const old = S.player.house;
        if (!old.uid) old.uid = "h" + Date.now().toString(36) + "0";
        if (!old.renovation) old.renovation = { level: 0, year: null, cost: 0 };
        old.isPrimary = true;
        if (!S.player.houses.length) S.player.houses.push(old);
        delete S.player.house;
      }
      // 保证至少有一套自住
      if (S.player.houses.length && !S.player.houses.some(h => h.isPrimary)){
        S.player.houses[0].isPrimary = true;
      }
      if (S.player.vehicles.length && !S.player.vehicles.some(v => v.isActive)){
        S.player.vehicles[0].isActive = true;
      }
    }
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
