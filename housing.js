/* ============================================================
 *  housing.js · 大连 30 个楼盘 + 房价时间曲线 + 月供计算
 *  价格基准：2018 年元/㎡；按年系数浮动
 * ============================================================ */

/* ---------- 年份房价系数（贴近大连真实走势）---------- */
const HOUSE_YEAR_MULT = {
  2018:1.00, 2019:1.06, 2020:1.10, 2021:1.20, 2022:1.12,
  2023:0.98, 2024:0.85, 2025:0.78, 2026:0.75, 2027:0.76,
  2028:0.78, 2029:0.80, 2030:0.82, 2031:0.84, 2032:0.85,
  2033:0.86, 2034:0.87, 2035:0.88, 2036:0.90, 2037:0.92, 2038:0.93
};
function houseYearMult(year){
  if (HOUSE_YEAR_MULT[year]) return HOUSE_YEAR_MULT[year];
  if (year < 2018) return 0.85;
  return 0.95;
}

/* ---------- 30 个楼盘 ---------- */
const HOUSING_CATALOG = [
  // ===== 新房 15 项 =====
  {id:"n01", category:"new", developer:"万达", name:"万达华府(中山店)", district:"中山区", address:"解放路 · 解放广场旁",
   area:95, rooms:"2室1厅1卫", floor:"高层 22 层 / 共 28 层", unitPrice:32000,
   pros:"地段顶级 · 学区强 · 配套成熟", cons:"周边老城拥堵 · 户型偏紧凑"},
  {id:"n02", category:"new", developer:"万科", name:"万科城", district:"高新园区", address:"龙白社区 · 凌工路",
   area:110, rooms:"3室2厅1卫", floor:"高层 18 层 / 共 26 层", unitPrice:26000,
   pros:"软件园上下班通勤近 · 园区物业口碑好", cons:"靠近高架轻微噪音"},
  {id:"n03", category:"new", developer:"保利", name:"保利公园 2010", district:"沙河口区", address:"锦华路 · 锦华公园对面",
   area:88, rooms:"2室1厅1卫", floor:"小高层 10 层 / 共 17 层", unitPrice:24000,
   pros:"公园第一排 · 通风采光好", cons:"户型老 · 户均车位不足"},
  {id:"n04", category:"new", developer:"中海", name:"中海寰宇天下", district:"中山区", address:"港湾广场 · 海边",
   area:130, rooms:"3室2厅2卫", floor:"高层 28 层 · 全海景", unitPrice:38000,
   pros:"一线海景 · 顶级豪宅圈层", cons:"总价高 · 物业费 8 元/㎡"},
  {id:"n05", category:"new", developer:"龙湖", name:"龙湖·原山", district:"甘井子区", address:"泉水 · 西北路",
   area:95, rooms:"2室2厅1卫", floor:"高层 16 层 / 共 26 层", unitPrice:17000,
   pros:"龙湖物业 · 园区景观豪", cons:"地铁要走 15 分钟"},
  {id:"n06", category:"new", developer:"华润", name:"华润·中央公园", district:"高新园区", address:"凌水 · 黄浦路",
   area:120, rooms:"3室2厅2卫", floor:"高层 25 层 / 共 32 层", unitPrice:28000,
   pros:"高新园核心 · 自带商业街", cons:"梯户比 2 梯 8 户偏挤"},
  {id:"n07", category:"new", developer:"融创", name:"融创·星海湾壹号", district:"沙河口区", address:"星海湾 · 沿海公路",
   area:145, rooms:"3室2厅2卫", floor:"高层 32 层 · 一线海景", unitPrice:45000,
   pros:"星海湾顶豪 · 圈层私密", cons:"总价 600w+ · 部分朝向遮挡"},
  {id:"n08", category:"new", developer:"招商", name:"招商·虹湾", district:"金普新区", address:"金石滩 · 虹海路",
   area:89, rooms:"2室1厅1卫", floor:"小高层 8 层 / 共 16 层", unitPrice:13000,
   pros:"海滨度假风 · 总价友好", cons:"距离市内远 · 通勤不便"},
  {id:"n09", category:"new", developer:"远洋", name:"远洋·荣域", district:"甘井子区", address:"椒金山 · 椒华路",
   area:105, rooms:"3室1厅2卫", floor:"高层 20 层 / 共 26 层", unitPrice:16000,
   pros:"户型方正 · 性价比突出", cons:"周边商业弱 · 学区一般"},
  {id:"n10", category:"new", developer:"金地", name:"金地·艺华年", district:"沙河口区", address:"黑石礁 · 学府街",
   area:92, rooms:"2室1厅1卫", floor:"高层 18 层 / 共 25 层", unitPrice:28000,
   pros:"理工大 · 海事大学区 · 沿地铁 1 号线", cons:"户型偏小 · 储物空间不足"},
  {id:"n11", category:"new", developer:"雅居乐", name:"雅居乐·花园", district:"金普新区", address:"开发区 · 站前街",
   area:78, rooms:"2室1厅1卫", floor:"多层 6 层顶层", unitPrice:12000,
   pros:"开发区商圈核心 · 总价低", cons:"开发区房价滞涨"},
  {id:"n12", category:"new", developer:"亿达", name:"亿达·春田", district:"高新园区", address:"软件园 · 汇贤园路",
   area:100, rooms:"3室1厅2卫", floor:"小高层 11 层 / 共 18 层", unitPrice:23000,
   pros:"软件园中心 · 步行通勤", cons:"密度高 · 周末停车难"},
  {id:"n13", category:"new", developer:"大华", name:"大华·锦绣华城", district:"甘井子区", address:"周水子 · 兴和街",
   area:85, rooms:"2室1厅1卫", floor:"高层 19 层 / 共 28 层", unitPrice:13000,
   pros:"轻轨 2 号线起点 · 总价友好", cons:"距机场近偶有噪音"},
  {id:"n14", category:"new", developer:"万科", name:"万科·金域东郡", district:"金普新区", address:"金石滩 · 度假区",
   area:95, rooms:"2室2厅1卫", floor:"小高层 12 层 / 共 18 层", unitPrice:14000,
   pros:"度假区 · 园林漂亮", cons:"市区通勤 1 小时"},
  {id:"n15", category:"new", developer:"龙湖", name:"龙湖·滟澜山", district:"高新园区", address:"凌水 · 河口湾",
   area:180, rooms:"4室2厅3卫", floor:"联排别墅 上下 3 层", unitPrice:32000,
   pros:"低密别墅 · 自带院子 · 顶级物业", cons:"总价高 · 上下三层老人不便"},

  // ===== 二手房 15 项 =====
  {id:"s01", category:"second", developer:"自建多层", name:"桂林街 90 年代老多层", district:"中山区", address:"桂林街 · 老核心",
   area:65, rooms:"2室1厅1卫", floor:"多层 6 层顶楼 / 共 6 层", unitPrice:22000,
   pros:"15 中 + 7 中学区双学位 · 投资属性强", cons:"老楼无电梯 · 顶层夏热"},
  {id:"s02", category:"second", developer:"民政系统房改", name:"民生街 学区房", district:"中山区", address:"民生街 · 八一路",
   area:70, rooms:"2室1厅1卫", floor:"板楼 4 层 / 共 6 层", unitPrice:30000,
   pros:"中山实验小学顶级学区", cons:"老旧小区 · 物业弱"},
  {id:"s03", category:"second", developer:"早期商品房", name:"友好广场电梯房", district:"中山区", address:"友好广场 · 中山路",
   area:110, rooms:"3室1厅2卫", floor:"高层 18 层 / 共 30 层", unitPrice:35000,
   pros:"广场旁 · 步行商圈 · 地铁双线换乘", cons:"楼龄 15 年 · 入户大堂老旧"},
  {id:"s04", category:"second", developer:"早期板楼", name:"香炉礁板楼", district:"西岗区", address:"香炉礁 · 站前广场",
   area:75, rooms:"2室1厅1卫", floor:"板楼 5 层 / 共 6 层", unitPrice:20000,
   pros:"近火车站 · 出行方便", cons:"周边脏乱 · 停车困难"},
  {id:"s05", category:"second", developer:"铁路系统宿舍", name:"北京街老铁路宿舍", district:"西岗区", address:"北京街 · 铁路医院旁",
   area:60, rooms:"1室1厅1卫", floor:"老多层 3 层 / 共 5 层", unitPrice:16000,
   pros:"总价低 · 适合单身/投资", cons:"户型小 · 90 年代砖混"},
  {id:"s06", category:"second", developer:"早期豪宅", name:"星海广场海景大平层", district:"沙河口区", address:"星海广场 · 中央大道",
   area:158, rooms:"3室2厅2卫", floor:"高层 22 层 / 共 32 层 一线海景", unitPrice:42000,
   pros:"星海一线 · 楼下中央大道", cons:"小区老化 · 物业差"},
  {id:"s07", category:"second", developer:"次新商品房", name:"西安路商圈次新", district:"沙河口区", address:"西安路 · 兴工街",
   area:95, rooms:"2室2厅1卫", floor:"高层 12 层 / 共 22 层", unitPrice:25000,
   pros:"罗斯福商圈 · 双地铁 · 楼龄 7 年", cons:"高峰期堵车 · 噪音偏大"},
  {id:"s08", category:"second", developer:"早期商品房", name:"春柳学区房", district:"沙河口区", address:"春柳 · 长兴市场旁",
   area:80, rooms:"2室1厅1卫", floor:"多层 6 层 / 共 6 层", unitPrice:18000,
   pros:"春田小学学区 · 邻里成熟", cons:"楼龄久 · 厨房卫生间需翻新"},
  {id:"s09", category:"second", developer:"老商品房", name:"周水子机场附近", district:"甘井子区", address:"周水子 · 机场南路",
   area:70, rooms:"2室1厅1卫", floor:"多层 7 层 / 共 7 层顶", unitPrice:13000,
   pros:"地铁 2 号线 · 总价超低", cons:"机场起降噪音 · 配套弱"},
  {id:"s10", category:"second", developer:"次新商品房", name:"椒金山山景房", district:"甘井子区", address:"椒金山 · 椒华路",
   area:88, rooms:"2室1厅1卫", floor:"高层 18 层 / 共 26 层", unitPrice:15000,
   pros:"山景视野好 · 楼龄新", cons:"出行靠公交 · 商业薄弱"},
  {id:"s11", category:"second", developer:"次新商品房", name:"山地金海岸海景房", district:"甘井子区", address:"凌水 · 山地金海岸",
   area:105, rooms:"3室1厅1卫", floor:"高层 20 层 / 共 28 层 一线海景", unitPrice:22000,
   pros:"无敌海景 · 紧邻金沙滩", cons:"冬季湿冷 · 海风腐蚀外墙"},
  {id:"s12", category:"second", developer:"商品房", name:"七贤岭软件园", district:"高新园区", address:"七贤岭 · 凌工路",
   area:90, rooms:"2室1厅1卫", floor:"高层 15 层 / 共 22 层", unitPrice:24000,
   pros:"软件园通勤 5 分钟", cons:"楼龄 10 年 · 户型一般"},
  {id:"s13", category:"second", developer:"商品房", name:"龙王塘海边度假", district:"高新园区", address:"龙王塘 · 滨海西路",
   area:95, rooms:"2室1厅1卫", floor:"多层 6 层 / 共 6 层", unitPrice:16000,
   pros:"海边 200 米 · 春夏度假佳", cons:"距市内远 · 冬季冷清"},
  {id:"s14", category:"second", developer:"早期商品房", name:"友谊街道老开发区", district:"金普新区", address:"友谊街道 · 黄海街",
   area:85, rooms:"2室1厅1卫", floor:"多层 8 层 / 共 8 层", unitPrice:13000,
   pros:"开发区最早商品房 · 邻里熟悉", cons:"开发区房价滞涨严重"},
  {id:"s15", category:"second", developer:"地方多层", name:"旅顺口中心多层", district:"旅顺口区", address:"旅顺中心 · 太阳沟",
   area:100, rooms:"3室1厅1卫", floor:"多层 6 层 / 共 6 层", unitPrice:10000,
   pros:"价格最便宜 · 环境清幽", cons:"远离市区 · 通勤 1.5 小时"}
];

/* ---------- 取当前价格 / 总价 ---------- */
function housePriceTotal(prop, year){
  const mult = houseYearMult(year);
  return Math.round(prop.area * prop.unitPrice * mult);   // 元
}
function houseUnitPriceNow(prop, year){
  return Math.round(prop.unitPrice * houseYearMult(year)); // 元/㎡
}

/* ---------- 月供：等额本息 ---------- */
function mortgageMonthlyEqual(principal, annualRate, months){
  if (months <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}
/* ---------- 月供：等额本金 · 给定月（i 从 1 开始）---------- */
function mortgageMonthlyPrincipalFirst(principal, annualRate, months){
  if (months <= 0) return 0;
  const r = annualRate / 12;
  return principal / months + principal * r;
}
function mortgageMonthlyPrincipalAt(principal, annualRate, months, i){
  if (months <= 0 || i < 1 || i > months) return 0;
  const r = annualRate / 12;
  const remaining = principal - (i - 1) * (principal / months);
  return principal / months + remaining * r;
}
function mortgageTotalInterest(principal, annualRate, months, type){
  if (months <= 0) return 0;
  const r = annualRate / 12;
  if (type === "principal"){
    let total = 0;
    const monthlyPrincipal = principal / months;
    for (let i = 1; i <= months; i++){
      const remaining = principal - (i - 1) * monthlyPrincipal;
      total += remaining * r;
    }
    return total;
  } else {
    // equal
    const m = mortgageMonthlyEqual(principal, annualRate, months);
    return m * months - principal;
  }
}

function districtList(){
  const s = new Set();
  HOUSING_CATALOG.forEach(p => s.add(p.district));
  return Array.from(s);
}

/* ============================================================
 *  程序化补充 470 个楼盘 —— 凑齐 500 总数
 *  覆盖大连市全域：含庄河、瓦房店、长海、普兰店等远郊
 *  总价跨度：约 18 万（远郊老破小）至 1500 万（中山区海景豪宅）
 * ============================================================ */
function _hsRng(seed){
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return ((s >>> 16) & 0x7fff) / 0x7fff;
  };
}

const DISTRICT_TIERS = {
  "中山区":   {base:[27000, 45000], areas:["解放广场","人民路","中山广场","友好广场","港湾广场","民生街","桂林街","八一路","三八广场","青泥洼桥","五一路","二七广场","老虎滩","棒棰岛","虎滩湾"]},
  "西岗区":   {base:[16000, 26000], areas:["香炉礁","站前","北京街","一二九街","长江路","八七街","白云山","胜利桥","八一路西段"]},
  "沙河口区": {base:[19000, 34000], areas:["星海广场","黑石礁","西安路","春柳","兴工街","春田","罗斯福","锦华","数码广场","马栏","南沙街","南沙公园","马栏河"]},
  "甘井子区": {base:[10000, 19000], areas:["周水子","椒金山","山地","大连湾","泡崖","革镇堡","凌水","红旗","辛寨子","金家街","南关岭","华南广场","机场","泉水"]},
  "高新园区": {base:[17000, 29000], areas:["凌水","龙白","七贤岭","软件园","黄浦路","河口湾","凌工路","旅顺南路","小平岛"]},
  "金普新区": {base:[8000, 14500],  areas:["开发区","金石滩","友谊街道","站前街","海湾","西海岸","大刘家","满家滩","湾里","金渤海岸","马桥子","湾里街道","得胜","湾家"]},
  "旅顺口区": {base:[5800, 11000],  areas:["旅顺中心","太阳沟","龙王塘","双岛湾","水师营","铁山","江西","土城子","旅顺新港"]},
  "庄河市":   {base:[4200, 7500],   areas:["庄河老城","滨海新区","昌盛","新华","城关","海洋","青堆","蓉花山"]},
  "瓦房店市": {base:[4000, 7000],   areas:["瓦房店","复州城","岭东","共济","岗店","新华","李官","三台"]},
  "长海县":   {base:[5000, 9000],   areas:["长海岛","大长山岛","小长山岛","广鹿岛","獐子岛"]},
  "普兰店区": {base:[5500, 8500],   areas:["普兰店中心","皮口","双塔","太平岭","沙包"]}
};

const DEV_POOL = [
  "万达","万科","保利","中海","龙湖","华润","融创","招商","远洋","金地","雅居乐","亿达","大华",
  "绿地","恒大","碧桂园","阳光城","旭辉","中铁建","富力","建业","美的","蓝光","中骏","新城",
  "时代中国","卓越","中粮","金科","红星地产","越秀","中梁","大连地产","海昌","中航","中信","一方城","海德","棒棰岛地产","富丽华","宝胜","金洲","海创"
];
const DEV_OLD_POOL = [
  "自建多层","房改房","早期商品房","单位宿舍","铁路宿舍","海军宿舍","港务局宿舍","大化宿舍","大重宿舍","海洋渔业宿舍","机车厂宿舍","内燃机车厂宿舍","船舶厂宿舍","水产学院宿舍","工业大学宿舍","邮政宿舍","电厂宿舍","税务局宿舍"
];

const NAME_PREFIX = ["金","海","紫","锦","御","翰","龙","凤","星","明","新","盛","春","秋","蓝","碧","江","山","祥","泰","盈","和","康","乐","华","盛","贵","元","裕","昌","荣","枫","梧","桐","榕"];
const NAME_SUFFIX = ["城","府","苑","华庭","公馆","国际","中心","广场","一品","雅居","名邸","上院","学府","海景","阳光","春天","港湾","花园","御园","名都","御景","北郡","东郡","南郡","锦绣","紫金","金海岸","蓝湾","山水","御湖","御府","翰林苑","第七区","时代广场","熙园","半岛","新天地","ONE","印象","壹号院","TOWN","SOHO"];

const PROS_NEW = ["楼龄新 · 户型方正","物业服务好","园区景观豪","近地铁","学区潜力大","商业配套全","低密度","南北通透","赠送面积大","双阳台","次卫干湿分离","入户大堂气派","车位充足","小区智能化","健身房+泳池","下沉式庭院","幼儿园配套","集中供暖+地暖","门禁严格"];
const PROS_OLD = ["学区强","双地铁邻近","商圈成熟","邻里和睦","总价低","出租回报高","老破小投资好脱手","距菜市场近","距医院近","交通便利","附近公园","二手过户简单"];
const PROS_HAI = ["一线海景","推窗见海","看日出/日落","海风通透","步行 5 分钟到海"];
const PROS_LUX = ["顶级豪宅圈层","私家电梯入户","花园景观","高端物业","知名建筑师作品","会所配套"];

const CONS_NEW = ["地铁要走 15 分钟","物业费偏高","靠近高架轻微噪音","梯户比偏挤","小区在建未交付","出口规划差","部分朝向遮挡","总价偏高","公摊偏大","样板间和实际有差距"];
const CONS_OLD = ["老楼无电梯","顶层夏热冬冷","管道老化","停车困难","小区物业弱","外立面陈旧","卫生间需翻新","隔音差","老社区无地下停车","楼道脏乱","原户主未结清水电"];
const CONS_FAR = ["距市内远","通勤 1 小时+","商业薄弱","学区一般","冬季冷清","公交班次少"];

const ADDR_SUFFIX = ["主街","南路","北街","学府路","新区","商业街","西路","东路","海滨路","公园北","老街","站前路","环路"];

function _pick(rng, arr){ return arr[Math.floor(rng() * arr.length)]; }
function _pickN(rng, arr, n){
  const cp = arr.slice();
  const out = [];
  for (let i = 0; i < n && cp.length; i++){
    const idx = Math.floor(rng() * cp.length);
    out.push(cp.splice(idx, 1)[0]);
  }
  return out;
}

function _genHousingFor(district, info, count, category, rng, idxBase){
  const out = [];
  for (let i = 0; i < count; i++){
    const area_name = _pick(rng, info.areas);
    const isOld = category === "second" && rng() < 0.45;
    const dev = isOld ? _pick(rng, DEV_OLD_POOL) : _pick(rng, DEV_POOL);
    const name = isOld
      ? `${area_name}${_pick(rng, ["老多层","板楼","小区","宿舍","老房","回迁房"])}`
      : `${_pick(rng, NAME_PREFIX)}${_pick(rng, NAME_SUFFIX)}`;

    // 决定房型/面积
    const tierRand = rng();
    let area, rooms;
    if (tierRand < 0.10){ area = 32 + Math.round(rng()*20); rooms = "1室1厅1卫"; }
    else if (tierRand < 0.30){ area = 55 + Math.round(rng()*20); rooms = "2室1厅1卫"; }
    else if (tierRand < 0.55){ area = 75 + Math.round(rng()*25); rooms = "2室2厅1卫"; }
    else if (tierRand < 0.78){ area = 100 + Math.round(rng()*30); rooms = "3室2厅1卫"; }
    else if (tierRand < 0.92){ area = 130 + Math.round(rng()*40); rooms = "3室2厅2卫"; }
    else if (tierRand < 0.98){ area = 170 + Math.round(rng()*50); rooms = "4室2厅2卫"; }
    else { area = 220 + Math.round(rng()*140); rooms = "联排别墅 上下 3 层"; }

    // 单价
    const [lo, hi] = info.base;
    let unit = Math.round(lo + (hi - lo) * rng());
    const isLux = rng() < 0.07;
    const isSea = rng() < 0.13 && ["中山区","沙河口区","甘井子区","金普新区","旅顺口区","长海县"].indexOf(district) >= 0;
    if (isLux) unit = Math.round(unit * (1.35 + rng() * 0.55));
    if (isSea) unit = Math.round(unit * (1.18 + rng() * 0.38));
    if (isOld) unit = Math.round(unit * (0.55 + rng() * 0.25));
    if (unit < 3800) unit = 3800;

    // 楼层
    let floor;
    const fRoll = rng();
    if (isOld){
      const tot = 5 + Math.floor(rng() * 3);
      floor = `多层 ${1 + Math.floor(rng()*tot)} 层 / 共 ${tot} 层`;
    } else if (fRoll < 0.3){
      const tot = 11 + Math.floor(rng() * 7);
      floor = `小高层 ${1 + Math.floor(rng()*tot)} 层 / 共 ${tot} 层`;
    } else {
      const tot = 18 + Math.floor(rng() * 16);
      floor = `高层 ${1 + Math.floor(rng()*tot)} 层 / 共 ${tot} 层`;
    }

    let prosPool = (isOld ? PROS_OLD : PROS_NEW).slice();
    if (isSea) prosPool = prosPool.concat(PROS_HAI);
    if (isLux) prosPool = prosPool.concat(PROS_LUX);
    let consPool = (isOld ? CONS_OLD : CONS_NEW).slice();
    if (["金普新区","旅顺口区","庄河市","瓦房店市","长海县","普兰店区"].indexOf(district) >= 0){
      consPool = consPool.concat(CONS_FAR);
    }
    const pros = _pickN(rng, prosPool, 2).join(" · ");
    const cons = _pickN(rng, consPool, 2).join(" · ");

    const id = `g${idxBase + i}`;
    out.push({
      id,
      category,
      developer: dev,
      name: isOld ? name : `${dev}·${name}`,
      district,
      address: `${area_name} · ${_pick(rng, ADDR_SUFFIX)}`,
      area, rooms, floor, unitPrice: unit,
      pros, cons
    });
  }
  return out;
}

function _buildHousingCatalog(){
  const rng = _hsRng(20240520);
  const allocation = {
    "中山区": 50, "西岗区": 35, "沙河口区": 60, "甘井子区": 80, "高新园区": 55,
    "金普新区": 80, "旅顺口区": 35, "庄河市": 25, "瓦房店市": 25, "长海县": 10, "普兰店区": 15
  };
  let idx = 1000;
  Object.keys(allocation).forEach(dist => {
    const info = DISTRICT_TIERS[dist];
    if (!info) return;
    const total = allocation[dist];
    const secondCount = Math.round(total * 0.55);
    const newCount = total - secondCount;
    const gen1 = _genHousingFor(dist, info, newCount, "new", rng, idx);
    idx += gen1.length;
    const gen2 = _genHousingFor(dist, info, secondCount, "second", rng, idx);
    idx += gen2.length;
    HOUSING_CATALOG.push.apply(HOUSING_CATALOG, gen1);
    HOUSING_CATALOG.push.apply(HOUSING_CATALOG, gen2);
  });
}
_buildHousingCatalog();

/* ---------- 房型归类（用于筛选） ---------- */
function houseRoomBucket(prop){
  const r = (prop && prop.rooms) || "";
  if (r.indexOf("别墅") >= 0) return "villa";
  const m = r.match(/^(\d)室/);
  if (!m) return "other";
  const n = parseInt(m[1], 10);
  if (n <= 1) return "1";
  if (n === 2) return "2";
  if (n === 3) return "3";
  return "4+";
}
/* ---------- 总价区间归类 ---------- */
function housePriceBucket(prop, year){
  const wan = housePriceTotal(prop, year) / 10000;
  if (wan < 50)  return "<50";
  if (wan < 150) return "50-150";
  if (wan < 300) return "150-300";
  if (wan < 600) return "300-600";
  return "600+";
}
